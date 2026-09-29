import React, { useState } from 'react';
import {
  Bell,
  Search,
  Calendar,
  Filter,
  FileText,
  User,
  X,
  ExternalLink,
} from 'lucide-react';

interface StudentNoticesSectionProps {
  notices: any[];
  loading?: boolean;
}

export const StudentNoticesSection: React.FC<StudentNoticesSectionProps> = ({
  notices,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const displayNotices =
    notices.length > 0
      ? notices
      : [
          {
            id: 'not-001',
            title: 'Mid-Term Examination Schedule & Hall Tickets Release',
            category: 'EXAMINATION',
            publishDate: '2026-10-01',
            author: 'Dean of Academic Affairs',
            targetAudience: 'ALL_STUDENTS',
            content:
              'The Mid-Term examination schedule for Grade 9 through 12 has been published. All scholars must download their verified hall tickets and check their designated examination room numbers. Strict adherence to the academic honor code is required.',
          },
          {
            id: 'not-002',
            title: 'Annual Oakridge STEM & Innovation Fair 2026',
            category: 'EVENT',
            publishDate: '2026-10-05',
            author: 'Science Department',
            targetAudience: 'ALL_STUDENTS',
            content:
              'Submissions for the Annual STEM Fair are now open! Scholars wishing to demonstrate projects in Robotics, Artificial Intelligence, and Biochemical Sciences must submit their project abstracts before October 25.',
          },
          {
            id: 'not-003',
            title: 'Library Extended Hours for Term Assessments',
            category: 'ACADEMIC',
            publishDate: '2026-10-08',
            author: 'Chief Librarian',
            targetAudience: 'ALL_STUDENTS',
            content:
              'The campus library and study commons will remain open until 8:00 PM on weekdays throughout the examination period. Peer tutoring sessions will be conducted daily in Seminar Room 2.',
          },
        ];

  const filtered = displayNotices.filter((n) => {
    const matchesSearch =
      (n.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'ALL' || (n.category || '').toUpperCase() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fadeIn" data-testid="student-notices-section">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-gold-600" />
            Official Notices & Bulletins
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Administrative circulars, academic notices, and institutional announcements
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {['ALL', 'ACADEMIC', 'EXAMINATION', 'EVENT'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  categoryFilter === cat
                    ? 'bg-crest-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-crest-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((notice, idx) => (
            <div
              key={notice.id || idx}
              onClick={() => setSelectedNotice(notice)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:border-gold-300 transition cursor-pointer space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-crest-800 bg-crest-50 px-2.5 py-0.5 rounded">
                  {notice.category || 'CIRCULAR'}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {notice.publishDate ? new Date(notice.publishDate).toLocaleDateString() : 'October 2026'}
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-slate-900">
                {notice.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {notice.content}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Issued by: <strong className="text-slate-700">{notice.author || 'Administration'}</strong></span>
                <span className="text-crest-700 font-semibold hover:underline">Read Full Notice &rarr;</span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs sm:text-sm">
            No circulars found matching your search.
          </div>
        )}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-crest-700 bg-crest-50 px-2.5 py-0.5 rounded">
                  {selectedNotice.category || 'CIRCULAR'}
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mt-2">
                  {selectedNotice.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span>Published: {new Date(selectedNotice.publishDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Issued by: {selectedNotice.author || 'Administration'}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {selectedNotice.content}
            </div>

            <button
              onClick={() => setSelectedNotice(null)}
              className="w-full py-2.5 rounded-xl bg-crest-900 text-white font-semibold text-xs hover:bg-crest-950 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
