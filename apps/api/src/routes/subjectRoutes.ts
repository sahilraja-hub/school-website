import { Router } from 'express';
import {
  listSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/academicController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateSubjectSchema, UpdateSubjectSchema } from '@school/shared';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(listSubjects));
router.get('/:id', asyncHandler(getSubjectById));

router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateSubjectSchema), asyncHandler(createSubject));
router.patch('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(UpdateSubjectSchema), asyncHandler(updateSubject));
router.delete('/:id', authorize('SUPER_ADMIN'), asyncHandler(deleteSubject));

export default router;
