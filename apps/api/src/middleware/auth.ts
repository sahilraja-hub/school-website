import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/token';
import { userRepository, IUserLike } from '../repositories/userRepository';
import { UserRole } from '@school/shared';
import { securityLogger } from '../services/securityLogger';

declare global {
  namespace Express {
    interface Request {
      user?: IUserLike;
      tokenPayload?: TokenPayload;
    }
  }
}

/**
 * Authentication Middleware:
 * Verifies JWT access token from Authorization header or cookie.
 * Validates user existence and account status (active vs suspended/locked).
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      securityLogger.log({
        eventType: 'UNAUTHORIZED_ACCESS',
        severity: 'INFO',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        resource: req.originalUrl,
        reason: 'Missing authentication token',
      });

      res.status(401).json({
        success: false,
        error: 'Authentication required. No token provided.',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    let decoded: TokenPayload;
    try {
      decoded = verifyAccessToken(token);
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          error: 'Token expired. Please refresh your session.',
          code: 'TOKEN_EXPIRED',
        });
        return;
      }

      securityLogger.log({
        eventType: 'UNAUTHORIZED_ACCESS',
        severity: 'WARN',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        resource: req.originalUrl,
        reason: 'Malformed or invalid access token',
      });

      res.status(401).json({
        success: false,
        error: 'Invalid or malformed authentication token.',
        code: 'INVALID_TOKEN',
      });
      return;
    }

    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User associated with this token no longer exists.',
        code: 'USER_NOT_FOUND',
      });
      return;
    }

    // Account Status Enforcement
    if (user.status === 'SUSPENDED') {
      securityLogger.log({
        eventType: 'FORBIDDEN_ACCESS',
        severity: 'WARN',
        userId: user.id,
        email: user.email,
        ip: req.ip,
        resource: req.originalUrl,
        reason: 'Suspended account attempted access',
      });

      res.status(403).json({
        success: false,
        error: 'Account has been suspended. Please contact school administration.',
        code: 'ACCOUNT_SUSPENDED',
      });
      return;
    }

    if (user.status === 'LOCKED' || user.isLocked()) {
      securityLogger.log({
        eventType: 'FORBIDDEN_ACCESS',
        severity: 'WARN',
        userId: user.id,
        email: user.email,
        ip: req.ip,
        resource: req.originalUrl,
        reason: 'Locked account attempted access',
      });

      res.status(403).json({
        success: false,
        error: 'Account is temporarily locked due to security policy.',
        code: 'ACCOUNT_LOCKED',
      });
      return;
    }

    if (user.status === 'PENDING') {
      res.status(403).json({
        success: false,
        error: 'Account registration is pending administrative approval.',
        code: 'ACCOUNT_PENDING',
      });
      return;
    }

    req.user = user;
    req.tokenPayload = decoded;
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Internal authentication error.',
      code: 'AUTH_INTERNAL_ERROR',
    });
  }
};

/**
 * Authorization Middleware (RBAC):
 * Verifies that the authenticated user possesses one of the allowed roles.
 * SUPER_ADMIN is granted blanket authority across all endpoints.
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required prior to authorization check.',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const userRole = req.user.role;

    // SUPER_ADMIN possesses superuser permissions across all areas
    if (userRole === 'SUPER_ADMIN') {
      return next();
    }

    if (!allowedRoles.includes(userRole)) {
      securityLogger.log({
        eventType: 'FORBIDDEN_ACCESS',
        severity: 'WARN',
        userId: req.user.id,
        email: req.user.email,
        role: userRole,
        ip: req.ip,
        resource: req.originalUrl,
        reason: `Insufficient role: ${userRole} attempted to access resource requiring [${allowedRoles.join(', ')}]`,
      });

      res.status(403).json({
        success: false,
        error: `Forbidden: Access denied. Required role(s): [${allowedRoles.join(', ')}].`,
        code: 'FORBIDDEN',
        userRole,
        requiredRoles: allowedRoles,
      });
      return;
    }

    next();
  };
};

/**
 * Account Status Middleware:
 * Ensures the account status is strictly ACTIVE.
 */
export const requireActiveAccount = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.status !== 'ACTIVE') {
    res.status(403).json({
      success: false,
      error: 'Action requires an active user account.',
      code: 'INACTIVE_ACCOUNT',
    });
    return;
  }
  next();
};
