import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  Card,
  CardContent,
  Badge,
  Button,
} from '../../components/ui';
import { SEO } from '../../components/common/SEO';
import {
  Award,
  Compass,
  Heart,
  Shield,
  BookOpen,
  CheckCircle2,
  Users,
  Building,
  ArrowRight,
  Globe2,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <SEO
        title="About Us — R.B.S Residential Public School, Mahua, Vaishali"
        description="Established in 2008-2009, R.B.S Residential Public School (RBSRPS) is a premier CBSE-affiliated Senior Secondary (+2) institution in Mahua, Vaishali, Bihar, delivering academic distinction and moral character."
        keywords="About R.B.S Public School, RBSRPS Mahua, CBSE School Vaishali, Ram Bachan Singh, Tribhuwan Singh, Om Narayan, School History Mahua"
      />

      <div className="max-w-7xl mx-auto space-y-14">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'About Us' },
          ]}
        />

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-crest-950 text-white p-8 sm:p-12 lg:p-16 border border-crest-900 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold" size="sm">Established 2008 – 2009</Badge>
              <Badge variant="outline" size="sm" className="text-crest-200 border-crest-700">
                CBSE Affiliated up to +2 (Senior Secondary)
              </Badge>
              <Badge variant="gold" size="sm">Mahua, Vaishali (Bihar)</Badge>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              A Legacy of Quality Education & Sanskar in Vaishali
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Founded under the visionary patronage of Sri Ram Bachan Singh, R.B.S. Residential Public School has stood as a beacon of learning, moral fortitude, and all-round development for students across Bihar.
            </p>
          </div>
        </div>

        {/* Leadership Feature Section: Director & Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Director Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-slate-200 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-crest-900 text-gold-400 flex items-center justify-center font-serif text-2xl font-bold border-2 border-gold-400">
                  RBS
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-gold-600">Founder & Director</span>
                  <h3 className="font-serif text-2xl font-bold text-slate-900">Sri Ram Bachan Singh</h3>
                  <p className="text-xs text-slate-500">R.B.S. Residential Public School</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed italic border-l-2 border-gold-400 pl-4">
                "Our guiding motto has always been 'Fulfilling dreams, one at a time.' We established this institution to provide rural and semi-urban youth with education that equals the finest national standards, infusing scientific inquiry with cultural values."
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Under his leadership, R.B.S. has grown from a humble beginning into a premier Senior Secondary CBSE institution with cutting-edge laboratories, dedicated residential hostels, and an expansive bus network.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Mahua Campus, Vaishali</span>
              <span className="font-semibold text-crest-700">Patepur Road, Mahua</span>
            </div>
          </div>

          {/* Principal Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-slate-200 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-crest-900 text-gold-400 flex items-center justify-center font-serif text-2xl font-bold border-2 border-gold-400">
                  TS
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-gold-600">Principal</span>
                  <h3 className="font-serif text-2xl font-bold text-slate-900">Mr. Tribhuwan Singh</h3>
                  <p className="text-xs text-slate-500">M.A., B.Ed. • Head of Institution</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed italic border-l-2 border-crest-700 pl-4">
                "Education is not merely the accumulation of facts; it is the ignition of character, intellectual independence, and empathy. At RBSRPS, we walk beside every student on their personal journey to excellence."
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                With a passion for innovative pedagogy and student discipline, Mr. Singh ensures that every pupil receives individualized attention, robust board exam preparation, and vibrant co-curricular exposure.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Link to="/principal">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Read Principal's Full Address
                </Button>
              </Link>
              <Link to="/faculty">
                <Button variant="ghost" size="sm">
                  View Faculty
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-crest-900 to-crest-950 text-white rounded-3xl p-8 sm:p-10 shadow-card border border-crest-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold-400/20 text-gold-400 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase font-bold tracking-widest text-gold-400">Our Vision</span>
            <h3 className="font-serif text-2xl font-bold text-white">Inspiring Excellence & Nation Building</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              To evolve as a center of educational excellence that empowers young learners with critical thinking, ethical grounding, and scientific capability, enabling them to excel globally while remaining steadfastly anchored in Indian heritage and values.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-crest-50 text-crest-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase font-bold tracking-widest text-crest-700">Our Mission</span>
            <h3 className="font-serif text-2xl font-bold text-slate-900">Holistic Formation of the Child</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To deliver experiential, activity-based CBSE education, foster a secure residential and day-schooling environment, nurture physical and emotional wellness, and instill lifelong values of truth, perseverance, and social service.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="primary" size="sm">Guiding Pillars</Badge>
            <h2 className="font-serif text-3xl font-bold text-slate-900">The Four Pillars of RBSRPS</h2>
            <p className="text-slate-600 text-sm">The foundational strengths that distinguish our campus experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'CBSE Curriculum Excellence',
                desc: 'Comprehensive syllabus delivery from Nursery to Class 12 (+2 Science, Commerce, and Arts) with strong board exam focus.',
              },
              {
                icon: Shield,
                title: 'Moral Values & Sanskar',
                desc: 'Instilling discipline, mutual respect, patriotism, and traditional Indian cultural ethos in daily school life.',
              },
              {
                icon: Building,
                title: 'Residential Care & Boarding',
                desc: 'Clean, supervised separate hostels for boys and girls with nutritious food, evening study hours, and sports coaching.',
              },
              {
                icon: Sparkles,
                title: 'Modern Infrastructure',
                desc: 'Smart digital classrooms, high-tech Science & Computer laboratories, rich library, and fleet of safe GPS-tracked school buses.',
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Card key={idx} className="p-6 border-slate-200 hover:shadow-card transition-all space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-crest-50 text-crest-700 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-slate-900">{pillar.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-card space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">Institutional Heritage & Milestones</h3>
            <p className="text-xs sm:text-sm text-slate-500">Our journey of sustained educational commitment in Vaishali, Bihar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-serif text-2xl font-bold text-crest-800">2008</span>
              <h5 className="font-bold text-sm text-slate-900">School Inception</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Founded by Sri Ram Bachan Singh in Mahua with foundational grades and a resolute commitment to quality learning.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-serif text-2xl font-bold text-crest-800">2012</span>
              <h5 className="font-bold text-sm text-slate-900">Campus Expansion</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inauguration of modernized Science Laboratories (Physics, Chemistry, Biology) and Computer Learning Center.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-serif text-2xl font-bold text-crest-800">2018</span>
              <h5 className="font-bold text-sm text-slate-900">CBSE +2 Affiliation</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accredited by CBSE New Delhi up to Senior Secondary (+2) Level for Science and Commerce streams.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-serif text-2xl font-bold text-gold-600">2026</span>
              <h5 className="font-bold text-sm text-slate-900">Digital Smart Campus</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deployment of interactive smart boards, expanded residential blocks, and modern sports facilities.
              </p>
            </div>
          </div>
        </div>

        {/* Accreditations & Key Information */}
        <div className="bg-crest-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-crest-900">
          <span className="text-xs uppercase font-bold tracking-widest text-gold-400">Affiliation & Key Information</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold max-w-xl mx-auto">
            Recognized by CBSE New Delhi & Government Authorities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 max-w-4xl mx-auto text-xs sm:text-sm text-slate-300">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center">
              <Award className="w-6 h-6 text-gold-400 mb-2" />
              <span className="font-bold text-white">CBSE Affiliated</span>
              <span className="text-[11px] text-slate-400">Senior Secondary (+2)</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center">
              <Shield className="w-6 h-6 text-crest-400 mb-2" />
              <span className="font-bold text-white">Co-Educational</span>
              <span className="text-[11px] text-slate-400">Pre-Primary to 12th</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center">
              <Building className="w-6 h-6 text-emerald-400 mb-2" />
              <span className="font-bold text-white">Residential Hostel</span>
              <span className="text-[11px] text-slate-400">Boys & Girls Boarding</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center">
              <Users className="w-6 h-6 text-sky-400 mb-2" />
              <span className="font-bold text-white">Safe Bus Fleet</span>
              <span className="text-[11px] text-slate-400">Covering Mahua & Vaishali</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
