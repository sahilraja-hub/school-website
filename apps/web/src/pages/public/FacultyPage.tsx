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
} from 'lucide-react';

interface FacultyMember {
  id: string;
  name: string;
  role: string;
  department: 'STEM' | 'Humanities' | 'Languages' | 'Arts' | 'Counseling';
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
    name: 'Dr. Arthur Pendelton',
    role: 'Chair of Science & Advanced Physics',
    department: 'STEM',
    degrees: 'Ph.D. in Theoretical Physics, MIT',
    experience: '18 Years Teaching',
    bio: 'Leads our AP Physics and Quantum Mechanics research initiatives. Mentored 4 Regeneron STS semifinalists.',
    email: 'a.pendelton@oakridge.edu',
    status: 'online',
    honors: 'National Science Foundation Fellow',
  },
  {
    id: 'f2',
    name: 'Sarah Montgomery',
    role: 'Head of Mathematics & Robotics',
    department: 'STEM',
    degrees: 'M.S. in Applied Mathematics, Princeton University',
    experience: '12 Years Teaching',
    bio: 'Director of the FIRST Robotics Championship team. Specializes in AP Calculus BC and Linear Algebra.',
    email: 's.montgomery@oakridge.edu',
    status: 'busy',
    honors: 'FIRST Mentor of the Year',
  },
  {
    id: 'f3',
    name: 'Dr. Marcus Sterling',
    role: 'Department Head, World History & Government',
    department: 'Humanities',
    degrees: 'Ph.D. in Comparative History, Oxford University',
    experience: '20 Years Teaching',
    bio: 'Adviser for Model United Nations and AP European History. Author of three historical monographs.',
    email: 'm.sterling@oakridge.edu',
    status: 'online',
    honors: 'Oxford Rhodes Scholar',
  },
  {
    id: 'f4',
    name: 'Elena Rostova',
    role: 'Chair of Modern & Classical Languages',
    department: 'Languages',
    degrees: 'M.A. in Romance Linguistics, Sorbonne Paris',
    experience: '15 Years Teaching',
    bio: 'Speaks five languages fluently. Coordinates international exchange programs with schools in France and Spain.',
    email: 'e.rostova@oakridge.edu',
    status: 'away',
    honors: 'French Cultural Envoy Award',
  },
  {
    id: 'f5',
    name: 'Julian Hayes',
    role: 'Director of Orchestral & Performing Arts',
    department: 'Arts',
    degrees: 'M.M. in Orchestral Conducting, Juilliard School',
    experience: '14 Years Teaching',
    bio: 'Conductor of the Oakridge Philharmonia. Former guest conductor with the Seattle Symphony Orchestra.',
    email: 'j.hayes@oakridge.edu',
    status: 'online',
    honors: 'Juilliard Conducting Fellow',
  },
  {
    id: 'f6',
    name: 'Dr. Kimberly Zhao',
    role: 'Director of College Counseling & Scholar Wellbeing',
    department: 'Counseling',
    degrees: 'Ed.D. in Adolescent Psychology, Columbia University',
    experience: '16 Years Counseling',
    bio: 'Guides upper-school scholars through Ivy League and international university matriculation strategies.',
    email: 'k.zhao@oakridge.edu',
    status: 'online',
    honors: 'NACAC Exemplary Service Medal',
  },
  {
    id: 'f7',
    name: 'Robert Thornton',
    role: 'Faculty Instructor in Molecular Biology & Chemistry',
    department: 'STEM',
    degrees: 'M.S. in Biochemistry, Johns Hopkins University',
    experience: '9 Years Teaching',
    bio: 'Supervises student research in CRISPR gene editing simulations and environmental toxicology.',
    email: 'r.thornton@oakridge.edu',
    status: 'busy',
  },
  {
    id: 'f8',
    name: 'Claire Kensington',
    role: 'Faculty Instructor in British & World Literature',
    department: 'Humanities',
    degrees: 'M.A. in English Literature, Cambridge University',
    experience: '11 Years Teaching',
    bio: 'Curator of the annual Oakridge Literary Journal and coach of the National Speech & Debate delegation.',
    email: 'c.kensington@oakridge.edu',
    status: 'online',
  },
];

export const FacultyPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = [
    { id: 'ALL', label: 'All Departments' },
    { id: 'STEM', label: 'STEM & Robotics' },
    { id: 'Humanities', label: 'Humanities & Social Sciences' },
    { id: 'Languages', label: 'World Languages' },
    { id: 'Arts', label: 'Fine Arts & Music' },
    { id: 'Counseling', label: 'College Counseling' },
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
        title="Distinguished Faculty & Academic Leadership"
        description="Meet the esteemed educators, researchers, and mentors of Oakridge International Academy. 85% advanced degree holders dedicated to academic excellence."
        keywords="Oakridge faculty, teachers, school leadership, STEM educators, IB professors"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'About Oakridge', href: '/about' },
            { label: 'Faculty & Mentors' },
          ]}
        />

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-crest-950 text-white p-8 sm:p-12 border border-crest-900 shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold" size="sm">Academic Excellence</Badge>
              <Badge variant="outline" size="sm" className="text-crest-200 border-crest-700">
                1:8 Teacher-to-Student Ratio
              </Badge>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              World-Class Educators, Lifelong Mentors
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              At Oakridge, exceptional learning begins with exceptional minds. Over 85% of our faculty hold postgraduate master's or doctoral degrees from the world's most prestigious institutions, bringing cutting-edge research and unyielding passion to every classroom.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-crest-900/80">
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-400">85%+</span>
                <p className="text-xs text-slate-400">Postgraduate Degrees</p>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-white">1:8</span>
                <p className="text-xs text-slate-400">Faculty-to-Scholar Ratio</p>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-400">14 Yrs</span>
                <p className="text-xs text-slate-400">Avg. Teaching Tenure</p>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-sky-400">100%</span>
                <p className="text-xs text-slate-400">Mentorship Commitment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Department Pills */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedDept === dept.id
                    ? 'bg-crest-700 text-white shadow-subtle'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72">
            <Input
              placeholder="Search faculty or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Faculty Grid */}
        {filteredFaculty.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFaculty.map((member) => (
              <Card key={member.id} className="border-slate-200 hover:border-crest-300 transition-all flex flex-col justify-between">
                <CardContent className="p-6 space-y-4">
                  {/* Avatar & Status Header */}
                  <div className="flex items-start justify-between">
                    <Avatar
                      name={member.name}
                      size="xl"
                      status={member.status}
                      shape="rounded"
                    />
                    <Badge variant="outline" size="sm">
                      {member.department}
                    </Badge>
                  </div>

                  {/* Name & Title */}
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-bold text-slate-900 leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-xs font-medium text-crest-700">{member.role}</p>
                  </div>

                  {/* Degrees & Honors */}
                  <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                    <div className="flex items-start gap-1.5 text-slate-700 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-crest-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{member.degrees}</span>
                    </div>
                    {member.honors && (
                      <div className="flex items-center gap-1.5 text-gold-700 font-semibold text-[11px]">
                        <Award className="w-3 h-3 text-gold-500 shrink-0" />
                        <span>{member.honors}</span>
                      </div>
                    )}
                  </div>

                  {/* Short Bio */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>
                </CardContent>

                {/* Footer Action */}
                <div className="p-4 px-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">{member.experience}</span>
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-1 text-crest-700 hover:text-crest-900 font-semibold hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" /> Contact
                  </a>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Faculty Members Matched"
            description="Try clearing your search query or selecting a different department filter."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDept('ALL');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </Button>
            }
          />
        )}

        {/* Join Faculty CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-crest-900 via-crest-950 to-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-left">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">Careers at Oakridge</span>
            <h3 className="font-serif text-2xl font-bold">Inspire the Next Generation of Global Leaders</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              We are perpetually searching for visionary educators and research leaders to join our Cambridge campus community.
            </p>
          </div>
          <Link to="/contact">
            <Button variant="gold" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View Open Academic Chairs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacultyPage;
