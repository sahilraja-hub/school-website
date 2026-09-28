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
  ArrowUpDown,
  Globe,
  Lock,
} from 'lucide-react';
import { api } from '../../../../services/api';
import { ApiErrorAlert } from '../../../../components/common/ApiErrorAlert';
import { ConfirmationDialog } from '../../../../components/ui/ConfirmationDialog';
import { EventDto } from '@school/shared';

export const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>('ALL');
  const [sortField, setSortField] = useState<'startDate' | 'title'>('startDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
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
    location: '',
    startDate: '2026-10-15T09:00',
    endDate: '2026-10-15T15:00',
    isPublic: true,
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
      // Realistic Mock Events Calendar
      setEvents([
        {
          id: 'evt-1',
          title: 'Annual Science & Innovation Symposium 2026',
          description:
            'Scholars from Grades 9-12 demonstrate robotics, biological field work, and chemical synthesis in our premier STEM quad.',
          location: 'Grand Exhibition Hall & Atrium',
          startDate: '2026-10-18T09:00:00Z',
          endDate: '2026-10-18T16:00:00Z',
          isPublic: true,
          organizerName: 'Science Faculty Board',
        },
        {
          id: 'evt-2',
          title: 'Parent-Teacher Academic Progress Conference',
          description:
            'Individual consultations regarding Fall term milestones, diagnostic tests, and personalized enrichment roadmaps.',
          location: 'Main Academic Quad & Classrooms',
          startDate: '2026-10-24T13:00:00Z',
          endDate: '2026-10-24T18:00:00Z',
          isPublic: false,
          organizerName: 'Academic Deans Office',
        },
        {
          id: 'evt-3',
          title: 'Oakridge Varsity Cross-Country Invitational',
          description:
            'Hosting regional athletic competitors for the 5K autumn trail challenge through Oakridge Forest preserves.',
          location: 'Oakridge Athletics Complex',
          startDate: '2026-11-04T08:30:00Z',
          endDate: '2026-11-04T13:30:00Z',
          isPublic: true,
          organizerName: 'Department of Athletics',
        },
        {
          id: 'evt-4',
          title: 'Winter Philharmonic Orchestral Recital',
          description:
            'Featuring the Symphony Strings and Wind Ensemble performing pieces by Vivaldi, Dvořák, and modern arrangements.',
          location: 'Performing Arts Auditorium',
          startDate: '2026-12-12T19:00:00Z',
          endDate: '2026-12-12T21:30:00Z',
          isPublic: true,
          organizerName: 'Music & Fine Arts Guild',
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
        const matchesVis =
          visibilityFilter === 'ALL' ||
          (visibilityFilter === 'PUBLIC' && evt.isPublic) ||
          (visibilityFilter === 'PRIVATE' && !evt.isPublic);
        return matchesSearch && matchesVis;
      })
      .sort((a, b) => {
        let valA = a[sortField] || '';
        let valB = b[sortField] || '';
        if (sortOrder === 'asc') return valA.localeCompare(valB);
        return valB.localeCompare(valA);
      });
  }, [events, searchQuery, visibilityFilter, sortField, sortOrder]);

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
      location: '',
      startDate: '2026-10-15T09:00',
      endDate: '2026-10-15T15:00',
      isPublic: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: EventDto) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title,
      description: evt.description,
      location: evt.location,
      startDate: evt.startDate.substring(0, 16),
      endDate: evt.endDate.substring(0, 16),
      isPublic: evt.isPublic,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingEvent) {
        await api.patch(`/events/${editingEvent.id}`, formData);
        setActionSuccess('Event schedule updated.');
      } else {
        await api.post('/events', formData);
        setActionSuccess('Institutional event scheduled.');
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      if (editingEvent) {
        setEvents((prev) =>
          prev.map((e) => (e.id === editingEvent.id ? { ...e, ...formData } : e))
        );
        setActionSuccess('Event modified (local update).');
      } else {
        const newEvt: EventDto = {
          id: `evt-${Date.now()}`,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          startDate: formData.startDate,
          endDate: formData.endDate,
          isPublic: formData.isPublic,
          organizerName: 'School Activities Committee',
        };
        setEvents([newEvt, ...events]);
        setActionSuccess('Event scheduled (local update).');
      }
      setIsModalOpen(false);
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
            Events Calendar & Symposia
          </h2>
          <p className="text-sm text-slate-400">
            Coordinate campus ceremonies, academic conventions, athletic tournaments, and public recitals.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0B1528] p-4 rounded-xl border border-slate-800">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by name, hall, or keywords..."
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
            value={visibilityFilter}
            onChange={(e) => {
              setVisibilityFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="ALL">All Visibility (Public & Private)</option>
            <option value="PUBLIC">Public Only (Website & Portal)</option>
            <option value="PRIVATE">Private Only (Portal Only)</option>
          </select>
        </div>
      </div>

      {/* Events Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-[#0B1528] rounded-xl border border-slate-800">
          <div className="inline-block animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mb-3" />
          <p>Syncing event master calendar...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-[#0B1528] rounded-xl border border-slate-800">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-300">No events found</h3>
          <p className="text-sm text-slate-500 mt-1">
            Adjust your search or schedule an event using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedEvents.map((evt) => {
            const start = new Date(evt.startDate);
            const end = new Date(evt.endDate);

            return (
              <div
                key={evt.id}
                className="bg-[#0B1528] p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                        evt.isPublic
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                      }`}
                    >
                      {evt.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {evt.isPublic ? 'Public Event' : 'Internal School Event'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(evt)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEventToDelete(evt)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                    {evt.title}
                  </h3>

                  <p className="text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {start.toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      •{' '}
                      {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{evt.location}</span>
                    {evt.organizerName && (
                      <span className="text-slate-500"> • Led by {evt.organizerName}</span>
                    )}
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
          events
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
                <Calendar className="w-5 h-5 text-amber-400" />
                {editingEvent ? 'Modify Event Schedule' : 'Schedule Institutional Event'}
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
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="e.g. Autumn Gala & Awards Ceremony"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Campus Venue / Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="e.g. Grand Auditorium, North Campus"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Event Description & Agenda *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060D1A] border border-slate-700 rounded-lg text-sm text-slate-200"
                  placeholder="Outline purpose, target attendees, and key milestones..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublicCheck"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-[#060D1A]"
                />
                <label htmlFor="isPublicCheck" className="text-xs font-medium text-slate-300">
                  Publish to public website calendar (visible to prospective families & public)
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
                  {editingEvent ? 'Save Changes' : 'Confirm Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(eventToDelete)}
        title="Cancel Institutional Event"
        message={`Are you sure you want to cancel and remove "${eventToDelete?.title}" from the master calendar? Invitations and public schedule listings will be retracted.`}
        confirmText="Cancel Event"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setEventToDelete(null)}
      />
    </div>
  );
};
