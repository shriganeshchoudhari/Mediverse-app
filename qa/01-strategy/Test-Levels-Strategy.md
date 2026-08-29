# Test Levels Strategy

```text
Document ID:       QA-TLS-001
Title:             Test Levels & Granularity Strategy
Version:           1.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture
```

---

```text
[ Unit Level ] ─────────> Fast, isolated method & component tests (JUnit 5, Jest)
       │
[ Component / Int ] ────> Service integration, DB repositories (SpringBootTest)
       │
[ API Contract ] ───────> Endpoints, schemas, error codes (Postman/Newman, REST Client)
       │
[ UI Functional ] ──────> End-to-end browser journeys, POM (Playwright TypeScript)
       │
[ Non-Functional ] ─────> Load (k6), Security (OWASP), Accessibility (axe-core)
       │
[ Production Synth ] ───> Scheduled continuous synthetic health checks
```

### Granularity & Execution Details
1. **Unit Testing (L1):** Executed on every developer save and local commit. Verifies algorithmic correctness, validation logic, and branch handling. Target: < 60 seconds runtime.
2. **Integration Testing (L2):** Tests Spring Boot JPA queries, Flyway scripts, Redis caching, and Next.js server actions. Target: < 3 minutes runtime.
3. **API Contract & Workflow Testing (L3):** Tests REST API endpoints via Postman collections and Newman. Validates response schemas, JWT security, and status codes. Target: < 4 minutes runtime.
4. **UI End-to-End Testing (L4):** Validates real browser interactions across Chrome, Firefox, and Safari using Playwright. Covers critical user journeys. Target: < 8 minutes runtime via parallel workers.
5. **Non-Functional Testing (L5):** Nightly performance benchmarks and SAST/DAST security scans.
