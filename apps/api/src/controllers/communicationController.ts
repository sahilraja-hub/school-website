import { Request, Response } from 'express';
import { communicationRepository } from '../repositories/communicationRepository';
import { dtos } from '../types/dtos';
import { NotFoundError } from '../errors';

// ==========================================
// NOTICES
// ==========================================
export const listNotices = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, category, targetRole, search, status } = req.query as any;
  const userRole = req.user?.role;
  const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';
  const effectiveRole = targetRole || (!isAdmin ? userRole : undefined);

  const result = await communicationRepository.listNotices({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    category,
    targetRole: effectiveRole,
    search,
    status,
    isAdmin,
  });

  res.json({
    success: true,
    data: result.items.map((n) => dtos.toNoticeDto(n)),
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

export const getNoticeById = async (req: Request, res: Response): Promise<void> => {
  const isAdmin = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'ADMIN';
  const notice = await communicationRepository.getNoticeById(req.params.id, isAdmin);
  if (!notice) throw new NotFoundError('Notice not found');

  res.json({
    success: true,
    data: dtos.toNoticeDto(notice),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createNotice = async (req: Request, res: Response): Promise<void> => {
  const created = await communicationRepository.createNotice({
    ...req.body,
    authorId: req.user?.id,
    authorName: req.user ? `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() : 'Admissions Office',
  });

  res.status(201).json({
    success: true,
    message: created.status === 'PUBLISHED' ? 'Notice published successfully' : 'Notice saved as draft',
    data: dtos.toNoticeDto(created),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const updateNotice = async (req: Request, res: Response): Promise<void> => {
  const updated = await communicationRepository.updateNotice(req.params.id, req.body);
  if (!updated) throw new NotFoundError('Notice not found');

  res.json({
    success: true,
    message: 'Notice updated successfully',
    data: dtos.toNoticeDto(updated),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const publishNotice = async (req: Request, res: Response): Promise<void> => {
  const published = await communicationRepository.publishNotice(req.params.id);
  if (!published) throw new NotFoundError('Notice not found');

  res.json({
    success: true,
    message: 'Notice published successfully',
    data: dtos.toNoticeDto(published),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const unpublishNotice = async (req: Request, res: Response): Promise<void> => {
  const unpublished = await communicationRepository.unpublishNotice(req.params.id);
  if (!unpublished) throw new NotFoundError('Notice not found');

  res.json({
    success: true,
    message: 'Notice unpublished and returned to draft',
    data: dtos.toNoticeDto(unpublished),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const archiveNotice = async (req: Request, res: Response): Promise<void> => {
  const archived = await communicationRepository.archiveNotice(req.params.id);
  if (!archived) throw new NotFoundError('Notice not found');

  res.json({
    success: true,
    message: 'Notice archived',
    data: dtos.toNoticeDto(archived),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const deleteNotice = async (req: Request, res: Response): Promise<void> => {
  const deleted = await communicationRepository.deleteNotice(req.params.id);
  if (!deleted) throw new NotFoundError('Notice not found');

  res.json({
    success: true,
    message: 'Notice deleted',
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

// ==========================================
// EVENTS
// ==========================================
export const listEvents = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, search, isPublic, status } = req.query as any;
  const isAdmin = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'ADMIN';

  const result = await communicationRepository.listEvents({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    search,
    isPublic: isPublic !== undefined ? isPublic === 'true' : undefined,
    status,
    isAdmin,
  });

  res.json({
    success: true,
    data: result.items.map((e) => dtos.toEventDto(e)),
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

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  const isAdmin = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'ADMIN';
  const event = await communicationRepository.getEventById(req.params.id, isAdmin);
  if (!event) throw new NotFoundError('Event not found');

  res.json({
    success: true,
    data: dtos.toEventDto(event),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  const created = await communicationRepository.createEvent({
    ...req.body,
    organizerId: req.user?.id,
    organizerName: req.user ? `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() : 'Event Directorate',
  });

  res.status(201).json({
    success: true,
    message: 'Event scheduled',
    data: dtos.toEventDto(created),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  const updated = await communicationRepository.updateEvent(req.params.id, req.body);
  if (!updated) throw new NotFoundError('Event not found');

  res.json({
    success: true,
    message: 'Event updated',
    data: dtos.toEventDto(updated),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const publishEvent = async (req: Request, res: Response): Promise<void> => {
  const published = await communicationRepository.publishEvent(req.params.id);
  if (!published) throw new NotFoundError('Event not found');

  res.json({
    success: true,
    message: 'Event published',
    data: dtos.toEventDto(published),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const unpublishEvent = async (req: Request, res: Response): Promise<void> => {
  const unpublished = await communicationRepository.unpublishEvent(req.params.id);
  if (!unpublished) throw new NotFoundError('Event not found');

  res.json({
    success: true,
    message: 'Event unpublished and returned to draft',
    data: dtos.toEventDto(unpublished),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const archiveEvent = async (req: Request, res: Response): Promise<void> => {
  const archived = await communicationRepository.archiveEvent(req.params.id);
  if (!archived) throw new NotFoundError('Event not found');

  res.json({
    success: true,
    message: 'Event archived',
    data: dtos.toEventDto(archived),
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  const deleted = await communicationRepository.deleteEvent(req.params.id);
  if (!deleted) throw new NotFoundError('Event not found');

  res.json({
    success: true,
    message: 'Event deleted',
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

// ==========================================
// GALLERY & MEDIA
// ==========================================
export const listGalleries = async (req: Request, res: Response): Promise<void> => {
  const galleries = await communicationRepository.listGalleries();
  res.json({
    success: true,
    data: galleries,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const getGalleryByIdOrSlug = async (req: Request, res: Response): Promise<void> => {
  const gallery = await communicationRepository.getGalleryByIdOrSlug(req.params.id);
  if (!gallery) throw new NotFoundError('Gallery not found');

  res.json({
    success: true,
    data: gallery,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createGallery = async (req: Request, res: Response): Promise<void> => {
  const created = await communicationRepository.createGallery(req.body);
  res.status(201).json({
    success: true,
    message: 'Gallery created',
    data: created,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const addMedia = async (req: Request, res: Response): Promise<void> => {
  const media = await communicationRepository.addMedia(req.body);
  res.status(201).json({
    success: true,
    message: 'Media uploaded successfully',
    data: media,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const deleteMedia = async (req: Request, res: Response): Promise<void> => {
  const deleted = await communicationRepository.deleteMedia(req.params.id);
  if (!deleted) throw new NotFoundError('Media not found');

  res.json({
    success: true,
    message: 'Media deleted',
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

// ==========================================
// DOCUMENTS
// ==========================================
export const listDocuments = async (req: Request, res: Response): Promise<void> => {
  const { category, search } = req.query as any;
  const docs = await communicationRepository.listDocuments({ category, search });
  res.json({
    success: true,
    data: docs,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const getDocumentById = async (req: Request, res: Response): Promise<void> => {
  const doc = await communicationRepository.getDocumentById(req.params.id);
  if (!doc) throw new NotFoundError('Document not found');

  res.json({
    success: true,
    data: doc,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const createDocument = async (req: Request, res: Response): Promise<void> => {
  const created = await communicationRepository.createDocument(req.body);
  res.status(201).json({
    success: true,
    message: 'Document published successfully',
    data: created,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  const deleted = await communicationRepository.deleteDocument(req.params.id);
  if (!deleted) throw new NotFoundError('Document not found');

  res.json({
    success: true,
    message: 'Document removed',
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};
