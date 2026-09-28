import { Router } from 'express';
import {
  listGalleries,
  getGalleryByIdOrSlug,
  createGallery,
  addMedia,
  deleteMedia,
} from '../controllers/communicationController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateGallerySchema, AddMediaSchema } from '@school/shared';

const router = Router();

// Public read
router.get('/', asyncHandler(listGalleries));
router.get('/:id', asyncHandler(getGalleryByIdOrSlug));

// Admin management
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateGallerySchema), asyncHandler(createGallery));
router.post('/media', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(AddMediaSchema), asyncHandler(addMedia));
router.delete('/media/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(deleteMedia));

export default router;
