# Project Roadmap & Developer Checklist

This document is the single source of truth for the Mediverse platform, defining high-level engineering phases, detailed developer tasks, completed progress, and planned backlog.

---

## High-Level Phases

### Phase 1: Architectural Foundation & Project Initialization (Completed)
- [x] Establish canonical documentation (PRD, Architecture specification, ADRs).
- [x] Setup Docker Compose configuration for PostgreSQL 16, Redis, and Elasticsearch.
- [x] Bootstrap the Spring Boot backend with JPA repository interfaces, database migrations, and REST APIs.
- [x] Bootstrap the Next.js workspace with UI component libraries and Three.js viewer boilerplate.

### Phase 2: Content Delivery & Core Pedagogy System (Completed)
- [x] Implement database-driven Next.js lesson dynamic routes.
- [x] Build custom markdown rendering and structured layout parsers for the 20-step pedagogy framework.
- [x] Build interactive quiz engines, question decks, and progress metrics.
- [x] Implement the SM-2 Spaced Repetition Flashcard algorithm.

### Phase 3: Dynamic DB-Driven Curriculum & UI (Completed)
- [x] Complete Flyway SQL schema and seed data for semesters 1 through 9.
- [x] Refactor frontend to remove dual-source catalogs, routing all curriculum stats, syllabus grids, and lessons dynamically through backend endpoints.

### Phase 4: Backend Modularization & Multi-Program Scaling (Completed)
- [x] Restructure Spring Boot backend into package-by-feature modular domains.
- [x] Rename the parent package prefix from `com.physiology` to the program-neutral `com.curiolearn` to support BDS/Nursing/other curricula.
- [x] Add the `Program` hierarchy above the `Curriculum` schema (`V23__add_program_hierarchy.sql`; existing curricula backfilled to a seeded MBBS program).
- [x] Lock package boundaries using lightweight architecture assertions (ArchUnit â€” `ArchitectureTest.java`).

### Phase 5: Metadata-Driven Content Engine & Role-Based CMS (Completed)
- [x] Refactor content schema into dynamic `Lesson` and `ContentBlock` blocks (`V22__metadata_driven_content_engine.sql`).
- [x] Extend user role model documentation (`Roles.java`: `SUPER_ADMIN, ADMIN, FACULTY, CONTENT_WRITER, MEDICAL_REVIEWER, EDITOR, STUDENT`). Column remains free-text for migration safety; validity enforced at the application layer â€” see ADR-002.
- [x] Implement content review workflow (`DRAFT -> IN_REVIEW -> APPROVED -> PUBLISHED` / `REJECTED`) via `ContentReview` audit entity (`V24__cms_content_review_workflow.sql`) and `CmsReviewService`/`CmsReviewController`.
- [x] Build CMS review endpoints (`/api/v1/cms/lessons/**`) with role-based authorization (`@PreAuthorize`).
- [x] Frontend CMS review-queue UI (`/cms`, `/cms/[lessonId]`) â€” tabbed queue by status, content-block preview via the existing `ContentBlockRenderer`, approve/reject with comments, review history.
- [ ] **Backlog**: Curriculum tree editor and lesson content-block *authoring* UI (the review/approve side is built; drafting/editing content blocks still requires direct API calls or DB access).

### Phase 6: Obsolescence, DevOps & CI/CD (In Progress)
- [x] Create GitHub Actions workflow (`.github/workflows/ci.yml`) for Gradle backend builds (against Postgres/Redis/Elasticsearch service containers) and Next.js frontend builds (lint/test/build).
- [x] Configure Prometheus metric export (Spring Boot Actuator + Micrometer, `/actuator/prometheus`) and a `prometheus` service in `docker-compose.yml` scraping the backend.
- [ ] **Backlog**: Grafana/Loki dashboards (Prometheus scraping is wired; visualization layer not yet built).
- [x] Setup production Dockerfiles and deployment configurations.
- [x] Implement Progressive Web App (PWA) configurations for offline capability.

---

## Detailed Task Checklist

### 1. Documentation & Architecture
- [x] Create project `README.md`
- [x] Create project `ROADMAP.md` (unified)
- [x] Create project `CONTRIBUTING.md`
- [x] Document Architecture Decisions:
  - [x] `decisions/001-react-framework.md`
  - [x] `decisions/002-database-choice.md`
  - [x] `decisions/003-authentication.md`
  - [x] `decisions/004-3d-engine.md`
- [x] System Architecture Specification (`docs/architecture/Architecture.md`)
- [x] Product Requirements Document (`docs/prd.md`)

### 2. Infrastructure Setup (Docker, DB, Config)
- [x] Write `docker-compose.yml` for database local running (PostgreSQL, Redis, Elasticsearch).
- [x] Write Flyway database migrations (versions V1 to V21) to baseline the schema and seed curriculum data.
- [x] **Flyway Migration Notice**: Flyway version `V7` was skipped intentionally during database design. This has no effect on database integrity or schema validation.
- [x] Scaffold Spring Boot application properties (dev/prod profiles) and `.env.example`.

### 3. Backend & Security Configuration
- [x] Setup Spring Security filter chain with CORS mappings and stateful JWT token validation filters.
- [x] Implement baseline JPA model objects: `User`, `ProgressTrack`, `Flashcard`.
- [x] Create public REST endpoints for user authentication, progression tracking, and due flashcard review syncing.
- [ ] **Backlog**: Setup WebSocket message handlers for live AI Tutor streaming interactions.

### 4. Frontend Application & Workspace
- [x] Set up Next.js App Router workspace with Tailwind CSS configurations and Outfit typography.
- [x] Configure Tailwind custom themes for cards, layouts, glassmorphism boundaries, and scrolls.
- [x] Install Three.js, React Three Fiber (`@react-three/fiber`), and Drei (`@react-three/drei`).
- [x] Create a responsive `ThreeCanvas` component with custom organ geometry loading.
- [x] Build sidebar, navbar, responsive dashboard, and interactive study statistics widgets.

