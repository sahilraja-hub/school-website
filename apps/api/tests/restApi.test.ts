import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { generateTokens } from '../src/utils/token';

describe('Phase 8 — Complete REST API Integration Suite', () => {
  const app = createApp();
  let superAdminToken: string;
  let adminToken: string;
  let teacherToken: string;
  let studentToken: string;
  let parentToken: string;

  beforeAll(async () => {
    superAdminToken = generateTokens({
      id: 'usr-superadmin-01',
      email: 'superadmin@oakridge.edu',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    }).accessToken;

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

    parentToken = generateTokens({
      id: 'usr-parent-01',
      email: 'parent@oakridge.edu',
      role: 'PARENT',
      status: 'ACTIVE',
    }).accessToken;
  });

  // ==========================================
  // 1. /users
  // ==========================================
  describe('Module: /api/v1/users', () => {
    it('GET /api/v1/users — should list users with pagination and search for admins', async () => {
      const res = await request(app)
        .get('/api/v1/users?page=1&limit=5&search=admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta.pagination).toBeDefined();
      expect(res.body.meta.pagination.page).toBe(1);
    });

    it('GET /api/v1/users — should forbid access to students', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('POST /api/v1/users — should create a user and strip passwordHash in DTO', async () => {
      const testEmail = `newuser_${Date.now()}@oakridge.edu`;
      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'Marcus',
          lastName: 'Aurelius',
          email: testEmail,
          password: 'Password@12345',
          role: 'TEACHER',
          phone: '+1-555-1234',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.email).toBe(testEmail);
      expect(res.body.data.fullName).toBe('Marcus Aurelius');
      expect(res.body.data).not.toHaveProperty('passwordHash');
    });

    it('PATCH /api/v1/users/:id/status — should update user status', async () => {
      const res = await request(app)
        .patch('/api/v1/users/usr-suspended-01/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'ACTIVE' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('ACTIVE');
    });
  });

  // ==========================================
  // 2. /students
  // ==========================================
  describe('Module: /api/v1/students', () => {
    it('GET /api/v1/students — should allow teachers to list students', async () => {
      const res = await request(app)
        .get('/api/v1/students')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('admissionNumber');
    });

    it('POST /api/v1/students — should validate required student fields', async () => {
      const res = await request(app)
        .post('/api/v1/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ firstName: 'J' }); // Missing required fields

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });

    it('POST /api/v1/students — should successfully create student profile', async () => {
      const res = await request(app)
        .post('/api/v1/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'Clara',
          lastName: 'Oswald',
          email: `clara_${Date.now()}@oakridge.edu`,
          dateOfBirth: '2011-05-20',
          gender: 'FEMALE',
          bloodGroup: 'B+',
          emergencyContact: '+1-555-4321',
          admissionNumber: `ADM-${Date.now().toString(36)}`,
          rollNumber: '10-A-09',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.fullName).toBe('Clara Oswald');
    });
  });

  // ==========================================
  // 3. /teachers
  // ==========================================
  describe('Module: /api/v1/teachers', () => {
    it('GET /api/v1/teachers — should allow authenticated directory access', async () => {
      const res = await request(app)
        .get('/api/v1/teachers')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('department');
      expect(res.body.data[0]).toHaveProperty('qualification');
    });
  });

  // ==========================================
  // 4. /parents
  // ==========================================
  describe('Module: /api/v1/parents', () => {
    it('GET /api/v1/parents — should allow admin to view parents list', async () => {
      const res = await request(app)
        .get('/api/v1/parents')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // 5. /classes, /sections, /subjects
  // ==========================================
  describe('Module: Academic Structure (/classes, /sections, /subjects)', () => {
    let createdClassId: string;

    it('POST /api/v1/classes — should create class cohort', async () => {
      const res = await request(app)
        .post('/api/v1/classes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Grade 12 Senior Cohort',
          gradeLevel: 'GRADE_12',
          academicYear: '2026-2027',
          description: 'Graduating class',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Grade 12 Senior Cohort');
      createdClassId = res.body.data.id;
    });

    it('POST /api/v1/sections — should create section linked to class', async () => {
      const res = await request(app)
        .post('/api/v1/sections')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Section Alpha',
          classId: createdClassId,
          roomNumber: 'Room 405',
          capacity: 30,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Section Alpha');
    });

    it('GET /api/v1/subjects — should list subjects', async () => {
      const res = await request(app)
        .get('/api/v1/subjects')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('code');
    });
  });

  // ==========================================
  // 6. /attendance
  // ==========================================
  describe('Module: /api/v1/attendance', () => {
    it('POST /api/v1/attendance/batch — should record register for students', async () => {
      const today = new Date().toISOString().split('T')[0];
      const res = await request(app)
        .post('/api/v1/attendance/batch')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          classId: 'cls-10',
          sectionId: 'sec-10a',
          date: today,
          records: [
            { studentId: 'stud-001', status: 'PRESENT', remarks: 'Present and prepared' },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].status).toBe('PRESENT');
    });

    it('GET /api/v1/attendance/stats — should calculate attendance rate', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/stats')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('attendanceRate');
      expect(res.body.data.total).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // 7. /exams & /results
  // ==========================================
  describe('Module: /api/v1/exams & /api/v1/results', () => {
    it('GET /api/v1/exams — should list examinations', async () => {
      const res = await request(app)
        .get('/api/v1/exams')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].name).toBe('Mid-Term Examinations 2026');
    });

    it('POST /api/v1/results — should record exam marks and verify passing status', async () => {
      const res = await request(app)
        .post('/api/v1/results')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          examSubjectId: 'es-math-101',
          studentId: 'stud-001',
          marksObtained: 88,
          grade: 'A',
          remarks: 'Good analytical work',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.marksObtained).toBe(88);
      expect(res.body.data.grade).toBe('A');
    });
  });

  // ==========================================
  // 8. /homework
  // ==========================================
  describe('Module: /api/v1/homework', () => {
    let homeworkId: string;

    it('POST /api/v1/homework — should assign coursework', async () => {
      const dueDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const res = await request(app)
        .post('/api/v1/homework')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          sectionId: 'sec-10a',
          subjectId: 'sub-math',
          title: 'Integral Calculus Review',
          description: 'Complete problem sets 1 to 10',
          dueDate,
          totalMarks: 25,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('Integral Calculus Review');
      homeworkId = res.body.data.id;
    });

    it('POST /api/v1/homework/:id/submit — should allow student to submit', async () => {
      const res = await request(app)
        .post(`/api/v1/homework/${homeworkId}/submit`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          content: 'My solutions to problem sets 1 to 10 with explanations.',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('SUBMITTED');
    });
  });

  // ==========================================
  // 9. /timetable
  // ==========================================
  describe('Module: /api/v1/timetable', () => {
    it('GET /api/v1/timetable — should view schedule slots', async () => {
      const res = await request(app)
        .get('/api/v1/timetable')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/timetable — should prevent double-booking conflicts', async () => {
      // Slot 1 already exists at 08:30 on MONDAY for sec-10a
      const res = await request(app)
        .post('/api/v1/timetable')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          sectionId: 'sec-10a',
          subjectId: 'sub-phys',
          teacherId: 'teach-002',
          dayOfWeek: 'MONDAY',
          startTime: '08:30',
          endTime: '09:25',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('already has a class scheduled');
    });
  });

  // ==========================================
  // 10. /admissions
  // ==========================================
  describe('Module: /api/v1/admissions', () => {
    it('POST /api/v1/admissions — should accept public applicant submission', async () => {
      const res = await request(app)
        .post('/api/v1/admissions')
        .send({
          studentFirstName: 'Elijah',
          studentLastName: 'Mikaelson',
          dateOfBirth: '2012-03-14',
          gradeApplyingFor: 'GRADE_8',
          parentName: 'Mikael',
          parentEmail: 'mikael@example.com',
          parentPhone: '+1 (555) 777-8888',
          address: '300 Mystic Falls Way',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.applicationNumber).toMatch(/^ADM-/);
      expect(res.body.data.status).toBe('SUBMITTED');
    });
  });

  // ==========================================
  // 11. /notices & /events
  // ==========================================
  describe('Module: Communications (/notices & /events)', () => {
    it('GET /api/v1/notices — should list published circulars', async () => {
      const res = await request(app).get('/api/v1/notices');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/events — should list school events', async () => {
      const res = await request(app).get('/api/v1/events');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // 12. /gallery & /documents
  // ==========================================
  describe('Module: Media & Documents (/gallery & /documents)', () => {
    it('GET /api/v1/gallery — should list photo albums', async () => {
      const res = await request(app).get('/api/v1/gallery');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/documents — should list published handbooks and documents', async () => {
      const res = await request(app).get('/api/v1/documents');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // 13. /fees & /payments
  // ==========================================
  describe('Module: Finance (/fees & /payments)', () => {
    it('GET /api/v1/fees/structures — should list fee structures', async () => {
      const res = await request(app)
        .get('/api/v1/fees/structures')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/payments — should record payment and update invoice', async () => {
      // Create new invoice first
      const invRes = await request(app)
        .post('/api/v1/fees/invoices')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          studentId: 'stud-001',
          feeStructureId: 'fee-001',
          amount: 1500,
          dueDate: '2026-11-01',
          notes: 'Technology fee',
        });

      const invoiceId = invRes.body.data.id;

      // Pay the invoice in full
      const payRes = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${parentToken}`)
        .send({
          invoiceId,
          amount: 1500,
          paymentMethod: 'ONLINE',
          transactionRef: 'TXN-TEST-12345',
        });

      expect(payRes.status).toBe(201);
      expect(payRes.body.data.status).toBe('SUCCESS');

      // Verify invoice balance is now 0 and status is PAID
      const updatedInv = await request(app)
        .get(`/api/v1/fees/invoices/${invoiceId}`)
        .set('Authorization', `Bearer ${parentToken}`);

      expect(updatedInv.body.data.balance).toBe(0);
      expect(updatedInv.body.data.status).toBe('PAID');
    });
  });

  // ==========================================
  // 14. /settings & /audit-logs
  // ==========================================
  describe('Module: Administration (/settings & /audit-logs)', () => {
    it('GET /api/v1/settings — should return school configuration', async () => {
      const res = await request(app).get('/api/v1/settings');
      expect(res.status).toBe(200);
      expect(res.body.data.schoolName).toBe('Oakridge International Academy');
    });

    it('PATCH /api/v1/settings — should allow admin to update settings', async () => {
      const res = await request(app)
        .patch('/api/v1/settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ currentTerm: 'Term 2 Winter' });

      expect(res.status).toBe(200);
      expect(res.body.data.currentTerm).toBe('Term 2 Winter');
    });

    it('GET /api/v1/audit-logs — should restrict audit logs to administrators', async () => {
      const forbiddenRes = await request(app)
        .get('/api/v1/audit-logs')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(forbiddenRes.status).toBe(403);

      const successRes = await request(app)
        .get('/api/v1/audit-logs')
        .set('Authorization', `Bearer ${superAdminToken}`);
      expect(successRes.status).toBe(200);
      expect(successRes.body.data.length).toBeGreaterThan(0);
    });
  });
});
