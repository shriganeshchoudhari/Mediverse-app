# Security Test Strategy

```text
Document ID:       QA-SEC-001
Title:             DevSecOps & Application Security Strategy
Version:           1.0.0
Status:            APPROVED
Owner:             Lead DevSecOps / QA Architect
```

---

## 1. Security Testing Spectrum
1. **SAST (Static Analysis):** CodeQL / SonarQube integrated in PR pipeline.
2. **SCA (Software Composition Analysis):** Snyk / npm audit / Dependabot for third-party CVEs.
3. **DAST (Dynamic Analysis):** OWASP ZAP automated baseline scans on Staging environment.
4. **RBAC/ABAC Functional Penetration:** Playwright & Newman suites testing unauthorized route traversal.
