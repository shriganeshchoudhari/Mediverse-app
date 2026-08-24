# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 09_domain_allied_health.spec.ts >> SPEC 09: Domain 7 — Allied Health (Perfusion, Radiology, Dialysis, OT) >> ALLIED-001 & ALLIED-002: Allied Health curriculum and ECMO circuit simulator
- Location: e2e\specs\09_domain_allied_health.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/allied/ecmo-circuit
Call log:
  - navigating to "http://127.0.0.1:3000/healthcare/allied/ecmo-circuit", waiting until "load"

```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 | 
  3 | test.describe('SPEC 09: Domain 7 — Allied Health (Perfusion, Radiology, Dialysis, OT)', () => {
  4 |   test('ALLIED-001 & ALLIED-002: Allied Health curriculum and ECMO circuit simulator', async ({ page }) => {
> 5 |     await page.goto('/healthcare/allied/ecmo-circuit');
    |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/allied/ecmo-circuit
  6 |     await expect(page.locator('h1, h2').first()).toContainText(/ECMO|Perfusion/i);
  7 |   });
  8 | });
  9 | 
```