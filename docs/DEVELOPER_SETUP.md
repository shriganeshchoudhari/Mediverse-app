# Mediverse Developer Setup Guide

Welcome to the Mediverse platform codebase. This guide details the environment prerequisites, installation steps, and verification commands required to run the full stack locally.

---

## 🛠️ Prerequisites

| Dependency | Required Version | Verification Command |
|---|---|---|
| **Java JDK** | 21+ (Temurin / Oracle) | `java -version` |
| **Node.js** | 20.x LTS | `node -v` |
| **npm** | 10.x+ | `npm -v` |
| **Docker & Compose** | 24.x+ | `docker --version` |
| **PostgreSQL (Local or Docker)** | 16+ with `pgvector` | `psql -V` |

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Configure Environment

```bash
git clone https://github.com/shriganeshchoudhari/Mediverse-app.git
cd Mediverse-app

# Copy example environment variables
cp .env.example .env
```

### 2. Start Infrastructure via Docker Compose

```bash
# Starts PostgreSQL (5434), Redis (6379), Elasticsearch (9200), Prometheus, Grafana
docker compose up -d postgres redis elasticsearch
```

### 3. Start Backend Server (Spring Boot)

```bash
cd backend
# Build and execute Flyway schema migrations + start server on port 8085
./gradlew bootRun
```
* Backend Health Check: `http://localhost:8085/actuator/health`
* Swagger API Documentation: `http://localhost:8085/swagger-ui.html`

### 4. Start Frontend Application (Next.js)

```bash
cd ../frontend
npm ci
npm run dev
```
* Frontend Application: `http://localhost:3000`

---

## 🧪 Running Automated Test Suites

### Backend Unit & Integration Tests (JaCoCo >= 80%)
```bash
cd backend
./gradlew test jacocoTestReport jacocoTestCoverageVerification
```

### Frontend Unit & Component Tests (Jest)
```bash
cd frontend
npm test
```

### End-to-End Test Suite (Playwright)
```bash
cd frontend
npx playwright test --project="Desktop Chromium"
```

---

## 🔒 Security & Quality Standards

1. **RBAC & Authorization**: All sensitive controllers require `@PreAuthorize("isAuthenticated()")` or role-specific guards (`hasAnyRole('SUPER_ADMIN', 'ADMIN')`).
2. **PII Redaction**: All AI Tutor prompts are sanitized through `PiiRedactionUtil` before sending requests to external LLMs.
3. **XSS Protection**: Markdown renderings sanitize HTML elements and strip dangerous tags (`<script>`, `<iframe>`, `onload=`, etc.).
