# Mediverse — Healthcare Education & Simulation Platform

A production-grade, multi-domain healthcare learning ecosystem designed for MBBS, BDS, BAMS/AYUSH, Nursing, Pharmacy, Physiotherapy, Allied Health, Veterinary, and Public Health students, as well as medical educators and postgraduate aspirants.

## Platform Pillars
1. **Interactive 3D Atlas & Simulations**: Rotate, zoom, explode, and slice 3D anatomical structures in real-time, or manipulate variables in physiological solvers (acid-base, renal kinetics, ECMO circuit, PK/PD, etc.).
2. **Clinical Case Simulator & Labs**: Replicate clinical workups and OSCE scenarios to diagnose virtual patients using laboratory investigations and diagnostic imaging.
3. **Adaptive Learning & Socratic AI Tutor**: Intelligent pedagogical AI assistant with domain-specific curriculum grounding, RAG indexing, and automatic PII redaction.
4. **Competency-Based Curriculum Framework**: Aligned with NMC, DCI, CCIM, PCI, INC, and VCI regulatory frameworks across 9 healthcare domains.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router), React, TypeScript
- **Styling & UI**: TailwindCSS, Lucide Icons, Framer Motion
- **3D & Visualizations**: Three.js, React Three Fiber (R3F), Mermaid, KaTeX

### Backend
- **Core Engine**: Spring Boot 3.5.x (Java 21), Spring Security, Spring WebSockets
- **Databases**: PostgreSQL 16 (Relational & pgvector), Redis (Caching & Session broker), Elasticsearch 8.x (Full-text RAG search)
- **AI Integrations**: Gemini API with circuit breaker fallback and Socratic pedagogical engine

### Infrastructure & DevOps
- **Containerization**: Docker, Multi-Stage Dockerfiles, Docker Compose
- **IaC**: Terraform (EKS, Aurora, ElastiCache, S3 Remote State)
- **Observability**: Prometheus, Grafana, Loki, Promtail

---

## Workspace Structure
- [frontend/](./frontend) - Next.js frontend web application & PWA
- [backend/](./backend) - Spring Boot Java backend API
- [docs/](./docs) - Architecture, PRD, and compliance documentation
- [terraform/](./terraform) - Infrastructure as Code definitions
- [monitoring/](./monitoring) - Prometheus alert rules & Grafana dashboards

---

## Getting Started

Refer to the following guides to learn more about the project specifications and development setup:
- [Developer Setup Guide](./docs/DEVELOPER_SETUP.md)
- [Product Requirements Document (PRD)](./docs/PRD.md)
- [Data Privacy & DPDP Compliance Framework](./docs/compliance/data-privacy-and-governance.md)
- [Roadmap & Architecture Decisions](./ROADMAP.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
