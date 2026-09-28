import { Router } from 'express';
import { listAuditLogs } from '../controllers/systemController';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.use(authenticate);

// Restricted to Admins & Super Admins
router.get('/', authorize('ADMIN', 'SUPER_ADMIN'), asyncHandler(listAuditLogs));

export default router;
