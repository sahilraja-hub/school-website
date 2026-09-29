import { Router } from 'express';
import {
  uploadMedia,
  uploadMultipleMedia,
  listMedia,
  getMediaById,
  updateMedia,
  replaceMedia,
  reorderMedia,
  deleteMedia,
  generateSecureUrl,
  accessSecureMedia,
} from '../controllers/mediaController';
import { authenticate, optionalAuthenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  UploadMediaSchema,
  UploadMultipleMediaSchema,
  UpdateMediaSchema,
  ReplaceMediaSchema,
  ReorderMediaSchema,
} from '@school/shared';

const router = Router();

// 1. Public / Authenticated read endpoints
router.get('/', optionalAuthenticate, asyncHandler(listMedia));
router.get('/secure/:id', asyncHandler(accessSecureMedia));
router.get('/:id', optionalAuthenticate, asyncHandler(getMediaById));

// 2. Admin upload & batch upload
router.post(
  '/upload',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(UploadMediaSchema),
  asyncHandler(uploadMedia)
);

router.post(
  '/upload-multiple',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(UploadMultipleMediaSchema),
  asyncHandler(uploadMultipleMedia)
);

// 3. Admin media organization (reorder, update metadata, replace file, delete)
router.patch(
  '/reorder',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(ReorderMediaSchema),
  asyncHandler(reorderMedia)
);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(UpdateMediaSchema),
  asyncHandler(updateMedia)
);

router.post(
  '/:id/replace',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(ReplaceMediaSchema),
  asyncHandler(replaceMedia)
);

router.put(
  '/:id/replace',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(ReplaceMediaSchema),
  asyncHandler(replaceMedia)
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  asyncHandler(deleteMedia)
);

// 4. Secure signed URL generation for private media
router.get(
  '/:id/secure-url',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  asyncHandler(generateSecureUrl)
);

export default router;
