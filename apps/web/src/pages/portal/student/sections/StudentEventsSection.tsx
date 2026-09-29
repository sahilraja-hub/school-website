import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface StudentEventsSectionProps {
  events: any[];
  loading?: boolean;
}

export const StudentEventsSection: React.FC<StudentEventsSectionProps> = ({
  events,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rsvpList, setRsvpList] = useState<string[]>([]);

  const displayEvents =
    events.length > 0
      ? events
      : [
          {
            id: 'evt-001',
            title: 'Oakridge Invitational Mathematics Olympiad 2026',
            category: 'ACADEMIC',
            startDate: '2026-10-24T09:00:00Z',
            endDate: '2026-10-24T14:00:00Z',
            location: 'Main Academic Pavilion, Room 401',
            description:
              'Regional inter-school mathematical competition for senior scholars. Featuring individual written rounds and fast-paced team problem-solving relays.',
          },
          {
            id: 'evt-002',
            title: 'Varsity Soccer Championship vs. St. Jude’s Academy',
            category: 'SPORTS',
            startDate: '2026-10-28T15:30:00Z',
            endDate: '2026-10-28T17:30:00Z',
            location: 'Oakridge Athletic Stadium',
            description:
              'Cheer for the Oakridge Golden Eagles in the district semifinal matchup. Student spirit section admission is complimentary with student badge.',
          },
          {
            id: 'evt-003',
            title: 'Autumn Philharmonic Symphony & Choral Showcase',
            category: 'ARTS',
            startDate: '2026-11-04T18:00:00Z',
            endDate: '2026-11-04T20:30:00Z',
            location: 'Centennial Performing Arts Hall',
            description:
              'An evening of classical masterworks and contemporary compositions performed by the Oakridge Symphony Orchestra and Honors Vocal Ensemble.',
          },
        ];

  const filtered = displayEvents.filter(
    (e) =>
      (e.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRsvp = (id: string) => {
    setRsvpList((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn" data-testid="student-events-section">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-crest-700" />
            Campus Events & Extracurriculars
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Upcoming academic competitions, athletic fixtures, and cultural performances
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campus events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-crest-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Events Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((event, idx) => {
            const hasRsvp = rsvpList.includes(event.id);
            const dateObj = new Date(event.startDate);
            const dateStr = dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const timeStr = dateObj.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={event.id || idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-crest-800 bg-crest-50 px-2.5 py-0.5 rounded">
                      {event.category || 'CAMPUS'}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-semibold">{dateStr}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-slate-900 leading-snug">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-1.5 pt-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-crest-700 shrink-0" />
                      <span>{timeStr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{event.location || 'Oakridge Main Campus'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleRsvp(event.id)}
                    className={`w-full py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                      hasRsvp
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-crest-900 text-white hover:bg-crest-950'
                    }`}
                  >
                    {hasRsvp ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Added to My Calendar
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-gold-400" /> RSVP & Attend
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs sm:text-sm">
            No campus events found matching "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  );
};
