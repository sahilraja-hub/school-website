import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors';
import { logger } from '../logger';
import { ApiResponse } from '../types';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const requestId = req.id;
  const timestamp = new Date().toISOString();

  // 1. Custom Typed AppError
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(err.message, err, { requestId, path: req.originalUrl, code: err.code });
    }

    const response: ApiResponse = {
      success: false,
      error: err.message,
      code: err.code,
      ...(typeof err.details === 'object' && err.details !== null && !Array.isArray(err.details)
        ? err.details
        : (err.details !== undefined && { details: err.details })),
      meta: {
        requestId,
        timestamp,
      },
    };

    res.status(err.statusCode).json(response);
    return;
  }

  // 2. Zod Validation Error
  if (err instanceof ZodError || err?.name === 'ZodError') {
    const errors: Record<string, string[]> = {};
    const issues = err.issues || err.errors || [];
    issues.forEach((issue: any) => {
      const path = issue.path?.join('.') || 'general';
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(issue.message);
    });

    const response: ApiResponse = {
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors,
      meta: {
        requestId,
        timestamp,
      },
    };

    res.status(400).json(response);
    return;
  }

  // 3. Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000 || err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'field';
    const response: ApiResponse = {
      success: false,
      error: `Duplicate value for ${field}. An entry already exists.`,
      code: 'DUPLICATE_ENTRY',
      meta: {
        requestId,
        timestamp,
      },
    };

    res.status(409).json(response);
    return;
  }

  // 4. Mongoose Cast Error (Invalid ObjectID)
  if (err.name === 'CastError') {
    const response: ApiResponse = {
      success: false,
      error: `Invalid identifier format for '${err.path}': ${err.value}`,
      code: 'INVALID_ID',
      meta: {
        requestId,
        timestamp,
      },
    };

    res.status(400).json(response);
    return;
  }

  // 5. JWT Authentication Errors
  if (err.name === 'TokenExpiredError') {
    const response: ApiResponse = {
      success: false,
      error: 'Token expired. Please re-authenticate.',
      code: 'TOKEN_EXPIRED',
      meta: {
        requestId,
        timestamp,
      },
    };

    res.status(401).json(response);
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    const response: ApiResponse = {
      success: false,
      error: 'Invalid or malformed token.',
      code: 'INVALID_TOKEN',
      meta: {
        requestId,
        timestamp,
      },
    };

    res.status(401).json(response);
    return;
  }

  // 6. Generic / Unexpected Internal Error
  logger.error('Unhandled internal server error', err, {
    requestId,
    path: req.originalUrl,
    method: req.method,
  });

  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const isProd = process.env.NODE_ENV === 'production';

  const response: ApiResponse = {
    success: false,
    error: isProd && statusCode === 500 ? 'An unexpected error occurred. Please contact support.' : (err.message || 'Internal Server Error'),
    code: err.code || 'INTERNAL_SERVER_ERROR',
    ...(!isProd && { stack: err.stack }),
    meta: {
      requestId,
      timestamp,
    },
  };

  res.status(statusCode).json(response);
};
