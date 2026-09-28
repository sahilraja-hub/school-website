import { Router } from 'express';
import {
  login,
  register,
  refreshToken,
  logout,
  logoutAll,
  getCurrentUser,
  changePassword,
  getSecurityLogs,
} from '../controllers/authController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { LoginSchema, RegisterSchema, ChangePasswordSchema } from '@school/shared';
import { authRateLimiter, refreshRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public Authentication Endpoints
router.post('/login', authRateLimiter, validate(LoginSchema), asyncHandler(login));
router.post('/register', authRateLimiter, validate(RegisterSchema), asyncHandler(register));
router.post('/refresh', refreshRateLimiter, asyncHandler(refreshToken));
router.post('/logout', asyncHandler(logout));

// Authenticated Endpoints
router.get('/me', authenticate, asyncHandler(getCurrentUser));
router.post('/logout-all', authenticate, asyncHandler(logoutAll));
router.post('/change-password', authenticate, validate(ChangePasswordSchema), asyncHandler(changePassword));

// Security & Audit Endpoints (Restricted to SUPER_ADMIN)
router.get('/security-logs', authenticate, authorize('SUPER_ADMIN'), asyncHandler(getSecurityLogs));

// Role-Based Access Control Verification Endpoints
router.get('/rbac-test/super-admin', authenticate, authorize('SUPER_ADMIN'), (req, res) => {
  res.json({ success: true, message: 'Super Admin access verified', role: req.user!.role });
});

router.get('/rbac-test/admin', authenticate, authorize('ADMIN'), (req, res) => {
  res.json({ success: true, message: 'Admin access verified', role: req.user!.role });
});

router.get('/rbac-test/teacher', authenticate, authorize('TEACHER'), (req, res) => {
  res.json({ success: true, message: 'Teacher access verified', role: req.user!.role });
});

router.get('/rbac-test/student', authenticate, authorize('STUDENT'), (req, res) => {
  res.json({ success: true, message: 'Student access verified', role: req.user!.role });
});

router.get('/rbac-test/parent', authenticate, authorize('PARENT'), (req, res) => {
  res.json({ success: true, message: 'Parent access verified', role: req.user!.role });
});

router.get('/rbac-test/staff', authenticate, authorize('ADMIN', 'TEACHER'), (req, res) => {
  res.json({ success: true, message: 'Staff access verified', role: req.user!.role });
});

export default router;
