# OWASP Top 10 Test Catalog

```text
Document ID:       QA-SEC-003
Title:             OWASP Top 10 Security Verification Catalog
Version:           1.0.0
Status:            APPROVED
Owner:             DevSecOps Lead
```

---

| OWASP Risk | Description | Test Verification Procedure |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | Unauthorized IDOR access | User A attempts to view `/api/v1/patients/{userB_id}/records` -> Expect `403 Forbidden` |
| **A02: Cryptographic Failures** | Insecure transmission | Verify TLS 1.3 enforced, all PHI encrypted at rest (AES-256) |
| **A03: Injection** | SQL / NoSQL / Command injection | Test parameterized queries on search and filter inputs |
| **A05: Security Misconfiguration** | Default credentials / debug flags | Verify Spring Actuator endpoints do not expose internal heap dumps or env vars |
| **A07: Identification & Auth** | Brute force / credential stuffing | Verify 5 failed login attempts trigger 15-minute temporary lockout |
