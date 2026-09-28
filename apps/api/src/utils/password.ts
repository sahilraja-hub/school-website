import bcrypt from 'bcryptjs';

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePasswordPolicy = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }
  if (password.length > 128) {
    errors.push('Password must not exceed 128 characters.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one digit (0-9).');
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = process.env.NODE_ENV === 'test' ? 8 : 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
};
