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
  Quote,
  Clock,
  MapPin,
  Phone,
  Mail,
  Camera,
  Trophy,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Avatar,
} from '../../components/ui';
import { SEO } from '../../components/common/SEO';
import { api } from '../../services/api';
import { Announcement } from '@school/shared';

export const HomePage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/announcements');
        if (res.data.success && Array.isArray(res.data.data)) {
          setAnnouncements(res.data.data.slice(0, 3));
        } else {
          throw new Error('Default fallback');
        }
      } catch (err) {
        setAnnouncements([
          {
            id: '1',
            title: 'Admissions Cycle 2026-2027: Early Action Deadlines & Registration',
            content: 'Early Action scholarship consideration closes on November 1st, 2026. Submit required transcripts via the admissions portal.',
            category: 'URGENT',
            isPinned: true,
            authorId: 'admin1',
            authorName: 'Office of the Registrar',
            targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
            publishDate: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Fall Semester Mid-Term Examination Schedule Released',
            content: 'The official schedule for mid-term assessments is now published on student and parent portals. Please review examination venues.',
            category: 'ACADEMIC',
            isPinned: true,
            authorId: 'admin2',
            authorName: 'Academic Directorate',
            targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
            publishDate: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '3',
            title: 'Annual STEM & Robotics Innovation Expo 2026',
            content: 'Over 40 student-led research initiatives, competitive AI models, and robotics demonstrations will be showcased in the Grand Hall.',
            category: 'EVENT',
            isPinned: false,
            authorId: 'teacher1',
            authorName: 'Sarah Montgomery',
            targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
            publishDate: new Date(Date.now() - 172800000).toISOString(),
          },
        ]);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-left">
      <SEO
        title="Excellence in Global Preparatory Education"
        description="Oakridge International Academy is a premier college-preparatory institution in Cambridge. Empowering Kindergarten through Grade 12 scholars through IB & AP Capstone curricula, world-class STEM discovery, and ethical leadership."
        keywords="Oakridge International Academy, preparatory school, IB world school, Cambridge campus, private school admissions 2026, AP capstone"
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-[92vh] flex items-center">
        {/* Background Image with Cinematic Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/campus-hero.jpg"
            alt="Oakridge International Academy Campus Quad and Historic Clock Tower"
            className="w-full h-full object-cover object-center opacity-45 scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crest-600/30 border border-crest-400/30 text-crest-300 text-xs sm:text-sm font-medium backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Admissions for 2026-2027 Academic Year Are Open</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              Where Curious Minds Become{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-crest-400 via-sky-300 to-gold-400">
                Global Leaders
              </span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Oakridge International Academy unites rigorous International Baccalaureate & AP Capstone academics, cutting-edge STEM discovery, and moral leadership to empower scholars from Kindergarten through Grade 12.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link to="/admissions">
                <Button
                  variant="gold"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Apply for Admission
                </Button>
              </Link>
              <Link to="/academics">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-md"
                >
                  Explore Academic Pathways
                </Button>
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
                <span>100% University Acceptance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KEY STATS COUNTERS */}
      <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-3xl shadow-elevated p-6 sm:p-8 border border-slate-200">
          <div className="flex flex-col items-center sm:items-start p-2">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-crest-800">100%</span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">University Matriculation</span>
          </div>
          <div className="flex flex-col items-center sm:items-start p-2 border-l border-slate-100">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-crest-800">1 : 8</span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Faculty-to-Scholar Ratio</span>
          </div>
          <div className="flex flex-col items-center sm:items-start p-2 border-l border-slate-100">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-crest-800">35+</span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">AP & IB Capstone Courses</span>
          </div>
          <div className="flex flex-col items-center sm:items-start p-2 border-l border-slate-100">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-600">$4.2M</span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Annual Merit Scholarships</span>
          </div>
        </div>
      </section>

      {/* 3. INTRODUCTION, VISION & MISSION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="primary" size="sm">Our Founding Heritage Since 1988</Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              An Educational Legacy Rooted in Excellence & Integrity
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              For over three decades, Oakridge International Academy has stood as a beacon of scholastic rigor and moral character, cultivating inquisitive scholars who lead with purposeful empathy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <Card className="border-slate-200 hover:border-crest-300 transition-all p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-crest-100 text-crest-700 flex items-center justify-center">
                  <Globe2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">Our Vision</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  To be globally recognized as the benchmark institution for holistic education—where intellectual mastery, compassionate ethics, and creative innovation empower young minds to shape humanity’s greatest frontiers.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-2 text-xs font-semibold text-crest-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Global Consciousness • Moral Courage • Scientific Truth</span>
              </div>
            </Card>

            {/* Mission Card */}
            <Card className="border-slate-200 hover:border-gold-400 transition-all p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">Our Mission</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We empower a diverse community of lifelong learners through individualized academic mentorship, university-grade research opportunities, and vibrant artistic expression, cultivating leaders equipped to solve complex global challenges.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-2 text-xs font-semibold text-gold-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Intellectual Rigor • Inclusivity • Civic Responsibility</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. PRINCIPAL'S MESSAGE PREVIEW */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-gold-500 to-crest-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900">
                  <img
                    src="/images/principal.jpg"
                    alt="Dr. Eleanor Vance, Principal of Oakridge International Academy"
                    className="w-full h-96 sm:h-[450px] object-cover object-top"
                  />
                  <div className="p-4 bg-slate-950/90 text-white border-t border-slate-800 text-left">
                    <h4 className="font-serif text-base font-bold">Dr. Eleanor Vance, Ph.D.</h4>
                    <p className="text-xs text-gold-400">Head of School & Executive Principal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-bold uppercase tracking-wider">
                <Quote className="w-3.5 h-3.5" /> Welcome from the Principal
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
                "We do not merely prepare students for university; we prepare them for a life of purpose."
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Welcome to Oakridge. In an era marked by rapid technological and societal change, the true measure of education lies in cultivating resilient intellect, moral discernment, and the courage to advocate for positive progress.
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Our faculty of distinguished researchers and master educators partner closely with every family to ensure scholars discover their distinctive passions—whether in theoretical physics, orchestral performance, or social entrepreneurship.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link to="/principal">
                  <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Read Dr. Vance's Full Message
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline">
                    About School Governance
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ACADEMIC DIVISIONS & STEM INNOVATION */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-crest-600">Academic Continuum</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Intellectual Journeys Tailored to Every Age
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A cohesive K-12 academic pathway fostering foundational curiosity, disciplined inquiry, and scholarly independence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Primary */}
            <Card className="p-8 border-slate-200 hover:shadow-xl transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-crest-100 text-crest-700 flex items-center justify-center font-bold text-lg">
                  KG-5
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">Primary Academy</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Focuses on literacy, foundational mathematical reasoning, inquiry-based science, and emotional intelligence in a secure, joyful setting.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6">
                <Link to="/academics" className="flex items-center justify-between text-xs sm:text-sm font-semibold text-crest-700 hover:text-crest-900">
                  <span>Explore Primary Stage</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>

            {/* Middle */}
            <Card className="p-8 border-slate-200 hover:shadow-xl transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold text-lg">
                  6-8
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">Middle School</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Deepens analytical writing, advanced algebra, lab science, world languages, and athletic leadership during pivotal developmental years.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6">
                <Link to="/academics" className="flex items-center justify-between text-xs sm:text-sm font-semibold text-crest-700 hover:text-crest-900">
                  <span>Explore Middle School</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>

            {/* High School */}
            <Card className="p-8 border-slate-200 hover:shadow-xl transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                  9-12
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">Senior High & AP/IB</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Rigorous AP and IB curriculum, college counseling, capstone thesis defense, and global exchange opportunities that prepare students for world-leading universities.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6">
                <Link to="/academics" className="flex items-center justify-between text-xs sm:text-sm font-semibold text-crest-700 hover:text-crest-900">
                  <span>Explore Senior High</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          </div>

          {/* STEM Lab Feature */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-card">
            <div className="lg:col-span-6 space-y-5">
              <Badge variant="primary" size="sm">Campus Innovation Center</Badge>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                Pioneering Next-Generation STEM & Robotics
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                In our newly expanded 14,000 sq. ft. Robotics Innovation Hub and Biotechnology Labs, students build autonomous rovers, engineer clean energy solutions, and conduct collegiate-level scientific inquiry.
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>CRISPR molecular biology and biochemical research suites</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Autonomous FIRST Robotics championship arena and CNC shop</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dual Advanced Placement Capstone and IB Diploma tracks</span>
                </div>
              </div>
              <div className="pt-2">
                <Link to="/academics">
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Complete Curriculum
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-card border border-slate-200">
              <img
                src="/images/stem-lab.jpg"
                alt="Students collaborating in Oakridge STEM Lab"
                className="w-full h-72 sm:h-84 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. CAMPUS FACILITIES PREVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-crest-600">Campus Environment</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
                World-Class Learning Sanctuaries
              </h2>
            </div>
            <Link to="/facilities">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Explore All Facilities
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Facility 1 */}
            <div className="group rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-card flex flex-col">
              <div className="h-56 overflow-hidden">
                <img
                  src="/images/library.jpg"
                  alt="Alexander Media Library"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <Badge variant="primary" size="sm">Academic Commons</Badge>
                  <h3 className="font-serif text-lg font-bold text-slate-900 mt-2">
                    Alexander Media Library
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Two-story learning commons with 45,000+ catalogued volumes, collaborative pods, and digital research archives.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-xs font-semibold text-crest-700">
                  <Link to="/facilities" className="hover:underline flex items-center justify-between">
                    <span>View Specifications</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Facility 2 */}
            <div className="group rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-card flex flex-col">
              <div className="h-56 overflow-hidden">
                <img
                  src="/images/athletics.jpg"
                  alt="Championship Athletic Complex"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <Badge variant="success" size="sm">Athletics & Track</Badge>
                  <h3 className="font-serif text-lg font-bold text-slate-900 mt-2">
                    Championship Stadium
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Olympic Mondo blue running track, FIFA-standard turf soccer stadium, and floodlit 2,500-seat grandstand.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-xs font-semibold text-crest-700">
                  <Link to="/facilities" className="hover:underline flex items-center justify-between">
                    <span>View Specifications</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Facility 3 */}
            <div className="group rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-card flex flex-col">
              <div className="h-56 overflow-hidden">
                <img
                  src="/images/campus-hero.jpg"
                  alt="Historic Cambridge Quad"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <Badge variant="gold" size="sm">Campus Grounds</Badge>
                  <h3 className="font-serif text-lg font-bold text-slate-900 mt-2">
                    Historic Cambridge Quad
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Iconic Gothic architecture quad, outdoor amphitheater, clock tower carillon, and sustainable gardens.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-xs font-semibold text-crest-700">
                  <Link to="/facilities" className="hover:underline flex items-center justify-between">
                    <span>View Specifications</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FACULTY PREVIEW */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-crest-600">Faculty Leadership</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
                Mentored by World-Class Educators
              </h2>
            </div>
            <Link to="/faculty">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Faculty Directory
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Dr. Arthur Pendelton',
                role: 'Chair of Advanced Physics',
                degree: 'Ph.D. MIT',
                dept: 'STEM',
              },
              {
                name: 'Sarah Montgomery',
                role: 'Head of Mathematics & Robotics',
                degree: 'M.S. Princeton',
                dept: 'STEM',
              },
              {
                name: 'Dr. Marcus Sterling',
                role: 'Chair of World History',
                degree: 'Ph.D. Oxford',
                dept: 'Humanities',
              },
              {
                name: 'Julian Hayes',
                role: 'Director of Orchestral Arts',
                degree: 'M.M. Juilliard',
                dept: 'Fine Arts',
              },
            ].map((f, i) => (
              <Card key={i} className="p-6 border-slate-200 text-center space-y-3">
                <Avatar name={f.name} size="xl" className="mx-auto" />
                <div>
                  <h4 className="font-serif text-base font-bold text-slate-900">{f.name}</h4>
                  <p className="text-xs text-crest-700 font-medium">{f.role}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{f.degree}</p>
                </div>
                <Badge variant="outline" size="sm" className="mx-auto">
                  {f.dept}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LATEST NOTICES & UPCOMING EVENTS (COMBINED INTELLIGENCE HUB) */}
      <section className="py-20 bg-white border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Notices Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-crest-600">Notice Board</span>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mt-0.5">Campus Circulars</h3>
                </div>
                <Link to="/notices" className="text-xs font-semibold text-crest-700 hover:underline">
                  All Notices →
                </Link>
              </div>

              <div className="space-y-4">
                {announcements.map((n) => (
                  <div key={n.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-crest-300 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant={n.category === 'URGENT' ? 'danger' : 'primary'} size="sm">
                        {n.category}
                      </Badge>
                      <span className="text-slate-400">{new Date(n.publishDate).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-slate-900">{n.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-crest-600">Calendar</span>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mt-0.5">Upcoming Dates</h3>
                </div>
                <Link to="/events" className="text-xs font-semibold text-crest-700 hover:underline">
                  Full Calendar →
                </Link>
              </div>

              <div className="space-y-4">
                {[
                  {
                    day: '14',
                    month: 'OCT',
                    title: 'Admissions Open House & Forum',
                    time: '9:00 AM PST',
                    loc: 'Founder’s Hall',
                  },
                  {
                    day: '22',
                    month: 'OCT',
                    title: 'Regional Robotics Invitational',
                    time: '10:00 AM PST',
                    loc: 'STEM Center',
                  },
                  {
                    day: '05',
                    month: 'NOV',
                    title: 'Philharmonia Gala Concert',
                    time: '7:00 PM PST',
                    loc: 'Auditorium',
                  },
                ].map((e, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:border-gold-300 transition-colors">
                    <div className="w-14 h-14 rounded-xl bg-crest-50 border border-crest-100 flex flex-col items-center justify-center shrink-0 text-center">
                      <span className="text-[10px] font-bold uppercase text-crest-700">{e.month}</span>
                      <span className="font-serif text-lg font-bold text-slate-900 leading-none">{e.day}</span>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-serif text-sm font-bold text-slate-900">{e.title}</h4>
                      <p className="text-xs text-slate-500">{e.time} • {e.loc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PHOTO GALLERY PREVIEW */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-crest-600">Visual Chronicle</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
                Life on the Cambridge Grounds
              </h2>
            </div>
            <Link to="/gallery">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Complete Gallery
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/gallery" className="group relative rounded-2xl overflow-hidden shadow-subtle h-60">
              <img
                src="/images/campus-hero.jpg"
                alt="Historic Quad"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                Historic Quad →
              </div>
            </Link>
            <Link to="/gallery" className="group relative rounded-2xl overflow-hidden shadow-subtle h-60">
              <img
                src="/images/stem-lab.jpg"
                alt="Genetics Lab"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                STEM Lab →
              </div>
            </Link>
            <Link to="/gallery" className="group relative rounded-2xl overflow-hidden shadow-subtle h-60">
              <img
                src="/images/library.jpg"
                alt="Media Commons"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                Alexander Library →
              </div>
            </Link>
            <Link to="/gallery" className="group relative rounded-2xl overflow-hidden shadow-subtle h-60">
              <img
                src="/images/athletics.jpg"
                alt="Championship Track"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                Athletics Complex →
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. ADMISSIONS CTA BANNER */}
      <section className="bg-gradient-to-r from-crest-950 via-crest-900 to-slate-950 text-white py-20 border-t border-crest-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge variant="gold" size="sm">Admissions Open For 2026-2027</Badge>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold max-w-2xl mx-auto leading-tight">
            Begin Your Scholar's Extraordinary Journey Today
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            Submit your online candidate application in minutes or schedule an executive campus tour with our admissions committee.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <Link to="/admissions">
              <Button variant="gold" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start Online Application
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white/20 bg-white/10 hover:bg-white/20"
              >
                Book a Campus Tour
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. QUICK CONTACT & VISIT SECTION */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-crest-100 text-crest-700 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-slate-900">Campus Location</h4>
                <p className="text-xs text-slate-600">450 Academy Way, Cambridge Campus, Seattle, WA 98101</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-slate-900">Direct Inquiries</h4>
                <p className="text-xs text-slate-600">+1 (800) 555-OAKRIDGE • admissions@oakridge.edu</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-slate-900">Academic Office Hours</h4>
                <p className="text-xs text-slate-600">Monday - Friday: 8:00 AM – 4:30 PM PST</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
