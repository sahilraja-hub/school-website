import { Router } from 'express';
import {
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/communicationController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateEventSchema, UpdateEventSchema } from '@school/shared';

const router = Router();

// Public read
router.get('/', asyncHandler(listEvents));
router.get('/:id', asyncHandler(getEventById));

// Admin management
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateEventSchema), asyncHandler(createEvent));
router.patch('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(UpdateEventSchema), asyncHandler(updateEvent));
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(deleteEvent));

export default router;
