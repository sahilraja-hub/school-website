import mongoose, { Document, Schema } from 'mongoose';
import { AdmissionStatus, GradeLevel } from '@school/shared';

export interface IAdmission extends Document {
  applicationNumber: string;
  studentFirstName: string;
  studentLastName: string;
  dateOfBirth: string;
  gradeApplyingFor: GradeLevel;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  previousSchool?: string;
  status: AdmissionStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionSchema = new Schema<IAdmission>(
  {
    applicationNumber: { type: String, required: true, unique: true, index: true },
    studentFirstName: { type: String, required: true, trim: true },
    studentLastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: String, required: true },
    gradeApplyingFor: { type: String, required: true },
    parentName: { type: String, required: true, trim: true },
    parentEmail: { type: String, required: true, lowercase: true, trim: true },
    parentPhone: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    previousSchool: { type: String },
    status: {
      type: String,
      enum: ['SUBMITTED', 'UNDER_REVIEW', 'INTERVIEW_SCHEDULED', 'ACCEPTED', 'WAITLISTED', 'REJECTED'],
      default: 'SUBMITTED',
      index: true,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Admission = mongoose.model<IAdmission>('Admission', AdmissionSchema);
