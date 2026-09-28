import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError, ValidationErrorDetail } from '../errors';

export interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
  file?: ZodSchema;
  headers?: ZodSchema;
}

/**
 * Validates request components (params, query, body, file metadata) against Zod schemas.
 * Replaces request fields with sanitized / coerced values upon success.
 * Collects all errors across all targeted fields and yields a typed ValidationError.
 */
export const validateRequest = (schemas: ValidationSchemas) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const details: ValidationErrorDetail[] = [];

    // 1. Validate route params
    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          details.push({
            field: issue.path.join('.') || 'param',
            message: issue.message,
            code: issue.code,
            location: 'params',
          });
        });
      } else {
        req.params = result.data;
      }
    }

    // 2. Validate URL search query
    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          details.push({
            field: issue.path.join('.') || 'query',
            message: issue.message,
            code: issue.code,
            location: 'query',
          });
        });
      } else {
        req.query = result.data;
      }
    }

    // Extract file data before body parse might strip it
    const rawFileData = (req as any).file || (req.body && req.body.fileMetadata) || (req as any).files;

    // 3. Validate request body
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          details.push({
            field: issue.path.join('.') || 'body',
            message: issue.message,
            code: issue.code,
            location: 'body',
          });
        });
      } else {
        req.body = result.data;
      }
    }

    // 4. Validate file metadata (from req.file, req.files, or req.body.fileMetadata)
    if (schemas.file) {
      const fileData = rawFileData;
      if (!fileData) {
        details.push({
          field: 'file',
          message: 'File or file metadata is required',
          code: 'custom',
          location: 'file',
        });
      } else {
        const result = schemas.file.safeParse(fileData);
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            details.push({
              field: issue.path.join('.') || 'file',
              message: issue.message,
              code: issue.code,
              location: 'file',
            });
          });
        }
      }
    }

    if (details.length > 0) {
      return next(new ValidationError('Validation failed', details));
    }

    next();
  };
};

/**
 * Standalone validator helper for single-source validation (backward compatible)
 */
export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return validateRequest({ [source]: schema });
};

export default validateRequest;
