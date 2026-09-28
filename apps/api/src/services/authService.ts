import { userRepository, IUserLike } from '../repositories/userRepository';
import { generateTokens, verifyRefreshToken } from '../utils/token';
import { validatePasswordPolicy, hashPassword } from '../utils/password';
import { LoginInput, RegisterInput } from '@school/shared';
import { securityLogger } from './securityLogger';
import {
  UnauthorizedError,
  ForbiddenError,
  AccountLockedError,
  ConflictError,
  BadRequestError,
} from '../errors';

class AuthService {
  public async login(input: LoginInput, clientIp: string = 'unknown', userAgent?: string) {
    const { email, password } = input;

    const user = await userRepository.findByEmail(email);
    if (!user) {
      securityLogger.log({
        eventType: 'LOGIN_FAILURE',
        severity: 'WARN',
        email,
        ip: clientIp,
        userAgent,
        reason: 'User not found',
      });

      throw new UnauthorizedError('Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    // Check account lockout
    if (user.isLocked()) {
      const remainingMinutes = Math.ceil((user.lockUntil!.getTime() - Date.now()) / (60 * 1000));
      securityLogger.log({
        eventType: 'LOGIN_FAILURE',
        severity: 'ALERT',
        userId: user.id,
        email: user.email,
        ip: clientIp,
        userAgent,
        reason: `Login attempted on locked account (${remainingMinutes} mins remaining)`,
      });

      throw new AccountLockedError(remainingMinutes);
    }

    // Check account status
    if (user.status === 'SUSPENDED') {
      securityLogger.log({
        eventType: 'LOGIN_FAILURE',
        severity: 'WARN',
        userId: user.id,
        email: user.email,
        ip: clientIp,
        userAgent,
        reason: 'Suspended account login attempt',
      });

      throw new ForbiddenError('Account has been suspended. Please contact school administration.', 'ACCOUNT_SUSPENDED');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const failResult = await user.recordFailedLogin();

      if (failResult.locked) {
        securityLogger.log({
          eventType: 'ACCOUNT_LOCKED',
          severity: 'ALERT',
          userId: user.id,
          email: user.email,
          ip: clientIp,
          userAgent,
          reason: 'Account locked after 5 consecutive failed login attempts',
        });

        throw new UnauthorizedError(
          'Invalid email or password. Your account has been locked for 15 minutes due to multiple failed attempts.',
          'ACCOUNT_LOCKED',
          { locked: true }
        );
      }

      securityLogger.log({
        eventType: 'LOGIN_FAILURE',
        severity: 'WARN',
        userId: user.id,
        email: user.email,
        ip: clientIp,
        userAgent,
        reason: `Incorrect password (${failResult.attemptsLeft} attempts remaining)`,
      });

      throw new UnauthorizedError('Invalid email or password.', 'INVALID_CREDENTIALS', {
        attemptsLeft: failResult.attemptsLeft,
      });
    }

    // Successful login
    await user.recordSuccessfulLogin(clientIp);

    const { accessToken, refreshToken } = generateTokens(user);

    user.refreshTokens.push(refreshToken);
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    await user.save();

    securityLogger.log({
      eventType: 'LOGIN_SUCCESS',
      severity: 'INFO',
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: clientIp,
      userAgent,
      reason: 'Successful user authentication',
    });

    return {
      user: user.toSummary(),
      accessToken,
      refreshToken,
    };
  }

  public async register(input: RegisterInput, clientIp: string = 'unknown') {
    const { firstName, lastName, email, password, role, phone, gradeLevel, studentId } = input;

    const policyResult = validatePasswordPolicy(password);
    if (!policyResult.isValid) {
      throw new BadRequestError('Password does not meet security requirements.', 'WEAK_PASSWORD', policyResult.errors);
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists.', 'USER_EXISTS');
    }

    const assignedRole = role === 'SUPER_ADMIN' ? 'STUDENT' : (role || 'STUDENT');
    const passwordHash = await hashPassword(password);

    const newUser = await userRepository.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      passwordHash,
      role: assignedRole,
      status: 'ACTIVE',
      phone,
      gradeLevel,
      studentId: studentId || (assignedRole === 'STUDENT' ? `OAK-${Math.floor(100000 + Math.random() * 900000)}` : undefined),
      refreshTokens: [],
    });

    const { accessToken, refreshToken } = generateTokens(newUser);
    newUser.refreshTokens.push(refreshToken);
    await newUser.save();

    securityLogger.log({
      eventType: 'LOGIN_SUCCESS',
      severity: 'INFO',
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      ip: clientIp,
      reason: 'New user registered and authenticated',
    });

    return {
      user: newUser.toSummary(),
      accessToken,
      refreshToken,
    };
  }

  public async refreshToken(currentRefreshToken?: string, clientIp: string = 'unknown') {
    if (!currentRefreshToken) {
      throw new UnauthorizedError('No refresh token provided.', 'NO_REFRESH_TOKEN');
    }

    let payload;
    try {
      payload = verifyRefreshToken(currentRefreshToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token.', 'INVALID_REFRESH_TOKEN');
    }

    const user = await userRepository.findById(payload.userId);

    // Reuse / Breach Detection
    if (!user || !user.refreshTokens.includes(currentRefreshToken)) {
      if (user) {
        user.refreshTokens = [];
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save();

        securityLogger.log({
          eventType: 'TOKEN_REUSE_DETECTED',
          severity: 'ALERT',
          userId: user.id,
          email: user.email,
          ip: clientIp,
          reason: 'Attempted reuse of an already-rotated refresh token. Revoked all sessions.',
        });
      }

      throw new ForbiddenError('Refresh token reuse detected or token revoked. All sessions invalidated.', 'TOKEN_REUSE_DETECTED');
    }

    // Token Rotation
    user.refreshTokens = user.refreshTokens.filter((t) => t !== currentRefreshToken);
    const tokens = generateTokens(user);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    securityLogger.log({
      eventType: 'TOKEN_REFRESH',
      severity: 'INFO',
      userId: user.id,
      email: user.email,
      ip: clientIp,
      reason: 'Session refreshed with new access and refresh token pair',
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: user.toSummary(),
    };
  }

  public async logout(currentRefreshToken?: string, clientIp: string = 'unknown') {
    if (currentRefreshToken) {
      const user = await userRepository.findByRefreshToken(currentRefreshToken);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== currentRefreshToken);
        await user.save();

        securityLogger.log({
          eventType: 'LOGOUT',
          severity: 'INFO',
          userId: user.id,
          email: user.email,
          ip: clientIp,
          reason: 'User session logged out and refresh token revoked',
        });
      }
    }
  }

  public async logoutAll(user: IUserLike, clientIp: string = 'unknown') {
    user.refreshTokens = [];
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    securityLogger.log({
      eventType: 'LOGOUT_ALL',
      severity: 'INFO',
      userId: user.id,
      email: user.email,
      ip: clientIp,
      reason: 'User logged out of all active devices; all refresh tokens revoked',
    });
  }

  public async changePassword(user: IUserLike, currentPassword: string, newPassword: string, clientIp: string = 'unknown') {
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new BadRequestError('Current password is incorrect.', 'INVALID_PASSWORD');
    }

    const policyResult = validatePasswordPolicy(newPassword);
    if (!policyResult.isValid) {
      throw new BadRequestError('New password does not meet security requirements.', 'WEAK_PASSWORD', policyResult.errors);
    }

    user.passwordHash = await hashPassword(newPassword);
    user.passwordChangedAt = new Date();
    user.refreshTokens = [];
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    securityLogger.log({
      eventType: 'PASSWORD_CHANGED',
      severity: 'INFO',
      userId: user.id,
      email: user.email,
      ip: clientIp,
      reason: 'Password successfully changed and other sessions terminated',
    });
  }

  public getSecurityLogs(limit: number = 50) {
    return securityLogger.getEvents({ limit });
  }
}

export const authService = new AuthService();
