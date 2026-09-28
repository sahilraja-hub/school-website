import { z } from 'zod';

export const passwordPolicySchema = z
  .string()
  .min(8, 'Password must be at least 8 characters in length')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one numerical digit')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const loginInputSchema = z.object({
  email: z.string().trim().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required').max(128),
});

export const refreshTokenInputSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').optional(),
});

export const changePasswordInputSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordPolicySchema,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirmation password do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export const resetPasswordInputSchema = z
  .object({
    token: z.string().min(1, 'Password reset token is required'),
    newPassword: passwordPolicySchema,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirmation password do not match',
    path: ['confirmPassword'],
  });
