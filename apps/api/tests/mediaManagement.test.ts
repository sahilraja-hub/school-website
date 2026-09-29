import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { generateTokens } from '../src/utils/token';

describe('PHASE 16 — Production Media and Gallery Management Test Suite', () => {
  const app = createApp();
  let adminToken: string;
  let teacherToken: string;
  let studentToken: string;
  let parentToken: string;

  // 1x1 valid PNG base64: 89 50 4e 47 0d 0a 1a 0a ...
  const validPngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  // 1x1 valid JPEG base64: ff d8 ff ...
  const validJpegBase64 =
    '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

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
  // 1. IMAGE UPLOAD, VARIANTS GENERATION & SAFE FILENAMES
  // =========================================================================
  describe('Image Upload, Optimization and Variants Generation', () => {
    it('should upload a single image with generated variants and sanitized filename', async () => {
      const res = await request(app)
        .post('/api/v1/media/upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fileName: 'campus_aerial_view.png',
          fileType: 'image/png',
          fileSizeBytes: 72000,
          fileBase64: validPngBase64,
          title: 'Campus Aerial Panoramic',
          caption: 'High-altitude drone view of Oakridge Main Quad and collegiate halls.',
          altText: 'Aerial view showing the north quad, clock tower, and athletic fields',
          category: 'CAMPUS',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toMatch(/^med-/);
      expect(res.body.data.fileName).toMatch(/^img_\d+_[a-f0-9]+\.png$/);
      expect(res.body.data.originalFileName).toBe('campus_aerial_view.png');
      expect(res.body.data.title).toBe('Campus Aerial Panoramic');
      expect(res.body.data.caption).toContain('High-altitude drone view');
      expect(res.body.data.altText).toContain('Aerial view showing the north quad');
      expect(res.body.data.category).toBe('CAMPUS');

      // Verify responsive image variants generated
      const variants = res.body.data.variants;
      expect(variants).toBeDefined();
      expect(variants.thumbnail).toBeDefined();
      expect(variants.thumbnail.url).toContain('_thumb.webp');
      expect(variants.medium).toBeDefined();
      expect(variants.medium.url).toContain('_med.webp');
      expect(variants.large).toBeDefined();
      expect(variants.original).toBeDefined();

      // Ensure storage credentials are never leaked
      expect(res.body.data.storageSecret).toBeUndefined();
      expect(res.body.data.awsAccessKey).toBeUndefined();
      expect(res.body.data.bucketSecret).toBeUndefined();
    });

    it('should handle batch multiple upload with ordering index', async () => {
      const batchPayload = {
        category: 'ACADEMICS',
        files: [
          {
            fileName: 'lab_microscope.jpg',
            fileType: 'image/jpeg',
            fileSizeBytes: 45000,
            fileBase64: validJpegBase64,
            title: 'Cellular Biology Lab',
            caption: 'Students observing mitosis under compound optics.',
            altText: 'Compound microscope in the biology laboratory',
          },
          {
            fileName: 'robotics_arena.png',
            fileType: 'image/png',
            fileSizeBytes: 62000,
            fileBase64: validPngBase64,
            title: 'Autonomous Robotics Testing',
            caption: 'Secondary scholars deploying navigation algorithms.',
            altText: 'Autonomous robot on obstacle competition field',
          },
        ],
      };

      const res = await request(app)
        .post('/api/v1/media/upload-multiple')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(batchPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].order).toBe(1);
      expect(res.body.data[1].order).toBe(2);
      expect(res.body.data[0].category).toBe('ACADEMICS');
      expect(res.body.data[1].category).toBe('ACADEMICS');
    });
  });

  // =========================================================================
  // 2. SECURITY VALIDATION (MIME, EXTENSION, SIZES, DANGEROUS UPLOADS)
  // =========================================================================
  describe('Security Validation & Threat Prevention', () => {
    it('should reject dangerous file extension (.exe disguised upload)', async () => {
      const res = await request(app)
        .post('/api/v1/media/upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fileName: 'trojan_installer.exe',
          fileType: 'application/x-msdownload',
          fileSizeBytes: 2048,
          fileBase64: 'TVqQAAMAAAAEAAAA//8AALgAAAA...',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      const errMsg = typeof res.body.error === 'object' ? res.body.error?.message : res.body.error;
      expect(errMsg).toMatch(/prohibited|invalid|unsupported/i);
    });

    it('should reject dangerous script extensions (.sh, .php, .html)', async () => {
      const scriptRes = await request(app)
        .post('/api/v1/media/upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fileName: 'shell_backdoor.php',
          fileType: 'application/x-php',
          fileSizeBytes: 1024,
          fileBase64: 'PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXZsK',
        });
      expect(scriptRes.status).toBe(400);

      const htmlRes = await request(app)
        .post('/api/v1/media/upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fileName: 'xss_stealer.html',
          fileType: 'text/html',
          fileSizeBytes: 1024,
          fileBase64: 'PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        });
      expect(htmlRes.status).toBe(400);
    });

    it('should reject directory traversal patterns in filenames (e.g. ../../etc/passwd)', async () => {
      const res = await request(app)
        .post('/api/v1/media/upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fileName: '../../etc/passwd.png',
          fileType: 'image/png',
          fileSizeBytes: 2048,
          fileBase64: validPngBase64,
        });

      expect(res.status).toBe(400);
      const errMsg = typeof res.body.error === 'object' ? res.body.error?.message : res.body.error;
      expect(errMsg).toContain('Dangerous upload detected');
    });

    it('should reject MIME type and extension mismatch (e.g. .png with image/jpeg)', async () => {
      const res = await request(app)
        .post('/api/v1/media/upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fileName: 'fake_image.png',
          fileType: 'image/jpeg',
          fileSizeBytes: 2048,
          fileBase64: validJpegBase64,
        });

      expect(res.status).toBe(400);
      const errMsg = typeof res.body.error === 'object' ? res.body.error?.message : res.body.error;
      expect(errMsg).toContain('Mime-type mismatch');
    });

    it('should reject files exceeding 5MB size limit', async () => {
      const res = await request(app)
        .post('/api/v1/media/upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fileName: 'huge_raw_uncompressed_photo.jpg',
          fileType: 'image/jpeg',
          fileSizeBytes: 8 * 1024 * 1024, // 8MB
          fileBase64: validJpegBase64,
        });

      expect(res.status).toBe(400);
      const errMsg = typeof res.body.error === 'object' ? res.body.error?.message : res.body.error;
      expect(errMsg).toContain('exceeds maximum permitted limit');
    });

    it('should reject forged or corrupted binary headers (magic byte inspection)', async () => {
      // Send JPEG file extension and MIME type, but binary is plain text bytes "NOT_A_JPEG"
      const forgedBase64 = Buffer.from('NOT_A_VALID_JPEG_HEADER').toString('base64');
      const res = await request(app)
        .post('/api/v1/media/upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fileName: 'forged_picture.jpg',
          fileType: 'image/jpeg',
          fileSizeBytes: 2048,
          fileBase64: forgedBase64,
        });

      expect(res.status).toBe(400);
      const errMsg = typeof res.body.error === 'object' ? res.body.error?.message : res.body.error;
      expect(errMsg).toContain('Header signature invalid');
    });
  });

  // =========================================================================
  // 3. PRIVATE STORAGE & SECURE SIGNED MEDIA URLS
  // =========================================================================
  describe('Private Storage & Cryptographically Signed Media URLs', () => {
    let privateMediaId: string;

    it('should store sensitive media in private storage target', async () => {
      const res = await request(app)
        .post('/api/v1/media/upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fileName: 'scholar_confidential_id_card.png',
          fileType: 'image/png',
          fileSizeBytes: 25000,
          fileBase64: validPngBase64,
          title: 'Student Identification Card',
          isPrivate: true,
          category: 'GENERAL',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isPrivate).toBe(true);
      expect(res.body.data.url).toContain('/api/v1/media/secure-stream');

      privateMediaId = res.body.data.id;
    });

    it('should exclude private media from public unauthenticated media listing', async () => {
      const res = await request(app).get('/api/v1/media');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const items = res.body.data;
      const ids = items.map((m: any) => m.id);
      expect(ids).not.toContain(privateMediaId);
    });

    it('should reject unauthenticated direct access to private media item by ID', async () => {
      const res = await request(app).get(`/api/v1/media/${privateMediaId}`);

      expect(res.status).toBe(403);
      const errMsg = typeof res.body.error === 'object' ? res.body.error?.message : res.body.error;
      expect(errMsg).toContain('Access denied');
    });

    it('should allow admin to generate a signed, time-limited URL for private media', async () => {
      const res = await request(app)
        .get(`/api/v1/media/${privateMediaId}/secure-url?expiresIn=600`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.signedUrl).toContain(`/api/v1/media/secure/${privateMediaId}`);
      expect(res.body.data.signedUrl).toContain('sig=');
      expect(res.body.data.signedUrl).toContain('exp=');

      // Verify accessing via signed URL succeeds
      const accessRes = await request(app).get(res.body.data.signedUrl);
      expect(accessRes.status).toBe(200);
      expect(accessRes.body.data.id).toBe(privateMediaId);
      expect(accessRes.body.meta.signedAccessGranted).toBe(true);
    });

    it('should reject access when signed URL token is tampered with', async () => {
      const tamperedUrl = `/api/v1/media/secure/${privateMediaId}?sig=bad_tampered_signature&exp=9999999999`;
      const res = await request(app).get(tamperedUrl);

      expect(res.status).toBe(403);
      const errMsg = typeof res.body.error === 'object' ? res.body.error?.message : res.body.error;
      expect(errMsg).toContain('Access denied');
    });
  });

  // =========================================================================
  // 4. MEDIA OPERATIONS: REPLACE, REORDER, METADATA & DELETE
  // =========================================================================
  describe('Media Operations: Replace, Reorder, Update & Delete', () => {
    let createdMediaId: string;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/v1/media/upload')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fileName: 'initial_field_photo.png',
          fileType: 'image/png',
          fileSizeBytes: 40000,
          fileBase64: validPngBase64,
          title: 'Athletic Field',
          caption: 'Morning dew on the soccer pitch.',
          altText: 'Empty sports pitch at sunrise',
          category: 'ATHLETICS',
        });
      createdMediaId = res.body.data.id;
    });

    it('should update media metadata (caption, altText, category, title)', async () => {
      const res = await request(app)
        .patch(`/api/v1/media/${createdMediaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Varsity Soccer Pitch',
          caption: 'Updated afternoon sunlight on championship pitch.',
          altText: 'Lush green soccer field with stadium goals',
          category: 'ATHLETICS',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Varsity Soccer Pitch');
      expect(res.body.data.caption).toBe('Updated afternoon sunlight on championship pitch.');
      expect(res.body.data.altText).toBe('Lush green soccer field with stadium goals');
    });

    it('should replace media image binary while retaining ID and metadata', async () => {
      const res = await request(app)
        .post(`/api/v1/media/${createdMediaId}/replace`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fileName: 'replaced_hd_field_photo.jpg',
          fileType: 'image/jpeg',
          fileSizeBytes: 85000,
          fileBase64: validJpegBase64,
          caption: 'Replaced with 4K high resolution capture.',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdMediaId);
      expect(res.body.data.fileName).toMatch(/^img_\d+_[a-f0-9]+\.jpg$/);
      expect(res.body.data.mimeType).toBe('image/jpeg');
      expect(res.body.data.caption).toBe('Replaced with 4K high resolution capture.');
      expect(res.body.data.variants.thumbnail.url).toContain('_thumb.webp');
    });

    it('should reorder media items within album', async () => {
      const res = await request(app)
        .patch('/api/v1/media/reorder')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          items: [
            { id: 'med-002', order: 1 },
            { id: 'med-001', order: 2 },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const listRes = await request(app).get('/api/v1/media?galleryId=gal-001');
      expect(listRes.body.data[0].id).toBe('med-002');
      expect(listRes.body.data[1].id).toBe('med-001');
    });

    it('should delete a media item and return 404 on subsequent get', async () => {
      const res = await request(app)
        .delete(`/api/v1/media/${createdMediaId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const checkRes = await request(app).get(`/api/v1/media/${createdMediaId}`);
      expect(checkRes.status).toBe(404);
    });
  });

  // =========================================================================
  // 5. ALBUM / GALLERY MANAGEMENT (CREATE, LIST, UPDATE, DELETE)
  // =========================================================================
  describe('Gallery Album Management', () => {
    let newGalleryId: string;

    it('should create a new album with category and metadata', async () => {
      const res = await request(app)
        .post('/api/v1/gallery')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Fine Arts Ceramic Showcase 2026',
          description: 'Hand-thrown stoneware pottery and ceramic sculpture exhibitions.',
          category: 'ARTS',
          academicYear: '2026-2027',
          coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toMatch(/^gal-/);
      expect(res.body.data.title).toBe('Fine Arts Ceramic Showcase 2026');
      expect(res.body.data.category).toBe('ARTS');
      expect(res.body.data.slug).toBe('fine-arts-ceramic-showcase-2026');

      newGalleryId = res.body.data.id;
    });

    it('should update gallery album details', async () => {
      const res = await request(app)
        .patch(`/api/v1/gallery/${newGalleryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Fine Arts Ceramic & Glasswork Showcase 2026',
          description: 'Updated with blown glass installations.',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Fine Arts Ceramic & Glasswork Showcase 2026');
    });

    it('should delete gallery album', async () => {
      const res = await request(app)
        .delete(`/api/v1/gallery/${newGalleryId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const checkRes = await request(app).get(`/api/v1/gallery/${newGalleryId}`);
      expect(checkRes.status).toBe(404);
    });
  });

  // =========================================================================
  // 6. PERMISSIONS & ROLE-BASED ACCESS CONTROL
  // =========================================================================
  describe('RBAC Authorization & Permissions', () => {
    it('should reject unauthenticated upload attempt', async () => {
      const res = await request(app)
        .post('/api/v1/media/upload')
        .send({
          fileName: 'unauthorized_upload.png',
          fileType: 'image/png',
          fileSizeBytes: 2000,
          fileBase64: validPngBase64,
        });

      expect(res.status).toBe(401);
    });

    it('should reject non-admin (teacher/student/parent) uploading or replacing media', async () => {
      const studentRes = await request(app)
        .post('/api/v1/media/upload')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          fileName: 'student_upload.png',
          fileType: 'image/png',
          fileSizeBytes: 2000,
          fileBase64: validPngBase64,
        });
      expect(studentRes.status).toBe(403);

      const teacherRes = await request(app)
        .post('/api/v1/media/upload')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          fileName: 'teacher_upload.png',
          fileType: 'image/png',
          fileSizeBytes: 2000,
          fileBase64: validPngBase64,
        });
      expect(teacherRes.status).toBe(403);

      const parentRes = await request(app)
        .delete('/api/v1/media/med-001')
        .set('Authorization', `Bearer ${parentToken}`);
      expect(parentRes.status).toBe(403);
    });
  });
});
