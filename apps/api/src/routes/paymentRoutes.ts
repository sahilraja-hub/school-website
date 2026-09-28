import { Router } from 'express';
import {
  listPayments,
  recordPayment,
} from '../controllers/financeController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { RecordPaymentSchema } from '@school/shared';

const router = Router();

router.use(authenticate);

// View payment history
router.get('/', asyncHandler(listPayments));

// Submit / record payment (Admins, Parents, Students)
router.post('/', validate(RecordPaymentSchema), asyncHandler(recordPayment));

export default router;
