import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { generateTokens } from '../src/utils/token';

describe('Phase 12 — Student Portal & IDOR Security Integration Suite', () => {
  const app = createApp();

  // Student A: Liam Vance (stud-001, usr-student-01, section: sec-10a)
  let studentAToken: string;

  // Student B: Emma Watson (stud-002, usr-student-02, section: sec-10a)
  let studentBToken: string;

  // Teacher & Admin for reference
  let teacherToken: string;
  let adminToken: string;

  beforeAll(async () => {
    studentAToken = generateTokens({
      id: 'usr-student-01',
      email: 'student@oakridge.edu',
      role: 'STUDENT',
      status: 'ACTIVE',
    }).accessToken;

    studentBToken = generateTokens({
      id: 'usr-student-02',
      email: 'student2@oakridge.edu',
      role: 'STUDENT',
      status: 'ACTIVE',
    }).accessToken;

    teacherToken = generateTokens({
      id: 'usr-teacher-01',
      email: 'teacher@oakridge.edu',
      role: 'TEACHER',
      status: 'ACTIVE',
    }).accessToken;

    adminToken = generateTokens({
      id: 'usr-admin-01',
      email: 'admin@oakridge.edu',
      role: 'ADMIN',
      status: 'ACTIVE',
    }).accessToken;
  });

  // =========================================================================
  // 1. Profile Security & IDOR Prevention
  // =========================================================================
  describe('Student Profile & IDOR Access Control', () => {
    it('GET /api/v1/students/me — should return authenticated student profile with academic cohort', async () => {
      const res = await request(app)
        .get('/api/v1/students/me')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('stud-001');
      expect(res.body.data.admissionNumber).toBe('ADM-2026-0089');
      expect(res.body.data.rollNumber).toBe('10-A-01');
      expect(res.body.data.sectionId).toBe('sec-10a');
      expect(res.body.data.className).toBeDefined();
    });

    it('GET /api/v1/students/me — should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/v1/students/me');
      expect(res.status).toBe(401);
    });

    it('GET /api/v1/students/:id — Student A can view their own record', async () => {
      const res = await request(app)
        .get('/api/v1/students/stud-001')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('stud-001');
    });

    it('GET /api/v1/students/:id — IDOR TEST: Student A CANNOT access Student B record', async () => {
      const res = await request(app)
        .get('/api/v1/students/stud-002')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only view your own/i);
    });

    it('GET /api/v1/students — Student cannot list directory of all students', async () => {
      const res = await request(app)
        .get('/api/v1/students')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  // =========================================================================
  // 2. Attendance Security & IDOR Prevention
  // =========================================================================
  describe('Attendance Security & IDOR Isolation', () => {
    it('GET /api/v1/attendance — should return only own attendance for authenticated student', async () => {
      const res = await request(app)
        .get('/api/v1/attendance')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      // All returned records must belong to Student A
      for (const item of res.body.data) {
        expect(item.studentId).toBe('stud-001');
      }
    });

    it('GET /api/v1/attendance?studentId=stud-002 — IDOR TEST: Student A CANNOT query Student B attendance', async () => {
      const res = await request(app)
        .get('/api/v1/attendance?studentId=stud-002')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only access your own/i);
    });

    it('GET /api/v1/attendance/stats — should return student own attendance metrics', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/stats')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('attendanceRate');
      expect(res.body.data).toHaveProperty('present');
    });

    it('GET /api/v1/attendance/stats?studentId=stud-002 — IDOR TEST: Student A CANNOT query Student B stats', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/stats?studentId=stud-002')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only access your own attendance statistics/i);
    });

    it('POST /api/v1/attendance/batch — Student cannot modify attendance register', async () => {
      const res = await request(app)
        .post('/api/v1/attendance/batch')
        .set('Authorization', `Bearer ${studentAToken}`)
        .send({
          classId: 'cls-10',
          sectionId: 'sec-10a',
          date: '2026-10-01',
          records: [{ studentId: 'stud-001', status: 'PRESENT' }],
        });

      expect(res.status).toBe(403);
    });
  });

  // =========================================================================
  // 3. Results Security & IDOR Prevention
  // =========================================================================
  describe('Results Security & IDOR Isolation', () => {
    it('GET /api/v1/results — should list only the student own grades and evaluated exam marks', async () => {
      const res = await request(app)
        .get('/api/v1/results')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      // Student A must only see their own marks
      for (const item of res.body.data) {
        expect(item.studentId).toBe('stud-001');
      }
      // Must not contain Student B's result
      expect(res.body.data.some((r: any) => r.id === 'res-002')).toBe(false);
    });

    it('GET /api/v1/results?studentId=stud-002 — IDOR TEST: Student A CANNOT filter for Student B grades', async () => {
      const res = await request(app)
        .get('/api/v1/results?studentId=stud-002')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only access your own exam results/i);
    });

    it('GET /api/v1/results/res-001 — Student A can view their own result details', async () => {
      const res = await request(app)
        .get('/api/v1/results/res-001')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('res-001');
      expect(res.body.data.marksObtained).toBe(94.5);
    });

    it('GET /api/v1/results/res-002 — IDOR TEST: Student A CANNOT access Student B result directly', async () => {
      const res = await request(app)
        .get('/api/v1/results/res-002')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only access your own exam results/i);
    });

    it('POST /api/v1/results — Student cannot record exam grades', async () => {
      const res = await request(app)
        .post('/api/v1/results')
        .set('Authorization', `Bearer ${studentAToken}`)
        .send({
          examSubjectId: 'es-math-101',
          studentId: 'stud-001',
          marksObtained: 100,
        });

      expect(res.status).toBe(403);
    });
  });

  // =========================================================================
  // 4. Homework Security, Submissions & IDOR Impersonation Prevention
  // =========================================================================
  describe('Homework Coursework & Submission Protection', () => {
    it('GET /api/v1/homework — should list coursework assigned to student section', async () => {
      const res = await request(app)
        .get('/api/v1/homework')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/homework/hw-001 — IDOR TEST: Submissions of other students must be stripped for students', async () => {
      const res = await request(app)
        .get('/api/v1/homework/hw-001')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // Student A must ONLY see their own submission in the submissions list
      const submissions = res.body.data.submissions || [];
      expect(submissions.every((s: any) => s.studentId === 'stud-001')).toBe(true);
      expect(submissions.some((s: any) => s.studentId === 'stud-002')).toBe(false);
      expect(res.body.data.mySubmission).toBeDefined();
      expect(res.body.data.mySubmission.studentId).toBe('stud-001');
    });

    it('POST /api/v1/homework/hw-001/submit — Student can submit their own coursework', async () => {
      const res = await request(app)
        .post('/api/v1/homework/hw-001/submit')
        .set('Authorization', `Bearer ${studentBToken}`)
        .send({
          content: 'Emma Watson solution report for calculus problem set.',
          attachmentUrl: 'https://docs.oakridge.edu/submissions/emma-ps4.pdf',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.studentId).toBe('stud-002');
    });

    it('POST /api/v1/homework/hw-001/submit — IDOR TEST: Student A CANNOT impersonate Student B in submission', async () => {
      const res = await request(app)
        .post('/api/v1/homework/hw-001/submit')
        .set('Authorization', `Bearer ${studentAToken}`)
        .send({
          studentId: 'stud-002', // Impersonation attempt
          content: 'Malicious spoofed submission pretending to be student 2.',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/cannot submit homework on behalf of another student/i);
    });

    it('POST /api/v1/homework — Student cannot create homework assignments', async () => {
      const res = await request(app)
        .post('/api/v1/homework')
        .set('Authorization', `Bearer ${studentAToken}`)
        .send({
          title: 'Fake Homework',
          sectionId: 'sec-10a',
          subjectId: 'sub-math',
          dueDate: '2026-12-31',
          totalMarks: 20,
        });

      expect(res.status).toBe(403);
    });
  });

  // =========================================================================
  // 5. Timetable Scope & Section Isolation
  // =========================================================================
  describe('Timetable Enrolled Section Access Control', () => {
    it('GET /api/v1/timetable — should return timetable slots for student section', async () => {
      const res = await request(app)
        .get('/api/v1/timetable')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      // All slots returned must belong to enrolled section sec-10a
      for (const slot of res.body.data) {
        expect(slot.sectionId).toBe('sec-10a');
      }
    });

    it('GET /api/v1/timetable?sectionId=sec-unauthorized — IDOR TEST: Student CANNOT query other class timetables', async () => {
      const res = await request(app)
        .get('/api/v1/timetable?sectionId=sec-unauthorized-section')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only access the timetable for your enrolled section/i);
    });
  });

  // =========================================================================
  // 6. Notices, Events & Documents Access
  // =========================================================================
  describe('Student Access to Institutional Bulletins & Documents', () => {
    it('GET /api/v1/notices — Student can read academic bulletins and circulars', async () => {
      const res = await request(app)
        .get('/api/v1/notices')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('POST /api/v1/notices — Student cannot publish school circulars', async () => {
      const res = await request(app)
        .post('/api/v1/notices')
        .set('Authorization', `Bearer ${studentAToken}`)
        .send({
          title: 'Unauthorized Circular',
          content: 'Content',
          targetAudience: 'ALL',
        });

      expect(res.status).toBe(403);
    });

    it('GET /api/v1/events — Student can view campus events and calendar', async () => {
      const res = await request(app)
        .get('/api/v1/events')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/v1/documents — Student can access curricular documents & handbooks', async () => {
      const res = await request(app)
        .get('/api/v1/documents')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
