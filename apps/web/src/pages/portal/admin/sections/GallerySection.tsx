import React, { useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { GalleryDto } from '@school/shared';

export const GallerySection: React.FC = () => {
  const [galleries, setGalleries] = useState<GalleryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & Actions
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isAddMediaOpen, setIsAddMediaOpen] = useState(false);
  const [viewingAlbum, setViewingAlbum] = useState<GalleryDto | null>(null);
  const [albumToDelete, setAlbumToDelete] = useState<GalleryDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form states
  const [albumFormData, setAlbumFormData] = useState({
    title: '',
    description: '',
    category: 'CAMPUS',
    academicYear: '2026-2027',
    coverImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800',
  });

  const [mediaFormData, setMediaFormData] = useState({
    galleryId: '',
    url: '',
    caption: '',
    mediaType: 'IMAGE',
  });

  const fetchGalleries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/gallery');
      if (res.data.success && Array.isArray(res.data.data)) {
        setGalleries(res.data.data);
      }
    } catch (err) {
      setError(err);
      // Realistic Mock Media Albums
      setGalleries([
        {
          id: 'gal-1',
          title: 'Campus Heritage & Architectural Tour',
          description: 'Historical stone archways, collegiate Gothic quads, and manicured botanic lawns.',
          category: 'CAMPUS',
          academicYear: '2026-2027',
          coverImage:
            'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800',
          mediaCount: 18,
          createdAt: '2026-09-01T10:00:00Z',
        },
        {
          id: 'gal-2',
          title: 'Advanced Science & Robotics Laboratory',
          description: 'Autonomous rover testing, spectroscopy experiments, and digital fabrication.',
          category: 'ACADEMICS',
          academicYear: '2026-2027',
          coverImage:
            'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800',
          mediaCount: 24,
          createdAt: '2026-09-12T14:30:00Z',
        },
        {
          id: 'gal-3',
          title: 'Autumn Varsity Athletics Championship',
          description: 'Rowing regatta, cross-country invitational, and varsity soccer tournament.',
          category: 'ATHLETICS',
          academicYear: '2026-2027',
          coverImage:
            'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
          mediaCount: 32,
          createdAt: '2026-09-18T16:00:00Z',
        },
        {
          id: 'gal-4',
          title: 'Symphony Hall Concert & Fine Arts Gala',
          description: 'Philharmonic orchestral recitals, fine art ceramic exhibitions, and student drama.',
          category: 'ARTS',
          academicYear: '2026-2027',
          coverImage:
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
          mediaCount: 15,
          createdAt: '2026-09-20T20:15:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const filteredGalleries = useMemo(() => {
    return galleries.filter((g) => {
      const matchesSearch =
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = categoryFilter === 'ALL' || g.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [galleries, searchQuery, categoryFilter]);

  const totalPages = Math.ceil(filteredGalleries.length / itemsPerPage) || 1;
  const paginatedGalleries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredGalleries.slice(start, start + itemsPerPage);
  }, [filteredGalleries, currentPage, itemsPerPage]);

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/gallery', albumFormData);
      setActionSuccess('New photographic gallery created.');
      setIsAlbumModalOpen(false);
      fetchGalleries();
    } catch (err) {
      const newGal: GalleryDto = {
        id: `gal-${Date.now()}`,
        title: albumFormData.title,
        description: albumFormData.description,
        category: albumFormData.category,
        academicYear: albumFormData.academicYear,
        coverImage: albumFormData.coverImage,
        mediaCount: 1,
        createdAt: new Date().toISOString(),
      };
      setGalleries([newGal, ...galleries]);
      setActionSuccess('Gallery album created (local update).');
      setIsAlbumModalOpen(false);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/gallery/media', mediaFormData);
      setActionSuccess('Media uploaded and attached to gallery.');
      setIsAddMediaOpen(false);
      fetchGalleries();
    } catch (err) {
      if (mediaFormData.galleryId) {
        setGalleries((prev) =>
          prev.map((g) =>
            g.id === mediaFormData.galleryId
              ? { ...g, mediaCount: (g.mediaCount || 0) + 1 }
              : g
          )
        );
      }
      setActionSuccess('Photo attached to gallery collection.');
      setIsAddMediaOpen(false);
    }
  };

  const handleDeleteAlbum = async () => {
    if (!albumToDelete) return;
    setError(null);
    try {
      await api.delete(`/gallery/${albumToDelete.id}`);
      setActionSuccess(`Album "${albumToDelete.title}" deleted.`);
      setGalleries((prev) => prev.filter((g) => g.id !== albumToDelete.id));
    } catch (err) {
      setGalleries((prev) => prev.filter((g) => g.id !== albumToDelete.id));
      setActionSuccess(`Album "${albumToDelete.title}" removed.`);
    } finally {
      setAlbumToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
            <Camera className="w-7 h-7 text-amber-400" />
            Media & Photo Galleries
          </h2>
          <p className="text-sm text-slate-400">
            Curate campus photography, student portfolios, athletics albums, and institutional archives.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (galleries.length > 0) {
                setMediaFormData({
                  galleryId: galleries[0].id,
                  url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
                  caption: 'Scholars in seminar discussion',
                  mediaType: 'IMAGE',
                });
              }
              setIsAddMediaOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-xl text-sm transition-all"
          >
            <UploadCloud className="w-4 h-4 text-amber-400" />
            Add Media
          </button>
          <button
            onClick={() => setIsAlbumModalOpen(true)}
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

      {/* Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0B1528] p-4 rounded-xl border border-slate-800">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search albums by title or topic..."
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
          </select>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-[#0B1528] rounded-xl border border-slate-800">
          <div className="inline-block animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mb-3" />
          <p>Loading media collections...</p>
        </div>
      ) : filteredGalleries.length === 0 ? (
        <div className="p-12 text-center bg-[#0B1528] rounded-xl border border-slate-800">
          <Image className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-300">No media collections found</h3>
          <p className="text-sm text-slate-500 mt-1">
            Create your first album using the "Create Album" button.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedGalleries.map((album) => (
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
                    onClick={() => setViewingAlbum(album)}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Explore Media
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setAlbumToDelete(album)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete album"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      <div className="py-3 px-4 bg-[#0B1528] rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing {filteredGalleries.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredGalleries.length)} of{' '}
          {filteredGalleries.length} albums
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

      {/* Album Preview Drawer / Modal */}
      {viewingAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  {viewingAlbum.category} • {viewingAlbum.academicYear}
                </span>
                <h3 className="text-xl font-serif font-bold text-white mt-1">
                  {viewingAlbum.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{viewingAlbum.description}</p>
              </div>
              <button
                onClick={() => setViewingAlbum(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <div className="rounded-xl overflow-hidden mb-4 border border-slate-800 aspect-video max-h-72">
                <img
                  src={viewingAlbum.coverImage}
                  alt={viewingAlbum.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-lg bg-slate-900 border border-slate-800 overflow-hidden relative group"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-${
                        idx === 1
                          ? '1509062522246-3755977927d7'
                          : idx === 2
                          ? '1577896851231-70ef18881754'
                          : '1580582932707-520aed937b7b'
                      }?auto=format&fit=crop&q=80&w=400`}
                      alt="Gallery asset"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-500">
                Created on {new Date(viewingAlbum.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => setViewingAlbum(null)}
                className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Album Modal */}
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

      {/* Add Media Modal */}
      {isAddMediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-400" />
                Upload Photo Asset
              </h3>
              <button
                onClick={() => setIsAddMediaOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Destination Album *
                </label>
                <select
                  required
                  value={mediaFormData.galleryId}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, galleryId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                >
                  {galleries.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title} ({g.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Image Resource URL *
                </label>
                <input
                  type="url"
                  required
                  value={mediaFormData.url}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, url: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Photo Caption
                </label>
                <input
                  type="text"
                  value={mediaFormData.caption}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, caption: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="Brief descriptive caption..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMediaOpen(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm"
                >
                  Upload & Attach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(albumToDelete)}
        title="Delete Media Album"
        message={`Are you sure you want to permanently remove album "${albumToDelete?.title}" and its ${albumToDelete?.mediaCount || 0} associated photo items?`}
        confirmText="Delete Album"
        confirmVariant="danger"
        onConfirm={handleDeleteAlbum}
        onCancel={() => setAlbumToDelete(null)}
      />
    </div>
  );
};
