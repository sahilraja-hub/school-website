import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { config } from '../config';
import { UserRole, AccountStatus } from '@school/shared';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  tokenVersion?: number;
}

export interface UserTokenSignable {
  _id?: any;
  id?: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  tokenVersion?: number;
}

export const generateTokens = (user: UserTokenSignable) => {
  const userId = user._id ? user._id.toString() : user.id!;
  const nonce = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const payload: TokenPayload = {
    userId,
    email: user.email,
    role: user.role,
    status: user.status || 'ACTIVE',
    tokenVersion: user.tokenVersion || 0,
  };

  const accessToken = jwt.sign({ ...payload, jti: `acc-${nonce}` }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn as any,
  });

  const refreshToken = jwt.sign({ ...payload, jti: `ref-${nonce}` }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as any,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
    maxAge: config.jwt.cookieMaxAge,
    path: '/',
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
    path: '/',
  });
};
