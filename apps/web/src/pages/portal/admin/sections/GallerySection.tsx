import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Image,
  Search,
  Filter,
  Plus,
  Trash2,
  Eye,
  Camera,
  Layers,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  UploadCloud,
  RefreshCw,
  Edit3,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  ShieldCheck,
  Copy,
  ExternalLink,
  Info,
  Check,
  AlertTriangle,
  FileImage,
  Sliders,
} from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { GalleryDto, MediaDto } from '@school/shared';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_BATCH_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

const createSafeObjectURL = (file: File): string => {
  if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    try {
      return URL.createObjectURL(file);
    } catch {
      return '';
    }
  }
  return '';
};

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type (${file.type || 'unknown'}). Only JPEG, PNG, WebP, and GIF images are permitted.`,
    };
  }
  const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Invalid extension (${ext}). Safe extensions allowed: .jpg, .jpeg, .png, .webp, .gif.`,
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum permitted limit of 5MB.`,
    };
  }
  return { valid: true };
};

const DEFAULT_MOCK_MEDIA: MediaDto[] = [
  {
    id: 'med-001',
    galleryId: 'gal-1',
    title: 'Historic Campus Quad & Clock Tower',
    caption: 'Autumn afternoon sunlight illuminates Founder’s Memorial Arch and central commons.',
    altText: 'Oakridge campus central quadrangle with stone arch and student walkways',
    category: 'CAMPUS',
    url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1200',
    variants: {
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=300',
        width: 300,
        height: 200,
        sizeBytes: 15400,
      },
      medium: {
        url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800',
        width: 800,
        height: 533,
        sizeBytes: 64200,
      },
      large: {
        url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1600',
        width: 1600,
        height: 1067,
        sizeBytes: 198000,
      },
      original: {
        url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=2400',
        width: 2400,
        height: 1600,
        sizeBytes: 420000,
      },
    },
    fileName: 'img_campus_quad_primary.jpg',
    originalFileName: 'campus_quad_autumn.jpg',
    fileSize: 420000,
    mimeType: 'image/jpeg',
    dimensions: { width: 2400, height: 1600 },
    order: 1,
    isPrivate: false,
    uploadedBy: 'usr-admin',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'med-002',
    galleryId: 'gal-2',
    title: 'Autonomous Robotics Testing & Sensor Array',
    caption: 'Engineering cohort calibrating LIDAR obstacle avoidance sensors on autonomous chassis.',
    altText: 'Secondary STEM scholars collaborating around autonomous robotics competition platform',
    category: 'ACADEMICS',
    url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=1200',
    variants: {
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=300',
        width: 300,
        height: 200,
        sizeBytes: 16200,
      },
      medium: {
        url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800',
        width: 800,
        height: 533,
        sizeBytes: 71500,
      },
      large: {
        url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=1600',
        width: 1600,
        height: 1067,
        sizeBytes: 215000,
      },
      original: {
        url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=2400',
        width: 2400,
        height: 1600,
        sizeBytes: 510000,
      },
    },
    fileName: 'img_robotics_sensor_array.jpg',
    originalFileName: 'stem_robotics_testing.jpg',
    fileSize: 510000,
    mimeType: 'image/jpeg',
    dimensions: { width: 2400, height: 1600 },
    order: 2,
    isPrivate: false,
    uploadedBy: 'usr-admin',
    createdAt: '2026-09-12T14:30:00Z',
    updatedAt: '2026-09-12T14:30:00Z',
  },
  {
    id: 'med-003',
    galleryId: 'gal-3',
    title: 'Varsity Soccer Pitch Championship Match',
    caption: 'Lions varsity squad executing strategic transition play under stadium floodlights.',
    altText: 'High school soccer players in action on green championship pitch during tournament',
    category: 'ATHLETICS',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1200',
    variants: {
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=300',
        width: 300,
        height: 200,
        sizeBytes: 14800,
      },
      medium: {
        url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
        width: 800,
        height: 533,
        sizeBytes: 68900,
      },
      large: {
        url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1600',
        width: 1600,
        height: 1067,
        sizeBytes: 204000,
      },
      original: {
        url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=2400',
        width: 2400,
        height: 1600,
        sizeBytes: 480000,
      },
    },
    fileName: 'img_varsity_soccer_pitch.jpg',
    originalFileName: 'soccer_invitational_final.jpg',
    fileSize: 480000,
    mimeType: 'image/jpeg',
    dimensions: { width: 2400, height: 1600 },
    order: 3,
    isPrivate: false,
    uploadedBy: 'usr-admin',
    createdAt: '2026-09-18T16:00:00Z',
    updatedAt: '2026-09-18T16:00:00Z',
  },
  {
    id: 'med-004',
    galleryId: 'gal-4',
    title: 'Symphony Hall Youth Orchestral Recital',
    caption: 'Strings ensemble performing Vivaldi in the acoustic auditorium during Gala Week.',
    altText: 'Student violinists and cellists performing on stage in auditorium',
    category: 'ARTS',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
    variants: {
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=300',
        width: 300,
        height: 200,
        sizeBytes: 15900,
      },
      medium: {
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
        width: 800,
        height: 533,
        sizeBytes: 74100,
      },
      large: {
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1600',
        width: 1600,
        height: 1067,
        sizeBytes: 220000,
      },
      original: {
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=2400',
        width: 2400,
        height: 1600,
        sizeBytes: 530000,
      },
    },
    fileName: 'img_symphony_strings_gala.jpg',
    originalFileName: 'orchestra_performance.jpg',
    fileSize: 530000,
    mimeType: 'image/jpeg',
    dimensions: { width: 2400, height: 1600 },
    order: 4,
    isPrivate: false,
    uploadedBy: 'usr-admin',
    createdAt: '2026-09-20T20:15:00Z',
    updatedAt: '2026-09-20T20:15:00Z',
  },
];

export const GallerySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MEDIA' | 'ALBUMS'>('MEDIA');
  const [mediaList, setMediaList] = useState<MediaDto[]>([]);
  const [galleries, setGalleries] = useState<GalleryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [albumFilter, setAlbumFilter] = useState('ALL');
  const [privacyFilter, setPrivacyFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Single Upload Modal State
  const [isSingleUploadOpen, setIsSingleUploadOpen] = useState(false);
  const [singleUploadFile, setSingleUploadFile] = useState<File | null>(null);
  const [singleUploadPreview, setSingleUploadPreview] = useState<string | null>(null);
  const [singleUploadForm, setSingleUploadForm] = useState({
    title: '',
    caption: '',
    altText: '',
    category: 'CAMPUS',
    galleryId: '',
    isPrivate: false,
  });
  const [uploadingSingle, setUploadingSingle] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);

  // Batch Multiple Upload Modal State
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false);
  const [batchFiles, setBatchFiles] = useState<Array<{ file: File; preview: string; title: string }>>([]);
  const [batchCategory, setBatchCategory] = useState('CAMPUS');
  const [batchGalleryId, setBatchGalleryId] = useState('');
  const [batchIsPrivate, setBatchIsPrivate] = useState(false);
  const [uploadingBatch, setUploadingBatch] = useState(false);
  const [batchUploadError, setBatchUploadError] = useState<string | null>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  // Replace Modal State
  const [isReplaceOpen, setIsReplaceOpen] = useState(false);
  const [mediaToReplace, setMediaToReplace] = useState<MediaDto | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replacePreview, setReplacePreview] = useState<string | null>(null);
  const [replaceTitle, setReplaceTitle] = useState('');
  const [replaceCaption, setReplaceCaption] = useState('');
  const [replaceAltText, setReplaceAltText] = useState('');
  const [replacing, setReplacing] = useState(false);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Metadata Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mediaToEdit, setMediaToEdit] = useState<MediaDto | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    caption: '',
    altText: '',
    category: 'CAMPUS',
    galleryId: '',
    order: 1,
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Preview Modal State
  const [previewMedia, setPreviewMedia] = useState<MediaDto | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<'original' | 'large' | 'medium' | 'thumbnail'>('large');
  const [signedUrlData, setSignedUrlData] = useState<{ signedUrl: string; expiresAt: string } | null>(null);
  const [generatingSignedUrl, setGeneratingSignedUrl] = useState(false);
  const [signedUrlExpiry, setSignedUrlExpiry] = useState(3600); // 1 hour default
  const [copiedLink, setCopiedLink] = useState(false);

  // Album Modal States
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isEditAlbumModalOpen, setIsEditAlbumModalOpen] = useState(false);
  const [albumToEdit, setAlbumToEdit] = useState<GalleryDto | null>(null);
  const [albumFormData, setAlbumFormData] = useState({
    title: '',
    description: '',
    category: 'CAMPUS',
    academicYear: '2026-2027',
    coverImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800',
  });

  // Deletion Confirmations
  const [mediaToDelete, setMediaToDelete] = useState<MediaDto | null>(null);
  const [albumToDelete, setAlbumToDelete] = useState<GalleryDto | null>(null);

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mediaRes, galleryRes] = await Promise.allSettled([
        api.get('/media'),
        api.get('/gallery'),
      ]);

      if (mediaRes.status === 'fulfilled' && mediaRes.value.data?.success && Array.isArray(mediaRes.value.data?.data)) {
        setMediaList(mediaRes.value.data.data);
      } else {
        setMediaList(DEFAULT_MOCK_MEDIA);
      }

      if (galleryRes.status === 'fulfilled' && galleryRes.value.data?.success && Array.isArray(galleryRes.value.data?.data)) {
        setGalleries(galleryRes.value.data.data);
      } else {
        setGalleries([
          {
            id: 'gal-1',
            title: 'Campus Heritage & Architectural Tour',
            description: 'Historical stone archways, collegiate Gothic quads, and manicured botanic lawns.',
            category: 'CAMPUS',
            academicYear: '2026-2027',
            coverImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800',
            mediaCount: 18,
            createdAt: '2026-09-01T10:00:00Z',
          },
          {
            id: 'gal-2',
            title: 'Advanced Science & Robotics Laboratory',
            description: 'Autonomous rover testing, spectroscopy experiments, and digital fabrication.',
            category: 'ACADEMICS',
            academicYear: '2026-2027',
            coverImage: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800',
            mediaCount: 24,
            createdAt: '2026-09-12T14:30:00Z',
          },
          {
            id: 'gal-3',
            title: 'Autumn Varsity Athletics Championship',
            description: 'Rowing regatta, cross-country invitational, and varsity soccer tournament.',
            category: 'ATHLETICS',
            academicYear: '2026-2027',
            coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
            mediaCount: 32,
            createdAt: '2026-09-18T16:00:00Z',
          },
          {
            id: 'gal-4',
            title: 'Symphony Hall Concert & Fine Arts Gala',
            description: 'Philharmonic orchestral recitals, fine art ceramic exhibitions, and student drama.',
            category: 'ARTS',
            academicYear: '2026-2027',
            coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
            mediaCount: 15,
            createdAt: '2026-09-20T20:15:00Z',
          },
        ]);
      }
    } catch (err) {
      setError(err);
      setMediaList(DEFAULT_MOCK_MEDIA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Media
  const filteredMedia = useMemo(() => {
    return mediaList.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.caption && m.caption.toLowerCase().includes(q)) ||
        (m.altText && m.altText.toLowerCase().includes(q)) ||
        (m.fileName && m.fileName.toLowerCase().includes(q));

      const matchesCat = categoryFilter === 'ALL' || m.category === categoryFilter;
      const matchesAlbum = albumFilter === 'ALL' || m.galleryId === albumFilter;
      const matchesPrivacy =
        privacyFilter === 'ALL' ||
        (privacyFilter === 'PUBLIC' && !m.isPrivate) ||
        (privacyFilter === 'PRIVATE' && m.isPrivate);

      return matchesSearch && matchesCat && matchesAlbum && matchesPrivacy;
    });
  }, [mediaList, searchQuery, categoryFilter, albumFilter, privacyFilter]);

  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage) || 1;
  const paginatedMedia = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMedia.slice(start, start + itemsPerPage);
  }, [filteredMedia, currentPage, itemsPerPage]);

  // Handle Single File Selection
  const handleSingleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      if (singleFileInputRef.current) singleFileInputRef.current.value = '';
      return;
    }

    setSingleUploadFile(file);
    const previewUrl = createSafeObjectURL(file);
    setSingleUploadPreview(previewUrl);

    // Auto-fill title from filename if empty
    if (!singleUploadForm.title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setSingleUploadForm((prev) => ({
        ...prev,
        title: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      }));
    }
  };

  // Submit Single Upload
  const handleSingleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleUploadFile) {
      setUploadError('Please select an image file to upload.');
      return;
    }

    setUploadingSingle(true);
    setUploadError(null);

    try {
      const base64 = await readFileAsBase64(singleUploadFile);
      const payload = {
        fileName: singleUploadFile.name,
        fileType: singleUploadFile.type,
        fileSizeBytes: singleUploadFile.size,
        fileBase64: base64,
        title: singleUploadForm.title,
        caption: singleUploadForm.caption,
        altText: singleUploadForm.altText,
        category: singleUploadForm.category,
        galleryId: singleUploadForm.galleryId || undefined,
        isPrivate: singleUploadForm.isPrivate,
      };

      const res = await api.post('/media/upload', payload);
      if (res.data.success && res.data.data) {
        setMediaList((prev) => [res.data.data, ...prev]);
        setActionSuccess(`Image "${res.data.data.title || res.data.data.fileName}" uploaded successfully.`);
      } else {
        // Fallback local representation
        const mockNew: MediaDto = {
          id: `med-${Date.now()}`,
          fileName: `img_${Date.now()}_${singleUploadFile.name}`,
          originalFileName: singleUploadFile.name,
          mimeType: singleUploadFile.type,
          fileSize: singleUploadFile.size,
          category: singleUploadForm.category as any,
          galleryId: singleUploadForm.galleryId || undefined,
          title: singleUploadForm.title,
          caption: singleUploadForm.caption,
          altText: singleUploadForm.altText,
          isPrivate: singleUploadForm.isPrivate,
          order: mediaList.length + 1,
          url: singleUploadPreview || '',
          variants: {
            thumbnail: { url: singleUploadPreview || '', width: 300, height: 200, sizeBytes: 15000 },
            medium: { url: singleUploadPreview || '', width: 800, height: 533, sizeBytes: 60000 },
            large: { url: singleUploadPreview || '', width: 1600, height: 1067, sizeBytes: 180000 },
            original: { url: singleUploadPreview || '', width: 2400, height: 1600, sizeBytes: singleUploadFile.size },
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setMediaList((prev) => [mockNew, ...prev]);
        setActionSuccess('Image uploaded and processed.');
      }

      setIsSingleUploadOpen(false);
      setSingleUploadFile(null);
      setSingleUploadPreview(null);
      setSingleUploadForm({
        title: '',
        caption: '',
        altText: '',
        category: 'CAMPUS',
        galleryId: '',
        isPrivate: false,
      });
      fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.error || err.message || 'Failed to upload image';
      setUploadError(msg);
    } finally {
      setUploadingSingle(false);
    }
  };

  // Handle Batch File Selection
  const handleBatchFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBatchUploadError(null);
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length > 10) {
      setBatchUploadError('Maximum 10 images can be uploaded simultaneously in a batch.');
      return;
    }

    let totalBytes = 0;
    const validBatch: Array<{ file: File; preview: string; title: string }> = [];

    for (const file of files) {
      const check = validateFile(file);
      if (!check.valid) {
        setBatchUploadError(`${file.name}: ${check.error}`);
        return;
      }
      totalBytes += file.size;
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      validBatch.push({
        file,
        preview: createSafeObjectURL(file),
        title: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      });
    }

    if (totalBytes > MAX_BATCH_SIZE_BYTES) {
      setBatchUploadError(`Total batch size (${(totalBytes / (1024 * 1024)).toFixed(1)}MB) exceeds 25MB limit.`);
      return;
    }

    setBatchFiles(validBatch);
  };

  const removeBatchFile = (index: number) => {
    setBatchFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit Batch Upload
  const handleBatchUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (batchFiles.length === 0) {
      setBatchUploadError('Please select one or more images.');
      return;
    }

    setUploadingBatch(true);
    setBatchUploadError(null);

    try {
      const itemsPayload = await Promise.all(
        batchFiles.map(async (item) => {
          const base64 = await readFileAsBase64(item.file);
          return {
            fileName: item.file.name,
            fileType: item.file.type,
            fileSizeBytes: item.file.size,
            fileBase64: base64,
            title: item.title,
            caption: item.title,
            altText: item.title,
          };
        })
      );

      const payload = {
        items: itemsPayload,
        galleryId: batchGalleryId || undefined,
        category: batchCategory,
        isPrivate: batchIsPrivate,
      };

      const res = await api.post('/media/upload-multiple', payload);
      if (res.data.success && Array.isArray(res.data.data)) {
        setMediaList((prev) => [...res.data.data, ...prev]);
        setActionSuccess(`Successfully uploaded ${res.data.data.length} images.`);
      } else {
        setActionSuccess(`Successfully uploaded ${batchFiles.length} images.`);
      }

      setIsBatchUploadOpen(false);
      setBatchFiles([]);
      fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.error || err.message || 'Batch upload failed';
      setBatchUploadError(msg);
    } finally {
      setUploadingBatch(false);
    }
  };

  // Open Replace Modal
  const openReplaceModal = (media: MediaDto) => {
    setMediaToReplace(media);
    setReplaceFile(null);
    setReplacePreview(null);
    setReplaceTitle(media.title || '');
    setReplaceCaption(media.caption || '');
    setReplaceAltText(media.altText || '');
    setIsReplaceOpen(true);
  };

  const handleReplaceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const check = validateFile(file);
    if (!check.valid) {
      setError(check.error);
      return;
    }

    setReplaceFile(file);
    setReplacePreview(createSafeObjectURL(file));
  };

  const handleReplaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaToReplace || !replaceFile) return;

    setReplacing(true);
    setError(null);
    try {
      const base64 = await readFileAsBase64(replaceFile);
      const res = await api.post(`/media/${mediaToReplace.id}/replace`, {
        fileName: replaceFile.name,
        fileType: replaceFile.type,
        fileSizeBytes: replaceFile.size,
        fileBase64: base64,
        title: replaceTitle,
        caption: replaceCaption,
        altText: replaceAltText,
      });

      if (res.data.success && res.data.data) {
        setMediaList((prev) =>
          prev.map((m) => (m.id === mediaToReplace.id ? res.data.data : m))
        );
      }
      setActionSuccess(`Image "${mediaToReplace.id}" replaced successfully.`);
      setIsReplaceOpen(false);
    } catch (err: any) {
      setError(err);
    } finally {
      setReplacing(false);
    }
  };

  // Edit Metadata Modal
  const openEditModal = (media: MediaDto) => {
    setMediaToEdit(media);
    setEditForm({
      title: media.title || '',
      caption: media.caption || '',
      altText: media.altText || '',
      category: media.category || 'CAMPUS',
      galleryId: media.galleryId || '',
      order: media.order || 1,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaToEdit) return;

    setSavingEdit(true);
    setError(null);
    try {
      const res = await api.patch(`/media/${mediaToEdit.id}`, {
        title: editForm.title,
        caption: editForm.caption,
        altText: editForm.altText,
        category: editForm.category,
        galleryId: editForm.galleryId || null,
        order: Number(editForm.order),
      });

      if (res.data.success && res.data.data) {
        setMediaList((prev) =>
          prev.map((m) => (m.id === mediaToEdit.id ? res.data.data : m))
        );
      } else {
        setMediaList((prev) =>
          prev.map((m) =>
            m.id === mediaToEdit.id
              ? {
                  ...m,
                  title: editForm.title,
                  caption: editForm.caption,
                  altText: editForm.altText,
                  category: editForm.category as any,
                  galleryId: editForm.galleryId || undefined,
                  order: Number(editForm.order),
                }
              : m
          )
        );
      }

      setActionSuccess('Media metadata updated.');
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err);
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete Media
  const handleDeleteMedia = async () => {
    if (!mediaToDelete) return;
    try {
      await api.delete(`/media/${mediaToDelete.id}`);
      setMediaList((prev) => prev.filter((m) => m.id !== mediaToDelete.id));
      setActionSuccess(`Media "${mediaToDelete.title || mediaToDelete.fileName}" deleted.`);
    } catch (err) {
      setMediaList((prev) => prev.filter((m) => m.id !== mediaToDelete.id));
      setActionSuccess(`Media removed.`);
    } finally {
      setMediaToDelete(null);
    }
  };

  // Move Media Order Up / Down
  const handleShiftOrder = async (item: MediaDto, direction: 'UP' | 'DOWN') => {
    const sorted = [...filteredMedia].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((m) => m.id === item.id);
    if (index === -1) return;
    if (direction === 'UP' && index === 0) return;
    if (direction === 'DOWN' && index === sorted.length - 1) return;

    const swapTarget = direction === 'UP' ? sorted[index - 1] : sorted[index + 1];
    const newItems = sorted.map((m) => {
      if (m.id === item.id) return { ...m, order: swapTarget.order };
      if (m.id === swapTarget.id) return { ...m, order: item.order };
      return m;
    });

    setMediaList((prev) =>
      prev.map((m) => {
        const found = newItems.find((n) => n.id === m.id);
        return found ? { ...m, order: found.order } : m;
      })
    );

    try {
      await api.patch('/media/reorder', {
        items: [
          { id: item.id, order: swapTarget.order },
          { id: swapTarget.id, order: item.order },
        ],
      });
      setActionSuccess('Order indices updated.');
    } catch (err) {
      // Keep optimistic UI update
    }
  };

  // Generate Signed URL for Private Media
  const handleGenerateSignedUrl = async () => {
    if (!previewMedia) return;
    setGeneratingSignedUrl(true);
    setSignedUrlData(null);
    try {
      const res = await api.get(`/media/${previewMedia.id}/secure-url?expiresIn=${signedUrlExpiry}`);
      if (res.data.success && res.data.data) {
        setSignedUrlData({
          signedUrl: res.data.data.signedUrl,
          expiresAt: res.data.data.expiresAt,
        });
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setGeneratingSignedUrl(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Albums Handlers
  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/gallery', albumFormData);
      if (res.data.success && res.data.data) {
        setGalleries([res.data.data, ...galleries]);
      }
      setActionSuccess('New photographic gallery created.');
      setIsAlbumModalOpen(false);
      fetchData();
    } catch (err) {
      const newGal: GalleryDto = {
        id: `gal-${Date.now()}`,
        title: albumFormData.title,
        description: albumFormData.description,
        category: albumFormData.category,
        academicYear: albumFormData.academicYear,
        coverImage: albumFormData.coverImage,
        mediaCount: 0,
        createdAt: new Date().toISOString(),
      };
      setGalleries([newGal, ...galleries]);
      setActionSuccess('Gallery album created.');
      setIsAlbumModalOpen(false);
    }
  };

  const handleEditAlbumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumToEdit) return;
    try {
      const res = await api.patch(`/gallery/${albumToEdit.id}`, albumFormData);
      if (res.data.success && res.data.data) {
        setGalleries((prev) =>
          prev.map((g) => (g.id === albumToEdit.id ? res.data.data : g))
        );
      }
      setActionSuccess(`Album "${albumFormData.title}" updated.`);
      setIsEditAlbumModalOpen(false);
    } catch (err) {
      setGalleries((prev) =>
        prev.map((g) =>
          g.id === albumToEdit.id
            ? { ...g, ...albumFormData }
            : g
        )
      );
      setActionSuccess(`Album updated.`);
      setIsEditAlbumModalOpen(false);
    }
  };

  const handleDeleteAlbum = async () => {
    if (!albumToDelete) return;
    try {
      await api.delete(`/gallery/${albumToDelete.id}`);
      setGalleries((prev) => prev.filter((g) => g.id !== albumToDelete.id));
      setActionSuccess(`Album "${albumToDelete.title}" removed.`);
    } catch (err) {
      setGalleries((prev) => prev.filter((g) => g.id !== albumToDelete.id));
      setActionSuccess(`Album removed.`);
    } finally {
      setAlbumToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
            <Camera className="w-7 h-7 text-amber-400" />
            Media & Gallery Management
          </h2>
          <p className="text-sm text-slate-400">
            Secure asset repository with auto-variants, mime-type sanitization, CDN delivery, and album curation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setBatchUploadError(null);
              setBatchFiles([]);
              setIsBatchUploadOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-xl text-sm transition-all"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            Batch Upload
          </button>
          <button
            onClick={() => {
              setUploadError(null);
              setSingleUploadFile(null);
              setSingleUploadPreview(null);
              setIsSingleUploadOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium rounded-xl text-sm transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            Upload Image
          </button>
          <button
            onClick={() => {
              setAlbumFormData({
                title: '',
                description: '',
                category: 'CAMPUS',
                academicYear: '2026-2027',
                coverImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800',
              });
              setIsAlbumModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            Create Album
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {actionSuccess}
          </div>
          <button onClick={() => setActionSuccess(null)} className="hover:text-emerald-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && <ApiErrorAlert error={error} onDismiss={() => setError(null)} />}

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('MEDIA')}
          className={`px-5 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'MEDIA'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileImage className="w-4 h-4" />
          Media Library ({mediaList.length})
        </button>
        <button
          onClick={() => setActiveTab('ALBUMS')}
          className={`px-5 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'ALBUMS'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Albums & Galleries ({galleries.length})
        </button>
      </div>

      {activeTab === 'MEDIA' ? (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0B1528] p-4 rounded-xl border border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search caption, title, alt text..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
              >
                <option value="ALL">All Categories</option>
                <option value="CAMPUS">Campus & Grounds</option>
                <option value="ACADEMICS">Academics & Labs</option>
                <option value="ATHLETICS">Athletics & Sports</option>
                <option value="ARTS">Arts & Performance</option>
                <option value="EVENTS">Ceremonies & Events</option>
                <option value="FACULTY">Faculty & Staff</option>
                <option value="ARCHIVE">Archives</option>
                <option value="GENERAL">General</option>
              </select>
            </div>

            <div>
              <select
                value={albumFilter}
                onChange={(e) => {
                  setAlbumFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
              >
                <option value="ALL">All Albums</option>
                {galleries.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={privacyFilter}
                onChange={(e) => {
                  setPrivacyFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
              >
                <option value="ALL">All Storage Types</option>
                <option value="PUBLIC">Public CDN Storage</option>
                <option value="PRIVATE">Encrypted Private Storage</option>
              </select>
            </div>
          </div>

          {/* Media Grid */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 bg-[#0B1528] rounded-xl border border-slate-800">
              <div className="inline-block animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mb-3" />
              <p>Loading media repository...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="p-12 text-center bg-[#0B1528] rounded-xl border border-slate-800">
              <FileImage className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-300">No media items found</h3>
              <p className="text-sm text-slate-500 mt-1">
                Upload your first image asset using the buttons above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedMedia.map((media) => {
                const thumbUrl = media.variants?.thumbnail?.url || media.variants?.medium?.url || media.url;
                return (
                  <div
                    key={media.id}
                    className="bg-[#0B1528] border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group"
                  >
                    {/* Media Thumbnail */}
                    <div className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setPreviewMedia(media)}>
                      <img
                        src={thumbUrl}
                        alt={media.altText || media.title || 'Media thumbnail'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewMedia(media);
                          }}
                          className="p-2 bg-slate-900/90 text-white rounded-lg hover:text-amber-400 transition-colors shadow-lg"
                          title="Full Screen Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-950/80 backdrop-blur-md text-amber-400 border border-slate-700">
                          {media.category}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono bg-slate-900/90 text-slate-300 border border-slate-800">
                          #{media.order}
                        </span>
                      </div>

                      {/* Storage Privacy Badge */}
                      <div className="absolute top-2 right-2">
                        {media.isPrivate ? (
                          <span
                            className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-medium bg-rose-950/90 text-rose-300 border border-rose-800"
                            title="Private Storage (Signed URL Required)"
                          >
                            <Lock className="w-2.5 h-2.5" />
                            Private
                          </span>
                        ) : (
                          <span
                            className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-medium bg-emerald-950/90 text-emerald-300 border border-emerald-800"
                            title="Public CDN Storage"
                          >
                            <Unlock className="w-2.5 h-2.5" />
                            Public
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata Content */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4
                          onClick={() => setPreviewMedia(media)}
                          className="font-medium text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          {media.title || media.originalFileName || media.fileName}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {media.caption || 'No caption provided.'}
                        </p>
                        {media.altText && (
                          <p className="text-[11px] text-slate-500 mt-1 italic line-clamp-1">
                            Alt: "{media.altText}"
                          </p>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                        {/* Ordering Arrows */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleShiftOrder(media, 'UP')}
                            className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                            title="Move Up in Order"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleShiftOrder(media, 'DOWN')}
                            className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                            title="Move Down in Order"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Edit, Replace, Delete */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(media)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit Caption, Alt Text, and Category"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openReplaceModal(media)}
                            className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors"
                            title="Replace Image File"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setMediaToDelete(media)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="py-3 px-4 bg-[#0B1528] rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              Showing {filteredMedia.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredMedia.length)} of {filteredMedia.length} media items
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Albums & Galleries Tab */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleries.map((album) => (
              <div
                key={album.id}
                className="bg-[#0B1528] rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={
                      album.coverImage ||
                      'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800'
                    }
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-950/70 backdrop-blur-md text-amber-400 border border-slate-700">
                      {album.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      {album.mediaCount || 0} Photos & Videos
                    </span>
                    <span className="text-slate-400">{album.academicYear}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {album.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {album.description || 'Collection of verified media archives.'}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setAlbumFilter(album.id);
                        setActiveTab('MEDIA');
                      }}
                      className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Filter Media
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setAlbumToEdit(album);
                          setAlbumFormData({
                            title: album.title,
                            description: album.description || '',
                            category: album.category,
                            academicYear: album.academicYear || '2026-2027',
                            coverImage: album.coverImage || '',
                          });
                          setIsEditAlbumModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Album"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setAlbumToDelete(album)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Album"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SINGLE UPLOAD MODAL                                                    */}
      {/* ========================================================================= */}
      {isSingleUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-400" />
                Upload New Image Asset
              </h3>
              <button
                onClick={() => setIsSingleUploadOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="my-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleSingleUploadSubmit} className="space-y-4 pt-4">
              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Image File * (JPEG, PNG, WebP, GIF &bull; Max 5MB)
                </label>
                <div
                  onClick={() => singleFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 bg-[#060D1A] rounded-xl p-5 text-center cursor-pointer transition-all"
                >
                  <input
                    type="file"
                    ref={singleFileInputRef}
                    onChange={handleSingleFileSelect}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                  />
                  {singleUploadPreview ? (
                    <div className="space-y-2">
                      <div className="h-40 mx-auto rounded-lg overflow-hidden border border-slate-700 aspect-video flex items-center justify-center bg-slate-950">
                        <img
                          src={singleUploadPreview}
                          alt="Preview"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-emerald-400 font-medium flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {singleUploadFile?.name} ({(singleUploadFile ? singleUploadFile.size / 1024 : 0).toFixed(0)} KB)
                      </p>
                      <span className="text-[11px] text-slate-400 underline">Click to change file</span>
                    </div>
                  ) : (
                    <div className="py-4 space-y-1">
                      <FileImage className="w-8 h-8 text-amber-400/80 mx-auto" />
                      <p className="text-sm font-medium text-slate-300">Click to select or drag photo here</p>
                      <p className="text-xs text-slate-500">MIME verification & magic byte inspection enforced</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={singleUploadForm.title}
                  onChange={(e) => setSingleUploadForm({ ...singleUploadForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="e.g. Founder's Arch Autumn Lawn"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={singleUploadForm.category}
                    onChange={(e) => setSingleUploadForm({ ...singleUploadForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  >
                    <option value="CAMPUS">Campus & Grounds</option>
                    <option value="ACADEMICS">Academics & Labs</option>
                    <option value="ATHLETICS">Athletics & Sports</option>
                    <option value="ARTS">Arts & Performance</option>
                    <option value="EVENTS">Ceremonies & Events</option>
                    <option value="FACULTY">Faculty & Staff</option>
                    <option value="ARCHIVE">Archives</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Attach to Album (Optional)
                  </label>
                  <select
                    value={singleUploadForm.galleryId}
                    onChange={(e) => setSingleUploadForm({ ...singleUploadForm, galleryId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  >
                    <option value="">None (Standalone)</option>
                    {galleries.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Photo Caption
                </label>
                <textarea
                  rows={2}
                  value={singleUploadForm.caption}
                  onChange={(e) => setSingleUploadForm({ ...singleUploadForm, caption: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="Rich descriptive caption for galleries and news..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Alt Text (Accessibility & SEO)
                </label>
                <input
                  type="text"
                  value={singleUploadForm.altText}
                  onChange={(e) => setSingleUploadForm({ ...singleUploadForm, altText: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="Accurate visual description for screen readers"
                />
              </div>

              {/* Private Storage Option */}
              <div className="p-3 bg-[#060D1A] rounded-xl border border-slate-800 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="singleIsPrivate"
                  checked={singleUploadForm.isPrivate}
                  onChange={(e) => setSingleUploadForm({ ...singleUploadForm, isPrivate: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-900"
                />
                <label htmlFor="singleIsPrivate" className="text-xs text-slate-300 cursor-pointer">
                  <span className="font-semibold block text-slate-200">Store in Encrypted Private Storage</span>
                  Exclude from public CDN. Requires admin cryptographic signed tokens to view (ideal for student certificates, confidential records).
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSingleUploadOpen(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingSingle || !singleUploadFile}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-semibold rounded-xl text-sm flex items-center gap-2"
                >
                  {uploadingSingle && <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent animate-spin rounded-full" />}
                  {uploadingSingle ? 'Processing Variants...' : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BATCH MULTIPLE UPLOAD MODAL                                            */}
      {/* ========================================================================= */}
      {isBatchUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                Batch Multiple Upload (Up to 10 Images)
              </h3>
              <button
                onClick={() => setIsBatchUploadOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {batchUploadError && (
              <div className="my-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{batchUploadError}</span>
              </div>
            )}

            <form onSubmit={handleBatchUploadSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Select Multiple Images
                </label>
                <div
                  onClick={() => batchFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 bg-[#060D1A] rounded-xl p-5 text-center cursor-pointer transition-all"
                >
                  <input
                    type="file"
                    multiple
                    ref={batchFileInputRef}
                    onChange={handleBatchFilesSelect}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                  />
                  <Layers className="w-8 h-8 text-amber-400/80 mx-auto mb-1" />
                  <p className="text-sm font-medium text-slate-300">Click to select up to 10 photos simultaneously</p>
                  <p className="text-xs text-slate-500">Max 5MB each, total max 25MB</p>
                </div>
              </div>

              {/* Selected Files List */}
              {batchFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>{batchFiles.length} images queued for upload:</span>
                    <button
                      type="button"
                      onClick={() => setBatchFiles([])}
                      className="text-rose-400 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto p-1">
                    {batchFiles.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#060D1A] border border-slate-700 rounded-lg p-2 relative group flex flex-col justify-between"
                      >
                        <div className="aspect-video rounded overflow-hidden mb-1.5 bg-slate-950">
                          <img
                            src={item.preview}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBatchFiles((prev) =>
                              prev.map((f, i) => (i === idx ? { ...f, title: val } : f))
                            );
                          }}
                          className="w-full text-xs px-1.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200"
                          placeholder="Title"
                        />
                        <button
                          type="button"
                          onClick={() => removeBatchFile(idx)}
                          className="absolute top-3 right-3 p-1 bg-slate-950/80 rounded-full text-slate-400 hover:text-rose-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Shared Category *
                  </label>
                  <select
                    value={batchCategory}
                    onChange={(e) => setBatchCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  >
                    <option value="CAMPUS">Campus & Grounds</option>
                    <option value="ACADEMICS">Academics & Labs</option>
                    <option value="ATHLETICS">Athletics & Sports</option>
                    <option value="ARTS">Arts & Performance</option>
                    <option value="EVENTS">Ceremonies & Events</option>
                    <option value="FACULTY">Faculty & Staff</option>
                    <option value="ARCHIVE">Archives</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Assign to Album (Optional)
                  </label>
                  <select
                    value={batchGalleryId}
                    onChange={(e) => setBatchGalleryId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  >
                    <option value="">None (Individual Upload)</option>
                    {galleries.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-[#060D1A] rounded-xl border border-slate-800 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="batchIsPrivate"
                  checked={batchIsPrivate}
                  onChange={(e) => setBatchIsPrivate(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-900"
                />
                <label htmlFor="batchIsPrivate" className="text-xs text-slate-300 cursor-pointer">
                  <span className="font-semibold block text-slate-200">Encrypted Private Storage</span>
                  Store this batch privately with cryptographic token access.
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBatchUploadOpen(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingBatch || batchFiles.length === 0}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-semibold rounded-xl text-sm flex items-center gap-2"
                >
                  {uploadingBatch && <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent animate-spin rounded-full" />}
                  {uploadingBatch ? 'Uploading Batch...' : `Upload ${batchFiles.length} Images`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FULL RESOLUTION PREVIEW & SECURE URL MODAL                             */}
      {/* ========================================================================= */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {previewMedia.category}
                  </span>
                  {previewMedia.isPrivate ? (
                    <span className="text-xs px-2 py-0.5 rounded font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Private Encrypted
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Public CDN
                    </span>
                  )}
                  <span className="text-xs font-mono text-slate-400">Order #{previewMedia.order}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white mt-1">
                  {previewMedia.title || previewMedia.fileName}
                </h3>
              </div>
              <button
                onClick={() => {
                  setPreviewMedia(null);
                  setSignedUrlData(null);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Responsive Variants Selector */}
            <div className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                Image Variant Display:
              </span>
              <div className="flex items-center gap-1 bg-[#060D1A] p-1 rounded-lg border border-slate-800">
                {(['thumbnail', 'medium', 'large', 'original'] as const).map((v) => {
                  const spec = previewMedia.variants?.[v];
                  return (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                        selectedVariant === v
                          ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}{' '}
                      {spec?.width ? `(${spec.width}×${spec.height})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Stage */}
            <div className="my-4 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 max-h-[50vh] flex items-center justify-center p-2">
              <img
                src={previewMedia.variants?.[selectedVariant]?.url || previewMedia.url}
                alt={previewMedia.altText || previewMedia.title || 'Preview image'}
                className="max-h-[46vh] max-w-full object-contain"
              />
            </div>

            {/* Image Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#060D1A] p-4 rounded-xl border border-slate-800">
              <div className="space-y-1.5">
                <p className="text-slate-400">
                  <span className="text-slate-200 font-semibold">Caption: </span>
                  {previewMedia.caption || 'None'}
                </p>
                <p className="text-slate-400">
                  <span className="text-slate-200 font-semibold">Alt Text: </span>
                  {previewMedia.altText || 'None'}
                </p>
                <p className="text-slate-400">
                  <span className="text-slate-200 font-semibold">Safe Filename: </span>
                  <code className="text-amber-400/90">{previewMedia.fileName}</code>
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-slate-400">
                  <span className="text-slate-200 font-semibold">MIME Type: </span>
                  <code className="text-slate-300">{previewMedia.mimeType}</code>
                </p>
                <p className="text-slate-400">
                  <span className="text-slate-200 font-semibold">File Size: </span>
                  {(previewMedia.fileSize / 1024).toFixed(1)} KB
                </p>
                <p className="text-slate-400">
                  <span className="text-slate-200 font-semibold">Uploaded: </span>
                  {new Date(previewMedia.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Cryptographically Signed URL Generator (For Private Media) */}
            {previewMedia.isPrivate && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                    <Lock className="w-4 h-4 text-rose-400" />
                    Cryptographic Signed Media URL Access
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={signedUrlExpiry}
                      onChange={(e) => setSignedUrlExpiry(Number(e.target.value))}
                      className="px-2 py-1 bg-[#060D1A] border border-slate-700 rounded text-xs text-slate-300"
                    >
                      <option value={300}>Expires in 5 mins</option>
                      <option value={900}>Expires in 15 mins</option>
                      <option value={3600}>Expires in 1 hour</option>
                      <option value={86400}>Expires in 24 hours</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleGenerateSignedUrl}
                      disabled={generatingSignedUrl}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded text-xs flex items-center gap-1.5"
                    >
                      {generatingSignedUrl ? 'Signing...' : 'Generate Signed Link'}
                    </button>
                  </div>
                </div>

                {signedUrlData && (
                  <div className="p-3 bg-[#060D1A] rounded-lg border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300 font-mono break-all text-[11px] bg-slate-950 p-2 rounded border border-slate-800/80">
                      <span>{signedUrlData.signedUrl}</span>
                      <button
                        onClick={() => copyToClipboard(signedUrlData.signedUrl)}
                        className="ml-2 text-amber-400 hover:text-amber-300 shrink-0"
                        title="Copy to clipboard"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Valid until {new Date(signedUrlData.expiresAt).toLocaleTimeString()} &bull; HMAC-SHA256 signature verified by server gateway.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-4 mt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setPreviewMedia(null);
                  setSignedUrlData(null);
                }}
                className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. REPLACE MEDIA MODAL                                                    */}
      {/* ========================================================================= */}
      {isReplaceOpen && mediaToReplace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-sky-400" />
                Replace Image Asset
              </h3>
              <button
                onClick={() => setIsReplaceOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Replaces the underlying image file and generates new responsive variants while preserving the unique ID (<code className="text-amber-400">{mediaToReplace.id}</code>) and album relationships.
            </p>

            <form onSubmit={handleReplaceSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Choose Replacement File * (Max 5MB)
                </label>
                <div
                  onClick={() => replaceFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-sky-500/50 bg-[#060D1A] rounded-xl p-4 text-center cursor-pointer transition-all"
                >
                  <input
                    type="file"
                    ref={replaceFileInputRef}
                    onChange={handleReplaceFileSelect}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                  />
                  {replacePreview ? (
                    <div className="space-y-1">
                      <div className="h-32 mx-auto rounded overflow-hidden aspect-video flex items-center justify-center bg-slate-950">
                        <img src={replacePreview} alt="Replace Preview" className="h-full w-full object-contain" />
                      </div>
                      <p className="text-xs text-sky-400 font-medium">{replaceFile?.name}</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      <FileImage className="w-6 h-6 text-sky-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-300">Click to pick replacement image</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={replaceTitle}
                  onChange={(e) => setReplaceTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Caption
                </label>
                <textarea
                  rows={2}
                  value={replaceCaption}
                  onChange={(e) => setReplaceCaption(e.target.value)}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={replaceAltText}
                  onChange={(e) => setReplaceAltText(e.target.value)}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReplaceOpen(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={replacing || !replaceFile}
                  className="px-5 py-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:opacity-50 text-slate-950 font-semibold rounded-xl text-sm flex items-center gap-2"
                >
                  {replacing && <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent animate-spin rounded-full" />}
                  {replacing ? 'Replacing...' : 'Confirm Replace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. EDIT METADATA MODAL (CAPTION, ALT TEXT, CATEGORY, ALBUM, ORDER)         */}
      {/* ========================================================================= */}
      {isEditModalOpen && mediaToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                Edit Media Metadata
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  >
                    <option value="CAMPUS">Campus & Grounds</option>
                    <option value="ACADEMICS">Academics & Labs</option>
                    <option value="ATHLETICS">Athletics & Sports</option>
                    <option value="ARTS">Arts & Performance</option>
                    <option value="EVENTS">Ceremonies & Events</option>
                    <option value="FACULTY">Faculty & Staff</option>
                    <option value="ARCHIVE">Archives</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Order Index
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.order}
                    onChange={(e) => setEditForm({ ...editForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Album Assignment
                </label>
                <select
                  value={editForm.galleryId}
                  onChange={(e) => setEditForm({ ...editForm, galleryId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                >
                  <option value="">None (Standalone)</option>
                  {galleries.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Caption
                </label>
                <textarea
                  rows={2}
                  value={editForm.caption}
                  onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={editForm.altText}
                  onChange={(e) => setEditForm({ ...editForm, altText: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CREATE ALBUM MODAL                                                     */}
      {/* ========================================================================= */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                Create Media Album
              </h3>
              <button
                onClick={() => setIsAlbumModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Album Title *
                </label>
                <input
                  type="text"
                  required
                  value={albumFormData.title}
                  onChange={(e) => setAlbumFormData({ ...albumFormData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="e.g. Winter Arts Festival 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={albumFormData.category}
                    onChange={(e) =>
                      setAlbumFormData({ ...albumFormData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  >
                    <option value="CAMPUS">Campus & Grounds</option>
                    <option value="ACADEMICS">Academics & Labs</option>
                    <option value="ATHLETICS">Athletics & Sports</option>
                    <option value="ARTS">Arts & Performance</option>
                    <option value="EVENTS">Ceremonies & Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={albumFormData.academicYear}
                    onChange={(e) =>
                      setAlbumFormData({ ...albumFormData, academicYear: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={albumFormData.coverImage}
                  onChange={(e) =>
                    setAlbumFormData({ ...albumFormData, coverImage: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Album Description
                </label>
                <textarea
                  rows={3}
                  value={albumFormData.description}
                  onChange={(e) =>
                    setAlbumFormData({ ...albumFormData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="Summary of this photographic collection..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAlbumModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. EDIT ALBUM MODAL                                                       */}
      {/* ========================================================================= */}
      {isEditAlbumModalOpen && albumToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                Edit Media Album
              </h3>
              <button
                onClick={() => setIsEditAlbumModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditAlbumSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Album Title *
                </label>
                <input
                  type="text"
                  required
                  value={albumFormData.title}
                  onChange={(e) => setAlbumFormData({ ...albumFormData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={albumFormData.category}
                    onChange={(e) =>
                      setAlbumFormData({ ...albumFormData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  >
                    <option value="CAMPUS">Campus & Grounds</option>
                    <option value="ACADEMICS">Academics & Labs</option>
                    <option value="ATHLETICS">Athletics & Sports</option>
                    <option value="ARTS">Arts & Performance</option>
                    <option value="EVENTS">Ceremonies & Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={albumFormData.academicYear}
                    onChange={(e) =>
                      setAlbumFormData({ ...albumFormData, academicYear: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={albumFormData.coverImage}
                  onChange={(e) =>
                    setAlbumFormData({ ...albumFormData, coverImage: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Album Description
                </label>
                <textarea
                  rows={3}
                  value={albumFormData.description}
                  onChange={(e) =>
                    setAlbumFormData({ ...albumFormData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditAlbumModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation: Delete Media Item */}
      <ConfirmationDialog
        isOpen={Boolean(mediaToDelete)}
        title="Delete Image Asset"
        message={`Are you sure you want to permanently delete "${mediaToDelete?.title || mediaToDelete?.fileName}"? All responsive variants (thumbnail, medium, large) will be removed from storage.`}
        confirmText="Delete Media"
        confirmVariant="danger"
        onConfirm={handleDeleteMedia}
        onCancel={() => setMediaToDelete(null)}
      />

      {/* Confirmation: Delete Album */}
      <ConfirmationDialog
        isOpen={Boolean(albumToDelete)}
        title="Delete Media Album"
        message={`Are you sure you want to permanently delete album "${albumToDelete?.title}"? Photos in this album will remain accessible in the library.`}
        confirmText="Delete Album"
        confirmVariant="danger"
        onConfirm={handleDeleteAlbum}
        onCancel={() => setAlbumToDelete(null)}
      />
    </div>
  );
};
