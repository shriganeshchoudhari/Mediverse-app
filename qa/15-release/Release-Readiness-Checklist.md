# Release Readiness Checklist

```text
Document ID:       QA-REL-001
Title:             Production Release Readiness Checklist
Version:           1.0.0
Status:            APPROVED
Owner:             QA Lead & Release Manager
```

---

## Hard Release Criteria Checklist
- [ ] **Build & Unit Tests:** 100% passing, >= 80% line coverage.
- [ ] **Smoke Tests:** 100% passing in Staging environment.
- [ ] **Critical Regression:** 100% passing in Staging environment.
- [ ] **Open Defects:** 0 S1 Critical, 0 S2 High defects.
- [ ] **Performance SLAs:** p95 API response <= 400ms under load.
- [ ] **Security Vulnerabilities:** 0 High / Critical CVEs.
- [ ] **Accessibility:** 0 Critical violations in axe-core scans.
- [ ] **Rollback Plan:** Tested database migration rollback script ready.
- [ ] **Stakeholder Approvals:** Formal QA and Product Owner sign-off recorded.
