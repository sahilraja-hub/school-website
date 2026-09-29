import mongoose from 'mongoose';
import { Admission, IAdmission } from '../models/Admission';

class AdmissionRepository {
  private inMemoryAdmissions: Map<string, any> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const defaults = [
      {
        _id: 'adm-001',
        id: 'adm-001',
        applicationNumber: 'ADM-2026-1042',
        trackingToken: 'tok-alexander-1042',
        studentFirstName: 'Alexander',
        studentLastName: 'Hayes',
        dateOfBirth: '2011-04-18',
        gender: 'MALE',
        bloodGroup: 'O+',
        nationality: 'American',
        gradeApplyingFor: 'GRADE_9',
        academicYear: '2026-2027',
        streamOrTrack: 'Advanced STEM',
        parentName: 'Robert Hayes',
        parentRelationship: 'Father',
        parentEmail: 'robert.hayes@example.com',
        parentPhone: '+1 (555) 782-9901',
        parentOccupation: 'Mechanical Engineer',
        emergencyContact: '+1 (555) 782-9901',
        alternatePhone: '+1 (555) 782-9902',
        address: '742 Evergreen Terrace, Springfield',
        city: 'Springfield',
        state: 'Oregon',
        postalCode: '97477',
        country: 'United States',
        previousSchool: 'Springfield Middle Academy',
        previousGrade: 'Grade 8',
        previousGpa: '3.95',
        transferCertificateNumber: 'TC-2026-081',
        status: 'UNDER_REVIEW',
        documents: [
          {
            id: 'doc-demo-01',
            documentType: 'BIRTH_CERTIFICATE',
            fileName: 'birth-certificate-alexander.pdf',
            fileType: 'application/pdf',
            fileSizeBytes: 245000,
            fileUrl: '/api/v1/admissions/documents/doc-demo-01',
            uploadedAt: new Date().toISOString(),
            verified: true,
          },
          {
            id: 'doc-demo-02',
            documentType: 'PREVIOUS_REPORT_CARD',
            fileName: 'grade8-transcript-alexander.pdf',
            fileType: 'application/pdf',
            fileSizeBytes: 310000,
            fileUrl: '/api/v1/admissions/documents/doc-demo-02',
            uploadedAt: new Date().toISOString(),
            verified: true,
          },
        ],
        notes: 'Strong mathematics recommendation. Robotics club captain.',
        reviewNotes: [
          {
            id: 'note-01',
            adminId: 'usr-admin-01',
            adminName: 'Admin Eleanor Vance',
            note: 'Application verified. Mathematics honors aptitude confirmed.',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            action: 'INITIAL_REVIEW',
          },
        ],
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(),
        submittedAt: new Date(Date.now() - 172800000),
      },
      {
        _id: 'adm-002',
        id: 'adm-002',
        applicationNumber: 'ADM-2026-1088',
        trackingToken: 'tok-sophia-1088',
        studentFirstName: 'Sophia',
        studentLastName: 'Patel',
        dateOfBirth: '2021-08-22',
        gender: 'FEMALE',
        bloodGroup: 'B+',
        nationality: 'American',
        gradeApplyingFor: 'KINDERGARTEN',
        academicYear: '2026-2027',
        streamOrTrack: 'Early Childhood Discovery',
        parentName: 'Priya & Vikram Patel',
        parentRelationship: 'Parents',
        parentEmail: 'priya.patel@example.com',
        parentPhone: '+1 (555) 349-1120',
        parentOccupation: 'Physician & Software Architect',
        emergencyContact: '+1 (555) 349-1120',
        address: '12 Harbor View Road, Seattle',
        city: 'Seattle',
        state: 'Washington',
        postalCode: '98101',
        country: 'United States',
        status: 'ACCEPTED',
        documents: [
          {
            id: 'doc-demo-03',
            documentType: 'BIRTH_CERTIFICATE',
            fileName: 'sophia-patel-birth-cert.pdf',
            fileType: 'application/pdf',
            fileSizeBytes: 190000,
            fileUrl: '/api/v1/admissions/documents/doc-demo-03',
            uploadedAt: new Date().toISOString(),
            verified: true,
          },
        ],
        notes: 'Accepted for Fall 2026 cohort. Welcome packet sent.',
        reviewNotes: [
          {
            id: 'note-02',
            adminId: 'usr-admin-01',
            adminName: 'Admin Eleanor Vance',
            note: 'Dossier approved for enrollment.',
            createdAt: new Date().toISOString(),
            action: 'APPROVAL',
          },
        ],
        createdAt: new Date(Date.now() - 259200000),
        updatedAt: new Date(),
        submittedAt: new Date(Date.now() - 259200000),
      },
    ];

    defaults.forEach((item) => {
      this.inMemoryAdmissions.set(item.applicationNumber, item);
    });
  }

  private isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  public async create(data: any): Promise<any> {
    const trackingToken =
      data.trackingToken || `tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const normalizedData = {
      ...data,
      trackingToken,
      documents: data.documents || [],
      reviewNotes: data.reviewNotes || [],
    };

    if (this.isMongoConnected()) {
      try {
        return await Admission.create(normalizedData);
      } catch (err) {
        // Fall back
      }
    }

    const item = {
      _id: `adm_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      id: `adm_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      ...normalizedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.inMemoryAdmissions.set(item.applicationNumber, item);
    return item;
  }

  public async findByApplicationNumber(appNum: string): Promise<any | null> {
    const normalized = appNum.toUpperCase().trim();
    if (this.isMongoConnected()) {
      try {
        const found = await Admission.findOne({ applicationNumber: normalized });
        if (found) return found;
      } catch (err) {
        // Fall back
      }
    }
    return this.inMemoryAdmissions.get(normalized) || null;
  }

  public async findByTrackingToken(token: string): Promise<any | null> {
    if (this.isMongoConnected()) {
      try {
        const found = await Admission.findOne({ trackingToken: token });
        if (found) return found;
      } catch (err) {
        // Fall back
      }
    }
    for (const item of this.inMemoryAdmissions.values()) {
      if (item.trackingToken === token) {
        return item;
      }
    }
    return null;
  }

  public async findById(id: string): Promise<any | null> {
    if (this.isMongoConnected()) {
      try {
        const found = await Admission.findById(id);
        if (found) return found;
      } catch (err) {
        // Fall back
      }
    }
    for (const item of this.inMemoryAdmissions.values()) {
      if (item._id === id || item._id?.toString() === id || item.id === id) {
        return item;
      }
    }
    return null;
  }

  public async findAll(filter: Record<string, any> = {}): Promise<any[]> {
    if (this.isMongoConnected()) {
      try {
        const mongoFilter: any = {};
        if (filter.status) mongoFilter.status = filter.status;
        if (filter.gradeApplyingFor) mongoFilter.gradeApplyingFor = filter.gradeApplyingFor;
        if (filter.academicYear) mongoFilter.academicYear = filter.academicYear;
        if (filter.search) {
          const s = filter.search.toLowerCase();
          mongoFilter.$or = [
            { studentFirstName: { $regex: s, $options: 'i' } },
            { studentLastName: { $regex: s, $options: 'i' } },
            { applicationNumber: { $regex: s, $options: 'i' } },
            { parentName: { $regex: s, $options: 'i' } },
            { parentEmail: { $regex: s, $options: 'i' } },
          ];
        }
        return await Admission.find(mongoFilter).sort({ createdAt: -1 });
      } catch (err) {
        // Fall back
      }
    }

    let list = Array.from(this.inMemoryAdmissions.values());

    if (filter.status && filter.status !== 'ALL') {
      list = list.filter((a) => a.status === filter.status);
    }
    if (filter.gradeApplyingFor && filter.gradeApplyingFor !== 'ALL') {
      list = list.filter((a) => a.gradeApplyingFor === filter.gradeApplyingFor);
    }
    if (filter.academicYear && filter.academicYear !== 'ALL') {
      list = list.filter((a) => a.academicYear === filter.academicYear);
    }
    if (filter.search) {
      const s = filter.search.toLowerCase().trim();
      list = list.filter((a) => {
        const fn = (a.studentFirstName || '').toLowerCase();
        const ln = (a.studentLastName || '').toLowerCase();
        const full = `${fn} ${ln}`;
        const appNum = (a.applicationNumber || '').toLowerCase();
        const parent = (a.parentName || '').toLowerCase();
        const email = (a.parentEmail || '').toLowerCase();
        return (
          fn.includes(s) ||
          ln.includes(s) ||
          full.includes(s) ||
          appNum.includes(s) ||
          parent.includes(s) ||
          email.includes(s)
        );
      });
    }

    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public async updateById(id: string, updateData: any): Promise<any | null> {
    if (this.isMongoConnected()) {
      try {
        const updated = await Admission.findByIdAndUpdate(id, updateData, { new: true });
        if (updated) return updated;
      } catch (err) {
        // Fall back
      }
    }

    for (const [key, item] of this.inMemoryAdmissions.entries()) {
      if (item._id === id || item._id?.toString() === id || item.id === id) {
        const updated = {
          ...item,
          ...updateData,
          updatedAt: new Date(),
        };
        this.inMemoryAdmissions.set(key, updated);
        return updated;
      }
    }
    return null;
  }

  public async addReviewNote(
    id: string,
    note: { adminId: string; adminName: string; note: string; action?: string }
  ): Promise<any | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const newNote = {
      id: `note-${Date.now()}`,
      adminId: note.adminId,
      adminName: note.adminName,
      note: note.note,
      createdAt: new Date().toISOString(),
      action: note.action || 'NOTE_ADDED',
    };

    const notesList = [...(existing.reviewNotes || []), newNote];
    return this.updateById(id, { reviewNotes: notesList });
  }

  public async requestCorrection(
    id: string,
    reason: string,
    fieldsToCorrect: string[],
    adminInfo: { id: string; name: string }
  ): Promise<any | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const correctionRequest = {
      reason,
      fieldsToCorrect,
      requestedAt: new Date().toISOString(),
    };

    const newNote = {
      id: `note-${Date.now()}`,
      adminId: adminInfo.id,
      adminName: adminInfo.name,
      note: `Correction requested: ${reason}. Fields: ${fieldsToCorrect.join(', ')}`,
      createdAt: new Date().toISOString(),
      action: 'CORRECTION_REQUESTED',
    };

    const notesList = [...(existing.reviewNotes || []), newNote];

    return this.updateById(id, {
      status: 'CORRECTION_REQUESTED',
      correctionRequest,
      reviewNotes: notesList,
    });
  }

  public async convertToStudent(
    id: string,
    studentId: string
  ): Promise<any | null> {
    return this.updateById(id, {
      status: 'ENROLLED',
      enrolledStudentId: studentId,
      enrolledAt: new Date(),
    });
  }
}

export const admissionRepository = new AdmissionRepository();
