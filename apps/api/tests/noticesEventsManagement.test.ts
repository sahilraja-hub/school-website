import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { generateTokens } from '../src/utils/token';

describe('PHASE 15 — Notice and Event Management Test Suite', () => {
  const app = createApp();
  let adminToken: string;
  let teacherToken: string;
  let studentToken: string;
  let parentToken: string;

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

    parentToken = generateTokens({
      id: 'usr-parent-01',
      email: 'parent@oakridge.edu',
      role: 'PARENT',
      status: 'ACTIVE',
    }).accessToken;
  });

  // =========================================================================
  // 1. NOTICE MANAGEMENT: CRUD & LIFECYCLE (CREATE, EDIT, PUBLISH, UNPUBLISH, ARCHIVE, DELETE)
  // =========================================================================
  describe('Notice CRUD & Lifecycle Operations', () => {
    let createdNoticeId: string;

    it('should allow admin to create a notice with all Phase 15 fields as DRAFT', async () => {
      const res = await request(app)
        .post('/api/v1/notices')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Annual Science Fair Guidelines 2026',
          description: 'Detailed rubric and registration steps for secondary school science exhibits.',
          category: 'ACADEMIC',
          publishDate: '2026-10-01T09:00:00.000Z',
          expiryDate: '2026-11-01T18:00:00.000Z',
          attachment: 'https://storage.oakridge.edu/notices/science_fair_guidelines.pdf',
          status: 'DRAFT',
          isPinned: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe('Annual Science Fair Guidelines 2026');
      expect(res.body.data.description).toBe('Detailed rubric and registration steps for secondary school science exhibits.');
      expect(res.body.data.category).toBe('ACADEMIC');
      expect(res.body.data.status).toBe('DRAFT');
      expect(res.body.data.attachment).toBe('https://storage.oakridge.edu/notices/science_fair_guidelines.pdf');
      expect(res.body.data.isPinned).toBe(true);

      createdNoticeId = res.body.data.id;
    });

    it('should allow admin to edit notice fields', async () => {
      const res = await request(app)
        .patch(`/api/v1/notices/${createdNoticeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Revised Science Fair Guidelines 2026',
          description: 'Updated rubric with new environmental sciences section.',
          category: 'SCIENCE',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Revised Science Fair Guidelines 2026');
      expect(res.body.data.description).toBe('Updated rubric with new environmental sciences section.');
      expect(res.body.data.category).toBe('SCIENCE');
    });

    it('should allow admin to publish notice via lifecycle endpoint', async () => {
      const res = await request(app)
        .post(`/api/v1/notices/${createdNoticeId}/publish`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PUBLISHED');
      expect(res.body.data.publishDate).toBeDefined();
    });

    it('should allow admin to unpublish notice back to DRAFT', async () => {
      const res = await request(app)
        .post(`/api/v1/notices/${createdNoticeId}/unpublish`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('DRAFT');
    });

    it('should allow admin to archive notice via lifecycle endpoint', async () => {
      const res = await request(app)
        .post(`/api/v1/notices/${createdNoticeId}/archive`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ARCHIVED');
    });

    it('should allow admin to delete notice and confirm it is gone', async () => {
      const res = await request(app)
        .delete(`/api/v1/notices/${createdNoticeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify 404 when querying deleted notice
      const checkRes = await request(app)
        .get(`/api/v1/notices/${createdNoticeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(checkRes.status).toBe(404);
    });
  });

  // =========================================================================
  // 2. NOTICE SEARCH, FILTERING & PAGINATION
  // =========================================================================
  describe('Notice Search, Filtering, and Pagination', () => {
    let testNoticeIds: string[] = [];

    beforeAll(async () => {
      const noticesData = [
        {
          title: 'Math Olympiad Final Round Registration',
          description: 'Registration closes Friday for regional math qualifiers.',
          category: 'COMPETITION',
          status: 'PUBLISHED',
        },
        {
          title: 'Varsity Basketball Tryouts',
          description: 'Tryouts open to high school students in gymnasium.',
          category: 'SPORTS',
          status: 'PUBLISHED',
        },
        {
          title: 'Internal Faculty Meeting Agenda',
          description: 'Staff-only preparation notes for curriculum review.',
          category: 'ADMINISTRATIVE',
          status: 'DRAFT',
        },
        {
          title: 'Winter Concert 2025 Archive Notice',
          description: 'Historical archive notice of past winter concert program.',
          category: 'ARTS',
          status: 'ARCHIVED',
        },
      ];

      for (const item of noticesData) {
        const res = await request(app)
          .post('/api/v1/notices')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(item);
        testNoticeIds.push(res.body.data.id);
      }
    });

    it('should filter notices by category for admin', async () => {
      const res = await request(app)
        .get('/api/v1/notices?category=SPORTS')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.some((n: any) => n.title.includes('Varsity Basketball'))).toBe(true);
      expect(res.body.data.every((n: any) => n.category === 'SPORTS')).toBe(true);
    });

    it('should filter notices by status (DRAFT) for admin', async () => {
      const res = await request(app)
        .get('/api/v1/notices?status=DRAFT')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.every((n: any) => n.status === 'DRAFT')).toBe(true);
      expect(res.body.data.some((n: any) => n.title.includes('Internal Faculty Meeting'))).toBe(true);
    });

    it('should search notices by query text matching title or description', async () => {
      const res = await request(app)
        .get('/api/v1/notices?search=Olympiad')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].title).toContain('Math Olympiad');
    });

    it('should paginate notices with page and limit parameters', async () => {
      const res = await request(app)
        .get('/api/v1/notices?page=1&limit=2')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(2);
      expect(res.body.meta.pagination.page).toBe(1);
      expect(res.body.meta.pagination.limit).toBe(2);
      expect(res.body.meta.pagination.totalPages).toBeGreaterThanOrEqual(1);
    });
  });

  // =========================================================================
  // 3. NOTICE PUBLIC VISIBILITY & EXPIRY RESTRICTIONS
  // =========================================================================
  describe('Notice Public Visibility Constraints', () => {
    let draftNoticeId: string;
    let archivedNoticeId: string;
    let publishedNoticeId: string;
    let expiredNoticeId: string;

    beforeAll(async () => {
      // Draft notice
      const draftRes = await request(app)
        .post('/api/v1/notices')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Secret Draft Policy Notice',
          description: 'This is an unapproved policy draft.',
          category: 'GENERAL',
          status: 'DRAFT',
        });
      draftNoticeId = draftRes.body.data.id;

      // Archived notice
      const archRes = await request(app)
        .post('/api/v1/notices')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Old Archived Notice From 2024',
          description: 'This is archived.',
          category: 'GENERAL',
          status: 'ARCHIVED',
        });
      archivedNoticeId = archRes.body.data.id;

      // Active published notice
      const pubRes = await request(app)
        .post('/api/v1/notices')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Public Welcome Back To School 2026',
          description: 'Welcome students and parents to the new academic term.',
          category: 'GENERAL',
          status: 'PUBLISHED',
          expiryDate: '2029-12-31T23:59:59.000Z',
        });
      publishedNoticeId = pubRes.body.data.id;

      // Expired published notice
      const expRes = await request(app)
        .post('/api/v1/notices')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Past Expired Deadline Notice',
          description: 'This deadline passed last month.',
          category: 'GENERAL',
          status: 'PUBLISHED',
          expiryDate: '2024-01-01T00:00:00.000Z',
        });
      expiredNoticeId = expRes.body.data.id;
    });

    it('public unauthenticated user should ONLY see published active notices', async () => {
      const res = await request(app).get('/api/v1/notices');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const items = res.body.data;
      // All items must be PUBLISHED
      for (const item of items) {
        expect(item.status).toBe('PUBLISHED');
      }

      // Must not contain draft or archived
      const ids = items.map((i: any) => i.id);
      expect(ids).not.toContain(draftNoticeId);
      expect(ids).not.toContain(archivedNoticeId);

      // Must not contain expired notice
      expect(ids).not.toContain(expiredNoticeId);

      // Must contain active published notice
      expect(ids).toContain(publishedNoticeId);
    });

    it('public unauthenticated user should receive 404 when querying a draft notice by ID', async () => {
      const res = await request(app).get(`/api/v1/notices/${draftNoticeId}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('public unauthenticated user should receive 404 when querying an archived notice by ID', async () => {
      const res = await request(app).get(`/api/v1/notices/${archivedNoticeId}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('admin should be able to view draft notice by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/notices/${draftNoticeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(draftNoticeId);
    });
  });

  // =========================================================================
  // 4. EVENT MANAGEMENT: CRUD & LIFECYCLE (CREATE, EDIT, PUBLISH, UNPUBLISH, ARCHIVE, DELETE)
  // =========================================================================
  describe('Event CRUD & Lifecycle Operations', () => {
    let createdEventId: string;

    it('should allow admin to create an event with all Phase 15 fields as DRAFT', async () => {
      const res = await request(app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Oakridge Founder Gala 2026',
          description: 'An evening celebrating academic excellence, donors, and alumni.',
          date: '2026-11-20',
          startTime: '18:00',
          endTime: '22:00',
          location: 'Grand Ballroom, Oakridge Campus',
          image: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
          status: 'DRAFT',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe('Oakridge Founder Gala 2026');
      expect(res.body.data.date).toBe('2026-11-20');
      expect(res.body.data.startTime).toBe('18:00');
      expect(res.body.data.endTime).toBe('22:00');
      expect(res.body.data.location).toBe('Grand Ballroom, Oakridge Campus');
      expect(res.body.data.image).toBe('https://images.unsplash.com/photo-1511578314322-379afb476865');
      expect(res.body.data.status).toBe('DRAFT');

      createdEventId = res.body.data.id;
    });

    it('should allow admin to edit event fields', async () => {
      const res = await request(app)
        .patch(`/api/v1/events/${createdEventId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Oakridge Centennial Gala 2026',
          location: 'Main Amphitheater & Gardens',
          startTime: '18:30',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Oakridge Centennial Gala 2026');
      expect(res.body.data.location).toBe('Main Amphitheater & Gardens');
      expect(res.body.data.startTime).toBe('18:30');
    });

    it('should allow admin to publish event via lifecycle endpoint', async () => {
      const res = await request(app)
        .post(`/api/v1/events/${createdEventId}/publish`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PUBLISHED');
      expect(res.body.data.isPublic).toBe(true);
    });

    it('should allow admin to unpublish event back to DRAFT', async () => {
      const res = await request(app)
        .post(`/api/v1/events/${createdEventId}/unpublish`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('DRAFT');
      expect(res.body.data.isPublic).toBe(false);
    });

    it('should allow admin to archive event via lifecycle endpoint', async () => {
      const res = await request(app)
        .post(`/api/v1/events/${createdEventId}/archive`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ARCHIVED');
    });

    it('should allow admin to delete event and verify 404', async () => {
      const res = await request(app)
        .delete(`/api/v1/events/${createdEventId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const checkRes = await request(app)
        .get(`/api/v1/events/${createdEventId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(checkRes.status).toBe(404);
    });
  });

  // =========================================================================
  // 5. EVENT SEARCH, FILTERING & PUBLIC VISIBILITY
  // =========================================================================
  describe('Event Search, Filtering & Public Visibility', () => {
    let publicEventId: string;
    let draftEventId: string;
    let archivedEventId: string;

    beforeAll(async () => {
      const pubRes = await request(app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Robotics Championship Finals',
          description: 'Statewide robotics league championship hosted in Innovation Hall.',
          date: '2026-12-05',
          startTime: '09:00',
          endTime: '17:00',
          location: 'Innovation Hall',
          status: 'PUBLISHED',
        });
      publicEventId = pubRes.body.data.id;

      const draftRes = await request(app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Unannounced VIP Campus Tour',
          description: 'Internal planning draft for VIP state delegates.',
          date: '2026-12-10',
          startTime: '10:00',
          endTime: '12:00',
          location: 'Executive Wing',
          status: 'DRAFT',
        });
      draftEventId = draftRes.body.data.id;

      const archRes = await request(app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Graduation Ceremony 2025 Past Event',
          description: 'Archived convocation ceremony from previous academic year.',
          date: '2025-06-15',
          startTime: '14:00',
          endTime: '17:00',
          location: 'Grand Quad',
          status: 'ARCHIVED',
        });
      archivedEventId = archRes.body.data.id;
    });

    it('public unauthenticated user should ONLY see published events in list', async () => {
      const res = await request(app).get('/api/v1/events');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const items = res.body.data;
      for (const item of items) {
        expect(item.status).toBe('PUBLISHED');
      }

      const ids = items.map((e: any) => e.id);
      expect(ids).toContain(publicEventId);
      expect(ids).not.toContain(draftEventId);
      expect(ids).not.toContain(archivedEventId);
    });

    it('public unauthenticated user should receive 404 for draft event by ID', async () => {
      const res = await request(app).get(`/api/v1/events/${draftEventId}`);
      expect(res.status).toBe(404);
    });

    it('public unauthenticated user should receive 404 for archived event by ID', async () => {
      const res = await request(app).get(`/api/v1/events/${archivedEventId}`);
      expect(res.status).toBe(404);
    });

    it('admin can filter events by status (DRAFT / ARCHIVED)', async () => {
      const res = await request(app)
        .get('/api/v1/events?status=DRAFT')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.every((e: any) => e.status === 'DRAFT')).toBe(true);
      expect(res.body.data.some((e: any) => e.id === draftEventId)).toBe(true);
    });

    it('admin can search events by keyword', async () => {
      const res = await request(app)
        .get('/api/v1/events?search=Robotics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.some((e: any) => e.id === publicEventId)).toBe(true);
    });
  });

  // =========================================================================
  // 6. PERMISSIONS & ROLE-BASED ACCESS CONTROL
  // =========================================================================
  describe('Permissions and Role-Based Access Control', () => {
    it('should reject unauthenticated request to create notice', async () => {
      const res = await request(app)
        .post('/api/v1/notices')
        .send({
          title: 'Unauthorized Notice Attempt',
          description: 'Should fail authentication',
          category: 'GENERAL',
        });

      expect(res.status).toBe(401);
    });

    it('should reject non-admin (teacher/student/parent) creating a notice', async () => {
      const studentRes = await request(app)
        .post('/api/v1/notices')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Student Attempting To Post Notice',
          description: 'Should fail with 403 Forbidden',
          category: 'GENERAL',
        });
      expect(studentRes.status).toBe(403);

      const parentRes = await request(app)
        .post('/api/v1/notices')
        .set('Authorization', `Bearer ${parentToken}`)
        .send({
          title: 'Parent Attempting To Post Notice',
          description: 'Should fail with 403 Forbidden',
          category: 'GENERAL',
        });
      expect(parentRes.status).toBe(403);

      const teacherRes = await request(app)
        .post('/api/v1/notices')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          title: 'Teacher Attempting To Post Notice Directly',
          description: 'Should fail with 403 Forbidden',
          category: 'GENERAL',
        });
      expect(teacherRes.status).toBe(403);
    });

    it('should reject non-admin publishing an event', async () => {
      const res = await request(app)
        .post('/api/v1/events/evt-001/publish')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
    });

    it('should reject non-admin deleting an event or notice', async () => {
      const noticeRes = await request(app)
        .delete('/api/v1/notices/not-001')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(noticeRes.status).toBe(403);

      const eventRes = await request(app)
        .delete('/api/v1/events/evt-001')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(eventRes.status).toBe(403);
    });
  });
});
