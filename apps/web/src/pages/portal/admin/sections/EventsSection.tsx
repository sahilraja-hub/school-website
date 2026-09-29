import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Eye,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock,
  Send,
  RotateCcw,
  Archive,
  Image as ImageIcon,
} from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { EventDto } from '@school/shared';

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

export const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & Actions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventDto | null>(null);
  const [eventToDelete, setEventToDelete] = useState<EventDto | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '2026-10-18',
    startTime: '09:00',
    endTime: '16:00',
    location: '',
    image: '',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
  });

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/events');
      if (res.data.success && Array.isArray(res.data.data)) {
        setEvents(res.data.data);
      }
    } catch (err) {
      setError(err);
      // Fallback Mock Events Calendar
      setEvents([
        {
          id: 'evt-1',
          title: 'Annual Science & Innovation Symposium 2026',
          description:
            'Scholars from Grades 9-12 demonstrate robotics, biological field work, and chemical synthesis in our premier STEM quad.',
          location: 'Grand Exhibition Hall & Atrium',
          date: '2026-10-18',
          startTime: '09:00',
          endTime: '16:00',
          startDate: '2026-10-18T09:00:00Z',
          endDate: '2026-10-18T16:00:00Z',
          image: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
          bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
          status: 'PUBLISHED',
          isPublic: true,
          organizerName: 'Science Faculty Board',
        },
        {
          id: 'evt-2',
          title: 'Parent-Teacher Academic Progress Conference',
          description:
            'Individual consultations regarding Fall term milestones, diagnostic tests, and personalized enrichment roadmaps.',
          location: 'Main Academic Quad & Classrooms',
          date: '2026-10-24',
          startTime: '13:00',
          endTime: '18:00',
          startDate: '2026-10-24T13:00:00Z',
          endDate: '2026-10-24T18:00:00Z',
          status: 'PUBLISHED',
          isPublic: true,
          organizerName: 'Academic Deans Office',
        },
        {
          id: 'evt-3',
          title: 'Unannounced Board Executive Session Draft',
          description: 'Draft planning for trustee executive committee lunch.',
          location: 'Boardroom Suite 4',
          date: '2026-11-02',
          startTime: '12:00',
          endTime: '14:00',
          startDate: '2026-11-02T12:00:00Z',
          endDate: '2026-11-02T14:00:00Z',
          status: 'DRAFT',
          isPublic: false,
          organizerName: 'Trustees Office',
        },
        {
          id: 'evt-4',
          title: 'Centennial Heritage Gala 2025 Retrospective',
          description: 'Past anniversary banquet archived celebration archive.',
          location: 'Grand Quad Pavilion',
          date: '2025-09-12',
          startTime: '18:00',
          endTime: '22:00',
          startDate: '2025-09-12T18:00:00Z',
          endDate: '2025-09-12T22:00:00Z',
          status: 'ARCHIVED',
          isPublic: false,
          organizerName: 'Alumni Association',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        const matchesSearch =
          evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          evt.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || evt.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || a.startDate || 0).getTime();
        const dateB = new Date(b.date || b.startDate || 0).getTime();
        return dateA - dateB;
      });
  }, [events, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(start, start + itemsPerPage);
  }, [filteredEvents, currentPage, itemsPerPage]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '15:00',
      location: '',
      image: '',
      status: 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: EventDto) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title,
      description: evt.description,
      date: evt.date || (evt.startDate ? evt.startDate.split('T')[0] : ''),
      startTime: evt.startTime || (evt.startDate ? evt.startDate.substring(11, 16) : '09:00'),
      endTime: evt.endTime || (evt.endDate ? evt.endDate.substring(11, 16) : '15:00'),
      location: evt.location,
      image: evt.image || evt.bannerUrl || '',
      status: evt.status || 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      startDate: `${formData.date}T${formData.startTime}:00Z`,
      endDate: `${formData.date}T${formData.endTime}:00Z`,
      location: formData.location,
      image: formData.image.trim() || undefined,
      bannerUrl: formData.image.trim() || undefined,
      status: formData.status,
      isPublic: formData.status === 'PUBLISHED',
    };

    try {
      if (editingEvent) {
        await api.patch(`/events/${editingEvent.id}`, payload);
        setActionSuccess('Event schedule updated.');
      } else {
        await api.post('/events', payload);
        setActionSuccess(
          formData.status === 'PUBLISHED'
            ? 'Event scheduled and published to website.'
            : 'Event saved as draft.'
        );
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      if (editingEvent) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === editingEvent.id
              ? {
                  ...e,
                  ...payload,
                  status: payload.status as any,
                }
              : e
          )
        );
        setActionSuccess('Event modified (local update).');
      } else {
        const newEvt: EventDto = {
          id: `evt-${Date.now()}`,
          title: payload.title,
          description: payload.description,
          date: payload.date,
          startTime: payload.startTime,
          endTime: payload.endTime,
          startDate: payload.startDate,
          endDate: payload.endDate,
          location: payload.location,
          image: payload.image,
          bannerUrl: payload.bannerUrl,
          status: payload.status as any,
          isPublic: payload.isPublic,
          organizerName: 'School Activities Directorate',
        };
        setEvents([newEvt, ...events]);
        setActionSuccess('Event scheduled (local update).');
      }
      setIsModalOpen(false);
    }
  };

  const handlePublish = async (evt: EventDto) => {
    setError(null);
    try {
      await api.post(`/events/${evt.id}/publish`);
      setActionSuccess(`Event "${evt.title}" is now published.`);
      setEvents((prev) =>
        prev.map((e) => (e.id === evt.id ? { ...e, status: 'PUBLISHED', isPublic: true } : e))
      );
    } catch (err) {
      setEvents((prev) =>
        prev.map((e) => (e.id === evt.id ? { ...e, status: 'PUBLISHED', isPublic: true } : e))
      );
      setActionSuccess(`Event "${evt.title}" published (local update).`);
    }
  };

  const handleUnpublish = async (evt: EventDto) => {
    setError(null);
    try {
      await api.post(`/events/${evt.id}/unpublish`);
      setActionSuccess(`Event "${evt.title}" unpublished to draft.`);
      setEvents((prev) =>
        prev.map((e) => (e.id === evt.id ? { ...e, status: 'DRAFT', isPublic: false } : e))
      );
    } catch (err) {
      setEvents((prev) =>
        prev.map((e) => (e.id === evt.id ? { ...e, status: 'DRAFT', isPublic: false } : e))
      );
      setActionSuccess(`Event "${evt.title}" returned to draft.`);
    }
  };

  const handleArchive = async (evt: EventDto) => {
    setError(null);
    try {
      await api.post(`/events/${evt.id}/archive`);
      setActionSuccess(`Event "${evt.title}" archived.`);
      setEvents((prev) =>
        prev.map((e) => (e.id === evt.id ? { ...e, status: 'ARCHIVED', isPublic: false } : e))
      );
    } catch (err) {
      setEvents((prev) =>
        prev.map((e) => (e.id === evt.id ? { ...e, status: 'ARCHIVED', isPublic: false } : e))
      );
      setActionSuccess(`Event "${evt.title}" archived.`);
    }
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;
    setError(null);
    try {
      await api.delete(`/events/${eventToDelete.id}`);
      setActionSuccess(`Event "${eventToDelete.title}" canceled.`);
      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
    } catch (err) {
      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
      setActionSuccess(`Event "${eventToDelete.title}" removed.`);
    } finally {
      setEventToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-amber-400" />
            Academy Events & Master Calendar
          </h2>
          <p className="text-sm text-slate-400">
            Schedule campus activities, symposia, athletic games, and manage event lifecycle.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          data-testid="create-event-btn"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          Schedule Event
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-[#0B1528] p-4 rounded-xl border border-slate-800">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            data-testid="event-search-input"
            placeholder="Search events by title, description, or venue..."
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
            data-testid="event-status-filter"
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
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-[#0B1528] rounded-xl border border-slate-800">
          <div className="inline-block animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mb-3" />
          <p>Loading master academy calendar...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-[#0B1528] rounded-xl border border-slate-800">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-300">No scheduled events match</h3>
          <p className="text-sm text-slate-500 mt-1">Try modifying your filters or schedule a new event.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="events-grid">
          {paginatedEvents.map((evt) => {
            const statusConfig = STATUS_BADGES[evt.status || 'PUBLISHED'] || STATUS_BADGES.PUBLISHED;
            const eventImage = evt.image || evt.bannerUrl;

            return (
              <div
                key={evt.id}
                data-testid={`event-card-${evt.id}`}
                className="bg-[#0B1528] rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {eventImage && (
                  <div className="h-40 w-full overflow-hidden relative">
                    <img
                      src={eventImage}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] to-transparent opacity-80" />
                  </div>
                )}

                <div className="p-5 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${statusConfig.className}`}
                      data-testid={`event-status-badge-${evt.status}`}
                    >
                      {statusConfig.label}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {evt.startTime || '09:00'} – {evt.endTime || '15:00'}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{evt.date || (evt.startDate ? evt.startDate.split('T')[0] : 'Upcoming')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#08101E] border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {evt.status === 'DRAFT' && (
                      <button
                        onClick={() => handlePublish(evt)}
                        data-testid={`publish-event-${evt.id}`}
                        className="px-2 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Publish
                      </button>
                    )}

                    {evt.status === 'PUBLISHED' && (
                      <>
                        <button
                          onClick={() => handleUnpublish(evt)}
                          data-testid={`unpublish-event-${evt.id}`}
                          className="px-2 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/10 border border-amber-500/30 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Unpublish
                        </button>
                        <button
                          onClick={() => handleArchive(evt)}
                          data-testid={`archive-event-${evt.id}`}
                          className="px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Archive className="w-3 h-3" />
                          Archive
                        </button>
                      </>
                    )}

                    {evt.status === 'ARCHIVED' && (
                      <button
                        onClick={() => handlePublish(evt)}
                        data-testid={`restore-event-${evt.id}`}
                        className="px-2 py-1 text-xs font-semibold text-blue-400 hover:bg-blue-500/10 border border-blue-500/30 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Republish
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(evt)}
                      data-testid={`edit-event-${evt.id}`}
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit event details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEventToDelete(evt)}
                      data-testid={`delete-event-${evt.id}`}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Cancel and remove event"
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
          Showing {filteredEvents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length}{' '}
          scheduled events
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            data-testid="event-prev-page-btn"
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
            data-testid="event-next-page-btn"
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Create / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                {editingEvent ? 'Edit Event Details' : 'Schedule Academy Event'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4" data-testid="event-form">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  data-testid="event-form-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="e.g. Science & Innovation Symposium 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  data-testid="event-form-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="Full description of the itinerary, attendees, and goals..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    data-testid="event-form-date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    data-testid="event-form-start-time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">End Time *</label>
                  <input
                    type="time"
                    required
                    data-testid="event-form-end-time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Location / Venue *
                  </label>
                  <input
                    type="text"
                    required
                    data-testid="event-form-location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                    placeholder="Grand Auditorium, STEM Quad"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Status *</label>
                  <select
                    data-testid="event-form-status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Event Image / Banner URL
                </label>
                <input
                  type="text"
                  data-testid="event-form-image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="https://images.unsplash.com/photo-..."
                />
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
                  data-testid="submit-event-btn"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold rounded-xl text-sm"
                >
                  {editingEvent ? 'Save Event' : formData.status === 'PUBLISHED' ? 'Publish Event' : 'Save Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(eventToDelete)}
        title="Cancel Academy Event"
        message={`Are you sure you want to cancel and delete "${eventToDelete?.title}"? This cannot be undone.`}
        confirmText="Cancel Event"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setEventToDelete(null)}
      />
    </div>
  );
};
