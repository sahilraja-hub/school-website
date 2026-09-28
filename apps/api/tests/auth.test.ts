import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app';
import { config } from '../src/config';
import { userRepository } from '../src/repositories/userRepository';
import { UserRole } from '@school/shared';

describe('Phase 5 — Secure Authentication & RBAC Test Suite', () => {
  const app = createApp();

  beforeAll(async () => {
    // Ensure repository has default test users initialized
    await userRepository.resetForTesting();
  });

  beforeEach(async () => {
    // Reset state before each test to guarantee test isolation
    await userRepository.resetForTesting();
  });

  // 1. Valid Login
  describe('1. Valid Login', () => {
    it('authenticates valid credentials, sets HTTP-only cookie, and returns access token with user profile', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@oakridge.edu',
          password: 'Admin@123456',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data.user).toMatchObject({
        email: 'admin@oakridge.edu',
        role: 'ADMIN',
        status: 'ACTIVE',
      });

      // Verify HTTP-only refreshToken cookie
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const refreshCookie = Array.isArray(cookies) ? cookies.find((c: string) => c.startsWith('refreshToken=')) : cookies;
      expect(refreshCookie).toBeDefined();
      expect(refreshCookie).toContain('HttpOnly');
    });

    it('allows SUPER_ADMIN to log in successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'superadmin@oakridge.edu',
          password: 'SuperAdmin@123456',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('SUPER_ADMIN');
    });
  });

  // 2. Invalid Login
  describe('2. Invalid Login', () => {
    it('rejects incorrect password with 401 and tracks remaining attempts', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'teacher@oakridge.edu',
          password: 'WrongPassword!999',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('INVALID_CREDENTIALS');
      expect(res.body).toHaveProperty('attemptsLeft');
      expect(res.body.attemptsLeft).toBe(4);
    });

    it('rejects non-existent email with 401 without revealing user existence', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'unknown.ghost@oakridge.edu',
          password: 'AnyPassword@123',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('INVALID_CREDENTIALS');
    });
  });

  // 3. Logout & Token Invalidation
  describe('3. Logout & Token Invalidation', () => {
    it('invalidates refresh token and clears HTTP-only cookie on logout', async () => {
      // Step A: Login
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'student@oakridge.edu',
          password: 'Student@123456',
        });

      const cookies = loginRes.headers['set-cookie'];
      const rawCookie = Array.isArray(cookies) ? cookies[0] : cookies;

      // Step B: Logout
      const logoutRes = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', rawCookie);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);

      // Verify cookie was cleared (expires in past / maxAge 0)
      const clearedCookies = logoutRes.headers['set-cookie'];
      const clearedRaw = Array.isArray(clearedCookies) ? clearedCookies[0] : clearedCookies;
      expect(clearedRaw).toMatch(/refreshToken=;|Expires=/);

      // Step C: Attempting refresh with the logged-out cookie must now fail
      const refreshRes = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', rawCookie);

      expect(refreshRes.status).toBe(403);
      expect(refreshRes.body.code).toBe('TOKEN_REUSE_DETECTED');
    });
  });

  // 4. Expired Authentication
  describe('4. Expired Authentication', () => {
    it('rejects expired JWT token with 401 and TOKEN_EXPIRED code', async () => {
      // Craft an expired token directly
      const expiredToken = jwt.sign(
        { userId: 'usr-student-01', email: 'student@oakridge.edu', role: 'STUDENT', status: 'ACTIVE' },
        config.jwt.accessSecret,
        { expiresIn: '-10s' }
      );

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('TOKEN_EXPIRED');
    });
  });

  // 5. Unauthorized Request
  describe('5. Unauthorized Request', () => {
    it('rejects protected endpoint when no token is provided', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    it('rejects protected endpoint when a malformed token is provided', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer this.is.a.completely.invalid.token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('INVALID_TOKEN');
    });
  });

  // 6. Forbidden Role (RBAC)
  describe('6. Forbidden Role Handling', () => {
    it('returns 403 Forbidden when STUDENT tries to access ADMIN endpoint', async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
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
      expect(res.body.userRole).toBe('STUDENT');
      expect(res.body.requiredRoles).toContain('ADMIN');
    });

    it('returns 403 Forbidden when TEACHER tries to access SUPER_ADMIN endpoint', async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'teacher@oakridge.edu',
          password: 'Teacher@123456',
        });

      const token = loginRes.body.data.accessToken;

      const res = await request(app)
        .get('/api/v1/auth/rbac-test/super-admin')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('FORBIDDEN');
    });
  });

  // 7. Role Access Matrix
  describe('7. Complete Role Access Matrix Verification', () => {
    const roles: Array<{ role: UserRole; email: string; pass: string }> = [
      { role: 'SUPER_ADMIN', email: 'superadmin@oakridge.edu', pass: 'SuperAdmin@123456' },
      { role: 'ADMIN', email: 'admin@oakridge.edu', pass: 'Admin@123456' },
      { role: 'TEACHER', email: 'teacher@oakridge.edu', pass: 'Teacher@123456' },
      { role: 'STUDENT', email: 'student@oakridge.edu', pass: 'Student@123456' },
      { role: 'PARENT', email: 'parent@oakridge.edu', pass: 'Parent@123456' },
    ];

    it('SUPER_ADMIN has universal access to all role endpoints', async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'superadmin@oakridge.edu', password: 'SuperAdmin@123456' });

      const token = loginRes.body.data.accessToken;

      const endpoints = [
        '/api/v1/auth/rbac-test/super-admin',
        '/api/v1/auth/rbac-test/admin',
        '/api/v1/auth/rbac-test/teacher',
        '/api/v1/auth/rbac-test/student',
        '/api/v1/auth/rbac-test/parent',
        '/api/v1/auth/rbac-test/staff',
      ];

      for (const endpoint of endpoints) {
        const res = await request(app).get(endpoint).set('Authorization', `Bearer ${token}`);
        expect(res.status, `SUPER_ADMIN should have access to ${endpoint}`).toBe(200);
      }
    });

    it('correctly grants access only to designated roles according to RBAC matrix', async () => {
      // 1. ADMIN should access /admin and /staff, but not /super-admin or /student or /parent
      const adminLogin = await request(app).post('/api/v1/auth/login').send({ email: 'admin@oakridge.edu', password: 'Admin@123456' });
      const adminToken = adminLogin.body.data.accessToken;

      const resAdminOnAdmin = await request(app).get('/api/v1/auth/rbac-test/admin').set('Authorization', `Bearer ${adminToken}`);
      expect(resAdminOnAdmin.status).toBe(200);

      const resAdminOnStaff = await request(app).get('/api/v1/auth/rbac-test/staff').set('Authorization', `Bearer ${adminToken}`);
      expect(resAdminOnStaff.status).toBe(200);

      const resAdminOnSuper = await request(app).get('/api/v1/auth/rbac-test/super-admin').set('Authorization', `Bearer ${adminToken}`);
      expect(resAdminOnSuper.status).toBe(403);

      // 2. TEACHER should access /teacher and /staff, but not /admin
      const teacherLogin = await request(app).post('/api/v1/auth/login').send({ email: 'teacher@oakridge.edu', password: 'Teacher@123456' });
      const teacherToken = teacherLogin.body.data.accessToken;

      const resTeacherOnTeacher = await request(app).get('/api/v1/auth/rbac-test/teacher').set('Authorization', `Bearer ${teacherToken}`);
      expect(resTeacherOnTeacher.status).toBe(200);

      const resTeacherOnStaff = await request(app).get('/api/v1/auth/rbac-test/staff').set('Authorization', `Bearer ${teacherToken}`);
      expect(resTeacherOnStaff.status).toBe(200);

      const resTeacherOnAdmin = await request(app).get('/api/v1/auth/rbac-test/admin').set('Authorization', `Bearer ${teacherToken}`);
      expect(resTeacherOnAdmin.status).toBe(403);

      // 3. STUDENT should access /student only
      const studentLogin = await request(app).post('/api/v1/auth/login').send({ email: 'student@oakridge.edu', password: 'Student@123456' });
      const studentToken = studentLogin.body.data.accessToken;

      const resStudentOnStudent = await request(app).get('/api/v1/auth/rbac-test/student').set('Authorization', `Bearer ${studentToken}`);
      expect(resStudentOnStudent.status).toBe(200);

      const resStudentOnTeacher = await request(app).get('/api/v1/auth/rbac-test/teacher').set('Authorization', `Bearer ${studentToken}`);
      expect(resStudentOnTeacher.status).toBe(403);

      // 4. PARENT should access /parent only
      const parentLogin = await request(app).post('/api/v1/auth/login').send({ email: 'parent@oakridge.edu', password: 'Parent@123456' });
      const parentToken = parentLogin.body.data.accessToken;

      const resParentOnParent = await request(app).get('/api/v1/auth/rbac-test/parent').set('Authorization', `Bearer ${parentToken}`);
      expect(resParentOnParent.status).toBe(200);

      const resParentOnStudent = await request(app).get('/api/v1/auth/rbac-test/student').set('Authorization', `Bearer ${parentToken}`);
      expect(resParentOnStudent.status).toBe(403);
    });
  });

  // 8. Refresh Token Rotation & Theft/Reuse Detection
  describe('8. Refresh Token Rotation & Reuse Detection', () => {
    it('successfully rotates refresh token on valid request', async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@oakridge.edu', password: 'Admin@123456' });

      const firstCookie = loginRes.headers['set-cookie'][0];

      const refreshRes = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', firstCookie);

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body.success).toBe(true);
      expect(refreshRes.body.data).toHaveProperty('accessToken');

      // An updated cookie must be issued
      const secondCookie = refreshRes.headers['set-cookie'][0];
      expect(secondCookie).toBeDefined();
    });

    it('detects refresh token reuse and immediately invalidates all user sessions', async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'student@oakridge.edu', password: 'Student@123456' });

      const staleCookie = loginRes.headers['set-cookie'][0];

      // Legitimate rotation (token 1 -> token 2)
      await request(app).post('/api/v1/auth/refresh').set('Cookie', staleCookie);

      // Attacker or replay attempts to use stale token 1 again
      const replayRes = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', staleCookie);

      expect(replayRes.status).toBe(403);
      expect(replayRes.body.code).toBe('TOKEN_REUSE_DETECTED');

      // Verify all sessions were revoked in database/store
      const user = await userRepository.findByEmail('student@oakridge.edu');
      expect(user?.refreshTokens.length).toBe(0);
    });
  });

  // 9. Brute-Force Protection & Account Lockout
  describe('9. Brute-Force Protection & Lockout Policy', () => {
    it('locks account after 5 consecutive failed login attempts', async () => {
      const email = 'teacher@oakridge.edu';

      // 4 failed attempts: account should remain unlocked
      for (let i = 1; i <= 4; i++) {
        const failRes = await request(app).post('/api/v1/auth/login').send({
          email,
          password: 'IncorrectPassword!9',
        });
        expect(failRes.status).toBe(401);
        expect(failRes.body.attemptsLeft).toBe(5 - i);
      }

      // 5th failed attempt: triggers account lockout
      const fifthRes = await request(app).post('/api/v1/auth/login').send({
        email,
        password: 'IncorrectPassword!9',
      });
      expect(fifthRes.status).toBe(401);
      expect(fifthRes.body.code).toBe('ACCOUNT_LOCKED');

      // Subsequent attempt with correct password must now be rejected because account is locked
      const lockedRes = await request(app).post('/api/v1/auth/login').send({
        email,
        password: 'Teacher@123456',
      });
      expect(lockedRes.status).toBe(423); // 423 Locked
      expect(lockedRes.body.code).toBe('ACCOUNT_LOCKED');
      expect(lockedRes.body).toHaveProperty('remainingMinutes');
    });
  });

  // 10. Account Status Verification
  describe('10. Account Status Enforcement', () => {
    it('prevents SUSPENDED users from logging in', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'suspended@oakridge.edu',
        password: 'Student@123456',
      });

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('ACCOUNT_SUSPENDED');
    });

    it('prevents LOCKED users from logging in', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'locked@oakridge.edu',
        password: 'Teacher@123456',
      });

      expect(res.status).toBe(423);
      expect(res.body.code).toBe('ACCOUNT_LOCKED');
    });
  });

  // 11. Password Policy Validation
  describe('11. Password Policy Validation', () => {
    it('rejects passwords that lack uppercase, digits, or special characters during registration', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@oakridge.edu',
        password: 'weakpassword', // no uppercase, no digit, no special char
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      // Zod or password validator error
      expect(res.body).toHaveProperty('errors');
    });

    it('accepts compliant passwords that fulfill complexity standards', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        firstName: 'Jane',
        lastName: 'Compliant',
        email: 'jane.compliant@oakridge.edu',
        password: 'StrongP@ssw0rd!2026',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('jane.compliant@oakridge.edu');
    });
  });
});
