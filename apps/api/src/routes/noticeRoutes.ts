import { Router } from 'express';
import {
  listNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  publishNotice,
  unpublishNotice,
  archiveNotice,
  deleteNotice,
} from '../controllers/communicationController';
import { authenticate, optionalAuthenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateNoticeSchema, UpdateNoticeSchema } from '@school/shared';

const router = Router();

// Public / Authenticated read (public website only sees PUBLISHED, admin sees all)
router.get('/', optionalAuthenticate, asyncHandler(listNotices));
router.get('/:id', optionalAuthenticate, asyncHandler(getNoticeById));

// Admin notice management
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(CreateNoticeSchema),
  asyncHandler(createNotice)
);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(UpdateNoticeSchema),
  asyncHandler(updateNotice)
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(UpdateNoticeSchema),
  asyncHandler(updateNotice)
);

// Lifecycle actions: Publish, Unpublish, Archive
router.post('/:id/publish', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(publishNotice));
router.patch('/:id/publish', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(publishNotice));

router.post('/:id/unpublish', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(unpublishNotice));
router.patch('/:id/unpublish', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(unpublishNotice));

router.post('/:id/archive', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(archiveNotice));
router.patch('/:id/archive', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(archiveNotice));

router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(deleteNotice));

export default router;
