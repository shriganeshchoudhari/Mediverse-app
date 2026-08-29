# Flaky Test Quarantine Runbook

```text
Document ID:       QA-RUN-003
Title:             Flaky Test Identification, Quarantine & Reinstatement
Version:           1.0.0
Status:            APPROVED
Owner:             Lead SDET
```

---

## 1. Quarantine Protocol
1. If a test fails intermittently (>2% across 10 runs without code change):
2. Tag test with `@quarantine` or move to `tests/quarantine/`.
3. Create P2 Defect: `[FLAKY] Stabilize <TestName>`.
4. Tests in quarantine do not block CI pipelines.
5. **Reinstatement Criteria:** Must pass 50 consecutive runs in CI staging runner before un-quarantining.
