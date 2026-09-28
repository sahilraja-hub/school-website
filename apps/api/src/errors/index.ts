export interface ValidationErrorDetail {
  field: string;
  message: string;
  code?: string;
  location?: 'body' | 'query' | 'params' | 'headers' | 'file';
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;
  public readonly details: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_SERVER_ERROR',
    details: any = []
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request / Validation Failure
 */
export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;

  constructor(
    message: string = 'Validation failed',
    details: ValidationErrorDetail[] | Record<string, string[]> = []
  ) {
    let formattedDetails: ValidationErrorDetail[] = [];
    const errorsMap: Record<string, string[]> = {};

    if (Array.isArray(details)) {
      formattedDetails = details;
      details.forEach((item) => {
        const key = item.field || 'general';
        if (!errorsMap[key]) {
          errorsMap[key] = [];
        }
        errorsMap[key].push(item.message);
      });
    } else if (typeof details === 'object' && details !== null) {
      Object.entries(details).forEach(([field, messages]) => {
        errorsMap[field] = Array.isArray(messages) ? messages : [messages];
        (Array.isArray(messages) ? messages : [messages]).forEach((msg) => {
          formattedDetails.push({ field, message: msg, code: 'custom' });
        });
      });
    }

    super(message, 400, 'VALIDATION_ERROR', formattedDetails);
    this.errors = errorsMap;
  }
}

/**
 * 401 Unauthorized / Authentication Error
 */
export class AuthenticationError extends AppError {
  constructor(
    message: string = 'Authentication required. Please provide valid credentials.',
    code: string = 'UNAUTHORIZED',
    details: any = []
  ) {
    super(message, 401, code, details);
  }
}
export const UnauthorizedError = AuthenticationError;

/**
 * 403 Forbidden / Authorization Error
 */
export class AuthorizationError extends AppError {
  constructor(
    message: string = 'Access denied. You do not have permission to access this resource.',
    code: string = 'FORBIDDEN',
    details: any = []
  ) {
    super(message, 403, code, details);
  }
}
export const ForbiddenError = AuthorizationError;

/**
 * 404 Not Found Error
 */
export class NotFoundError extends AppError {
  constructor(
    message: string = 'Resource not found',
    code: string = 'NOT_FOUND',
    details: any = []
  ) {
    super(message, 404, code, details);
  }
}

/**
 * 409 Conflict Error
 */
export class ConflictError extends AppError {
  constructor(
    message: string = 'Conflict detected with existing resource state',
    code: string = 'CONFLICT',
    details: any = []
  ) {
    super(message, 409, code, details);
  }
}

/**
 * 429 Rate Limit Exceeded Error
 */
export class RateLimitError extends AppError {
  constructor(
    message: string = 'Too many requests. Please try again later.',
    code: string = 'RATE_LIMIT_EXCEEDED',
    details: any = []
  ) {
    super(message, 429, code, details);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends AppError {
  constructor(
    message: string = 'An unexpected internal server error occurred.',
    code: string = 'INTERNAL_SERVER_ERROR',
    details: any = []
  ) {
    super(message, 500, code, details);
  }
}

/**
 * 400 Generic Bad Request Error
 */
export class BadRequestError extends AppError {
  constructor(
    message: string = 'Bad request',
    code: string = 'BAD_REQUEST',
    details: any = []
  ) {
    super(message, 400, code, details);
  }
}

/**
 * 423 Account Locked
 */
export class AccountLockedError extends AppError {
  public readonly remainingMinutes: number;

  constructor(remainingMinutes: number = 15, message?: string) {
    super(
      message || `Account is temporarily locked. Please try again in ${remainingMinutes} minute(s).`,
      423,
      'ACCOUNT_LOCKED',
      [{ field: 'account', message: `Locked for ${remainingMinutes} minutes`, remainingMinutes }]
    );
    this.remainingMinutes = remainingMinutes;
  }
}
