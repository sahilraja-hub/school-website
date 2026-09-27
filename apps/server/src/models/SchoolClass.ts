import mongoose, { Document, Schema } from 'mongoose';
import { GradeLevel } from '@school/shared';

export interface ISchoolClass extends Document {
  name: string;
  code: string;
  gradeLevel: GradeLevel;
  teacherId: mongoose.Types.ObjectId;
  roomNumber: string;
  academicYear: string;
  studentIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SchoolClassSchema = new Schema<ISchoolClass>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    gradeLevel: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    roomNumber: { type: String, required: true },
    academicYear: { type: String, required: true, default: '2026-2027' },
    studentIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const SchoolClass = mongoose.model<ISchoolClass>('SchoolClass', SchoolClassSchema);
