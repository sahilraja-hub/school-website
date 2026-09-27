import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/app';

describe('Oakridge Academy API Server Test Suite', () => {
  const app = createApp();

  beforeAll(() => {
    // Disable buffering for quick failure in unit tests if no DB is connected
    mongoose.set('bufferCommands', false);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('GET /api/health returns 200 and healthy status payload', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('Oakridge School API');
    expect(res.body).toHaveProperty('uptime');
  });

  it('POST /api/auth/login validates body and rejects invalid email format', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'invalid-email-format',
      password: 'short',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.errors).toHaveProperty('email');
    expect(res.body.errors).toHaveProperty('password');
  });

  it('GET /api/classes rejects unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/classes');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Authentication required');
  });

  it('POST /api/admissions/apply rejects invalid application data with 400', async () => {
    const res = await request(app).post('/api/admissions/apply').send({
      studentFirstName: '', // too short
      studentLastName: 'Test',
      parentEmail: 'not-an-email',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toHaveProperty('studentFirstName');
    expect(res.body.errors).toHaveProperty('parentEmail');
  });

  it('GET /api/admissions/track/NONEXISTENT returns 404 or DB error gracefully', async () => {
    const res = await request(app).get('/api/admissions/track/NONEXISTENT');
    expect([404, 500]).toContain(res.status);
  });
});
