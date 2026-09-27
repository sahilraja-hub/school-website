import { Router } from 'express';
import { getClasses, getClassById, createClass } from '../controllers/classController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/', getClasses);
router.get('/:id', getClassById);
router.post('/', authorizeRoles('ADMIN'), createClass);

export default router;
