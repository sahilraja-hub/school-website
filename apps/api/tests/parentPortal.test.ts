import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { generateTokens } from '../src/utils/token';

describe('Phase 13 — Parent Portal & Multi-Child Authorization Suite', () => {
  const app = createApp();

  // Parent 1: David Vance (usr-parent-01, par-001) -> Linked children: stud-001 (Liam) & stud-003 (Lucas)
  let parent1Token: string;

  // Parent 2: Robert Watson (usr-parent-02, par-002) -> Linked child: stud-002 (Emma)
  let parent2Token: string;

  // Student 1: Liam Vance
  let student1Token: string;

  beforeAll(async () => {
    parent1Token = generateTokens({
      id: 'usr-parent-01',
      email: 'parent@oakridge.edu',
      role: 'PARENT',
      status: 'ACTIVE',
    }).accessToken;

    parent2Token = generateTokens({
      id: 'usr-parent-02',
      email: 'parent2@oakridge.edu',
      role: 'PARENT',
      status: 'ACTIVE',
    }).accessToken;

    student1Token = generateTokens({
      id: 'usr-student-01',
      email: 'student@oakridge.edu',
      role: 'STUDENT',
      status: 'ACTIVE',
    }).accessToken;
  });

  // =========================================================================
  // 1. Parent Profile & Multi-Child Directory (GET /api/v1/parents/me)
  // =========================================================================
  describe('Parent Profile & Linked Children Retrieval', () => {
    it('GET /api/v1/parents/me — should return authenticated parent profile and all linked children', async () => {
      const res = await request(app)
        .get('/api/v1/parents/me')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('par-001');
      expect(res.body.data.relationship).toBe('FATHER');

      // Verify multiple children support
      const children = res.body.data.children;
      expect(Array.isArray(children)).toBe(true);
      expect(children.length).toBe(2);

      const childIds = children.map((c: any) => c.id);
      expect(childIds).toContain('stud-001'); // Liam Vance
      expect(childIds).toContain('stud-003'); // Lucas Vance
      expect(childIds).not.toContain('stud-002'); // Emma Watson (unrelated)
    });

    it('GET /api/v1/parents/me — should reject unauthenticated access', async () => {
      const res = await request(app).get('/api/v1/parents/me');
      expect(res.status).toBe(401);
    });

    it('GET /api/v1/parents/me — should deny student accessing parent profile endpoint', async () => {
      const res = await request(app)
        .get('/api/v1/parents/me')
        .set('Authorization', `Bearer ${student1Token}`);

      expect(res.status).toBe(403);
    });

    it('GET /api/v1/parents/:id — Parent 1 can view own parent profile', async () => {
      const res = await request(app)
        .get('/api/v1/parents/par-001')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('par-001');
    });

    it('GET /api/v1/parents/:id — IDOR TEST: Parent 1 CANNOT view Parent 2 profile', async () => {
      const res = await request(app)
        .get('/api/v1/parents/par-002')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only view your own parent record/i);
    });
  });

  // =========================================================================
  // 2. Valid Child Access (Parent 1 -> Child 1: stud-001)
  // =========================================================================
  describe('Valid Child Access (Parent 1 -> stud-001)', () => {
    it('GET /api/v1/students/stud-001 — Parent 1 can view linked child profile', async () => {
      const res = await request(app)
        .get('/api/v1/students/stud-001')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('stud-001');
      expect(res.body.data.admissionNumber).toBe('ADM-2026-0089');
    });

    it('GET /api/v1/attendance?studentId=stud-001 — Parent 1 can view child attendance', async () => {
      const res = await request(app)
        .get('/api/v1/attendance?studentId=stud-001')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      for (const item of res.body.data) {
        expect(item.studentId).toBe('stud-001');
      }
    });

    it('GET /api/v1/attendance/stats?studentId=stud-001 — Parent 1 can view child attendance statistics', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/stats?studentId=stud-001')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('attendanceRate');
    });

    it('GET /api/v1/results?studentId=stud-001 — Parent 1 can view child grades', async () => {
      const res = await request(app)
        .get('/api/v1/results?studentId=stud-001')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      for (const item of res.body.data) {
        expect(item.studentId).toBe('stud-001');
      }
    });

    it('GET /api/v1/results/res-001 — Parent 1 can view child specific result details', async () => {
      const res = await request(app)
        .get('/api/v1/results/res-001')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('res-001');
      expect(res.body.data.studentId).toBe('stud-001');
    });

    it('GET /api/v1/fees/invoices?studentId=stud-001 — Parent 1 can view child invoices', async () => {
      const res = await request(app)
        .get('/api/v1/fees/invoices?studentId=stud-001')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.some((i: any) => i.studentId === 'stud-001')).toBe(true);
    });

    it('GET /api/v1/fees/invoices/inv-001 — Parent 1 can view child invoice details', async () => {
      const res = await request(app)
        .get('/api/v1/fees/invoices/inv-001')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('inv-001');
      expect(res.body.data.studentId).toBe('stud-001');
    });

    it('GET /api/v1/timetable?sectionId=sec-10a — Parent 1 can view timetable for child enrolled section', async () => {
      const res = await request(app)
        .get('/api/v1/timetable?sectionId=sec-10a')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // =========================================================================
  // 3. Multiple Children Support (Parent 1 -> Child 2: stud-003)
  // =========================================================================
  describe('Multiple Children Support (Parent 1 -> stud-003 Lucas Vance)', () => {
    it('GET /api/v1/students/stud-003 — Parent 1 can access second linked child profile', async () => {
      const res = await request(app)
        .get('/api/v1/students/stud-003')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('stud-003');
      expect(res.body.data.admissionNumber).toBe('ADM-2026-0091');
    });

    it('GET /api/v1/attendance?studentId=stud-003 — Parent 1 can access second child attendance', async () => {
      const res = await request(app)
        .get('/api/v1/attendance?studentId=stud-003')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      for (const item of res.body.data) {
        expect(item.studentId).toBe('stud-003');
      }
    });

    it('GET /api/v1/results?studentId=stud-003 — Parent 1 can access second child results', async () => {
      const res = await request(app)
        .get('/api/v1/results?studentId=stud-003')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      for (const item of res.body.data) {
        expect(item.studentId).toBe('stud-003');
      }
    });

    it('GET /api/v1/fees/invoices?studentId=stud-003 — Parent 1 can access second child invoices', async () => {
      const res = await request(app)
        .get('/api/v1/fees/invoices?studentId=stud-003')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.some((i: any) => i.studentId === 'stud-003')).toBe(true);
    });

    it('GET /api/v1/timetable?sectionId=sec-10b — Parent 1 can access second child section timetable', async () => {
      const res = await request(app)
        .get('/api/v1/timetable?sectionId=sec-10b')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // =========================================================================
  // 4. Unrelated Child Access (IDOR Prevention: Parent 1 -> stud-002 Emma Watson)
  // =========================================================================
  describe('Unrelated Child Access (IDOR Prevention: Parent 1 -> stud-002)', () => {
    it('GET /api/v1/students/stud-002 — IDOR TEST: Parent 1 CANNOT access unrelated child profile', async () => {
      const res = await request(app)
        .get('/api/v1/students/stud-002')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only access student records of your linked children/i);
    });

    it('GET /api/v1/attendance?studentId=stud-002 — IDOR TEST: Parent 1 CANNOT query unrelated child attendance', async () => {
      const res = await request(app)
        .get('/api/v1/attendance?studentId=stud-002')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only access attendance records of your linked children/i);
    });

    it('GET /api/v1/attendance/stats?studentId=stud-002 — IDOR TEST: Parent 1 CANNOT query unrelated child stats', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/stats?studentId=stud-002')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only access attendance statistics of your linked children/i);
    });

    it('GET /api/v1/results?studentId=stud-002 — IDOR TEST: Parent 1 CANNOT query unrelated child results', async () => {
      const res = await request(app)
        .get('/api/v1/results?studentId=stud-002')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only access exam results of your linked children/i);
    });

    it('GET /api/v1/results/res-002 — IDOR TEST: Parent 1 CANNOT view unrelated child result directly', async () => {
      const res = await request(app)
        .get('/api/v1/results/res-002')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only access exam results of your linked children/i);
    });

    it('GET /api/v1/fees/invoices?studentId=stud-002 — IDOR TEST: Parent 1 CANNOT query unrelated child invoices', async () => {
      const res = await request(app)
        .get('/api/v1/fees/invoices?studentId=stud-002')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only view invoices of your linked children/i);
    });

    it('GET /api/v1/fees/invoices/inv-002 — IDOR TEST: Parent 1 CANNOT view unrelated child invoice directly', async () => {
      const res = await request(app)
        .get('/api/v1/fees/invoices/inv-002')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only view invoices of your linked children/i);
    });

    it('POST /api/v1/payments — IDOR TEST: Parent 1 CANNOT submit payment for unrelated child invoice', async () => {
      const res = await request(app)
        .post('/api/v1/payments')
        .set('Authorization', `Bearer ${parent1Token}`)
        .send({
          invoiceId: 'inv-002', // Invoice belongs to stud-002
          amount: 4500.00,
          paymentMethod: 'ONLINE',
          transactionRef: 'TXN-SPOOFED-001',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only pay invoices of your linked children/i);
    });

    it('GET /api/v1/timetable?sectionId=sec-unrelated — IDOR TEST: Parent 1 CANNOT query unrelated section timetable', async () => {
      const res = await request(app)
        .get('/api/v1/timetable?sectionId=sec-unrelated-cohort')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toMatch(/only access timetable for your linked children/i);
    });
  });

  // =========================================================================
  // 5. Homework Privacy Protection for Parents
  // =========================================================================
  describe('Homework Coursework Privacy Protection for Parents', () => {
    it('GET /api/v1/homework/hw-001 — Parent 1 only sees submissions for their linked children', async () => {
      const res = await request(app)
        .get('/api/v1/homework/hw-001')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const submissions = res.body.data.submissions || [];
      // Must not contain stud-002 (Emma Watson)
      expect(submissions.some((s: any) => s.studentId === 'stud-002')).toBe(false);

      // Must only contain submissions for stud-001 or stud-003
      for (const s of submissions) {
        expect(['stud-001', 'stud-003']).toContain(s.studentId);
      }
    });

    it('GET /api/v1/homework/hw-001 — Parent 2 only sees submissions for Emma Watson', async () => {
      const res = await request(app)
        .get('/api/v1/homework/hw-001')
        .set('Authorization', `Bearer ${parent2Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const submissions = res.body.data.submissions || [];
      expect(submissions.some((s: any) => s.studentId === 'stud-001')).toBe(false);
      expect(submissions.some((s: any) => s.studentId === 'stud-003')).toBe(false);
      expect(submissions.every((s: any) => s.studentId === 'stud-002')).toBe(true);
    });
  });

  // =========================================================================
  // 6. Institutional Bulletins, Events & Documents Access
  // =========================================================================
  describe('Parent Access to Notices, Events, and Documents', () => {
    it('GET /api/v1/notices — Parent can access circulars & school announcements', async () => {
      const res = await request(app)
        .get('/api/v1/notices')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/v1/events — Parent can access campus events calendar', async () => {
      const res = await request(app)
        .get('/api/v1/events')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/v1/documents — Parent can access curriculum handbooks & calendar', async () => {
      const res = await request(app)
        .get('/api/v1/documents')
        .set('Authorization', `Bearer ${parent1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
