# System Architecture & Technical Specifications
## School Management & Information Platform

---

## 1. System Architecture Overview

The system is architected as a high-performance, modular monorepo managed with **Turborepo** and **npm workspaces**. It enforces strict separation of concerns, end-to-end type safety, and unified contract validation across client and server tiers.

```
                           +------------------------------+
                           |     Edge / CDN / DNS         |
                           |   (Cloudflare / Nginx)       |
                           +--------------+---------------+
                                          |
                   +----------------------+----------------------+
                   |                                             |
                   v                                             v
        +----------------------+                      +----------------------+
        | Static Client Assets |                      | Express API Backend  |
        | Vite + React (SPA)   |                      | Node.js + TypeScript |
        | Port: 3000 / 80      |                      | Port: 5000           |
        +----------------------+                      +----------+-----------+
                                                                 |
                                                  +--------------+--------------+
                                                  |                             |
                                                  v                             v
                                       +--------------------+        +--------------------+
                                       | Primary Database   |        | Media / Storage    |
                                       | MongoDB Replica Set|        | S3 / Local Vol     |
                                       +--------------------+        +--------------------+
```

### Core Architecture Characteristics
- **Client (Frontend)**: React Single-Page Application (SPA) driven by Vite, TypeScript, and Tailwind CSS v3.
- **Server (Backend)**: Stateless Express.js application compiled with TypeScript, providing RESTful API endpoints, JWT authentication with token rotation, and RBAC authorization.
- **Shared Package (`@school/shared`)**: Single source of truth containing domain interfaces, TypeScript types, and Zod validation schemas shared by both client and server to prevent contract drift.
- **Database**: MongoDB with Mongoose ODM utilizing schema validation, strict compound indexes, and ACID transaction support.

---

## 2. File & Media Storage Architecture

```
Client (Form Data) ---> Multer Middleware ---> Magic Byte / MIME Validation
                                                       |
                             +-------------------------+-------------------------+
                             |                                                   |
                             v                                                   v
                  [Local Dev Storage]                                   [Cloud Object Storage]
                  `uploads/` Directory                                  AWS S3 / Cloudflare R2
                  Static Express Serve                                  Presigned CDN Delivery
```

1. **Upload Pipeline**:
   - Multi-part requests handled via `multer` memory storage.
   - Server-side validation restricts file types to strictly verified MIME types (`image/jpeg`, `image/png`, `image/webp`, `application/pdf`).
   - Maximum file size caps enforced: 5MB for profile avatars, 25MB for document assignments and student transcripts.
2. **Storage Providers**:
   - **Local Environment**: Persistent volume mounted at `apps/server/uploads/` served via authenticated static route `/api/uploads/`.
   - **Production Environment**: Object Storage (AWS S3 or Cloudflare R2) with automated thumbnail generation, content hash naming (`uuidv4 + ext`), and private bucket policies with pre-signed URL access for sensitive student documents.

---

## 3. Notification Architecture

```
System Event (e.g. Admission Approved / Attendance Marked)
                 |
                 v
      +---------------------+
      | Notification Engine |
      +----------+----------+
                 |
        +--------+--------+
        |                 |
        v                 v
[In-App Database Record]  [Email Dispatcher]
MongoDB `notifications`   Nodemailer / SES
Client polling / SSE      HTML Email Templates
```

1. **In-App Notifications**: Stored in MongoDB collection with schema `{ userId, title, message, type, isRead, link, createdAt }`. Delivered dynamically upon user login and polled periodically.
2. **Transactional Email**: Async worker abstraction utilizing **Nodemailer** (local development / Mailpit) and **Amazon SES / SendGrid** (production) for:
   - Admission Application Reference & Confirmation.
   - Admission Decision Alerts (Accepted, Interview Scheduled).
   - Password reset and security notifications.
   - Absenteeism alerts dispatched to registered parent emails.

---

## 4. Error Handling Architecture

The platform implements an exhaustive, centralized error-handling strategy that prevents uncaught promise rejections, maintains audit visibility, and never leaks internal stack traces to clients in production.

### 4.1 Error Hierarchy
- `AppError`: Base application error class extending `Error` with `statusCode`, `isOperational`, and `errorCode`.
- `ValidationError`: Derived error populated automatically when Zod schema parsing encounters invalid input.
- `AuthenticationError`: 401 Unauthorized exceptions for invalid/missing JWT tokens.
- `AuthorizationError`: 403 Forbidden exceptions for insufficient RBAC privileges.
- `NotFoundError`: 404 Resource missing exceptions.

### 4.2 Standard API Error Envelope
```json
{
  "success": false,
  "error": "Human readable error description",
  "code": "ERROR_CODE_CONSTANT",
  "errors": {
    "field": ["Field specific validation error message"]
  },
  "timestamp": "2026-09-28T01:30:00.000Z"
}
```

---

## 5. Logging Architecture

1. **Logger Implementation**: **Winston** structured JSON logger coupled with **Morgan** for HTTP access tracing.
2. **Log Levels**:
   - `error`: Unhandled exceptions, database disconnections, critical authentication failures.
   - `warn`: Deprecation notices, rate limit saturation, failed authorization attempts.
   - `info`: Server lifecycle events, successful migrations, scheduled cron runs.
   - `http`: Inbound HTTP request method, URL, status code, response time, and user agent.
   - `debug`: Detailed query and calculation logs (active in `development` only).
3. **Log Rotation**: Daily rotating file transport with maximum file retention of 30 days and 20MB per chunk (`logs/error-%DATE%.log`, `logs/combined-%DATE%.log`).
4. **Log Masking**: Automated scrubber sanitizes passwords, authorization headers, credit cards, and sensitive student demographic records before writing to disk.

---

## 6. Scalability & High Availability Considerations

1. **Stateless API Tier**: Express API nodes do not store session state in memory. All user sessions are driven by cryptographically signed JWT tokens and MongoDB/Redis backing stores.
2. **Database Optimization**:
   - Compound indexes tailored to high-cardinality queries (`{ classId: 1, date: 1 }` on Attendance, `{ studentId: 1 }` on Grades).
   - Lean query execution (`.lean()`) for high-volume read endpoints.
   - MongoDB replica sets for high-availability read/write splitting.
3. **Caching Layer**: HTTP response caching headers (`Cache-Control: public, max-age=86400`) on static public routes (School About, Academics, Faculty directories).
4. **Connection Pooling**: Mongoose connection configured with `maxPoolSize: 50` and `minPoolSize: 10` to handle concurrent burst traffic.

---

## 7. Development Environments

| Parameter | Local Development | Staging Environment | Production Environment |
| :--- | :--- | :--- | :--- |
| **URL Client** | `http://localhost:3000` | `https://staging.oakridge.edu` | `https://oakridge.edu` |
| **URL API** | `http://localhost:5000` | `https://api-staging.oakridge.edu` | `https://api.oakridge.edu` |
| **Database** | Local MongoDB (`127.0.0.1:27017`) | Managed MongoDB Atlas (Dev Tier) | Managed MongoDB Atlas (Prod Cluster) |
| **SSL / HTTPS** | Disabled (plain HTTP) | Enforced (Let's Encrypt / Cloudflare) | Enforced (Cloudflare Strict SSL) |
| **CORS Origins** | `localhost:3000`, `127.0.0.1:3000` | `https://staging.oakridge.edu` | `https://oakridge.edu` |
| **Log Format** | Console colorized (`dev`) | Structured JSON | Structured JSON + External Ingestion |
| **Rate Limiter** | Generous (1000 req / 15m) | Strict (300 req / 15m) | Production Hardened (200 req / 15m) |

---

## 8. Environment Variables Specification

```bash
# ==============================================
# SERVER CONFIGURATION (.env)
# ==============================================
PORT=5000
NODE_ENV=development                    # development | test | staging | production
CLIENT_URL=http://localhost:3000

# DATABASE
MONGODB_URI=mongodb://127.0.0.1:27017/school_portal

# AUTHENTICATION & SECURITY
JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10

# EMAIL DISPATCH
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM="Oakridge Academy <no-reply@oakridge.edu>"

# FILE STORAGE (Optional for S3)
STORAGE_DRIVER=local                    # local | s3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-west-2
AWS_S3_BUCKET=oakridge-media-bucket

# ==============================================
# CLIENT CONFIGURATION (.env)
# ==============================================
VITE_API_URL=/api
VITE_APP_NAME="Oakridge International Academy"
```

---

## 9. Git Branching Strategy

The repository adheres to a strict **Trunk-Based / GitFlow Variant** strategy:

```
feature/*  ---> PR / Code Review ---> staging ---> PR / Validation ---> main (Production)
                                                                           |
hotfix/*   ----------------------------------------------------------------+
```

- `main`: Production-ready code only. Tagged with semantic release numbers (`v1.0.0`). Automated deployments to production occur from this branch.
- `staging`: Pre-production staging environment for integration testing and QA review.
- `feature/<ticket-id>-<short-description>`: Ephemeral branches branched off `staging`. Requires passing CI checks and 1 peer code review before merge.
- `hotfix/<description>`: Emergency patches branched directly off `main` and back-ported into `staging`.

---

## 10. API Versioning Strategy

- **Strategy**: URI Path Versioning (`/api/v1/...`).
- **Deprecation Policy**: Minimum 6-month support window with `Sunset` and `Deprecation` HTTP response headers.
- **Breaking Change Criteria**: Removing an endpoint, altering required input types, changing HTTP status codes, or removing response fields.
- **Internal Forwarding**: Default `/api/...` redirects to latest active stable version (`/api/v1/...`).

---

## 11. Coding Standards & Governance

1. **TypeScript Strict Mode**: Enabled across all packages (`noImplicitAny: true`, `strictNullChecks: true`, `strictFunctionTypes: true`).
2. **Linting & Formatting**:
   - **ESLint**: Standardized ruleset forbidding unused variables, unhandled promises, and implicit `any`.
   - **Prettier**: Single quotes, 2-space indentation, trailing commas on multi-line objects, 100 character print width.
3. **Naming Conventions**:
   - PascalCase for React components, Mongoose models, and TypeScript interfaces (`UserProfile.tsx`, `User.ts`, `StudentDossier`).
   - camelCase for functions, variables, routes, and controllers (`markBatchAttendance`, `authController.ts`).
   - UPPER_SNAKE_CASE for environment variables and constant enums (`USER_ROLES`, `JWT_ACCESS_SECRET`).

---

## 12. Complete Monorepo Folder Architecture

```
school-website/
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Automated Lint, Test & Build pipeline
│       └── deploy.yml                 # Production deployment trigger
├── docs/                              # Architecture & Technical Requirements
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── RBAC.md
│   ├── DATABASE-DESIGN.md
│   ├── API-DESIGN.md
│   ├── SECURITY.md
│   ├── TESTING.md
│   └── DEPLOYMENT.md
├── docker-compose.yml                 # Multi-container orchestration (DB, API, Client)
├── package.json                       # Monorepo root workspaces definition
├── turbo.json                         # Turborepo task pipeline configuration
├── .gitignore
├── README.md
│
├── packages/
│   └── shared/                        # Shared Types & Zod Validation Schemas
│       ├── src/
│       │   ├── index.ts               # Public barrel exporter
│       │   ├── types.ts               # Domain interfaces & TypeScript types
│       │   └── schemas.ts             # Zod input validation schemas
│       ├── package.json
│       └── tsconfig.json
│
└── apps/
    ├── server/                        # Express.js REST API Server
    │   ├── src/
    │   │   ├── config/                # Environment and Database configuration
    │   │   │   ├── index.ts
    │   │   │   └── db.ts
    │   │   ├── controllers/           # HTTP Request Controllers
    │   │   │   ├── authController.ts
    │   │   │   ├── admissionController.ts
    │   │   │   ├── classController.ts
    │   │   │   ├── attendanceController.ts
    │   │   │   ├── gradeController.ts
    │   │   │   ├── announcementController.ts
    │   │   │   └── statsController.ts
    │   │   ├── models/                # Mongoose Database Models
    │   │   │   ├── User.ts
    │   │   │   ├── Admission.ts
    │   │   │   ├── SchoolClass.ts
    │   │   │   ├── Attendance.ts
    │   │   │   ├── Grade.ts
    │   │   │   └── Announcement.ts
    │   │   ├── middleware/            # Security, Auth, RBAC & Error Middlewares
    │   │   │   ├── auth.ts
    │   │   │   ├── rbac.ts
    │   │   │   ├── validate.ts
    │   │   │   └── errorHandler.ts
    │   │   ├── routes/                # Express Route Handlers
    │   │   │   ├── index.ts
    │   │   │   ├── authRoutes.ts
    │   │   │   ├── admissionRoutes.ts
    │   │   │   ├── classRoutes.ts
    │   │   │   ├── attendanceRoutes.ts
    │   │   │   ├── gradeRoutes.ts
    │   │   │   ├── announcementRoutes.ts
    │   │   │   └── statsRoutes.ts
    │   │   ├── utils/                 # Utilities, JWT tokens, and seeders
    │   │   │   ├── token.ts
    │   │   │   ├── logger.ts
    │   │   │   └── seed.ts
    │   │   ├── app.ts                 # Express Application factory
    │   │   └── server.ts              # HTTP listener & process lifecycle
    │   ├── tests/                     # Integration tests (Supertest + Vitest)
    │   │   └── api.test.ts
    │   ├── Dockerfile
    │   ├── package.json
    │   └── tsconfig.json
    │
    └── client/                        # React + Vite + Tailwind CSS Frontend
        ├── public/                    # Static Assets (favicon, high-res photos)
        │   ├── favicon.svg
        │   └── images/
        │       ├── campus-hero.jpg
        │       └── stem-lab.jpg
        ├── src/
        │   ├── components/            # Reusable UI & Layout Components
        │   │   ├── layout/
        │   │   │   ├── Navbar.tsx
        │   │   │   └── Footer.tsx
        │   │   └── auth/
        │   │       └── ProtectedRoute.tsx
        │   ├── context/               # Global React State Contexts
        │   │   └── AuthContext.tsx
        │   ├── pages/                 # Route Pages
        │   │   ├── public/
        │   │   │   ├── HomePage.tsx
        │   │   │   ├── AboutPage.tsx
        │   │   │   ├── AcademicsPage.tsx
        │   │   │   ├── AdmissionsPage.tsx
        │   │   │   ├── AnnouncementsPage.tsx
        │   │   │   └── ContactPage.tsx
        │   │   └── portal/
        │   │       ├── LoginPage.tsx
        │   │       ├── AdminDashboard.tsx
        │   │       ├── TeacherDashboard.tsx
        │   │       ├── StudentDashboard.tsx
        │   │       └── ParentDashboard.tsx
        │   ├── services/              # API Client & Axios Interceptors
        │   │   └── api.ts
        │   ├── tests/                 # Component Unit Tests
        │   │   ├── setup.ts
        │   │   └── App.test.tsx
        │   ├── App.tsx                # React Router Tree
        │   ├── main.tsx               # Client Bootstrap Entry
        │   └── index.css              # Tailwind and Custom Design Styles
        ├── Dockerfile
        ├── nginx.conf
        ├── package.json
        ├── tailwind.config.js
        ├── tsconfig.json
        └── vite.config.ts
```
