# Security Release Gates

```text
Document ID:       QA-SEC-004
Title:             Security Release Gate Policy
Version:           1.0.0
Status:            APPROVED
Owner:             Lead DevSecOps Architect
```

---

## 1. Non-Negotiable Release Blockers
- **Critical / High CVEs:** Zero allowed in any production release artifact.
- **Secrets in Code:** Zero hardcoded API keys, private keys, or passwords.
- **OWASP Scan:** Zero High Severity vulnerabilities reported by DAST scanners.
