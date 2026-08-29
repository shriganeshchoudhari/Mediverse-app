# Integration Test Suite Catalog

```text
Document ID:       QA-ITS-001
Title:             Integration & Component Test Suite
Version:           2.0.0
Status:            APPROVED
Owner:             SDET Lead & Backend Lead
```

---

| Test Case ID | Target Integration | Validation Focus | Tooling |
| :--- | :--- | :--- | :--- |
| `INT-DB-001` | Spring Boot <-> PostgreSQL (pgvector) | Flyway migrations & vector similarity search | SpringBootTest / Testcontainers |
| `INT-CACHE-001` | Spring Boot <-> Redis | Cache invalidation on curriculum & study room update | Testcontainers Redis |
| `INT-AUTH-001` | Frontend <-> Backend JWT | Auto-token refresh & unauthenticated redirect | Playwright Route Interception |
| `INT-WS-001` | Spring Boot <-> WebSockets | Study room real-time chat & whiteboard sync | SpringBootTest / Playwright |
| `INT-AI-001` | Spring Boot <-> AI Content Generator | Grounded MCQ generation & schema response | Mockito / Newman |
