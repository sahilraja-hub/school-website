import { Router } from 'express';
import {
  listFeeStructures,
  getFeeStructureById,
  createFeeStructure,
  listInvoices,
  getInvoiceById,
  createInvoice,
} from '../controllers/financeController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { CreateFeeStructureSchema, CreateInvoiceSchema } from '@school/shared';

const router = Router();

router.use(authenticate);

// Fee Structures
router.get('/structures', asyncHandler(listFeeStructures));
router.get('/structures/:id', asyncHandler(getFeeStructureById));
router.post('/structures', authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateFeeStructureSchema), asyncHandler(createFeeStructure));

// Invoices
router.get('/invoices', asyncHandler(listInvoices));
router.get('/invoices/:id', asyncHandler(getInvoiceById));
router.post('/invoices', authorize('ADMIN', 'SUPER_ADMIN'), validate(CreateInvoiceSchema), asyncHandler(createInvoice));

export default router;
