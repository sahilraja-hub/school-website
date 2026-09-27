import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { generateTokens, setRefreshTokenCookie, clearRefreshTokenCookie, verifyRefreshToken } from '../utils/token';
import { LoginInput, RegisterInput } from '@school/shared';

export const login = async (req: Request<{}, {}, LoginInput>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid email or password.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid email or password.' });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token for rotation and revocation
    user.refreshTokens.push(refreshToken);
    // Keep max 5 active refresh tokens per user
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toSummary(),
        accessToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Login failed.' });
  }
};

export const register = async (req: Request<{}, {}, RegisterInput>, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role, phone, gradeLevel, studentId } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, error: 'User with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'STUDENT',
      phone,
      gradeLevel,
      studentId: studentId || (role === 'STUDENT' ? `OAK-${Math.floor(100000 + Math.random() * 900000)}` : undefined),
      refreshTokens: [],
    });

    const { accessToken, refreshToken } = generateTokens(newUser);
    newUser.refreshTokens.push(refreshToken);
    await newUser.save();

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser.toSummary(),
        accessToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Registration failed.' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentRefreshToken = req.cookies?.refreshToken;
    if (!currentRefreshToken) {
      res.status(401).json({ success: false, error: 'No refresh token provided.' });
      return;
    }

    let payload;
    try {
      payload = verifyRefreshToken(currentRefreshToken);
    } catch {
      clearRefreshTokenCookie(res);
      res.status(401).json({ success: false, error: 'Invalid or expired refresh token.' });
      return;
    }

    const user = await User.findById(payload.userId);
    if (!user || !user.refreshTokens.includes(currentRefreshToken)) {
      // Detected token reuse or deleted user -> invalidate all
      if (user) {
        user.refreshTokens = [];
        await user.save();
      }
      clearRefreshTokenCookie(res);
      res.status(403).json({ success: false, error: 'Refresh token reuse detected or invalid token.' });
      return;
    }

    // Token rotation
    user.refreshTokens = user.refreshTokens.filter((t) => t !== currentRefreshToken);
    const tokens = generateTokens(user);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    setRefreshTokenCookie(res, tokens.refreshToken);

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        user: user.toSummary(),
      },
    });
  } catch (error: any) {
    clearRefreshTokenCookie(res);
    res.status(500).json({ success: false, error: error.message || 'Token refresh failed.' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentRefreshToken = req.cookies?.refreshToken;
    if (currentRefreshToken) {
      await User.updateOne(
        { refreshTokens: currentRefreshToken },
        { $pull: { refreshTokens: currentRefreshToken } }
      );
    }
    clearRefreshTokenCookie(res);
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    clearRefreshTokenCookie(res);
    res.status(500).json({ success: false, error: error.message || 'Logout error.' });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated.' });
    return;
  }
  res.json({
    success: true,
    data: {
      user: req.user.toSummary(),
    },
  });
};
