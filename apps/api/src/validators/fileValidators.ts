import { z } from 'zod';

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
] as const;

export const ALLOWED_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'gif',
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'csv',
] as const;

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validates file upload metadata (MIME type, size, safe file name)
 */
export const fileMetadataSchema = z.object({
  fileName: z
    .string()
    .min(1, 'File name is required')
    .max(255, 'File name must not exceed 255 characters')
    .refine((name) => !name.includes('..') && !name.includes('/') && !name.includes('\\'), {
      message: 'File name must not contain directory traversal characters',
    })
    .refine(
      (name) => {
        const parts = name.split('.');
        const ext = parts.length > 1 ? parts.pop()?.toLowerCase() : '';
        return ext && ALLOWED_EXTENSIONS.includes(ext as any);
      },
      {
        message: `File extension must be one of: ${ALLOWED_EXTENSIONS.join(', ')}`,
      }
    ),
  fileSize: z
    .number()
    .int('File size must be an integer')
    .positive('File size must be greater than 0 bytes')
    .max(MAX_FILE_SIZE_BYTES, `File size exceeds maximum permitted limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`),
  mimeType: z
    .string()
    .refine((mime) => ALLOWED_MIME_TYPES.includes(mime as any), {
      message: `MIME type is not allowed. Supported types: ${ALLOWED_MIME_TYPES.join(', ')}`,
    }),
});

/**
 * Stricter validator specifically for profile avatars and gallery photos
 */
export const imageFileMetadataSchema = fileMetadataSchema.extend({
  fileSize: z
    .number()
    .int()
    .positive()
    .max(MAX_IMAGE_SIZE_BYTES, `Image size exceeds maximum permitted limit of ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB`),
  mimeType: z
    .string()
    .refine((mime) => mime.startsWith('image/'), {
      message: 'Only image files (JPEG, PNG, WebP, GIF) are allowed for this upload',
    }),
});
