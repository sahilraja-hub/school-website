export interface INoticeRecord {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  publishDate: Date;
  publishedAt: Date;
  expiryDate?: Date;
  expiresAt?: Date;
  attachment?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  targetRole?: string;
  isPinned: boolean;
  authorId?: string;
  authorName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventRecord {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  bannerUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isPublic: boolean;
  organizerId?: string;
  organizerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGalleryRecord {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMediaRecord {
  id: string;
  galleryId: string;
  title?: string;
  url: string;
  type: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocumentRecord {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  category: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class CommunicationRepository {
  private notices: Map<string, INoticeRecord> = new Map();
  private events: Map<string, IEventRecord> = new Map();
  private galleries: Map<string, IGalleryRecord> = new Map();
  private mediaItems: Map<string, IMediaRecord> = new Map();
  private documents: Map<string, IDocumentRecord> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    // Notice
    const noticeId = 'not-001';
    this.notices.set(noticeId, {
      id: noticeId,
      title: 'Parent-Teacher Conference Schedule — Term 1',
      description: 'Individual conference slots are now open for scheduling through the Parent Portal.',
      content: 'Individual conference slots are now open for scheduling through the Parent Portal.',
      category: 'ACADEMIC',
      targetRole: 'PARENT',
      isPinned: true,
      publishDate: new Date(),
      publishedAt: new Date(),
      status: 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Event
    const eventId = 'evt-001';
    this.events.set(eventId, {
      id: eventId,
      title: 'Annual Science & Innovation Showcase 2026',
      description: 'Student engineering, robotics, and scientific research exhibitions.',
      location: 'Grand Auditorium & STEM Quad',
      date: '2026-11-12',
      startTime: '10:00',
      endTime: '16:00',
      startDate: '2026-11-12T10:00:00Z',
      endDate: '2026-11-12T16:00:00Z',
      status: 'PUBLISHED',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Gallery
    const galleryId = 'gal-001';
    this.galleries.set(galleryId, {
      id: galleryId,
      title: 'Campus Life & Architecture',
      slug: 'campus-life-architecture',
      description: 'Photos and architectural views of Oakridge International Academy',
      coverImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const m1: IMediaRecord = {
      id: 'med-001',
      galleryId,
      title: 'Modern Library Learning Commons',
      url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
      type: 'IMAGE',
      fileSize: 1048576,
      mimeType: 'image/jpeg',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mediaItems.set(m1.id, m1);

    // Document
    const docId = 'doc-001';
    this.documents.set(docId, {
      id: docId,
      title: 'Student Code of Conduct & Honor Handbook 2026-2027',
      fileName: 'student_handbook_2026_2027.pdf',
      fileUrl: '/uploads/documents/student_handbook_2026_2027.pdf',
      mimeType: 'application/pdf',
      fileSize: 2450000,
      category: 'HANDBOOK',
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // --- Notices ---
  public async listNotices(query: {
    page?: number;
    limit?: number;
    category?: string;
    targetRole?: string;
    search?: string;
    status?: string;
    isAdmin?: boolean;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let items = Array.from(this.notices.values());

    // Public website restriction: ONLY display published content and exclude expired notices
    if (!query.isAdmin) {
      const now = new Date();
      items = items.filter((n) => {
        if (n.status !== 'PUBLISHED') return false;
        if (n.expiryDate && new Date(n.expiryDate) < now) return false;
        if (n.expiresAt && new Date(n.expiresAt) < now) return false;
        return true;
      });
    } else if (query.status && query.status !== 'ALL') {
      items = items.filter((n) => n.status === query.status);
    }

    if (query.category && query.category !== 'ALL') items = items.filter((n) => n.category === query.category);
    if (query.targetRole && query.targetRole !== 'ALL' && query.targetRole !== 'ALL_ROLES') {
      items = items.filter((n) => !n.targetRole || n.targetRole === query.targetRole || n.targetRole === 'ALL_ROLES');
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(s) ||
          (n.description && n.description.toLowerCase().includes(s)) ||
          (n.content && n.content.toLowerCase().includes(s)) ||
          n.category.toLowerCase().includes(s)
      );
    }

    // pinned first, then newest
    items.sort(
      (a, b) =>
        (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) ||
        new Date(b.publishDate || b.publishedAt).getTime() - new Date(a.publishDate || a.publishedAt).getTime()
    );

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = items.slice((page - 1) * limit, page * limit);

    return { items: paged, total, page, limit, totalPages };
  }

  public async getNoticeById(id: string, isAdmin = false) {
    const notice = this.notices.get(id);
    if (!notice) return null;
    if (!isAdmin && notice.status !== 'PUBLISHED') {
      return null;
    }
    return notice;
  }

  public async createNotice(data: Partial<INoticeRecord>) {
    const id = `not-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
    const desc = data.description || data.content || '';
    const now = new Date();
    const pubDate = data.publishDate ? new Date(data.publishDate) : (data.publishedAt ? new Date(data.publishedAt) : now);
    const expDate = data.expiryDate ? new Date(data.expiryDate) : (data.expiresAt ? new Date(data.expiresAt) : undefined);

    const record: INoticeRecord = {
      id,
      title: data.title || 'Untitled Notice',
      description: desc,
      content: desc,
      category: data.category || 'GENERAL',
      publishDate: pubDate,
      publishedAt: pubDate,
      expiryDate: expDate,
      expiresAt: expDate,
      attachment: data.attachment,
      status: data.status || 'DRAFT',
      targetRole: data.targetRole,
      isPinned: Boolean(data.isPinned),
      authorId: data.authorId,
      authorName: data.authorName,
      createdAt: now,
      updatedAt: now,
    };
    this.notices.set(id, record);
    return record;
  }

  public async updateNotice(id: string, data: Partial<INoticeRecord>) {
    const notice = this.notices.get(id);
    if (!notice) return null;

    if (data.description || data.content) {
      const desc = data.description || data.content || notice.description;
      notice.description = desc;
      notice.content = desc;
    }
    if (data.title) notice.title = data.title;
    if (data.category) notice.category = data.category;
    if (data.publishDate) {
      notice.publishDate = new Date(data.publishDate);
      notice.publishedAt = notice.publishDate;
    }
    if (data.expiryDate !== undefined) {
      notice.expiryDate = data.expiryDate ? new Date(data.expiryDate) : undefined;
      notice.expiresAt = notice.expiryDate;
    }
    if (data.attachment !== undefined) notice.attachment = data.attachment;
    if (data.status) notice.status = data.status;
    if (data.isPinned !== undefined) notice.isPinned = data.isPinned;
    if (data.targetRole !== undefined) notice.targetRole = data.targetRole;
    notice.updatedAt = new Date();

    this.notices.set(id, notice);
    return notice;
  }

  public async publishNotice(id: string) {
    const notice = this.notices.get(id);
    if (!notice) return null;
    notice.status = 'PUBLISHED';
    notice.publishDate = new Date();
    notice.publishedAt = notice.publishDate;
    notice.updatedAt = new Date();
    this.notices.set(id, notice);
    return notice;
  }

  public async unpublishNotice(id: string) {
    const notice = this.notices.get(id);
    if (!notice) return null;
    notice.status = 'DRAFT';
    notice.updatedAt = new Date();
    this.notices.set(id, notice);
    return notice;
  }

  public async archiveNotice(id: string) {
    const notice = this.notices.get(id);
    if (!notice) return null;
    notice.status = 'ARCHIVED';
    notice.updatedAt = new Date();
    this.notices.set(id, notice);
    return notice;
  }

  public async deleteNotice(id: string) {
    return this.notices.delete(id);
  }

  // --- Events ---
  public async listEvents(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    isPublic?: boolean;
    isAdmin?: boolean;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let items = Array.from(this.events.values());

    // Public website restriction: ONLY display published events
    if (!query.isAdmin) {
      items = items.filter((e) => e.status === 'PUBLISHED');
    } else if (query.status && query.status !== 'ALL') {
      items = items.filter((e) => e.status === query.status);
    }

    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (e) =>
          e.title.toLowerCase().includes(s) ||
          e.description.toLowerCase().includes(s) ||
          e.location.toLowerCase().includes(s)
      );
    }

    // Sort by date / start time
    items.sort(
      (a, b) =>
        new Date(a.startDate || a.date).getTime() - new Date(b.startDate || b.date).getTime()
    );

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = items.slice((page - 1) * limit, page * limit);

    return { items: paged, total, page, limit, totalPages };
  }

  public async getEventById(id: string, isAdmin = false) {
    const event = this.events.get(id);
    if (!event) return null;
    if (!isAdmin && event.status !== 'PUBLISHED') {
      return null;
    }
    return event;
  }

  public async createEvent(data: Partial<IEventRecord>) {
    const id = `evt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
    const dateStr =
      data.date || (data.startDate ? data.startDate.split('T')[0] : new Date().toISOString().split('T')[0]);
    const startTimeStr = data.startTime || '09:00';
    const endTimeStr = data.endTime || '15:00';
    const sDate = data.startDate || `${dateStr}T${startTimeStr}:00Z`;
    const eDate = data.endDate || `${dateStr}T${endTimeStr}:00Z`;

    const record: IEventRecord = {
      id,
      title: data.title || 'Untitled Event',
      description: data.description || '',
      date: dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      startDate: sDate,
      endDate: eDate,
      location: data.location || 'Campus Grounds',
      image: data.image || data.bannerUrl,
      bannerUrl: data.image || data.bannerUrl,
      status: data.status || 'PUBLISHED',
      isPublic: data.isPublic !== undefined ? data.isPublic : data.status !== 'DRAFT',
      organizerId: data.organizerId,
      organizerName: data.organizerName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.events.set(id, record);
    return record;
  }

  public async updateEvent(id: string, data: Partial<IEventRecord>) {
    const event = this.events.get(id);
    if (!event) return null;

    if (data.title) event.title = data.title;
    if (data.description) event.description = data.description;
    if (data.location) event.location = data.location;
    if (data.date) event.date = data.date;
    if (data.startTime) event.startTime = data.startTime;
    if (data.endTime) event.endTime = data.endTime;
    if (data.startDate) event.startDate = data.startDate;
    if (data.endDate) event.endDate = data.endDate;
    if (data.image || data.bannerUrl) {
      event.image = data.image || data.bannerUrl;
      event.bannerUrl = event.image;
    }
    if (data.status) event.status = data.status;
    if (data.isPublic !== undefined) event.isPublic = data.isPublic;
    event.updatedAt = new Date();

    this.events.set(id, event);
    return event;
  }

  public async publishEvent(id: string) {
    const event = this.events.get(id);
    if (!event) return null;
    event.status = 'PUBLISHED';
    event.isPublic = true;
    event.updatedAt = new Date();
    this.events.set(id, event);
    return event;
  }

  public async unpublishEvent(id: string) {
    const event = this.events.get(id);
    if (!event) return null;
    event.status = 'DRAFT';
    event.isPublic = false;
    event.updatedAt = new Date();
    this.events.set(id, event);
    return event;
  }

  public async archiveEvent(id: string) {
    const event = this.events.get(id);
    if (!event) return null;
    event.status = 'ARCHIVED';
    event.isPublic = false;
    event.updatedAt = new Date();
    this.events.set(id, event);
    return event;
  }

  public async deleteEvent(id: string) {
    return this.events.delete(id);
  }

  // --- Galleries & Media ---
  public async listGalleries() {
    const items = Array.from(this.galleries.values());
    return items.map((g) => {
      const media = Array.from(this.mediaItems.values()).filter((m) => m.galleryId === g.id);
      return { ...g, mediaCount: media.length, media };
    });
  }

  public async getGalleryByIdOrSlug(identifier: string) {
    for (const g of this.galleries.values()) {
      if (g.id === identifier || g.slug === identifier) {
        const media = Array.from(this.mediaItems.values()).filter((m) => m.galleryId === g.id);
        return { ...g, mediaCount: media.length, media };
      }
    }
    return null;
  }

  public async createGallery(data: Omit<IGalleryRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `gal-${Date.now().toString(36)}`;
    const record: IGalleryRecord = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
    this.galleries.set(id, record);
    return { ...record, mediaCount: 0, media: [] };
  }

  public async addMedia(data: Omit<IMediaRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `med-${Date.now().toString(36)}`;
    const record: IMediaRecord = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
    this.mediaItems.set(id, record);
    return record;
  }

  public async deleteMedia(id: string) {
    return this.mediaItems.delete(id);
  }

  // --- Documents ---
  public async listDocuments(query: { category?: string; search?: string }) {
    let items = Array.from(this.documents.values());
    if (query.category) items = items.filter((d) => d.category === query.category);
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((d) => d.title.toLowerCase().includes(s) || d.fileName.toLowerCase().includes(s));
    }
    return items;
  }

  public async getDocumentById(id: string) {
    return this.documents.get(id) || null;
  }

  public async createDocument(data: Omit<IDocumentRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `doc-${Date.now().toString(36)}`;
    const record: IDocumentRecord = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
    this.documents.set(id, record);
    return record;
  }

  public async deleteDocument(id: string) {
    return this.documents.delete(id);
  }
}

export const communicationRepository = new CommunicationRepository();
