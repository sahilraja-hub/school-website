export interface INoticeRecord {
  id: string;
  title: string;
  content: string;
  category: string;
  targetRole?: string;
  isPinned: boolean;
  publishedAt: Date;
  expiresAt?: Date;
  authorId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventRecord {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  bannerUrl?: string;
  organizerId?: string;
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
      content: 'Individual conference slots are now open for scheduling through the Parent Portal.',
      category: 'ACADEMIC',
      targetRole: 'PARENT',
      isPinned: true,
      publishedAt: new Date(),
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
      startDate: '2026-11-12T10:00:00Z',
      endDate: '2026-11-12T16:00:00Z',
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
  public async listNotices(query: { page?: number; limit?: number; category?: string; targetRole?: string; search?: string }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let items = Array.from(this.notices.values());

    if (query.category) items = items.filter((n) => n.category === query.category);
    if (query.targetRole) items = items.filter((n) => !n.targetRole || n.targetRole === query.targetRole);
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((n) => n.title.toLowerCase().includes(s) || n.content.toLowerCase().includes(s));
    }

    // pinned first, then newest
    items.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.publishedAt.getTime() - a.publishedAt.getTime());

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = items.slice((page - 1) * limit, page * limit);

    return { items: paged, total, page, limit, totalPages };
  }

  public async getNoticeById(id: string) {
    return this.notices.get(id) || null;
  }

  public async createNotice(data: Omit<INoticeRecord, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>) {
    const id = `not-${Date.now().toString(36)}`;
    const record: INoticeRecord = {
      ...data,
      id,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.notices.set(id, record);
    return record;
  }

  public async updateNotice(id: string, data: Partial<INoticeRecord>) {
    const notice = this.notices.get(id);
    if (!notice) return null;
    Object.assign(notice, data, { updatedAt: new Date() });
    this.notices.set(id, notice);
    return notice;
  }

  public async deleteNotice(id: string) {
    return this.notices.delete(id);
  }

  // --- Events ---
  public async listEvents(query: { page?: number; limit?: number; search?: string; isPublic?: boolean }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let items = Array.from(this.events.values());

    if (typeof query.isPublic === 'boolean') items = items.filter((e) => e.isPublic === query.isPublic);
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((e) => e.title.toLowerCase().includes(s) || e.location.toLowerCase().includes(s));
    }

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = items.slice((page - 1) * limit, page * limit);

    return { items: paged, total, page, limit, totalPages };
  }

  public async getEventById(id: string) {
    return this.events.get(id) || null;
  }

  public async createEvent(data: Omit<IEventRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `evt-${Date.now().toString(36)}`;
    const record: IEventRecord = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
    this.events.set(id, record);
    return record;
  }

  public async updateEvent(id: string, data: Partial<IEventRecord>) {
    const event = this.events.get(id);
    if (!event) return null;
    Object.assign(event, data, { updatedAt: new Date() });
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
