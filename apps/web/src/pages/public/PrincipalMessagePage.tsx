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
} from 'lucide-react';

export const PrincipalMessagePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <SEO
        title="Principal's Message — Dr. Eleanor Vance"
        description="Read the official welcome message from Dr. Eleanor Vance, Principal of Oakridge International Academy. Discover our educational philosophy and commitment to moral leadership and intellectual excellence."
        keywords="Oakridge Principal, Dr Eleanor Vance, Head of School, Oakridge Academy message, educational philosophy"
      />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'About Oakridge', href: '/about' },
            { label: "Principal's Welcome" },
          ]}
        />

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-crest-950 text-white p-8 sm:p-12 lg:p-16 border border-crest-900 shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Header */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="gold" size="sm">Office of the Head of School</Badge>
                <Badge variant="outline" size="sm" className="text-crest-200 border-crest-700">
                  Leadership
                </Badge>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                "Cultivating Minds, Inspiring Character, Shaping the Future."
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                A warm welcome from Dr. Eleanor Vance, Head of School at Oakridge International Academy. Here, every scholar is nurtured to lead with integrity, think critically, and innovate fearlessly.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-gold-400" /> Ph.D. Harvard University
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-crest-400" /> 26+ Years Academic Leadership
                </span>
              </div>
            </div>

            {/* Right Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-gold-500 to-crest-500 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition duration-300" />
                <div className="relative rounded-2xl overflow-hidden border-2 border-gold-400/40 shadow-2xl bg-slate-900">
                  <img
                    src="/images/principal.jpg"
                    alt="Dr. Eleanor Vance, Principal of Oakridge International Academy"
                    className="w-full h-80 sm:h-96 object-cover object-top"
                  />
                  <div className="p-4 bg-slate-900/90 backdrop-blur-sm border-t border-slate-800 text-left">
                    <h3 className="font-serif text-base font-bold text-white">Dr. Eleanor Vance</h3>
                    <p className="text-xs text-gold-400">Head of School & Executive Principal</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Oakridge International Academy</p>
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
                An Open Letter to Our Students, Families, and Global Community
              </span>
            </div>

            <div className="space-y-5 text-sm sm:text-base leading-relaxed">
              <p className="font-medium text-slate-900 text-lg">
                Dear Students, Families, and Valued Friends,
              </p>

              <p>
                Welcome to Oakridge International Academy. It is an extraordinary honor to welcome you to a community where academic brilliance is indivisible from moral courage and humanitarian empathy.
              </p>

              <p>
                When our founders laid the cornerstone of Oakridge in 1988, they envisioned an institution that would transcend traditional rote instruction. Today, our 40-acre Cambridge campus is alive with young scholars engaged in collegiate-level scientific inquiry, defending capstone theses in our humanities forums, composing original symphonic movements, and demonstrating athletic resilience on our championship fields.
              </p>

              <div className="p-6 my-6 bg-crest-50/70 border-l-4 border-crest-700 rounded-r-2xl space-y-2">
                <p className="font-serif italic text-crest-950 font-semibold text-base sm:text-lg">
                  "Education is not merely the acquisition of credentials; it is the deliberate cultivation of wisdom, ethical discernment, and a lifelong thirst for truth."
                </p>
                <p className="text-xs text-crest-800 font-medium">— Dr. Eleanor Vance</p>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 pt-3">
                Our Educational Philosophy in Action
              </h2>

              <p>
                At Oakridge, we balance the rigor of the International Baccalaureate (IB) and Advanced Placement (AP) curricula with individualized mentorship. With an intentional 1:8 faculty-to-scholar ratio, our world-class educators do not merely teach subjects—they mentor human beings.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-crest-800 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Intellectual Rigor
                  </div>
                  <p className="text-xs text-slate-600">
                    Dual AP Capstone & IB Diploma pathways with university-grade research labs.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-crest-800 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Global Citizenship
                  </div>
                  <p className="text-xs text-slate-600">
                    Over 100 hours of community service and exchange delegations across 14 nations.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-crest-800 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Whole-Person Wellness
                  </div>
                  <p className="text-xs text-slate-600">
                    Dedicated pastoral care, collegiate athletic facilities, and fine arts centers.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-crest-800 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ethical Innovation
                  </div>
                  <p className="text-xs text-slate-600">
                    Ethics in AI, sustainability leadership, and civic responsibility frameworks.
                  </p>
                </div>
              </div>

              <p>
                Whether you are exploring our admissions process for the upcoming academic cycle or already a cherished member of our academy family, I invite you to walk our halls, observe our vibrant laboratories, and witness first-hand the spark of curiosity that defines an Oakridge scholar.
              </p>

              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-serif text-lg font-bold text-slate-900">Dr. Eleanor Vance, Ph.D.</p>
                  <p className="text-xs text-slate-500">Head of School • Oakridge International Academy</p>
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
                <h3 className="font-serif text-lg font-bold text-slate-900">Executive Credentials</h3>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <GraduationCap className="w-4 h-4 text-crest-600 shrink-0 mt-0.5" />
                    <span>Ph.D. in Educational Leadership & Policy, Harvard University</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-crest-600 shrink-0 mt-0.5" />
                    <span>M.A. in Curriculum Development, Stanford University</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span>Recipient of National Distinguished Principal Award (2021)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-crest-600 shrink-0 mt-0.5" />
                    <span>Chairperson, International Baccalaureate Regional Review Board</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Office Hours & Appointments */}
            <Card className="border-slate-200 bg-crest-50/40">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-serif text-base font-bold text-crest-950">Parent & Visitor Audiences</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dr. Vance holds weekly open office forums for registered academy parents and prospective scholarship candidates every Thursday morning.
                </p>
                <div className="pt-2">
                  <Link to="/contact">
                    <Button variant="primary" size="sm" className="w-full">
                      Request an Appointment
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps CTA */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-crest-900 to-crest-950 text-white space-y-3">
              <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">Admissions 2026-2027</span>
              <h4 className="font-serif text-lg font-bold">Ready to Join Our Community?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Experience our academic culture firsthand during our upcoming Campus Open House.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link to="/admissions">
                  <Button variant="gold" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Begin Application
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
