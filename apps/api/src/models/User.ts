import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '@school/shared';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string;
  studentId?: string;
  gradeLevel?: string;
  phone?: string;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
  toSummary(): Record<string, any>;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      default: 'STUDENT',
      required: true,
      index: true,
    },
    avatarUrl: { type: String },
    studentId: { type: String, sparse: true, index: true },
    gradeLevel: { type: String },
    phone: { type: String },
    refreshTokens: [{ type: String }],
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.methods.toSummary = function () {
  return {
    id: this._id.toString(),
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    role: this.role,
    avatarUrl: this.avatarUrl,
    studentId: this.studentId,
    gradeLevel: this.gradeLevel,
    phone: this.phone,
  };
};

export const User = mongoose.model<IUser>('User', UserSchema);
