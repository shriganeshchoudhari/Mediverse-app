# ADR-006 — Jira Cloud as Secondary Project Management Platform

```text
ADR ID:            ADR-006
Title:             Jira Cloud as Secondary PM Platform (Dual-Track with GitHub)
Status:            ACCEPTED
Date:              2026-08-29
Author:            QA Architect
Reviewers:         Engineering Manager, CTO
Deciders:          Engineering Manager, CTO
Supersedes:        None
Superseded By:     None
```

---

## Context

Mediverse development team initially used **GitHub Issues** as the sole project management tool (documented in ADR-003). However, the product management and leadership team required a more structured backlog management system with:

- Native Kanban and Scrum board views
- Epic → Story → Subtask hierarchy with visual linking
- Sprint velocity tracking
- Time-logging and SLA compliance tracking
- Business-stakeholder dashboards not requiring GitHub access

The team evaluated Jira Cloud (`shriiganesh.atlassian.net`) alongside GitHub Issues. The user explicitly confirmed: **"lets do in Jira as well"**.

---

## Decision

**Adopt Jira Cloud (`shriiganesh.atlassian.net`, project `KAN`) as the secondary project management platform, operating in a dual-track model alongside GitHub Issues.**

### Dual-Track Model
| Concern | Primary Tool | Secondary Tool |
|---|---|---|
| Engineering defect tracking | GitHub Issues | Jira (`type=Task/Bug`) |
| Sprint backlog management | GitHub Projects | Jira Kanban Board |
| Epic definition (engineering) | `.github/epics/*.md` | Jira Epics (KAN-4 to KAN-11) |
| Business stakeholder reporting | — | Jira dashboards |
| PR / Code review linkage | GitHub | Jira dev-info panel (GitHub integration) |
| Automation (CI triggers) | GitHub Actions | — |

### Jira Project Configuration (as implemented)
- **Project Key:** `KAN`
- **Board Type:** Scrum (Kanban board enabled)
- **Issue Types Available:** Epic (10006), Task (10008), Subtask (10007), Asset (10009)
- **Note:** Project does not have native `Story` or `Bug` issue types. `Task` is used as workaround for both user stories and bug reports.
- **8 Epics Created:** KAN-4 (Core Platform) through KAN-11 (QA Governance)
- **First Task:** KAN-12 — Global Topbar Story
- **First Defect:** KAN-13 — Periodontal Depth Bug (S2/P2)

---

## Alternatives Considered

### Option A: GitHub Issues Only
- ✅ Single source of truth; no synchronization overhead
- ✅ Tight PR/issue linkage; developer-centric
- ❌ No native Gantt/timeline view
- ❌ Business stakeholders require GitHub account
- ❌ No time-logging or SLA fields

### Option B: Linear (Issue Tracking SaaS)
- ✅ Modern UI; fast; GitHub integration native
- ❌ Paid product; team size pricing
- ❌ Not familiar to wider stakeholder group

### Option C: Jira Cloud (ACCEPTED)
- ✅ Industry-standard; PM/business stakeholder familiar
- ✅ Advanced reporting (velocity, burndown, epic progress)
- ✅ Free tier supports the team size
- ⚠️ Requires synchronization discipline between GitHub and Jira
- ⚠️ Limited issue types in KAN project (no native Story/Bug)

---

## Consequences

### Positive
- Business stakeholders have a dashboard view without GitHub access.
- Sprint velocity and burndown charts available out of the box.
- Epics in Jira (KAN-4 to KAN-11) serve as the product-level planning artifact.
- Jira's GitHub integration allows PRs to appear in Jira issue dev-info panel.

### Negative / Risks
- **Synchronization drift:** Defects tracked in GitHub may not always be mirrored to Jira. Team discipline required.
- **Workaround for issue types:** Using `Task` as `Bug` may reduce Jira native defect metrics accuracy.
- **Jira project `KAN` is a free-tier workspace.** Upgrade required if team exceeds free tier limits.

### Mitigation
- **Naming convention:** GitHub defect issues are prefixed `[BUG]`; Jira tasks with `[BUG]` prefix. Cross-reference GitHub issue URL in Jira description.
- **Weekly sync ceremony:** Sprint review includes a Jira ↔ GitHub reconciliation check (5 minutes).
- **ADR review:** If synchronization overhead exceeds 30 minutes per week, revisit dual-track in next maturity assessment.

---

## Links
- Jira Workspace: `https://shriiganesh.atlassian.net`
- Project: `KAN` (Mediverse)
- GitHub: `https://github.com/shriganeshchoudhari/Mediverse-app`
