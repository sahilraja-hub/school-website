# Role-Based Access Control (RBAC) Architecture
## School Management & Information Platform

---

## 1. Overview & Principles

The Oakridge School Platform enforces a strict, multi-tiered **Role-Based Access Control (RBAC)** model combined with **Object-Level Ownership Verification**. This ensures:
1. **Principle of Least Privilege**: Users are granted only the minimum permissions necessary to fulfill their institutional responsibilities.
2. **Horizontal Access Protection**: Students and parents can never access records belonging to other families, even within the same role tier.
3. **Defense in Depth**: Authorization is verified at the network ingress, controller middleware, and database query abstraction layers.

---

## 2. Defined Roles & Institutional Responsibilities

| Role | Institutional Responsibility Scope |
| :--- | :--- |
| **Public Visitor** | Unauthenticated user. Can view public institutional pages, submit admission applications, and track application status via reference tokens. |
| **Student** | Enrolled learner. Has read access to their enrolled courses, homework assignments, personal attendance rate, exam report cards, and school bulletin circulars. Can submit completed homework assignments. |
| **Parent / Guardian** | Authorized caregiver. Has read-only oversight over linked child's attendance, grades, fee invoices, and notices. Can message faculty and schedule conferences. |
| **Teacher / Faculty** | Academic educator. Can record daily attendance for assigned class sections, author and grade assignments, submit exam scores, schedule parent-teacher meetings, and publish class-specific notices. |
| **Admin** | Operational manager (Admissions Officer, Dean of Academics). Can manage master student/teacher/parent rosters, process admissions applications, configure courses/classes, publish institutional circulars, and monitor metrics. |
| **Super Admin** | Executive leadership (Principal, Systems Director). Holds unrestricted global authority over system configuration, user provisioning, role promotion, fee head creation, database backups, and immutable audit logs. |

---

## 3. Granular Permission Keys

```typescript
export type PermissionKey =
  // Student Management
  | 'student:create' | 'student:read' | 'student:update' | 'student:delete'
  // Parent Management
  | 'parent:create' | 'parent:read' | 'parent:update' | 'parent:delete'
  // Faculty Management
  | 'teacher:create' | 'teacher:read' | 'teacher:update' | 'teacher:delete'
  // Academic Structure
  | 'class:manage' | 'section:manage' | 'subject:manage'
  // Attendance
  | 'attendance:mark' | 'attendance:read_all' | 'attendance:read_own'
  // Grades & Exams
  | 'exam:manage' | 'grade:submit' | 'grade:read_all' | 'grade:read_own'
  // Homework
  | 'homework:create' | 'homework:submit' | 'homework:grade' | 'homework:read'
  // Admissions
  | 'admission:submit' | 'admission:track' | 'admission:review' | 'admission:manage'
  // Circulars & Notices
  | 'notice:create' | 'notice:publish' | 'notice:delete' | 'notice:read'
  // Fees & Billing
  | 'fee:manage' | 'fee:record_payment' | 'fee:read_all' | 'fee:read_own'
  // System Administration
  | 'user:provision' | 'user:manage_roles' | 'audit:view' | 'system:configure';
```

---

## 4. Master RBAC Permission Matrix

| Module / Action | Public Visitor | Student | Parent | Teacher | Admin | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **View Public Website** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Submit Online Admission** | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Track Admission Status** | ✅ (Ref Code) | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Manage Admissions Pipeline** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Approve / Reject Admissions** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **View Personal Dashboard** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Own Attendance** | ❌ | ✅ | ✅ (Child) | ✅ (Classes) | ✅ | ✅ |
| **Mark Daily Attendance** | ❌ | ❌ | ❌ | ✅ (Assigned) | ✅ | ✅ |
| **View Own Gradebook / Marks** | ❌ | ✅ | ✅ (Child) | ✅ (Classes) | ✅ | ✅ |
| **Input / Update Grades** | ❌ | ❌ | ❌ | ✅ (Assigned) | ✅ | ✅ |
| **Publish Homework / Tasks** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Submit Homework Solution** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **View Timetable** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Configure Timetable Master** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Manage Student / Parent Records**| ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Manage Faculty Records** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Broadcast Public Notices** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Broadcast Class Notices** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **View Fee Invoices & Receipts** | ❌ | ❌ | ✅ (Child) | ❌ | ✅ | ✅ |
| **Manage Fee Structures** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **User Account Provisioning** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Role Elevation & Promotion** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Access Immutable Audit Logs** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **System Settings & Config** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. Authorization Enforcement Architecture

### 5.1 Backend Role Guard Middleware
```typescript
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@school/shared';

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized: Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden: Access denied. Required: ${allowedRoles.join(', ')}. Current: ${req.user.role}`,
      });
      return;
    }

    next();
  };
};
```

### 5.2 Object-Level Ownership Middleware (Parent / Student Isolation)
For endpoints accessing specific student data (`/api/grades/student/:studentId`):
1. **Admins and Super Admins**: Unrestricted access.
2. **Teachers**: Permitted only if the requested student is enrolled in at least one course taught by the authenticated teacher.
3. **Parents**: Permitted only if `parent.studentIds.includes(studentId)`.
4. **Students**: Permitted only if `studentId === req.user._id`.

### 5.3 Client-Side Route Protection (`ProtectedRoute.tsx`)
```tsx
<Route
  path="/portal/admin"
  element={
    <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```
If an unauthenticated user navigates to a protected route, they are seamlessly redirected to `/login` preserving their target destination in router state. If an authenticated user lacks the required role, an interactive 403 Forbidden screen is rendered directing them to their allowed portal.
