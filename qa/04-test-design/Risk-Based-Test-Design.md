# Risk-Based Test Design

```text
Document ID:       QA-RBT-001
Title:             Risk-Based Test Design & FMEA Framework
Version:           1.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture
```

---

## 1. Failure Modes and Effects Analysis (FMEA)
We evaluate risk priority numbers (RPN):
$$\text{RPN} = \text{Severity} \times \text{Occurrence} \times \text{Detection}$$
Modules with $\text{RPN} \ge 40$ receive mandatory automated unit, API contract, and Playwright UI regression suites.
