import axios from 'axios';

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
  location?: string;
}

export interface ApiErrorResponseData {
  success: false;
  error?: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  } | string;
  code?: string;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    requestId?: string;
    timestamp: string;
  };
}

export class ApiError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details: ApiErrorDetail[];
  public readonly fieldErrors: Record<string, string>;
  public readonly requestId?: string;
  public readonly isNetworkError: boolean;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    details: ApiErrorDetail[] = [],
    fieldErrors: Record<string, string> = {},
    requestId?: string,
    isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.fieldErrors = fieldErrors;
    this.requestId = requestId;
    this.isNetworkError = isNetworkError;
  }
}

/**
 * Standardizes any error caught during API calls into a strongly-typed ApiError.
 */
export const parseApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const data = error.response?.data as ApiErrorResponseData | undefined;
    const requestId = data?.meta?.requestId || (error.response?.headers ? (error.response.headers['x-request-id'] as string) : undefined);

    // Network timeout or connection drop
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !error.response) {
      return new ApiError(
        'Unable to reach Oakridge Academy servers. Please check your internet connection.',
        'NETWORK_ERROR',
        0,
        [],
        {},
        requestId,
        true
      );
    }

    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred. Please try again.';
    let details: ApiErrorDetail[] = [];
    const fieldErrors: Record<string, string> = {};

    // 1. New Phase 9 Standard structured error format: { success: false, error: { code, message, details } }
    if (data?.error && typeof data.error === 'object') {
      code = data.error.code || code;
      message = data.error.message || message;
      if (Array.isArray(data.error.details)) {
        details = data.error.details;
        data.error.details.forEach((item) => {
          if (item.field) {
            fieldErrors[item.field] = item.message;
          }
        });
      }
    }
    // 2. Legacy error format where error is a string
    else if (typeof data?.error === 'string') {
      message = data.error;
      code = data.code || code;
    } else if (data?.message) {
      message = data.message;
      code = data.code || code;
    }

    // 3. Extract field error map if present
    if (data?.errors && typeof data.errors === 'object') {
      Object.entries(data.errors).forEach(([field, msgs]) => {
        const primaryMessage = Array.isArray(msgs) ? msgs[0] : String(msgs);
        fieldErrors[field] = primaryMessage;
        if (!details.some((d) => d.field === field)) {
          details.push({ field, message: primaryMessage });
        }
      });
    }

    // Map common HTTP statuses to friendly descriptions if generic
    if (status === 401 && code === 'INTERNAL_SERVER_ERROR') {
      code = 'UNAUTHORIZED';
      message = 'Your session has expired. Please sign in again.';
    } else if (status === 403 && code === 'INTERNAL_SERVER_ERROR') {
      code = 'FORBIDDEN';
      message = 'You do not have administrative permission to perform this action.';
    } else if (status === 404 && code === 'INTERNAL_SERVER_ERROR') {
      code = 'NOT_FOUND';
      message = 'The requested school record was not found.';
    } else if (status === 409 && code === 'INTERNAL_SERVER_ERROR') {
      code = 'CONFLICT';
      message = 'A conflict occurred with an existing record.';
    } else if (status === 429 && code === 'INTERNAL_SERVER_ERROR') {
      code = 'RATE_LIMIT_EXCEEDED';
      message = 'Too many requests. Please wait a moment before trying again.';
    }

    return new ApiError(message, code, status, details, fieldErrors, requestId, false);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 'CLIENT_ERROR', 500, [], {}, undefined, false);
  }

  return new ApiError('An unknown error occurred.', 'UNKNOWN_ERROR', 500, [], {}, undefined, false);
};

/**
 * Extracts a concise error message suitable for Toast notifications
 */
export const getErrorMessage = (error: unknown): string => {
  const apiError = parseApiError(error);
  return apiError.message;
};

/**
 * Extracts field-level validation messages for form inputs
 */
export const getFieldErrors = (error: unknown): Record<string, string> => {
  const apiError = parseApiError(error);
  return apiError.fieldErrors;
};
