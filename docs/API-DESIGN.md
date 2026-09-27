# REST API Design & Endpoint Specification
## School Management & Information Platform

---

## 1. API Architecture Principles

The API follows strict **RESTful conventions** with predictable resource URIs, standard HTTP status codes, and deterministic JSON response envelopes.

### 1.1 Response Envelope Formats

#### Standard Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { ... }
}
```

#### Paginated Success Response
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalRecords": 184,
    "totalPages": 10
  }
}
```

#### Error Response Envelope
```json
{
  "success": false,
  "error": "Brief, human-readable error summary.",
  "code": "VALIDATION_FAILED",
  "errors": {
    "field": ["Specific validation error message"]
  },
  "timestamp": "2026-09-28T01:30:00.000Z"
}
```

---

## 2. HTTP Status Codes & Error Semantics

| Code | Meaning | Use Case |
| :--- | :--- | :--- |
| `200 OK` | Success | Successful `GET`, `PUT`, `PATCH`, or standard operations. |
| `201 Created` | Resource Created | Successful `POST` creating an entity (User, Admission, Assignment). |
| `400 Bad Request` | Client Error | Zod validation failure or malformed payload. |
| `401 Unauthorized` | Auth Required | Missing, expired, or invalid JWT access token. |
| `403 Forbidden` | Access Denied | Authenticated user lacks required RBAC role. |
| `404 Not Found` | Entity Missing | Query target does not exist. |
| `409 Conflict` | Uniqueness Breach| Email or Class Code already registered. |
| `429 Too Many Req`| Rate Limited | Exceeded endpoint rate limit threshold. |
| `500 Server Error`| Internal Failure | Uncaught exception handled by central error middleware. |

---

## 3. Comprehensive REST Endpoint Specifications

### 3.1 Authentication & Profile (`/api/auth`)

| Method | Endpoint | Description | Access / RBAC | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user credentials, set HTTP-only refresh cookie, return access token | Public | `{ email, password }` |
| `POST` | `/api/auth/register` | Register new account | Admin / Super Admin | `{ firstName, lastName, email, password, role }` |
| `POST` | `/api/auth/refresh` | Rotate tokens using secure cookie refresh token | Public (Cookie) | None |
| `POST` | `/api/auth/logout` | Revoke active refresh token and clear cookie | Authenticated | None |
| `GET` | `/api/auth/me` | Fetch currently authenticated user summary | Authenticated | None |
| `PATCH`| `/api/auth/profile` | Update profile information (phone, avatarUrl) | Authenticated | `{ phone, avatarUrl }` |
| `POST` | `/api/auth/change-password` | Update account password | Authenticated | `{ oldPassword, newPassword }` |

---

### 3.2 Admissions Management (`/api/admissions`)

| Method | Endpoint | Description | Access / RBAC | Query / Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/admissions/apply` | Submit new student admission application | Public | `AdmissionApplicationSchema` |
| `GET` | `/api/admissions/track/:appNumber` | Query application status using reference ID | Public | None |
| `GET` | `/api/admissions` | List all applications with filtering & pagination | Admin, Super Admin | `?status=UNDER_REVIEW&grade=GRADE_9&page=1` |
| `GET` | `/api/admissions/:id` | Fetch complete application dossier | Admin, Super Admin | None |
| `PATCH`| `/api/admissions/:id/status`| Update status (`ACCEPTED`, `WAITLISTED`, etc.) | Admin, Super Admin | `{ status, notes, interviewDate }` |

---

### 3.3 Academic Classes & Sections (`/api/classes`, `/api/sections`)

| Method | Endpoint | Description | Access / RBAC | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/classes` | List academic classes (filtered by teacher/student) | Authenticated | None |
| `POST` | `/api/classes` | Create new academic class cohort | Admin, Super Admin | `{ name, code, academicStage, academicYear }` |
| `GET` | `/api/classes/:id` | Fetch class details with enrolled students | Authenticated | None |
| `POST` | `/api/classes/:id/sections`| Create section within class | Admin, Super Admin | `{ name, roomNumber, homeroomTeacherId }` |
| `POST` | `/api/sections/:id/enroll` | Enroll student into section | Admin, Super Admin | `{ studentId }` |

---

### 3.4 Attendance Management (`/api/attendance`)

| Method | Endpoint | Description | Access / RBAC | Query / Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/attendance/mark` | Record daily batch attendance for class section | Teacher, Admin | `MarkAttendanceBatchSchema` |
| `GET` | `/api/attendance/class` | Fetch attendance roster for section on date | Teacher, Admin | `?classId=xxx&date=YYYY-MM-DD` |
| `GET` | `/api/attendance/student/:id?` | Get attendance percentage & recent records | Student, Parent, Teacher, Admin | `?limit=30` |

---

### 3.5 Coursework, Assignments & Grades (`/api/grades`)

| Method | Endpoint | Description | Access / RBAC | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/grades/assignments` | Create homework or assessment task | Teacher, Admin | `CreateAssignmentSchema` |
| `GET` | `/api/grades/assignments/class/:id` | List assignments for class | Authenticated | None |
| `POST` | `/api/grades/submit` | Record points earned and feedback for student | Teacher, Admin | `SubmitGradeSchema` |
| `GET` | `/api/grades/student/:id?` | Get comprehensive GPA and report card records | Student, Parent, Teacher, Admin | None |

---

### 3.6 Bulletin & Announcements (`/api/announcements`)

| Method | Endpoint | Description | Access / RBAC | Query / Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/announcements` | List notices (filtered by category and target role)| Public / Auth | `?category=ACADEMIC&search=exam` |
| `POST` | `/api/announcements` | Publish notice to school bulletin | Admin, Super Admin, Teacher | `CreateAnnouncementSchema` |
| `DELETE`| `/api/announcements/:id` | Delete notice | Admin, Super Admin | None |

---

### 3.7 Institutional Metrics & Telemetry (`/api/stats`)

| Method | Endpoint | Description | Access / RBAC | Response Summary |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/stats/dashboard` | Role-tailored aggregated telemetry | Authenticated | Custom metrics per role |

---

### 3.8 Infrastructure Health Probes (`/api/health`)

| Method | Endpoint | Description | Access / RBAC | Response Summary |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service liveness, uptime, memory, version | Public | `{ status: "ok", uptime: 1240 }` |
