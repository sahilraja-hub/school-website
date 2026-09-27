# Comprehensive Testing Strategy & Quality Assurance
## School Management & Information Platform

---

## 1. Testing Pyramid & Objectives

The testing suite ensures regression prevention, strict contract validation, and role security across the entire monorepo.

```
                  / \
                 /   \
                / E2E \              Playwright (Critical User Flows)
               /-------\
              /  Integ  \            Supertest + Express API + DB
             /-----------\
            /  Component  \          React Testing Library + Vitest
           /---------------\
          /   Unit Tests    \        Vitest (Pure Functions, Zod Schemas)
         +-------------------+
```

| Level | Tooling | Target Scope | Coverage Target |
| :--- | :--- | :--- | :--- |
| **Unit Testing** | Vitest | Zod schemas, JWT utilities, password hashing, pure helpers | ≥ 90% |
| **Component Testing** | React Testing Library + JSDOM | React UI components, navigation, form validations | ≥ 80% |
| **API Integration** | Supertest + Vitest | Express routes, controllers, middleware, RBAC guards | ≥ 85% |
| **End-to-End (E2E)** | Playwright | Full user journeys across all 6 roles | 100% Core Flows |

---

## 2. Test Suites Implementation

### 2.1 API Integration Tests (`apps/server/tests/api.test.ts`)
Using **Supertest** to test HTTP contracts, input rejection, and RBAC security:
- Verifies `/api/health` returns `200 OK` and expected uptime payload.
- Validates that invalid payloads to `/api/auth/login` and `/api/admissions/apply` fail with structured `400 Bad Request` and exact field-level Zod issues.
- Confirms that unauthenticated requests to protected endpoints (`/api/classes`, `/api/attendance/mark`) immediately reject with `401 Unauthorized`.
- Asserts that authenticated non-admin users attempting admin actions receive `403 Forbidden`.

### 2.2 Component Unit Tests (`apps/client/src/tests/App.test.tsx`)
Using **React Testing Library** with **JSDOM**:
- Asserts brand rendering: "OAKRIDGE International Academy" and header links.
- Tests multi-step Admissions wizard: advances from Step 1 to Step 2 only when required student fields are filled.
- Verifies Role Switcher toggles portal context correctly.

### 2.3 End-to-End (E2E) Test Plan (`Playwright`)
Critical automated browser workflows executed in headless Chromium, Firefox, and WebKit:
1. **Flow 1: Public Online Application**:
   - Visitor navigates to `/admissions`.
   - Fills out student & guardian details.
   - Submits application, confirms confetti animation, records tracking number.
   - Searches tracking number, confirms status shows "SUBMITTED".
2. **Flow 2: Admin Review & Decision**:
   - Logs in as `admin@oakridge.edu`.
   - Navigates to Admin Dashboard.
   - Finds new application in pipeline, updates status to "UNDER_REVIEW".
3. **Flow 3: Faculty Attendance**:
   - Logs in as `teacher@oakridge.edu`.
   - Navigates to Faculty Workspace.
   - Marks attendance for Period 1, clicks "Save Attendance".
   - Confirms success notification toast.
4. **Flow 4: Student Gradebook Inspection**:
   - Logs in as `student@oakridge.edu`.
   - Inspects Gradebook, verifies GPA display and attendance gauge render correctly.

---

## 3. Test Automation & CI Pipeline

Tests are automatically executed on every pull request via GitHub Actions:
- `npm run test` executes concurrently across workspaces via Turbo (`turbo run test`).
- Pull requests are blocked from merging if any test fails or if coverage drops below defined thresholds.
