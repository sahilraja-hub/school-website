import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GallerySection } from '../pages/portal/admin/sections/GallerySection';
import { GalleryPage } from '../pages/public/GalleryPage';

// Mock api service
vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  setAccessToken: vi.fn(),
  getAccessToken: vi.fn().mockReturnValue('mock-token'),
}));

import { api } from '../services/api';

if (typeof window.URL.createObjectURL === 'undefined') {
  window.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
}
if (typeof window.URL.revokeObjectURL === 'undefined') {
  window.URL.revokeObjectURL = vi.fn();
}

describe('PHASE 16 — Media and Gallery Management Frontend Test Suite', () => {
  const mockMedia = [
    {
      id: 'med-101',
      galleryId: 'gal-1',
      title: 'Founder Hall Clock Tower',
      caption: 'Historic architectural panorama during golden hour.',
      altText: 'Stone clock tower rising above collegiate gothic quadrangle',
      category: 'CAMPUS',
      url: 'https://cdn.oakridge.edu/img_101.jpg',
      variants: {
        thumbnail: { url: 'https://cdn.oakridge.edu/img_101_thumb.jpg', width: 300, height: 200, sizeBytes: 14000 },
        medium: { url: 'https://cdn.oakridge.edu/img_101_med.jpg', width: 800, height: 533, sizeBytes: 60000 },
        large: { url: 'https://cdn.oakridge.edu/img_101_large.jpg', width: 1600, height: 1067, sizeBytes: 190000 },
        original: { url: 'https://cdn.oakridge.edu/img_101.jpg', width: 2400, height: 1600, sizeBytes: 450000 },
      },
      fileName: 'img_1790000000_founder_tower.jpg',
      originalFileName: 'founder_tower.jpg',
      fileSize: 450000,
      mimeType: 'image/jpeg',
      dimensions: { width: 2400, height: 1600 },
      order: 1,
      isPrivate: false,
      uploadedBy: 'usr-admin',
      createdAt: '2026-09-01T10:00:00Z',
      updatedAt: '2026-09-01T10:00:00Z',
    },
    {
      id: 'med-102',
      galleryId: 'gal-2',
      title: 'Confidential Scholar Record ID',
      caption: 'Restricted administrative student identity card.',
      altText: 'Official student credential with verification barcode',
      category: 'GENERAL',
      url: '/api/v1/media/secure-stream/med-102',
      variants: {
        thumbnail: { url: '/api/v1/media/secure-stream/med-102?variant=thumbnail', width: 300, height: 200, sizeBytes: 12000 },
        medium: { url: '/api/v1/media/secure-stream/med-102?variant=medium', width: 800, height: 533, sizeBytes: 50000 },
        large: { url: '/api/v1/media/secure-stream/med-102?variant=large', width: 1600, height: 1067, sizeBytes: 160000 },
        original: { url: '/api/v1/media/secure-stream/med-102?variant=original', width: 2400, height: 1600, sizeBytes: 380000 },
      },
      fileName: 'img_1790000001_confidential_id.png',
      originalFileName: 'confidential_id.png',
      fileSize: 380000,
      mimeType: 'image/png',
      dimensions: { width: 2400, height: 1600 },
      order: 2,
      isPrivate: true,
      uploadedBy: 'usr-admin',
      createdAt: '2026-09-05T12:00:00Z',
      updatedAt: '2026-09-05T12:00:00Z',
    },
  ];

  const mockGalleries = [
    {
      id: 'gal-1',
      title: 'Campus Heritage & Architectural Tour',
      description: 'Historical stone archways and collegiate quads.',
      category: 'CAMPUS',
      academicYear: '2026-2027',
      coverImage: 'https://cdn.oakridge.edu/cover1.jpg',
      mediaCount: 14,
      createdAt: '2026-09-01T10:00:00Z',
    },
    {
      id: 'gal-2',
      title: 'Advanced Science & Robotics Laboratory',
      description: 'Autonomous rover testing and spectroscopy.',
      category: 'ACADEMICS',
      academicYear: '2026-2027',
      coverImage: 'https://cdn.oakridge.edu/cover2.jpg',
      mediaCount: 20,
      createdAt: '2026-09-10T11:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (api.get as any).mockImplementation((url: string) => {
      if (url === '/media') {
        return Promise.resolve({ data: { success: true, data: mockMedia } });
      }
      if (url === '/gallery') {
        return Promise.resolve({ data: { success: true, data: mockGalleries } });
      }
      if (url.startsWith('/media/med-102/secure-url')) {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              signedUrl: 'https://oakridge.edu/api/v1/media/secure/med-102?sig=mock_hmac_signature&exp=1790999999',
              expiresAt: new Date(Date.now() + 3600000).toISOString(),
            },
          },
        });
      }
      return Promise.reject(new Error(`Unhandled GET url: ${url}`));
    });
  });

  // =========================================================================
  // 1. MEDIA LISTING & DASHBOARD DISPLAY
  // =========================================================================
  describe('Admin Media Library Listing', () => {
    it('should render media library with titles, category badges, and privacy flags', async () => {
      render(<GallerySection />);

      await waitFor(() => {
        expect(screen.getByText('Founder Hall Clock Tower')).toBeInTheDocument();
      });

      expect(screen.getByText('Confidential Scholar Record ID')).toBeInTheDocument();
      expect(screen.getByText('Public')).toBeInTheDocument();
      expect(screen.getByText('Private')).toBeInTheDocument();
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
    });

    it('should filter media items when searching by keyword', async () => {
      render(<GallerySection />);

      await waitFor(() => {
        expect(screen.getByText('Founder Hall Clock Tower')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search caption, title, alt text/i);
      fireEvent.change(searchInput, { target: { value: 'Confidential' } });

      expect(screen.getByText('Confidential Scholar Record ID')).toBeInTheDocument();
      expect(screen.queryByText('Founder Hall Clock Tower')).not.toBeInTheDocument();
    });

    it('should filter media items by privacy storage type', async () => {
      render(<GallerySection />);

      await waitFor(() => {
        expect(screen.getByText('Founder Hall Clock Tower')).toBeInTheDocument();
      });

      const privacySelect = screen.getByDisplayValue('All Storage Types');
      fireEvent.change(privacySelect, { target: { value: 'PRIVATE' } });

      expect(screen.getByText('Confidential Scholar Record ID')).toBeInTheDocument();
      expect(screen.queryByText('Founder Hall Clock Tower')).not.toBeInTheDocument();
    });
  });

  // =========================================================================
  // 2. SINGLE IMAGE UPLOAD & CLIENT SECURITY VALIDATION
  // =========================================================================
  describe('Single Image Upload & Client-Side Security', () => {
    it('should open single upload modal and submit valid image', async () => {
      (api.post as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            id: 'med-103',
            title: 'Botany Greenhouse Specimen',
            caption: 'Hydroponic flora cultivation in greenhouse.',
            altText: 'Close up of green leaves in greenhouse',
            category: 'ACADEMICS',
            url: 'https://cdn.oakridge.edu/botany.jpg',
            fileName: 'img_botany.jpg',
            fileSize: 30000,
            mimeType: 'image/jpeg',
            isPrivate: false,
            order: 3,
            createdAt: new Date().toISOString(),
          },
        },
      });

      render(<GallerySection />);

      const uploadBtn = screen.getByRole('button', { name: /upload image/i });
      fireEvent.click(uploadBtn);

      expect(screen.getByText(/upload new image asset/i)).toBeInTheDocument();

      // Create dummy file
      const validFile = new File(['valid_binary_data'], 'botany_leaf.jpg', { type: 'image/jpeg' });
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, { target: { files: [validFile] } });

      const titleInput = screen.getByPlaceholderText(/e\.g\. Founder's Arch/i);
      fireEvent.change(titleInput, { target: { value: 'Botany Greenhouse Specimen' } });

      const submitBtn = screen.getAllByRole('button', { name: /upload image/i })[1];
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/media/upload', expect.objectContaining({
          fileName: 'botany_leaf.jpg',
          fileType: 'image/jpeg',
          title: 'Botany Greenhouse Specimen',
        }));
      });
    });

    it('should reject dangerous/unsupported file extension on client before submission', async () => {
      render(<GallerySection />);

      const uploadBtn = screen.getByRole('button', { name: /upload image/i });
      fireEvent.click(uploadBtn);

      // Attempt to select an executable file
      const maliciousFile = new File(['binary_script'], 'malware.exe', { type: 'application/x-msdownload' });
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, { target: { files: [maliciousFile] } });

      expect(screen.getByText(/unsupported file type/i)).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });

    it('should reject files exceeding 5MB maximum limit', async () => {
      render(<GallerySection />);

      const uploadBtn = screen.getByRole('button', { name: /upload image/i });
      fireEvent.click(uploadBtn);

      // Create a 7MB mock file
      const largeFile = new File(['a'.repeat(7 * 1024 * 1024)], 'giant_uncompressed.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 7 * 1024 * 1024 });

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      expect(screen.getByText(/exceeds maximum permitted limit of 5mb/i)).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // 3. BATCH MULTIPLE UPLOAD
  // =========================================================================
  describe('Batch Multiple Upload', () => {
    it('should open batch upload modal, select multiple images, and submit batch', async () => {
      (api.post as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: [
            { id: 'med-201', fileName: 'photo1.jpg', order: 1 },
            { id: 'med-202', fileName: 'photo2.jpg', order: 2 },
          ],
        },
      });

      render(<GallerySection />);

      const batchBtn = screen.getByRole('button', { name: /batch upload/i });
      fireEvent.click(batchBtn);

      expect(screen.getByText(/batch multiple upload/i)).toBeInTheDocument();

      const file1 = new File(['img1'], 'photo1.jpg', { type: 'image/jpeg' });
      const file2 = new File(['img2'], 'photo2.png', { type: 'image/png' });

      const multiInput = document.querySelector('input[multiple]') as HTMLInputElement;
      fireEvent.change(multiInput, { target: { files: [file1, file2] } });

      expect(screen.getByText(/2 images queued for upload/i)).toBeInTheDocument();

      const submitBtn = screen.getByRole('button', { name: /upload 2 images/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/media/upload-multiple', expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({ fileName: 'photo1.jpg' }),
            expect.objectContaining({ fileName: 'photo2.png' }),
          ]),
        }));
      });
    });
  });

  // =========================================================================
  // 4. IMAGE PREVIEW, VARIANTS & SECURE SIGNED URLS
  // =========================================================================
  describe('Preview & Cryptographic Signed URLs', () => {
    it('should open preview modal displaying image variants and generate signed URL for private media', async () => {
      render(<GallerySection />);

      await waitFor(() => {
        expect(screen.getByText('Confidential Scholar Record ID')).toBeInTheDocument();
      });

      // Click on private item to open preview
      const privateTitle = screen.getByText('Confidential Scholar Record ID');
      fireEvent.click(privateTitle);

      await waitFor(() => {
        expect(screen.getByText(/cryptographic signed media url access/i)).toBeInTheDocument();
      });

      // Switch variant
      const thumbVariantBtn = screen.getByRole('button', { name: /thumbnail/i });
      fireEvent.click(thumbVariantBtn);

      // Generate signed URL
      const signBtn = screen.getByRole('button', { name: /generate signed link/i });
      fireEvent.click(signBtn);

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/media/med-102/secure-url'));
        expect(screen.getByText(/mock_hmac_signature/i)).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // 5. MEDIA METADATA EDIT, REORDER, REPLACE & DELETE
  // =========================================================================
  describe('Media Item Operations (Edit, Reorder, Replace, Delete)', () => {
    it('should edit caption, alt text and category of media item', async () => {
      (api.patch as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            ...mockMedia[0],
            caption: 'Updated afternoon sunlight on Founder arch.',
            altText: 'Updated alt description',
          },
        },
      });

      render(<GallerySection />);

      await waitFor(() => {
        expect(screen.getByText('Founder Hall Clock Tower')).toBeInTheDocument();
      });

      const editBtn = screen.getAllByTitle(/edit caption, alt text/i)[0];
      fireEvent.click(editBtn);

      expect(screen.getByText(/edit media metadata/i)).toBeInTheDocument();

      const captionInput = screen.getByDisplayValue(mockMedia[0].caption);
      fireEvent.change(captionInput, { target: { value: 'Updated afternoon sunlight on Founder arch.' } });

      const saveBtn = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(api.patch).toHaveBeenCalledWith('/media/med-101', expect.objectContaining({
          caption: 'Updated afternoon sunlight on Founder arch.',
        }));
      });
    });

    it('should reorder media items when clicking Move Down', async () => {
      (api.patch as any).mockResolvedValueOnce({
        data: { success: true },
      });

      render(<GallerySection />);

      await waitFor(() => {
        expect(screen.getByText('Founder Hall Clock Tower')).toBeInTheDocument();
      });

      const downBtns = screen.getAllByTitle(/move down in order/i);
      fireEvent.click(downBtns[0]);

      await waitFor(() => {
        expect(api.patch).toHaveBeenCalledWith('/media/reorder', expect.objectContaining({
          items: expect.any(Array),
        }));
      });
    });

    it('should open replace modal and submit replacement image', async () => {
      (api.post as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            ...mockMedia[0],
            fileName: 'img_new_replaced.jpg',
          },
        },
      });

      render(<GallerySection />);

      await waitFor(() => {
        expect(screen.getByText('Founder Hall Clock Tower')).toBeInTheDocument();
      });

      const replaceBtn = screen.getAllByTitle(/replace image file/i)[0];
      fireEvent.click(replaceBtn);

      expect(screen.getByText(/replace image asset/i)).toBeInTheDocument();

      const newFile = new File(['new_binary'], 'updated_tower.jpg', { type: 'image/jpeg' });
      const fileInputs = document.querySelectorAll('input[type="file"]');
      const replaceInput = fileInputs[fileInputs.length - 1] as HTMLInputElement;

      fireEvent.change(replaceInput, { target: { files: [newFile] } });

      const confirmBtn = screen.getByRole('button', { name: /confirm replace/i });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/media/med-101/replace', expect.objectContaining({
          fileName: 'updated_tower.jpg',
        }));
      });
    });

    it('should delete a media item with confirmation dialog', async () => {
      (api.delete as any).mockResolvedValueOnce({
        data: { success: true },
      });

      render(<GallerySection />);

      await waitFor(() => {
        expect(screen.getByText('Founder Hall Clock Tower')).toBeInTheDocument();
      });

      const deleteBtns = screen.getAllByTitle(/delete image/i);
      fireEvent.click(deleteBtns[0]);

      expect(screen.getByText(/delete image asset/i)).toBeInTheDocument();

      const confirmDelete = screen.getByRole('button', { name: /delete media/i });
      fireEvent.click(confirmDelete);

      await waitFor(() => {
        expect(api.delete).toHaveBeenCalledWith('/media/med-101');
      });
    });
  });

  // =========================================================================
  // 6. ALBUM & GALLERY MANAGEMENT
  // =========================================================================
  describe('Album Management Tab', () => {
    it('should switch to Albums tab and create new album', async () => {
      (api.post as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            id: 'gal-3',
            title: 'Winter Chamber Concert 2026',
            description: 'Acoustic violin and cello recitals.',
            category: 'ARTS',
            academicYear: '2026-2027',
            coverImage: 'https://cdn.oakridge.edu/concert.jpg',
            mediaCount: 0,
            createdAt: new Date().toISOString(),
          },
        },
      });

      render(<GallerySection />);

      const albumsTab = screen.getByRole('button', { name: /albums & galleries/i });
      fireEvent.click(albumsTab);

      await waitFor(() => {
        expect(screen.getByText('Campus Heritage & Architectural Tour')).toBeInTheDocument();
      });

      const createAlbumBtn = screen.getByRole('button', { name: /create album/i });
      fireEvent.click(createAlbumBtn);

      expect(screen.getByText(/create media album/i)).toBeInTheDocument();

      const titleInput = screen.getByPlaceholderText(/e\.g\. Winter Arts/i);
      fireEvent.change(titleInput, { target: { value: 'Winter Chamber Concert 2026' } });

      const submitBtn = screen.getAllByRole('button', { name: /create album/i })[1];
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/gallery', expect.objectContaining({
          title: 'Winter Chamber Concert 2026',
        }));
      });
    });
  });

  // =========================================================================
  // 7. PUBLIC GALLERY PAGE
  // =========================================================================
  describe('Public Gallery Page', () => {
    it('should render public gallery with photographs and lightbox modal', async () => {
      render(
        <BrowserRouter>
          <GalleryPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/a glimpse into the oakridge experience/i)).toBeInTheDocument();
      });

      expect(screen.getByText('Founder Hall Clock Tower')).toBeInTheDocument();

      // Click photo to open lightbox
      const photoCard = screen.getByText('Founder Hall Clock Tower');
      fireEvent.click(photoCard);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /close preview/i })).toBeInTheDocument();
      });
    });
  });
});
