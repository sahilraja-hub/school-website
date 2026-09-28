# Production Database Architecture & Schema Specification
## Oakridge International Academy — PostgreSQL & Prisma ORM

---

## 1. Architectural Overview

The Oakridge International Academy platform utilizes **PostgreSQL** as its enterprise-grade relational database management system (RDBMS), operated through **Prisma ORM (v6.4.1+)**.

### Core Tenets:
1. **Strict Relational Integrity**: All entity associations enforce primary key / foreign key constraints with explicit referential actions (`CASCADE`, `RESTRICT`, `SET NULL`).
2. **UUID Primary Keys**: Every table uses a cryptographically random, globally unique identifier (`@id @default(uuid())`), eliminating sequential ID enumeration attacks.
3. **Auditability & Soft Deletion**: High-value business entities implement `isDeleted` (Boolean) and `deletedAt` (DateTime) flags with timestamps (`createdAt`, `updatedAt`) to protect institutional history against accidental or malicious purging.
4. **Data Privacy & DTO Segregation**: Internal database models and sensitive attributes (such as `passwordHash`, security audit metadata, and soft-delete flags) are never returned directly to API callers. Dedicated Data Transfer Objects (DTOs) and mappers serialize all public responses.
5. **Performance-Driven Indexing**: High-cardinality foreign keys, search identifiers, date bounds, and unique business constraints are indexed to support sub-millisecond query execution even at large scales.

---

## 2. Complete Entity-Relationship Diagram (ERD)

The database schema encompasses all **27 required core models**:

```mermaid
erDiagram
    %% Core Authentication & RBAC
    USER ||--o{ ROLE : belongs_to
    ROLE ||--o{ ROLE_PERMISSION : defines
    PERMISSION ||--o{ ROLE_PERMISSION : grants
    USER ||--o| STUDENT : profile_for
    USER ||--o| PARENT : profile_for
    USER ||--o| TEACHER : profile_for

    %% Parent-Student Relationship
    PARENT ||--o{ STUDENT : guardians

    %% Academics Structure
    CLASS ||--|{ SECTION : contains
    CLASS ||--o{ FEE_STRUCTURE : defines_fee
    SECTION ||--o{ TEACHER_ASSIGNMENT : assigned_faculty
    SUBJECT ||--o{ TEACHER_ASSIGNMENT : covers_subject
    TEACHER ||--o{ TEACHER_ASSIGNMENT : teaches

    %% Student Academic Records
    STUDENT ||--o{ STUDENT_ENROLLMENT : enrolls
    SECTION ||--o{ STUDENT_ENROLLMENT : hosts
    STUDENT ||--o{ ATTENDANCE : marked
    SECTION ||--o{ ATTENDANCE : recorded_for

    %% Scheduling & Coursework
    SECTION ||--o{ TIMETABLE : scheduled_in
    SUBJECT ||--o{ TIMETABLE : scheduled_subject
    TEACHER ||--o{ TIMETABLE : instructs
    SECTION ||--o{ HOMEWORK : assigned_to
    SUBJECT ||--o{ HOMEWORK : subject_material
    TEACHER ||--o{ HOMEWORK : created_by
    HOMEWORK ||--o{ HOMEWORK_SUBMISSION : receives
    STUDENT ||--o{ HOMEWORK_SUBMISSION : submits

    %% Examinations & Grading
    EXAM ||--|{ EXAM_SUBJECT : schedules
    SUBJECT ||--o{ EXAM_SUBJECT : tested
    SECTION ||--o{ EXAM_SUBJECT : examines
    EXAM_SUBJECT ||--o{ RESULT : graded_in
    STUDENT ||--o{ RESULT : achieves

    %% Admissions & Communications
    USER ||--o{ ADMISSION : reviews
    USER ||--o{ NOTICE : publishes
    USER ||--o{ EVENT : organizes

    %% Media & Documents
    GALLERY ||--|{ MEDIA : organizes
    USER ||--o{ MEDIA : uploads
    USER ||--o{ DOCUMENT : uploads

    %% Finance & Accounting
    STUDENT ||--o{ INVOICE : billed_to
    FEE_STRUCTURE ||--o{ INVOICE : based_on
    INVOICE ||--o{ PAYMENT : settles

    %% System Auditing
    USER ||--o{ AUDIT_LOG : tracks
```

---

## 3. Entity Catalog & Model Definitions

### 3.1 Authentication & RBAC

#### 1. `User` (`users`)
- **Primary Key**: `id` (UUID)
- **Fields**: `email` (Unique), `passwordHash`, `firstName`, `lastName`, `phone`, `avatarUrl`, `roleId` (FK), `status` (Enum), `emailVerified`, `lastLoginAt`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`
- **Relations**: Belongs to `Role`; has 1:1 with `Student`, `Parent`, `Teacher`; has 1:N with `Attendance`, `AuditLog`, `Notice`, `Event`, `Media`, `Document`.
- **Indexes**: `email` (Unique & Query Index), `roleId`, `status`, `isDeleted`.

#### 2. `Role` (`roles`)
- **Primary Key**: `id` (UUID)
- **Fields**: `name` (Enum: `SUPER_ADMIN`, `ADMIN`, `TEACHER`, `STUDENT`, `PARENT`, Unique), `description`, `createdAt`, `updatedAt`
- **Relations**: 1:N with `User`, 1:N with `RolePermission`.

#### 3. `Permission` (`permissions`)
- **Primary Key**: `id` (UUID)
- **Fields**: `name` (String, Unique, e.g. `users:read`, `exams:write`), `description`, `module`, `createdAt`, `updatedAt`
- **Relations**: 1:N with `RolePermission`.

#### 4. `RolePermission` (`role_permissions`)
- **Primary Key**: Compound `(roleId, permissionId)`
- **Foreign Keys**: `roleId` -> `roles.id` (CASCADE), `permissionId` -> `permissions.id` (CASCADE)

---

### 3.2 School Actors

#### 5. `Student` (`students`)
- **Primary Key**: `id` (UUID)
- **Fields**: `userId` (FK, Unique), `parentId` (FK, Nullable), `studentIdNumber` (Unique), `admissionNumber` (Unique), `rollNumber`, `dateOfBirth`, `gender`, `bloodGroup`, `emergencyContact`, `address`, `admissionDate`, `status`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`
- **Foreign Keys**: `userId` -> `users.id` (CASCADE), `parentId` -> `parents.id` (SET NULL)
- **Indexes**: `studentIdNumber` (Unique), `admissionNumber` (Unique), `parentId`, `isDeleted`.

#### 6. `Parent` (`parents`)
- **Primary Key**: `id` (UUID)
- **Fields**: `userId` (FK, Unique), `occupation`, `relationship`, `emergencyContact`, `address`, `city`, `state`, `postalCode`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`
- **Foreign Keys**: `userId` -> `users.id` (CASCADE)
- **Relations**: 1:N with `Student`.

#### 7. `Teacher` (`teachers`)
- **Primary Key**: `id` (UUID)
- **Fields**: `userId` (FK, Unique), `employeeId` (Unique), `qualification`, `specialization`, `department`, `joiningDate`, `status`, `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`
- **Foreign Keys**: `userId` -> `users.id` (CASCADE)
- **Indexes**: `employeeId` (Unique), `department`, `isDeleted`.

---

### 3.3 Academics Structure

#### 8. `Class` (`classes`)
- **Primary Key**: `id` (UUID)
- **Fields**: `name` (e.g. "Grade 10"), `gradeLevel` (Enum), `academicYear` (e.g. "2026-2027"), `description`, `createdAt`, `updatedAt`
- **Unique Constraint**: Compound `@@unique([name, academicYear])`
- **Relations**: 1:N with `Section`, 1:N with `FeeStructure`.

#### 9. `Section` (`sections`)
- **Primary Key**: `id` (UUID)
- **Fields**: `name` (e.g. "Section A"), `classId` (FK), `roomNumber`, `capacity` (Default 35), `createdAt`, `updatedAt`
- **Foreign Keys**: `classId` -> `classes.id` (CASCADE)
- **Unique Constraint**: Compound `@@unique([classId, name])`
- **Relations**: 1:N with `TeacherAssignment`, `StudentEnrollment`, `Attendance`, `Timetable`, `Homework`, `ExamSubject`.

#### 10. `Subject` (`subjects`)
- **Primary Key**: `id` (UUID)
- **Fields**: `name`, `code` (Unique, e.g. "MATH-101"), `description`, `credits`, `isElective`, `createdAt`, `updatedAt`
- **Relations**: 1:N with `TeacherAssignment`, `Timetable`, `ExamSubject`, `Homework`.

#### 11. `TeacherAssignment` (`teacher_assignments`)
- **Primary Key**: `id` (UUID)
- **Fields**: `teacherId` (FK), `sectionId` (FK), `subjectId` (FK), `academicYear`, `isClassTeacher` (Boolean), `createdAt`, `updatedAt`
- **Unique Constraint**: Compound `@@unique([teacherId, sectionId, subjectId, academicYear])`

#### 12. `StudentEnrollment` (`student_enrollments`)
- **Primary Key**: `id` (UUID)
- **Fields**: `studentId` (FK), `sectionId` (FK), `academicYear`, `rollNumber`, `status` (Enum), `enrolledAt`, `createdAt`, `updatedAt`
- **Unique Constraint**: Compound `@@unique([studentId, sectionId, academicYear])`

---

### 3.4 Attendance & Scheduling

#### 13. `Attendance` (`attendances`)
- **Primary Key**: `id` (UUID)
- **Fields**: `studentId` (FK), `sectionId` (FK), `date` (DateOnly), `status` (Enum: `PRESENT`, `ABSENT`, `LATE`, `EXCUSED`), `remarks`, `recordedById` (FK), `createdAt`, `updatedAt`
- **Unique Constraint**: Compound `@@unique([studentId, date])`
- **Indexes**: `(sectionId, date)`, `date`, `status`.

#### 14. `Timetable` (`timetables`)
- **Primary Key**: `id` (UUID)
- **Fields**: `sectionId` (FK), `subjectId` (FK), `teacherId` (FK), `dayOfWeek` (Enum), `startTime`, `endTime`, `roomNumber`, `createdAt`, `updatedAt`
- **Unique Constraint**: Compound `@@unique([sectionId, dayOfWeek, startTime])`
- **Indexes**: `(teacherId, dayOfWeek, startTime)`, `(dayOfWeek, startTime)`.

---

### 3.5 Coursework, Examinations & Results

#### 15. `Exam` (`exams`)
- **Primary Key**: `id` (UUID)
- **Fields**: `name`, `academicYear`, `term`, `startDate`, `endDate`, `status` (Enum), `description`, `createdAt`, `updatedAt`
- **Relations**: 1:N with `ExamSubject`.

#### 16. `ExamSubject` (`exam_subjects`)
- **Primary Key**: `id` (UUID)
- **Fields**: `examId` (FK), `subjectId` (FK), `sectionId` (FK), `examDate`, `maxMarks`, `passMarks`, `createdAt`, `updatedAt`
- **Unique Constraint**: Compound `@@unique([examId, subjectId, sectionId])`
- **Relations**: 1:N with `Result`.

#### 17. `Result` (`results`)
- **Primary Key**: `id` (UUID)
- **Fields**: `examSubjectId` (FK), `studentId` (FK), `marksObtained` (Decimal 5,2), `grade`, `remarks`, `createdAt`, `updatedAt`
- **Unique Constraint**: Compound `@@unique([examSubjectId, studentId])`
- **Indexes**: `studentId`, `examSubjectId`.

#### 18. `Homework` (`homeworks`)
- **Primary Key**: `id` (UUID)
- **Fields**: `sectionId` (FK), `subjectId` (FK), `teacherId` (FK), `title`, `description`, `assignedDate`, `dueDate`, `totalMarks`, `attachmentUrl`, `createdAt`, `updatedAt`
- **Relations**: 1:N with `HomeworkSubmission`.

#### 19. `HomeworkSubmission` (`homework_submissions`)
- **Primary Key**: `id` (UUID)
- **Fields**: `homeworkId` (FK), `studentId` (FK), `submittedAt`, `status` (Enum), `content`, `attachmentUrl`, `marksObtained`, `feedback`, `createdAt`, `updatedAt`
- **Unique Constraint**: Compound `@@unique([homeworkId, studentId])`

---

### 3.6 Admissions, Communications & Media

#### 20. `Admission` (`admissions`)
- **Primary Key**: `id` (UUID)
- **Fields**: `applicationNumber` (Unique), `applicantFirstName`, `applicantLastName`, `dateOfBirth`, `gender`, `parentName`, `parentEmail`, `parentPhone`, `gradeApplyingFor`, `academicYear`, `status` (Enum), `previousSchool`, `reviewedById` (FK, Nullable), `decisionDate`, `notes`, `createdAt`, `updatedAt`
- **Indexes**: `applicationNumber` (Unique), `status`, `parentEmail`.

#### 21. `Notice` (`notices`)
- **Primary Key**: `id` (UUID)
- **Fields**: `title`, `content`, `category` (Enum), `targetRole` (Enum, Nullable), `isPinned`, `publishedAt`, `expiresAt`, `authorId` (FK), `createdAt`, `updatedAt`
- **Indexes**: `(isPinned, publishedAt)`, `category`, `targetRole`.

#### 22. `Event` (`events`)
- **Primary Key**: `id` (UUID)
- **Fields**: `title`, `description`, `location`, `startDate`, `endDate`, `isPublic`, `bannerUrl`, `organizerId` (FK), `createdAt`, `updatedAt`
- **Indexes**: `startDate`, `isPublic`.

#### 23. `Gallery` (`galleries`)
- **Primary Key**: `id` (UUID)
- **Fields**: `title`, `slug` (Unique), `description`, `coverImage`, `isPublished`, `createdAt`, `updatedAt`
- **Relations**: 1:N with `Media`.

#### 24. `Media` (`media`)
- **Primary Key**: `id` (UUID)
- **Fields**: `galleryId` (FK), `title`, `url`, `type` (Enum), `fileSize`, `mimeType`, `uploadedById` (FK), `createdAt`, `updatedAt`
- **Indexes**: `galleryId`, `type`.

#### 25. `Document` (`documents`)
- **Primary Key**: `id` (UUID)
- **Fields**: `title`, `fileName`, `fileUrl`, `mimeType`, `fileSize`, `category`, `isPublic`, `uploadedById` (FK), `createdAt`, `updatedAt`, `isDeleted`, `deletedAt`
- **Indexes**: `category`, `isPublic`, `isDeleted`.

---

### 3.7 Finance & Auditing

#### 26. `FeeStructure` (`fee_structures`)
- **Primary Key**: `id` (UUID)
- **Fields**: `classId` (FK), `name`, `amount` (Decimal 10,2), `frequency` (Enum), `academicYear`, `description`, `createdAt`, `updatedAt`
- **Relations**: 1:N with `Invoice`.

#### 27. `Invoice` (`invoices`)
- **Primary Key**: `id` (UUID)
- **Fields**: `studentId` (FK), `feeStructureId` (FK), `invoiceNumber` (Unique), `amount` (Decimal 10,2), `paidAmount` (Decimal 10,2), `balance` (Decimal 10,2), `status` (Enum), `dueDate`, `createdById` (FK), `notes`, `createdAt`, `updatedAt`
- **Relations**: 1:N with `Payment`.
- **Indexes**: `invoiceNumber` (Unique), `studentId`, `status`, `dueDate`.

#### 28. `Payment` (`payments`)
- **Primary Key**: `id` (UUID)
- **Fields**: `invoiceId` (FK), `paymentNumber` (Unique), `amount` (Decimal 10,2), `paymentMethod` (Enum), `transactionRef`, `status` (Enum), `paidAt`, `notes`, `createdAt`, `updatedAt`
- **Indexes**: `paymentNumber` (Unique), `invoiceId`, `paidAt`.

#### 29. `AuditLog` (`audit_logs`)
- **Primary Key**: `id` (UUID)
- **Fields**: `userId` (FK, Nullable), `action`, `entityType`, `entityId`, `details` (JSONB), `ipAddress`, `userAgent`, `timestamp`
- **Indexes**: `userId`, `(entityType, entityId)`, `timestamp`.

---

## 4. Comprehensive Schema Review & Risk Mitigation

### 4.1 Duplicate Data Analysis
| Risk Identified | Architectural Resolution |
| :--- | :--- |
| Redundant student biographical details (name, email) | Biographical identity is normalized into `users`. `students` contains only student-specific attributes (`admissionNumber`, `rollNumber`, medical details, guardian links). |
| Duplicate course and timetable scheduling | Normalized via `TeacherAssignment` and `Timetable` models with compound unique keys `(sectionId, dayOfWeek, startTime)` preventing classroom and instructor double-booking. |
| Redundant fee charges across cohorts | `FeeStructure` models cohort-wide templates (by Class and Academic Year). Individual `Invoice` instances link to this single authoritative template. |

### 4.2 Missing Indexes & Query Optimization Strategy
The following compound and single indexes have been created directly in PostgreSQL:
1. **Authentication Lookups**: `users(email)` ensures instantaneous user retrieval during JWT authentication and token verification.
2. **Attendance History**: Compound index `attendances(sectionId, date)` provides sub-millisecond retrieval of homeroom registers.
3. **Financial Ledgers**: Compound indexes on `invoices(studentId, status)` allow rapid calculation of outstanding balances.
4. **Audit Log Forensics**: Compound index `audit_logs(entityType, entityId)` enables rapid historical audit retrieval per record.
5. **Soft Delete Scans**: B-Tree indexes on `isDeleted` enable query planners to perform index range scans filtering active rows (`WHERE "isDeleted" = false`).

### 4.3 Referential Integrity & Cascade Semantics
- **Profile Cascades (`ON DELETE CASCADE`)**: When a `User` account is deleted, their specialized profile (`Student`, `Teacher`, `Parent`) is cleaned up automatically.
- **Audit Retention (`ON DELETE SET NULL`)**: Historical audit logs, invoices, and admissions retain audit records even if an operator account is purged (`userId` becomes `NULL`).
- **Financial Protection (`ON DELETE RESTRICT`)**: Fee structures cannot be dropped if invoices are linked, protecting accounting books against unintentional cascade deletion.

### 4.4 Authorization & Access Boundary Risks
1. **Model Exposure Risk**: Direct return of Prisma entities exposes hashed passwords, session timestamps, and system flags.
   - **Remedy**: All endpoints serialize models through explicit DTO mappers (`toUserResponseDto`, `toStudentResponseDto`, etc.) before returning responses.
2. **ID Enumeration Vulnerability**: Sequential integer IDs (`1, 2, 3...`) allow automated scraping of private student data.
   - **Remedy**: Cryptographically strong UUIDs (`gen_random_uuid()`) are utilized across all 27 primary keys.
3. **Cross-Tenant Data Leakage**: Students or Parents accessing unauthorized classmates' records.
   - **Remedy**: Service-level row filtering guarantees that parent queries are strictly scoped to `student.parentId == authenticatedUser.parentId`.

### 4.5 Concurrency & Scalability Architecture
1. **Connection Pooling**: Supported via PgBouncer / Prisma connection pooling (`connection_limit` tuned to database compute units).
2. **Transaction Isolation**: Multi-step operations (such as recording a payment and updating invoice balance) use Prisma interactive transactions (`prisma.$transaction`) at `READ COMMITTED` or `REPEATABLE READ` levels.
3. **Partitioning Readiness**: The `audit_logs` and `attendances` tables are designed around date-range boundaries, making them candidates for PostgreSQL declarative range partitioning (`PARTITION BY RANGE (timestamp)` and `PARTITION BY RANGE (date)`) when dataset scales exceed tens of millions of rows.

---

## 5. Migration & Seed Operations

### Applying Migrations to Local/Production PostgreSQL:
```bash
# Apply pending migrations
npm --workspace=@school/api run prisma:migrate

# Or apply in production deployment pipelines:
npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma
```

### Seeding Development Database:
```bash
npm --workspace=@school/api run prisma:seed
```
This script populates all default roles, permission catalogs, academic levels, faculty profiles, sample students, classes, timetables, and invoices.
