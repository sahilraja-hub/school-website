import { Router } from 'express';
import {
  listExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
} from '../controllers/examController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateExamSchema, UpdateExamSchema } from '@school/shared';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(listExams));
router.get('/:id', asyncHandler(getExamById));

router.post('/', authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), validate(CreateExamSchema), asyncHandler(createExam));
router.patch('/:id', authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), validate(UpdateExamSchema), asyncHandler(updateExam));
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(deleteExam));

export default router;
