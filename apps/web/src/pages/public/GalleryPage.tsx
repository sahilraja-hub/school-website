import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  Badge,
  Button,
  Modal,
} from '../../components/ui';
import { SEO } from '../../components/common/SEO';
import {
  Camera,
  Maximize2,
  Calendar,
  Tag,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'Campus' | 'Science' | 'Sports' | 'Arts' | 'Events';
  image: string;
  date: string;
  caption: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Historic Cambridge Quad Autumn Morning',
    category: 'Campus',
    image: '/images/campus-hero.jpg',
    date: 'Fall Term',
    caption: 'Students conversing between morning lectures in front of Founder’s Hall clock tower.',
  },
  {
    id: 'g2',
    title: 'Advanced Bio-Genetics Research Session',
    category: 'Science',
    image: '/images/stem-lab.jpg',
    date: 'Spring Research Symposium',
    caption: 'Grade 11 IB Biology scholars conducting CRISPR electrophoresis gel analysis under laminar hoods.',
  },
  {
    id: 'g3',
    title: 'Alexander Media Library Learning Pods',
    category: 'Campus',
    image: '/images/library.jpg',
    date: 'Academic Term',
    caption: 'Scholars collaborating in our double-height timber commons overlooking the campus botanical preserve.',
  },
  {
    id: 'g4',
    title: 'Varsity Invitational Track & Field Final',
    category: 'Sports',
    image: '/images/athletics.jpg',
    date: 'State Championship',
    caption: 'The Oakridge Lions 4x400m relay squad securing the regional gold medal on our Olympic Mondotrack.',
  },
  {
    id: 'g5',
    title: 'Executive Welcome & Mentorship Forum',
    category: 'Events',
    image: '/images/principal.jpg',
    date: 'Baccalaureate Week',
    caption: 'Head of School Dr. Eleanor Vance addressing graduating seniors in the university archives collection.',
  },
  {
    id: 'g6',
    title: 'Autonomous Robotics Testing Arena',
    category: 'Science',
    image: '/images/stem-lab.jpg',
    date: 'FIRST Regional',
    caption: 'Robotics engineering team assembling the autonomous vision-guidance chassis for national competition.',
  },
];

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Photographs' },
    { id: 'Campus', label: 'Campus & Architecture' },
    { id: 'Science', label: 'Science & Innovation' },
    { id: 'Sports', label: 'Athletics & Teams' },
    { id: 'Events', label: 'Academic Events' },
  ];

  const filteredItems = selectedCategory === 'ALL'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <SEO
        title="Photo Gallery & Campus Life"
        description="Experience daily life at Oakridge International Academy through our curated photography showcase: academic laboratories, athletics, arts, and historic campus grounds."
        keywords="Oakridge photo gallery, school pictures, campus photography, student life images"
      />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Campus Life', href: '/about' },
            { label: 'Photo & Media Gallery' },
          ]}
        />

        {/* Header */}
        <div className="border-b border-slate-200 pb-8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-crest-100 text-crest-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" /> Visual Chronicle
            </span>
            <Badge variant="gold" size="sm">High-Resolution Photography</Badge>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
            A Glimpse into the Oakridge Experience
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
            From breakthrough laboratory discoveries to championship athletic celebrations, explore visual moments of inspiration and camaraderie across our 40-acre campus.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === c.id
                  ? 'bg-crest-700 text-white shadow-card'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col"
            >
              {/* Image Frame */}
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                    <Maximize2 className="w-4 h-4 text-gold-400" /> Click to enlarge
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge variant="gold" size="sm">{item.category}</Badge>
                </div>
              </div>

              {/* Caption & Metadata */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-crest-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                    {item.caption}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </span>
                  <span className="text-crest-600 font-semibold group-hover:underline">
                    View Photo →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <Modal
            isOpen={!!activePhoto}
            onClose={() => setActivePhoto(null)}
            maxWidth="2xl"
            title={activePhoto.title}
            description={`Category: ${activePhoto.category} • ${activePhoto.date}`}
            footer={
              <Button variant="outline" size="sm" onClick={() => setActivePhoto(null)}>
                Close Preview
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-modal bg-slate-950 max-h-[60vh] flex items-center justify-center">
                <img
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  className="w-full max-h-[60vh] object-contain"
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activePhoto.caption}
              </p>
            </div>
          </Modal>
        )}

        {/* Visit in Person Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-crest-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-crest-900 shadow-xl">
          <div className="space-y-2 max-w-xl text-left">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">Campus Admissions</span>
            <h3 className="font-serif text-2xl font-bold">Experience Oakridge in Person</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Photographs convey only a fraction of our vibrant community spirit. We invite you to join us for an in-person guided tour.
            </p>
          </div>
          <Link to="/admissions">
            <Button variant="gold" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Schedule Admissions Visit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
