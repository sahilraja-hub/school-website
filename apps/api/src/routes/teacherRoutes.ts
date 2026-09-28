import { Router } from 'express';
import {
  listTeachers,
  getCurrentTeacherProfile,
  getTeacherById,
  createTeacher,
  updateTeacher,
} from '../controllers/schoolActorsController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateTeacherSchema, UpdateTeacherSchema } from '@school/shared';

const router = Router();

router.use(authenticate);

// All authenticated roles can browse teacher directory
router.get('/', asyncHandler(listTeachers));

// Current authenticated teacher profile and assignments
router.get('/me', authorize('TEACHER', 'ADMIN', 'SUPER_ADMIN'), asyncHandler(getCurrentTeacherProfile));

// Get teacher details
router.get('/:id', asyncHandler(getTeacherById));

// Create teacher
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateTeacherSchema), asyncHandler(createTeacher));

// Update teacher
router.patch('/:id', authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), validate(UpdateTeacherSchema), asyncHandler(updateTeacher));

export default router;
