# Flaky Test Register — Mediverse Platform

```text
Document ID:       QA-RBK-006
Title:             Flaky Test Register & Quarantine Log
Version:           1.0.0
Status:            ACTIVE
Owner:             SDET Lead
Reviewer:          QA Architect
Approver:          QA Architect
Created Date:      2026-08-29
Last Updated:      2026-08-29
Review Frequency:  Weekly (every Sprint Friday)
Change History:    v1.0.0 — Register established; no active flaky tests at baseline
```

---

## 1. Flaky Test Definition & SLA

| Condition | Action | SLA |
|---|---|---|
| Test fails intermittently (passes on retry) | Mark as `@flaky` candidate | Immediately |
| Flaky Test Rate (FTR) > 2% on any suite | Quarantine test | Within 24 hours |
| Flaky Test Rate (FTR) > 5% on any suite | Block release | Immediate escalation |
| Root cause identified | Fix or accept-with-note | Within 1 sprint |
| Fixed test passes for 5 consecutive runs | Remove from register | Next sprint |

**Formula:**
$$FTR = \frac{\text{Flaky Executions}}{\text{Total Executions}} \times 100$$

**Target:** FTR < 1% across all suites.

---

## 2. Quarantine Procedure

When a test is identified as flaky:

1. Add `@flaky` tag to the test spec.
2. Move test to `tests/quarantine/` directory OR use `test.skip()` with tracking comment.
3. File entry in this register below.
4. Create a GitHub Issue with label `flaky-test` linking to the register entry.
5. Root cause analysis must begin within 1 sprint.
6. Notify SDET Lead via Slack `#qa-alerts`.

```typescript
// Example: quarantining a flaky test
test.skip('should load 3D anatomy model @flaky', async ({ page }) => {
  // Flaky: React Three Fiber canvas load timing varies in CI
  // Register entry: FLK-003 | GitHub Issue: #XXX | Target Fix: Sprint 03
  await page.goto('/3d-anatomy');
  // ...
});
```

---

## 3. Active Flaky Test Register

> **Baseline:** No active flaky tests at register establishment (Sprint 01). Register is initialized for ongoing tracking.

| ID | Test File | Test Name | Suite | Browser | First Observed | FTR (%) | Root Cause | Status | GitHub Issue | Target Fix |
|---|---|---|---|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — | — | — | — | — |

*Register is empty at baseline. New entries will be added as flaky tests are discovered.*

---

## 4. Resolved / Graduated Tests

| ID | Test File | Test Name | Root Cause | Fix Applied | Fixed Date | Runs Clean |
|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — |

---

## 5. Known High-Risk Test Categories

The following test categories are historically prone to flakiness in similar applications and should be monitored closely:

| Category | Risk Factor | Mitigation |
|---|---|---|
| WebRTC Study Room tests | Network timing, ICE negotiation | Mock WebRTC in CI; real test in staging only |
| React Three Fiber 3D tests | Canvas render timing | Increase `waitForLoadState('networkidle')` timeout |
| OSCE countdown timer tests | CI clock precision | Mock `Date.now()` and `setTimeout` |
| Socratic AI response tests | LLM response time variability | Mock AI API response in unit/integration; E2E only in nightly |
| File upload tests | Multipart timing | Use fixed small test files; increase upload timeout |
| WebSocket / real-time tests | Connection establishment timing | Add explicit `waitFor` on socket event |

---

## 6. FTR Trend Log

| Sprint | Suite | Total Runs | Flaky Runs | FTR (%) | Status |
|---|---|---|---|---|---|
| Sprint 01 | All | — | 0 | 0.0% | 🟢 Target Met |

*Updated weekly every Sprint Friday. Pull from CI pipeline metrics.*

---

## 7. Escalation Matrix

| FTR Range | Action | Notify |
|---|---|---|
| 0%–1% | Normal — no action | — |
| 1%–2% | Monitor; root cause within sprint | SDET Lead |
| 2%–5% | Quarantine within 24h; GitHub issue P2 | SDET Lead + QA Architect |
| > 5% | Release blocked; emergency fix | QA Architect + EM |
