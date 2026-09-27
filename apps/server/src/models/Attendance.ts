import mongoose, { Document, Schema } from 'mongoose';
import { AttendanceStatus } from '@school/shared';

export interface IAttendance extends Document {
  classId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    classId: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'],
      default: 'PRESENT',
      required: true,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness per student per class per day
AttendanceSchema.index({ classId: 1, studentId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
