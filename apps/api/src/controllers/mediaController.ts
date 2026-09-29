import { Request, Response } from 'express';
import { mediaRepository } from '../repositories/mediaRepository';
import { mediaStorageService } from '../services/mediaStorageService';
import { NotFoundError, ForbiddenError, BadRequestError } from '../errors';

// Helper to convert repository record to sanitized API DTO
export const toMediaDto = (media: any) => {
  return mediaStorageService.sanitizeStorageCredentials({
    id: media.id,
    galleryId: media.galleryId || null,
    title: media.title || null,
    caption: media.caption || null,
    altText: media.altText || null,
    category: media.category,
    url: media.url,
    variants: media.variants,
    fileName: media.fileName,
    originalFileName: media.originalFileName,
    fileSize: media.fileSize,
    mimeType: media.mimeType,
    dimensions: media.dimensions || null,
    order: media.order,
    isPrivate: media.isPrivate,
    uploadedBy: media.uploadedBy || null,
    createdAt: media.createdAt ? new Date(media.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: media.updatedAt ? new Date(media.updatedAt).toISOString() : new Date().toISOString(),
  });
};

export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  const user = req.user;
  const payload = req.body;

  const created = await mediaRepository.createMedia({
    ...payload,
    uploadedBy: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'System Admin',
  });

  res.status(201).json({
    success: true,
    message: 'Media image uploaded and processed successfully.',
    data: toMediaDto(created),
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
      variantsGenerated: ['thumbnail', 'medium', 'large', 'original'],
    },
  });
};

export const uploadMultipleMedia = async (req: Request, res: Response): Promise<void> => {
  const user = req.user;
  const { files, galleryId, category, isPrivate } = req.body;

  if (!Array.isArray(files) || files.length === 0) {
    throw new BadRequestError('Upload batch must contain at least one file.');
  }

  const createdItems = await mediaRepository.createMultipleMedia(files, {
    galleryId,
    category,
    isPrivate,
    uploadedBy: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'System Admin',
  });

  res.status(201).json({
    success: true,
    message: `Batch upload complete: ${createdItems.length} media items processed.`,
    data: createdItems.map(toMediaDto),
    meta: {
      count: createdItems.length,
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const listMedia = async (req: Request, res: Response): Promise<void> => {
  const { galleryId, category, search, page, limit } = req.query as any;
  const isAdmin = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'ADMIN';

  const result = await mediaRepository.listMedia({
    galleryId,
    category,
    search,
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    includePrivate: isAdmin,
  });

  res.json({
    success: true,
    data: result.items.map(toMediaDto),
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    },
  });
};

export const getMediaById = async (req: Request, res: Response): Promise<void> => {
  const isAdmin = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'ADMIN';
  const media = await mediaRepository.getMediaById(req.params.id);
  if (!media) throw new NotFoundError('Media item not found.');

  // Access check for private media
  if (media.isPrivate && !isAdmin) {
    throw new ForbiddenError('Access denied: Confidential media item requires authentication or signed token.');
  }

  res.json({
    success: true,
    data: toMediaDto(media),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const updateMedia = async (req: Request, res: Response): Promise<void> => {
  const updated = await mediaRepository.updateMedia(req.params.id, req.body);
  if (!updated) throw new NotFoundError('Media item not found.');

  res.json({
    success: true,
    message: 'Media metadata updated successfully.',
    data: toMediaDto(updated),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const replaceMedia = async (req: Request, res: Response): Promise<void> => {
  const replaced = await mediaRepository.replaceMedia(req.params.id, req.body);
  if (!replaced) throw new NotFoundError('Media item not found.');

  res.json({
    success: true,
    message: 'Media image file replaced and re-optimized successfully.',
    data: toMediaDto(replaced),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const reorderMedia = async (req: Request, res: Response): Promise<void> => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    throw new BadRequestError('Items array with id and order is required.');
  }

  await mediaRepository.reorderMedia(items);

  res.json({
    success: true,
    message: 'Media ordering updated successfully.',
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const deleteMedia = async (req: Request, res: Response): Promise<void> => {
  const deleted = await mediaRepository.deleteMedia(req.params.id);
  if (!deleted) throw new NotFoundError('Media item not found.');

  res.json({
    success: true,
    message: 'Media item and all associated variants removed.',
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

// ========================================================
// SECURE URL GENERATION & ACCESS
// ========================================================
export const generateSecureUrl = async (req: Request, res: Response): Promise<void> => {
  const media = await mediaRepository.getMediaById(req.params.id);
  if (!media) throw new NotFoundError('Media item not found.');

  const expiresIn = req.query.expiresIn ? parseInt(req.query.expiresIn as string, 10) : 3600;
  const secureAccess = mediaStorageService.generateSignedAccessUrl(media.id, expiresIn);

  res.json({
    success: true,
    message: 'Secure signed URL generated.',
    data: {
      mediaId: media.id,
      signedUrl: secureAccess.signedUrl,
      expiresAt: secureAccess.expiresAt,
    },
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const accessSecureMedia = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { sig, exp } = req.query as { sig?: string; exp?: string };

  const media = await mediaRepository.getMediaById(id);
  if (!media) throw new NotFoundError('Media item not found.');

  // If public, allow directly
  if (!media.isPrivate) {
    res.json({
      success: true,
      data: toMediaDto(media),
    });
    return;
  }

  // If private, must verify signature and expiry
  if (!sig || !exp) {
    throw new ForbiddenError('Signature and expiration parameters are required to access private media.');
  }

  const isValid = mediaStorageService.verifySignedAccess(id, sig, parseInt(exp, 10));
  if (!isValid) {
    throw new ForbiddenError('Access denied: Signed media URL has expired or signature is invalid.');
  }

  res.json({
    success: true,
    data: toMediaDto(media),
    meta: { signedAccessGranted: true, expiresAt: new Date(parseInt(exp, 10) * 1000).toISOString() },
  });
};
