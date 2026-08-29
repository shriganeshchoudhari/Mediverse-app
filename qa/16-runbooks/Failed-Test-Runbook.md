# Failed Test Diagnosis Runbook

```text
Document ID:       QA-RUN-002
Title:             Failed Test Triage & Root Cause Classification
Version:           1.0.0
Status:            APPROVED
Owner:             Lead SDET
```

---

## 1. Triage Decision Tree

```text
               [ TEST FAILED IN CI ]
                         │
                         ▼
        Does failure reproduce locally on same data?
             ├── NO ──> Check CI Environment / Network / Timing
             └── YES ──> Inspect Failure Artifacts (Screenshots, Videos, Traces)
                           │
                           ▼
                  Is Application Throwing 5xx / Error?
                       ├── YES ──> Log Application Defect (S1/S2/S3)
                       └── NO  ──> Check Locator / UI Change / Test Bug
```
