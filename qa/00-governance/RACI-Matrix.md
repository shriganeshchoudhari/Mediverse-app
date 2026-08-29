# RACI Matrix — Quality Engineering Activities

```text
Document ID:       QA-GOV-006
Title:             Enterprise QA RACI Matrix — Roles, Accountabilities & Responsibilities
Version:           1.0.0
Status:            APPROVED
Owner:             QA Architect / Engineering Lead
Reviewer:          CTO, Engineering Manager, SDET Lead
Approver:          CTO
Created Date:      2026-08-29
Last Updated:      2026-08-29
Review Frequency:  Quarterly
```

---

## 1. Role Definitions

| Code | Role | Description |
|---|---|---|
| **QAA** | QA Architect | Designs QA strategy, framework, governance policy |
| **SDET** | SDET / Automation Engineer | Writes and maintains automated test code |
| **BE** | Backend Engineer | Writes backend unit/integration tests, JaCoCo coverage |
| **FE** | Frontend Engineer | Writes frontend component tests, Playwright smoke |
| **EM** | Engineering Manager | Reviews and approves release decisions |
| **PM** | Product Manager | Prioritises defects, accepts user stories |
| **SRE** | SRE / DevOps | Owns CI/CD pipelines, monitoring infra, alerting |
| **SEC** | Security Engineer | Owns SAST/DAST scans, vulnerability triage |
| **CTO** | CTO / VP Engineering | Final sign-off on release and governance policy |

### RACI Key
| Letter | Meaning |
|---|---|
| **R** | **Responsible** — Does the work |
| **A** | **Accountable** — Owns the outcome (single person) |
| **C** | **Consulted** — Provides input; two-way communication |
| **I** | **Informed** — Notified of outcome; one-way communication |

---

## 2. Governance & Strategy Activities

| Activity | QAA | SDET | BE | FE | EM | PM | SRE | SEC | CTO |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Define QA governance policy | **A/R** | C | I | I | C | I | I | C | A |
| Maintain Test Strategy Document | **A/R** | C | C | C | I | I | I | C | I |
| Approve Definition of Done | C | I | C | C | **A** | C | I | I | I |
| Define Quality Gates | **A/R** | C | C | C | C | I | C | I | I |
| Maintain RACI Matrix | **A/R** | I | I | I | C | I | I | I | I |
| QA Maturity Assessment | **A/R** | C | I | I | C | I | I | I | C |
| ADR authoring | **A/R** | C | C | C | I | I | C | I | I |

---

## 3. Test Planning Activities

| Activity | QAA | SDET | BE | FE | EM | PM | SRE | SEC | CTO |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Maintain Master Test Plan | **A/R** | C | I | I | C | I | I | I | I |
| Sprint Test Plan creation | **R** | R | I | I | **A** | C | I | I | I |
| Release Test Plan creation | **A/R** | R | C | C | C | C | I | C | I |
| Test environment provisioning | C | I | I | I | C | I | **A/R** | I | I |
| Test data strategy | **A/R** | R | C | C | I | C | I | I | I |
| Test data creation/masking | C | **A/R** | R | R | I | I | I | C | I |

---

## 4. Requirements & Design Activities

| Activity | QAA | SDET | BE | FE | EM | PM | SRE | SEC | CTO |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Requirements quality review | **R** | I | C | C | C | **A** | I | I | I |
| Maintain RTM | **A/R** | C | C | C | I | I | I | I | I |
| Test case design — UI | C | **A/R** | I | C | I | C | I | I | I |
| Test case design — API | C | **A/R** | C | I | I | C | I | I | I |
| Test case design — performance | **C** | **A/R** | C | I | I | I | C | I | I |
| Test case design — security | C | C | I | I | I | I | I | **A/R** | I |
| Test case peer review | **R** | **A** | R | R | I | I | I | I | I |

---

## 5. Automation Implementation Activities

| Activity | QAA | SDET | BE | FE | EM | PM | SRE | SEC | CTO |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Playwright framework design | **A** | **R** | I | C | I | I | I | I | I |
| Page Object Model implementation | C | **A/R** | I | C | I | I | I | I | I |
| Backend unit test authoring | C | I | **A/R** | I | I | I | I | I | I |
| Backend integration test authoring | C | C | **A/R** | I | I | I | I | I | I |
| JaCoCo coverage gate maintenance | C | I | **A/R** | I | C | I | I | I | I |
| Newman API collection maintenance | C | **A/R** | C | I | I | I | I | I | I |
| Flaky test triage | C | **A/R** | R | R | I | I | I | I | I |
| Automation code review | **R** | **A** | C | C | I | I | I | I | I |

---

## 6. CI/CD & Pipeline Activities

| Activity | QAA | SDET | BE | FE | EM | PM | SRE | SEC | CTO |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| GitHub Actions workflow authoring | C | **R** | I | I | I | I | **A** | I | I |
| Jenkins pipeline maintenance | I | C | I | I | I | I | **A/R** | I | I |
| CI/CD quality gate configuration | **C** | C | I | I | C | I | **A/R** | I | I |
| Pipeline failure remediation | C | **R** | R | R | **A** | I | R | I | I |
| Allure report publishing | I | **A/R** | I | I | I | I | C | I | I |
| Notification alert config | I | C | I | I | I | I | **A/R** | I | I |

---

## 7. Reporting & Metrics Activities

| Activity | QAA | SDET | BE | FE | EM | PM | SRE | SEC | CTO |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Sprint QA metrics reporting | **A/R** | R | I | I | C | I | I | I | I |
| Executive QA report | **A/R** | I | I | I | C | I | I | I | I |
| Grafana dashboard maintenance | C | C | I | I | I | I | **A/R** | I | I |
| Defect density tracking | **A/R** | R | C | C | C | I | I | I | I |
| Test automation ROI reporting | **A/R** | C | I | I | C | I | I | I | I |

---

## 8. Defect Management Activities

| Activity | QAA | SDET | BE | FE | EM | PM | SRE | SEC | CTO |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Defect report filing | **R** | R | R | R | I | **A** | I | I | I |
| Defect severity classification | **A/R** | C | C | C | C | C | I | C | I |
| S1 defect escalation | **R** | I | I | I | **A** | C | I | I | C |
| Defect fix verification | **R** | R | R | R | **A** | I | I | I | I |
| Defect root cause analysis | C | **R** | R | R | **A** | I | I | I | I |
| Defect aging review | **A/R** | I | I | I | C | C | I | I | I |

---

## 9. Release & Security Activities

| Activity | QAA | SDET | BE | FE | EM | PM | SRE | SEC | CTO |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Release readiness sign-off | **R** | I | I | I | **A** | C | C | C | I |
| Production smoke test execution | I | **A/R** | I | I | I | I | C | I | I |
| SAST scan review (Semgrep) | I | C | C | I | I | I | I | **A/R** | I |
| DAST scan execution (ZAP) | C | R | I | I | I | I | I | **A/R** | I |
| Penetration test coordination | I | I | I | I | C | I | I | **A/R** | C |
| WCAG accessibility audit | **R** | C | I | R | **A** | C | I | I | I |
| HIPAA/PHI data compliance review | **R** | I | C | I | C | I | I | **A** | I |
| Post-release monitoring (48h) | I | **R** | I | I | C | I | **A** | I | I |
