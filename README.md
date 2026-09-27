# Oakridge International Academy — School Management & Information Platform

[![CI Pipeline](https://github.com/sahilraja-hub/school-website/actions/workflows/ci.yml/badge.svg)](https://github.com/sahilraja-hub/school-website/actions)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict_Mode-blue.svg)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-ef4444.svg)](https://turbo.build/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, full-stack School Management & Information Platform combining a prestigious public-facing educational website with an integrated Role-Based Access Control (RBAC) portal for scholars, guardians, educators, and institutional leadership.

---

## 🏛️ System Architecture & Monorepo Layout

The repository is organized as a high-performance monorepo powered by **npm workspaces** and **Turborepo**:

```
school-website/
├── apps/
│   ├── web/                    # React 18, Vite, TypeScript, Tailwind CSS v3, React Router
│   └── api/                    # Node.js, Express, TypeScript, Mongoose, JWT + Cookie Auth
├── packages/
│   ├── shared/                 # Domain types, interfaces & Zod validation schemas
│   └── config/                 # Base configurations for TypeScript, ESLint & Prettier
├── docs/                       # Architectural specifications & PRDs
│   ├── PRD.md                  # Complete Product Requirements Document
│   ├── ARCHITECTURE.md         # Monorepo, storage, and system technical architecture
│   ├── RBAC.md                 # Role-based access control matrix & permission keys
│   ├── DATABASE-DESIGN.md      # Mongoose schemas, indexes, and Mermaid ERD
│   ├── API-DESIGN.md           # REST API endpoint contracts (/api/v1)
│   ├── SECURITY.md             # Dual-token rotation, OWASP hardening, and Helmet CSP
│   ├── TESTING.md              # Vitest, React Testing Library, Supertest & Playwright
│   ├── DEPLOYMENT.md           # Multi-stage Dockerfiles, Nginx, CI/CD & backup specs
│   └── DESIGN-SYSTEM.md        # UI/UX design tokens, color scales & component catalog
├── .editorconfig               # Editor whitespace and character encoding standards
├── .eslintrc.cjs               # Monorepo root ESLint ruleset
├── .prettierrc                 # Code formatting standards
├── .env.example                # Canonical environment variable blueprint
└── turbo.json                  # Turborepo task pipeline execution graph
```

---

## 🚀 Technology Stack

### Frontend (`apps/web`)
- **Core**: React 18 with TypeScript in strict mode.
- **Build Tool**: Vite 6 with lightning-fast HMR and optimized production bundling.
- **Styling**: Tailwind CSS v3 with tailored design tokens (`crest` navy, `gold` heritage, custom radii, elevation shadows).
- **Routing**: React Router v6 with declarative public and RBAC-protected portal layouts.
- **Component Library**: 29 accessible reusable UI components (`Button`, `Modal`, `Drawer`, `Table`, `Badge`, `Toast`, etc.).

### Backend (`apps/api`)
- **Runtime**: Node.js 22 LTS with Express.js and TypeScript.
- **API Versioning**: Canonical `/api/v1` namespace with backwards-compatible `/api` routing.
- **Database**: MongoDB with Mongoose ODM (compound unique indexes, schema validation, population).
- **Validation**: Shared Zod schemas ensuring complete end-to-end type safety.
- **Authentication**: Access JWT (in-memory) + Refresh JWT (HTTP-only, Secure, SameSite cookies) with token rotation.
- **Security**: Helmet security headers, CORS origin whitelisting, tiered Express rate limiters.
- **Logging**: Morgan HTTP access logging + structured JSON logger.

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: `v20.0.0` or higher (`v24+` recommended).
- **npm**: `v9.0.0` or higher.
- **MongoDB**: Local MongoDB instance (`127.0.0.1:27017`) or a free MongoDB Atlas connection string.

### 1. Installation
Clone the repository and install all workspace dependencies:
```bash
git clone https://github.com/sahilraja-hub/school-website.git
cd school-website
npm install
```

### 2. Environment Configuration
Copy `.env.example` to create your environment variables:
```bash
cp .env.example .env
cp .env.example apps/api/.env
```

### 3. Build Shared Packages
Compile the `@school/shared` library:
```bash
npm run build --workspace=@school/shared
```

### 4. Running the Development Server
Launch both frontend and backend concurrently via Turborepo:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API Server**: `http://localhost:5000/api/v1`
- **Health Check Probe**: `http://localhost:5000/api/v1/health`
- **Design System Showcase**: `http://localhost:3000/design-system`

---

## 📦 Monorepo Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs web client and API server concurrently in parallel. |
| `npm run build` | Builds all packages and production bundles via Turbo pipeline. |
| `npm run test` | Executes unit and API integration tests (Supertest + Vitest). |
| `npm run typecheck` | Validates TypeScript types across all workspaces with `noEmit`. |
| `npm run lint` | Lints TypeScript and JavaScript code across the entire monorepo. |
| `npm run seed` | Seeds database with demo accounts for each role (`apps/api`). |

---

## 🛡️ Role-Based Access Control (RBAC) Accounts

For testing and demonstration, use the pre-configured credentials or the instant one-click login buttons on `/login`:

| Role | Demo Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@oakridge.edu` | `Admin@123456` | Full admissions pipeline, circular broadcasting, roster oversight |
| **Teacher** | `teacher@oakridge.edu`| `Teacher@123456`| Batch attendance recording, homework grading, course schedule |
| **Student** | `student@oakridge.edu`| `Student@123456`| Personal GPA gradebook, timetable, attendance summary ring |
| **Parent** | `parent@oakridge.edu` | `Parent@123456` | Child progress tracking, teacher conferencing, fee receipts |

---

## 🔒 Security Best Practices
- **No Hardcoded Secrets**: All cryptographic keys and connection strings reside in `.env`.
- **Token Rotation**: Consumed refresh tokens are invalidated upon every rotation request.
- **Input Sanitization**: Request bodies, params, and queries are verified against Zod schemas prior to controller execution.

---

## 📄 License
This project is licensed under the MIT License.
