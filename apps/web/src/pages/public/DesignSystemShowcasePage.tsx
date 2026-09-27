import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Search,
  DatePicker,
  FileUpload,
  Modal,
  Drawer,
  Dropdown,
  Tooltip,
  useToast,
  Alert,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Pagination,
  Tabs,
  Accordion,
  Breadcrumb,
  Skeleton,
  Spinner,
  EmptyState,
  ErrorState,
  ConfirmationDialog,
} from '../../components/ui';
import {
  Sparkles,
  Download,
  Trash2,
  Bell,
  Heart,
  Calendar,
  Layers,
  Palette,
  CheckCircle2,
} from 'lucide-react';

export const DesignSystemShowcasePage: React.FC = () => {
  const { toast } = useToast();

  // State for interactive component demos
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioSelected, setRadioSelected] = useState('opt1');
  const [activeTab, setActiveTab] = useState('tab1');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-crest-100 text-crest-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Oakridge UI Architecture
            </span>
            <Badge variant="gold" size="sm">Phase 1 Complete</Badge>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
            UI / UX Design System & Component Library
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-3xl">
            A comprehensive, battle-tested design system engineered for Oakridge International Academy. Enforces visual hierarchy, WCAG 2.1 AA accessibility, and consistent responsive behavior across mobile, tablet, and desktop viewports.
          </p>
        </div>

        {/* 1. COLOR FOUNDATIONS */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">
            1. Color Foundations & Semantic Swatches
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Crest Navy */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-card">
              <h3 className="font-serif text-base font-bold text-slate-900">Regal Crest Navy (Primary)</h3>
              <div className="grid grid-cols-5 gap-2">
                <div className="h-14 rounded-lg bg-crest-50 flex items-end p-1 text-[9px] font-mono text-crest-900">50</div>
                <div className="h-14 rounded-lg bg-crest-200 flex items-end p-1 text-[9px] font-mono text-crest-900">200</div>
                <div className="h-14 rounded-lg bg-crest-500 flex items-end p-1 text-[9px] font-mono text-white">500</div>
                <div className="h-14 rounded-lg bg-crest-700 flex items-end p-1 text-[9px] font-mono text-white font-bold">700</div>
                <div className="h-14 rounded-lg bg-crest-950 flex items-end p-1 text-[9px] font-mono text-white font-bold">950</div>
              </div>
              <p className="text-xs text-slate-500">Core brand token used for headers, primary actions, and institutional crest branding.</p>
            </div>

            {/* Heritage Gold */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-card">
              <h3 className="font-serif text-base font-bold text-slate-900">Heritage Gold (Accent)</h3>
              <div className="grid grid-cols-5 gap-2">
                <div className="h-14 rounded-lg bg-gold-50 flex items-end p-1 text-[9px] font-mono text-gold-900">50</div>
                <div className="h-14 rounded-lg bg-gold-200 flex items-end p-1 text-[9px] font-mono text-gold-900">200</div>
                <div className="h-14 rounded-lg bg-gold-400 flex items-end p-1 text-[9px] font-mono text-slate-950">400</div>
                <div className="h-14 rounded-lg bg-gold-500 flex items-end p-1 text-[9px] font-mono text-slate-950 font-bold">500</div>
                <div className="h-14 rounded-lg bg-gold-700 flex items-end p-1 text-[9px] font-mono text-white font-bold">700</div>
              </div>
              <p className="text-xs text-slate-500">Used for admissions highlights, academic honors, badges, and prestige markers.</p>
            </div>

            {/* Semantic Feedback */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-card">
              <h3 className="font-serif text-base font-bold text-slate-900">Semantic Feedback Palette</h3>
              <div className="grid grid-cols-4 gap-2">
                <div className="h-14 rounded-lg bg-success-500 flex items-end p-1 text-[9px] font-mono text-white">Success</div>
                <div className="h-14 rounded-lg bg-warning-500 flex items-end p-1 text-[9px] font-mono text-white">Warning</div>
                <div className="h-14 rounded-lg bg-danger-600 flex items-end p-1 text-[9px] font-mono text-white">Danger</div>
                <div className="h-14 rounded-lg bg-info-500 flex items-end p-1 text-[9px] font-mono text-white">Info</div>
              </div>
              <p className="text-xs text-slate-500">Adheres strictly to WCAG 2.1 AA 4.5:1 minimum contrast ratios.</p>
            </div>
          </div>
        </section>

        {/* 2. BUTTONS & ICON BUTTONS */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">
            2. Buttons & IconButtons
          </h2>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-card">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Button Variants</h4>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary">Primary Button</Button>
                <Button variant="gold" leftIcon={<Sparkles className="w-4 h-4" />}>Gold Prestige</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>Danger Button</Button>
                <Button variant="primary" isLoading>Loading State</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Button Sizes & IconButtons</h4>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="sm">Small (sm)</Button>
                <Button size="md">Medium (md)</Button>
                <Button size="lg">Large (lg)</Button>
                <IconButton aria-label="Notifications" variant="primary" size="md">
                  <Bell className="w-4 h-4" />
                </IconButton>
                <IconButton aria-label="Favorites" variant="secondary" size="md">
                  <Heart className="w-4 h-4 text-danger-500" />
                </IconButton>
                <IconButton aria-label="Download" variant="outline" size="md">
                  <Download className="w-4 h-4" />
                </IconButton>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FORM CONTROLS */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">
            3. Form Inputs & Selection Controls
          </h2>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Student Name" placeholder="e.g. Liam Vance" required helperText="Enter full institutional registered name." />
            <Input label="Email with Error State" value="invalid-email" error="Please enter a valid academic email address." />
            <Select
              label="Academic Grade Cohort"
              options={[
                { label: 'Grade 9 (Freshman)', value: 'G9' },
                { label: 'Grade 10 (Sophomore)', value: 'G10' },
                { label: 'Grade 11 (Junior)', value: 'G11' },
                { label: 'Grade 12 (Senior)', value: 'G12' },
              ]}
            />
            <DatePicker label="Date of Assessment" defaultValue="2026-10-15" />
            <div className="md:col-span-2">
              <Search
                placeholder="Search students, faculty rosters, or academic subjects..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
              />
            </div>
            <div className="md:col-span-2">
              <Textarea label="Academic Observation Notes" placeholder="Enter teacher feedback or administrative remarks..." rows={3} />
            </div>
            <div className="space-y-4">
              <Checkbox
                label="Notify Guardian via SMS & Email"
                description="Dispatches instant notification to parents upon grade publication."
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
              />
              <Switch
                label="Allow Self-Submission Dropbox"
                description="Permit scholars to upload PDF submissions after deadline."
                checked={switchChecked}
                onChange={setSwitchChecked}
              />
            </div>
            <div>
              <RadioGroup
                name="deliveryMode"
                label="Instructional Delivery Format"
                selectedValue={radioSelected}
                onChange={setRadioSelected}
                options={[
                  { label: 'Standard On-Campus Lecture', value: 'opt1', description: 'In-person classroom session.' },
                  { label: 'Hybrid Lab Rotation', value: 'opt2', description: 'Lab experiments with online synthesis.' },
                ]}
              />
            </div>
            <div className="md:col-span-2">
              <FileUpload label="Attach Student Portfolio Documents" helperText="Transcripts, recommendation letters (Max 10MB)" />
            </div>
          </div>
        </section>

        {/* 4. OVERLAYS, MODALS & DIALOGS */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">
            4. Overlays, Modals, Drawers & Dialogs
          </h2>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card flex flex-wrap gap-4 items-center">
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Open Standard Modal
            </Button>
            <Button variant="outline" onClick={() => setDrawerOpen(true)}>
              Open Slide-Out Drawer
            </Button>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Open Destructive Dialog
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                toast({
                  type: 'success',
                  title: 'Gradebook Synchronized',
                  message: 'Batch student attendance and marks committed to database.',
                })
              }
            >
              Trigger Success Toast
            </Button>
            <Tooltip content="Academic year 2026-2027 verified">
              <Badge variant="gold">Hover for Tooltip</Badge>
            </Tooltip>
          </div>

          {/* Modal Demo */}
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Course Enrollment Confirmation"
            description="Review details before enrolling student into AP Physics C."
            footer={
              <>
                <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>Confirm Enrollment</Button>
              </>
            }
          >
            <p className="text-xs text-slate-600 leading-relaxed">
              Enrolling Liam Vance into AP Physics C (Lab 304) will allocate 1.0 credit hour to the Fall 2026 academic timetable.
            </p>
          </Modal>

          {/* Drawer Demo */}
          <Drawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Student Dossier Quick View"
          >
            <div className="space-y-3 text-xs text-slate-600">
              <p className="font-bold text-sm text-slate-900">Liam Vance (Grade 11)</p>
              <p>ID: OAK-882190 • Weighted GPA: 3.96</p>
              <p>Attendance: 98% (Exemplary Record)</p>
              <div className="pt-4">
                <Button size="sm" variant="outline" onClick={() => setDrawerOpen(false)}>Close Drawer</Button>
              </div>
            </div>
          </Drawer>

          {/* ConfirmationDialog Demo */}
          <ConfirmationDialog
            isOpen={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={() => {
              setConfirmOpen(false);
              toast({ type: 'danger', title: 'Record Removed', message: 'The test entry was cleared.' });
            }}
            title="Revoke Student Enrollment?"
            message="Are you sure you wish to withdraw this student? This action updates system transcripts and cannot be undone."
            confirmLabel="Confirm Withdrawal"
          />
        </section>

        {/* 5. DATA TABLES & PRESENTATION */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">
            5. Data Tables, Badges & Pagination
          </h2>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="primary">Admin</Badge>
              <Badge variant="success" dot>Active Faculty</Badge>
              <Badge variant="warning">Under Review</Badge>
              <Badge variant="danger">Absent</Badge>
              <Badge variant="gold">AP Scholar</Badge>
              <Badge variant="outline">Guest</Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Scholar</TableHead>
                  <TableHead>Class Section</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Standing</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-bold text-slate-900">Liam Vance</TableCell>
                  <TableCell>PHY-401 • AP Physics</TableCell>
                  <TableCell>96 / 100</TableCell>
                  <TableCell><Badge variant="success">Grade A</Badge></TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm">Inspect</Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold text-slate-900">Emma Watson</TableCell>
                  <TableCell>MTH-402 • AP Calculus</TableCell>
                  <TableCell>91 / 100</TableCell>
                  <TableCell><Badge variant="primary">Grade A-</Badge></TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm">Inspect</Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold text-slate-900">Noah Clark</TableCell>
                  <TableCell>ENG-301 • World Literature</TableCell>
                  <TableCell>85 / 100</TableCell>
                  <TableCell><Badge variant="gold">Grade B</Badge></TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm">Inspect</Button></TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Pagination
              currentPage={currentPage}
              totalPages={5}
              totalRecords={50}
              pageSize={10}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>

        {/* 6. ALERTS, ACCORDIONS, TABS & SKELETONS */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">
            6. Structural Elements & Loading Skeletons
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Alert type="info" title="Scheduled System Maintenance">
                Portal databases will undergo standard replication optimization this Sunday from 2:00 AM to 3:00 AM PST.
              </Alert>
              <Alert type="success" title="Admissions Cycle 2026-2027">
                All 500 early-decision candidate packets have been successfully dispatched.
              </Alert>
              <Alert type="danger" title="Unexcused Absence Alert">
                Student Noah Clark was flagged for late attendance in Period 1 today.
              </Alert>
            </div>

            <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tabbed Switchers & Accordions</h4>
              <Tabs
                tabs={[
                  { id: 'tab1', label: 'Primary Curriculum' },
                  { id: 'tab2', label: 'STEM Institute', badge: <Badge variant="gold" size="sm">New</Badge> },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
              <Accordion
                items={[
                  {
                    id: 'acc1',
                    title: 'What are the graduation requirements for Senior High?',
                    content: 'Students must complete 24 academic credits, 100 community service hours, and successfully defend their senior capstone thesis.',
                  },
                  {
                    id: 'acc2',
                    title: 'How does the parent-teacher conference schedule operate?',
                    content: 'Conferences are hosted bi-annually with interactive Zoom or on-campus meeting booking directly within the Guardian Portal.',
                  },
                ]}
              />
            </div>

            {/* Skeleton & Empty States */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Shimmer Loading Skeletons</h4>
              <div className="space-y-2">
                <Skeleton variant="text" width="60%" height="24px" />
                <Skeleton variant="text" width="100%" height="16px" />
                <Skeleton variant="text" width="85%" height="16px" />
                <div className="flex gap-3 pt-2">
                  <Skeleton variant="circular" width="40px" height="40px" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton variant="text" width="40%" height="14px" />
                    <Skeleton variant="text" width="70%" height="12px" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
              <EmptyState
                title="No Pending Examination Submissions"
                description="All submitted student lab reports and essays have been evaluated by faculty."
                action={<Button size="sm" variant="outline">Refresh Queue</Button>}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
