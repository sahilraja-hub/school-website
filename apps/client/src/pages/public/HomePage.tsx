import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  Building2,
  Globe2,
  Microscope,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { api } from '../../services/api';
import { Announcement } from '@school/shared';

export const HomePage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/announcements');
        if (res.data.success) {
          setAnnouncements(res.data.data.slice(0, 3));
        }
      } catch (err) {
        // Fallback default announcements
        setAnnouncements([
          {
            id: '1',
            title: 'Annual STEM & Robotics Innovation Expo 2026',
            content: 'Showcasing over 40 student-led research initiatives and robotics demonstrations in the Grand Hall.',
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
            content: 'The official schedule for mid-term assessments is now published on student and parent portals.',
            category: 'ACADEMIC',
            isPinned: true,
            authorId: 'admin',
            authorName: 'Principal Harrison',
            targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
            publishDate: new Date().toISOString(),
          },
        ]);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-[90vh] flex items-center">
        {/* Background Image with Cinematic Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/campus-hero.jpg"
            alt="Oakridge International Academy Campus"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crest-600/30 border border-crest-400/30 text-crest-300 text-xs sm:text-sm font-medium backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Admissions for 2026-2027 Academic Year Are Open</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              Where Curious Minds Become <span className="text-transparent bg-clip-text bg-gradient-to-r from-crest-400 via-sky-300 to-gold-400">Global Leaders</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Oakridge International Academy combines rigorous academics, cutting-edge STEM discovery, and holistic leadership development to empower students from Kindergarten through Grade 12.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/admissions"
                className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-gold-500/20 transition-all hover:scale-105 text-sm sm:text-base"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/academics"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 backdrop-blur-md transition-all text-sm sm:text-base"
              >
                <span>Explore Curriculum</span>
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Top 1% Global IB School</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-crest-400" />
                <span>38+ Student Nationalities</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>100% College Acceptance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KEY STATS COUNTERS */}
      <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl shadow-elevated p-6 border border-slate-100">
          <div className="flex flex-col items-center sm:items-start p-2">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-crest-800">100%</span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">University Acceptance</span>
          </div>
          <div className="flex flex-col items-center sm:items-start p-2 border-l border-slate-100">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-crest-800">1 : 8</span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Faculty to Student Ratio</span>
          </div>
          <div className="flex flex-col items-center sm:items-start p-2 border-l border-slate-100">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-crest-800">35+</span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">AP & Honors Courses</span>
          </div>
          <div className="flex flex-col items-center sm:items-start p-2 border-l border-slate-100">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-600">$4.2M</span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Merit Scholarships Won</span>
          </div>
        </div>
      </section>

      {/* 3. ACADEMIC EXCELLENCE & STEM HIGHLIGHT */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crest-100 text-crest-800 text-xs font-semibold tracking-wide uppercase">
                <Microscope className="w-3.5 h-3.5" /> Innovation & Discovery
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
                Pioneering Next-Generation STEM & Humanistic Inquiry
              </h2>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                At Oakridge, learning goes beyond textbooks. In our newly expanded 14,000 sq. ft. Robotics Innovation Hub and Biotechnology Labs, students build autonomous rovers, engineer clean energy solutions, and conduct collegiate-level research.
              </p>

              <div className="space-y-3.5">
                {[
                  'State-of-the-art Robotics and 3D Prototyping Innovation Hub',
                  'Advanced Placement (AP) Capstone Diploma Program',
                  'Dedicated faculty mentors with advanced post-graduate degrees',
                  'Comprehensive arts conservatory, orchestra, and competitive debate',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-crest-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  to="/academics"
                  className="inline-flex items-center gap-2 text-crest-700 font-semibold hover:text-crest-800 text-sm group"
                >
                  <span>Learn about our academic stages</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Generated STEM Lab Image Display */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-crest-500 to-gold-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500" />
              <div className="relative overflow-hidden rounded-2xl shadow-xl border border-slate-200">
                <img
                  src="/images/stem-lab.jpg"
                  alt="Students Collaborating in Oakridge STEM Lab"
                  className="w-full h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-6 text-white">
                  <span className="text-xs uppercase font-semibold tracking-wider text-gold-400">Campus Highlight</span>
                  <h3 className="text-lg font-bold font-serif">Robotics & Applied Artificial Intelligence Lab</h3>
                  <p className="text-xs text-slate-300 mt-1">Empowering students with hands-on collaborative engineering experience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THREE ACADEMIC DIVISIONS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-crest-600">Educational Journey</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">Nurturing Every Milestone of Growth</h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A continuous, cohesive pathway designed to foster foundational curiosity, disciplined inquiry, and scholarly independence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Division 1: Primary */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-crest-100 text-crest-700 flex items-center justify-center font-bold text-lg group-hover:bg-crest-700 group-hover:text-white transition-colors">
                  KG-5
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">Primary Academy</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Focuses on literacy, foundational mathematical reasoning, inquiry-based science, and emotional intelligence in a secure, vibrant atmosphere.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-200/60 mt-6">
                <Link to="/academics" className="flex items-center justify-between text-sm font-semibold text-crest-700 hover:text-crest-900">
                  <span>Explore Primary Curriculum</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Division 2: Middle */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold text-lg group-hover:bg-gold-500 group-hover:text-slate-950 transition-colors">
                  6-8
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">Middle School</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Deepens analytical writing, advanced algebra, lab science, world languages, and athletic leadership during crucial developmental years.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-200/60 mt-6">
                <Link to="/academics" className="flex items-center justify-between text-sm font-semibold text-crest-700 hover:text-crest-900">
                  <span>Explore Middle School</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Division 3: High School */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  9-12
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">Senior High School</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Rigorous AP and IB curriculum, college counseling, capstone thesis defense, and global exchange opportunities that prepare students for world-leading universities.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-200/60 mt-6">
                <Link to="/academics" className="flex items-center justify-between text-sm font-semibold text-crest-700 hover:text-crest-900">
                  <span>Explore Senior High</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LATEST ANNOUNCEMENTS & EVENTS */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-crest-600">Notice Board</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">Campus Circulars & Events</h2>
            </div>
            <Link
              to="/notices"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-crest-700 hover:text-crest-900"
            >
              <span>View All Notices</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        notice.category === 'ACADEMIC'
                          ? 'bg-blue-100 text-blue-800'
                          : notice.category === 'EVENT'
                          ? 'bg-purple-100 text-purple-800'
                          : notice.category === 'SPORTS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {notice.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(notice.publishDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug line-clamp-2">
                    {notice.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                    {notice.content}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>By {notice.authorName}</span>
                  <Link to="/notices" className="text-crest-600 font-semibold hover:underline">
                    Read more
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ADMISSIONS CTA BANNER */}
      <section className="bg-gradient-to-r from-crest-900 via-crest-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block text-xs uppercase font-bold tracking-widest text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
            Admissions Open For 2026-2027
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold max-w-2xl mx-auto leading-tight">
            Begin Your Scholar's Extraordinary Journey Today
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base font-light">
            Submit your online application in under 5 minutes or schedule a private campus tour with our admissions committee.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <Link
              to="/admissions"
              className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105 text-sm sm:text-base"
            >
              Start Online Application
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/20 transition-colors text-sm sm:text-base"
            >
              Book a Campus Tour
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
