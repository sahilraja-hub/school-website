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
  Bus,
  Home,
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
    let isMounted = true;
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/announcements');
        if (isMounted && res.data.success && Array.isArray(res.data.data)) {
          setAnnouncements(res.data.data.slice(0, 3));
        } else if (isMounted) {
          throw new Error('Default fallback');
        }
      } catch (err) {
        if (isMounted) {
          setAnnouncements([
            {
              id: '1',
              title: 'Admissions Open for Session 2026-2027: Pre-Primary to Class XII',
              content: 'Online registration for the upcoming academic session is now live. Parents can register online or visit our school campus on Patepur Road, Mahua.',
              category: 'URGENT',
              isPinned: true,
              authorId: 'admin1',
              authorName: 'R.B.S Admissions Office',
              targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
              publishDate: new Date().toISOString(),
            },
            {
              id: '2',
              title: 'CBSE Pre-Board Examination Timetable & Revision Modules Released',
              content: 'Class X and Class XII CBSE pre-board evaluation timetable is now published. Examination hall admit cards are accessible via the Student Portal.',
              category: 'ACADEMIC',
              isPinned: true,
              authorId: 'admin2',
              authorName: 'Academic Directorate',
              targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
              publishDate: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              id: '3',
              title: 'Annual Sports & Cultural Meet 2026 at R.B.S Campus Grounds',
              content: 'Inter-house athletic competitions, track races, and cultural recitals will be celebrated across our main sports pavilion.',
              category: 'EVENT',
              isPinned: false,
              authorId: 'teacher1',
              authorName: 'Sports Department',
              targetRoles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
              publishDate: new Date(Date.now() - 172800000).toISOString(),
            },
          ]);
        }
      }
    };
    fetchAnnouncements();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-left">
      <SEO
        title="R.B.S Residential Public School, Mahua | Top CBSE School in Vaishali"
        description="R.B.S Residential Public School (RBSRPS), Patepur Road, Mahua, Vaishali, Bihar. Affiliated to CBSE New Delhi (+2 Level). Est. 2008. Dedicated to fulfilling dreams, one at a time."
        keywords="R.B.S Residential Public School, RBSRPS Mahua, Best CBSE school in Mahua, Top School in Vaishali, Bihar CBSE school, school with hostel Mahua"
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-[92vh] flex items-center">
        {/* Background Image with Cinematic Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/campus-hero.jpg"
            alt="R.B.S Residential Public School Mahua Campus Grounds"
            className="w-full h-full object-cover object-center opacity-45 scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crest-600/30 border border-crest-400/30 text-crest-300 text-xs sm:text-sm font-medium backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Admissions Open For Session 2026-2027 (Pre-Primary to +2)</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              Fulfilling Dreams,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-crest-400 via-sky-300 to-gold-400">
                One at a Time
              </span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Welcome to <strong>R.B.S Residential Public School (RBSRPS)</strong>, one of the premier CBSE institutions in Mahua, Vaishali. Since 2008, we have nurtured inquiring minds with academic rigor, Indian moral values, digital smart classrooms, and safe residential hostel facilities.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link to="/admissions">
                <Button
                  variant="gold"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Online Admission Form
                </Button>
              </Link>
              <Link to="/academics">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-md"
                >
                  Explore CBSE Curriculum
                </Button>
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-400" />
                <span>Affiliated to CBSE, New Delhi (+2 Level)</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-crest-400" />
                <span>Separate Boys & Girls Hostel</span>
              </div>
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-emerald-400" />
                <span>Dedicated Safe Bus Fleet</span>
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
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">CBSE Board Success Rate</span>
          </div>
          <div className="flex flex-col items-center sm:items-start p-2 border-l border-slate-100">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-crest-800">18+</span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Years of Legacy (Est. 2008)</span>
          </div>
          <div className="flex flex-col items-center sm:items-start p-2 border-l border-slate-100">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-crest-800">Nursery to +2</span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Science, Commerce & Arts</span>
          </div>
          <div className="flex flex-col items-center sm:items-start p-2 border-l border-slate-100">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-600">Smart Labs</span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Digital Classrooms & Science Labs</span>
          </div>
        </div>
      </section>

      {/* 3. INTRODUCTION, VISION & MISSION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="primary" size="sm">Our Founding Legacy (Est. 2008 – 2009)</Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Welcome to R.B.S Residential Public School, Mahua
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Every parent aspires to provide high quality education for their children, and choosing the right school is vital. At R.B.S, we build a culture of diligence, sincerity, and accountability to foster lifelong passion for learning.
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
                  To emerge as a school which not only imbibes new ideas and knowledge among talented young minds but also sensitizes them towards social responsibilities they have as young citizens of India.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-2 text-xs font-semibold text-crest-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Leadership Qualities • Indian Values • Excellence-Oriented Learning</span>
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
                  To nurture the enormous talent of students by providing an inspiring ambience where they strive with diligence and dedication, equipped with strength and modern skills to thrive in a competitive world.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-2 text-xs font-semibold text-gold-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Quality Education • Intellectual Empowerment • Transparent Governance</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. PRINCIPAL & DIRECTOR'S MESSAGE PREVIEW */}
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
                    alt="Mr. Tribhuwan Singh, Principal of R.B.S Residential Public School"
                    className="w-full h-96 sm:h-[450px] object-cover object-top"
                  />
                  <div className="p-4 bg-slate-950/90 text-white border-t border-slate-800 text-left">
                    <h4 className="font-serif text-base font-bold">Mr. Tribhuwan Singh</h4>
                    <p className="text-xs text-gold-400">Principal & Academic Head</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">R.B.S Residential Public School, Mahua</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-bold uppercase tracking-wider">
                <Quote className="w-3.5 h-3.5" /> Leadership Perspective
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
                "Where we fulfill dreams, one at a time."
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                "I take immense pleasure in welcoming you all to R.B.S Mahua, an educational institution that strives to make every child an active learner and a responsible global citizen. We ensure children grow up in a safe, sound, and disciplined academic environment."
              </p>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
                <p>
                  <strong>Director's Address (Sri Ram Bachan Singh):</strong> "As we join hands in this noble journey, our pedagogical team is committed to providing an environment that empowers students to explore, grow, and fly higher."
                </p>
                <p className="text-slate-500 italic">
                  Managing Director: Mr. Om Narayan
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link to="/principal">
                  <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Read Full Messages
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

      {/* 5. ACADEMIC CONTINUUM & CBSE CURRICULUM */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-crest-600">CBSE Curriculum Pathway</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Comprehensive Education from Pre-Primary to +2 Level
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Affiliated to the Central Board of Secondary Education (CBSE), New Delhi, adhering to NCF guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Primary */}
            <Card className="p-8 border-slate-200 hover:shadow-xl transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-crest-100 text-crest-700 flex items-center justify-center font-bold text-lg">
                  NUR-V
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">Pre-Primary & Primary</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Focus on language development, foundational numeracy, environmental awareness, and activity-based learning in a nurturing atmosphere.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6">
                <Link to="/academics" className="flex items-center justify-between text-xs sm:text-sm font-semibold text-crest-700 hover:text-crest-900">
                  <span>Explore Primary Wing</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>

            {/* Middle */}
            <Card className="p-8 border-slate-200 hover:shadow-xl transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold text-lg">
                  VI-VIII
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">Middle School</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Strengthening analytical science, mathematics, computer literacy, social studies, and linguistic proficiency with laboratory practice.
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
                  IX-XII
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">Secondary & +2 Level</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Rigorous CBSE board preparation across Science (PCM/PCB), Commerce, and Arts streams with career counseling and competitive test guidance.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6">
                <Link to="/academics" className="flex items-center justify-between text-xs sm:text-sm font-semibold text-crest-700 hover:text-crest-900">
                  <span>Explore +2 Streams</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          </div>

          {/* Smart Classrooms & Labs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-card">
            <div className="lg:col-span-6 space-y-5">
              <Badge variant="primary" size="sm">Modern Infrastructure</Badge>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                Smart Digital Classrooms & Modern Laboratories
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                R.B.S provides aesthetically planned, well-ventilated classrooms with multimedia digital projection, reducing routine classroom monotony and making education exciting.
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fully equipped Physics, Chemistry, and Biology laboratories</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Advanced Computer Lab with high-speed internet & coding tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Separate Residential Hostels for Boys and Girls</span>
                </div>
              </div>
              <div className="pt-2">
                <Link to="/facilities">
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Explore All Campus Facilities
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-card border border-slate-200">
              <img
                src="/images/stem-lab.jpg"
                alt="R.B.S Science & Computer Lab"
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
              <span className="text-xs uppercase font-bold tracking-widest text-crest-600">Campus Facilities</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
                State-of-the-Art Infrastructure in Mahua
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
                  alt="R.B.S Central Library"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <Badge variant="primary" size="sm">Knowledge Hub</Badge>
                  <h3 className="font-serif text-lg font-bold text-slate-900 mt-2">
                    Rich Central Library
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Vast collection of academic textbooks, reference journals, encyclopedias, and quiet reading areas to foster scholarship.
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
                  alt="Sports & Playgrounds"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <Badge variant="success" size="sm">Sports & Physical Fitness</Badge>
                  <h3 className="font-serif text-lg font-bold text-slate-900 mt-2">
                    Athletics & Sports Grounds
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Large playgrounds for cricket, football, volleyball, badminton, and yoga sessions promoting active physical health.
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
                  alt="Hostel & Transportation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <Badge variant="gold" size="sm">Residential & Transit</Badge>
                  <h3 className="font-serif text-lg font-bold text-slate-900 mt-2">
                    Hostel & Bus Fleet
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Secure residential boarding for outstation scholars and dedicated bus fleet connecting Mahua, Patepur, and Vaishali.
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

      {/* 8. LATEST NOTICES & UPCOMING EVENTS */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/70">
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
                  <div key={n.id} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 hover:border-crest-300 transition-colors">
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
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mt-0.5">Important Dates</h3>
                </div>
                <Link to="/events" className="text-xs font-semibold text-crest-700 hover:underline">
                  Full Calendar →
                </Link>
              </div>

              <div className="space-y-4">
                {[
                  {
                    day: '15',
                    month: 'OCT',
                    title: 'Parent-Teacher Meeting (PTM)',
                    time: '9:30 AM IST',
                    loc: 'Main School Auditorium',
                  },
                  {
                    day: '28',
                    month: 'OCT',
                    title: 'Diwali & Chhath Puja Celebration',
                    time: '10:00 AM IST',
                    loc: 'R.B.S Campus Quad',
                  },
                  {
                    day: '14',
                    month: 'NOV',
                    title: 'Children’s Day & Science Exhibition',
                    time: '8:30 AM IST',
                    loc: 'Science & Computer Labs',
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

      {/* 9. ADMISSIONS CTA BANNER */}
      <section className="bg-gradient-to-r from-crest-950 via-crest-900 to-slate-950 text-white py-20 border-t border-crest-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge variant="gold" size="sm">Admissions Open For Session 2026-2027</Badge>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold max-w-2xl mx-auto leading-tight">
            Enroll in R.B.S Residential Public School Today
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            Give your child the gift of quality CBSE education, moral character, and holistic development. Apply online or visit our campus.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <Link to="/admissions">
              <Button variant="gold" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />} id="cta-apply-btn">
                Online Admission Registration
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white/20 bg-white/10 hover:bg-white/20"
                id="cta-contact-btn"
              >
                Contact & Directions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. QUICK CONTACT & VISIT SECTION */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-crest-100 text-crest-700 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-slate-900">Campus Location</h4>
                <p className="text-xs text-slate-600">Ababakarpur Kowahi - Mukundpur - Mahua Rd, Mahua Ram Rae, Bihar 844122</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-slate-900">Direct Inquiries</h4>
                <p className="text-xs text-slate-600">+91 70503 49159 / +91 9199678159 &bull; info@rbsschool.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-slate-900">Office Working Hours</h4>
                <p className="text-xs text-slate-600">Monday - Saturday: 8:00 AM – 3:30 PM IST</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
