import { Router } from 'express';
import { getClasses, getClassById, createClass } from '../controllers/classController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(getClasses));
router.get('/:id', asyncHandler(getClassById));
router.post('/', authorizeRoles('ADMIN'), asyncHandler(createClass));

export default router;
