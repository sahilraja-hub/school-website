import { Router } from 'express';
import {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/schoolActorsController';
import { authenticate, authorize } from '../middleware/auth';
import { validate, validateRequest } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateStudentSchema, UpdateStudentSchema } from '@school/shared';
import { IdParamSchema, PaginationQuerySchema } from '../validators';

const router = Router();

router.use(authenticate);

// Faculty & Admins can list students (with query validation)
router.get('/', authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), validateRequest({ query: PaginationQuerySchema }), asyncHandler(listStudents));

// Individual student profile lookup (with param validation)
router.get('/:id', validateRequest({ params: IdParamSchema }), asyncHandler(getStudentById));

// Create student (with body validation)
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateStudentSchema), asyncHandler(createStudent));

// Update student (with param and body validation)
router.patch('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validateRequest({ params: IdParamSchema, body: UpdateStudentSchema }), asyncHandler(updateStudent));

// Soft delete student (with param validation)
router.delete('/:id', authorize('SUPER_ADMIN'), validateRequest({ params: IdParamSchema }), asyncHandler(deleteStudent));

export default router;
