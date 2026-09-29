import React, { useState, useEffect } from 'react';
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
import { api } from '../../services/api';

interface GalleryItem {
  id: string;
  title: string;
  category: 'Campus' | 'Science' | 'Sports' | 'Arts' | 'Events';
  image: string;
  date: string;
  caption: string;
  altText?: string;
}

const defaultGalleryItems: GalleryItem[] = [
  {
    id: 'g1',
    title: 'RBS School Main Academic Block & Campus Grounds',
    category: 'Campus',
    image: '/images/campus-hero.jpg',
    date: 'Mahua Campus',
    caption: 'Students assembling outside the main academic wing on Patepur Road, Mahua for morning assembly.',
    altText: 'RBS Residential Public School main campus building and grounds in Mahua Vaishali',
  },
  {
    id: 'g2',
    title: 'Senior Secondary CBSE Science Practical Session',
    category: 'Science',
    image: '/images/stem-lab.jpg',
    date: 'Science Laboratory',
    caption: 'Class 11 & 12 scholars performing titration and physics optics experiments in the composite laboratory.',
    altText: 'Students conducting science practical experiments at RBS Public School',
  },
  {
    id: 'g3',
    title: 'Central Library & Reading Commons',
    category: 'Campus',
    image: '/images/library.jpg',
    date: 'School Library',
    caption: 'Scholars referencing NCERT textbooks, journals, and competitive exam guides in the reading room.',
    altText: 'Students reading in the central library of RBS Residential Public School',
  },
  {
    id: 'g4',
    title: 'Annual Sports Day & Athletics Competition',
    category: 'Sports',
    image: '/images/athletics.jpg',
    date: 'Annual Sports Meet',
    caption: 'Track relay race finals and volleyball championship during the annual inter-house sports festival.',
    altText: 'Track and field sprint race at RBS School Mahua sports meet',
  },
  {
    id: 'g5',
    title: 'Principal & Faculty Academic Guidance Session',
    category: 'Events',
    image: '/images/principal.jpg',
    date: 'Academic Conclave',
    caption: 'Principal Mr. Tribhuwan Singh counseling board exam candidates on effective study habits and exam strategy.',
    altText: 'Principal Mr Tribhuwan Singh addressing students at RBS School',
  },
  {
    id: 'g6',
    title: 'Computer Learning Center & Smart Class',
    category: 'Science',
    image: '/images/stem-lab.jpg',
    date: 'Digital Education',
    caption: 'Students learning computer programming, IT applications, and interactive digital concepts.',
    altText: 'Computer laboratory session at RBS Residential Public School',
  },
];

const categoryMap: Record<string, 'Campus' | 'Science' | 'Sports' | 'Arts' | 'Events'> = {
  CAMPUS: 'Campus',
  ACADEMICS: 'Science',
  ATHLETICS: 'Sports',
  ARTS: 'Arts',
  EVENTS: 'Events',
};

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  const [items, setItems] = useState<GalleryItem[]>(defaultGalleryItems);

  useEffect(() => {
    const fetchPublicMedia = async () => {
      try {
        const res = await api.get('/media');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const apiItems: GalleryItem[] = res.data.data
            .filter((m: any) => !m.isPrivate)
            .map((m: any) => ({
              id: m.id,
              title: m.title || m.originalFileName || m.fileName,
              category: categoryMap[m.category] || 'Campus',
              image: m.variants?.large?.url || m.variants?.medium?.url || m.url,
              date: new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
              caption: m.caption || m.title || 'Curated campus photography archive.',
              altText: m.altText || m.title || 'R.B.S Residential Public School media photography',
            }));

          if (apiItems.length > 0) {
            setItems(apiItems);
          }
        }
      } catch (err) {
        // Fallback to default items
      }
    };

    fetchPublicMedia();
  }, []);

  const categories = [
    { id: 'ALL', label: 'All Photographs' },
    { id: 'Campus', label: 'Campus & Architecture' },
    { id: 'Science', label: 'Science & Computer Labs' },
    { id: 'Sports', label: 'Sports & Athletics' },
    { id: 'Arts', label: 'Cultural & Arts' },
    { id: 'Events', label: 'School Events & Functions' },
  ];

  const filteredItems = selectedCategory === 'ALL'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <SEO
        title="Photo Gallery & Campus Life — R.B.S Residential Public School"
        description="Explore daily life at R.B.S Residential Public School, Mahua, Vaishali: smart classrooms, science labs, sports tournaments, hostel life, and cultural celebrations."
        keywords="RBS School photo gallery, campus pictures Mahua, RBSRPS Vaishali gallery, school events photos"
      />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'About Us', href: '/about' },
            { label: 'Photo Gallery' },
          ]}
        />

        {/* Header */}
        <div className="border-b border-slate-200 pb-8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-crest-100 text-crest-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" /> Visual Chronicle
            </span>
            <Badge variant="gold" size="sm">Life at RBSRPS</Badge>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
            A Glimpse into the R.B.S. Experience
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
            From classroom discussions and practical laboratory experiments to sports celebrations and cultural festivals, explore snapshots of student life at our Mahua campus.
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
                  alt={item.altText || item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
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
                  alt={activePhoto.altText || activePhoto.title}
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
            <h3 className="font-serif text-2xl font-bold">Experience RBSRPS in Person</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Photographs convey only a fraction of our vibrant school community. We welcome parents and students to visit our campus in Mahua for an in-person walkthrough.
            </p>
          </div>
          <Link to="/contact">
            <Button variant="gold" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Visit Campus in Mahua
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
