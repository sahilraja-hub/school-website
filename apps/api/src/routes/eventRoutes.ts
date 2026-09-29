import { Router } from 'express';
import {
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  publishEvent,
  unpublishEvent,
  archiveEvent,
  deleteEvent,
} from '../controllers/communicationController';
import { authenticate, optionalAuthenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateEventSchema, UpdateEventSchema } from '@school/shared';

const router = Router();

// Public / Authenticated read (public website only sees PUBLISHED, admin sees all)
router.get('/', optionalAuthenticate, asyncHandler(listEvents));
router.get('/:id', optionalAuthenticate, asyncHandler(getEventById));

// Admin event management
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(CreateEventSchema),
  asyncHandler(createEvent)
);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(UpdateEventSchema),
  asyncHandler(updateEvent)
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(UpdateEventSchema),
  asyncHandler(updateEvent)
);

// Lifecycle actions: Publish, Unpublish, Archive
router.post('/:id/publish', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(publishEvent));
router.patch('/:id/publish', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(publishEvent));

router.post('/:id/unpublish', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(unpublishEvent));
router.patch('/:id/unpublish', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(unpublishEvent));

router.post('/:id/archive', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(archiveEvent));
router.patch('/:id/archive', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(archiveEvent));

router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(deleteEvent));

export default router;
