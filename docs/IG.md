# Mediverse Implementation Guide (100-Chapter Playbook)

This massive implementation guide spans 100 chapters across 12 parts, synthesizing the requirements, architectures, and guidelines from the enterprise documentation suite (PRD, SRS, SAD, DDD, SecDD, TDD, etc.).

---

### Chapter 1: Document Landscape & Implementation Purpose

**Source Documents:** PRD, SRS

**Implementation Details & Engineering Blueprint:**
- Acts as the master playbook bridging high-level architecture to code.
- Trumps conflicting legacy documentation, but defers to specific architectural artifacts (SAD/SecDD) for domain-specific rulings.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 2: Platform Vision & Educational Mission

**Source Documents:** PRD

**Implementation Details & Engineering Blueprint:**
- Goal: Enterprise-grade, production-ready medical learning platform.
- Focuses on multi-tenancy for medical institutions globally.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 3: Key Stakeholders & Developer Personas

**Source Documents:** PRD

**Implementation Details & Engineering Blueprint:**
- Backend engineers, DevOps, ML Engineers, Security Auditors.
- Developer experience (DevEx) requires local testing via Docker Compose.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 4: High-Level System Capabilities

**Source Documents:** PRD, SRS

**Implementation Details & Engineering Blueprint:**
- User management, Course delivery, AI Tutoring, Assessment Engine, Analytics.
- 99.9% uptime requirement across all core capabilities.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 5: Regulatory Compliance Baseline

**Source Documents:** PRD, SecDD

**Implementation Details & Engineering Blueprint:**
- HIPAA compliance required: Encrypt PII at rest and in transit.
- GDPR compliance: Implement Right to be Forgotten data deletion cascades.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 6: Architecture Guiding Principles

**Source Documents:** APB, SAD

**Implementation Details & Engineering Blueprint:**
- Loose coupling, API-first, Automation-first, Zero-Trust.
- Build for failure (Chaos engineering mindset).

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 7: Microservices Paradigm & Boundaries

**Source Documents:** SAD, DDD

**Implementation Details & Engineering Blueprint:**
- No shared databases between services. Use Domain Events for cross-service state mutation.
- 15+ independently deployable services.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 8: Event-Driven Architecture (EDA) Overview

**Source Documents:** SAD, ADR

**Implementation Details & Engineering Blueprint:**
- Kafka is the central nervous system.
- Async communication mandated for all long-running processes.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 9: Cloud-Native & Kubernetes Strategy

**Source Documents:** SAD

**Implementation Details & Engineering Blueprint:**
- Containerized workloads managed via Helm charts.
- Argo CD for GitOps declarative state management.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 10: Multi-Tenancy Architecture

**Source Documents:** SAD, FDS

**Implementation Details & Engineering Blueprint:**
- Logical isolation using tenant_id in shared PostgreSQL schemas.
- Enforced via PostgreSQL Row-Level Security (RLS) policies.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 11: High Availability & Scalability Targets

**Source Documents:** SAD

**Implementation Details & Engineering Blueprint:**
- Horizontal Pod Autoscaling (HPA) enabled for all stateless workloads.
- Stateful sets (DB/Kafka) must have minimum 3-node replication.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 12: Disaster Recovery & RTO/RPO Metrics

**Source Documents:** SAD

**Implementation Details & Engineering Blueprint:**
- RTO <= 1 hour, RPO <= 15 minutes.
- Cross-region backups and automated restore testing required.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 13: Foundational Architecture Decision Records

**Source Documents:** ADR

**Implementation Details & Engineering Blueprint:**
- ADRs dictate tech stack choices. PostgreSQL chosen for ACID compliance.
- Kafka chosen for high-throughput event streaming.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 14: Technology Stack: Backend & Frontend

**Source Documents:** SAD

**Implementation Details & Engineering Blueprint:**
- Backend: Java 21 LTS, Spring Boot 3.x.
- Frontend: React 19+, TypeScript, Vite.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 15: Technology Stack: Data & AI

**Source Documents:** SAD

**Implementation Details & Engineering Blueprint:**
- Data: PostgreSQL 16+, Redis 7+, Elasticsearch 8+.
- AI: Python 3.13, LangChain, pgvector for initial vector storage.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 16: DDD Principles & Ubiquitous Language

**Source Documents:** DDD

**Implementation Details & Engineering Blueprint:**
- Use exact domain terminology in code (e.g., 'Enrollment' not 'StudentCourse').
- Aggregates must protect transactional invariants.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 17: Bounded Context: Identity & Access Mgmt

**Source Documents:** DDD

**Implementation Details & Engineering Blueprint:**
- Handles AuthN/AuthZ, Tenant mapping, SSO via OIDC.
- Produces UserRegistered events.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 18: Bounded Context: Academic & Institution

**Source Documents:** DDD

**Implementation Details & Engineering Blueprint:**
- Manages University/Hospital metadata, departments, and roles.
- Source of truth for tenant licensing.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 19: Bounded Context: Learning & Curriculum

**Source Documents:** DDD

**Implementation Details & Engineering Blueprint:**
- Manages SCORM packages, video content, course structures.
- Read-heavy workload, requires aggressive Redis caching.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 20: Bounded Context: AI Tutor & Intelligence

**Source Documents:** DDD

**Implementation Details & Engineering Blueprint:**
- LangChain based service.
- Isolated from transactional core to prevent cascading failures.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 21: Bounded Context: Assessment & Certification

**Source Documents:** DDD

**Implementation Details & Engineering Blueprint:**
- High-integrity transaction boundary for grading.
- Produces immutable CertificateIssued events.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 22: Bounded Context: Analytics & Reporting

**Source Documents:** DDD

**Implementation Details & Engineering Blueprint:**
- Consumes events via Kafka to build materialized views.
- No direct synchronous DB queries against other services.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 23: Bounded Context: Notifications & Comms

**Source Documents:** DDD

**Implementation Details & Engineering Blueprint:**
- Handles email, SMS, push notifications.
- Deduplication and rate limiting required at this layer.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 24: Cross-Context Communication Patterns

**Source Documents:** DDD, SAD

**Implementation Details & Engineering Blueprint:**
- Use choreography (events) over orchestration (direct calls) where possible.
- Saga pattern required for distributed transactions.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 25: Anti-Corruption Layers (ACL)

**Source Documents:** DDD

**Implementation Details & Engineering Blueprint:**
- Required when integrating with external LMS or AI providers.
- Translate external models into internal ubiquitous language.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 26: Database-per-Service Strategy

**Source Documents:** FDS, SAD

**Implementation Details & Engineering Blueprint:**
- Strict network isolation between database clusters.
- Foreign keys across services are strictly forbidden.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 27: Primary OLTP DB Implementation

**Source Documents:** FDS

**Implementation Details & Engineering Blueprint:**
- PostgreSQL tuning: connection pooling (PgBouncer), indexed foreign keys.
- UUID v7 for primary keys (time-sorted).

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 28: Caching Strategy & Implementation

**Source Documents:** FDS, SAD

**Implementation Details & Engineering Blueprint:**
- Redis for session state, API response caching, and idempotency keys.
- Implement Cache-Aside pattern with event-driven invalidation.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 29: Full-Text Search Implementation

**Source Documents:** SAD

**Implementation Details & Engineering Blueprint:**
- Elasticsearch for cross-context search (courses, students).
- Sync via Debezium CDC from PostgreSQL to ES.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 30: Vector Database for AI (pgvector)

**Source Documents:** SAD

**Implementation Details & Engineering Blueprint:**
- HNSW index type recommended for pgvector.
- Plan for future migration to dedicated vector DB if scale exceeds 10M embeddings.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 31: Data Replication & Synchronization

**Source Documents:** FDS

**Implementation Details & Engineering Blueprint:**
- Read replicas for heavy reporting queries within a boundary.
- Synchronous replication for multi-AZ high availability.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 32: Row-Level Security for Tenant Isolation

**Source Documents:** FDS, SecDD

**Implementation Details & Engineering Blueprint:**
- All queries must inject current_tenant_id into connection context.
- RLS policy: `tenant_id = current_setting('app.current_tenant')`.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 33: Schema Migration Governance

**Source Documents:** FDS

**Implementation Details & Engineering Blueprint:**
- Flyway migrations strictly versioned (V1__, V2__).
- Expand/Contract pattern mandatory for zero-downtime deployments.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 34: Data Masking & PII Protection

**Source Documents:** SecDD

**Implementation Details & Engineering Blueprint:**
- PII columns must use dynamic data masking for non-admin roles.
- Logs must never contain PII (use Logback masking).

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 35: Event Sourcing & CQRS

**Source Documents:** SAD

**Implementation Details & Engineering Blueprint:**
- Selective use of CQRS in Analytics and Assessment bounded contexts.
- Command layer separated from Query layer.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 36: Zero-Trust Architecture Implementation

**Source Documents:** SecDD

**Implementation Details & Engineering Blueprint:**
- 'Never trust, always verify'.
- Internal network segments are treated as hostile.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 37: Edge Security: WAF & DDoS

**Source Documents:** SecDD

**Implementation Details & Engineering Blueprint:**
- Cloudflare/AWS WAF blocking OWASP Top 10.
- Rate limiting at the edge layer by IP and Tenant.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 38: API Gateway Security Controls

**Source Documents:** SecDD

**Implementation Details & Engineering Blueprint:**
- Single entry point.
- Handles TLS termination, JWT validation, and routing.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 39: JWT Validation & Token Lifecycle

**Source Documents:** SecDD

**Implementation Details & Engineering Blueprint:**
- Access tokens live for 15 mins. Refresh tokens securely rotated.
- Validate token signature, audience, issuer, and expiry.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 40: Service-to-Service Auth (mTLS)

**Source Documents:** SecDD, SAD

**Implementation Details & Engineering Blueprint:**
- Istio/Linkerd service mesh enforces mTLS between all pods.
- Automatic certificate rotation every 24 hours.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 41: RBAC Implementation

**Source Documents:** SecDD

**Implementation Details & Engineering Blueprint:**
- Spring Security `@PreAuthorize` used at controller methods.
- Roles mapped from JWT claims.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 42: Secrets Management with Vault

**Source Documents:** SecDD

**Implementation Details & Engineering Blueprint:**
- No secrets in code or env vars. Injected via Vault Agent sidecar.
- Database passwords rotated dynamically.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 43: Encryption at Rest & Key Mgmt

**Source Documents:** SecDD

**Implementation Details & Engineering Blueprint:**
- AES-256 for all disks (EBS volumes).
- KMS used for application-level field encryption (e.g., medical IDs).

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 44: Secure SDLC Implementation

**Source Documents:** SecDD, CSDG

**Implementation Details & Engineering Blueprint:**
- SAST (SonarQube), DAST, and SCA (Dependency-Check) in CI pipeline.
- Block PRs with High/Critical vulnerabilities.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 45: Threat Detection & Audit Logging

**Source Documents:** SecDD

**Implementation Details & Engineering Blueprint:**
- All state-mutating API calls logged to SIEM.
- Audit logs include UserID, TenantID, Timestamp, Action, ResourceID.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 46: API-First Design Principles

**Source Documents:** IRD

**Implementation Details & Engineering Blueprint:**
- Design contract (OpenAPI) before writing code.
- Contract-driven development using Swagger Codegen/OpenAPI Generator.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 47: RESTful API Standards

**Source Documents:** IRD

**Implementation Details & Engineering Blueprint:**
- Use proper HTTP methods (GET, POST, PUT, PATCH, DELETE).
- Standardized pagination: `?page=0&size=20`.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 48: OpenAPI Spec & Validation

**Source Documents:** IRD

**Implementation Details & Engineering Blueprint:**
- Expose `/v3/api-docs` endpoint.
- CI must validate API changes against breaking change rules.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 49: GraphQL API Implementation

**Source Documents:** IRD

**Implementation Details & Engineering Blueprint:**
- Selective use for mobile clients fetching complex aggregations.
- Implement DataLoader to prevent N+1 query problems.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 50: WebSocket & SSE Design

**Source Documents:** IRD, SAD

**Implementation Details & Engineering Blueprint:**
- SSE preferred for one-way notifications.
- WebSockets for bidirectional AI Tutor chat (requires sticky sessions).

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 51: API Versioning & Deprecation

**Source Documents:** IRD

**Implementation Details & Engineering Blueprint:**
- URI versioning mandatory (e.g., `/api/v1/users`).
- Minimum 6-month deprecation window with `Sunset` headers.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 52: Idempotency Key Implementation

**Source Documents:** IRD, SAD

**Implementation Details & Engineering Blueprint:**
- `Idempotency-Key` header required for POST/PATCH on critical resources.
- Redis used to store successful responses for 24h.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 53: Kafka Topic Design

**Source Documents:** SAD

**Implementation Details & Engineering Blueprint:**
- Topic naming convention: `env.domain.entity.event`.
- Partitioning key must be entity ID to guarantee ordering.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 54: Event Schema Registry

**Source Documents:** SAD

**Implementation Details & Engineering Blueprint:**
- Confluent Schema Registry ensures event schema evolution.
- Avro format for highly efficient serialization.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 55: Dead Letter Queue Handling

**Source Documents:** SAD

**Implementation Details & Engineering Blueprint:**
- Failed consumer messages routed to DLQ after 3 retries with exponential backoff.
- Alerting required on DLQ depth > 0.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 56: AI Subsystem Architecture

**Source Documents:** SAD, ADS

**Implementation Details & Engineering Blueprint:**
- Decoupled Python-based inference engine.
- Integrates with Java backend via async events or gRPC.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 57: AI Safety Container Implementation

**Source Documents:** SAD

**Implementation Details & Engineering Blueprint:**
- Validates user prompts for PII/Injection.
- Validates LLM responses for medical safety and hallucinations.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 58: Prompt Engineering & Governance

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- Prompts treated as code. Versioned in Git.
- Evaluated against standard test sets before deployment.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 59: LLM Provider Integration

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- Abstract provider APIs behind a factory pattern.
- Support failover between OpenAI, Anthropic, and local vLLM.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 60: RAG Pipeline Implementation

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- Chunking strategy: semantic splitting with 150 token overlap.
- Top-K retrieval with maximal marginal relevance (MMR).

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 61: Knowledge Base Indexing

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- Incremental updates driven by ContentPublished events.
- Full re-indexing requires zero-downtime blue/green index swapping.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 62: Vector Search Optimization

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- Filter by tenant_id BEFORE vector similarity search to ensure security.
- Tune `ef_search` for pgvector performance.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 63: AI Model Versioning

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- Pin exact model versions (e.g., `gpt-4-0613`).
- Implement shadow serving to compare model outputs in production.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 64: AI Token Budgeting

**Source Documents:** ADS, SAD

**Implementation Details & Engineering Blueprint:**
- Track token usage per tenant and user.
- Hard limits enforced by API Gateway to prevent runaway costs.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 65: Hallucination Mitigation

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- Require LLMs to output citations matching the RAG context.
- Safety container drops responses containing un-cited medical claims.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 66: Third-Party Integration Philosophy

**Source Documents:** DIG

**Implementation Details & Engineering Blueprint:**
- Assume all third parties are unreliable and hostile.
- Implement Circuit Breakers (Resilience4j) on all external calls.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 67: LMS: SCORM Implementation

**Source Documents:** DIG

**Implementation Details & Engineering Blueprint:**
- SCORM 1.2/2004 player integration.
- State stored in Redis, flushed to PostgreSQL asynchronously.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 68: LMS: LTI 1.3 Launch Flows

**Source Documents:** DIG

**Implementation Details & Engineering Blueprint:**
- Implement OIDC based LTI 1.3 launch.
- Deep linking support for embedding courses in external LMS.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 69: LMS: xAPI Store

**Source Documents:** DIG

**Implementation Details & Engineering Blueprint:**
- LRS (Learning Record Store) implementation.
- Store actor-verb-object statements (e.g., 'John watched Video X').

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 70: Webhook Implementation

**Source Documents:** DIG

**Implementation Details & Engineering Blueprint:**
- Webhook dispatcher uses async queues to prevent blocking.
- Sign payloads using HMAC-SHA256 with tenant-specific shared secrets.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 71: React 19+ & TypeScript Standards

**Source Documents:** TDD, CSDG

**Implementation Details & Engineering Blueprint:**
- Strict TypeScript compiler flags required.
- React Server Components (RSC) used for SEO-heavy marketing pages.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 72: Micro-Frontend Strategy

**Source Documents:** TDD

**Implementation Details & Engineering Blueprint:**
- Module Federation used to separate Student Portal, Admin Portal, AI Tutor.
- Shared UI component library packages.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 73: State Management & Data Fetching

**Source Documents:** TDD

**Implementation Details & Engineering Blueprint:**
- React Query (TanStack) for server state.
- Zustand for global client state (session, theme).

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 74: Component Library & Design System

**Source Documents:** TDD

**Implementation Details & Engineering Blueprint:**
- Tailwind CSS for utility classes.
- Radix UI / Shadcn for accessible unstyled components.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 75: Responsive Design & a11y

**Source Documents:** TDD

**Implementation Details & Engineering Blueprint:**
- Mobile-first breakpoints.
- WCAG 2.1 AA compliance required (aria attributes, keyboard nav).

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 76: PWA & Offline Sync

**Source Documents:** TDD

**Implementation Details & Engineering Blueprint:**
- Service Worker caches static assets and App Shell.
- IndexedDB stores offline assessment progress for sync-on-reconnect.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 77: 3D Medical Model Rendering

**Source Documents:** TDD

**Implementation Details & Engineering Blueprint:**
- Three.js / React Three Fiber for WebGL rendering.
- Draco compression for glTF models to reduce load times.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 78: Video Streaming & CDN

**Source Documents:** TDD

**Implementation Details & Engineering Blueprint:**
- HLS (HTTP Live Streaming) for adaptive bitrate video.
- Cloudflare CDN caching for all media assets.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 79: Frontend Performance Optimization

**Source Documents:** TDD

**Implementation Details & Engineering Blueprint:**
- Code splitting by route.
- Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1).

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 80: Cross-Browser & Mobile Support

**Source Documents:** TDD

**Implementation Details & Engineering Blueprint:**
- Support last 2 versions of Chrome, Safari, Edge, Firefox.
- Capacitor used to wrap web app for iOS/Android stores (Phase 2).

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 81: Clean Architecture Implementation

**Source Documents:** ADS, CSDG

**Implementation Details & Engineering Blueprint:**
- Core domain has no dependencies on framework (Spring) or DB.
- Strict package boundaries enforced by ArchUnit tests.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 82: Dependency Injection Standards

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- Constructor injection mandatory.
- No `@Autowired` on fields to ensure testability.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 83: Controller Layer Standards

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- Map HTTP request/response to Internal DTOs.
- No business logic. Maximum 3 lines per controller method.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 84: Application Layer Standards

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- Orchestrates use cases. Handles transaction boundaries (`@Transactional`).
- Fetches entities, calls domain logic, saves entities.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 85: Domain Layer Aggregates

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- Rich domain models (no anemic models). State mutation happens inside entities.
- Entities generate Domain Events upon state change.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 86: Infrastructure Layer Standards

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- Spring Data JPA Repositories mapped to Domain interfaces.
- Kafka template implementations.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 87: Error Handling & Exception Translation

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- `@ControllerAdvice` translates domain exceptions to standard RFC 7807 Problem Details.
- Never expose stack traces to clients.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 88: Connection Pooling Optimization

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- HikariCP configured per service.
- `maximumPoolSize` tuned based on formula: `core_count * 2 + effective_spindle_count`.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 89: Background Job Processing

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- Quartz or Spring Batch for scheduled cron jobs.
- Requires distributed locking (ShedLock) to prevent duplicate execution across pods.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 90: Rate Limiting Implementation

**Source Documents:** ADS

**Implementation Details & Engineering Blueprint:**
- Token Bucket algorithm via Redis + Lua scripts.
- Applied at API Gateway globally, and per-tenant at application layer.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 91: Test-Driven Development (TDD)

**Source Documents:** TSQP

**Implementation Details & Engineering Blueprint:**
- Write failing test -> Write code -> Refactor.
- Aim for 85%+ instruction coverage on domain logic.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 92: Unit Testing Strategies

**Source Documents:** TSQP

**Implementation Details & Engineering Blueprint:**
- JUnit 5 and Mockito. Fast execution (< 2 seconds for whole suite).
- Test edge cases, boundary conditions, and nulls.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 93: Integration Testing

**Source Documents:** TSQP

**Implementation Details & Engineering Blueprint:**
- Testcontainers mandatory to spin up real PostgreSQL/Kafka in Docker.
- No H2 in-memory databases for integration tests.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 94: Contract Testing

**Source Documents:** TSQP

**Implementation Details & Engineering Blueprint:**
- Pact framework to ensure API backward compatibility.
- Provider tests run in CI to prevent breaking consumers.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 95: End-to-End (E2E) UI Testing

**Source Documents:** TSQP

**Implementation Details & Engineering Blueprint:**
- Playwright used for cross-browser testing.
- Cover critical paths: Login, Course Enrollment, Exam Submission.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 96: Chaos Engineering

**Source Documents:** TSQP, SAD

**Implementation Details & Engineering Blueprint:**
- LitmusChaos experiments run in staging weekly.
- Kill random pods, inject latency to Kafka, simulate DB failover.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 97: Distributed Tracing

**Source Documents:** SAD

**Implementation Details & Engineering Blueprint:**
- OpenTelemetry java agent auto-instrumentation.
- Trace ID injected into all logs and propagated via HTTP headers (W3C B3).

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 98: Metrics Collection

**Source Documents:** SAD

**Implementation Details & Engineering Blueprint:**
- Micrometer exposes Prometheus `/actuator/prometheus` endpoints.
- Custom metrics for business events (e.g., `exams_submitted_total`).

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 99: Log Aggregation

**Source Documents:** SAD

**Implementation Details & Engineering Blueprint:**
- Fluent-bit sidecars forward logs to Loki.
- Structured JSON logging mandatory for parsing.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---

### Chapter 100: Epic Breakdown & Sprint Execution

**Source Documents:** WBS

**Implementation Details & Engineering Blueprint:**
- Phase 1: Foundation (Sprints 1-4).
- Phase 2: Core Platform (Sprints 5-10).
- Daily standups, PR reviews required before merge, CI must pass.

**Concrete Technical Implementation Standards:**
- **Code Architecture:** Clean Architecture and Hexagonal Domain-Driven Design (DDD), enforcing strict separation between domain logic, application use-cases, and infrastructure adapters.
- **Frontend & 3D WebGL:** React 18 with @react-three/fiber and Three.js, Draco-compressed GLB asset streaming, GLSL shader clipping, and Vanilla CSS Modules (tokens.css).
- **Backend & AI Solvers:** Spring Boot 3.4 on Java 21, Spring AI orchestration with pgvector dense RAG retrieval, SSE token streaming, and client-side Rust-to-Wasm differential equation solvers.
- **LMS Interoperability:** IMS Global LTI 1.3 Advantage (OIDC launch, AGS grade passback, NRPS roster sync).

---
