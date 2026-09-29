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
  Quote,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
} from 'lucide-react';

export const PrincipalMessagePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <SEO
        title="Principal's Message — Mr. Tribhuwan Singh | R.B.S Residential Public School"
        description="Official message from Mr. Tribhuwan Singh, Principal of R.B.S. Residential Public School, Mahua, Vaishali. Discover our educational philosophy and commitment to academic excellence and moral character."
        keywords="Principal RBS School Mahua, Tribhuwan Singh, Head of School message, RBSRPS Vaishali, CBSE Principal Mahua"
      />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'About Us', href: '/about' },
            { label: "Principal's Message" },
          ]}
        />

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-crest-950 text-white p-8 sm:p-12 lg:p-16 border border-crest-900 shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Header */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="gold" size="sm">Office of the Principal</Badge>
                <Badge variant="outline" size="sm" className="text-crest-200 border-crest-700">
                  CBSE Affiliated Senior Secondary
                </Badge>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                "Fulfilling Dreams, One Student at a Time."
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                A warm welcome from Mr. Tribhuwan Singh, Principal of R.B.S. Residential Public School, Mahua, Vaishali. Here, every child is nurtured to learn with enthusiasm, act with integrity, and achieve their highest potential.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-gold-400" /> M.A., B.Ed.
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-crest-400" /> Over Two Decades of Pedagogical Leadership
                </span>
              </div>
            </div>

            {/* Right Portrait / Badge */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm w-full">
                <div className="absolute -inset-2 bg-gradient-to-r from-gold-500 to-crest-500 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition duration-300" />
                <div className="relative rounded-2xl overflow-hidden border-2 border-gold-400/40 shadow-2xl bg-crest-900 text-center p-8 space-y-4">
                  <div className="w-24 h-24 rounded-full bg-gold-400/20 border-2 border-gold-400 text-gold-400 mx-auto flex items-center justify-center font-serif text-3xl font-bold">
                    TS
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">Mr. Tribhuwan Singh</h3>
                    <p className="text-xs text-gold-400 font-semibold mt-1">Principal & Academic Head</p>
                    <p className="text-xs text-slate-300 mt-1">R.B.S. Residential Public School</p>
                    <p className="text-[11px] text-slate-400">Mahua, Vaishali, Bihar</p>
                  </div>
                  <div className="pt-2 border-t border-crest-800 text-xs text-slate-300 space-y-1">
                    <p>Affiliated to CBSE, New Delhi (+2)</p>
                    <p className="text-gold-400 font-mono text-[11px]">+91 70503 49159</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Full Message Article */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-card leading-relaxed text-slate-700">
            <div className="flex items-center gap-3 text-crest-700 border-b border-slate-100 pb-4">
              <Quote className="w-8 h-8 opacity-40" />
              <span className="font-serif italic text-base sm:text-lg font-semibold">
                Principal's Address to Students, Parents, and Patrons
              </span>
            </div>

            <div className="space-y-5 text-sm sm:text-base leading-relaxed">
              <p className="font-medium text-slate-900 text-lg">
                Dear Parents, Guardians, and Esteemed Students,
              </p>

              <p>
                It is my privilege and distinct honor to welcome you to R.B.S Residential Public School, Mahua, Vaishali. Since our establishment in 2008–2009 under the stewardship of our Director, Sri Ram Bachan Singh, RBSRPS has been relentlessly dedicated to creating an environment where young minds blossom into responsible, self-reliant, and morally upright citizens.
              </p>

              <p>
                As Swami Vivekananda said, <em>"Education is the manifestation of the perfection already in man."</em> At R.B.S., we view education not as rote instruction, but as an awakening of inner talent, scientific curiosity, and ethical conviction. Our purpose is to help each student discover their individual strength and nurture it to fruition.
              </p>

              <div className="p-6 my-6 bg-crest-50/70 border-l-4 border-crest-700 rounded-r-2xl space-y-2">
                <p className="font-serif italic text-crest-950 font-semibold text-base sm:text-lg">
                  "Education is the greatest tool for social change. We nurture every child not merely to pass examinations, but to navigate the complexities of the modern world with courage, empathy, and honor."
                </p>
                <p className="text-xs text-crest-800 font-medium">— Mr. Tribhuwan Singh, Principal</p>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 pt-3">
                Our Educational Commitments at RBSRPS
              </h2>

              <p>
                Following the CBSE curriculum and National Curriculum Framework, we combine strong conceptual teaching in Mathematics, Science, and Social Studies with digital smart classrooms, modern laboratories, and regular co-curricular competitions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-crest-800 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Rigorous CBSE +2 Education
                  </div>
                  <p className="text-xs text-slate-600">
                    Comprehensive preparation for 10th and 12th Board examinations in Science, Commerce, and Arts.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-crest-800 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Character & Sanskar
                  </div>
                  <p className="text-xs text-slate-600">
                    Daily morning assembly, moral teachings, cultural heritage celebrations, and mutual respect.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-crest-800 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hands-on Science & Computers
                  </div>
                  <p className="text-xs text-slate-600">
                    Well-equipped laboratories for Physics, Chemistry, and Biology plus high-speed computer training.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-crest-800 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Safe Residential Care & Sports
                  </div>
                  <p className="text-xs text-slate-600">
                    Dedicated hostel facilities for boys and girls, athletic coaching, cricket, volleyball, and yoga.
                  </p>
                </div>
              </div>

              <p>
                I warmly invite parents to visit our campus, observe our classrooms, meet our passionate educators, and experience how R.B.S Residential Public School shapes promising futures.
              </p>

              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-serif text-lg font-bold text-slate-900">Mr. Tribhuwan Singh</p>
                  <p className="text-xs text-slate-500">Principal • R.B.S. Residential Public School, Mahua</p>
                </div>
                <Link to="/contact">
                  <Button variant="outline" size="sm" leftIcon={<Mail className="w-4 h-4" />}>
                    Contact Principal's Office
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Sidebar Details */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Profile Card */}
            <Card className="border-slate-200">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-serif text-lg font-bold text-slate-900">Institutional Highlights</h3>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <GraduationCap className="w-4 h-4 text-crest-600 shrink-0 mt-0.5" />
                    <span>Affiliated to CBSE New Delhi up to Senior Secondary (+2) Level</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-crest-600 shrink-0 mt-0.5" />
                    <span>Streams: Science (PCM/PCB), Commerce, and Arts</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span>Consistently Outstanding 10th & 12th Board Results</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-crest-600 shrink-0 mt-0.5" />
                    <span>Established 2008 – 2009 with Strong Cultural Heritage</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Parent & Visitor Audiences */}
            <Card className="border-slate-200 bg-crest-50/40">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-serif text-base font-bold text-crest-950">Parent & Visitor Appointments</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The Principal and administrative counselors meet parents on working days between 10:00 AM and 1:00 PM for academic consultation and admission discussions.
                </p>
                <div className="pt-2">
                  <Link to="/contact">
                    <Button variant="primary" size="sm" className="w-full">
                      Schedule a Campus Visit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps CTA */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-crest-900 to-crest-950 text-white space-y-3">
              <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">Admissions 2026-2027</span>
              <h4 className="font-serif text-lg font-bold">Enroll at RBSRPS Mahua</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Admissions open for Nursery to Class 11 (+2 Science & Commerce). Secure your child's academic future today.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link to="/admissions">
                  <Button variant="gold" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Begin Admission Registration
                  </Button>
                </Link>
                <Link to="/facilities">
                  <Button variant="ghost" size="sm" className="w-full text-slate-200 hover:text-white hover:bg-crest-800/60">
                    Explore Campus Facilities
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalMessagePage;
