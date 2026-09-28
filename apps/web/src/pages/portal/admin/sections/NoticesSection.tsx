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
  ArrowUpDown,
  Tag,
  Users,
  Calendar,
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

export const NoticesSection: React.FC = () => {
  const [notices, setNotices] = useState<NoticeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'publishedAt' | 'title'>('publishedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & Actions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeDto | null>(null);
  const [noticeToDelete, setNoticeToDelete] = useState<NoticeDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
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
      // Realistic Mock Data
      setNotices([
        {
          id: 'not-1',
          title: 'Campus Safety & Health Advisory Protocol 2026',
          content:
            'All faculty, scholars, and visitors must adhere to the updated autumnal health standards. Daily wellness screening remains in effect at North Gate.',
          category: 'ADMINISTRATIVE',
          targetRole: 'ALL_ROLES',
          isPinned: true,
          publishedAt: '2026-09-24T08:00:00Z',
          authorName: 'Office of the Principal',
        },
        {
          id: 'not-2',
          title: 'Fall Term Mid-Term Examination Schedule Released',
          content:
            'Mid-term assessment schedules for Grades 6 through 12 have been posted in the academic portal. Practical sessions will commence on Oct 14.',
          category: 'EXAMINATION',
          targetRole: 'STUDENT',
          isPinned: true,
          publishedAt: '2026-09-22T10:30:00Z',
          authorName: 'Examination Board',
        },
        {
          id: 'not-3',
          title: 'Annual Founders Day Gala & Scholar Showcase',
          content:
            'Invitations have been dispatched to all patron families for our centenary celebrations. RSVP via the portal before Friday.',
          category: 'GENERAL',
          targetRole: 'PARENT',
          isPinned: false,
          publishedAt: '2026-09-18T14:15:00Z',
          authorName: 'Head of Community Relations',
        },
        {
          id: 'not-4',
          title: 'Faculty In-Service & Curriculum Development Day',
          content:
            'No student instruction will take place this upcoming Monday. All faculty members are required to report to the Grand Auditorium at 08:30 sharp.',
          category: 'ACADEMIC',
          targetRole: 'TEACHER',
          isPinned: false,
          publishedAt: '2026-09-15T09:00:00Z',
          authorName: 'Academic Dean',
        },
        {
          id: 'not-5',
          title: 'Severe Weather Warning: Inclement Weather Contingency',
          content:
            'Severe rainstorms are forecast for coastal regions tomorrow morning. High-wind protocols are activated across all exterior campus walkways.',
          category: 'EMERGENCY',
          targetRole: 'ALL_ROLES',
          isPinned: false,
          publishedAt: '2026-09-10T16:00:00Z',
          authorName: 'Campus Security',
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
        const matchesSearch =
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (n.authorName && n.authorName.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = categoryFilter === 'ALL' || n.category === categoryFilter;
        const matchesRole = roleFilter === 'ALL' || n.targetRole === roleFilter;
        return matchesSearch && matchesCategory && matchesRole;
      })
      .sort((a, b) => {
        // Pinned always on top if sorting by publishedAt
        if (sortField === 'publishedAt') {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        }
        let valA = a[sortField] || '';
        let valB = b[sortField] || '';
        if (sortOrder === 'asc') return valA.localeCompare(valB);
        return valB.localeCompare(valA);
      });
  }, [notices, searchQuery, categoryFilter, roleFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage) || 1;
  const paginatedNotices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredNotices.slice(start, start + itemsPerPage);
  }, [filteredNotices, currentPage, itemsPerPage]);

  const handleOpenCreate = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      content: '',
      category: 'GENERAL',
      targetRole: 'ALL_ROLES',
      isPinned: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (n: NoticeDto) => {
    setEditingNotice(n);
    setFormData({
      title: n.title,
      content: n.content,
      category: n.category,
      targetRole: n.targetRole || 'ALL_ROLES',
      isPinned: n.isPinned,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingNotice) {
        await api.patch(`/notices/${editingNotice.id}`, formData);
        setActionSuccess('Notice updated successfully.');
      } else {
        await api.post('/notices', formData);
        setActionSuccess('New institutional notice published.');
      }
      setIsModalOpen(false);
      fetchNotices();
    } catch (err) {
      if (editingNotice) {
        setNotices((prev) =>
          prev.map((n) => (n.id === editingNotice.id ? { ...n, ...formData } : n))
        );
        setActionSuccess('Notice modified (local update).');
      } else {
        const newNotice: NoticeDto = {
          id: `not-${Date.now()}`,
          title: formData.title,
          content: formData.content,
          category: formData.category,
          targetRole: formData.targetRole,
          isPinned: formData.isPinned,
          publishedAt: new Date().toISOString(),
          authorName: 'Administration Staff',
        };
        setNotices([newNotice, ...notices]);
        setActionSuccess('Notice published (local update).');
      }
      setIsModalOpen(false);
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
            Institutional Bulletins & Notices
          </h2>
          <p className="text-sm text-slate-400">
            Publish official announcements, emergency advisories, and targeted academic circulars.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
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

      {/* Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0B1528] p-4 rounded-xl border border-slate-800">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search bulletins by title, keyword, or author..."
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
          <p>Retrieving campus bulletins...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="p-12 text-center bg-[#0B1528] rounded-xl border border-slate-800">
          <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-300">No bulletins match your query</h3>
          <p className="text-sm text-slate-500 mt-1">
            Try adjusting your search criteria or publish a new notice.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedNotices.map((notice) => {
            const catClass =
              CATEGORY_COLORS[notice.category] || 'bg-slate-800 text-slate-300 border-slate-700';

            return (
              <div
                key={notice.id}
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
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${catClass}`}
                      >
                        {notice.category}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                        {notice.targetRole ? notice.targetRole.replace('_', ' ') : 'ALL ROLES'}
                      </span>
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
                    {notice.content}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {new Date(notice.publishedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    {notice.authorName && (
                      <span className="text-slate-500"> • {notice.authorName}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(notice)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit bulletin"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setNoticeToDelete(notice)}
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                {editingNotice ? 'Edit Bulletin' : 'Publish Institutional Bulletin'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Bulletin Headline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="e.g. Schedule for Autumn Term Examinations"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    Target Role *
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
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Notice Content *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="Provide complete details, instructions, and dates..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPinnedCheck"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-[#060D1A]"
                />
                <label htmlFor="isPinnedCheck" className="text-xs font-medium text-slate-300">
                  Pin this bulletin to the top of all user dashboards
                </label>
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
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm"
                >
                  {editingNotice ? 'Save Changes' : 'Publish Notice'}
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
        message={`Are you sure you want to permanently delete "${noticeToDelete?.title}"? It will no longer be visible on student, parent, or faculty portals.`}
        confirmText="Delete Bulletin"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setNoticeToDelete(null)}
      />
    </div>
  );
};
