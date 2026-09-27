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
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <SEO
        title="About Oakridge International Academy — History, Values & Leadership"
        description="Founded in 1988, Oakridge International Academy is a premier preparatory school dedicated to intellectual curiosity, moral courage, and global leadership."
        keywords="About Oakridge Academy, school history, IB world school, Cambridge campus, leadership governance"
      />

      <div className="max-w-7xl mx-auto space-y-14">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'About Oakridge' },
          ]}
        />

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-crest-950 text-white p-8 sm:p-12 lg:p-16 border border-crest-900 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold" size="sm">Founded in 1988</Badge>
              <Badge variant="outline" size="sm" className="text-crest-200 border-crest-700">
                IB World School Accredited
              </Badge>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              A Tradition of Academic Brilliance & Ethical Leadership
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              For over three decades, Oakridge International Academy has stood on the steadfast conviction that education must cultivate not only sharp, agile intellects, but compassionate and morally grounded global citizens.
            </p>
          </div>
        </div>

        {/* Head of School Feature Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-card border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-48 h-56 rounded-2xl overflow-hidden shadow-card border-2 border-gold-300 mb-4 bg-slate-900">
              <img
                src="/images/principal.jpg"
                alt="Dr. Eleanor Vance, Principal"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">Dr. Eleanor Vance, Ph.D.</h3>
            <p className="text-xs font-semibold text-crest-700 uppercase tracking-wide">Head of School & Principal</p>
            <p className="text-xs text-slate-400 mt-0.5">Ph.D. Educational Leadership, Harvard University</p>
          </div>

          <div className="lg:col-span-8 space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-10 pt-6 lg:pt-0">
            <span className="text-xs uppercase font-bold tracking-widest text-gold-600">Executive Welcome</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              "Igniting Purpose and Integrity in Every Scholar"
            </h3>
            <p>
              Welcome to Oakridge. Here, our 40-acre campus is alive with intellectual curiosity. Whether students are conducting genetic CRISPR research, performing classical concertos in our auditorium, or debating international policy in model plenary sessions, they do so supported by master educators who know and mentor them as individuals.
            </p>
            <p>
              We believe true education is transformative. It teaches young men and women to question critically, act courageously, and lead with empathy.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <Link to="/principal">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Read Full Principal's Welcome
                </Button>
              </Link>
              <Link to="/faculty">
                <Button variant="ghost" size="sm">
                  Meet Our Faculty Directory
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="primary" size="sm">Our Guiding Virtues</Badge>
            <h2 className="font-serif text-3xl font-bold text-slate-900">The Four Pillars of Oakridge</h2>
            <p className="text-slate-600 text-sm">The foundational virtues that guide our pedagogical framework.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Academic Rigor',
                desc: 'Pursuing intellectual excellence with relentless curiosity, discipline, and scholarly integrity.',
              },
              {
                icon: Shield,
                title: 'Moral Character',
                desc: 'Cultivating honesty, accountability, and the moral courage to advocate for truth and social justice.',
              },
              {
                icon: Compass,
                title: 'Global Vision',
                desc: 'Embracing multicultural viewpoints, foreign language immersion, and active ecological stewardship.',
              },
              {
                icon: Heart,
                title: 'Empathetic Service',
                desc: 'Fostering compassion through mandatory 100+ hours of sustained community service and outreach.',
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
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">Campus Heritage & Milestones</h3>
            <p className="text-xs sm:text-sm text-slate-500">Over three decades of institutional growth and innovation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-serif text-2xl font-bold text-crest-800">1988</span>
              <h5 className="font-bold text-sm text-slate-900">Academy Founded</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Established with 65 inaugural scholars and 8 faculty members in historic Founder’s Hall.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-serif text-2xl font-bold text-crest-800">2004</span>
              <h5 className="font-bold text-sm text-slate-900">IB Accreditation</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Authorized as an International Baccalaureate (IB) World School offering the prestigious Diploma.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-serif text-2xl font-bold text-crest-800">2016</span>
              <h5 className="font-bold text-sm text-slate-900">STEM Innovation Wing</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Opening of the 14,000 sq. ft. robotics and biotechnology research wing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-serif text-2xl font-bold text-gold-600">2026</span>
              <h5 className="font-bold text-sm text-slate-900">Global Campus Expansion</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                LEED Gold sustainable campus expansion and international research fellowship center.
              </p>
            </div>
          </div>
        </div>

        {/* Accreditations & Honors */}
        <div className="bg-crest-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-crest-900">
          <span className="text-xs uppercase font-bold tracking-widest text-gold-400">Accreditations & Global Honors</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold max-w-xl mx-auto">
            Internationally Certified Standards of Academic Excellence
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 max-w-4xl mx-auto text-xs sm:text-sm text-slate-300">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center">
              <Award className="w-6 h-6 text-gold-400 mb-2" />
              <span className="font-bold text-white">IB World School</span>
              <span className="text-[11px] text-slate-400">Diploma & Middle Years</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center">
              <Shield className="w-6 h-6 text-crest-400 mb-2" />
              <span className="font-bold text-white">Cognia Accredited</span>
              <span className="text-[11px] text-slate-400">Quality Assured</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center">
              <Building className="w-6 h-6 text-emerald-400 mb-2" />
              <span className="font-bold text-white">NAIS Member</span>
              <span className="text-[11px] text-slate-400">National Association</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center">
              <Users className="w-6 h-6 text-sky-400 mb-2" />
              <span className="font-bold text-white">AP Capstone</span>
              <span className="text-[11px] text-slate-400">College Board Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
