import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Pin, Filter, Search, User } from 'lucide-react';
import { api } from '../../services/api';
import { Announcement } from '@school/shared';

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/announcements');
        if (res.data.success) {
          setAnnouncements(res.data.data);
        }
      } catch (err) {
        // Fallback demo data
        setAnnouncements([
          {
            id: '1',
            title: 'Annual STEM & Robotics Innovation Expo 2026',
            content: 'We are thrilled to announce the 2026 Oakridge STEM Expo on November 14th. Over 40 student-led research initiatives, competitive AI models, and robotics demonstrations will be showcased in the Grand Hall.',
            category: 'EVENT',
            isPinned: true,
            authorId: 'admin',
            authorName: 'Principal Harrison',
            targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
            publishDate: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Fall Semester Mid-Term Examination Schedule Released',
            content: 'The official schedule for mid-term assessments is now published on student and parent portals. Please review examination hall assignments and preparation guidelines.',
            category: 'ACADEMIC',
            isPinned: true,
            authorId: 'admin',
            authorName: 'Principal Harrison',
            targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
            publishDate: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '3',
            title: 'Varsity Soccer Team Advances to State Quarterfinals!',
            content: 'Congratulations to our varsity soccer team for a thrilling 3-1 victory yesterday! The quarterfinal match will be hosted this Saturday at the West Campus Athletic Complex.',
            category: 'SPORTS',
            isPinned: false,
            authorId: 'teacher2',
            authorName: 'Sarah Jenkins',
            targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
            publishDate: new Date(Date.now() - 172800000).toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const categories = ['ALL', 'ACADEMIC', 'EVENT', 'SPORTS', 'URGENT', 'GENERAL'];

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesCategory = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-crest-600 bg-crest-50 px-3 py-1 rounded-full border border-crest-100">
            School Bulletin
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
            Announcements & Circulars
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Stay informed on upcoming academic schedules, athletic events, and campus community alerts.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-crest-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search circulars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-crest-500"
            />
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No circulars match your current filter.</p>
            </div>
          ) : (
            filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-6 border transition-all ${
                  item.isPinned ? 'border-gold-300 shadow-sm bg-gradient-to-r from-gold-50/20 via-white to-white' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {item.isPinned && (
                      <span className="flex items-center gap-1 bg-gold-100 text-gold-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gold-300">
                        <Pin className="w-3 h-3 text-gold-600 rotate-45" /> PINNED
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.category === 'ACADEMIC'
                          ? 'bg-blue-100 text-blue-800'
                          : item.category === 'EVENT'
                          ? 'bg-purple-100 text-purple-800'
                          : item.category === 'SPORTS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {item.authorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.publishDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.content}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Audience:</span>
                  {item.targetRoles?.map((r) => (
                    <span key={r} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
