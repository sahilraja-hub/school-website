import { Router } from 'express';
import {
  listNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from '../controllers/communicationController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateNoticeSchema, UpdateNoticeSchema } from '@school/shared';

const router = Router();

// Public / Authenticated read
router.get('/', asyncHandler(listNotices));
router.get('/:id', asyncHandler(getNoticeById));

// Admin management
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateNoticeSchema), asyncHandler(createNotice));
router.patch('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(UpdateNoticeSchema), asyncHandler(updateNotice));
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(deleteNotice));

export default router;
