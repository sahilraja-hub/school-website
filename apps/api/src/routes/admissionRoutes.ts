import { Router } from 'express';
import {
  submitApplication,
  trackApplication,
  getAllApplications,
  updateApplicationStatus,
} from '../controllers/admissionController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { AdmissionApplicationSchema, AdmissionStatusUpdateSchema } from '@school/shared';

const router = Router();

// Public routes
router.post('/apply', validate(AdmissionApplicationSchema), submitApplication);
router.get('/track/:applicationNumber', trackApplication);

// Admin-only routes
router.get('/', authenticate, authorizeRoles('ADMIN'), getAllApplications);
router.patch('/:id/status', authenticate, authorizeRoles('ADMIN'), validate(AdmissionStatusUpdateSchema), updateApplicationStatus);

export default router;
