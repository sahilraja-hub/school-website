import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { Application } from 'express';
import { generateTokens } from '../src/utils/token';

describe('Phase 9 — Global Validation and Error System Suite', () => {
  let app: Application;
  let adminToken: string;
  let studentToken: string;

  beforeAll(() => {
    app = createApp();

    const adminTokens = generateTokens({
      id: 'usr-admin-01',
      email: 'admin@oakridge.edu',
      role: 'ADMIN',
      status: 'ACTIVE',
    });
    adminToken = adminTokens.accessToken;

    const studentTokens = generateTokens({
      id: 'usr-student-01',
      email: 'student@oakridge.edu',
      role: 'STUDENT',
      status: 'ACTIVE',
    });
    studentToken = studentTokens.accessToken;
  });

  // ==============================================================
  // 1. Consistent Error Response Format
  // ==============================================================
  describe('1. Consistent Error Response Envelope', () => {
    it('returns error in consistent schema: { success: false, error: { code, message, details }, meta }', async () => {
      const res = await request(app).get('/api/v1/test-errors/validation');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(res.body.error).toHaveProperty('message');
      expect(Array.isArray(res.body.error.details)).toBe(true);
      expect(res.body.error.details.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('requestId');
      expect(res.body.meta).toHaveProperty('timestamp');
    });
  });

  // ==============================================================
  // 2. All 7 Major Typed Application Errors
  // ==============================================================
  describe('2. Major Typed Application Errors', () => {
    it('handles ValidationError (HTTP 400)', async () => {
      const res = await request(app).get('/api/v1/test-errors/validation');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email', message: 'Email address is invalid' }),
        ])
      );
    });

    it('handles AuthenticationError (HTTP 401)', async () => {
      const res = await request(app).get('/api/v1/test-errors/authentication');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
      expect(res.body.error.message).toContain('Authentication required');
    });

    it('handles AuthorizationError (HTTP 403)', async () => {
      const res = await request(app).get('/api/v1/test-errors/authorization');
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
      expect(res.body.error.message).toContain('Access denied');
    });

    it('handles NotFoundError (HTTP 404)', async () => {
      const res = await request(app).get('/api/v1/test-errors/not-found');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
      expect(res.body.error.message).toContain('not be found');
    });

    it('handles ConflictError (HTTP 409)', async () => {
      const res = await request(app).get('/api/v1/test-errors/conflict');
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('CONFLICT');
      expect(res.body.error.message).toContain('already exists');
    });

    it('handles RateLimitError (HTTP 429)', async () => {
      const res = await request(app).get('/api/v1/test-errors/rate-limit');
      expect(res.status).toBe(429);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(res.body.error.message).toContain('Too many requests');
    });

    it('handles InternalServerError (HTTP 500)', async () => {
      const res = await request(app).get('/api/v1/test-errors/internal');
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INTERNAL_SERVER_ERROR');
    });
  });

  // ==============================================================
  // 3. Validation Across Request Targets: params, query, body, file, auth
  // ==============================================================
  describe('3. Multi-Target Zod Request Validation', () => {
    it('validates Route Params (rejects invalid ID format)', async () => {
      // Endpoint expects non-empty ID parameter
      const res = await request(app)
        .post('/api/v1/test-errors/validate-full/%20') // whitespace only param
        .query({ page: 1, limit: 10 })
        .send({
          email: 'valid@oakridge.edu',
          password: 'Password123!',
          fileMetadata: {
            fileName: 'transcript.pdf',
            fileSize: 1024,
            mimeType: 'application/pdf',
          },
        });

      // Zod or route handling catches empty/invalid param
      expect([400, 404]).toContain(res.status);
    });

    it('validates Query Parameters (rejects invalid page, limit, or sort)', async () => {
      const res = await request(app)
        .post('/api/v1/test-errors/validate-full/valid-id-123')
        .query({ page: -5, limit: 9999 }) // negative page and excessive limit
        .send({
          email: 'valid@oakridge.edu',
          password: 'Password123!',
          fileMetadata: {
            fileName: 'transcript.pdf',
            fileSize: 1024,
            mimeType: 'application/pdf',
          },
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      const details = res.body.error.details;
      expect(details.some((d: any) => d.location === 'query')).toBe(true);
    });

    it('validates Request Body (rejects malformed email format and short password)', async () => {
      const res = await request(app)
        .post('/api/v1/test-errors/validate-full/valid-id-123')
        .query({ page: 1, limit: 10 })
        .send({
          email: 'not-an-email-address',
          password: '',
          fileMetadata: {
            fileName: 'transcript.pdf',
            fileSize: 1024,
            mimeType: 'application/pdf',
          },
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      const details = res.body.error.details;
      expect(details.some((d: any) => d.field === 'email')).toBe(true);
    });

    it('validates File Metadata (rejects oversized files, invalid MIME, and path traversal in filename)', async () => {
      // 1. Path traversal attempt in filename
      const traversalRes = await request(app)
        .post('/api/v1/documents/validate-file')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fileMetadata: {
            fileName: '../../etc/passwd.pdf',
            fileSize: 2048,
            mimeType: 'application/pdf',
          },
        });

      expect(traversalRes.status).toBe(400);
      expect(traversalRes.body.error.code).toBe('VALIDATION_ERROR');
      expect(
        traversalRes.body.error.details.some((d: any) =>
          d.message.includes('traversal')
        )
      ).toBe(true);

      // 2. Disallowed MIME type (executable .exe)
      const mimeRes = await request(app)
        .post('/api/v1/documents/validate-file')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fileMetadata: {
            fileName: 'malware.exe',
            fileSize: 2048,
            mimeType: 'application/x-msdownload',
          },
        });

      expect(mimeRes.status).toBe(400);
      expect(mimeRes.body.error.code).toBe('VALIDATION_ERROR');

      // 3. Oversized file exceeding 25MB
      const sizeRes = await request(app)
        .post('/api/v1/documents/validate-file')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fileMetadata: {
            fileName: 'giant_video.pdf',
            fileSize: 50 * 1024 * 1024, // 50MB
            mimeType: 'application/pdf',
          },
        });

      expect(sizeRes.status).toBe(400);
      expect(sizeRes.body.error.code).toBe('VALIDATION_ERROR');
      expect(
        sizeRes.body.error.details.some((d: any) => d.field === 'fileSize')
      ).toBe(true);
    });

    it('validates Authentication Inputs (password policy enforcement)', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.policy@oakridge.edu',
        password: 'weak', // fails complexity (no uppercase, no special, < 8 chars)
        role: 'STUDENT',
      });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details.some((d: any) => d.field === 'password')).toBe(true);
    });

    it('successfully accepts valid multi-target payload', async () => {
      const res = await request(app)
        .post('/api/v1/test-errors/validate-full/valid-id-123')
        .query({ page: 2, limit: 15, sortOrder: 'asc' })
        .send({
          email: 'scholar.admitted@oakridge.edu',
          password: 'Password123!',
          fileMetadata: {
            fileName: 'honors_diploma.pdf',
            fileSize: 45000,
            mimeType: 'application/pdf',
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('All validations passed successfully');
      expect(res.body.data.params.id).toBe('valid-id-123');
      expect(res.body.data.query.page).toBe(2);
      expect(res.body.data.query.limit).toBe(15);
    });
  });

  // ==============================================================
  // 4. Data Privacy, Secrets Scrubbing & Zero Leakage in Production
  // ==============================================================
  describe('4. Zero Sensitive Leakage & Secrets Scrubbing', () => {
    it('redacts database connection strings, JWT tokens, and password hashes from error responses', async () => {
      const res = await request(app).get('/api/v1/test-errors/secrets-leak');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);

      const responseString = JSON.stringify(res.body);
      // Ensure secrets are stripped
      expect(responseString).not.toContain('SuperSecretPass123');
      expect(responseString).not.toContain('mongodb://admin');
      expect(responseString).not.toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
      expect(responseString).not.toContain('$2a$12$e8Y5dF139A8Y01Kj.P2OZu5zP1');
      // Ensure redaction placeholders are present
      expect(responseString).toContain('[DATABASE_URI_REDACTED]');
      expect(responseString).toContain('[TOKEN_REDACTED]');
      expect(responseString).toContain('[PASSWORD_HASH_REDACTED]');
    });

    it('shields internal database implementation details on Prisma ORM unique violations', async () => {
      const res = await request(app).get('/api/v1/test-errors/prisma-p2002');

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('CONFLICT');
      // In development/test it gives a clean message; raw SQL/driver queries are not leaked
      expect(res.body.error.message).toContain('already exists');
    });

    it('safely catches unexpected unhandled exceptions without leaking stack trace in production mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      try {
        process.env.NODE_ENV = 'production';
        const res = await request(app).get('/api/v1/test-errors/unexpected-throw');

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('INTERNAL_SERVER_ERROR');
        expect(res.body.error.message).toBe('An unexpected error occurred. Please contact support.');
        // Verify zero stack trace in production response
        expect(res.body).not.toHaveProperty('stack');
        expect(res.body.meta).not.toHaveProperty('stack');
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });

    it('rejects malformed JSON syntax with 400 MALFORMED_JSON', async () => {
      const res = await request(app)
        .post('/api/v1/test-errors/validate-full/test-id')
        .set('Content-Type', 'application/json')
        .send('{ "email": "broken-json, ');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('MALFORMED_JSON');
    });
  });
});
