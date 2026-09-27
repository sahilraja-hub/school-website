import React, { useState } from 'react';
import { BookOpen, Microscope, Music, Trophy, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AcademicsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'stem' | 'arts' | 'athletics'>('curriculum');

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-crest-600 bg-crest-50 px-3 py-1 rounded-full border border-crest-100">
            Academics & Enrichment
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
            An Inspiring Curriculum for Tomorrow's Leaders
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Rooted in international inquiry and rigorous intellectual pursuit, our academic divisions support students at every stage from early childhood through college matriculation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-slate-200/80 rounded-xl space-x-1 text-xs sm:text-sm font-semibold">
            {[
              { id: 'curriculum', label: 'Divisions & Stages', icon: BookOpen },
              { id: 'stem', label: 'STEM & Robotics Hub', icon: Microscope },
              { id: 'arts', label: 'Arts Conservatory', icon: Music },
              { id: 'athletics', label: 'Athletics & Wellness', icon: Trophy },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-white text-crest-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content 1: Divisions */}
        {activeTab === 'curriculum' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-crest-600 bg-crest-50 px-2.5 py-1 rounded-full">
                Kindergarten - Grade 5
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900">Primary Academy</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Foundational mastery through inquiry-based learning, Singapore Math, phonics-based literacy, and foreign language immersion.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Singapore Math Foundations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dual-language French/Spanish tracks</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Hands-on Maker Space lab</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full">
                Grades 6 - 8
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900">Middle School</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Strengthening critical analysis, scientific inquiry, essay writing, and collaborative project defense across diverse disciplines.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Accelerated Pre-AP tracks</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Model United Nations & Debate</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Comprehensive science lab rotations</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Grades 9 - 12
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900">Senior High School</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Preparation for Ivy League and prestigious global universities. Offers 28 AP courses and the distinguished AP Capstone Diploma.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 28 AP and Post-AP Electives</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dedicated College Counselors</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Senior Research Capstone Defense</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab Content 2: STEM */}
        {activeTab === 'stem' && (
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-crest-600 bg-crest-50 px-2.5 py-1 rounded-full">
                Innovation Center
              </span>
              <h3 className="font-serif text-3xl font-bold text-slate-900">Robotics & Applied Artificial Intelligence Hub</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our 14,000-square-foot STEM facility offers industrial-grade 3D rapid prototyping, CNC milling machines, and dedicated robotics test arenas. Students partner with local tech mentors to build competitive robots and train ML models.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="block font-bold text-slate-900">FIRST Robotics Team</span>
                  <span className="text-slate-500">Regional Champions 2024-2026</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="block font-bold text-slate-900">Biotech Genomics Lab</span>
                  <span className="text-slate-500">PCR and Gel Electrophoresis</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
              <img src="/images/stem-lab.jpg" alt="Oakridge STEM Center" className="w-full h-80 object-cover" />
            </div>
          </div>
        )}

        {/* Tab Content 3: Arts */}
        {activeTab === 'arts' && (
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full">
                Creativity & Expression
              </span>
              <h3 className="font-serif text-3xl font-bold text-slate-900">Visual & Performing Arts Conservatory</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Featuring a 650-seat proscenium theater, black box studio, sound recording booth, and ceramics kiln studios. Our students stage two Broadway-caliber musicals annually and perform at Carnegie Hall.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Symphony Orchestra</h4>
                <p className="text-xs text-slate-600">Classical strings, woodwinds, and percussion ensemble directed by Juilliard alumni.</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Theater & Dramatic Arts</h4>
                <p className="text-xs text-slate-600">Full-scale theatrical production, stagecraft, lighting engineering, and costume design.</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Studio Fine Arts</h4>
                <p className="text-xs text-slate-600">Oil painting, darkroom photography, digital illustration, and ceramic sculptures.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 4: Athletics */}
        {activeTab === 'athletics' && (
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Physical Health & Leadership
              </span>
              <h3 className="font-serif text-3xl font-bold text-slate-900">Championship Varsity Athletics</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                With 18 varsity sports, an Olympic-regulation natatorium, all-weather turf stadium, and NCAA collegiate athletic placement advisors.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800 text-sm">Soccer & Track</div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800 text-sm">Basketball & Volleyball</div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800 text-sm">Swimming & Water Polo</div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800 text-sm">Tennis & Rowing</div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            to="/admissions"
            className="inline-flex items-center gap-2 bg-crest-700 hover:bg-crest-800 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md"
          >
            <span>Apply for the 2026 Academic Year</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
