import { Router } from 'express';
import {
  listSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
} from '../controllers/academicController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateSectionSchema, UpdateSectionSchema } from '@school/shared';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(listSections));
router.get('/:id', asyncHandler(getSectionById));

router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateSectionSchema), asyncHandler(createSection));
router.patch('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(UpdateSectionSchema), asyncHandler(updateSection));
router.delete('/:id', authorize('SUPER_ADMIN'), asyncHandler(deleteSection));

export default router;
