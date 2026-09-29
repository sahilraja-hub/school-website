import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Users,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  category?: string;
}

interface ParentEventsSectionProps {
  events: EventItem[];
  loading?: boolean;
}

export const ParentEventsSection: React.FC<ParentEventsSectionProps> = ({
  events,
  loading,
}) => {
  const [rsvpdEvents, setRsvpdEvents] = useState<Record<string, boolean>>({});

  // Fallback demo events
  const defaultEvents: EventItem[] = [
    {
      id: 'evt-01',
      title: 'Oakridge Annual Athletics Gala & Track Meet',
      description:
        'Inter-house athletic track competitions, relays, and field events. Complimentary family pavilion seating and catering available.',
      date: '2026-10-24',
      time: '09:00 AM – 03:30 PM',
      location: 'Oakridge Olympic Athletics Track & Sports Complex',
      category: 'Sports',
    },
    {
      id: 'evt-02',
      title: 'Autumn Symphony & Chamber Orchestra Recital',
      description:
        'An evening of classical and contemporary orchestral performances featuring the Oakridge Senior String Quartet and Concert Choir.',
      date: '2026-11-06',
      time: '06:30 PM – 08:30 PM',
      location: 'Grand Performing Arts Concert Hall',
      category: 'Arts & Culture',
    },
    {
      id: 'evt-03',
      title: 'Parent-Teacher Association (PTA) General Body Assembly',
      description:
        'Quarterly trustee and parental meeting reviewing campus infrastructure development, academic curriculum enhancements, and elective offerings.',
      date: '2026-11-20',
      time: '04:00 PM – 05:45 PM',
      location: 'Memorial Library Auditorium / Zoom Hybrid',
      category: 'Community',
    },
    {
      id: 'evt-04',
      title: 'Winter Science & Artificial Intelligence Symposium',
      description:
        'Senior scholars present their original scientific research papers and AI robotics prototypes to university faculty and industry adjudicators.',
      date: '2026-12-04',
      time: '10:00 AM – 02:00 PM',
      location: 'Turing Science & Computing Pavilion',
      category: 'Academic',
    },
  ];

  const displayEvents = events.length > 0 ? events : defaultEvents;

  const toggleRsvp = (id: string) => {
    setRsvpdEvents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-8" data-testid="parent-events-section">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-500" />
            <span>Campus Events & Community Calendar</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key calendar dates, athletic competitions, symphonies, and parental symposiums.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayEvents.map((evt) => {
          const isRsvpd = rsvpdEvents[evt.id];
          return (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-crest-300 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start gap-3">
                  <span className="text-[10px] uppercase font-bold text-crest-800 bg-crest-50 px-2.5 py-0.5 rounded border border-crest-100">
                    {evt.category || 'School Event'}
                  </span>

                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(evt.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-slate-900 mt-2.5">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div className="space-y-1.5 text-slate-500">
                  {evt.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-crest-700" />
                      <span>{evt.time}</span>
                    </div>
                  )}
                  {evt.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gold-500" />
                      <span>{evt.location}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => toggleRsvp(evt.id)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      isRsvpd
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {isRsvpd ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>RSVP Confirmed (Calendar Sync Active)</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>RSVP / Add to Family Calendar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
