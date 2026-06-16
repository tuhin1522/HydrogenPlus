<div align="center">

<img src="https://img.shields.io/badge/HydrogenPlus-EdTech%20Platform-6366f1?style=for-the-badge&logoColor=white" alt="HydrogenPlus" height="60"/>

# ⚡ HydrogenPlus

### Multi-Branch Education Management Platform

*A centralized, role-based EdTech platform for coaching & tutoring institutions — unifying student management, content delivery, exams, payments, and analytics across 5 branches.*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Container-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](https://github.com/tuhin1522/HydrogenPlus/pulls)
[![GitHub Stars](https://img.shields.io/github/stars/tuhin1522/HydrogenPlus?style=flat-square&color=gold)](https://github.com/tuhin1522/HydrogenPlus/stargazers)

<br/>

[🚀 Live Demo](#) · [📖 Documentation](#) · [🐛 Report Bug](https://github.com/tuhin1522/HydrogenPlus/issues) · [✨ Request Feature](https://github.com/tuhin1522/HydrogenPlus/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Role-Based Access Control](#-role-based-access-control)
- [Core Modules](#-core-modules)
- [Database Schema](#-database-schema-overview)
- [API Overview](#-api-overview)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Build Phases](#-build-phases)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**HydrogenPlus** is a production-grade, multi-tenant EdTech platform designed for coaching and tutoring businesses operating across **5 branches**, serving students from **Classes 6–12**. It consolidates every operational need — from student onboarding and content delivery to exam management, fee collection, and data analytics — into a single, unified, role-aware system.

Built with scalability and developer experience in mind, HydrogenPlus enforces strict **data isolation** between branches while giving the Super Admin a **centralized oversight** view across the entire organization.

### Why HydrogenPlus?

| Pain Point | HydrogenPlus Solution |
|---|---|
| Managing 5 branches in spreadsheets | Unified dashboard with branch-level isolation |
| No centralized student records | Structured PostgreSQL DB with Prisma ORM |
| Manual exam grading | Auto-graded MCQ exams with instant leaderboards |
| Fee tracking chaos | Integrated Stripe + SSLCommerz payment system |
| Content scattered across drives | Cloudinary-powered content delivery with versioning |
| Zero performance insight | Real-time analytics per student, teacher, and branch |

---

## ✨ Key Features

- 🏢 **Multi-Branch Architecture** — 5 semi-independent branches with centralized Super Admin oversight
- 🔐 **JWT-Based Auth & RBAC** — Secure authentication with 4 distinct roles and permission enforcement at the API level
- 📚 **Course & Content Management** — Video streaming, PDF uploads, and versioned notes via Cloudinary
- 🗓️ **Smart Schedule Builder** — Conflict-detection for teachers and rooms across branches
- 📝 **MCQ Exam Engine** — Timed exams, auto-grading, reusable question banks, and real-time leaderboards
- 💳 **Dual Payment Gateway** — SSLCommerz (local) + Stripe (international) with webhook-driven status updates
- 📊 **Deep Analytics** — Enrollment trends, revenue breakdowns, weak-subject identification, and exam distributions
- 🔔 **Omni-Channel Notifications** — Email (Nodemailer), SMS (Twilio/BulkSMSBD), and in-app push (Socket.io)
- ⚡ **Redis Caching** — Fast session handling, leaderboard caching, and rate limiting
- 🐳 **Docker-Ready** — Consistent environments across development and production

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
│   Browser (Next.js SSR)  ·  Mobile Browser  ·  Admin Panel  │
└───────────────────────────────┬──────────────────────────────┘
                                │ HTTPS / WSS
┌───────────────────────────────▼──────────────────────────────┐
│                    NEXT.JS FRONTEND                          │
│   Pages: /auth  /dashboard  /courses  /exams  /payments      │
│   State: Zustand / Redux Toolkit                             │
│   UI: Tailwind CSS + shadcn/ui · Charts: Chart.js            │
└───────────────────────────────┬──────────────────────────────┘
                                │ REST API / Socket.io
┌───────────────────────────────▼──────────────────────────────┐
│                    EXPRESS.JS BACKEND                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │   Auth   │ │ Students │ │  Exams   │ │    Payments    │  │
│  │  Routes  │ │  Routes  │ │  Routes  │ │    Routes      │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Branches │ │ Courses  │ │ Schedule │ │  Notifications │  │
│  │  Routes  │ │  Routes  │ │  Routes  │ │    Routes      │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
│         JWT Middleware · Zod Validation · RBAC Guards        │
└─────────┬────────────┬──────────────┬───────────────────────┘
          │            │              │
   ┌──────▼──┐  ┌──────▼──┐  ┌───────▼──────┐
   │PostgreSQL│  │  Redis  │  │  Cloudinary  │
   │ (Prisma) │  │ (Cache) │  │ (Files/Media)│
   └─────────┘  └─────────┘  └──────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 15** | SSR/SSG, routing, SEO optimization |
| **Tailwind CSS** | Utility-first responsive styling |
| **shadcn/ui** | Accessible, headless UI component library |
| **Redux Toolkit / Zustand** | Global state management |
| **Chart.js** | Analytics dashboards and data visualization |
| **Socket.io Client** | Real-time in-app notifications |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | REST API server |
| **JWT + bcrypt** | Authentication and password hashing |
| **Zod** | Request validation and type safety |
| **Socket.io** | WebSocket-based real-time events |
| **Nodemailer** | Transactional email delivery |
| **Twilio / BulkSMSBD** | SMS notifications |

### Database & Storage

| Technology | Purpose |
|---|---|
| **PostgreSQL** | Primary relational database |
| **Prisma ORM** | Type-safe database queries and migrations |
| **Redis** | Session caching, leaderboard, rate limiting |
| **Cloudinary** | Video streaming, PDF and document storage |

### Payments

| Gateway | Region |
|---|---|
| **SSLCommerz** | Local (Bangladesh) |
| **Stripe** | International |

### DevOps & Monitoring

| Tool | Purpose |
|---|---|
| **Docker** | Containerization for consistent environments |
| **GitHub Actions** | CI/CD pipelines |
| **Vercel** | Frontend hosting |
| **Render / Railway / AWS EC2** | Backend hosting |
| **Sentry** | Backend error tracking |
| **LogRocket** | Frontend session monitoring |

---

## 🔐 Role-Based Access Control

HydrogenPlus enforces a **4-tier RBAC** system. Permissions are validated at the API middleware layer — not just the UI — ensuring no role can access unauthorized resources.

```
SUPER ADMIN (Owner)
 ├── Full system access
 ├── Manages all 5 Branch Admins
 ├── Cross-branch analytics & revenue reports
 └── Global student/teacher overview

BRANCH ADMIN (×5)
 ├── Manages own branch only
 ├── CRUD: Students, Teachers, Schedules
 ├── Branch-level payment & enrollment tracking
 └── Cannot access other branches

TEACHER
 ├── Uploads course content (videos, PDFs, notes)
 ├── Creates/manages exams and question banks
 ├── Views student performance in assigned classes
 └── Cannot access payment or admin settings

STUDENT
 ├── Enrolls in courses
 ├── Views class schedule (filtered by branch/class)
 ├── Takes MCQ exams (timed)
 └── Tracks own progress and exam history
```

Each role is redirected to a **distinct dashboard** upon login.

---

## 📦 Core Modules

<details>
<summary><strong>👤 1. Student Management</strong></summary>

- Registration with class selection (Classes 6–12)
- JWT-based login/signup with password reset and session management
- Profile management: class, branch, subjects, contact info
- Course enrollment and class schedule viewer (branch/class filtered)
- Progress tracking per subject and course
- Payment history view

</details>

<details>
<summary><strong>🏢 2. Multi-Branch Management</strong></summary>

- 5 branch units, each with its own dashboard, students, teachers, and schedules
- Super Admin global view with cross-branch performance comparison
- Branch-level data isolation with centralized reporting
- Branch Admin creation and management by Super Admin

</details>

<details>
<summary><strong>📚 3. Course & Content System</strong></summary>

- Courses organized by **class** (6–12) and **subject** (Math, Physics, Chemistry, etc.)
- Content types: **video upload/streaming**, **PDFs**, **notes**
- Content versioning and teacher-wise ownership
- Cloudinary integration for reliable media delivery

</details>

<details>
<summary><strong>🗓️ 4. Class & Routine Management</strong></summary>

- Weekly schedule builder: teacher + branch + subject + time slot
- **Conflict detection**: prevents double-booking teachers or rooms
- Student-facing routine view filtered by class and branch

</details>

<details>
<summary><strong>📝 5. Exam & Quiz System</strong></summary>

- MCQ-based exams with **configurable timers**
- Timer logic: client-side with **server-side validation** to prevent tampering
- **Auto-grading** and instant result generation on submission
- Leaderboard: per class, branch, and subject
- Reusable **question bank** across multiple exams
- Subject-wise performance analytics for students and teachers

</details>

<details>
<summary><strong>💳 6. Payment System</strong></summary>

- Course fees and monthly subscription fees
- **SSLCommerz** (local) + **Stripe** (international) payment gateway integration
- Webhook handling for real-time payment status updates
- Payment status tracking: `PAID` / `DUE` / `OVERDUE`
- Optional: discount codes, coupons, and scholarship handling

</details>

<details>
<summary><strong>📊 7. Dashboard & Analytics</strong></summary>

- **Admin**: total students, revenue per branch, enrollment trends, branch comparison
- **Teacher**: student performance per class, exam result distributions
- **Student**: personal progress, weak-subject identification, exam history

</details>

<details>
<summary><strong>🔔 8. Notification System</strong></summary>

- **Email**: Nodemailer + SMTP (class reminders, exam alerts, payment dues)
- **SMS**: Twilio / BulkSMSBD
- **In-app**: Socket.io real-time push notifications
- Admin-configurable notification templates

</details>

---




## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x or **pnpm** ≥ 9.x
- **PostgreSQL** ≥ 15
- **Redis** ≥ 7
- **Docker** *(optional, recommended)*
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/tuhin1522/HydrogenPlus.git
cd HydrogenPlus

# 2. Install root dependencies (if monorepo)
npm install

# 3. Install frontend dependencies
cd apps/frontend
npm install

# 4. Install backend dependencies
cd ../backend
npm install
```

### Environment Variables

#### Backend — `apps/backend/.env`

```env
# App
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/hydrogenplus"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SSLCommerz
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASS=your_store_pass
SSLCOMMERZ_IS_LIVE=false

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Twilio (SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Sentry
SENTRY_DSN=https://xxxx@sentry.io/xxxx
```

#### Frontend — `apps/frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
```

### Running the App

#### Option A: Docker (Recommended)

```bash
# From the root directory
docker-compose up --build
```

This spins up:
- `frontend` on `http://localhost:3000`
- `backend` on `http://localhost:5000`
- `postgres` on port `5432`
- `redis` on port `6379`

#### Option B: Manual

```bash
# Terminal 1 — Backend
cd apps/backend
npx prisma migrate dev --name init
npx prisma db seed          # Seeds roles, demo branch, admin account
npm run dev                 # Starts Express server on :5000

# Terminal 2 — Frontend
cd apps/frontend
npm run dev                 # Starts Next.js on :3000
```

#### Default Seed Accounts

| Role | Email | Password |
|---|---|---|
| Super Admin | `superadmin@hydrogen.com` | `Admin@123` |
| Branch Admin | `branch1@hydrogen.com` | `Admin@123` |
| Teacher | `teacher@hydrogen.com` | `Teacher@123` |
| Student | `student@hydrogen.com` | `Student@123` |

---

## 📅 Build Phases

| Phase | Modules | Status |
|---|---|---|
| **Phase 1** | Auth, RBAC, Role-based Dashboards | 🔄 In Progress |
| **Phase 2** | Branch Management, Student & Teacher CRUD | ⏳ Planned |
| **Phase 3** | Course & Content System | ⏳ Planned |
| **Phase 4** | Class Schedule Management | ⏳ Planned |
| **Phase 5** | Exam / Quiz System | ⏳ Planned |
| **Phase 6** | Payment Integration (SSLCommerz + Stripe) | ⏳ Planned |
| **Phase 7** | Analytics Dashboards | ⏳ Planned |
| **Phase 8** | Notification System | ⏳ Planned |

---

## 🌐 Deployment

### Frontend → Vercel

```bash
cd apps/frontend
vercel --prod
```

Set environment variables in the Vercel dashboard under **Project Settings → Environment Variables**.

### Backend → Render / Railway / AWS EC2

```bash
# Build
npm run build

# Start
npm run start
```

Ensure your hosting environment has:
- PostgreSQL and Redis connection strings configured
- Webhook endpoints publicly accessible (for Stripe/SSLCommerz)
- SSL/HTTPS enabled

### CI/CD — GitHub Actions

Workflows are located in `.github/workflows/`:
- `ci.yml` — Runs lint, type-check, and tests on every PR
- `deploy-frontend.yml` — Auto-deploys to Vercel on merge to `main`
- `deploy-backend.yml` — Auto-deploys backend on merge to `main`

---

## 🤝 Contributing

Contributions are warmly welcome! Please follow these steps:

1. **Fork** the repository
2. Create a **feature branch**: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add your feature'`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request** against `main`

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Formatting, missing semicolons, etc.
refactor: Code restructuring
test:     Adding or updating tests
chore:    Build process or tooling changes
```

### Code Standards

- **ESLint + Prettier** enforced via pre-commit hooks (Husky + lint-staged)
- All API routes must include **Zod validation**
- All backend routes must be covered by **Jest** unit tests
- PRs require at least **1 reviewer** approval before merge

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Built with ❤️ by [Tuhin](https://github.com/tuhin1522) & [Noornabi](https://github.com/noornabi1) · Powered by open-source software

⭐ **Star this repo** if you find it useful — it helps a lot!

</div>