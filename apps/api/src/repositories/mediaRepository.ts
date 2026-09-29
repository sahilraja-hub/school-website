import { MediaCategory, ImageVariant } from '@school/shared';
import { mediaSecurityService } from '../services/mediaSecurityService';
import { mediaOptimizerService } from '../services/mediaOptimizerService';
import { mediaStorageService } from '../services/mediaStorageService';

export interface IMediaRecord {
  id: string;
  galleryId?: string | null;
  title?: string | null;
  caption?: string | null;
  altText?: string | null;
  category: MediaCategory;
  url: string;
  variants: {
    thumbnail: ImageVariant;
    medium: ImageVariant;
    large: ImageVariant;
    original: ImageVariant;
  };
  fileName: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  dimensions?: { width: number; height: number };
  order: number;
  isPrivate: boolean;
  uploadedBy?: string | null;
  storageTarget: 'PUBLIC_CDN' | 'PRIVATE_ENCRYPTED';
  createdAt: Date;
  updatedAt: Date;
}

export interface IGalleryAlbumRecord {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category: MediaCategory;
  academicYear: string;
  coverImage?: string | null;
  isPublic: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export class MediaRepository {
  private mediaItems: Map<string, IMediaRecord> = new Map();
  private galleries: Map<string, IGalleryAlbumRecord> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    // Seed Albums
    const gal1: IGalleryAlbumRecord = {
      id: 'gal-001',
      title: 'Campus Life & Architecture',
      slug: 'campus-life-architecture',
      description: 'Photos and architectural views of Oakridge International Academy',
      category: 'CAMPUS',
      academicYear: '2026-2027',
      coverImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80',
      isPublic: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.galleries.set(gal1.id, gal1);

    const gal2: IGalleryAlbumRecord = {
      id: 'gal-002',
      title: 'STEM & Robotics Symposium',
      slug: 'stem-robotics-symposium',
      description: 'Scholars engineering autonomous rovers and computer vision models.',
      category: 'ACADEMICS',
      academicYear: '2026-2027',
      coverImage: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=80',
      isPublic: true,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.galleries.set(gal2.id, gal2);

    // Seed Media Items
    const med1: IMediaRecord = {
      id: 'med-001',
      galleryId: gal1.id,
      title: 'Modern Library Learning Commons',
      caption: 'Collaborative quiet study floor in Alexander Media Commons.',
      altText: 'Scholars studying in the modern glass-paneled academy library',
      category: 'CAMPUS',
      url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
      variants: {
        thumbnail: {
          label: 'thumbnail',
          url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=200&h=200&q=80',
          width: 200,
          height: 200,
          sizeBytes: 15400,
        },
        medium: {
          label: 'medium',
          url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
          width: 800,
          height: 533,
          sizeBytes: 124000,
        },
        large: {
          label: 'large',
          url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 800,
          sizeBytes: 254000,
        },
        original: {
          label: 'original',
          url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80',
          width: 1600,
          height: 1067,
          sizeBytes: 420000,
        },
      },
      fileName: 'img_library_commons.jpg',
      originalFileName: 'library_learning_commons.jpg',
      fileSize: 420000,
      mimeType: 'image/jpeg',
      dimensions: { width: 1600, height: 1067 },
      order: 1,
      isPrivate: false,
      storageTarget: 'PUBLIC_CDN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mediaItems.set(med1.id, med1);

    const med2: IMediaRecord = {
      id: 'med-002',
      galleryId: gal1.id,
      title: 'Grand Clock Tower & North Quad',
      caption: 'Historic brick facade and courtyard during autumn.',
      altText: 'Collegiate Gothic clock tower viewed across the north quad lawn',
      category: 'CAMPUS',
      url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80',
      variants: {
        thumbnail: {
          label: 'thumbnail',
          url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=200&h=200&q=80',
          width: 200,
          height: 200,
          sizeBytes: 16200,
        },
        medium: {
          label: 'medium',
          url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
          width: 800,
          height: 533,
          sizeBytes: 135000,
        },
        large: {
          label: 'large',
          url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 800,
          sizeBytes: 280000,
        },
        original: {
          label: 'original',
          url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80',
          width: 1600,
          height: 1067,
          sizeBytes: 460000,
        },
      },
      fileName: 'img_clock_tower.jpg',
      originalFileName: 'clock_tower.jpg',
      fileSize: 460000,
      mimeType: 'image/jpeg',
      dimensions: { width: 1600, height: 1067 },
      order: 2,
      isPrivate: false,
      storageTarget: 'PUBLIC_CDN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mediaItems.set(med2.id, med2);
  }

  // ========================================================
  // ALBUM / GALLERY OPERATIONS
  // ========================================================
  public async listGalleries(query?: { category?: string; search?: string }) {
    let items = Array.from(this.galleries.values());

    if (query?.category && query.category !== 'ALL') {
      items = items.filter((g) => g.category === query.category);
    }
    if (query?.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (g) =>
          g.title.toLowerCase().includes(s) ||
          (g.description && g.description.toLowerCase().includes(s))
      );
    }

    // Sort by order ascending, then newest
    items.sort((a, b) => a.order - b.order || b.createdAt.getTime() - a.createdAt.getTime());

    return items.map((g) => {
      const albumMedia = this.getMediaByGalleryId(g.id);
      return {
        ...g,
        mediaCount: albumMedia.length,
        media: albumMedia,
      };
    });
  }

  public async getGalleryByIdOrSlug(identifier: string) {
    for (const g of this.galleries.values()) {
      if (g.id === identifier || g.slug === identifier) {
        const albumMedia = this.getMediaByGalleryId(g.id);
        return {
          ...g,
          mediaCount: albumMedia.length,
          media: albumMedia,
        };
      }
    }
    return null;
  }

  public async createGallery(data: Partial<IGalleryAlbumRecord> & { title: string }) {
    const id = `gal-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const record: IGalleryAlbumRecord = {
      id,
      title: data.title,
      slug,
      description: data.description || null,
      category: data.category || 'CAMPUS',
      academicYear: data.academicYear || '2026-2027',
      coverImage: data.coverImage || null,
      isPublic: data.isPublic !== undefined ? data.isPublic : true,
      order: data.order !== undefined ? data.order : this.galleries.size + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.galleries.set(id, record);
    return { ...record, mediaCount: 0, media: [] };
  }

  public async updateGallery(id: string, data: Partial<IGalleryAlbumRecord>) {
    const gallery = this.galleries.get(id);
    if (!gallery) return null;

    if (data.title) gallery.title = data.title;
    if (data.description !== undefined) gallery.description = data.description;
    if (data.category) gallery.category = data.category;
    if (data.academicYear) gallery.academicYear = data.academicYear;
    if (data.coverImage !== undefined) gallery.coverImage = data.coverImage;
    if (data.isPublic !== undefined) gallery.isPublic = data.isPublic;
    if (data.order !== undefined) gallery.order = data.order;
    gallery.updatedAt = new Date();

    this.galleries.set(id, gallery);
    const albumMedia = this.getMediaByGalleryId(id);
    return { ...gallery, mediaCount: albumMedia.length, media: albumMedia };
  }

  public async deleteGallery(id: string) {
    const deleted = this.galleries.delete(id);
    if (deleted) {
      // Disassociate media or delete
      for (const m of this.mediaItems.values()) {
        if (m.galleryId === id) {
          m.galleryId = null;
          this.mediaItems.set(m.id, m);
        }
      }
    }
    return deleted;
  }

  // ========================================================
  // MEDIA OPERATIONS
  // ========================================================
  public async createMedia(params: {
    fileName: string;
    fileType: string;
    fileSizeBytes: number;
    fileBase64?: string;
    buffer?: Buffer;
    galleryId?: string | null;
    title?: string | null;
    caption?: string | null;
    altText?: string | null;
    category?: MediaCategory;
    isPrivate?: boolean;
    order?: number;
    uploadedBy?: string | null;
  }): Promise<IMediaRecord> {
    // 1. Security & MIME Validation
    const validated = mediaSecurityService.validateImageUpload({
      fileName: params.fileName,
      fileType: params.fileType,
      fileSizeBytes: params.fileSizeBytes,
      fileBase64: params.fileBase64,
      buffer: params.buffer,
    });

    const isPrivate = Boolean(params.isPrivate);

    // 2. Storage Allocation
    const storageDesc = mediaStorageService.allocateStorage(validated.safeFileName, isPrivate);

    // 3. Image Optimization & Variants
    const optimization = mediaOptimizerService.optimizeImage({
      safeFileName: validated.safeFileName,
      fileSizeBytes: validated.fileSizeBytes,
      mimeType: validated.mimeType,
      baseUrl: isPrivate ? '/api/v1/media/secure-stream' : 'https://cdn.oakridge.edu/media',
      isPrivate,
    });

    // 4. Calculate Order
    const albumItems = params.galleryId ? this.getMediaByGalleryId(params.galleryId) : [];
    const nextOrder = params.order !== undefined ? params.order : albumItems.length + 1;

    const id = `med-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();

    const record: IMediaRecord = {
      id,
      galleryId: params.galleryId || null,
      title: params.title || validated.originalFileName.replace(/\.[^/.]+$/, ''),
      caption: params.caption || null,
      altText: params.altText || params.title || 'Institutional photograph',
      category: params.category || 'GENERAL',
      url: storageDesc.publicUrl,
      variants: optimization.variants,
      fileName: validated.safeFileName,
      originalFileName: validated.originalFileName,
      fileSize: validated.fileSizeBytes,
      mimeType: validated.mimeType,
      dimensions: optimization.dimensions,
      order: nextOrder,
      isPrivate,
      uploadedBy: params.uploadedBy || null,
      storageTarget: storageDesc.storageType,
      createdAt: now,
      updatedAt: now,
    };

    this.mediaItems.set(id, record);
    return record;
  }

  public async createMultipleMedia(
    files: Array<{
      fileName: string;
      fileType: string;
      fileSizeBytes: number;
      fileBase64?: string;
      caption?: string;
      altText?: string;
    }>,
    common: {
      galleryId?: string | null;
      category?: MediaCategory;
      isPrivate?: boolean;
      uploadedBy?: string | null;
    }
  ): Promise<IMediaRecord[]> {
    const results: IMediaRecord[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const created = await this.createMedia({
        ...f,
        galleryId: common.galleryId,
        category: common.category,
        isPrivate: common.isPrivate,
        uploadedBy: common.uploadedBy,
        order: i + 1,
      });
      results.push(created);
    }
    return results;
  }

  public async getMediaById(id: string): Promise<IMediaRecord | null> {
    return this.mediaItems.get(id) || null;
  }

  public async listMedia(query: {
    galleryId?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    includePrivate?: boolean;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let items = Array.from(this.mediaItems.values());

    // Public / Private storage privacy filter
    if (!query.includePrivate) {
      items = items.filter((m) => !m.isPrivate);
    }

    if (query.galleryId) {
      items = items.filter((m) => m.galleryId === query.galleryId);
    }
    if (query.category && query.category !== 'ALL') {
      items = items.filter((m) => m.category === query.category);
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (m) =>
          (m.title && m.title.toLowerCase().includes(s)) ||
          (m.caption && m.caption.toLowerCase().includes(s)) ||
          (m.altText && m.altText.toLowerCase().includes(s))
      );
    }

    // Order items ascending by order index, then newest
    items.sort((a, b) => a.order - b.order || b.createdAt.getTime() - a.createdAt.getTime());

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = items.slice((page - 1) * limit, page * limit);

    return { items: paged, total, page, limit, totalPages };
  }

  public async updateMedia(
    id: string,
    data: {
      title?: string | null;
      caption?: string | null;
      altText?: string | null;
      category?: MediaCategory;
      galleryId?: string | null;
      order?: number;
      isPrivate?: boolean;
    }
  ): Promise<IMediaRecord | null> {
    const media = this.mediaItems.get(id);
    if (!media) return null;

    if (data.title !== undefined) media.title = data.title;
    if (data.caption !== undefined) media.caption = data.caption;
    if (data.altText !== undefined) media.altText = data.altText;
    if (data.category !== undefined) media.category = data.category;
    if (data.galleryId !== undefined) media.galleryId = data.galleryId;
    if (data.order !== undefined) media.order = data.order;
    if (data.isPrivate !== undefined) media.isPrivate = data.isPrivate;
    media.updatedAt = new Date();

    this.mediaItems.set(id, media);
    return media;
  }

  public async replaceMedia(
    id: string,
    params: {
      fileName: string;
      fileType: string;
      fileSizeBytes: number;
      fileBase64?: string;
      buffer?: Buffer;
      caption?: string;
      altText?: string;
    }
  ): Promise<IMediaRecord | null> {
    const existing = this.mediaItems.get(id);
    if (!existing) return null;

    // Validate new replacement file
    const validated = mediaSecurityService.validateImageUpload({
      fileName: params.fileName,
      fileType: params.fileType,
      fileSizeBytes: params.fileSizeBytes,
      fileBase64: params.fileBase64,
      buffer: params.buffer,
    });

    const isPrivate = existing.isPrivate;
    const storageDesc = mediaStorageService.allocateStorage(validated.safeFileName, isPrivate);
    const optimization = mediaOptimizerService.optimizeImage({
      safeFileName: validated.safeFileName,
      fileSizeBytes: validated.fileSizeBytes,
      mimeType: validated.mimeType,
      baseUrl: isPrivate ? '/api/v1/media/secure-stream' : 'https://cdn.oakridge.edu/media',
      isPrivate,
    });

    existing.fileName = validated.safeFileName;
    existing.originalFileName = validated.originalFileName;
    existing.fileSize = validated.fileSizeBytes;
    existing.mimeType = validated.mimeType;
    existing.url = storageDesc.publicUrl;
    existing.variants = optimization.variants;
    existing.dimensions = optimization.dimensions;
    if (params.caption !== undefined) existing.caption = params.caption;
    if (params.altText !== undefined) existing.altText = params.altText;
    existing.updatedAt = new Date();

    this.mediaItems.set(id, existing);
    return existing;
  }

  public async reorderMedia(items: Array<{ id: string; order: number }>): Promise<boolean> {
    for (const item of items) {
      const media = this.mediaItems.get(item.id);
      if (media) {
        media.order = item.order;
        media.updatedAt = new Date();
        this.mediaItems.set(item.id, media);
      }
    }
    return true;
  }

  public async deleteMedia(id: string): Promise<boolean> {
    return this.mediaItems.delete(id);
  }

  private getMediaByGalleryId(galleryId: string): IMediaRecord[] {
    return Array.from(this.mediaItems.values())
      .filter((m) => m.galleryId === galleryId)
      .sort((a, b) => a.order - b.order);
  }
}

export const mediaRepository = new MediaRepository();
