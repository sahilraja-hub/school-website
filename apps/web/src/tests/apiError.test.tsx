import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  parseApiError,
  getErrorMessage,
  getFieldErrors,
  ApiError,
} from '../services/apiError';
import { ApiErrorAlert } from '../components/common/ApiErrorAlert';

describe('Frontend API Error Handling Suite', () => {
  it('correctly parses Phase 9 structured error format { success: false, error: { code, message, details } }', () => {
    const mockAxiosError: any = {
      isAxiosError: true,
      response: {
        status: 400,
        headers: { 'x-request-id': 'req-test-uuid-123' },
        data: {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed for registration input',
            details: [
              { field: 'email', message: 'Email address is invalid', code: 'invalid_string' },
              { field: 'password', message: 'Password must be at least 8 characters', code: 'too_small' },
            ],
          },
          meta: {
            requestId: 'req-test-uuid-123',
            timestamp: '2026-09-29T00:00:00.000Z',
          },
        },
      },
    };

    const parsed = parseApiError(mockAxiosError);

    expect(parsed).toBeInstanceOf(ApiError);
    expect(parsed.statusCode).toBe(400);
    expect(parsed.code).toBe('VALIDATION_ERROR');
    expect(parsed.message).toBe('Validation failed for registration input');
    expect(parsed.requestId).toBe('req-test-uuid-123');
    expect(parsed.details).toHaveLength(2);
    expect(parsed.fieldErrors).toEqual({
      email: 'Email address is invalid',
      password: 'Password must be at least 8 characters',
    });
  });

  it('correctly parses legacy string error responses', () => {
    const mockLegacyError: any = {
      isAxiosError: true,
      response: {
        status: 401,
        headers: {},
        data: {
          success: false,
          error: 'Authentication required. Please sign in.',
          code: 'UNAUTHORIZED',
        },
      },
    };

    const parsed = parseApiError(mockLegacyError);

    expect(parsed.statusCode).toBe(401);
    expect(parsed.code).toBe('UNAUTHORIZED');
    expect(parsed.message).toBe('Authentication required. Please sign in.');
  });

  it('gracefully handles network errors and drops', () => {
    const networkError: any = {
      isAxiosError: true,
      code: 'ECONNABORTED',
      message: 'Network Error',
      response: undefined,
    };

    const parsed = parseApiError(networkError);

    expect(parsed.isNetworkError).toBe(true);
    expect(parsed.code).toBe('NETWORK_ERROR');
    expect(parsed.message).toContain('internet connection');
  });

  it('maps HTTP status codes when backend error message is generic', () => {
    const forbiddenError: any = {
      isAxiosError: true,
      response: {
        status: 403,
        data: {},
      },
    };

    const parsed = parseApiError(forbiddenError);
    expect(parsed.statusCode).toBe(403);
    expect(parsed.code).toBe('FORBIDDEN');
    expect(parsed.message).toContain('permission');
  });

  it('getErrorMessage returns direct string for toast notifications', () => {
    const mockError: any = {
      isAxiosError: true,
      response: {
        status: 409,
        data: {
          error: {
            code: 'CONFLICT',
            message: 'A student with this admission number already exists.',
          },
        },
      },
    };

    const message = getErrorMessage(mockError);
    expect(message).toBe('A student with this admission number already exists.');
  });

  it('getFieldErrors returns mapped dictionary of field validation issues', () => {
    const mockError: any = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          errors: {
            studentFirstName: ['First name must contain at least 2 characters'],
            parentPhone: ['Phone number must follow valid international format'],
          },
        },
      },
    };

    const fields = getFieldErrors(mockError);
    expect(fields.studentFirstName).toBe('First name must contain at least 2 characters');
    expect(fields.parentPhone).toBe('Phone number must follow valid international format');
  });

  it('renders ApiErrorAlert component with title, details list, and dismiss button', () => {
    const mockError = new ApiError(
      'Enrollment application rejected',
      'VALIDATION_ERROR',
      400,
      [
        { field: 'gradeLevel', message: 'Selected grade has reached maximum class capacity' },
        { field: 'birthCertificate', message: 'Verification document is required' },
      ],
      {},
      'req-alert-999'
    );

    const handleDismiss = vi.fn();

    render(<ApiErrorAlert error={mockError} onDismiss={handleDismiss} />);

    expect(screen.getByText('Enrollment application rejected')).toBeInTheDocument();
    expect(screen.getByText(/Selected grade has reached maximum class capacity/i)).toBeInTheDocument();
    expect(screen.getByText(/Verification document is required/i)).toBeInTheDocument();
    expect(screen.getByText(/req-alert-999/i)).toBeInTheDocument();
  });
});
