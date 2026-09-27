# Product Requirements Document (PRD)
## School Management & Information Platform (Oakridge International Academy)

---

## 1. Product Vision
The **School Management & Information Platform** is an enterprise-grade, unified digital ecosystem serving both as the prestigious public-facing digital institution of Oakridge International Academy and as a comprehensive, role-based School Information & Management System (SIMS/ERP). 

The platform bridges prospective families, enrolled students, guardians, educators, and institutional leadership through:
- An aesthetically superior, high-conversion public portal delivering institutional transparency, curriculum showcases, online admissions, and campus circulars.
- An intuitive, secure, role-based management application orchestrating academic operations: student and parent demographics, teacher allocations, class and timetable scheduling, attendance capture, examination grading, homework pipelines, fee tracking, and system-wide audit logging.

---

## 2. Target Users & Personas

| Persona | Definition & Primary Goals |
| :--- | :--- |
| **Public Visitor** | Prospective parents, prospective students, educational researchers, alumni, and community members seeking institutional information, program details, fee schedules, virtual tours, and submitting online admission applications. |
| **Student** | Enrolled scholars seeking real-time access to personal timetables, homework assignments and submission dropboxes, attendance summaries, exam schedules, terminal report cards, and school bulletin notices. |
| **Parent / Guardian** | Authorized primary caregivers tracking academic progress, attendance anomalies, fee invoicing and payment records, teacher conference schedules, and school announcements. |
| **Teacher / Faculty** | Subject instructors and homeroom tutors responsible for taking daily attendance, publishing homework and assignments, recording examination marks, scheduling parent-teacher conferences, and monitoring assigned student rosters. |
| **Admin** | Department heads, admissions officers, and academic coordinators managing student/parent/teacher records, reviewing and updating admissions workflows, publishing circulars, configuring classes and subjects, and generating operational reports. |
| **Super Admin** | Principal, Executive Director, and Lead IT Systems Engineers with unrestricted global authority over system configuration, RBAC policy enforcement, audit logs, billing modules, data export/import, and user provisioning. |

---

## 3. Public Modules Specification

### 3.1 Home
- **Hero Showcase**: High-impact visual branding with institutional crest, tagline, dynamic announcements ticker, and primary CTAs ("Apply for 2026-2027", "Schedule Campus Tour", "Access Portal").
- **Key Metrics & Statistics**: Real-time counter metrics (100% university placement, 1:8 student-faculty ratio, 35+ AP courses, merit scholarships).
- **Core Pillars**: Institutional values (Academic Rigor, Ethical Character, Global Stewardship, Innovation in STEM).
- **Academic Divisions Overview**: Quick summary cards for Early Childhood, Primary Academy, Middle School, and Senior High School.
- **Campus Life & Virtual Tour Teaser**: Photorealistic gallery preview and facility highlights.
- **Latest Bulletins & Circulars**: Pinned and category-tagged announcements preview.
- **Testimonials & Community Voices**: Statements from alumni, parents, and academic partners.

### 3.2 About
- **Institutional History & Heritage**: Founding principles (est. 1988), charter, and evolution.
- **Mission, Vision & Philosophy**: Detailed breakdown of educational tenets.
- **Accreditations & Affiliations**: IB World School, Cambridge International, Cognia, College Board AP Capstone credentials.
- **Strategic Governance & Advisory Council**: Profile cards of board trustees and executive advisors.

### 3.3 Principal's Message
- Welcome statement from Head of School (Dr. Margaret Harrison).
- Educational outlook, focus on holistic intellect, ethical leadership, and character cultivation.
- Official signature block, credentials, and video address integration.

### 3.4 Academics
- **Division Curricula**:
  - *Kindergarten & Early Years*: Inquiry-based play, phonics, socio-emotional discovery.
  - *Primary School (Grades 1-5)*: Singapore Math, integrated science, dual-language immersion.
  - *Middle School (Grades 6-8)*: Pre-AP analytical writing, laboratory sciences, rhetoric, robotics.
  - *Senior High (Grades 9-12)*: 28 Advanced Placement offerings, AP Capstone Diploma, college counseling.
- **Specialized Programs**: STEM & Robotics Hub, Biotechnology lab, Arts Conservatory, Debate & Model UN.

### 3.5 Admissions
- **Application Guidelines**: Step-by-step enrollment roadmap, criteria, documentation checklists, and age matrix.
- **Online Application Form**: Multi-step Zod-validated wizard (Student Profile, Guardian Contact, Academic Background, File Uploads, Confirmation).
- **Real-Time Application Tracking**: Reference ID lookup (`ADM-2026-XXXX`) displaying status badges, interview schedules, and admissions notes.
- **Tuition & Financial Aid Schedule**: Detailed fee structures, merit scholarships, and sibling discounts.

### 3.6 Faculty & Staff
- Directory of department chairs, faculty members, and academic advisors.
- Faculty profiles featuring degrees, subject specializations, and departmental contact links.

### 3.7 Facilities & Campus
- Architectural overview of campus assets: 14,000 sq. ft. Innovation Center, Olympic natatorium, 650-seat proscenium theater, research libraries, and athletic stadiums.
- Health center, safety protocols, green campus environmental sustainability initiatives.

### 3.8 Gallery
- Categorized photo and video albums (Campus, STEM Expo, Athletics, Performing Arts, Commencement, Field Trips).
- Lightbox modal with high-resolution viewing and accessible captions.

### 3.9 Events & Calendar
- Interactive school calendar with month/week/list views.
- Filterable categories: Academic deadlines, Athletic meets, Arts performances, Parent-Teacher Conferences, Holidays.
- iCal / Google Calendar synchronization download links.

### 3.10 Notices & Circulars
- Public bulletin board categorized into Academic, Urgent, Sports, Events, and General.
- Search filter by title, date, or keyword.
- Pinned high-priority circulars with download links for PDF attachments.

### 3.11 Contact
- Interactive inquiry submission form with automated email dispatch.
- Campus address, interactive location map, department-specific telephone and email directories.
- Campus visiting hours, admissions front desk hours, and emergency numbers.

---

## 4. Authenticated Modules Specification

| Module | Scope & Core Capabilities | Primary Roles |
| :--- | :--- | :--- |
| **Dashboard** | Role-tailored home screen with high-priority metrics, action items, recent alerts, and quick actions. | All Roles |
| **Profile** | View and update user credentials, contact info, avatar image, active sessions, and password security. | All Roles |
| **Students** | Comprehensive student registry, student profile dossiers, enrollment status, emergency contacts, medical notes. | Admin, Super Admin, Teacher |
| **Parents** | Guardian registry, linked student relations, communication preference logs, guardian address history. | Admin, Super Admin |
| **Teachers** | Faculty registry, educational qualifications, department allocation, assigned class loads, timetable distribution. | Admin, Super Admin |
| **Classes** | Class/cohort definitions (e.g., Grade 10, Grade 11), academic year association, homeroom assignments. | Admin, Super Admin |
| **Sections** | Division sections (e.g., Grade 11-A, Grade 11-B), max student caps, room number allocations. | Admin, Super Admin, Teacher |
| **Subjects** | Curriculum subjects (e.g., AP Physics Mechanics, AP Calculus BC), subject codes, credit hours, prerequisites. | Admin, Super Admin, Teacher |
| **Attendance** | Daily attendance marker, period attendance, batch status toggles (Present/Absent/Late/Excused), aggregate statistics. | Teacher, Admin, Super Admin, Student (read), Parent (read) |
| **Exams** | Examination master setup, exam terms, room seating allocations, grading scale definitions, pass marks. | Teacher, Admin, Super Admin |
| **Results** | Score entries by teachers, terminal marks calculation, letter grade assignment, GPA computation, PDF report cards. | Teacher, Admin, Super Admin, Student (own), Parent (child) |
| **Homework** | Assignment builder, file attachments, due dates, submission dropbox, teacher grading, inline feedback. | Teacher, Student, Parent (read), Admin |
| **Timetable** | Weekly schedule matrix for classes, rooms, and teachers; collision detection for rooms and faculty. | All Roles |
| **Admissions** | Backend admissions pipeline manager, application review queue, status updates, interview schedule manager. | Admin, Super Admin |
| **Notices** | System-wide circular authoring, role-targeting filters, publication schedules, push alert triggering. | Admin, Super Admin, Teacher (class) |
| **Events** | Internal calendar event scheduling, RSVPs for parent-teacher conferences, sports day fixtures. | All Roles |
| **Gallery** | Upload, manage, and curate campus media collections, album organization, tag assignments. | Admin, Super Admin |
| **Documents** | Digital locker for school policies, medical forms, syllabus blueprints, transcripts, and transfer certificates. | All Roles (role-filtered) |
| **Fees** | Fee schedule master, student invoicing, payment receipt recording, past-due balance reminders, ledger summaries. | Admin, Super Admin, Parent (own) |
| **Users** | User provisioning, credential resetting, role modifications, session revoking, account status toggles. | Admin, Super Admin |
| **Settings** | Institution profile, academic year toggles, grading parameters, notification email SMTP setup, logo branding. | Super Admin |
| **Audit Logs** | Immutable chronological record of system events: actor, timestamp, IP, target entity, mutation diff. | Super Admin |

---

## 5. Complete User Journeys

### 5.1 Visitor Journey
1. **Discovery**: Lands on `/` via organic search, social link, or referral. Reads value proposition, examines campus photography, reviews accreditations.
2. **Investigation**: Navigates through `/academics` to verify course offerings and STEM facilities. Checks `/notices` and `/events` for campus vitality.
3. **Application**: Clicks "Apply Now" on `/admissions`, completes the 3-step wizard with student details, guardian info, and previous school records.
4. **Confirmation**: Receives immediate confetti celebration and unique Tracking Code (`ADM-2026-XXXX`). Confirmation email received.
5. **Follow-Up**: Returns to `/admissions` -> "Track Status", enters code, reviews real-time application status ("Under Review" -> "Interview Scheduled").

### 5.2 Student Journey
1. **Authentication**: Navigates to `/login`, enters institutional credentials, or clicks instant role demo for testing.
2. **Dashboard Overview**: Views daily schedule, upcoming assignment deadlines, and attendance summary badge (e.g., 98%).
3. **Course Engagement**: Checks `/portal/student` for enrolled courses, opens pending homework assignments, reads teacher instructions, submits completed work.
4. **Performance Monitoring**: Checks `/portal/student` gradebook section to inspect recent test scores, weighted GPA calculation, and teacher feedback.
5. **Bulletin Tracking**: Reads pinned notices concerning examination schedules and extracurricular club meetings.

### 5.3 Parent Journey
1. **Authentication**: Signs in via `/login` using verified guardian email and password.
2. **Family Overview**: Dashboard displays linked student dossier (Liam Vance, Grade 11), academic standing, and attendance alerts.
3. **Attendance & Safety Check**: Verifies child's daily presence records, reviews past absences with date-stamped notes.
4. **Academic Consultation**: Reviews published exam grades, checks upcoming Parent-Teacher Conference schedules, and directly emails instructors via faculty links.
5. **Fee & Administrative Management**: Inspects fee invoices, verifies payment clearance status, and downloads tuition receipts.

### 5.4 Teacher Journey
1. **Authentication**: Logs into `/login`, authenticated into Faculty Workspace.
2. **Daily Morning Roster**: Opens `/portal/teacher`, selects assigned homeroom/period, sees student roster, clicks "Mark All Present" or updates individual late arrivals with 1-click toggles, saves record.
3. **Curriculum & Assignment Publishing**: Creates a new assignment (title, max points, due date, description), assigns to class section.
4. **Grading & Evaluation**: Reviews submitted student work, enters points earned, receives auto-calculated letter grade, adds constructive feedback, publishes grades.
5. **Parent Communication**: Reviews conference bookings, adds notes to student records for upcoming parent meetings.

### 5.5 Admin Journey
1. **Authentication**: Logs into `/login`, redirected to `/portal/admin`.
2. **Institutional Monitoring**: Reviews active enrollment counters, faculty counts, and pending admissions queue.
3. **Admissions Pipeline Processing**: Inspects incoming applications, reviews candidate credentials, toggles status from `SUBMITTED` to `UNDER_REVIEW`, schedules candidate interview, or issues `ACCEPTED` decision.
4. **Broadcasting**: Opens circular modal, crafts announcement with target role tags (`STUDENT`, `PARENT`, `TEACHER`), marks pinned, dispatches to bulletin boards.
5. **Roster Coordination**: Creates new class sections, assigns teachers to subjects, ensures student enrollee limits.

### 5.6 Super Admin Journey
1. **Authentication**: Signs in with multi-factor authentication into Super Admin console.
2. **Access & Security Governance**: Inspects active user accounts, modifies RBAC permission mappings, provisions administrative accounts.
3. **Audit Oversight**: Queries `/portal/audit-logs` to review mutation history (who modified grades, changed admission statuses, or altered system settings).
4. **System Configuration**: Sets active academic year (`2026-2027`), configures fee heads, updates grading formulas, triggers database backup snapshots.

---

## 6. Accessibility, SEO & Performance Standards

### 6.1 Accessibility (WCAG 2.1 AA)
- Semantic HTML tags (`<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<article>`).
- Minimum 4.5:1 color contrast ratio for normal body text, 3:1 for large display headings.
- Full keyboard navigability (`Tab`, `Shift+Tab`, `Enter`, `Escape` on modals).
- Screen-reader compatible `aria-label`, `aria-expanded`, `aria-live` for dynamic alerts.
- Form inputs accompanied by explicit `<label>` tags and descriptive error IDs.

### 6.2 Search Engine Optimization (SEO)
- Dynamic `<title>` and `<meta name="description">` tags on every page route.
- OpenGraph (`og:title`, `og:image`, `og:description`, `og:url`) and Twitter card tags.
- Single `<h1>` per page with hierarchical `<h2>` - `<h4>` structures.
- Schema.org structured data (`EducationalOrganization`, `Event`, `WebPage`).
- XML sitemap generation (`/sitemap.xml`) and search robot directives (`/robots.txt`).

### 6.3 Performance Standards
- **Core Web Vitals**: Largest Contentful Paint (LCP) ≤ 2.5s, Interaction to Next Paint (INP) ≤ 200ms, Cumulative Layout Shift (CLS) ≤ 0.1.
- **Time to First Byte (TTFB)** ≤ 200ms for static client assets, ≤ 500ms for API queries.
- Code-splitting with dynamic `React.lazy()` for authenticated portal dashboards.
- Modern image formats (WebP, optimized JPEG) with explicit `width` and `height` attributes to prevent layout shifts.
