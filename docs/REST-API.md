# Complete REST API Documentation
## Oakridge International Academy — Production `/api/v1` Specification

---

## 1. Overview & General Standards

- **Base URL**: `/api/v1`
- **Protocol**: HTTP/1.1 & HTTP/2 over TLS/HTTPS
- **Data Exchange**: JSON (`application/json; charset=utf-8`)
- **Authentication**: Bearer Token Authorization (`Authorization: Bearer <JWT_ACCESS_TOKEN>`) and secure HTTP-only cookies (`refreshToken`)
- **Correlation & Tracing**: All requests receive a unique `X-Request-Id` header (UUID or prefixed timestamp) logged across middleware, controllers, and services.

### 1.1 Uniform Success Response Structure
```typescript
interface ApiResponse<T> {
  success: true;
  message?: string;
  data: T;
  meta: {
    requestId: string;
    timestamp: string; // ISO 8601
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
```

### 1.2 Uniform Error Response Structure
```typescript
interface ApiErrorResponse {
  success: false;
  error: string;
  code: string; // e.g. 'VALIDATION_ERROR', 'UNAUTHORIZED', 'FORBIDDEN', 'NOT_FOUND'
  errors?: Record<string, string[]>; // Field-specific validation breakdown
  meta: {
    requestId: string;
    timestamp: string;
  };
}
```

---

## 2. Role-Based Access Control (RBAC) Matrix

| Module | Allowed Roles (Read) | Allowed Roles (Write/Create) | Allowed Roles (Delete) |
| :--- | :--- | :--- | :--- |
| **`/auth`** | Public (`/login`, `/register`, `/refresh`), Authenticated (`/me`) | Authenticated (`/change-password`) | N/A |
| **`/users`** | `ADMIN`, `SUPER_ADMIN` | `ADMIN`, `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`/students`** | `TEACHER`, `ADMIN`, `SUPER_ADMIN`, Self (`STUDENT`, `PARENT`) | `ADMIN`, `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`/parents`** | `TEACHER`, `ADMIN`, `SUPER_ADMIN`, Self (`PARENT`) | `ADMIN`, `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`/teachers`** | Authenticated (Directory) | `ADMIN`, `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`/classes`** | Authenticated | `ADMIN`, `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`/sections`** | Authenticated | `ADMIN`, `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`/subjects`** | Authenticated | `ADMIN`, `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`/attendance`** | Authenticated (Self tenancy enforced) | `TEACHER`, `ADMIN`, `SUPER_ADMIN` | N/A |
| **`/exams`** | Authenticated | `TEACHER`, `ADMIN`, `SUPER_ADMIN` | `ADMIN`, `SUPER_ADMIN` |
| **`/results`** | Authenticated (Self tenancy enforced) | `TEACHER`, `ADMIN`, `SUPER_ADMIN` | `ADMIN`, `SUPER_ADMIN` |
| **`/homework`** | Authenticated (Self tenancy enforced) | `TEACHER`, `ADMIN`, `SUPER_ADMIN` (Submissions: `STUDENT`) | `TEACHER`, `ADMIN` |
| **`/timetable`**| Authenticated | `ADMIN`, `SUPER_ADMIN` | `ADMIN`, `SUPER_ADMIN` |
| **`/admissions`**| Public (Apply/Track), `ADMIN`, `SUPER_ADMIN` (List) | `ADMIN`, `SUPER_ADMIN` (Status review) | `SUPER_ADMIN` |
| **`/notices`** | Public & Authenticated (Audience targeted) | `ADMIN`, `SUPER_ADMIN` | `ADMIN`, `SUPER_ADMIN` |
| **`/events`** | Public & Authenticated | `ADMIN`, `SUPER_ADMIN` | `ADMIN`, `SUPER_ADMIN` |
| **`/gallery`** | Public & Authenticated | `ADMIN`, `SUPER_ADMIN` | `ADMIN`, `SUPER_ADMIN` |
| **`/documents`**| Public & Authenticated | `ADMIN`, `SUPER_ADMIN` | `ADMIN`, `SUPER_ADMIN` |
| **`/fees`** | Authenticated (Self tenancy enforced) | `ADMIN`, `SUPER_ADMIN` | `SUPER_ADMIN` |
| **`/payments`** | Authenticated (Self tenancy enforced) | `PARENT`, `STUDENT`, `ADMIN`, `SUPER_ADMIN` | N/A |
| **`/settings`** | Public & Authenticated | `ADMIN`, `SUPER_ADMIN` | N/A |
| **`/audit-logs`**| `ADMIN`, `SUPER_ADMIN` | System only | Read-only |

---

## 3. Detailed Modules & Endpoints Catalog

### 3.1 Authentication (`/api/v1/auth`)
- `POST /login` — Authenticate credentials. Returns access token and sets HTTP-only refresh token.
- `POST /register` — Register a new student or portal account with strict password validation.
- `POST /refresh` — Issue fresh access token via HTTP-only cookie or request body.
- `POST /logout` — Invalidate current session and clear refresh cookie.
- `POST /logout-all` — Revoke all active sessions for the authenticated user.
- `GET /me` — Retrieve current authenticated user profile and roles.
- `POST /change-password` — Update password with current password verification.

### 3.2 Users Management (`/api/v1/users`)
- `GET /` — List and search users with filters: `role`, `status`, `search`, `page`, `limit`.
- `GET /:id` — Get user profile by ID. Sensitive fields (`passwordHash`) are permanently excluded via `toUserResponseDto`.
- `POST /` — Create user account with assigned role and status.
- `PATCH /:id` — Update biographical fields (`firstName`, `lastName`, `phone`, `avatarUrl`).
- `PATCH /:id/status` — Modify account status (`ACTIVE`, `SUSPENDED`, `LOCKED`).
- `DELETE /:id` — Soft-delete or suspend user account.

### 3.3 Students (`/api/v1/students`)
- `GET /` — List students with filters: `classId`, `sectionId`, `status`, `search`.
- `GET /:id` — Retrieve detailed student profile including parent contact and academic enrollment.
- `POST /` — Register a student, automatically provisioning their user credentials and profile records.
- `PATCH /:id` — Update student roll number, emergency contact, or address.
- `DELETE /:id` — Deactivate student enrollment.

### 3.4 Parents (`/api/v1/parents`)
- `GET /` — List parent guardian records.
- `GET /:id` — Get parent details with linked children.
- `POST /` — Register parent profile.
- `PATCH /:id` — Update parent occupation and emergency contacts.

### 3.5 Teachers (`/api/v1/teachers`)
- `GET /` — Faculty directory lookup with department filter.
- `GET /:id` — Retrieve teacher qualifications, specializations, and assigned courses.
- `POST /` — Register teacher profile with employee identification.
- `PATCH /:id` — Update qualifications and departmental appointments.

### 3.6 Classes & Cohorts (`/api/v1/classes`)
- `GET /` — List academic classes with sections count and academic year filter.
- `GET /:id` — Get class details and affiliated sections.
- `POST /` — Create class cohort (e.g., "Grade 10").
- `PATCH /:id` — Update class metadata.
- `DELETE /:id` — Remove class cohort.

### 3.7 Sections (`/api/v1/sections`)
- `GET /` — List sections by `classId`.
- `GET /:id` — Get section room number and seat capacity.
- `POST /` — Create section under class.
- `PATCH /:id` — Update section capacity or room number.
- `DELETE /:id` — Remove section.

### 3.8 Subjects (`/api/v1/subjects`)
- `GET /` — List academic subjects with elective filters and code search.
- `GET /:id` — Get subject syllabus details and credit allocations.
- `POST /` — Register new curriculum subject.
- `PATCH /:id` — Update subject credits or description.
- `DELETE /:id` — Delete subject.

### 3.9 Attendance (`/api/v1/attendance`)
- `GET /` — Query attendance registers by `sectionId`, `studentId`, `date`, `status`.
- `GET /stats` — Calculate attendance rates, present/absent counts over date ranges.
- `POST /batch` — Record daily or period register for all students in a section.

### 3.10 Examinations (`/api/v1/exams`)
- `GET /` — List scheduled and ongoing exams by `academicYear` and `status`.
- `GET /:id` — Get examination details with subject evaluation schedules.
- `POST /` — Schedule new examination term.
- `PATCH /:id` — Update examination status (`SCHEDULED` -> `ONGOING` -> `COMPLETED`).
- `DELETE /:id` — Cancel examination.

### 3.11 Results & Grades (`/api/v1/results`)
- `GET /` — Query results by `examSubjectId` or `studentId`.
- `POST /` — Record marks and grade, automatically evaluating pass/fail status and percentage.

### 3.12 Coursework & Homework (`/api/v1/homework`)
- `GET /` — List coursework assignments by `sectionId` or `subjectId`.
- `GET /:id` — Get assignment instructions, attachments, and submissions count.
- `POST /` — Assign homework with due date and total marks.
- `POST /:id/submit` — Student submission with work content and file attachments.
- `PATCH /submissions/:submissionId/grade` — Teacher evaluations, grades, and feedback.

### 3.13 Timetable (`/api/v1/timetable`)
- `GET /` — Retrieve timetable schedule slots by `sectionId`, `teacherId`, or `dayOfWeek`.
- `GET /:id` — Get specific schedule slot.
- `POST /` — Schedule classroom period with automated conflict detection preventing double-booking.
- `PATCH /:id` — Reschedule period or change assigned instructor.
- `DELETE /:id` — Cancel timetable slot.

### 3.14 Admissions Pipeline (`/api/v1/admissions`)
- `POST /` & `POST /apply` — Public application submission with student and guardian information.
- `GET /track/:applicationNumber` — Public tracking of application decision status.
- `GET /` — Admin list of applications with status and grade filters.
- `PATCH /:id/status` — Update application state (`SUBMITTED` -> `UNDER_REVIEW` -> `ACCEPTED` / `REJECTED`).

### 3.15 Notices & Circulars (`/api/v1/notices`)
- `GET /` — List circulars sorted by pinned priority and publication date.
- `GET /:id` — Get full notice content.
- `POST /` — Publish new notice with target role restrictions.
- `PATCH /:id` — Update notice content or pinning state.
- `DELETE /:id` — Archive or remove notice.

### 3.16 School Events (`/api/v1/events`)
- `GET /` — List upcoming school events and calendar activities.
- `GET /:id` — Get event location, dates, and banner metadata.
- `POST /` — Schedule event.
- `PATCH /:id` — Reschedule or update event details.
- `DELETE /:id` — Remove event.

### 3.17 Gallery & Media (`/api/v1/gallery`)
- `GET /` — List campus photo/video galleries.
- `GET /:id` — Get album details with all media items.
- `POST /` — Create gallery album with cover image.
- `POST /media` — Upload/attach media item to gallery.
- `DELETE /media/:id` — Delete media item.

### 3.18 Documents & Publications (`/api/v1/documents`)
- `GET /` — List public documents, student handbooks, and policies.
- `GET /:id` — Download or inspect document metadata.
- `POST /` — Upload document record.
- `DELETE /:id` — Delete document.

### 3.19 Fee Structures & Invoices (`/api/v1/fees`)
- `GET /structures` — List fee schedules by class and academic year.
- `POST /structures` — Create fee structure template.
- `GET /invoices` — List invoices with student, status, and due date filters.
- `GET /invoices/:id` — Get invoice details, payment ledger, and remaining balance.
- `POST /invoices` — Issue fee invoice to student.

### 3.20 Payments (`/api/v1/payments`)
- `GET /` — List payments with search and invoice filters.
- `POST /` — Record payment against invoice. Automatically updates invoice paid amount, computes balance, and marks status as `PAID` when balance is zero.

### 3.21 System Settings (`/api/v1/settings`)
- `GET /` — Retrieve institutional configuration, academic year, and current term.
- `PATCH /` — Update school profile, contact information, and term parameters.

### 3.22 Audit Logs (`/api/v1/audit-logs`)
- `GET /` — Query immutable system audit trail with filters: `userId`, `entityType`, `action`, `search`, and date bounds. Strictly restricted to `ADMIN` and `SUPER_ADMIN`.
