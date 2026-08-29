# Test Type Strategy

```text
Document ID:       QA-TTS-001
Title:             Enterprise Test Type Strategy
Version:           1.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture
```

---

## 1. Test Type Classification Matrix

| Test Type | Execution Trigger | Automation Level | Primary Objective | Blocking Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **Smoke Testing** | PR, Merge, Post-Deployment | 100% Automated | Verify core sanity in < 3 minutes | Any failure blocks deployment |
| **Regression Testing** | Nightly, Release Candidate | 95%+ Automated | Verify existing features remain intact | >= 98% pass rate, 0 S1/S2 |
| **Sanity Testing** | Hotfix Verification | 80% Automated | Verify specific bug fix and local impact | Targeted test pass 100% |
| **Integration Testing** | Merge to main | 100% Automated | Verify cross-service and DB integration | 100% pass rate |
| **Performance Testing** | Nightly, Pre-Release | 100% Automated | Validate latency p95 and throughput SLAs | Latency > threshold blocks RC |
| **Security Testing** | CI PR, Nightly, Weekly | 90% Automated | Identify OWASP vulnerabilities and CVEs | High/Crit CVE blocks build |
| **Accessibility Testing**| CI PR, Staging | 100% Automated | Enforce WCAG 2.1 AA compliance | 0 Critical/Serious violations |
| **Exploratory Testing** | In-Sprint, Bug Bash | Manual (Chartered) | Uncover complex edge cases and UX flaws| Defect logged and triaged |
