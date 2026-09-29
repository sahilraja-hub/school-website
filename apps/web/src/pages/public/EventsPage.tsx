import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  Card,
  CardContent,
  Badge,
  Button,
  useToast,
  EmptyState,
} from '../../components/ui';
import { SEO } from '../../components/common/SEO';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  ArrowRight,
  Bookmark,
  Share2,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../services/api';

interface SchoolEvent {
  id: string;
  title: string;
  category: 'Academic' | 'Athletics' | 'Arts' | 'Admissions';
  date: { day: string; month: string; year: string };
  time: string;
  location: string;
  audience: string;
  description: string;
  featured?: boolean;
}

const mockEvents: SchoolEvent[] = [
  {
    id: 'ev-1',
    title: 'Fall 2026 Admissions Open House & Campus Showcase',
    category: 'Admissions',
    date: { day: '14', month: 'OCT', year: '2026' },
    time: '9:00 AM – 1:30 PM PST',
    location: 'Founder’s Hall & Cambridge Quad',
    audience: 'Prospective Families & Candidates',
    description: 'Executive briefing with Dr. Eleanor Vance, faculty department panel discussions, guided student-led campus tours, and STEM lab interactive demonstrations.',
    featured: true,
  },
  {
    id: 'ev-2',
    title: 'Annual Regional High School Robotics Invitational',
    category: 'Academic',
    date: { day: '22', month: 'OCT', year: '2026' },
    time: '10:00 AM – 4:00 PM PST',
    location: 'Alexander STEM Engineering Center',
    audience: 'Open to Public & All Students',
    description: 'Over 24 school teams compete in autonomous robotics obstacle navigation, tele-operated challenges, and engineering design notebook presentations.',
    featured: true,
  },
  {
    id: 'ev-3',
    title: 'Oakridge Philharmonia Symphony Autumn Gala Concert',
    category: 'Arts',
    date: { day: '05', month: 'NOV', year: '2026' },
    time: '7:00 PM – 9:15 PM PST',
    location: 'Performing Arts Auditorium',
    audience: 'Academy Families & Alumni',
    description: 'Conducted by Maestro Julian Hayes featuring works by Dvořák, Tchaikovsky, and original orchestral compositions composed by our IB Music scholars.',
  },
  {
    id: 'ev-4',
    title: 'Homecoming Varsity Football Game & Alumni Tailgate',
    category: 'Athletics',
    date: { day: '12', month: 'NOV', year: '2026' },
    time: '6:30 PM Kickoff PST',
    location: 'Championship Athletics Stadium',
    audience: 'Students, Alumni & Supporters',
    description: 'The Oakridge Lions take on the St. Jude Titans in our historic annual rivalry match under stadium floodlights. Halftime drumline showcase.',
  },
  {
    id: 'ev-5',
    title: 'Upper-School Model United Nations Plenary Assembly',
    category: 'Academic',
    date: { day: '20', month: 'NOV', year: '2026' },
    time: '8:30 AM – 3:00 PM PST',
    location: 'Alexander Media Library Conference Suite',
    audience: 'Grades 9-12 Delegates',
    description: 'Student delegates represent 45 member states debating international environmental treaties, sovereign digital rights, and global refugee assistance programs.',
  },
  {
    id: 'ev-6',
    title: 'Term I Parent-Teacher Academic Progress Consultations',
    category: 'Academic',
    date: { day: '02', month: 'DEC', year: '2026' },
    time: '8:00 AM – 5:00 PM PST',
    location: 'Virtual Zoom & On-Campus Suites',
    audience: 'Registered Parents & Guardians',
    description: 'One-on-one 15-minute consultations with faculty subject specialists to review Term I academic assessments, homework mastery, and growth plans.',
  },
];

export const EventsPage: React.FC = () => {
  const [allEvents, setAllEvents] = useState<SchoolEvent[]>(mockEvents);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [savedEvents, setSavedEvents] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchLiveEvents = async () => {
      try {
        const res = await api.get('/events');
        if (isMounted && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
          const mapped: SchoolEvent[] = res.data.data.map((e: any) => {
            const dateObj = new Date(e.date || e.startDate || Date.now());
            return {
              id: e.id,
              title: e.title,
              category: (e.category as any) || 'Academic',
              date: {
                day: String(dateObj.getDate()).padStart(2, '0'),
                month: months[dateObj.getMonth()] || 'OCT',
                year: String(dateObj.getFullYear()),
              },
              time: `${e.startTime || '09:00'} – ${e.endTime || '15:00'} PST`,
              location: e.location || 'Campus Grounds',
              audience: 'Open to Public & All Scholars',
              description: e.description || '',
              featured: Boolean(e.featured),
            };
          });
          setAllEvents(mapped);
        }
      } catch (err) {
        // Fallback to initial mockEvents on error
      }
    };
    fetchLiveEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { id: 'ALL', label: 'All Calendar Events' },
    { id: 'Admissions', label: 'Admissions & Tours' },
    { id: 'Academic', label: 'Academic & STEM' },
    { id: 'Arts', label: 'Arts & Music' },
    { id: 'Athletics', label: 'Athletics & Games' },
  ];

  const filteredEvents = selectedCategory === 'ALL'
    ? allEvents
    : allEvents.filter((e) => e.category === selectedCategory);

  const toggleSaveEvent = (id: string, title: string) => {
    if (savedEvents.includes(id)) {
      setSavedEvents(savedEvents.filter((item) => item !== id));
      toast({ type: 'info', message: `Removed "${title}" from your saved calendar.` });
    } else {
      setSavedEvents([...savedEvents, id]);
      toast({ type: 'success', title: 'Event Saved', message: `"${title}" has been pinned to your reminders.` });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <SEO
        title="School Calendar & Upcoming Events"
        description="Stay updated with Oakridge International Academy events: Admissions Open House, STEM Robotics tournaments, concerts, athletics games, and parent conferences."
        keywords="Oakridge events, school calendar, open house, academic events, athletics schedule"
      />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Campus Life', href: '/about' },
            { label: 'Upcoming Events Calendar' },
          ]}
        />

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-crest-950 text-white p-8 sm:p-12 lg:p-14 border border-crest-900 shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold" size="sm">Academic Year 2026-2027</Badge>
              <Badge variant="outline" size="sm" className="text-crest-200 border-crest-700">
                Official Calendar
              </Badge>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Campus Calendar & Community Events
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Discover lectures, theatrical performances, athletics meets, and admissions forums that define student life at Oakridge. Filter by category or pin events directly to your schedule.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === c.id
                  ? 'bg-crest-700 text-white shadow-card'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Event List */}
        {filteredEvents.length > 0 ? (
          <div className="space-y-6">
            {filteredEvents.map((evt) => {
              const isSaved = savedEvents.includes(evt.id);
              return (
                <div
                  key={evt.id}
                  className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all duration-200 shadow-card hover:shadow-elevated flex flex-col md:flex-row gap-6 items-start md:items-center justify-between ${
                    evt.featured ? 'border-l-8 border-l-gold-500 border-slate-200' : 'border-slate-200'
                  }`}
                >
                  {/* Left: Date Badge */}
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-24 rounded-2xl bg-crest-50 border border-crest-100 text-crest-900 flex flex-col items-center justify-center shrink-0 shadow-subtle text-center">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-crest-600">
                        {evt.date.month}
                      </span>
                      <span className="font-serif text-3xl font-bold leading-none">
                        {evt.date.day}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {evt.date.year}
                      </span>
                    </div>

                    {/* Middle: Content */}
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            evt.category === 'Admissions'
                              ? 'gold'
                              : evt.category === 'Academic'
                              ? 'primary'
                              : evt.category === 'Athletics'
                              ? 'success'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {evt.category}
                        </Badge>
                        {evt.featured && (
                          <span className="text-[11px] font-bold text-gold-600 uppercase tracking-wider">
                            ★ Featured Event
                          </span>
                        )}
                        <span className="text-xs text-slate-400">• {evt.audience}</span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                        {evt.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {evt.description}
                      </p>

                      {/* Details row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-crest-600" /> {evt.time}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-crest-600" /> {evt.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2.5 w-full md:w-auto justify-end pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <Button
                      variant={isSaved ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => toggleSaveEvent(evt.id, evt.title)}
                      leftIcon={<Bookmark className="w-3.5 h-3.5" />}
                    >
                      {isSaved ? 'Saved' : 'Remind Me'}
                    </Button>
                    <Link to="/contact">
                      <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        RSVP
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Events Found in Category"
            description="There are currently no events listed under this filter. View all upcoming events to see scheduled activities."
            action={
              <Button variant="outline" size="sm" onClick={() => setSelectedCategory('ALL')}>
                View All Events
              </Button>
            }
          />
        )}

        {/* Subscribe Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
          <div className="space-y-2 max-w-xl text-left">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">Never Miss a Date</span>
            <h3 className="font-serif text-2xl font-bold">Synchronize with Google or iCal</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Subscribe to the real-time Oakridge Academy master calendar directly onto your mobile or desktop calendar feed.
            </p>
          </div>
          <Button
            variant="gold"
            onClick={() =>
              toast({
                type: 'success',
                title: 'Calendar Feed Connected',
                message: 'WebCal subscription link generated for your calendar app.',
              })
            }
            leftIcon={<Calendar className="w-4 h-4" />}
          >
            Export .ICS Subscription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
