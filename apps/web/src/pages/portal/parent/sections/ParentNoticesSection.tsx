import React, { useState } from 'react';
import {
  Bell,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';

interface NoticeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  priority?: 'HIGH' | 'NORMAL' | 'URGENT';
}

interface ParentNoticesSectionProps {
  notices: NoticeItem[];
  loading?: boolean;
}

export const ParentNoticesSection: React.FC<ParentNoticesSectionProps> = ({
  notices,
  loading,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Fallback demo circulars if none from API
  const defaultNotices: NoticeItem[] = [
    {
      id: 'not-01',
      title: 'Annual Parent-Teacher Academic Conference Schedule & Booking',
      content:
        'Appointments are now open for the Autumn Term Parent-Teacher Consultations. Parents may reserve dedicated 15-minute consultations with homeroom faculty and subject mentors via the portal.',
      category: 'Academic',
      date: '2026-10-10',
      priority: 'HIGH',
    },
    {
      id: 'not-02',
      title: 'STEM Innovation Fair & Robotics Showcase — Family Invitation',
      content:
        'All Oakridge families and guardians are warmly invited to attend the 2026 STEM & Innovation Exhibition in the Main Auditorium on Friday, November 14th.',
      category: 'Events',
      date: '2026-10-08',
      priority: 'NORMAL',
    },
    {
      id: 'not-03',
      title: 'Spring 2027 Advance Term Tuition Schedule & Bursar Notices',
      content:
        'The Bursar Office has published billing statements for Spring 2027. Sibling discounts and early settlement benefits will apply for transactions completed before January 15, 2027.',
      category: 'Finance',
      date: '2026-10-05',
      priority: 'NORMAL',
    },
    {
      id: 'not-04',
      title: 'Campus Winter Uniform Transition Protocols & Guidelines',
      content:
        'Beginning November 1st, all scholars will transition into the official formal winter blazer and tie attire. Uniform fittings are available at the Oakridge Campus Store.',
      category: 'Administrative',
      date: '2026-10-01',
      priority: 'NORMAL',
    },
  ];

  const displayNotices = notices.length > 0 ? notices : defaultNotices;

  const categories = ['ALL', 'Academic', 'Finance', 'Events', 'Administrative'];

  const filteredNotices = displayNotices.filter((notice) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      notice.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      notice.title.toLowerCase().includes(search.toLowerCase()) ||
      notice.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8" data-testid="parent-notices-section">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-crest-700" /> Circulars & Official Announcements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional communications, holiday notices, and administrative updates for Oakridge families.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-crest-600 transition"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-crest-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-crest-800 bg-crest-50 px-2 py-0.5 rounded border border-crest-100">
                  {notice.category}
                </span>
                {notice.priority === 'HIGH' && (
                  <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Important Notice
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(notice.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h3 className="font-serif font-bold text-base text-slate-900">{notice.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
