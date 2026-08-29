# QA Risk Assessment & Register

```text
Document ID:       QA-RSK-001
Title:             Quality Engineering Risk Register & Mitigation Matrix
Version:           1.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture
```

---

## Risk Scoring Model
$$\text{Risk Score} = \text{Probability (1-5)} \times \text{Impact (1-5)}$$
- **High Risk (15 - 25):** Mandatory mitigation and blocking CI quality gate.
- **Medium Risk (8 - 14):** Active monitoring, automated regression tests required.
- **Low Risk (1 - 7):** Standard test coverage and exploratory validation.

---

## Enterprise QA Risk Register

| Risk ID | Risk Description | Prob (1-5) | Imp (1-5) | Score | Mitigation Strategy | Owner | Trigger Condition | Contingency Plan |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| **RSK-001** | **PHI / HIPAA Data Breach in Test Environments** | 2 | 5 | **10** | Enforce synthetic test data factories. Zero prod DB dumps. | DPO / QA Lead | Production DB copy requested | Immediate data wipe, audit log review, revoke access |
| **RSK-002** | **Telemedicine Video/Audio Stream Dropout** | 3 | 5 | **15** | Automated WebRTC mock tests + synthetic network jitter testing. | SDET Lead | WebRTC failure rate > 1% | Auto-failover to audio-only and notification alert |
| **RSK-003** | **API Contract Drift Between Frontend & Backend** | 4 | 4 | **16** | OpenAPI schema contract testing in Newman on every PR. | Tech Lead | PR contains endpoint signature change | Block merge until consumer and provider schemas align |
| **RSK-004** | **Flaky UI Automation Slowing CI Pipelines** | 4 | 3 | **12** | Ban static sleeps; auto-quarantine test on >2% flakiness. | SDET Lead | Test failure without code change | Auto-route to quarantine branch, create P2 defect |
| **RSK-005** | **PostgreSQL Connection Pool Exhaustion Under Load** | 3 | 4 | **12** | Load and stress test HikariCP connection pool configurations. | DevOps / QA | DB latency p95 > 1000ms | Scale DB read replicas and tune connection timeout |
| **RSK-006** | **Payment Gateway Webhook Dropping Events** | 2 | 5 | **10** | Webhook replay and idempotency automated test suite. | QA Analyst | Webhook returns non-200 | Replay queue with dead-letter monitoring |
| **RSK-007** | **Unauthorized Role Privilege Escalation (RBAC)** | 2 | 5 | **10** | Automated matrix security test verifying 403 Forbidden for lower roles. | Security / QA | New API role introduced | Immediate build block and security review |
