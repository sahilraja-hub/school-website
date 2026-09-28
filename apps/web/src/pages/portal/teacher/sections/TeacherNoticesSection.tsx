import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  Info,
  Sparkles,
  ChevronRight,
  X,
  FileText,
} from 'lucide-react';
import { api } from '../../../../services/api';

interface NoticeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  publishedAt: string;
  authorName?: string;
  isImportant?: boolean;
}

export const TeacherNoticesSection: React.FC = () => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const res = await api.get('/notices');
        if (res.data.success) {
          setNotices(res.data.data);
        }
      } catch {
        setNotices([
          {
            id: 'not-001',
            title: 'Mid-Term Grade Submission Window & Compliance Notice',
            content:
              'All secondary school faculty members are kindly reminded that midterm evaluation marks and qualitative feedback must be submitted into the Institutional Gradebook by Friday, October 24 at 17:00 EST. Department chairs will convene on Monday to review academic performance benchmarks.',
            category: 'ACADEMIC',
            publishedAt: '2026-09-28',
            authorName: 'Academic Directorate',
            isImportant: true,
          },
          {
            id: 'not-002',
            title: 'STEM Laboratory Safety Audit & Equipment Servicing',
            content:
              'The Department of Facilities and Scientific Infrastructure will be conducting scheduled maintenance in physics and chemistry labs this Saturday. Instructors are advised to secure all chemical reagents and specialized optical apparatus.',
            category: 'FACULTY',
            publishedAt: '2026-09-25',
            authorName: 'Facilities Management',
            isImportant: false,
          },
          {
            id: 'not-003',
            title: 'Annual Oakridge Science Fair — Faculty Mentorship Call',
            content:
              'Nominations are now open for student project mentorship in the 2027 Annual STEM Exposition. Interested faculty members should register their research themes with the STEM Committee by end of this week.',
            category: 'GENERAL',
            publishedAt: '2026-09-20',
            authorName: 'Office of the Principal',
            isImportant: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter((n) => {
    const matchesCat = !categoryFilter || n.category === categoryFilter;
    const matchesSearch =
      !searchTerm ||
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Faculty Circulars & Notices</h2>
          <p className="text-xs text-slate-400 mt-1">
            Institutional announcements, academic circulars, and departmental directives.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#0B1528] border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
          >
            <option value="">All Categories</option>
            <option value="ACADEMIC">Academic</option>
            <option value="FACULTY">Faculty</option>
            <option value="EXAMINATION">Examinations</option>
            <option value="GENERAL">General</option>
          </select>

          {/* Search */}
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0B1528] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((n) => (
          <div
            key={n.id}
            onClick={() => setActiveNotice(n)}
            className="p-5 rounded-2xl bg-[#0B1528]/90 border border-white/10 hover:border-amber-400/30 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  n.isImportant
                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                }`}
              >
                <Bell className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 border border-white/10 text-slate-300">
                    {n.category || 'ACADEMIC'}
                  </span>
                  {n.isImportant && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      Priority Notice
                    </span>
                  )}
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {n.publishedAt || '2026-09-28'}
                  </span>
                </div>

                <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition">
                  {n.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {n.content}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center text-xs text-amber-400 group-hover:translate-x-1 transition font-medium whitespace-nowrap">
              Read Directive
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Notice Reader Modal */}
      {activeNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  {activeNotice.category}
                </span>
                <span className="text-xs text-slate-400">{activeNotice.publishedAt}</span>
              </div>
              <button
                onClick={() => setActiveNotice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-serif font-bold text-white leading-snug">
              {activeNotice.title}
            </h3>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 leading-relaxed space-y-3">
              <p>{activeNotice.content}</p>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-400 border-t border-white/10">
              <span>Issued by: <strong className="text-white">{activeNotice.authorName || 'Oakridge Administration'}</strong></span>
              <button
                onClick={() => setActiveNotice(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
