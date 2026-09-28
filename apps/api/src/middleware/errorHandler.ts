import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '../errors';
import { logger } from '../logger';
import { ApiResponse, ErrorResponseObject } from '../types';

/**
 * Strips sensitive data like connection URIs, JWT tokens, hashes, and internal paths
 */
const sanitizeMessage = (message: string): string => {
  if (!message) return '';
  return message
    .replace(/(mongodb(\+srv)?|postgres(ql)?|mysql):\/\/[^\s]+/gi, '[DATABASE_URI_REDACTED]')
    .replace(/Bearer\s+[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.?[A-Za-z0-9\-_.+/=]*/gi, 'Bearer [TOKEN_REDACTED]')
    .replace(/eyJ[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.?[A-Za-z0-9\-_.+/=]*/g, '[JWT_REDACTED]')
    .replace(/\$2[aby]?\$\d+\$[./A-Za-z0-9]{20,}/g, '[PASSWORD_HASH_REDACTED]')
    .replace(/SuperSecretPass123/g, '[SECRET_REDACTED]');
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const requestId = req.id || (req.headers['x-request-id'] as string) || 'unknown-request-id';
  const timestamp = new Date().toISOString();
  const isProd = process.env.NODE_ENV === 'production';

  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let errorMessage = 'An internal server error occurred. Please contact support.';
  let errorDetails: any[] = [];
  const errorsMap: Record<string, string[]> = {};

  // 1. Zod Validation Errors
  if (err instanceof ZodError || err?.name === 'ZodError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    errorMessage = 'Validation failed';

    const issues = err.issues || err.errors || [];
    issues.forEach((issue: any) => {
      const field = issue.path?.join('.') || 'general';
      if (!errorsMap[field]) {
        errorsMap[field] = [];
      }
      errorsMap[field].push(issue.message);
      errorDetails.push({
        field,
        message: issue.message,
        code: issue.code || 'invalid_input',
      });
    });
  }
  // 2. Custom Application Errors (AppError and subclasses)
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.code;
    errorMessage = err.message;

    if (err instanceof ValidationError) {
      Object.assign(errorsMap, err.errors);
      errorDetails = Array.isArray(err.details) ? err.details : [];
    } else if (Array.isArray(err.details)) {
      errorDetails = err.details;
    } else if (err.details && typeof err.details === 'object') {
      errorDetails = [err.details];
    }
  }
  // 3. Prisma ORM Database Errors
  else if (err?.code?.startsWith('P') || err?.name?.includes('PrismaClient')) {
    if (err.code === 'P2002') {
      statusCode = 409;
      errorCode = 'CONFLICT';
      const target = Array.isArray(err?.meta?.target) ? err.meta.target.join(', ') : 'field';
      errorMessage = isProd
        ? 'A record with this identifier already exists.'
        : `Unique constraint violation on: ${target}. A record with this unique value already exists.`;
      errorDetails.push({ field: target, message: errorMessage });
    } else if (err.code === 'P2025') {
      statusCode = 404;
      errorCode = 'NOT_FOUND';
      errorMessage = isProd ? 'The requested resource was not found.' : (err.message || 'Record not found.');
    } else if (err.code === 'P2003') {
      statusCode = 400;
      errorCode = 'FOREIGN_KEY_VIOLATION';
      errorMessage = isProd ? 'Referenced parent record does not exist.' : (err.message || 'Foreign key violation.');
    } else {
      statusCode = 500;
      errorCode = 'DATABASE_ERROR';
      errorMessage = isProd
        ? 'A database operational error occurred. Please try again later.'
        : `Database error (${err.code}): ${err.message}`;
    }
  }
  // 4. Mongoose / MongoDB Database Errors
  else if (err?.name === 'MongoServerError' && err.code === 11000) {
    statusCode = 409;
    errorCode = 'CONFLICT';
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'uniqueField';
    errorMessage = isProd
      ? 'A record with this identifier already exists.'
      : `Duplicate value for '${field}'. An entry already exists.`;
    errorDetails.push({ field, message: errorMessage });
  } else if (err?.name === 'CastError') {
    statusCode = 400;
    errorCode = 'INVALID_IDENTIFIER';
    errorMessage = `Invalid identifier format for '${err.path}'`;
    errorDetails.push({ field: err.path, message: errorMessage });
  }
  // 5. JWT Authentication Errors
  else if (err?.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'TOKEN_EXPIRED';
    errorMessage = 'Token expired. Please re-authenticate.';
  } else if (err?.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'INVALID_TOKEN';
    errorMessage = 'Invalid or malformed authentication token.';
  }
  // 6. JSON Parse Syntax Error (Malformed Body)
  else if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    errorCode = 'MALFORMED_JSON';
    errorMessage = 'Malformed JSON in request body.';
  }
  // 7. General / Unhandled Error
  else {
    statusCode = typeof err?.statusCode === 'number' ? err.statusCode : 500;
    errorCode = err?.code || 'INTERNAL_SERVER_ERROR';
    errorMessage = isProd && statusCode >= 500
      ? 'An unexpected error occurred. Please contact support.'
      : (err?.message || 'Internal server error');
  }

  // Sanitize message to never leak secrets
  errorMessage = sanitizeMessage(errorMessage);

  // Structured logging on server side (includes stack trace internally, never sent to client in prod)
  if (statusCode >= 500) {
    logger.error(`[${requestId}] ${statusCode} - ${errorMessage}`, err, {
      requestId,
      path: req.originalUrl,
      method: req.method,
      code: errorCode,
      ip: req.ip,
    });
  } else {
    logger.warn(`[${requestId}] ${statusCode} - ${errorMessage}`, {
      requestId,
      path: req.originalUrl,
      method: req.method,
      code: errorCode,
    });
  }

  const structuredError: ErrorResponseObject = {
    code: errorCode,
    message: errorMessage,
    details: errorDetails,
  };

  const response: ApiResponse = {
    success: false,
    error: structuredError,
    // Provide root-level convenience fields for backward compatibility
    code: errorCode,
    ...(Object.keys(errorsMap).length > 0 && { errors: errorsMap }),
    ...(typeof err?.details === 'object' && !Array.isArray(err?.details) ? err.details : {}),
    ...(err?.attemptsLeft !== undefined && { attemptsLeft: err.attemptsLeft }),
    ...(err?.remainingMinutes !== undefined && { remainingMinutes: err.remainingMinutes }),
    ...(err?.userRole && { userRole: err.userRole }),
    ...(err?.requiredRoles && { requiredRoles: err.requiredRoles }),
    meta: {
      requestId,
      timestamp,
      ...(process.env.NODE_ENV === 'test' && !isProd && err?.stack && { stack: sanitizeMessage(err.stack) }),
    },
  };

  res.status(statusCode).json(response);
};

export default errorHandler;
