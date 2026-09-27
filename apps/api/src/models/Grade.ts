import mongoose, { Document, Schema } from 'mongoose';

export interface IGradeEntry {
  studentId: mongoose.Types.ObjectId;
  pointsEarned: number;
  letterGrade?: string;
  feedback?: string;
  submittedAt?: Date;
}

export interface IAssignment extends Document {
  classId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
  weight?: number;
  entries: IGradeEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const GradeEntrySchema = new Schema<IGradeEntry>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pointsEarned: { type: Number, required: true, min: 0 },
    letterGrade: { type: String },
    feedback: { type: String },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    classId: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    dueDate: { type: String, required: true },
    maxPoints: { type: Number, required: true, default: 100 },
    weight: { type: Number, default: 10 },
    entries: [GradeEntrySchema],
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
