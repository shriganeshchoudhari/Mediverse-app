# Mediverse Enterprise STRIDE Threat Model

```text
Document ID:       MED-SEC-01
Classification:    Enterprise Standard
Status:            AUDITED & UPDATED (Post-Remediation)
Last Audit:        September 2026
```

---

## Architecture Context

This threat model reflects the active production deployment architecture: **Spring Boot 3.5 Modular Monolith backend** with PostgreSQL 16 (pgvector), Redis 7, and Elasticsearch, fronted by a **Next.js 14 App Router** frontend with Edge Middleware security filters.

---

## STRIDE Threat Modeling Matrix

| Threat Category | Target Subsystem | Attack Vector Scenario | Impact | Mitigation Architecture (Current State) | Residual Risk |
|---|---|---|:---:|---|:---:|
| **Spoofing** | Frontend Sessions & REST APIs | Attacker crafts forged JWT claims or steals session token to impersonate Faculty | Critical | 1. Access tokens stored in `HttpOnly; Secure; SameSite=Strict` cookies (set by Next.js `/api/auth/session` handler) to prevent XSS exfiltration.<br>2. Cryptographic HMAC-SHA256 signature verification in Next.js Edge Middleware (`frontend/middleware.ts`) before proxying.<br>3. Spring Security `JwtAuthenticationFilter` validates claims and expiration on all private routes.<br>4. Emergency JWT secret rotation procedure documented in Runbook 6. | 🟡 MEDIUM |
| **Tampering** | 3D Assets & Exam Answers | Attacker modifies anatomical 3D meshes or exam answer keys in transit | Critical | 1. Strict TLS/HTTPS termination with HSTS (`max-age=63072000`).<br>2. Static assets bundled and served with deterministic content hashing.<br>3. Exam submissions processed through JPA transactional boundaries with question/answer state immutability. | 🟢 LOW |
| **Repudiation** | OSCE Examination Engine | Student denies taking timed clinical exam or claims grade was altered | High | 1. Database append-only audit trail records session start, station progression, and final submit timestamps.<br>2. Student ID, user agent, and client IP hash recorded in session logs. | 🟢 LOW |
| **Info Disclosure** | AI Socratic Tutor & Logs | LLM completions leak patient PHI or student PII | High | 1. Backend `PiiRedactionUtil` executes regex sanitization of names, phone numbers, and IDs before dispatching prompts to Gemini LLM.<br>2. Logback structured logging excludes sensitive authorization headers and passwords from stdout/Loki logs. | 🟢 LOW |
| **Denial of Service** | OSCE Submission & AI APIs | Traffic surge during synchronized university examinations exhausts server resources | High | 1. Redis-backed token bucket rate limiting (`RateLimitingFilter.java`): Auth (10/min), AI (30/min), general API (100/min).<br>2. Kubernetes Horizontal Pod Autoscaler (HPA) scales backend pods dynamically from 3 to 15 replicas based on CPU/Memory utilization. | 🟢 LOW |
| **Elevation of Privilege**| Multi-Tenant Routing | Student from Institution A attempts to access confidential exams of Institution B | Critical | 1. JWT payload contains cryptographic `tenant_id` claim.<br>2. Spring Data JPA multi-tenancy filters enforce tenant boundaries at the database query level for all tenant-scoped entities. | 🟢 LOW |
