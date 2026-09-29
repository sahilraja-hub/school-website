import { admissionRepository } from '../repositories/admissionRepository';
import { admissionAuditRepository } from '../repositories/admissionAuditRepository';
import { admissionDocumentRepository, StoredAdmissionDocument } from '../repositories/admissionDocumentRepository';
import { schoolActorsRepository } from '../repositories/schoolActorsRepository';
import { userRepository } from '../repositories/userRepository';
import { NotFoundError, ValidationError, AuthorizationError, ConflictError } from '../errors';
import {
  AdmissionApplicationInput,
  AdmissionDraftInput,
  AdmissionStatusUpdateInput,
  AdmissionConvertToStudentInput,
  FileUploadInput,
} from '@school/shared';
import { ResponseMappers } from '../types/dtos';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

class AdmissionService {
  /**
   * Create an initial draft application
   */
  public async createDraft(data: AdmissionDraftInput) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const applicationNumber = `ADM-2026-${randomDigits}`;
    const trackingToken = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const application = await admissionRepository.create({
      ...data,
      applicationNumber,
      trackingToken,
      status: 'DRAFT',
    });

    admissionAuditRepository.logAction({
      applicationId: application._id?.toString() || application.id,
      applicationNumber: application.applicationNumber,
      action: 'DRAFT_CREATED',
      performedBy: {
        id: 'public-applicant',
        name: data.parentName || data.studentFirstName || 'Applicant',
        role: 'APPLICANT',
        email: data.parentEmail || 'applicant@oakridge.edu',
      },
      details: { gradeApplyingFor: data.gradeApplyingFor },
    });

    return {
      applicationNumber: application.applicationNumber,
      trackingToken: application.trackingToken,
      status: application.status,
      application: ResponseMappers.toAdmissionDto(application),
    };
  }

  /**
   * Update an existing draft application
   */
  public async updateDraft(
    applicationNumber: string,
    data: AdmissionDraftInput,
    trackingToken?: string
  ) {
    const application = await admissionRepository.findByApplicationNumber(applicationNumber);
    if (!application) {
      throw new NotFoundError(`No admission application found with reference number '${applicationNumber}'.`);
    }

    if (trackingToken && application.trackingToken !== trackingToken) {
      throw new AuthorizationError('Invalid tracking token for this application draft.');
    }

    if (application.status !== 'DRAFT' && application.status !== 'CORRECTION_REQUESTED') {
      throw new ConflictError(
        `Cannot edit application in '${application.status}' status as a draft.`
      );
    }

    const updated = await admissionRepository.updateById(
      application._id?.toString() || application.id,
      { ...data }
    );

    return ResponseMappers.toAdmissionDto(updated);
  }

  /**
   * Submit complete application (either new or converting existing draft)
   */
  public async submitApplication(
    data: AdmissionApplicationInput & { applicationNumber?: string },
    trackingToken?: string
  ) {
    let application: any;

    if (data.applicationNumber) {
      const existing = await admissionRepository.findByApplicationNumber(data.applicationNumber);
      if (existing) {
        if (trackingToken && existing.trackingToken !== trackingToken) {
          throw new AuthorizationError('Invalid tracking token for this application submission.');
        }

        const isResubmission = existing.status === 'CORRECTION_REQUESTED';

        application = await admissionRepository.updateById(
          existing._id?.toString() || existing.id,
          {
            ...data,
            status: 'SUBMITTED',
            submittedAt: new Date(),
            correctionRequest: isResubmission && existing.correctionRequest
              ? { ...existing.correctionRequest, resolvedAt: new Date().toISOString() }
              : existing.correctionRequest,
          }
        );

        admissionAuditRepository.logAction({
          applicationId: application._id?.toString() || application.id,
          applicationNumber: application.applicationNumber,
          action: isResubmission ? 'APPLICATION_RESUBMITTED' : 'APPLICATION_SUBMITTED',
          performedBy: {
            id: 'public-applicant',
            name: data.parentName,
            role: 'APPLICANT',
            email: data.parentEmail,
          },
          details: { gradeApplyingFor: data.gradeApplyingFor },
        });

        return {
          applicationNumber: application.applicationNumber,
          trackingToken: application.trackingToken,
          status: application.status,
          submittedAt: application.submittedAt || application.createdAt,
          studentName: `${application.studentFirstName} ${application.studentLastName}`,
          gradeApplyingFor: application.gradeApplyingFor,
        };
      }
    }

    // New Submission
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const applicationNumber = `ADM-2026-${randomDigits}`;
    const generatedToken = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    application = await admissionRepository.create({
      ...data,
      applicationNumber,
      trackingToken: generatedToken,
      status: 'SUBMITTED',
      submittedAt: new Date(),
    });

    admissionAuditRepository.logAction({
      applicationId: application._id?.toString() || application.id,
      applicationNumber: application.applicationNumber,
      action: 'APPLICATION_SUBMITTED',
      performedBy: {
        id: 'public-applicant',
        name: data.parentName,
        role: 'APPLICANT',
        email: data.parentEmail,
      },
      details: { gradeApplyingFor: data.gradeApplyingFor },
    });

    return {
      applicationNumber: application.applicationNumber,
      trackingToken: application.trackingToken,
      status: application.status,
      submittedAt: application.submittedAt || application.createdAt,
      studentName: `${application.studentFirstName} ${application.studentLastName}`,
      gradeApplyingFor: application.gradeApplyingFor,
    };
  }

  /**
   * Track application progress for public applicant
   */
  public async trackApplication(applicationNumber: string, trackingToken?: string, authUser?: any) {
    const application = await admissionRepository.findByApplicationNumber(applicationNumber);
    if (!application) {
      throw new NotFoundError(`No admission application found with reference number '${applicationNumber}'.`);
    }

    const isAuthorized =
      (authUser && ['ADMIN', 'SUPER_ADMIN'].includes(authUser.role)) ||
      (trackingToken && application.trackingToken === trackingToken);

    return {
      applicationNumber: application.applicationNumber,
      studentName: `${application.studentFirstName} ${application.studentLastName}`,
      gradeApplyingFor: application.gradeApplyingFor,
      academicYear: application.academicYear || '2026-2027',
      status: application.status,
      submittedAt: application.submittedAt || application.createdAt,
      updatedAt: application.updatedAt,
      notes: application.notes,
      correctionRequest: application.correctionRequest,
      documents: isAuthorized ? application.documents : undefined,
      enrolledStudentId: application.enrolledStudentId,
    };
  }

  /**
   * Get single application by ID (Admin)
   */
  public async getApplicationById(id: string) {
    const application = await admissionRepository.findById(id);
    if (!application) {
      throw new NotFoundError(`Admission application with ID '${id}' not found.`);
    }
    return ResponseMappers.toAdmissionDto(application);
  }

  /**
   * List applications with filter & search (Admin)
   */
  public async getApplications(filter: {
    status?: string;
    grade?: string;
    search?: string;
    academicYear?: string;
  }) {
    const list = await admissionRepository.findAll({
      status: filter.status,
      gradeApplyingFor: filter.grade,
      search: filter.search,
      academicYear: filter.academicYear,
    });

    return list.map((item) => ResponseMappers.toAdmissionDto(item));
  }

  /**
   * Update status (e.g. UNDER_REVIEW, APPROVED, REJECTED, CORRECTION_REQUESTED)
   */
  public async updateStatus(
    id: string,
    input: AdmissionStatusUpdateInput,
    adminUser: { id: string; firstName: string; lastName: string; role: string; email: string }
  ) {
    const existing = await admissionRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Admission application with ID '${id}' not found.`);
    }

    const previousStatus = existing.status;
    const { status, notes, correctionReason, fieldsToCorrect } = input;

    let updated: any;
    if (status === 'CORRECTION_REQUESTED') {
      updated = await admissionRepository.requestCorrection(
        id,
        correctionReason || notes || 'Please review and correct requested application fields.',
        fieldsToCorrect || ['documents'],
        { id: adminUser.id, name: `${adminUser.firstName} ${adminUser.lastName}`.trim() }
      );
    } else {
      updated = await admissionRepository.updateById(id, {
        status,
        ...(notes !== undefined && { notes }),
      });
    }

    if (!updated) {
      throw new NotFoundError(`Admission application with ID '${id}' not found.`);
    }

    admissionAuditRepository.logAction({
      applicationId: updated._id?.toString() || updated.id,
      applicationNumber: updated.applicationNumber,
      action: status === 'APPROVED' ? 'APPROVED' : status === 'REJECTED' ? 'REJECTED' : 'STATUS_CHANGE',
      performedBy: {
        id: adminUser.id,
        name: `${adminUser.firstName} ${adminUser.lastName}`.trim(),
        role: adminUser.role,
        email: adminUser.email,
      },
      details: {
        previousStatus,
        newStatus: status,
        notes,
        correctionReason,
        fieldsToCorrect,
      },
    });

    return ResponseMappers.toAdmissionDto(updated);
  }

  /**
   * Add internal administrative review note
   */
  public async addNote(
    id: string,
    noteText: string,
    adminUser: { id: string; firstName: string; lastName: string; role: string; email: string }
  ) {
    const existing = await admissionRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Admission application with ID '${id}' not found.`);
    }

    const updated = await admissionRepository.addReviewNote(id, {
      adminId: adminUser.id,
      adminName: `${adminUser.firstName} ${adminUser.lastName}`.trim(),
      note: noteText,
      action: 'NOTE_ADDED',
    });

    admissionAuditRepository.logAction({
      applicationId: updated._id?.toString() || updated.id,
      applicationNumber: updated.applicationNumber,
      action: 'NOTE_ADDED',
      performedBy: {
        id: adminUser.id,
        name: `${adminUser.firstName} ${adminUser.lastName}`.trim(),
        role: adminUser.role,
        email: adminUser.email,
      },
      details: { note: noteText },
    });

    return ResponseMappers.toAdmissionDto(updated);
  }

  /**
   * Convert Approved application into official Student & Parent records
   */
  public async convertToStudent(
    id: string,
    options: AdmissionConvertToStudentInput,
    adminUser: { id: string; firstName: string; lastName: string; role: string; email: string }
  ) {
    const application = await admissionRepository.findById(id);
    if (!application) {
      throw new NotFoundError(`Admission application with ID '${id}' not found.`);
    }

    if (application.status !== 'APPROVED' && application.status !== 'ACCEPTED') {
      throw new ValidationError(
        `Only approved admission applications can be converted into enrolled students. Current status is '${application.status}'.`
      );
    }

    // 1. Generate admission number and roll number
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const admissionNumber =
      options.admissionNumber || application.applicationNumber || `ADM-2026-${randomDigits}`;

    const rollNumber = options.rollNumber || `10-A-${Math.floor(10 + Math.random() * 80)}`;

    // 2. Create Student User account
    const studentUser = await userRepository.create({
      firstName: application.studentFirstName,
      lastName: application.studentLastName,
      email: `${application.studentFirstName.toLowerCase()}.${application.studentLastName.toLowerCase()}@oakridge.edu`,
      passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
      role: 'STUDENT',
      status: 'ACTIVE',
      gradeLevel: application.gradeApplyingFor,
    });

    // 3. Create or link Parent record
    const parentRecord = await schoolActorsRepository.createParent({
      userId: `usr_parent_${Date.now()}`,
      relationship: application.parentRelationship || 'Parent / Guardian',
      occupation: application.parentOccupation || 'Guardian',
      emergencyContact: application.parentPhone,
      address: application.address,
      city: application.city,
      state: application.state,
      postalCode: application.postalCode,
      studentIds: [],
    });

    // 4. Create Student record
    const studentRecord = await schoolActorsRepository.createStudent({
      userId: studentUser.id || studentUser._id?.toString() || `usr_stud_${Date.now()}`,
      admissionNumber,
      rollNumber,
      dateOfBirth: application.dateOfBirth,
      gender: application.gender || 'MALE',
      bloodGroup: application.bloodGroup || 'O+',
      emergencyContact: application.parentPhone,
      address: application.address,
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      parentId: parentRecord?.id || 'par-001',
      classId: options.classId || 'cls-10a',
      sectionId: options.sectionId || 'sec-10a',
    });

    // Link studentId to parent
    if (parentRecord && studentRecord) {
      await schoolActorsRepository.updateParent(parentRecord.id, {
        studentIds: [...parentRecord.studentIds, studentRecord.id],
      });
    }

    // 5. Update application status to ENROLLED
    const updatedApplication = await admissionRepository.convertToStudent(
      id,
      studentRecord?.id || `stud-${Date.now()}`
    );

    // 6. Audit log
    admissionAuditRepository.logAction({
      applicationId: application._id?.toString() || application.id,
      applicationNumber: application.applicationNumber,
      action: 'CONVERT_TO_STUDENT',
      performedBy: {
        id: adminUser.id,
        name: `${adminUser.firstName} ${adminUser.lastName}`.trim(),
        role: adminUser.role,
        email: adminUser.email,
      },
      details: {
        studentId: studentRecord?.id,
        admissionNumber,
        rollNumber,
      },
    });

    return {
      application: ResponseMappers.toAdmissionDto(updatedApplication),
      student: studentRecord,
    };
  }

  /**
   * Upload and validate confidential document
   */
  public async uploadDocument(
    data: FileUploadInput,
    uploaderName?: string,
    applicationNumber?: string
  ) {
    // 1. Validate file type
    if (!ALLOWED_MIME_TYPES.includes(data.fileType)) {
      throw new ValidationError(
        `Unsupported file type '${data.fileType}'. Only JPEG, PNG, WEBP, and PDF documents are permitted.`
      );
    }

    // 2. Validate file size
    if (data.fileSizeBytes > MAX_FILE_SIZE_BYTES) {
      throw new ValidationError(
        `File size (${(data.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB) exceeds the 5MB maximum limit.`
      );
    }

    const docId = `doc-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const fileUrl = `/api/v1/admissions/documents/${docId}`;

    const stored = admissionDocumentRepository.save({
      id: docId,
      applicationNumber,
      documentType: data.documentType || 'OTHER',
      fileName: data.fileName,
      fileType: data.fileType,
      fileSizeBytes: data.fileSizeBytes,
      fileData: data.fileBase64,
      uploadedAt: new Date().toISOString(),
      isPrivate: true,
      uploadedBy: uploaderName,
    });

    return {
      id: stored.id,
      documentType: stored.documentType,
      fileName: stored.fileName,
      fileType: stored.fileType,
      fileSizeBytes: stored.fileSizeBytes,
      fileUrl: fileUrl,
      uploadedAt: stored.uploadedAt,
      verified: false,
    };
  }

  /**
   * Retrieve confidential document with security authorization
   */
  public async getDocument(
    docId: string,
    authUser?: { id: string; role: string },
    trackingToken?: string
  ) {
    const doc = admissionDocumentRepository.findById(docId);
    if (!doc) {
      throw new NotFoundError(`Document with ID '${docId}' not found.`);
    }

    // Security check: Private documents require admin auth OR matching tracking token
    const isAdmin = authUser && ['ADMIN', 'SUPER_ADMIN'].includes(authUser.role);

    let isApplicant = false;
    if (trackingToken && doc.applicationNumber) {
      const app = await admissionRepository.findByApplicationNumber(doc.applicationNumber);
      if (app && app.trackingToken === trackingToken) {
        isApplicant = true;
      }
    }

    if (!isAdmin && !isApplicant) {
      throw new AuthorizationError(
        'Access denied. Private admission documents require administrative authorization or a valid applicant tracking token.'
      );
    }

    return doc;
  }

  /**
   * Get administrative audit logs for an application
   */
  public async getAuditLogs(applicationId: string) {
    return admissionAuditRepository.getLogsByApplicationId(applicationId);
  }
}

export const admissionService = new AdmissionService();
