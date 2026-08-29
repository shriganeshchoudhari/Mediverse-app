# API Automation Framework Blueprint

```text
Document ID:       QA-AUT-004
Title:             Postman & Newman API Automation Architecture
Version:           1.0.0
Status:            APPROVED
Owner:             SDET Lead
```

---

## 1. Postman Test Architecture
- **Pre-Request Script:** Generate dynamic UUIDs, timestamp headers, and HMAC signatures.
- **Tests Script:** Status code assertions, JSON Schema validation (`ajv`), response time checks, and environment variable extraction (`pm.environment.set("jwt_token", response.data.token)`).
