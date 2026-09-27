import React from 'react';
import { Award, Compass, Heart, Shield, BookOpen, CheckCircle2, Users, Building } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-crest-600 bg-crest-50 px-3 py-1 rounded-full border border-crest-100">
            About Oakridge Academy
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
            A Tradition of Academic Brilliance & Ethical Leadership
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Founded in 1988, Oakridge International Academy was established on the conviction that education should cultivate not only keen intellects, but compassionate global citizens.
          </p>
        </div>

        {/* Head of School Section */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-slate-200 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-1 flex flex-col items-center text-center">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
              alt="Principal Margaret Harrison"
              className="w-48 h-48 rounded-2xl object-cover shadow-md mb-4 border-2 border-crest-100"
            />
            <h3 className="font-serif text-xl font-bold text-slate-900">Dr. Margaret Harrison</h3>
            <p className="text-xs font-semibold text-crest-700 uppercase tracking-wide">Head of School & Principal</p>
            <p className="text-xs text-slate-400 mt-1">Ph.D. Education, Oxford University</p>
          </div>

          <div className="lg:col-span-2 space-y-4 text-slate-600 text-sm leading-relaxed border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8 pt-6 lg:pt-0">
            <h4 className="font-serif text-2xl font-bold text-slate-900">"Igniting Purpose in Every Child"</h4>
            <p>
              Welcome to Oakridge International Academy. Here, our campus is alive with intellectual curiosity. Whether students are running astrophysical simulations, performing classical concertos, or debating international policy, they do so supported by world-class educators who know and value them as individuals.
            </p>
            <p>
              We believe true education is transformative. It teaches young women and men to question critically, act courageously, and lead empathetically. We invite you to experience the vibrancy of our community.
            </p>
            <div className="pt-2">
              <span className="font-serif italic text-base text-slate-800">— Margaret Harrison, Ph.D.</span>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl font-bold text-slate-900">Our Core Pillars</h2>
            <p className="text-slate-600 text-sm">The foundational virtues that guide our pedagogical framework.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Academic Rigor',
                desc: 'Pursuing intellectual excellence with curiosity, diligence, and scholarly integrity.',
              },
              {
                icon: Shield,
                title: 'Moral Character',
                desc: 'Cultivating honesty, accountability, and the courage to advocate for justice.',
              },
              {
                icon: Compass,
                title: 'Global Vision',
                desc: 'Embracing multicultural viewpoints and fostering active stewardship of our planet.',
              },
              {
                icon: Heart,
                title: 'Empathy & Care',
                desc: 'Supporting one another within an inclusive, collaborative community.',
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-crest-50 text-crest-700 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accreditations & Partnerships */}
        <div className="bg-crest-950 text-white rounded-2xl p-8 sm:p-12 text-center space-y-6">
          <span className="text-xs uppercase font-bold tracking-widest text-gold-400">Accreditations & Honors</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold max-w-xl mx-auto">
            Internationally Recognized Standards of Excellence
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 max-w-4xl mx-auto text-xs sm:text-sm text-slate-300">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
              <Award className="w-6 h-6 text-gold-400 mb-2" />
              <span className="font-bold text-white">IB World School</span>
              <span className="text-[11px] text-slate-400">Primary & Diploma Years</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
              <Building className="w-6 h-6 text-crest-400 mb-2" />
              <span className="font-bold text-white">Cognia Accredited</span>
              <span className="text-[11px] text-slate-400">Comprehensive Quality</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
              <Users className="w-6 h-6 text-emerald-400 mb-2" />
              <span className="font-bold text-white">Cambridge Assessment</span>
              <span className="text-[11px] text-slate-400">International Center</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
              <Shield className="w-6 h-6 text-sky-400 mb-2" />
              <span className="font-bold text-white">College Board</span>
              <span className="text-[11px] text-slate-400">AP Capstone Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
