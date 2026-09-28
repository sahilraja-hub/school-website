import { Router } from 'express';
import {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/schoolActorsController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateStudentSchema, UpdateStudentSchema } from '@school/shared';

const router = Router();

router.use(authenticate);

// Faculty & Admins can list students
router.get('/', authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), asyncHandler(listStudents));

// Individual student profile lookup
router.get('/:id', asyncHandler(getStudentById));

// Create student
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateStudentSchema), asyncHandler(createStudent));

// Update student
router.patch('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(UpdateStudentSchema), asyncHandler(updateStudent));

// Soft delete student
router.delete('/:id', authorize('SUPER_ADMIN'), asyncHandler(deleteStudent));

export default router;
