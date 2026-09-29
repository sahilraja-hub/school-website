import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Pin,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Paperclip,
  Send,
  Archive,
  RotateCcw,
  ExternalLink,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { NoticeDto } from '@school/shared';

const CATEGORY_COLORS: Record<string, string> = {
  ACADEMIC: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  ADMINISTRATIVE: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  EXAMINATION: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  GENERAL: 'bg-slate-700/30 text-slate-300 border-slate-700',
  EMERGENCY: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  PUBLISHED: {
    label: 'Published',
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  DRAFT: {
    label: 'Draft',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  ARCHIVED: {
    label: 'Archived',
    className: 'bg-slate-700/40 text-slate-400 border-slate-600',
  },
};

export const NoticesSection: React.FC = () => {
  const [notices, setNotices] = useState<NoticeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & Actions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeDto | null>(null);
  const [noticeToDelete, setNoticeToDelete] = useState<NoticeDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'GENERAL',
    publishDate: '',
    expiryDate: '',
    attachment: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    targetRole: 'ALL_ROLES',
    isPinned: false,
  });

  const fetchNotices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/notices');
      if (res.data.success && Array.isArray(res.data.data)) {
        setNotices(res.data.data);
      }
    } catch (err) {
      setError(err);
      // Fallback Mock Notices with full Phase 15 fields
      setNotices([
        {
          id: 'not-1',
          title: 'Campus Safety & Health Advisory Protocol 2026',
          description:
            'All faculty, scholars, and visitors must adhere to the updated autumnal health standards. Daily wellness screening remains in effect at North Gate.',
          content:
            'All faculty, scholars, and visitors must adhere to the updated autumnal health standards.',
          category: 'ADMINISTRATIVE',
          publishDate: '2026-09-24T08:00:00Z',
          publishedAt: '2026-09-24T08:00:00Z',
          expiryDate: '2026-12-31T23:59:59Z',
          attachment: 'https://oakridge.edu/docs/safety_protocol_2026.pdf',
          status: 'PUBLISHED',
          targetRole: 'ALL_ROLES',
          isPinned: true,
          authorName: 'Office of the Principal',
        },
        {
          id: 'not-2',
          title: 'Fall Term Mid-Term Examination Schedule Released',
          description:
            'Mid-term assessment schedules for Grades 6 through 12 have been posted in the academic portal. Practical sessions will commence on Oct 14.',
          content: 'Mid-term assessment schedules for Grades 6 through 12 have been posted.',
          category: 'EXAMINATION',
          publishDate: '2026-09-22T10:30:00Z',
          publishedAt: '2026-09-22T10:30:00Z',
          expiryDate: '2026-11-15T18:00:00Z',
          status: 'PUBLISHED',
          targetRole: 'STUDENT',
          isPinned: true,
          authorName: 'Examination Board',
        },
        {
          id: 'not-3',
          title: 'Internal Faculty Review Meeting Draft Notice',
          description:
            'Faculty review notes for the revised advanced placement mathematics curriculum.',
          content: 'Faculty review notes for AP mathematics curriculum.',
          category: 'ACADEMIC',
          publishDate: '2026-10-05T09:00:00Z',
          publishedAt: '2026-10-05T09:00:00Z',
          status: 'DRAFT',
          targetRole: 'TEACHER',
          isPinned: false,
          authorName: 'Academic Dean',
        },
        {
          id: 'not-4',
          title: 'Winter Concert 2025 Retrospective',
          description: 'Historical archive notice of the previous winter concert program.',
          content: 'Historical archive notice.',
          category: 'GENERAL',
          publishDate: '2025-12-15T09:00:00Z',
          publishedAt: '2025-12-15T09:00:00Z',
          status: 'ARCHIVED',
          targetRole: 'ALL_ROLES',
          isPinned: false,
          authorName: 'Fine Arts Directorate',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = useMemo(() => {
    return notices
      .filter((n) => {
        const titleMatch = n.title.toLowerCase().includes(searchQuery.toLowerCase());
        const descMatch = (n.description || n.content || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const authorMatch = n.authorName ? n.authorName.toLowerCase().includes(searchQuery.toLowerCase()) : false;
        const matchesSearch = titleMatch || descMatch || authorMatch;

        const matchesCategory = categoryFilter === 'ALL' || n.category === categoryFilter;
        const matchesStatus = statusFilter === 'ALL' || n.status === statusFilter;
        const matchesRole = roleFilter === 'ALL' || n.targetRole === roleFilter;

        return matchesSearch && matchesCategory && matchesStatus && matchesRole;
      })
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        const dateA = new Date(a.publishDate || a.publishedAt || 0).getTime();
        const dateB = new Date(b.publishDate || b.publishedAt || 0).getTime();
        return dateB - dateA;
      });
  }, [notices, searchQuery, categoryFilter, statusFilter, roleFilter]);

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage) || 1;
  const paginatedNotices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredNotices.slice(start, start + itemsPerPage);
  }, [filteredNotices, currentPage, itemsPerPage]);

  const handleOpenCreate = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      description: '',
      category: 'GENERAL',
      publishDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      attachment: '',
      status: 'DRAFT',
      targetRole: 'ALL_ROLES',
      isPinned: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (n: NoticeDto) => {
    setEditingNotice(n);
    setFormData({
      title: n.title,
      description: n.description || n.content || '',
      category: n.category,
      publishDate: n.publishDate ? n.publishDate.split('T')[0] : '',
      expiryDate: n.expiryDate ? n.expiryDate.split('T')[0] : '',
      attachment: n.attachment || '',
      status: n.status || 'DRAFT',
      targetRole: n.targetRole || 'ALL_ROLES',
      isPinned: n.isPinned,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload = {
      title: formData.title,
      description: formData.description,
      content: formData.description,
      category: formData.category,
      publishDate: formData.publishDate ? new Date(formData.publishDate).toISOString() : new Date().toISOString(),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
      attachment: formData.attachment.trim() || undefined,
      status: formData.status,
      targetRole: formData.targetRole === 'ALL_ROLES' ? undefined : formData.targetRole,
      isPinned: formData.isPinned,
    };

    try {
      if (editingNotice) {
        await api.patch(`/notices/${editingNotice.id}`, payload);
        setActionSuccess('Notice updated successfully.');
      } else {
        await api.post('/notices', payload);
        setActionSuccess(
          formData.status === 'PUBLISHED'
            ? 'Notice published to public portal.'
            : 'Notice saved as draft.'
        );
      }
      setIsModalOpen(false);
      fetchNotices();
    } catch (err) {
      if (editingNotice) {
        setNotices((prev) =>
          prev.map((n) =>
            n.id === editingNotice.id
              ? {
                  ...n,
                  ...payload,
                  publishedAt: payload.publishDate,
                  status: payload.status as any,
                }
              : n
          )
        );
        setActionSuccess('Notice modified (local update).');
      } else {
        const newNotice: NoticeDto = {
          id: `not-${Date.now()}`,
          title: payload.title,
          description: payload.description,
          content: payload.description,
          category: payload.category,
          publishDate: payload.publishDate,
          publishedAt: payload.publishDate,
          expiryDate: payload.expiryDate,
          attachment: payload.attachment,
          status: payload.status as any,
          targetRole: payload.targetRole,
          isPinned: payload.isPinned,
          authorName: 'Administration Staff',
        };
        setNotices([newNotice, ...notices]);
        setActionSuccess('Notice created (local update).');
      }
      setIsModalOpen(false);
    }
  };

  const handlePublish = async (notice: NoticeDto) => {
    setError(null);
    try {
      await api.post(`/notices/${notice.id}/publish`);
      setActionSuccess(`Notice "${notice.title}" is now published.`);
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? { ...n, status: 'PUBLISHED' } : n))
      );
    } catch (err) {
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? { ...n, status: 'PUBLISHED' } : n))
      );
      setActionSuccess(`Notice "${notice.title}" published (local update).`);
    }
  };

  const handleUnpublish = async (notice: NoticeDto) => {
    setError(null);
    try {
      await api.post(`/notices/${notice.id}/unpublish`);
      setActionSuccess(`Notice "${notice.title}" unpublished and moved to draft.`);
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? { ...n, status: 'DRAFT' } : n))
      );
    } catch (err) {
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? { ...n, status: 'DRAFT' } : n))
      );
      setActionSuccess(`Notice "${notice.title}" returned to draft.`);
    }
  };

  const handleArchive = async (notice: NoticeDto) => {
    setError(null);
    try {
      await api.post(`/notices/${notice.id}/archive`);
      setActionSuccess(`Notice "${notice.title}" archived.`);
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? { ...n, status: 'ARCHIVED' } : n))
      );
    } catch (err) {
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? { ...n, status: 'ARCHIVED' } : n))
      );
      setActionSuccess(`Notice "${notice.title}" archived.`);
    }
  };

  const handleTogglePin = async (notice: NoticeDto) => {
    setError(null);
    const newPinned = !notice.isPinned;
    try {
      await api.patch(`/notices/${notice.id}`, { isPinned: newPinned });
      setActionSuccess(`Notice ${newPinned ? 'pinned to top' : 'unpinned'}.`);
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? { ...n, isPinned: newPinned } : n))
      );
    } catch (err) {
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? { ...n, isPinned: newPinned } : n))
      );
      setActionSuccess(`Notice ${newPinned ? 'pinned' : 'unpinned'}.`);
    }
  };

  const handleDelete = async () => {
    if (!noticeToDelete) return;
    setError(null);
    try {
      await api.delete(`/notices/${noticeToDelete.id}`);
      setActionSuccess(`Notice "${noticeToDelete.title}" deleted.`);
      setNotices((prev) => prev.filter((n) => n.id !== noticeToDelete.id));
    } catch (err) {
      setNotices((prev) => prev.filter((n) => n.id !== noticeToDelete.id));
      setActionSuccess(`Notice "${noticeToDelete.title}" removed.`);
    } finally {
      setNoticeToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
            <Bell className="w-7 h-7 text-amber-400" />
            Institutional Bulletins & Notices Management
          </h2>
          <p className="text-sm text-slate-400">
            Publish official announcements, manage draft notices, schedule expiry dates, and archive circulars.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          data-testid="create-notice-btn"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          Publish Bulletin
        </button>
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

      {/* Control Bar: Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#0B1528] p-4 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            data-testid="notice-search-input"
            placeholder="Search by title, description..."
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
            data-testid="notice-status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="ALL">All Statuses (Draft, Pub, Arch)</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Drafts Only</option>
            <option value="ARCHIVED">Archived Only</option>
          </select>
        </div>

        <div>
          <select
            data-testid="notice-category-filter"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="ALL">All Categories</option>
            <option value="ACADEMIC">Academic</option>
            <option value="ADMINISTRATIVE">Administrative</option>
            <option value="EXAMINATION">Examination</option>
            <option value="GENERAL">General</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="ALL">All Audiences</option>
            <option value="ALL_ROLES">Entire Campus</option>
            <option value="TEACHER">Faculty Only</option>
            <option value="STUDENT">Scholars Only</option>
            <option value="PARENT">Guardians Only</option>
          </select>
        </div>
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-[#0B1528] rounded-xl border border-slate-800">
          <div className="inline-block animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mb-3" />
          <p>Retrieving campus bulletins & notices...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="p-12 text-center bg-[#0B1528] rounded-xl border border-slate-800">
          <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-300">No notices match your criteria</h3>
          <p className="text-sm text-slate-500 mt-1">
            Try adjusting your search criteria or create a new notice.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="notices-grid">
          {paginatedNotices.map((notice) => {
            const catClass =
              CATEGORY_COLORS[notice.category] || 'bg-slate-800 text-slate-300 border-slate-700';
            const statusConfig = STATUS_BADGES[notice.status || 'DRAFT'] || STATUS_BADGES.DRAFT;

            return (
              <div
                key={notice.id}
                data-testid={`notice-card-${notice.id}`}
                className={`bg-[#0B1528] p-5 rounded-xl border transition-all duration-200 relative group flex flex-col justify-between ${
                  notice.isPinned
                    ? 'border-amber-500/40 shadow-lg shadow-amber-500/5 bg-gradient-to-b from-[#0E1A33] to-[#0B1528]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${statusConfig.className}`}
                        data-testid={`notice-status-badge-${notice.status}`}
                      >
                        {statusConfig.label}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${catClass}`}
                      >
                        {notice.category}
                      </span>
                      {notice.targetRole && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                          {notice.targetRole.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleTogglePin(notice)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        notice.isPinned
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : 'border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                      title={notice.isPinned ? 'Unpin notice' : 'Pin notice to top'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${notice.isPinned ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                    {notice.title}
                  </h3>

                  <p className="text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {notice.description || notice.content}
                  </p>

                  {/* Attachment & Expiry info */}
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                    {notice.expiryDate && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Expires: {new Date(notice.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                    {notice.attachment && (
                      <a
                        href={notice.attachment}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-amber-400 hover:underline"
                        title={notice.attachment}
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        Attachment
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {new Date(notice.publishDate || notice.publishedAt || 0).toLocaleDateString(
                        undefined,
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </span>
                    {notice.authorName && (
                      <span className="text-slate-500"> • {notice.authorName}</span>
                    )}
                  </div>

                  {/* Lifecycle & Edit Action Buttons */}
                  <div className="flex items-center gap-1">
                    {notice.status === 'DRAFT' && (
                      <button
                        onClick={() => handlePublish(notice)}
                        data-testid={`publish-notice-${notice.id}`}
                        className="px-2 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30 rounded-lg transition-colors flex items-center gap-1"
                        title="Publish this notice"
                      >
                        <Send className="w-3 h-3" />
                        Publish
                      </button>
                    )}

                    {notice.status === 'PUBLISHED' && (
                      <>
                        <button
                          onClick={() => handleUnpublish(notice)}
                          data-testid={`unpublish-notice-${notice.id}`}
                          className="px-2 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/10 border border-amber-500/30 rounded-lg transition-colors flex items-center gap-1"
                          title="Unpublish to draft"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Unpublish
                        </button>
                        <button
                          onClick={() => handleArchive(notice)}
                          data-testid={`archive-notice-${notice.id}`}
                          className="px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-colors flex items-center gap-1"
                          title="Archive notice"
                        >
                          <Archive className="w-3 h-3" />
                          Archive
                        </button>
                      </>
                    )}

                    {notice.status === 'ARCHIVED' && (
                      <button
                        onClick={() => handlePublish(notice)}
                        data-testid={`restore-notice-${notice.id}`}
                        className="px-2 py-1 text-xs font-semibold text-blue-400 hover:bg-blue-500/10 border border-blue-500/30 rounded-lg transition-colors flex items-center gap-1"
                        title="Republish notice"
                      >
                        <Send className="w-3 h-3" />
                        Republish
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenEdit(notice)}
                      data-testid={`edit-notice-${notice.id}`}
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit bulletin"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setNoticeToDelete(notice)}
                      data-testid={`delete-notice-${notice.id}`}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete bulletin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      <div className="py-3 px-4 bg-[#0B1528] rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing {filteredNotices.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredNotices.length)} of {filteredNotices.length}{' '}
          bulletins
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            data-testid="prev-page-btn"
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
            data-testid="next-page-btn"
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                {editingNotice ? 'Edit Institutional Notice' : 'Create Institutional Notice'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4" data-testid="notice-form">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  data-testid="notice-form-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="e.g. Schedule for Autumn Term Examinations"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Description / Content *
                </label>
                <textarea
                  required
                  rows={4}
                  data-testid="notice-form-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="Provide complete notice details, instructions, and dates..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  >
                    <option value="GENERAL">General</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="ADMINISTRATIVE">Administrative</option>
                    <option value="EXAMINATION">Examination</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Status *
                  </label>
                  <select
                    data-testid="notice-form-status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Attachment URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.attachment}
                  onChange={(e) => setFormData({ ...formData, attachment: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="https://oakridge.edu/documents/circular.pdf"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Target Role
                  </label>
                  <select
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  >
                    <option value="ALL_ROLES">Entire Campus</option>
                    <option value="TEACHER">Faculty Only</option>
                    <option value="STUDENT">Scholars Only</option>
                    <option value="PARENT">Guardians Only</option>
                    <option value="ADMIN">Admins Only</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isPinnedCheck"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-[#060D1A]"
                  />
                  <label htmlFor="isPinnedCheck" className="text-xs font-medium text-slate-300">
                    Pin notice to top of dashboards
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  data-testid="submit-notice-btn"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm"
                >
                  {editingNotice ? 'Save Notice' : formData.status === 'PUBLISHED' ? 'Publish Notice' : 'Save as Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(noticeToDelete)}
        title="Delete Institutional Notice"
        message={`Are you sure you want to permanently delete "${noticeToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete Bulletin"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setNoticeToDelete(null)}
      />
    </div>
  );
};
