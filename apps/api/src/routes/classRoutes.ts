import { Router } from 'express';
import {
  listClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/academicController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateClassSchema, UpdateClassSchema } from '@school/shared';

const router = Router();

router.use(authenticate);

// Directory access
router.get('/', asyncHandler(listClasses));
router.get('/:id', asyncHandler(getClassById));

// Admin management
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateClassSchema), asyncHandler(createClass));
router.patch('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(UpdateClassSchema), asyncHandler(updateClass));
router.delete('/:id', authorize('SUPER_ADMIN'), asyncHandler(deleteClass));

export default router;
