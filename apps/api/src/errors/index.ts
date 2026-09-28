export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', code: string = 'NOT_FOUND', details?: any) {
    super(message, 404, code, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', code: string = 'BAD_REQUEST', details?: any) {
    super(message, 400, code, details);
  }
}

export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;

  constructor(message: string = 'Validation failed', errors: Record<string, string[]> = {}) {
    super(message, 400, 'VALIDATION_ERROR', errors);
    this.errors = errors;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required', code: string = 'UNAUTHORIZED', details?: any) {
    super(message, 401, code, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied', code: string = 'FORBIDDEN', details?: any) {
    super(message, 403, code, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict detected', code: string = 'CONFLICT', details?: any) {
    super(message, 409, code, details);
  }
}

export class AccountLockedError extends AppError {
  public readonly remainingMinutes: number;

  constructor(remainingMinutes: number = 15, message?: string) {
    super(
      message || `Account is temporarily locked. Please try again in ${remainingMinutes} minute(s).`,
      423,
      'ACCOUNT_LOCKED',
      { remainingMinutes }
    );
    this.remainingMinutes = remainingMinutes;
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests. Please try again later.', code: string = 'RATE_LIMIT_EXCEEDED') {
    super(message, 429, code);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', code: string = 'INTERNAL_ERROR') {
    super(message, 500, code);
  }
}
