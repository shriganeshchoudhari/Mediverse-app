# Mediverse Platform Architecture & Engineering Documentation

Welcome to the Mediverse platform architectural and engineering documentation index. This document serves as the master navigation guide and glossary for all project specifications, design records, and compliance standards.

---

## 📑 Architecture Decision Records (ADRs)

| ADR Reference | Title | Status | Scope |
|---|---|---|---|
| [`ADR-001`](./adr/ADR-001-v7-migration-skip.md) | V7 Migration Skip & Schema Baseline | Accepted | Flyway Database Baseline |
| [`ADR-002`](./adr/ADR-002-multi-domain-curriculum-architecture.md) | Multi-Domain Healthcare Curriculum Architecture | Accepted | 9 Statutory Healthcare Councils |
| [`ADR-003`](./adr/ADR-003-unified-content-ingestion-and-metadata-pipeline.md) | Unified Content Ingestion & Metadata Pipeline | Accepted | Single DB Source of Truth |
| [`ADR-004`](./adr/ADR-004-hybrid-dense-sparse-rag-retrieval.md) | Hybrid Dense-Sparse RAG & Semantic Retrieval | Accepted | Elasticsearch + pgvector RRF |

---

## 📚 Master Documentation Index & Acronym Glossary

Below is the decoding index for the engineering specifications and architectural blueprints stored in this directory:

### 1. Core Product & Requirements Specifications
* **`PRD.md`** — **Product Requirements Document**: User personas, feature priorities, multi-domain roadmap, and learning outcomes.
* **`SRS.md`** — **Software Requirements Specification**: Functional requirements, use cases, API specs, and interface definitions.
* **`IRD.md`** — **Integration Requirements Document**: Inter-service communication, WebSocket protocols, and third-party integrations.

### 2. Architecture & System Design Documents
* **`SAD.md`** — **System Architecture Document**: High-level C4 component models, Spring Boot backend, Next.js frontend, and data flow.
* **`DDD.md`** — **Domain-Driven Design Specification**: Bounded contexts, aggregates, entities, and domain event models.
* **`FDS.md`** — **Functional Design Specification**: Detailed UI workflows, 3D WebGL viewers, and interactive simulation mechanics.
* **`ADS.md`** — **Architectural Design Specification**: Microservice boundaries, database partitioning, and caching tiers.

### 3. Security, Governance & Compliance
* **`SecDD.md`** — **Security Design Document**: JWT authentication, RBAC authorization, data encryption, and HIPAA/DISHA guidelines.
* **`CSDG.md`** — **Cyber Security & Data Governance**: Content review audits, access logs, and input sanitization.
* **`RMG.md`** — **Risk Management Guide**: Failure mode analysis, disaster recovery, and operational risk mitigation.

### 4. Testing, Quality Assurance & Engineering Standards
* **`TDD.md`** — **Technical Design Document**: Service implementation details, algorithm design, and data contracts.
* **`TSQP.md`** — **Test Strategy & Quality Plan**: Unit testing (JUnit/Jest), integration testing, and E2E Playwright coverage.
* **`API_TEST_SUITE.md`** — **REST API Test Matrix**: Endpoint validation, status codes, and error contract testing.
* **`E2E_TEST_SUITE.md`** — **End-to-End Test Matrix**: User journey validation across browsers and mobile viewports.

### 5. Implementation, Operations & Deployment Guides
* **`WBS.md`** — **Work Breakdown Structure**: Engineering milestones, phase deliverables, and task decomposition.
* **`IG.md`** — **Installation & Deployment Guide**: Docker Compose orchestration, PostgreSQL, Redis, and Elasticsearch provisioning.
* **`AG.md`** — **Administrator Guide**: CMS content management, user administration, and system configuration.
* **`SUG.md`** — **System User Guide**: Student onboarding, interactive simulation guide, and exam portal instructions.
* **`DG.md`** — **Developer Guide**: Local environment setup, Git workflows, and coding conventions.
* **`FG.md`** — **Frontend Guide**: Next.js 14 App Router conventions, TailwindCSS, and Three.js WebGL standards.
* **`DIG.md`** — **Database & Ingestion Guide**: Schema migrations, Flyway versioning, and content ETL pipelines.
* **`MSG.md`** — **Monitoring & Observability Guide**: Spring Boot Actuator, Prometheus metrics, and Loki log aggregation.
* **`OR.md`** — **Operations & Runbook**: Backup procedures, failover instructions, and incident response checklists.
* **`APB.md`** — **Architectural Pattern Book**: Reusable design patterns, state management, and Socratic AI tutor streaming.
