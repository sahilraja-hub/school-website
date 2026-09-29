import mongoose, { Document, Schema } from 'mongoose';
import { AdmissionStatus, GradeLevel } from '@school/shared';

export interface IAdmissionDocument {
  id: string;
  documentType: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  fileUrl: string;
  uploadedAt: string;
  verified?: boolean;
}

export interface IAdmissionReviewNote {
  id: string;
  adminId: string;
  adminName: string;
  note: string;
  createdAt: string;
  action?: string;
}

export interface IAdmissionCorrectionRequest {
  reason: string;
  fieldsToCorrect: string[];
  requestedAt: string;
  resolvedAt?: string;
}

export interface IAdmission extends Document {
  applicationNumber: string;
  trackingToken: string;
  studentFirstName: string;
  studentLastName: string;
  dateOfBirth: string;
  gender?: string;
  bloodGroup?: string;
  nationality?: string;
  gradeApplyingFor: GradeLevel;
  academicYear: string;
  streamOrTrack?: string;
  parentName: string;
  parentRelationship?: string;
  parentEmail: string;
  parentPhone: string;
  parentOccupation?: string;
  emergencyContact?: string;
  alternatePhone?: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  previousSchool?: string;
  previousGrade?: string;
  previousGpa?: string;
  transferCertificateNumber?: string;
  status: AdmissionStatus;
  documents: IAdmissionDocument[];
  notes?: string;
  reviewNotes: IAdmissionReviewNote[];
  correctionRequest?: IAdmissionCorrectionRequest;
  enrolledStudentId?: string;
  enrolledAt?: Date;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionDocumentSchema = new Schema<IAdmissionDocument>(
  {
    id: { type: String, required: true },
    documentType: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSizeBytes: { type: Number, required: true },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: String, required: true },
    verified: { type: Boolean, default: false },
  },
  { _id: false }
);

const AdmissionReviewNoteSchema = new Schema<IAdmissionReviewNote>(
  {
    id: { type: String, required: true },
    adminId: { type: String, required: true },
    adminName: { type: String, required: true },
    note: { type: String, required: true },
    createdAt: { type: String, required: true },
    action: { type: String },
  },
  { _id: false }
);

const AdmissionCorrectionRequestSchema = new Schema<IAdmissionCorrectionRequest>(
  {
    reason: { type: String, required: true },
    fieldsToCorrect: [{ type: String }],
    requestedAt: { type: String, required: true },
    resolvedAt: { type: String },
  },
  { _id: false }
);

const AdmissionSchema = new Schema<IAdmission>(
  {
    applicationNumber: { type: String, required: true, unique: true, index: true },
    trackingToken: { type: String, required: true, index: true },
    studentFirstName: { type: String, required: true, trim: true },
    studentLastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, default: 'MALE' },
    bloodGroup: { type: String },
    nationality: { type: String, default: 'American' },
    gradeApplyingFor: { type: String, required: true },
    academicYear: { type: String, default: '2026-2027' },
    streamOrTrack: { type: String, default: 'General' },
    parentName: { type: String, required: true, trim: true },
    parentRelationship: { type: String, default: 'Parent / Guardian' },
    parentEmail: { type: String, required: true, lowercase: true, trim: true },
    parentPhone: { type: String, required: true, trim: true },
    parentOccupation: { type: String },
    emergencyContact: { type: String },
    alternatePhone: { type: String },
    address: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, default: 'United States' },
    previousSchool: { type: String },
    previousGrade: { type: String },
    previousGpa: { type: String },
    transferCertificateNumber: { type: String },
    status: {
      type: String,
      enum: [
        'DRAFT',
        'SUBMITTED',
        'UNDER_REVIEW',
        'INTERVIEW_SCHEDULED',
        'CORRECTION_REQUESTED',
        'APPROVED',
        'ACCEPTED',
        'WAITLISTED',
        'REJECTED',
        'ENROLLED',
      ],
      default: 'SUBMITTED',
      index: true,
    },
    documents: [AdmissionDocumentSchema],
    notes: { type: String },
    reviewNotes: [AdmissionReviewNoteSchema],
    correctionRequest: AdmissionCorrectionRequestSchema,
    enrolledStudentId: { type: String },
    enrolledAt: { type: Date },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

export const Admission = mongoose.model<IAdmission>('Admission', AdmissionSchema);
