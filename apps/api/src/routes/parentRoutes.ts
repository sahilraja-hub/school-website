import { Router } from 'express';
import {
  listParents,
  getParentById,
  createParent,
  updateParent,
} from '../controllers/schoolActorsController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateParentSchema, UpdateParentSchema } from '@school/shared';

const router = Router();

router.use(authenticate);

// Staff can list parents
router.get('/', authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), asyncHandler(listParents));

// Get parent by ID
router.get('/:id', asyncHandler(getParentById));

// Create parent
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateParentSchema), asyncHandler(createParent));

// Update parent
router.patch('/:id', authorize('ADMIN', 'SUPER_ADMIN', 'PARENT'), validate(UpdateParentSchema), asyncHandler(updateParent));

export default router;
