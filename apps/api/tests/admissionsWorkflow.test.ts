import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { generateTokens } from '../src/utils/token';
import { admissionRepository } from '../src/repositories/admissionRepository';
import { admissionAuditRepository } from '../src/repositories/admissionAuditRepository';

describe('Phase 14 — Online Admission System & Complete Workflow Suite', () => {
  const app = createApp();
  let adminToken: string;
  let teacherToken: string;
  let studentToken: string;

  beforeAll(() => {
    adminToken = generateTokens({
      id: 'usr-admin-01',
      email: 'admin@oakridge.edu',
      role: 'ADMIN',
      status: 'ACTIVE',
    }).accessToken;

    teacherToken = generateTokens({
      id: 'usr-teacher-01',
      email: 'teacher@oakridge.edu',
      role: 'TEACHER',
      status: 'ACTIVE',
    }).accessToken;

    studentToken = generateTokens({
      id: 'usr-student-01',
      email: 'student@oakridge.edu',
      role: 'STUDENT',
      status: 'ACTIVE',
    }).accessToken;
  });

  // ========================================================
  // 1. DRAFT CREATION & MANAGEMENT
  // ========================================================
  describe('Draft Application Workflow', () => {
    it('should allow public applicant to create an initial draft with partial fields', async () => {
      const res = await request(app)
        .post('/api/v1/admissions/draft')
        .send({
          studentFirstName: 'Oliver',
          studentLastName: 'Sterling',
          gradeApplyingFor: 'GRADE_9',
          parentName: 'Eleanor Sterling',
          parentEmail: 'eleanor.sterling@example.com',
          parentPhone: '+1-555-482-9901',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('DRAFT');
      expect(res.body.data.applicationNumber).toMatch(/^ADM-2026-\d{4}$/);
      expect(res.body.data.trackingToken).toBeDefined();
    });

    it('should allow applicant to update their draft using applicationNumber and tracking token', async () => {
      // 1. Create draft
      const draftRes = await request(app)
        .post('/api/v1/admissions/draft')
        .send({
          studentFirstName: 'Oliver',
          studentLastName: 'Sterling',
          parentEmail: 'eleanor.sterling@example.com',
        });

      const { applicationNumber, trackingToken } = draftRes.body.data;

      // 2. Update draft
      const updateRes = await request(app)
        .put(`/api/v1/admissions/draft/${applicationNumber}`)
        .set('x-tracking-token', trackingToken)
        .send({
          dateOfBirth: '2011-06-15',
          gender: 'MALE',
          address: '450 University Avenue, Palo Alto',
          previousSchool: 'Palo Alto Middle School',
          gradeApplyingFor: 'GRADE_9',
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.dateOfBirth).toBe('2011-06-15');
      expect(updateRes.body.data.address).toBe('450 University Avenue, Palo Alto');
    });

    it('should reject updating draft with invalid tracking token', async () => {
      const draftRes = await request(app)
        .post('/api/v1/admissions/draft')
        .send({ studentFirstName: 'Invalid', studentLastName: 'TokenTest' });

      const { applicationNumber } = draftRes.body.data;

      const updateRes = await request(app)
        .put(`/api/v1/admissions/draft/${applicationNumber}`)
        .set('x-tracking-token', 'tok_wrong_token')
        .send({ address: 'Unauthorized address change' });

      expect(updateRes.status).toBe(403);
    });
  });

  // ========================================================
  // 2. APPLICATION SUBMISSION & VALIDATION
  // ========================================================
  describe('Full Application Submission & Validation', () => {
    it('should validate all mandatory fields on submission', async () => {
      const res = await request(app)
        .post('/api/v1/admissions/apply')
        .send({
          // Missing studentLastName, parentEmail, address, etc.
          studentFirstName: 'J',
          gradeApplyingFor: 'GRADE_10',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should successfully submit full application with student, parent, previous school, and documents', async () => {
      const fullApplication = {
        studentFirstName: 'Maya',
        studentLastName: 'Lin',
        dateOfBirth: '2010-09-12',
        gender: 'FEMALE',
        bloodGroup: 'A+',
        nationality: 'American',
        gradeApplyingFor: 'GRADE_10',
        academicYear: '2026-2027',
        streamOrTrack: 'Advanced STEM',
        parentName: 'Kenzo Lin',
        parentRelationship: 'Father',
        parentEmail: 'kenzo.lin@example.com',
        parentPhone: '+1-555-883-2910',
        parentOccupation: 'Bioinformatics Researcher',
        emergencyContact: '+1-555-883-2910',
        address: '88 Tech Boulevard, Cambridge',
        city: 'Cambridge',
        state: 'Massachusetts',
        postalCode: '02138',
        country: 'United States',
        previousSchool: 'Boston Latin Academy',
        previousGrade: 'Grade 9',
        previousGpa: '3.98',
        transferCertificateNumber: 'TC-BOS-9912',
        documents: [
          {
            documentType: 'BIRTH_CERTIFICATE',
            fileName: 'maya-birth-cert.pdf',
            fileType: 'application/pdf',
            fileSizeBytes: 180000,
            fileUrl: '/api/v1/admissions/documents/doc-maya-01',
          },
        ],
        notes: 'Interested in advanced quantum physics electives.',
      };

      const res = await request(app).post('/api/v1/admissions/apply').send(fullApplication);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('SUBMITTED');
      expect(res.body.data.applicationNumber).toBeDefined();
      expect(res.body.data.trackingToken).toBeDefined();
      expect(res.body.data.studentName).toBe('Maya Lin');
    });

    it('should allow public applicant to track submitted application status', async () => {
      // 1. Submit application
      const submitRes = await request(app)
        .post('/api/v1/admissions/apply')
        .send({
          studentFirstName: 'Ethan',
          studentLastName: 'Wright',
          dateOfBirth: '2012-03-21',
          gradeApplyingFor: 'GRADE_8',
          parentName: 'Sarah Wright',
          parentEmail: 'sarah.wright@example.com',
          parentPhone: '+1-555-901-3829',
          address: '102 Maple Drive, Boston',
        });

      const { applicationNumber, trackingToken } = submitRes.body.data;

      // 2. Track publicly
      const trackRes = await request(app).get(`/api/v1/admissions/track/${applicationNumber}`);

      expect(trackRes.status).toBe(200);
      expect(trackRes.body.data.applicationNumber).toBe(applicationNumber);
      expect(trackRes.body.data.status).toBe('SUBMITTED');
      expect(trackRes.body.data.studentName).toBe('Ethan Wright');
    });
  });

  // ========================================================
  // 3. ADMIN REVIEW, SEARCH, FILTER, AND NOTES
  // ========================================================
  describe('Administrative Management: Search, Filter, Review, and Notes', () => {
    it('should allow Admin to list applications and filter by status and grade', async () => {
      const res = await request(app)
        .get('/api/v1/admissions?status=UNDER_REVIEW')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      res.body.data.forEach((appItem: any) => {
        expect(appItem.status).toBe('UNDER_REVIEW');
      });
    });

    it('should allow Admin to search applications by applicant name', async () => {
      const res = await request(app)
        .get('/api/v1/admissions?search=Alexander')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].applicantFirstName).toBe('Alexander');
    });

    it('should allow Admin to review detailed dossier for an application', async () => {
      const res = await request(app)
        .get('/api/v1/admissions/adm-001')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.applicationNumber).toBe('ADM-2026-1042');
      expect(res.body.data.applicantFullName).toBe('Alexander Hayes');
      expect(res.body.data.documents.length).toBeGreaterThan(0);
    });

    it('should allow Admin to add review notes with audit logging', async () => {
      const res = await request(app)
        .post('/api/v1/admissions/adm-001/notes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          note: 'Interview scheduled with Science Faculty panel for next Tuesday.',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.reviewNotes.some((n: any) => n.note.includes('Science Faculty'))).toBe(true);
    });

    it('should reject non-admin users from viewing admin application lists', async () => {
      const teacherRes = await request(app)
        .get('/api/v1/admissions')
        .set('Authorization', `Bearer ${teacherToken}`);
      expect(teacherRes.status).toBe(403);

      const studentRes = await request(app)
        .get('/api/v1/admissions')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(studentRes.status).toBe(403);

      const unauthRes = await request(app).get('/api/v1/admissions');
      expect(unauthRes.status).toBe(401);
    });
  });

  // ========================================================
  // 4. CORRECTION REQUEST & RESUBMISSION WORKFLOW
  // ========================================================
  describe('Correction Request & Resubmission Workflow', () => {
    it('should allow Admin to request correction from applicant with specific fields and reason', async () => {
      // 1. Submit an application
      const submitRes = await request(app)
        .post('/api/v1/admissions/apply')
        .send({
          studentFirstName: 'Chloe',
          studentLastName: 'Bennett',
          dateOfBirth: '2011-11-04',
          gradeApplyingFor: 'GRADE_9',
          parentName: 'Marcus Bennett',
          parentEmail: 'marcus.b@example.com',
          parentPhone: '+1-555-442-9901',
          address: '22 Elm Street',
        });

      const { applicationNumber } = submitRes.body.data;
      const appRecord = await admissionRepository.findByApplicationNumber(applicationNumber);

      // 2. Admin requests correction
      const corrRes = await request(app)
        .patch(`/api/v1/admissions/${appRecord._id || appRecord.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'CORRECTION_REQUESTED',
          correctionReason: 'Previous academic transcript is illegible. Please upload a clear official scan.',
          fieldsToCorrect: ['documents', 'previousGpa'],
        });

      expect(corrRes.status).toBe(200);
      expect(corrRes.body.data.status).toBe('CORRECTION_REQUESTED');
      expect(corrRes.body.data.correctionRequest.reason).toContain('transcript is illegible');

      // 3. Applicant tracking shows correction requested
      const trackRes = await request(app).get(`/api/v1/admissions/track/${applicationNumber}`);
      expect(trackRes.body.data.status).toBe('CORRECTION_REQUESTED');
      expect(trackRes.body.data.correctionRequest.fieldsToCorrect).toContain('documents');
    });

    it('should allow applicant to resubmit after correcting requested fields', async () => {
      // 1. Create and submit
      const submitRes = await request(app)
        .post('/api/v1/admissions/apply')
        .send({
          studentFirstName: 'Noah',
          studentLastName: 'Miller',
          dateOfBirth: '2012-07-19',
          gradeApplyingFor: 'GRADE_8',
          parentName: 'Diana Miller',
          parentEmail: 'diana.miller@example.com',
          parentPhone: '+1-555-771-0029',
          address: '99 Oak Court',
        });

      const { applicationNumber, trackingToken } = submitRes.body.data;
      const appRecord = await admissionRepository.findByApplicationNumber(applicationNumber);

      // 2. Admin flags for correction
      await request(app)
        .patch(`/api/v1/admissions/${appRecord._id || appRecord.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'CORRECTION_REQUESTED',
          correctionReason: 'Please provide official transfer certificate.',
          fieldsToCorrect: ['transferCertificateNumber'],
        });

      // 3. Applicant resubmits with fixed field
      const resubmitRes = await request(app)
        .post('/api/v1/admissions/apply')
        .set('x-tracking-token', trackingToken)
        .send({
          applicationNumber,
          studentFirstName: 'Noah',
          studentLastName: 'Miller',
          dateOfBirth: '2012-07-19',
          gradeApplyingFor: 'GRADE_8',
          parentName: 'Diana Miller',
          parentEmail: 'diana.miller@example.com',
          parentPhone: '+1-555-771-0029',
          address: '99 Oak Court',
          transferCertificateNumber: 'TC-VERIFIED-2026-90',
        });

      expect(resubmitRes.status).toBe(201);
      expect(resubmitRes.body.data.status).toBe('SUBMITTED');

      // Check resolved status in repo
      const updatedApp = await admissionRepository.findByApplicationNumber(applicationNumber);
      expect(updatedApp.correctionRequest.resolvedAt).toBeDefined();
    });
  });

  // ========================================================
  // 5. APPROVAL, REJECTION & ENROLLMENT CONVERSION
  // ========================================================
  describe('Approval, Rejection, and Conversion to Student Record', () => {
    it('should allow Admin to approve an application', async () => {
      const res = await request(app)
        .patch('/api/v1/admissions/adm-001/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'APPROVED',
          notes: 'Admissions committee unanimously approves admission.',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('APPROVED');
    });

    it('should allow Admin to reject an application', async () => {
      const res = await request(app)
        .patch('/api/v1/admissions/adm-001/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'REJECTED',
          notes: 'Grade cohort capacity reached.',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('REJECTED');
    });

    it('should reject converting an unapproved application into a student record', async () => {
      // Set status to SUBMITTED
      await admissionRepository.updateById('adm-001', { status: 'SUBMITTED' });

      const res = await request(app)
        .post('/api/v1/admissions/adm-001/convert-to-student')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ rollNumber: '10-A-42' });

      expect(res.status).toBe(400);
      expect(res.body.error?.message || res.body.error).toContain('Only approved admission applications');
    });

    it('should convert an approved application into official student, parent, and user records with status ENROLLED', async () => {
      // 1. Approve application
      await admissionRepository.updateById('adm-001', { status: 'APPROVED' });

      // 2. Convert to student
      const res = await request(app)
        .post('/api/v1/admissions/adm-001/convert-to-student')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          classId: 'cls-10a',
          sectionId: 'sec-10a',
          rollNumber: '10-A-99',
          admissionNumber: 'ADM-2026-9999',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.application.status).toBe('ENROLLED');
      expect(res.body.data.application.enrolledStudentId).toBeDefined();

      const createdStudent = res.body.data.student;
      expect(createdStudent).toBeDefined();
      expect(createdStudent.admissionNumber).toBe('ADM-2026-9999');
      expect(createdStudent.rollNumber).toBe('10-A-99');
      expect(createdStudent.status).toBe('ACTIVE');
    });
  });

  // ========================================================
  // 6. FILE VALIDATION & PRIVATE DOCUMENT SECURITY
  // ========================================================
  describe('File Upload Validation & Private Document Security', () => {
    it('should accept valid PDF and image documents under 5MB', async () => {
      const validDoc = {
        fileName: 'immunization-record.pdf',
        fileType: 'application/pdf',
        fileSizeBytes: 524000,
        fileBase64: 'JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKFZhbGlkIERvYykK...',
        documentType: 'ID_PROOF',
      };

      const res = await request(app)
        .post('/api/v1/admissions/upload')
        .send(validDoc);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toMatch(/^doc-/);
      expect(res.body.data.fileUrl).toContain('/api/v1/admissions/documents/');
    });

    it('should reject unpermitted file types (e.g. .exe, .sh, .html, .gif)', async () => {
      const invalidDoc = {
        fileName: 'malicious-payload.exe',
        fileType: 'application/x-msdownload',
        fileSizeBytes: 10240,
        fileBase64: 'TVqQAAMAAAAEAAAA//8AALgAAAA...',
        documentType: 'OTHER',
      };

      const res = await request(app)
        .post('/api/v1/admissions/upload')
        .send(invalidDoc);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject files exceeding 5MB size limit', async () => {
      const oversizedDoc = {
        fileName: 'huge-video-portfolio.pdf',
        fileType: 'application/pdf',
        fileSizeBytes: 6 * 1024 * 1024, // 6 MB
        fileBase64: 'AAAA...',
        documentType: 'PREVIOUS_REPORT_CARD',
      };

      const res = await request(app)
        .post('/api/v1/admissions/upload')
        .send(oversizedDoc);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('SECURITY: should prevent unauthenticated public access to private admission documents', async () => {
      const res = await request(app).get('/api/v1/admissions/documents/doc-demo-01');

      expect(res.status).toBe(403);
      expect(res.body.error?.message || res.body.error).toContain('Access denied');
    });

    it('SECURITY: should allow authorized Admin to access private documents', async () => {
      const res = await request(app)
        .get('/api/v1/admissions/documents/doc-demo-01')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('doc-demo-01');
      expect(res.body.data.fileName).toBe('birth-certificate-alexander.pdf');
    });

    it('SECURITY: should allow applicant to access their document using their valid tracking token', async () => {
      const res = await request(app)
        .get('/api/v1/admissions/documents/doc-demo-01')
        .set('x-tracking-token', 'tok-alexander-1042');

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('doc-demo-01');
    });
  });

  // ========================================================
  // 7. ADMINISTRATIVE AUDIT TRAILS
  // ========================================================
  describe('Administrative Action Audit Logs', () => {
    it('should record audit entries for status changes, notes, and conversions', async () => {
      // Retrieve logs for adm-001
      const res = await request(app)
        .get('/api/v1/admissions/adm-001/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should block non-admin users from viewing audit logs', async () => {
      const res = await request(app)
        .get('/api/v1/admissions/adm-001/audit-logs')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
    });
  });
});
