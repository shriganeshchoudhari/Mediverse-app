# Changelog

All notable changes to the Interactive Physiology Learning Platform will be documented in this file.

---

## [0.5.0] - 2026-09-15
### Changed & Hardened
- **Security**: Untracked `.env` from Git index, sanitized development credential templates, and hardened `RateLimitingFilter.java` against IP spoofing via `X-Forwarded-For` with trusted proxy validation.
- **Access Control**: Extended Next.js Edge Middleware HMAC-SHA256 signature verification to protect `/emr/*` and `/osce/*` routes.
- **Documentation**: Audited and restructured `production-readiness-checklist.md` with explicit distinction between Current Monolith verified gates and Phase 2 distributed targets.
- **API Catalog**: Synchronized `api-catalog.md` with active Spring Boot REST & Actuator endpoints and OpenAPI 3.0 documentation links.
- **DevOps**: Hardened CD deployment workflow with Kubernetes client-side dry-run validation and commit SHA image tagging.
- **Observability**: Tuned Prometheus p95 latency alerts to 500ms to rigorously guard curriculum SLO targets.
- **Frontend Resilience**: Added clinical-grade `ErrorBoundary` fallback wrapper across the Next.js application layout.

---

## [0.4.0] - 2026-09-14
### Added
- Comprehensive Playwright E2E automation framework spanning 18 spec suites across all healthcare domains, OSCE examination station, Socratic AI tutor, and EMR SOAP evaluation.
- Multi-browser cross-platform matrix support covering Chromium, Firefox, WebKit, and Mobile Chrome emulation.
- Accessibility automated auditing using `@axe-core/playwright`.

---

## [0.3.0] - 2026-09-13
### Added
- Production-grade Newman / Postman API regression collection with 480+ automated assertions across Actuators, Authentication, Curriculum, Assessments, and AI RAG endpoints.
- k6 performance load testing scenarios for OSCE exam concurrency and Socratic AI query throughput.

---

## [0.2.0] - 2026-08-20
### Added
- Fleet of 164 interactive 3D WebGL/WebXR clinical simulators and mathematical physiology solvers.
- Progressive Web App (PWA) configuration with offline asset caching and service worker synchronization.
- Role-based CMS curriculum review workflow (`DRAFT -> IN_REVIEW -> APPROVED -> PUBLISHED`).

---

## [0.1.0] - 2026-07-04
### Added
- Created foundational project structure and documents.
- Drafted Product Requirements Document (`docs/prd.md`) with virtual labs and adaptive engine specifications.
- Configured System Architecture and DB design patterns (`docs/architecture.md`).
- Documented Architecture Decision Records (ADRs) under `decisions/`:
  - `001-react-framework.md` (Next.js & App Router)
  - `002-database-choice.md` (PostgreSQL & Redis)
  - `003-authentication.md` (Spring Security, JWT & OAuth2)
  - `004-3d-engine.md` (Three.js / React Three Fiber)
- Created general project guidelines (`README.md`, `ROADMAP.md`, `TASKS.md`, `CONTRIBUTING.md`).
