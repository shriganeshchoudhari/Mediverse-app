# GitHub Actions Strategy

```text
Document ID:       QA-CICD-003
Title:             GitHub Actions Quality Pipeline Strategy
Version:           1.0.0
Status:            APPROVED
Owner:             DevOps Lead
```

---

## 1. Implemented Workflow Catalogue
- `.github/workflows/smoke.yml` - Fast smoke gate on PRs and deployments.
- `.github/workflows/regression.yml` - Full functional regression on merge to main.
- `.github/workflows/api-tests.yml` - Newman API regression with schema validation.
- `.github/workflows/ui-tests.yml` - Cross-browser Playwright matrix execution.
- `.github/workflows/nightly.yml` - Comprehensive nightly regression, performance & security.
- `.github/workflows/production-smoke.yml` - Post-deployment live sanity validation.
