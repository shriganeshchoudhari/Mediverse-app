# Smoke Test Suite Catalog

```text
Document ID:       QA-STS-001
Title:             Automated Smoke Test Suite Catalog
Version:           2.0.0
Status:            APPROVED
Owner:             SDET Lead
```

---

| Test Case ID | Domain / Module | Title | Target Interface | SLA / Max Runtime | Execution Trigger |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `SMK-NAV-000` | Core Shell | Global Topbar Cardinality & Theme Toggle | UI | <= 2.5s | PR, Merge, Post-Deploy |
| `SMK-AUTH-001` | Auth | Student Registration & JWT Token Flow | UI / API | <= 3.0s | PR, Merge, Post-Deploy |
| `SMK-AUTH-002` | Auth | Student & Admin Login Flow | UI / API | <= 2.5s | PR, Merge, Post-Deploy |
| `SMK-DASH-001` | Student Hub | Dashboard Overview & Program Switcher | UI | <= 2.0s | PR, Merge, Post-Deploy |
| `SMK-SOC-001` | AI Tutoring | Socratic Assistant Drawer & Starter Inquiry | UI | <= 2.5s | PR, Merge, Post-Deploy |
| `SMK-HLTH-001` | Actuator | Spring Actuator Health & Redis Probe | API | <= 200ms | PR, Merge, Post-Deploy |
| `SMK-DOM-001` | Curricula | 9 Healthcare Domains Directory API | API | <= 300ms | PR, Merge, Post-Deploy |
