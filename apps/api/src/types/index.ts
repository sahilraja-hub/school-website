import { IUserLike } from '../repositories/userRepository';
import { TokenPayload } from '../utils/token';

declare global {
  namespace Express {
    interface Request {
      id?: string;
      startTime?: number;
      user?: IUserLike;
      tokenPayload?: TokenPayload;
    }
  }
}

export interface ErrorResponseObject {
  code: string;
  message: string;
  details?: any[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ErrorResponseObject | string;
  code?: string;
  errors?: Record<string, string[]>;
  meta?: {
    requestId?: string;
    timestamp: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export * from './dtos';
