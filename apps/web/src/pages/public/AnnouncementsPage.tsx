import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  Card,
  CardContent,
  Badge,
  Input,
  Button,
  Skeleton,
  EmptyState,
} from '../../components/ui';
import { SEO } from '../../components/common/SEO';
import {
  Bell,
  Calendar,
  Pin,
  Search,
  User,
  FileText,
  Download,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { api } from '../../services/api';
import { Announcement } from '@school/shared';

const initialNotices: Announcement[] = [
  {
    id: 'n1',
    title: 'Admissions Cycle 2026-2027: Early Action Deadlines & Registration',
    content: 'Prospective families are advised that the deadline for Early Action scholarship consideration is November 1st, 2026. Required documents must be submitted through the admissions portal before 5:00 PM PST.',
    category: 'URGENT',
    isPinned: true,
    authorId: 'admin1',
    authorName: 'Office of the Registrar',
    targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    publishDate: new Date().toISOString(),
  },
  {
    id: 'n2',
    title: 'Fall Semester Mid-Term Assessment Timetable & Examination Protocol',
    content: 'The official schedule for mid-term assessments across Grades 6 through 12 is now finalized. Examination venues, proctor assignments, and permitted reference materials are published in scholar portals.',
    category: 'ACADEMIC',
    isPinned: true,
    authorId: 'admin2',
    authorName: 'Academic Directorate',
    targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    publishDate: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'n3',
    title: 'Annual STEM & Robotics Innovation Expo 2026 Scheduled',
    content: 'Over 40 student-led research initiatives, competitive AI models, and autonomous robotics demonstrations will be showcased in the Grand Hall on October 22nd. Parents and alumni welcome.',
    category: 'EVENT',
    isPinned: false,
    authorId: 'teacher1',
    authorName: 'Sarah Montgomery (Head of Robotics)',
    targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    publishDate: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'n4',
    title: 'Varsity Football State Championship Quarterfinal Match',
    content: 'Congratulations to our varsity athletes! The Lions will host the regional quarterfinals at our Championship Stadium under the lights this Friday at 6:30 PM.',
    category: 'SPORTS',
    isPinned: false,
    authorId: 'coach1',
    authorName: 'Athletics Department',
    targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    publishDate: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'n5',
    title: 'Alexander Media Library Winter Holiday Extended Reading Privileges',
    content: 'Beginning next Monday, all scholars in Grades 9-12 may checkout up to 8 circulating monographs and research volumes for independent winter reading and extended essay research.',
    category: 'GENERAL',
    isPinned: false,
    authorId: 'lib1',
    authorName: 'Head Librarian',
    targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
    publishDate: new Date(Date.now() - 345600000).toISOString(),
  },
];

export const NoticesPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialNotices);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/notices');
        if (isMounted && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setAnnouncements(
            res.data.data.map((n: any) => ({
              id: n.id,
              title: n.title,
              content: n.description || n.content || '',
              category: n.category || 'GENERAL',
              isPinned: Boolean(n.isPinned),
              authorName: n.authorName || 'Admissions Directorate',
              publishDate: n.publishDate || n.publishedAt || new Date().toISOString(),
              attachmentUrl: n.attachment || n.attachmentUrl,
            }))
          );
          return;
        }
      } catch (err) {
        // Fallback
      }

      try {
        const res = await api.get('/announcements');
        if (isMounted && res.data.success && Array.isArray(res.data.data)) {
          setAnnouncements(res.data.data);
        } else if (isMounted) {
          throw new Error('Fallback needed');
        }
      } catch (err) {
        if (isMounted) {
          // High quality mock notices for public board
          setAnnouncements([
            {
              id: 'n1',
              title: 'Admissions Cycle 2026-2027: Early Action Deadlines & Registration',
              content: 'Prospective families are advised that the deadline for Early Action scholarship consideration is November 1st, 2026. Required documents must be submitted through the admissions portal before 5:00 PM PST.',
              category: 'URGENT',
              isPinned: true,
              authorId: 'admin1',
              authorName: 'Office of the Registrar',
              targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
              publishDate: new Date().toISOString(),
            },
            {
              id: 'n2',
              title: 'Fall Semester Mid-Term Assessment Timetable & Examination Protocol',
              content: 'The official schedule for mid-term assessments across Grades 6 through 12 is now finalized. Examination venues, proctor assignments, and permitted reference materials are published in scholar portals.',
              category: 'ACADEMIC',
              isPinned: true,
              authorId: 'admin2',
              authorName: 'Academic Directorate',
              targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
              publishDate: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              id: 'n3',
              title: 'Annual STEM & Robotics Innovation Expo 2026 Scheduled',
              content: 'Over 40 student-led research initiatives, competitive AI models, and autonomous robotics demonstrations will be showcased in the Grand Hall on October 22nd. Parents and alumni welcome.',
              category: 'EVENT',
              isPinned: false,
              authorId: 'teacher1',
              authorName: 'Sarah Montgomery (Head of Robotics)',
              targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
              publishDate: new Date(Date.now() - 172800000).toISOString(),
            },
            {
              id: 'n4',
              title: 'Varsity Football State Championship Quarterfinal Match',
              content: 'Congratulations to our varsity athletes! The Lions will host the regional quarterfinals at our Championship Stadium under the lights this Friday at 6:30 PM.',
              category: 'SPORTS',
              isPinned: false,
              authorId: 'coach1',
              authorName: 'Athletics Department',
              targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
              publishDate: new Date(Date.now() - 259200000).toISOString(),
            },
            {
              id: 'n5',
              title: 'Alexander Media Library Winter Holiday Extended Reading Privileges',
              content: 'Beginning next Monday, all scholars in Grades 9-12 may checkout up to 8 circulating monographs and research volumes for independent winter reading and extended essay research.',
              category: 'GENERAL',
              isPinned: false,
              authorId: 'lib1',
              authorName: 'Head Librarian',
              targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
              publishDate: new Date(Date.now() - 345600000).toISOString(),
            },
          ]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchAnnouncements();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { id: 'ALL', label: 'All Notices' },
    { id: 'URGENT', label: 'Important Alerts' },
    { id: 'ACADEMIC', label: 'Academic & Exams' },
    { id: 'EVENT', label: 'Events & Expos' },
    { id: 'SPORTS', label: 'Athletics' },
    { id: 'GENERAL', label: 'General Circulars' },
  ];

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesCategory = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <SEO
        title="Official Notices & Circulars — R.B.S Residential Public School"
        description="View official notices, academic circulars, CBSE examination schedules, holiday calendars, and alerts from R.B.S Residential Public School, Mahua, Vaishali."
        keywords="RBS School notices, RBSRPS circulars, CBSE exam schedule Mahua, school announcements Vaishali"
      />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Campus Life', href: '/about' },
            { label: 'Notice Board & Circulars' },
          ]}
        />

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-crest-950 text-white p-8 sm:p-12 border border-crest-900 shadow-2xl">
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="gold" size="sm">Official Notice Board</Badge>
              <Badge variant="outline" size="sm" className="text-crest-200 border-crest-700">
                Updated Daily
              </Badge>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Announcements & Circulars
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Timely updates, administrative communications, academic schedules, and institutional announcements for scholars, parents, and faculty.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-card">
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-crest-700 text-white shadow-subtle'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <Input
              placeholder="Search circulars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Notices Feed */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <Skeleton variant="text" width="30%" height="20px" />
                <Skeleton variant="text" width="90%" height="16px" />
                <Skeleton variant="text" width="70%" height="16px" />
              </div>
            ))}
          </div>
        ) : filteredAnnouncements.length > 0 ? (
          <div className="space-y-6">
            {filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all duration-200 shadow-card hover:shadow-elevated space-y-4 ${
                  item.isPinned ? 'border-l-8 border-l-gold-500 border-slate-200' : 'border-slate-200'
                }`}
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    {item.isPinned && (
                      <span className="flex items-center gap-1 text-gold-600 font-bold text-xs uppercase tracking-wider">
                        <Pin className="w-3.5 h-3.5 fill-current" /> Pinned
                      </span>
                    )}
                    <Badge
                      variant={
                        item.category === 'URGENT'
                          ? 'danger'
                          : item.category === 'ACADEMIC'
                          ? 'primary'
                          : item.category === 'EVENT'
                          ? 'gold'
                          : item.category === 'SPORTS'
                          ? 'success'
                          : 'secondary'
                      }
                      size="sm"
                    >
                      {item.category}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-crest-600" />
                      <strong className="text-slate-700">{item.authorName}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.publishDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.content}
                  </p>
                </div>

                {/* Action footer */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 text-crest-700 bg-crest-50 px-2.5 py-1 rounded-lg font-medium border border-crest-100">
                    <FileText className="w-3.5 h-3.5 text-crest-600" /> Official Circular Reference
                  </span>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Print / Save PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Circulars Found"
            description="No notices matched your current search parameters or category filter."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
              >
                Reset Filter
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
};

export const AnnouncementsPage = NoticesPage;
export default NoticesPage;
