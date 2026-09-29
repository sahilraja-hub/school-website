import React, { useState } from 'react';
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
  Bus,
  Home,
  Monitor,
  Phone,
} from 'lucide-react';

interface FacilityItem {
  id: string;
  title: string;
  category: 'Academics' | 'Residential' | 'Sports' | 'Transport';
  image: string;
  description: string;
  features: string[];
  specifications: string;
}

const facilityItems: FacilityItem[] = [
  {
    id: 'fac1',
    title: 'Modern Science & Computer Laboratories',
    category: 'Academics',
    image: '/images/stem-lab.jpg',
    description: 'Fully equipped practical laboratories for Physics, Chemistry, and Biology compliant with CBSE Senior Secondary standards, alongside a networked Computer Center with high-speed internet.',
    features: [
      'Individual apparatus sets for Physics & Chemistry practicals',
      'Advanced optical microscopes & biological specimens',
      'Modern computer workstations with software tools',
      'Certified laboratory safety & emergency eyewash stations',
    ],
    specifications: 'Dedicated Physics, Chemistry, Biology & Computer Labs',
  },
  {
    id: 'fac2',
    title: 'Central School Library & Reading Room',
    category: 'Academics',
    image: '/images/library.jpg',
    description: 'A serene learning sanctuary housing over 5,000 reference textbooks, NCERT guides, competitive exam materials for JEE/NEET, encyclopedias, children literature, and daily newspapers.',
    features: [
      'Comprehensive collection of NCERT & CBSE reference books',
      'National dailies, science journals, and educational magazines',
      'Quiet individual reading stations and study desks',
      'Managed by qualified school librarian',
    ],
    specifications: '5,000+ Volumes • Reference & Reading Section',
  },
  {
    id: 'fac3',
    title: 'Separate Boys & Girls Residential Hostels',
    category: 'Residential',
    image: '/images/campus-hero.jpg',
    description: 'Safe, comfortable, and well-managed residential boarding hostels with round-the-clock security, caring wardens, clean dining mess providing nutritious vegetarian meals, and guided evening study hours.',
    features: [
      'Dedicated hostel buildings with separate security for boys & girls',
      'Hygienic dining hall serving fresh, nutritious balanced meals',
      'Supervised evening study sessions with subject teachers',
      'Regular medical checkups & 24/7 warden supervision',
    ],
    specifications: 'Residential Boarding • 24/7 Security & Care',
  },
  {
    id: 'fac4',
    title: 'Sports Grounds, Athletics & Martial Arts Arena',
    category: 'Sports',
    image: '/images/athletics.jpg',
    description: 'Spacious outdoor playgrounds and sports courts dedicated to student physical fitness, team spirit, and athletic development under experienced physical education coaches.',
    features: [
      'Cricket pitch, football ground, and volleyball courts',
      'Badminton arena, table tennis, and indoor chess/carrom',
      'Yoga, physical training (PT), and morning exercise drills',
      'Annual athletic sports meets and inter-house tournaments',
    ],
    specifications: 'Multi-Sport Playground • Professional Physical Training',
  },
  {
    id: 'fac5',
    title: 'Safe Bus & Transportation Fleet',
    category: 'Transport',
    image: '/images/campus-hero.jpg',
    description: 'A fleet of well-maintained school buses providing safe and punctual pick-and-drop service for students covering Mahua town, Patepur, Kowahi, Jandaha, and surrounding villages across Vaishali district.',
    features: [
      'Well-experienced and verified drivers and bus attendants',
      'Safety equipment, first-aid kits, and speed governors installed',
      'Convenient designated pickup and drop-off points',
      'Supervised boarding and de-boarding of primary students',
    ],
    specifications: 'Fleet Covering Mahua, Patepur & Vaishali',
  },
];

export const FacilitiesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Campus Facilities' },
    { id: 'Academics', label: 'Labs & Smart Class' },
    { id: 'Residential', label: 'Hostel & Boarding' },
    { id: 'Sports', label: 'Sports & Playgrounds' },
    { id: 'Transport', label: 'Bus Transportation' },
  ];

  const filteredFacilities = activeCategory === 'ALL'
    ? facilityItems
    : facilityItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <SEO
        title="Campus Infrastructure & Facilities — R.B.S Residential Public School"
        description="Explore the infrastructure of R.B.S Residential Public School, Mahua, Vaishali: CBSE Science and Computer labs, Central Library, separate Boys and Girls residential hostels, sports fields, and bus transport."
        keywords="RBS School facilities, hostel in Mahua, school bus Vaishali, RBSRPS campus, CBSE science lab Mahua"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'About Us', href: '/about' },
            { label: 'Campus & Facilities' },
          ]}
        />

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-crest-950 text-white p-8 sm:p-12 lg:p-16 border border-crest-900 shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold" size="sm">Mahua Campus, Vaishali</Badge>
              <Badge variant="outline" size="sm" className="text-crest-200 border-crest-700">
                Residential & Day Boarding
              </Badge>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              A Supportive, Secure & Stimulating Learning Environment
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              At R.B.S. Residential Public School, our campus infrastructure is designed to provide students with hands-on practical learning, disciplined residential living, athletic health, and safe daily transit.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/contact">
                <Button variant="gold" size="md" leftIcon={<Compass className="w-4 h-4" />}>
                  Plan a Campus Walkthrough
                </Button>
              </Link>
              <Link to="/admissions">
                <Button variant="outline" size="md" className="text-slate-200 border-slate-700 hover:bg-crest-900">
                  Admissions Information
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
                  <Link to="/contact">
                    <Button variant="outline" size="sm">
                      Inquire About This Facility
                    </Button>
                  </Link>
                  <Link to="/admissions">
                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Admissions Desk
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Safety, Residential & Transport Callout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-crest-100 text-crest-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-slate-900">Safe Campus & CCTV Security</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              24/7 monitored gate entry, high boundary walls, and active CCTV camera surveillance across academic blocks and hostel corridors.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-slate-900">Digital Interactive Classrooms</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Modern audio-visual smart classes equipped with digital boards to make complex scientific concepts and mathematics vivid and memorable.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-slate-900">Hostel Wardens & Health Care</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Resident hostel wardens, first-aid medical supplies, on-call doctor availability, and strict health and hygiene standards in kitchen mess.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilitiesPage;
