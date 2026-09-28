import { Router } from 'express';
import {
  listTimetable,
  getTimetableById,
  createTimetable,
  updateTimetable,
  deleteTimetable,
} from '../controllers/academicController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateTimetableSchema, UpdateTimetableSchema } from '@school/shared';

const router = Router();

router.use(authenticate);

// Directory access for schedules
router.get('/', asyncHandler(listTimetable));
router.get('/:id', asyncHandler(getTimetableById));

// Admin management
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateTimetableSchema), asyncHandler(createTimetable));
router.patch('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(UpdateTimetableSchema), asyncHandler(updateTimetable));
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(deleteTimetable));

export default router;
