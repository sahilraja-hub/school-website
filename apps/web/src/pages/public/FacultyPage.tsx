import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  Card,
  CardContent,
  Badge,
  Button,
  Input,
  Avatar,
  EmptyState,
} from '../../components/ui';
import { SEO } from '../../components/common/SEO';
import {
  GraduationCap,
  Award,
  BookOpen,
  Mail,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface FacultyMember {
  id: string;
  name: string;
  role: string;
  department: 'Leadership' | 'Science' | 'Commerce' | 'Languages' | 'Sports';
  degrees: string;
  experience: string;
  bio: string;
  email: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  honors?: string;
}

const mockFaculty: FacultyMember[] = [
  {
    id: 'f1',
    name: 'Sri Ram Bachan Singh',
    role: 'Founder & Director',
    department: 'Leadership',
    degrees: 'Educational Visionary & Founder',
    experience: 'Founder since 2008',
    bio: 'Guiding spirit and patron behind R.B.S. Residential Public School, dedicated to empowering students of Vaishali with world-class education.',
    email: 'director@rbsschool.com',
    status: 'online',
    honors: 'Distinguished Educational Patron',
  },
  {
    id: 'f2',
    name: 'Mr. Om Narayan',
    role: 'Managing Director',
    department: 'Leadership',
    degrees: 'Postgraduate in Management',
    experience: '16+ Years Administrative Excellence',
    bio: 'Oversees institutional development, modern academic infrastructure, digital smart classroom integration, and campus operations.',
    email: 'md@rbsschool.com',
    status: 'online',
    honors: 'Institutional Leadership Award',
  },
  {
    id: 'f3',
    name: 'Mr. Tribhuwan Singh',
    role: 'Principal & Head of School',
    department: 'Leadership',
    degrees: 'M.A., B.Ed.',
    experience: '22+ Years Academic Leadership',
    bio: 'Leads our academic governance, CBSE curriculum alignment, faculty mentoring, and student character formation.',
    email: 'principal@rbsschool.com',
    status: 'online',
    honors: 'Exemplary Educator Award',
  },
  {
    id: 'f4',
    name: 'Dr. Anand Kumar Verma',
    role: 'Head of Department, Physics & Senior Secondary Science',
    department: 'Science',
    degrees: 'M.Sc. Physics, Ph.D., B.Ed.',
    experience: '15 Years Teaching',
    bio: 'Specialist in Senior Secondary CBSE Physics practicals, optics, and competitive coaching for JEE-Main candidates.',
    email: 'a.verma@rbsschool.com',
    status: 'online',
    honors: 'State Science Fair Mentor',
  },
  {
    id: 'f5',
    name: 'Mrs. Sunita Kumari',
    role: 'Senior Faculty, Chemistry & Laboratory In-charge',
    department: 'Science',
    degrees: 'M.Sc. Organic Chemistry, B.Ed.',
    experience: '12 Years Teaching',
    bio: 'In-charge of the Chemistry Practical Suite. Prepares students for board practicals and medical entrance fundamentals.',
    email: 's.kumari@rbsschool.com',
    status: 'busy',
    honors: 'CBSE Regional Evaluator',
  },
  {
    id: 'f6',
    name: 'Mr. Rakesh Ranjan',
    role: 'Head of Mathematics & Computer Science',
    department: 'Science',
    degrees: 'M.Sc. Mathematics, MCA, B.Ed.',
    experience: '14 Years Teaching',
    bio: 'Guides secondary and senior secondary students in calculus, coordinate geometry, and computer applications.',
    email: 'r.ranjan@rbsschool.com',
    status: 'online',
  },
  {
    id: 'f7',
    name: 'Mr. Manoj Kumar Sharma',
    role: 'Senior Faculty, Commerce & Economics',
    department: 'Commerce',
    degrees: 'M.Com, UGC-NET Qualified, B.Ed.',
    experience: '11 Years Teaching',
    bio: 'Specialist in Senior Secondary Accountancy and Business Studies. Prepares commerce scholars for CA-Foundation and CUET.',
    email: 'm.sharma@rbsschool.com',
    status: 'online',
  },
  {
    id: 'f8',
    name: 'Mrs. Pratibha Singh',
    role: 'Head of Department, Languages & Literature',
    department: 'Languages',
    degrees: 'M.A. English & Hindi Literature, B.Ed.',
    experience: '13 Years Teaching',
    bio: 'Directs the school literary club, annual elocution contests, and Hindi/English communicative mastery.',
    email: 'p.singh@rbsschool.com',
    status: 'away',
  },
  {
    id: 'f9',
    name: 'Mr. Arvind Kumar',
    role: 'Director of Physical Education & Sports Coach',
    department: 'Sports',
    degrees: 'M.P.Ed., Certified Yoga Instructor',
    experience: '10 Years Coaching',
    bio: 'Trains school teams in Cricket, Volleyball, Athletics, and Taekwondo. Manages annual athletic meets and morning fitness.',
    email: 'sports@rbsschool.com',
    status: 'online',
    honors: 'District Sports Coach of the Year',
  },
];

export const FacultyPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = [
    { id: 'ALL', label: 'All Staff' },
    { id: 'Leadership', label: 'School Leadership' },
    { id: 'Science', label: 'Science & Mathematics' },
    { id: 'Commerce', label: 'Commerce & Economics' },
    { id: 'Languages', label: 'Languages & Arts' },
    { id: 'Sports', label: 'Physical Education' },
  ];

  const filteredFaculty = useMemo(() => {
    return mockFaculty.filter((f) => {
      const matchesDept = selectedDept === 'ALL' || f.department === selectedDept;
      const matchesSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.degrees.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [selectedDept, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <SEO
        title="Faculty & Leadership — R.B.S Residential Public School, Mahua"
        description="Meet the esteemed leadership and dedicated educators of R.B.S. Residential Public School, Mahua, Vaishali. Experienced teachers across CBSE Science, Commerce, Mathematics, and Humanities."
        keywords="RBS School faculty, teachers Mahua Vaishali, Ram Bachan Singh, Tribhuwan Singh, Om Narayan, RBSRPS staff"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'About Us', href: '/about' },
            { label: 'Faculty & Leadership' },
          ]}
        />

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-crest-950 text-white p-8 sm:p-12 border border-crest-900 shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold" size="sm">Dedicated Mentors</Badge>
              <Badge variant="outline" size="sm" className="text-crest-200 border-crest-700">
                Qualified & B.Ed. Certified
              </Badge>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Our Educators, Mentors & Leadership
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              At R.B.S. Residential Public School, exceptional education is guided by experienced, compassionate educators who mentor students both inside the classroom and during residential study hours.
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  selectedDept === dept.id
                    ? 'bg-crest-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <Input
              placeholder="Search faculty by name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((member) => (
            <Card key={member.id} className="border-slate-200 hover:shadow-card transition-all flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-crest-900 text-gold-400 flex items-center justify-center font-bold text-lg border border-gold-400">
                      {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-slate-900">{member.name}</h3>
                      <p className="text-xs text-crest-700 font-semibold">{member.role}</p>
                    </div>
                  </div>
                  <Badge variant="outline" size="sm" className="text-[10px]">
                    {member.department}
                  </Badge>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <p className="flex items-center gap-1.5 font-medium text-slate-700">
                    <GraduationCap className="w-3.5 h-3.5 text-crest-600 shrink-0" />
                    <span>{member.degrees}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{member.experience}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {member.bio}
                </p>

                {member.honors && (
                  <div className="p-2.5 bg-gold-50/70 border border-gold-200 rounded-lg text-[11px] text-gold-800 flex items-center gap-1.5 font-medium">
                    <Award className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                    <span>{member.honors}</span>
                  </div>
                )}
              </CardContent>

              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">{member.email}</span>
                <Link to="/contact" className="text-crest-700 hover:text-crest-900 font-semibold">
                  Contact
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {filteredFaculty.length === 0 && (
          <EmptyState
            title="No faculty members found"
            description="Try adjusting your department filter or search query to find staff members."
          />
        )}

        {/* Join our faculty CTA */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">Careers at RBSRPS</span>
            <h3 className="font-serif text-2xl font-bold text-slate-900">Are you an inspiring educator?</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              R.B.S. Residential Public School frequently invites passionate, qualified teachers for CBSE Primary, Secondary, and Senior Secondary classes (+2 Science & Commerce).
            </p>
          </div>
          <Link to="/contact">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Submit Resume / CV
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacultyPage;
