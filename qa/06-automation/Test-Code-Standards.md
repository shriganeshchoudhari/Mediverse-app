# Test Code Standards & Quality Guidelines

```text
Document ID:       QA-AUT-005
Title:             Automation Coding Standards & Prohibitions
Version:           1.0.0
Status:            APPROVED
Owner:             Lead SDET
```

---

## 1. Prohibitions & Best Practices
- **Strictly Prohibited:** `page.waitForTimeout()` or `Thread.sleep()`.
- **Naming Conventions:** Specs: `*.spec.ts`, Pages: `*Page.ts`, Fixtures: `*.fixture.ts`.
- **Linting:** ESLint with TypeScript rules and Playwright recommended plugins.
