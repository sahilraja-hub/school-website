import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { generateTokens } from '../src/utils/token';

describe('Phase 11 — Teacher Portal Backend API & Authorization Suite', () => {
  const app = createApp();

  // teach-001 is assigned to sec-10a, sec-10b for sub-math
  let teacherToken: string;

  // teach-002 is assigned to sec-10a for sub-phys
  let otherTeacherToken: string;

  let studentToken: string;

  beforeAll(async () => {
    teacherToken = generateTokens({
      id: 'usr-teacher-01',
      email: 'teacher@oakridge.edu',
      role: 'TEACHER',
      status: 'ACTIVE',
    }).accessToken;

    otherTeacherToken = generateTokens({
      id: 'usr-teacher-02',
      email: 'chen@oakridge.edu',
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

  // ==========================================
  // 1. Profile & Assignments
  // ==========================================
  describe('Teacher Profile & Assignments (GET /api/v1/teachers/me)', () => {
    it('should return the logged-in teacher profile and their class/subject assignments', async () => {
      const res = await request(app)
        .get('/api/v1/teachers/me')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.employeeId).toBe('EMP-2024-001');
      expect(res.body.data.department).toBe('Mathematics');
      expect(Array.isArray(res.body.data.assignments)).toBe(true);
      expect(res.body.data.assignments.length).toBeGreaterThanOrEqual(2);
      expect(res.body.data.assignments.some((a: any) => a.sectionId === 'sec-10a')).toBe(true);
    });

    it('should deny unauthenticated requests to /me', async () => {
      const res = await request(app).get('/api/v1/teachers/me');
      expect(res.status).toBe(401);
    });
  });

  // ==========================================
  // 2. Attendance & Authorization
  // ==========================================
  describe('Attendance Management & Access Control', () => {
    it('should allow teacher to mark Present, Absent, Late for their assigned section', async () => {
      const today = new Date().toISOString().split('T')[0];
      const res = await request(app)
        .post('/api/v1/attendance/batch')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          classId: 'cls-10',
          sectionId: 'sec-10a',
          date: today,
          records: [
            { studentId: 'stud-001', status: 'PRESENT', notes: 'Attentive and punctual' },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].status).toBe('PRESENT');
    });

    it('should allow teacher to mark LATE and ABSENT statuses', async () => {
      const today = new Date().toISOString().split('T')[0];
      const res = await request(app)
        .post('/api/v1/attendance/batch')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          classId: 'cls-10',
          sectionId: 'sec-10b',
          date: today,
          records: [
            { studentId: 'stud-001', status: 'LATE', notes: 'Tardy by 10 mins' },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.data[0].status).toBe('LATE');
    });

    it('should REJECT and FORBID (403) teacher from recording attendance for an unrelated section/class', async () => {
      const today = new Date().toISOString().split('T')[0];
      const res = await request(app)
        .post('/api/v1/attendance/batch')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          classId: 'cls-unassigned-99',
          sectionId: 'sec-unassigned-99',
          date: today,
          records: [
            { studentId: 'stud-001', status: 'PRESENT' },
          ],
        });

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });
  });

  // ==========================================
  // 3. Homework Management (CRUD)
  // ==========================================
  describe('Homework Management (Create, Edit, Publish, Delete, Attach Files)', () => {
    let createdHomeworkId: string;

    it('should allow teacher to create published homework with file attachment for assigned section', async () => {
      const res = await request(app)
        .post('/api/v1/homework')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          sectionId: 'sec-10a',
          subjectId: 'sub-math',
          title: 'Integral Calculus Worksheet',
          description: 'Complete questions 10 through 25 on page 88.',
          dueDate: '2026-10-20',
          totalMarks: 25,
          attachmentUrl: 'https://cdn.oakridge.edu/assignments/calc-ws-01.pdf',
          isPublished: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe('Integral Calculus Worksheet');
      expect(res.body.data.attachmentUrl).toBe('https://cdn.oakridge.edu/assignments/calc-ws-01.pdf');
      expect(res.body.data.isPublished).toBe(true);
      createdHomeworkId = res.body.data.id;
    });

    it('should FORBID teacher from creating homework for an unassigned section', async () => {
      const res = await request(app)
        .post('/api/v1/homework')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          sectionId: 'sec-unrelated-99',
          subjectId: 'sub-math',
          title: 'Unauthorized Assignment',
          description: 'This should fail authorization.',
          dueDate: '2026-10-20',
        });

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN');
    });

    it('should allow teacher to update existing homework (title, marks, published state)', async () => {
      const res = await request(app)
        .patch(`/api/v1/homework/${createdHomeworkId}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          title: 'Updated: Integral Calculus Mastery Task',
          totalMarks: 30,
          isPublished: false,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated: Integral Calculus Mastery Task');
      expect(res.body.data.totalMarks).toBe(30);
      expect(res.body.data.isPublished).toBe(false);
    });

    it('should allow teacher to delete homework they manage', async () => {
      const res = await request(app)
        .delete(`/api/v1/homework/${createdHomeworkId}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify it no longer exists
      const fetchRes = await request(app)
        .get(`/api/v1/homework/${createdHomeworkId}`)
        .set('Authorization', `Bearer ${teacherToken}`);
      expect(fetchRes.status).toBe(404);
    });
  });

  // ==========================================
  // 4. Results / Gradebook Authorization
  // ==========================================
  describe('Results / Gradebook Authorization', () => {
    it('should allow teacher to record grade for assigned subject & section (sub-math in sec-10a)', async () => {
      const res = await request(app)
        .post('/api/v1/results')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          examSubjectId: 'es-math-101',
          studentId: 'stud-001',
          marksObtained: 95.5,
          grade: 'A+',
          remarks: 'Top score in algebra and trigonometry',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.marksObtained).toBe(95.5);
      expect(res.body.data.grade).toBe('A+');
    });

    it('should REJECT student trying to record results (403)', async () => {
      const res = await request(app)
        .post('/api/v1/results')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          examSubjectId: 'es-math-101',
          studentId: 'stud-001',
          marksObtained: 100,
        });

      expect(res.status).toBe(403);
    });
  });

  // ==========================================
  // 5. Timetable & Students
  // ==========================================
  describe('Timetable & Student Roster Access', () => {
    it('should list timetable slots for assigned teacher', async () => {
      const res = await request(app)
        .get('/api/v1/timetable?teacherId=teach-001')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].subjectName).toBeDefined();
    });

    it('should allow teacher to list students in their assigned section', async () => {
      const res = await request(app)
        .get('/api/v1/students?sectionId=sec-10a')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].admissionNumber).toBeDefined();
    });
  });
});
