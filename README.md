# Interactive Physiology Learning Platform

A production-quality interactive physiology learning ecosystem designed for MBBS, BDS, BAMS, nursing, and allied health students, as well as medical educators and NEET PG aspirants.

## Platform Pillars
1. **Interactive 3D Atlas & Simulations**: Rotate, zoom, explode, and slice 3D organs (Heart, Kidney, Neurons) in real-time, or manipulate variables in physiological simulations.
2. **Clinical Case Simulator & Labs**: Replicate classic physiology experiments (spirometry, ECG, frog muscle-nerve preparations) and diagnose virtual patients using laboratory workups.
3. **Adaptive Learning & AI Tutor**: Built-in conversational AI assistant (MBBS Level) synced with medical knowledge graphs to guide study plans, adapt quizzes, and generate summaries.
4. **Rich Pedagogy Model**: Standardized structure for every single topic:
   * Introduction & Analogy
   * Basic Concept & Anatomy Review
   * Mechanism, Flowcharts & 3D Visualizations
   * Clinical Correlation & Disorders
   * Spaced Repetition (Flashcards & Quizzes)

---

## Tech Stack

### Frontend
- **Framework**: Next.js (App Router), React, TypeScript
- **Styling & Components**: TailwindCSS, ShadCN UI, Framer Motion, GSAP
- **3D Renderers**: Three.js, React Three Fiber (R3F), Drei, GLTF/GLB loaders

### Backend
- **Core Engine**: Spring Boot (Java 21), Spring Security, Spring WebSockets
- **Databases**: PostgreSQL (Relational & Core schemas), Redis (Caching & Session storage), Elasticsearch (Full-text & Vector Search for RAG)
- **AI Integrations**: OpenAI GPT API, Text-to-Speech (TTS), Speech-to-Text (STT)

### Infrastructure & DevOps
- **Containerization**: Docker, Docker Compose, Kubernetes, NGINX
- **IaC**: Terraform
- **Monitoring**: Prometheus, Grafana, Loki

---

## Workspace Structure
- [frontend/](file:///f:/Physiology-app/frontend) - React/Next.js frontend application
- [backend/](file:///f:/Physiology-app/backend) - Spring Boot Java backend API
- [docs/](file:///f:/Physiology-app/docs) - Product and design specifications
- [decisions/](file:///f:/Physiology-app/decisions) - Architecture Decision Records (ADRs)

---

## Getting Started

Refer to the following guides to learn more about the project specifications and development setup:
- [Product Requirements Document (PRD)](file:///f:/Physiology-app/docs/prd.md)
- [System Architecture Specification](file:///f:/Physiology-app/docs/architecture/Architecture.md)
- [Database Schema Specification](file:///f:/Physiology-app/docs/database/Database.md)
- [API Reference Document](file:///f:/Physiology-app/docs/api/API.md)
- [Deployment Guide](file:///f:/Physiology-app/docs/deployment/Deployment.md)
- [Roadmap & Tasks List](file:///f:/Physiology-app/ROADMAP.md)
- [Contributing Guidelines](file:///f:/Physiology-app/CONTRIBUTING.md)
