import { Router } from 'express';
import { login, register, refreshToken, logout, getCurrentUser } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { LoginSchema, RegisterSchema } from '@school/shared';

const router = Router();

router.post('/login', validate(LoginSchema), login);
router.post('/register', validate(RegisterSchema), register);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticate, getCurrentUser);

export default router;
