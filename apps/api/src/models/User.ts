import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole, AccountStatus, UserSummary } from '@school/shared';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  studentId?: string;
  gradeLevel?: string;
  phone?: string;
  failedLoginAttempts: number;
  lockUntil?: Date;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  passwordChangedAt?: Date;
  tokenVersion: number;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): Promise<boolean>;
  isLocked(): boolean;
  recordSuccessfulLogin(ip?: string): Promise<void>;
  recordFailedLogin(): Promise<{ locked: boolean; attemptsLeft: number; lockUntil?: Date }>;
  toSummary(): UserSummary;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      default: 'STUDENT',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'PENDING', 'LOCKED'],
      default: 'ACTIVE',
      required: true,
      index: true,
    },
    avatarUrl: { type: String },
    studentId: { type: String, sparse: true, index: true },
    gradeLevel: { type: String },
    phone: { type: String },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLoginAt: { type: Date },
    lastLoginIp: { type: String },
    passwordChangedAt: { type: Date },
    tokenVersion: { type: Number, default: 0 },
    refreshTokens: [{ type: String }],
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.methods.isLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil.getTime() > Date.now());
};

UserSchema.methods.recordSuccessfulLogin = async function (ip?: string): Promise<void> {
  this.failedLoginAttempts = 0;
  this.lockUntil = undefined;
  this.lastLoginAt = new Date();
  if (ip) this.lastLoginIp = ip;
  await this.save();
};

UserSchema.methods.recordFailedLogin = async function (): Promise<{
  locked: boolean;
  attemptsLeft: number;
  lockUntil?: Date;
}> {
  // If lock expired, reset counter first
  if (this.lockUntil && this.lockUntil.getTime() <= Date.now()) {
    this.failedLoginAttempts = 0;
    this.lockUntil = undefined;
  }

  this.failedLoginAttempts = (this.failedLoginAttempts || 0) + 1;
  const maxAttempts = 5;

  if (this.failedLoginAttempts >= maxAttempts) {
    const lockDuration = 15 * 60 * 1000; // 15 minutes lockout
    this.lockUntil = new Date(Date.now() + lockDuration);
    await this.save();
    return { locked: true, attemptsLeft: 0, lockUntil: this.lockUntil };
  }

  await this.save();
  return { locked: false, attemptsLeft: maxAttempts - this.failedLoginAttempts };
};

UserSchema.methods.toSummary = function (): UserSummary {
  return {
    id: this._id ? this._id.toString() : this.id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    role: this.role,
    status: this.status,
    avatarUrl: this.avatarUrl,
    studentId: this.studentId,
    gradeLevel: this.gradeLevel as any,
    phone: this.phone,
    lastLoginAt: this.lastLoginAt ? this.lastLoginAt.toISOString() : undefined,
  };
};

export const User = mongoose.model<IUser>('User', UserSchema);
