import React, { useState } from 'react';
import { BookOpen, Microscope, Music, Trophy, ChevronRight, CheckCircle2, ArrowRight, Laptop, Award, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Badge } from '../../components/ui';
import { SEO } from '../../components/common/SEO';

export const AcademicsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'stem' | 'commerce' | 'co-curricular'>('curriculum');

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <SEO
        title="Academics & CBSE Curriculum — R.B.S. Residential Public School"
        description="Comprehensive CBSE curriculum from Pre-Primary to Class 12 (+2 Science: PCM/PCB, Commerce, Arts) at R.B.S Residential Public School, Mahua, Vaishali. Smart classrooms, state-of-the-art laboratories, and experiential learning."
        keywords="RBS School curriculum, CBSE 10th and 12th Mahua, Science Commerce stream Vaishali, RBSRPS academics, Smart class Mahua"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Academics & Curriculum' },
          ]}
        />
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-crest-600 bg-crest-50 px-3 py-1 rounded-full border border-crest-100">
            CBSE Curriculum & Holistic Pedagogy
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Academic Excellence from Foundation to +2 Senior Secondary
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Affiliated to the Central Board of Secondary Education (CBSE), New Delhi, R.B.S. Residential Public School prepares students with rigorous conceptual understanding, practical experimentation, and moral character.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-slate-200/80 rounded-xl space-x-1 text-xs sm:text-sm font-semibold">
            {[
              { id: 'curriculum', label: 'Academic Stages (Pre-Primary to 10th)', icon: BookOpen },
              { id: 'stem', label: 'Senior Secondary (+2 Science)', icon: Microscope },
              { id: 'commerce', label: 'Senior Secondary (+2 Commerce & Arts)', icon: Laptop },
              { id: 'co-curricular', label: 'Sports, Arts & Values', icon: Trophy },
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
                Nursery to Class 5
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900">Foundational & Primary Stage</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Activity-based learning, phonics, Hindi and English language development, foundational numeracy, and environmental awareness in a warm, caring setting.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Playful, experiential learning methods</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Bilingual English & Hindi fluency</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Moral education & sanskar stories</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Introduction to basic computer concepts</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full">
                Classes 6 to 8
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900">Middle School Stage</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Strengthening analytical reasoning, scientific experimentation, mathematical problem-solving, and third language introduction following NCERT guidelines.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Hands-on Science laboratory experiments</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sanskrit / Third language integration</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Computer applications and typing skills</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Debate, elocution & quiz competitions</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Classes 9 & 10
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900">Secondary Stage (CBSE 10th)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Structured preparation for the CBSE All India Secondary School Examination (AISSE) with regular mock tests, concept clearing, and remedial sessions.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Mathematics & Science deep conceptual mastery</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Social Science, English & Hindi courses</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Pre-board practice series and evaluation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Career guidance for +2 stream selection</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab Content 2: STEM & +2 Science */}
        {activeTab === 'stem' && (
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-wider text-crest-600 bg-crest-50 px-2.5 py-1 rounded-full">
                Senior Secondary (+2 Science)
              </span>
              <h3 className="font-serif text-3xl font-bold text-slate-900">PCM & PCB Streams for JEE & NEET</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our Senior Secondary Science division prepares scholars for CBSE Class 12 Board examinations as well as competitive entrance tests including JEE Main/Advanced and NEET. Equipped with dedicated Physics, Chemistry, and Biology laboratories.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="block font-bold text-slate-900">PCM Stream</span>
                  <span className="text-slate-500">Physics, Chemistry, Maths, Computer Science / Physical Ed.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="block font-bold text-slate-900">PCB Stream</span>
                  <span className="text-slate-500">Physics, Chemistry, Biology, English Core, Physical Ed.</span>
                </div>
              </div>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Experienced Senior Secondary faculty</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Regular practical sessions & lab files</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Doubt-clearing hours for hostelers and day scholars</li>
              </ul>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
              <img src="/images/stem-lab.jpg" alt="RBS Science Laboratories" className="w-full h-80 object-cover" />
            </div>
          </div>
        )}

        {/* Tab Content 3: Commerce & Arts */}
        {activeTab === 'commerce' && (
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full">
                Commerce & Humanities Streams
              </span>
              <h3 className="font-serif text-3xl font-bold text-slate-900">+2 Senior Secondary Commerce & Arts</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Nurturing future chartered accountants, entrepreneurs, civil servants, and economists with a sound understanding of business principles, economics, and social structures.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Accountancy & Business</h4>
                <p className="text-xs text-slate-600">Financial accounting, company accounts, business organization, and entrepreneurship skills.</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Economics & Mathematics</h4>
                <p className="text-xs text-slate-600">Micro & Macro Economics, Indian Economic Development, and applied statistics.</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Humanities & Social Studies</h4>
                <p className="text-xs text-slate-600">History, Political Science, Geography, and Language Arts preparing students for CUET and UPSC foundations.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 4: Co-Curricular & Sports */}
        {activeTab === 'co-curricular' && (
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Physical Education & Culture
              </span>
              <h3 className="font-serif text-3xl font-bold text-slate-900">Co-Curricular, Sports & Sanskar</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                At RBSRPS, education extends beyond textbooks. We provide dedicated coaching in athletic sports, yoga, cultural arts, and value education.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800 text-sm">Cricket & Football</div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800 text-sm">Volleyball & Badminton</div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800 text-sm">Yoga & Morning PT</div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800 text-sm">Music, Drama & Debating</div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            to="/admissions"
            className="inline-flex items-center gap-2 bg-crest-700 hover:bg-crest-800 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md"
          >
            <span>Apply for Admission at RBSRPS (Session 2026-2027)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AcademicsPage;
