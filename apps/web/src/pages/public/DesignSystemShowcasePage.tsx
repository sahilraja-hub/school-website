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
  Avatar,
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
  ShieldCheck,
  Code2,
  BookOpen,
  Filter,
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

  // Interactive Story & States Playground controls
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoDisabled, setDemoDisabled] = useState(false);
  const [demoError, setDemoError] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-crest-100 text-crest-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Oakridge UI Architecture
            </span>
            <Badge variant="gold" size="sm">Phase 3 — UI Component System</Badge>
            <Badge variant="success" size="sm" dot>WCAG 2.1 AA Compliant</Badge>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
            UI / UX Design System & Component Library
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
            A complete suite of 26+ reusable, fully typed React TypeScript components. Engineered with strict focus rings, keyboard accessibility, ARIA standards, loading/disabled/error states, and responsive styling.
          </p>

          {/* Interactive States Controller Bar */}
          <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-crest-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Live State Playground Switcher:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Switch
                label="Simulate Loading"
                checked={demoLoading}
                onChange={setDemoLoading}
              />
              <Switch
                label="Simulate Disabled"
                checked={demoDisabled}
                onChange={setDemoDisabled}
              />
              <Switch
                label="Simulate Error"
                checked={demoError}
                onChange={setDemoError}
              />
            </div>
          </div>
        </div>

        {/* 1. BUTTONS & ACTIONS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              1. Buttons & Interactive Triggers
            </h2>
            <span className="text-xs text-slate-400 font-mono">apps/web/src/components/ui/Button.tsx</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Variants</h4>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary" isLoading={demoLoading} disabled={demoDisabled} leftIcon={<Sparkles className="w-4 h-4" />}>
                  Primary Crest
                </Button>
                <Button variant="secondary" isLoading={demoLoading} disabled={demoDisabled}>
                  Secondary Action
                </Button>
                <Button variant="outline" isLoading={demoLoading} disabled={demoDisabled} leftIcon={<Download className="w-4 h-4" />}>
                  Outline Button
                </Button>
                <Button variant="ghost" isLoading={demoLoading} disabled={demoDisabled}>
                  Ghost Action
                </Button>
                <Button variant="danger" isLoading={demoLoading} disabled={demoDisabled} leftIcon={<Trash2 className="w-4 h-4" />}>
                  Destructive Action
                </Button>
                <Button variant="gold" isLoading={demoLoading} disabled={demoDisabled}>
                  Gold Accent
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Sizes</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" variant="primary">Small (sm)</Button>
                <Button size="md" variant="primary">Medium Default (md)</Button>
                <Button size="lg" variant="primary">Large Hero (lg)</Button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. AVATAR COMPONENT SUITE */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              2. Avatar & Identity Indicators
            </h2>
            <span className="text-xs text-slate-400 font-mono">apps/web/src/components/ui/Avatar.tsx</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sizes */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sizes (xs to xl)</h4>
                <div className="flex items-center gap-3">
                  <Avatar name="Liam Vance" size="xs" />
                  <Avatar name="Liam Vance" size="sm" />
                  <Avatar name="Liam Vance" size="md" />
                  <Avatar name="Liam Vance" size="lg" />
                  <Avatar name="Liam Vance" size="xl" />
                </div>
              </div>

              {/* Status Indicators */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Presence Status Indicators</h4>
                <div className="flex items-center gap-3">
                  <Tooltip content="Online">
                    <Avatar name="Emma Watson" status="online" size="lg" />
                  </Tooltip>
                  <Tooltip content="Busy in Class">
                    <Avatar name="Noah Clark" status="busy" size="lg" />
                  </Tooltip>
                  <Tooltip content="Away / Recess">
                    <Avatar name="Sophia Miller" status="away" size="lg" />
                  </Tooltip>
                  <Tooltip content="Offline">
                    <Avatar name="James Lee" status="offline" size="lg" />
                  </Tooltip>
                </div>
              </div>

              {/* Shapes & Stack */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Shapes & Stacked Group</h4>
                <div className="flex items-center gap-4">
                  <Avatar name="Principal Davis" shape="rounded" size="lg" status="online" />
                  {/* Avatar Stack */}
                  <div className="flex -space-x-3 overflow-hidden p-1">
                    <Avatar name="Liam Vance" size="md" className="ring-2 ring-white" />
                    <Avatar name="Emma Watson" size="md" className="ring-2 ring-white" />
                    <Avatar name="Noah Clark" size="md" className="ring-2 ring-white" />
                    <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-700">
                      +18
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FORM INPUTS & SELECTION CONTROLS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              3. Form Inputs & Selection Controls
            </h2>
            <span className="text-xs text-slate-400 font-mono">Input, Textarea, Select, Checkbox, Radio, Switch, FileUpload</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
            <div>
              <Input
                label="Student Full Name"
                placeholder="e.g. Liam Christopher Vance"
                disabled={demoDisabled}
                error={demoError ? 'A legal student name is mandatory for enrollment registration.' : undefined}
                helperText="Must match passport or official birth certificate"
                required
              />
            </div>

            <div>
              <Select
                label="Academic Grade & Stream"
                options={[
                  { label: 'Grade 9 - Freshman Honors', value: 'g9' },
                  { label: 'Grade 10 - Sophomore Scholars', value: 'g10' },
                  { label: 'Grade 11 - International Baccalaureate', value: 'g11' },
                  { label: 'Grade 12 - Senior AP Cohort', value: 'g12' },
                ]}
                disabled={demoDisabled}
                error={demoError ? 'Please designate an academic level.' : undefined}
                helperText="Determines core course prerequisites"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Academic Observation Notes"
                placeholder="Enter teacher feedback or administrative remarks..."
                rows={3}
                disabled={demoDisabled}
                error={demoError ? 'Notes cannot exceed maximum character limit.' : undefined}
                helperText="Visible only to authorized faculty and academic counselors"
              />
            </div>

            <div className="space-y-4">
              <Checkbox
                label="Notify Guardian via SMS & Email"
                description="Dispatches instant notification to parents upon grade publication."
                checked={checkboxChecked}
                disabled={demoDisabled}
                error={demoError ? 'Parent authorization flag required' : undefined}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
              />
              <Switch
                label="Allow Self-Submission Dropbox"
                description="Permit scholars to upload PDF submissions after deadline."
                checked={switchChecked}
                disabled={demoDisabled}
                onChange={setSwitchChecked}
              />
            </div>

            <div>
              <RadioGroup
                name="deliveryMode"
                label="Instructional Delivery Format"
                selectedValue={radioSelected}
                disabled={demoDisabled}
                error={demoError ? 'Select an instructional modality' : undefined}
                onChange={setRadioSelected}
                options={[
                  { label: 'Standard On-Campus Lecture', value: 'opt1', description: 'In-person classroom session.' },
                  { label: 'Hybrid Lab Rotation', value: 'opt2', description: 'Lab experiments with online synthesis.' },
                ]}
              />
            </div>

            <div className="md:col-span-2">
              <FileUpload
                label="Attach Student Portfolio Documents"
                helperText="Transcripts, recommendation letters (Max 10MB each)"
              />
            </div>
          </div>
        </section>

        {/* 4. OVERLAYS, MODALS, DRAWERS & DIALOGS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              4. Overlays, Modals, Drawers & Dialogs
            </h2>
            <span className="text-xs text-slate-400 font-mono">Modal, Drawer, Dropdown, ConfirmationDialog, Toast</span>
          </div>

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
            <Dropdown
              trigger={
                <Button variant="outline" rightIcon={<Filter className="w-3.5 h-3.5" />}>
                  Export Menu
                </Button>
              }
              items={[
                { label: 'Export as PDF Dossier', icon: <Download className="w-4 h-4" /> },
                { label: 'Export CSV Spreadsheet', icon: <Download className="w-4 h-4" /> },
                { divider: true, label: '' },
                { label: 'Archive Record', danger: true, icon: <Trash2 className="w-4 h-4" /> },
              ]}
            />
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
            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <Avatar name="Liam Vance" size="lg" status="online" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Liam Vance</h4>
                  <p className="text-slate-500">ID: OAK-882190 • Grade 11</p>
                </div>
              </div>
              <p>Weighted Cumulative GPA: <strong className="text-slate-900">3.96</strong></p>
              <p>Attendance Record: <strong className="text-emerald-700">98% (Exemplary)</strong></p>
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

        {/* 5. DATA TABLES, BADGES & PAGINATION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              5. Data Tables, Badges & Pagination
            </h2>
            <span className="text-xs text-slate-400 font-mono">Table, Badge, Pagination</span>
          </div>

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
                  <TableCell className="font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <Avatar name="Liam Vance" size="sm" />
                      <span>Liam Vance</span>
                    </div>
                  </TableCell>
                  <TableCell>PHY-401 • AP Physics</TableCell>
                  <TableCell>96 / 100</TableCell>
                  <TableCell><Badge variant="success">Grade A</Badge></TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm">Inspect</Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <Avatar name="Emma Watson" size="sm" />
                      <span>Emma Watson</span>
                    </div>
                  </TableCell>
                  <TableCell>MTH-402 • AP Calculus</TableCell>
                  <TableCell>91 / 100</TableCell>
                  <TableCell><Badge variant="primary">Grade A-</Badge></TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm">Inspect</Button></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <Avatar name="Noah Clark" size="sm" />
                      <span>Noah Clark</span>
                    </div>
                  </TableCell>
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

        {/* 6. ALERTS, TABS, ACCORDIONS, FEEDBACK & SKELETONS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              6. Feedback Alerts, Accordions, Tabs, Empty & Error States
            </h2>
            <span className="text-xs text-slate-400 font-mono">Alert, Tabs, Accordion, EmptyState, ErrorState, Skeleton, Spinner</span>
          </div>

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

            {/* Skeleton & Spinner States */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Shimmer Loading Skeletons</h4>
                <Spinner size="sm" />
              </div>
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

            {/* Empty and Error States */}
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
                <EmptyState
                  title="No Pending Examination Submissions"
                  description="All submitted student lab reports and essays have been evaluated by faculty."
                  action={<Button size="sm" variant="outline">Refresh Queue</Button>}
                />
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
                <ErrorState
                  title="Failed to Synchronize Rosters"
                  description="A temporary network timeout occurred with the school database replica."
                  onRetry={() => toast({ type: 'info', message: 'Retrying database synchronization...' })}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignSystemShowcasePage;
