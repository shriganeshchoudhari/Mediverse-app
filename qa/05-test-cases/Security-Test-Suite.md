# Security Test Suite Catalog

```text
Document ID:       QA-STS-002
Title:             Security & Vulnerability Test Suite Catalog
Version:           1.0.0
Status:            APPROVED
Owner:             DevSecOps / QA Architect
```

---

| Test Case ID | OWASP Category | Target Attack Vector | Expected Defense |
| :--- | :--- | :--- | :--- |
| `SEC-AUTH-001` | A01: Broken Access Control | Patient accessing `/api/v1/admin/audit-logs` | HTTP 403 Forbidden |
| `SEC-INJ-001` | A03: Injection | SQL injection payload in search param (`' OR 1=1--`) | Parameterized Query / 200 Empty / 400 |
| `SEC-XSS-001` | A03: Injection | Stored XSS payload in patient consultation note | HTML Entity Escaped in DOM |
| `SEC-SESS-001` | A07: Auth Failures | Replaying revoked JWT refresh token | HTTP 401 Unauthorized |
