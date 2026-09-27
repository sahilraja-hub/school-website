import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  Card,
  CardContent,
  Badge,
  Button,
  Modal,
} from '../../components/ui';
import { SEO } from '../../components/common/SEO';
import {
  Building2,
  Cpu,
  BookOpen,
  Trophy,
  Palette,
  Shield,
  Clock,
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface FacilityItem {
  id: string;
  title: string;
  category: 'Academics' | 'Athletics' | 'Arts' | 'Campus Life';
  image: string;
  description: string;
  features: string[];
  specifications: string;
}

const facilityItems: FacilityItem[] = [
  {
    id: 'fac1',
    title: 'University-Grade STEM & Bio-Chemical Labs',
    category: 'Academics',
    image: '/images/stem-lab.jpg',
    description: 'Six fully equipped wet and dry research laboratories designed for collegiate genetics, physics simulations, robotics prototyping, and 3D additive manufacturing.',
    features: ['CRISPR gene editing simulators', 'Class 100 laminar flow hoods', 'Industrial CNC & 3D printers', 'Spectrophotometers & Vernier sensors'],
    specifications: '14,000 sq. ft. • 6 Research Suites • BSL-2 Certified',
  },
  {
    id: 'fac2',
    title: 'Alexander Media Library & Learning Commons',
    category: 'Academics',
    image: '/images/library.jpg',
    description: 'A two-story architectural centerpiece with soaring double-height timber ceilings, silent reading pods, digital archives, and over 45,000 catalogued volumes.',
    features: ['Direct JSTOR & IEEE access', 'Collaborative video conference pods', 'Quiet contemplation mezzanine', 'Dedicated academic research librarians'],
    specifications: '22,000 sq. ft. • 45,000+ Volumes • 350 Study Stations',
  },
  {
    id: 'fac3',
    title: 'Championship Athletics Stadium & Blue Track',
    category: 'Athletics',
    image: '/images/athletics.jpg',
    description: 'Olympic-grade athletic complex featuring an all-weather 8-lane running track, FIFA-standard turf soccer stadium, stadium lighting, and 2,500-seat grandstand.',
    features: ['Mondo Olympic synthetic track', 'Championship floodlighting', 'Full varsity locker pavilions', 'Integrated electronic timing systems'],
    specifications: '2,500 Spectator Capacity • 8 Lanes • FIFA 2-Star Turf',
  },
  {
    id: 'fac4',
    title: 'Historic Cambridge Quad & Founder’s Hall',
    category: 'Campus Life',
    image: '/images/campus-hero.jpg',
    description: 'The iconic Gothic and modern synthesis courtyard where daily convocations, outdoor recitals, and senior baccalaureate ceremonies unfold beneath century-old maples.',
    features: ['Central clock tower carillon', 'High-speed campus-wide mesh Wi-Fi', 'Stone amphitheater steps', 'Eco-filtered reflection pond'],
    specifications: '40 Acres Total Campus • Historic Landmark Status',
  },
];

export const FacilitiesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [tourModalOpen, setTourModalOpen] = useState(false);

  const categories = [
    { id: 'ALL', label: 'All Campus Facilities' },
    { id: 'Academics', label: 'Academic & Research Labs' },
    { id: 'Athletics', label: 'Athletics & Recreation' },
    { id: 'Campus Life', label: 'Student Life & Quad' },
  ];

  const filteredFacilities = activeCategory === 'ALL'
    ? facilityItems
    : facilityItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <SEO
        title="World-Class Campus & Learning Facilities"
        description="Explore Oakridge International Academy's 40-acre campus. Featuring university-grade STEM labs, two-story media library, Olympic championship track, and historic quad."
        keywords="Oakridge campus facilities, school library, science labs, athletic stadium, campus map"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'About Oakridge', href: '/about' },
            { label: 'Campus & Facilities' },
          ]}
        />

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-crest-950 text-white p-8 sm:p-12 lg:p-16 border border-crest-900 shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold" size="sm">40-Acre Cambridge Campus</Badge>
              <Badge variant="outline" size="sm" className="text-crest-200 border-crest-700">
                Eco-Sustainable LEED Gold
              </Badge>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              An Inspiring Architectural Sanctuary for Intellectual Growth
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every square foot of Oakridge International Academy is deliberately crafted to stimulate curiosity, foster collaboration, and empower achievement. From state-of-the-art biological suites to sunlight-drenched reading lofts, our campus is designed to rival top collegiate institutions.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                variant="gold"
                size="md"
                onClick={() => setTourModalOpen(true)}
                leftIcon={<Compass className="w-4 h-4" />}
              >
                Schedule Campus Walkthrough
              </Button>
              <Link to="/contact">
                <Button variant="outline" size="md" className="text-slate-200 border-slate-700 hover:bg-crest-900">
                  Campus Directions & Map
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Category Switcher */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === c.id
                  ? 'bg-crest-700 text-white shadow-card'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Facilities Showcase Cards */}
        <div className="space-y-12">
          {filteredFacilities.map((fac, idx) => (
            <div
              key={fac.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Preview */}
              <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-subtle border border-slate-200 group">
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="w-full h-72 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Description & Features */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">{fac.category}</Badge>
                  <span className="text-xs font-mono text-slate-400">{fac.specifications}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                  {fac.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {fac.description}
                </p>

                {/* Feature Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {fac.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTourModalOpen(true)}
                  >
                    View on Campus Map
                  </Button>
                  <Link to="/admissions">
                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Experience in Person
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Campus Safety & Sustainability Callout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-crest-100 text-crest-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-slate-900">24/7 Monitored Campus Perimeter</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Biometric access control, on-duty campus safety officers, and complete CCTV perimeter coverage ensuring an uncompromised environment.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-slate-900">LEED Gold Certified Sustainability</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              100% solar powered academic wing, rainwater harvesting for botanical gardens, and zero single-use plastics academy-wide.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-slate-900">Health Clinic & Sports Medicine</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Full-time registered pediatric nurses, dedicated mental wellness suites, and athletic trainers on-site every school day.
            </p>
          </div>
        </div>

        {/* Schedule Tour Modal */}
        <Modal
          isOpen={tourModalOpen}
          onClose={() => setTourModalOpen(false)}
          title="Schedule an In-Person Campus Walkthrough"
          description="Join our admissions team for an executive 60-minute tour of our academic, research, and athletic facilities."
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setTourModalOpen(false)}>Close</Button>
              <Link to="/contact">
                <Button variant="primary" size="sm">Book Tour via Admissions</Button>
              </Link>
            </>
          }
        >
          <div className="space-y-4 text-xs text-slate-600">
            <p className="leading-relaxed">
              Tours depart Tuesday and Thursday mornings at 9:30 AM and 1:30 PM from the Founder’s Hall Reception Pavilion.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-slate-900 block">Required for Campus Entry:</span>
              <p>• Government-issued photo identification</p>
              <p>• Prior reservation confirmed by Admissions Office</p>
              <p>• Visitor badge worn at all times while on grounds</p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default FacilitiesPage;
