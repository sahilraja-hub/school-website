import mongoose, { Document, Schema } from 'mongoose';
import { UserRole } from '@school/shared';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  category: 'ACADEMIC' | 'SPORTS' | 'EVENT' | 'URGENT' | 'GENERAL';
  isPinned: boolean;
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  targetRoles: UserRole[];
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['ACADEMIC', 'SPORTS', 'EVENT', 'URGENT', 'GENERAL'],
      default: 'GENERAL',
      index: true,
    },
    isPinned: { type: Boolean, default: false },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    targetRoles: [
      {
        type: String,
        enum: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
      },
    ],
    publishDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
