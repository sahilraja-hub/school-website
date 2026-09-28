import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@school/shared';
import { securityLogger } from '../services/securityLogger';

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: User is not authenticated.',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    // SUPER_ADMIN has blanket authority over all roles
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      securityLogger.log({
        eventType: 'FORBIDDEN_ACCESS',
        severity: 'WARN',
        userId: req.user.id,
        email: req.user.email,
        role: req.user.role,
        ip: req.ip,
        resource: req.originalUrl,
        reason: `Role '${req.user.role}' lacks permission; required: [${roles.join(', ')}]`,
      });

      res.status(403).json({
        success: false,
        error: `Forbidden: Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
        code: 'FORBIDDEN',
        userRole: req.user.role,
        requiredRoles: roles,
      });
      return;
    }

    next();
  };
};

export { authorizeRoles as authorize };
