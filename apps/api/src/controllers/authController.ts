import { Request, Response } from 'express';
import { userRepository } from '../repositories/userRepository';
import { generateTokens, setRefreshTokenCookie, clearRefreshTokenCookie, verifyRefreshToken } from '../utils/token';
import { validatePasswordPolicy, hashPassword } from '../utils/password';
import { LoginInput, RegisterInput, ChangePasswordSchema } from '@school/shared';
import { securityLogger } from '../services/securityLogger';

export const login = async (req: Request<{}, {}, LoginInput>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'];

    const user = await userRepository.findByEmail(email);
    if (!user) {
      securityLogger.log({
        eventType: 'LOGIN_FAILURE',
        severity: 'WARN',
        email,
        ip: clientIp,
        userAgent,
        reason: 'User not found',
      });

      res.status(401).json({ success: false, error: 'Invalid email or password.', code: 'INVALID_CREDENTIALS' });
      return;
    }

    // Check if account is locked
    if (user.isLocked()) {
      const remainingMinutes = Math.ceil((user.lockUntil!.getTime() - Date.now()) / (60 * 1000));
      securityLogger.log({
        eventType: 'LOGIN_FAILURE',
        severity: 'ALERT',
        userId: user.id,
        email: user.email,
        ip: clientIp,
        userAgent,
        reason: `Login attempted on locked account (${remainingMinutes} mins remaining)`,
      });

      res.status(423).json({
        success: false,
        error: `Account is temporarily locked due to excessive failed attempts. Please try again in ${remainingMinutes} minute(s).`,
        code: 'ACCOUNT_LOCKED',
        remainingMinutes,
      });
      return;
    }

    // Check account status
    if (user.status === 'SUSPENDED') {
      securityLogger.log({
        eventType: 'LOGIN_FAILURE',
        severity: 'WARN',
        userId: user.id,
        email: user.email,
        ip: clientIp,
        userAgent,
        reason: 'Suspended account login attempt',
      });

      res.status(403).json({
        success: false,
        error: 'Account has been suspended. Please contact school administration.',
        code: 'ACCOUNT_SUSPENDED',
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const failResult = await user.recordFailedLogin();

      if (failResult.locked) {
        securityLogger.log({
          eventType: 'ACCOUNT_LOCKED',
          severity: 'ALERT',
          userId: user.id,
          email: user.email,
          ip: clientIp,
          userAgent,
          reason: 'Account locked after 5 consecutive failed login attempts',
        });

        res.status(401).json({
          success: false,
          error: 'Invalid email or password. Your account has been locked for 15 minutes due to multiple failed attempts.',
          code: 'ACCOUNT_LOCKED',
        });
        return;
      }

      securityLogger.log({
        eventType: 'LOGIN_FAILURE',
        severity: 'WARN',
        userId: user.id,
        email: user.email,
        ip: clientIp,
        userAgent,
        reason: `Incorrect password (${failResult.attemptsLeft} attempts remaining)`,
      });

      res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
        code: 'INVALID_CREDENTIALS',
        attemptsLeft: failResult.attemptsLeft,
      });
      return;
    }

    // Successful Login
    await user.recordSuccessfulLogin(clientIp);

    const { accessToken, refreshToken } = generateTokens(user);

    // Refresh Token Management & Rotation
    user.refreshTokens.push(refreshToken);
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    securityLogger.log({
      eventType: 'LOGIN_SUCCESS',
      severity: 'INFO',
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: clientIp,
      userAgent,
      reason: 'Successful user authentication',
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toSummary(),
        accessToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Login failed.' });
  }
};

export const register = async (req: Request<{}, {}, RegisterInput>, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role, phone, gradeLevel, studentId } = req.body;
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

    // Verify Password Policy
    const policyResult = validatePasswordPolicy(password);
    if (!policyResult.isValid) {
      res.status(400).json({
        success: false,
        error: 'Password does not meet security requirements.',
        code: 'WEAK_PASSWORD',
        details: policyResult.errors,
      });
      return;
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ success: false, error: 'User with this email already exists.', code: 'USER_EXISTS' });
      return;
    }

    // Disallow public self-registration as SUPER_ADMIN
    const assignedRole = role === 'SUPER_ADMIN' ? 'STUDENT' : (role || 'STUDENT');

    const passwordHash = await hashPassword(password);

    const newUser = await userRepository.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      passwordHash,
      role: assignedRole,
      status: 'ACTIVE',
      phone,
      gradeLevel,
      studentId: studentId || (assignedRole === 'STUDENT' ? `OAK-${Math.floor(100000 + Math.random() * 900000)}` : undefined),
      refreshTokens: [],
    });

    const { accessToken, refreshToken } = generateTokens(newUser);
    newUser.refreshTokens.push(refreshToken);
    await newUser.save();

    setRefreshTokenCookie(res, refreshToken);

    securityLogger.log({
      eventType: 'LOGIN_SUCCESS',
      severity: 'INFO',
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      ip: clientIp,
      reason: 'New user registered and authenticated',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser.toSummary(),
        accessToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Registration failed.' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

    if (!currentRefreshToken) {
      res.status(401).json({ success: false, error: 'No refresh token provided.', code: 'NO_REFRESH_TOKEN' });
      return;
    }

    let payload;
    try {
      payload = verifyRefreshToken(currentRefreshToken);
    } catch {
      clearRefreshTokenCookie(res);
      res.status(401).json({ success: false, error: 'Invalid or expired refresh token.', code: 'INVALID_REFRESH_TOKEN' });
      return;
    }

    const user = await userRepository.findById(payload.userId);

    // Reuse / Token Theft Detection
    if (!user || !user.refreshTokens.includes(currentRefreshToken)) {
      if (user) {
        // Token was rotated previously and reused -> breach alert!
        user.refreshTokens = [];
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save();

        securityLogger.log({
          eventType: 'TOKEN_REUSE_DETECTED',
          severity: 'ALERT',
          userId: user.id,
          email: user.email,
          ip: clientIp,
          reason: 'Attempted reuse of an already-rotated refresh token. Revoked all sessions.',
        });
      }

      clearRefreshTokenCookie(res);
      res.status(403).json({
        success: false,
        error: 'Refresh token reuse detected or token revoked. All sessions invalidated.',
        code: 'TOKEN_REUSE_DETECTED',
      });
      return;
    }

    // Refresh Token Rotation
    user.refreshTokens = user.refreshTokens.filter((t) => t !== currentRefreshToken);
    const tokens = generateTokens(user);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    setRefreshTokenCookie(res, tokens.refreshToken);

    securityLogger.log({
      eventType: 'TOKEN_REFRESH',
      severity: 'INFO',
      userId: user.id,
      email: user.email,
      ip: clientIp,
      reason: 'Session refreshed with new access and refresh token pair',
    });

    res.json({
      success: true,
      message: 'Token rotated and refreshed successfully',
      data: {
        accessToken: tokens.accessToken,
        user: user.toSummary(),
      },
    });
  } catch (error: any) {
    clearRefreshTokenCookie(res);
    res.status(500).json({ success: false, error: error.message || 'Token refresh failed.' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

    if (currentRefreshToken) {
      const user = await userRepository.findByRefreshToken(currentRefreshToken);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== currentRefreshToken);
        await user.save();

        securityLogger.log({
          eventType: 'LOGOUT',
          severity: 'INFO',
          userId: user.id,
          email: user.email,
          ip: clientIp,
          reason: 'User session logged out and refresh token revoked',
        });
      }
    }

    clearRefreshTokenCookie(res);
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    clearRefreshTokenCookie(res);
    res.status(500).json({ success: false, error: error.message || 'Logout error.' });
  }
};

export const logoutAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: 'Authentication required.' });
      return;
    }

    user.refreshTokens = [];
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    clearRefreshTokenCookie(res);

    securityLogger.log({
      eventType: 'LOGOUT_ALL',
      severity: 'INFO',
      userId: user.id,
      email: user.email,
      ip: req.ip,
      reason: 'User logged out of all active devices; all refresh tokens revoked',
    });

    res.json({ success: true, message: 'Logged out from all active sessions successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Logout all error.' });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated.', code: 'UNAUTHORIZED' });
    return;
  }
  res.json({
    success: true,
    data: {
      user: req.user.toSummary(),
    },
  });
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, error: 'Authentication required.' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, error: 'Current password is incorrect.', code: 'INVALID_PASSWORD' });
      return;
    }

    const policyResult = validatePasswordPolicy(newPassword);
    if (!policyResult.isValid) {
      res.status(400).json({
        success: false,
        error: 'New password does not meet security requirements.',
        code: 'WEAK_PASSWORD',
        details: policyResult.errors,
      });
      return;
    }

    user.passwordHash = await hashPassword(newPassword);
    user.passwordChangedAt = new Date();
    // Revoke all refresh tokens on password change
    user.refreshTokens = [];
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    clearRefreshTokenCookie(res);

    securityLogger.log({
      eventType: 'PASSWORD_CHANGED',
      severity: 'INFO',
      userId: user.id,
      email: user.email,
      ip: req.ip,
      reason: 'Password successfully changed and other sessions terminated',
    });

    res.json({ success: true, message: 'Password changed successfully. Please log in again.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Password change failed.' });
  }
};

export const getSecurityLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const logs = securityLogger.getEvents({ limit });
    res.json({
      success: true,
      data: {
        logs,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve security audit logs.' });
  }
};
