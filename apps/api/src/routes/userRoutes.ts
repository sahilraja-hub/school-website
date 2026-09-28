import { Router } from 'express';
import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  CreateUserSchema,
  UpdateUserSchema,
  UpdateUserStatusSchema,
} from '@school/shared';

const router = Router();

router.use(authenticate);

// List & search users (ADMIN, SUPER_ADMIN)
router.get('/', authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(listUsers));

// Get user profile by ID
router.get('/:id', asyncHandler(getUserById));

// Create user
router.post('/', authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateUserSchema), asyncHandler(createUser));

// Update user details
router.patch('/:id', authorize('ADMIN', 'SUPER_ADMIN'), validate(UpdateUserSchema), asyncHandler(updateUser));

// Update user status
router.patch('/:id/status', authorize('ADMIN', 'SUPER_ADMIN'), validate(UpdateUserStatusSchema), asyncHandler(updateUserStatus));

// Deactivate user
router.delete('/:id', authorize('SUPER_ADMIN'), asyncHandler(deleteUser));

export default router;
