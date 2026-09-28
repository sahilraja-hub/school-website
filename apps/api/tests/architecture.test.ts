import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { userRepository } from '../src/repositories/userRepository';
import { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError } from '../src/errors';

describe('Phase 6 — Production Express Backend Architecture Test Suite', () => {
  const app = createApp();

  beforeAll(async () => {
    await userRepository.resetForTesting();
  });

  // 1. Request ID Attribution & Correlation
  describe('1. Request ID Middleware', () => {
    it('automatically generates and attaches X-Request-Id header to every response', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.headers).toHaveProperty('x-request-id');
      expect(res.headers['x-request-id']).toMatch(/^req_/);
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta.requestId).toBe(res.headers['x-request-id']);
    });

    it('preserves client-provided X-Request-Id header across the lifecycle', async () => {
      const customId = 'client-trace-id-abc-12345';
      const res = await request(app).get('/health').set('X-Request-Id', customId);

      expect(res.status).toBe(200);
      expect(res.headers['x-request-id']).toBe(customId);
      expect(res.body.meta.requestId).toBe(customId);
    });
  });

  // 2. Health & Readiness Probes
  describe('2. Health & Readiness Probes', () => {
    it('GET /health returns 200 with service information and memory metrics', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('Oakridge School API');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('database');
      expect(res.body).toHaveProperty('memory');
      expect(res.body.memory).toHaveProperty('heapUsedMB');
    });

    it('GET /api/v1/health returns 200 on versioned endpoint', async () => {
      const res = await request(app).get('/api/v1/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    it('GET /ready returns 200 and confirms process readiness', async () => {
      const res = await request(app).get('/ready');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ready');
      expect(res.body.ready).toBe(true);
      expect(res.body).toHaveProperty('uptime');
    });

    it('GET /api/v1/ready returns 200 on versioned endpoint', async () => {
      const res = await request(app).get('/api/v1/ready');

      expect(res.status).toBe(200);
      expect(res.body.ready).toBe(true);
    });
  });

  // 3. Centralized Error Handling & Typed Errors
  describe('3. Centralized Error Handling & Typed Errors', () => {
    it('returns 404 NotFoundError with consistent JSON format for non-existent routes', async () => {
      const res = await request(app).get('/api/v1/non-existent-endpoint');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('NOT_FOUND');
      const errorMsg = typeof res.body.error === 'object' ? res.body.error.message : res.body.error;
      expect(errorMsg).toContain('Endpoint not found');
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('requestId');
      expect(res.body.meta).toHaveProperty('timestamp');
    });

    it('returns 400 with structured validation errors when body fails Zod schema', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'not-an-email',
        password: '123', // less than 6 chars
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toHaveProperty('email');
      expect(res.body.errors).toHaveProperty('password');
      expect(res.body.errors.email).toContain('Invalid email address');
      expect(res.body.errors.password).toContain('Password must be at least 6 characters');
    });

    it('returns 401 Unauthorized for unauthenticated calls to protected routes', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    it('returns 403 Forbidden for unauthorized roles', async () => {
      const loginRes = await request(app).post('/api/v1/auth/login').send({
        email: 'student@oakridge.edu',
        password: 'Student@123456',
      });
      const token = loginRes.body.data.accessToken;

      const res = await request(app)
        .get('/api/v1/auth/rbac-test/admin')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('FORBIDDEN');
    });
  });

  // 4. Request Flow Architecture (Middleware -> Auth -> Validation -> Controller -> Service -> Repository)
  describe('4. Architecture Flow & Decoupled Layers', () => {
    it('executes admission flow through Controller -> Service -> Repository pipeline', async () => {
      // 1. Submit admission application (Public endpoint with validation)
      const submitRes = await request(app).post('/api/v1/admissions/apply').send({
        studentFirstName: 'Oliver',
        studentLastName: 'Twist',
        dateOfBirth: '2012-05-15',
        gradeApplyingFor: 'GRADE_8',
        parentName: 'Mr. Brownlow',
        parentEmail: 'brownlow@example.org',
        parentPhone: '+1 (555) 332-9011',
        address: '14 Bloomsbury Way, London',
      });

      expect(submitRes.status).toBe(201);
      expect(submitRes.body.success).toBe(true);
      expect(submitRes.body.data).toHaveProperty('applicationNumber');
      const appNum = submitRes.body.data.applicationNumber;

      // 2. Track application status
      const trackRes = await request(app).get(`/api/v1/admissions/track/${appNum}`);
      expect(trackRes.status).toBe(200);
      expect(trackRes.body.success).toBe(true);
      expect(trackRes.body.data.studentName).toBe('Oliver Twist');
      expect(trackRes.body.data.status).toBe('SUBMITTED');

      // 3. Admin updates status (Protected by Auth & RBAC)
      const adminLogin = await request(app).post('/api/v1/auth/login').send({
        email: 'admin@oakridge.edu',
        password: 'Admin@123456',
      });
      const adminToken = adminLogin.body.data.accessToken;

      const listRes = await request(app)
        .get('/api/v1/admissions')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(listRes.status).toBe(200);
      expect(Array.isArray(listRes.body.data)).toBe(true);
    });

    it('gracefully handles not found entities in service layer by throwing NotFoundError', async () => {
      const res = await request(app).get('/api/v1/admissions/track/ADM-DOES-NOT-EXIST-999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('NOT_FOUND');
    });
  });
});
