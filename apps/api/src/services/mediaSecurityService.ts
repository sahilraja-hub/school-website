import crypto from 'crypto';
import path from 'path';
import { BadRequestError } from '../errors';

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'] as const;

export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per image
export const MAX_BATCH_FILE_SIZE = 25 * 1024 * 1024; // 25 MB total batch

export const DANGEROUS_EXTENSIONS = [
  'exe', 'sh', 'bat', 'cmd', 'js', 'mjs', 'ts', 'php', 'phtml',
  'html', 'htm', 'xhtml', 'vbs', 'scr', 'ps1', 'jar', 'svg', 'py', 'pl'
];

export interface ValidatedMediaFile {
  originalFileName: string;
  safeFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  buffer: Buffer;
  extension: string;
}

export class MediaSecurityService {
  /**
   * Comprehensive security validation for uploaded media files.
   * Checks MIME type, extension, size, path traversal, dangerous scripts, and magic bytes.
   */
  public validateImageUpload(params: {
    fileName: string;
    fileType: string;
    fileSizeBytes: number;
    fileBase64?: string;
    buffer?: Buffer;
  }): ValidatedMediaFile {
    const { fileName, fileType, fileSizeBytes } = params;

    if (!fileName || typeof fileName !== 'string') {
      throw new BadRequestError('Invalid file upload: File name is required.');
    }

    // 1. Path traversal and null byte prevention
    if (
      fileName.includes('..') ||
      fileName.includes('/') ||
      fileName.includes('\\') ||
      fileName.includes('\0') ||
      fileName.includes('%00')
    ) {
      throw new BadRequestError('Dangerous upload detected: File name contains invalid path traversal or null characters.');
    }

    // 2. Validate Extension
    const rawExt = path.extname(fileName).toLowerCase().replace(/^\./, '');
    if (!rawExt) {
      throw new BadRequestError('Invalid file upload: Missing file extension.');
    }

    if (DANGEROUS_EXTENSIONS.includes(rawExt)) {
      throw new BadRequestError(`Dangerous upload rejected: File extension .${rawExt} is prohibited.`);
    }

    if (!ALLOWED_IMAGE_EXTENSIONS.includes(rawExt as any)) {
      throw new BadRequestError(
        `Invalid file extension .${rawExt}. Permitted image extensions: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}.`
      );
    }

    // 3. Validate MIME Type
    const normalizedMime = (fileType || '').toLowerCase().trim();
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(normalizedMime as any)) {
      throw new BadRequestError(
        `Invalid MIME type '${normalizedMime}'. Supported image types: ${ALLOWED_IMAGE_MIME_TYPES.join(', ')}.`
      );
    }

    // 4. Verify Extension matches MIME type
    this.verifyExtensionMatchesMime(rawExt, normalizedMime);

    // 5. Validate File Size
    if (fileSizeBytes <= 0) {
      throw new BadRequestError('Invalid file size: File cannot be empty.');
    }
    if (fileSizeBytes > MAX_IMAGE_FILE_SIZE) {
      throw new BadRequestError(
        `File size (${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB) exceeds maximum permitted limit of ${MAX_IMAGE_FILE_SIZE / (1024 * 1024)} MB.`
      );
    }

    // 6. Decode binary payload
    let buffer: Buffer;
    if (params.buffer) {
      buffer = params.buffer;
    } else if (params.fileBase64) {
      const cleanBase64 = params.fileBase64.replace(/^data:[a-z/]+;base64,/, '');
      buffer = Buffer.from(cleanBase64, 'base64');
    } else {
      throw new BadRequestError('Invalid file upload: No binary file payload provided.');
    }

    // 7. Magic Byte Binary Signature Inspection
    this.verifyMagicBytes(buffer, normalizedMime);

    // 8. Generate Safe Filename
    const randomHex = crypto.randomBytes(8).toString('hex');
    const safeFileName = `img_${Date.now()}_${randomHex}.${rawExt === 'jpeg' ? 'jpg' : rawExt}`;

    return {
      originalFileName: path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_'),
      safeFileName,
      mimeType: normalizedMime,
      fileSizeBytes: buffer.length > 0 ? buffer.length : fileSizeBytes,
      buffer,
      extension: rawExt,
    };
  }

  /**
   * Ensures the file extension corresponds to the declared MIME type to prevent type spoofing.
   */
  private verifyExtensionMatchesMime(ext: string, mime: string): void {
    const map: Record<string, string[]> = {
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/webp': ['webp'],
      'image/gif': ['gif'],
    };

    const validExtensions = map[mime];
    if (!validExtensions || !validExtensions.includes(ext)) {
      throw new BadRequestError(
        `Mime-type mismatch: Declared MIME type '${mime}' does not match file extension .${ext}.`
      );
    }
  }

  /**
   * Verifies the magic header bytes of image files to protect against payload disguised uploads.
   */
  private verifyMagicBytes(buffer: Buffer, mime: string): void {
    if (buffer.length < 4) {
      throw new BadRequestError('Corrupted file: Image binary is too small to contain valid header bytes.');
    }

    // JPEG: FF D8 FF
    if (mime === 'image/jpeg') {
      if (buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer[2] !== 0xff) {
        throw new BadRequestError('Corrupted or forged JPEG image: Header signature invalid.');
      }
    }

    // PNG: 89 50 4E 47
    if (mime === 'image/png') {
      if (
        buffer[0] !== 0x89 ||
        buffer[1] !== 0x50 ||
        buffer[2] !== 0x4e ||
        buffer[3] !== 0x47
      ) {
        throw new BadRequestError('Corrupted or forged PNG image: Header signature invalid.');
      }
    }

    // GIF: GIF8 (47 49 46 38)
    if (mime === 'image/gif') {
      if (
        buffer[0] !== 0x47 ||
        buffer[1] !== 0x49 ||
        buffer[2] !== 0x46 ||
        buffer[3] !== 0x38
      ) {
        throw new BadRequestError('Corrupted or forged GIF image: Header signature invalid.');
      }
    }

    // WebP: RIFF (52 49 46 46) ... WEBP (57 45 42 50)
    if (mime === 'image/webp') {
      if (buffer.length >= 12) {
        const isRiff =
          buffer[0] === 0x52 &&
          buffer[1] === 0x49 &&
          buffer[2] === 0x46 &&
          buffer[3] === 0x46;
        const isWebp =
          buffer[8] === 0x57 &&
          buffer[9] === 0x45 &&
          buffer[10] === 0x42 &&
          buffer[11] === 0x50;
        if (!isRiff || !isWebp) {
          throw new BadRequestError('Corrupted or forged WebP image: Header signature invalid.');
        }
      }
    }
  }
}

export const mediaSecurityService = new MediaSecurityService();
