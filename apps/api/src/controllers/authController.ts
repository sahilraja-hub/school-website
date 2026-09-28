import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/token';
import { LoginInput, RegisterInput } from '@school/shared';
import { UnauthorizedError } from '../errors';

export const login = async (req: Request<{}, {}, LoginInput>, res: Response): Promise<void> => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'];

  const { user, accessToken, refreshToken } = await authService.login(req.body, clientIp, userAgent);

  setRefreshTokenCookie(res, refreshToken);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      accessToken,
    },
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const register = async (req: Request<{}, {}, RegisterInput>, res: Response): Promise<void> => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

  const { user, accessToken, refreshToken } = await authService.register(req.body, clientIp);

  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      accessToken,
    },
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const currentToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

  try {
    const { accessToken, refreshToken: newRefreshToken, user } = await authService.refreshToken(currentToken, clientIp);

    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      success: true,
      message: 'Token rotated and refreshed successfully',
      data: {
        accessToken,
        user,
      },
      meta: {
        requestId: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    clearRefreshTokenCookie(res);
    throw error;
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const currentToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

  await authService.logout(currentToken, clientIp);
  clearRefreshTokenCookie(res);

  res.json({
    success: true,
    message: 'Logged out successfully.',
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const logoutAll = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required.');
  }

  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  await authService.logoutAll(req.user, clientIp);
  clearRefreshTokenCookie(res);

  res.json({
    success: true,
    message: 'Logged out from all active sessions successfully.',
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('Not authenticated.');
  }

  res.json({
    success: true,
    data: {
      user: req.user.toSummary(),
    },
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required.');
  }

  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const { currentPassword, newPassword } = req.body;

  await authService.changePassword(req.user, currentPassword, newPassword, clientIp);
  clearRefreshTokenCookie(res);

  res.json({
    success: true,
    message: 'Password changed successfully. Please log in again.',
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const getSecurityLogs = async (req: Request, res: Response): Promise<void> => {
  const limit = parseInt(req.query.limit as string, 10) || 50;
  const logs = authService.getSecurityLogs(limit);

  res.json({
    success: true,
    data: {
      logs,
    },
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};
