# Quality Standards & Engineering Benchmarks

```text
Document ID:       QA-STD-001
Title:             Engineering Quality Standards & Thresholds
Version:           1.0.0
Status:            APPROVED
Owner:             Enterprise QA Architecture
Review Frequency:  Quarterly
```

---

## 1. Code Quality & Static Analysis Standards
- **Unit Test Line Coverage:** Backend (Spring Boot/Java) >= 80%; Frontend (Next.js/TypeScript) >= 80%.
- **Branch Coverage:** Critical business logic paths (Auth, Triage, Telemedicine, Billing) >= 85%.
- **Static Analysis:** SonarQube / ESLint zero blocker, zero critical rules violations; Security rating 'A'; Technical debt ratio < 5%.
- **Dependency Audit:** Zero High or Critical CVEs allowed in production builds (`npm audit`, Snyk, OWASP Dependency Check).

---

## 2. Automation Code Standards
- **Design Pattern:** Strictly Page Object Model (POM) and Component Object Model (COM) in Playwright; modular script libraries in Postman.
- **Assertion Standards:** Hard assertions must include descriptive error messages. Soft assertions are restricted to multi-attribute validation checks.
- **Locator Strategy Priority:**
  1. `page.getByRole()`
  2. `page.getByLabel()`
  3. `page.getByTestId()` (`data-testid="xyz"`)
  4. `page.getByText()`
  *Strictly Disallowed:* Absolute XPath or brittle CSS paths (e.g., `div > span:nth-child(3) > a`).
- **Idempotency:** Every test suite must instantiate and clean up its own isolated test entities or use designated transient test factories.

---

## 3. Performance & Reliability Standards
- **API Response Times (p95):**
  - Read queries (GET): <= 200 ms.
  - Write queries (POST/PUT/DELETE): <= 400 ms.
  - Complex aggregation / search: <= 800 ms.
- **Frontend Web Vitals (Core Web Vitals):**
  - Largest Contentful Paint (LCP): <= 2.5s.
  - Interaction to Next Paint (INP): <= 200ms.
  - Cumulative Layout Shift (CLS): <= 0.1.
- **API Error Rate:** < 0.1% under normal baseline load; 0% unhandled 500 Internal Server Errors.

---

## 4. Accessibility Standards (WCAG 2.1 AA)
- Automated axe-core scans must report 0 violations for Level A and Level AA rules on all primary patient and clinician journeys.
- Full keyboard navigation and screen-reader compatibility for critical consultation and appointment booking flows.
