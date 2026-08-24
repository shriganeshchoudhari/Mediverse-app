# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 06_domain_pharmacy.spec.ts >> SPEC 06: Domain 4 — Pharmacy (B.Pharm, M.Pharm, Pharm.D) >> PHARM-001 & PHARM-004: B.Pharm portal and Drug Interaction analyzer
- Location: e2e\specs\06_domain_pharmacy.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/pharmacy/drug-interactions
Call log:
  - navigating to "http://127.0.0.1:3000/healthcare/pharmacy/drug-interactions", waiting until "load"

```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 | 
  3 | test.describe('SPEC 06: Domain 4 — Pharmacy (B.Pharm, M.Pharm, Pharm.D)', () => {
  4 |   test('PHARM-001 & PHARM-004: B.Pharm portal and Drug Interaction analyzer', async ({ page }) => {
> 5 |     await page.goto('/healthcare/pharmacy/drug-interactions');
    |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/pharmacy/drug-interactions
  6 |     await expect(page.locator('h1, h2').first()).toContainText(/Drug Interaction/i);
  7 |   });
  8 | });
  9 | 
```