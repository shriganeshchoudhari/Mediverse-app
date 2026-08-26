# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 04_domain_dental.spec.ts >> SPEC 04: Domain 2 — Dental Sciences (BDS / MDS) >> DENT-001 & DENT-004: BDS portal and 3D Tooth Morphology
- Location: e2e\specs\04_domain_dental.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/dental/tooth-morphology
Call log:
  - navigating to "http://127.0.0.1:3000/healthcare/dental/tooth-morphology", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('SPEC 04: Domain 2 — Dental Sciences (BDS / MDS)', () => {
  4  |   test('DENT-001 & DENT-004: BDS portal and 3D Tooth Morphology', async ({ page }) => {
> 5  |     await page.goto('/healthcare/dental/tooth-morphology');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/dental/tooth-morphology
  6  |     await expect(page.locator('h1, h2').first()).toContainText(/Tooth|Incisor|Dental|Maxillary/i);
  7  |     await expect(page.locator('button:has-text("UR1"), button:has-text("Labial"), button:has-text("Enamel")').first()).toBeVisible();
  8  |   });
  9  | });
  10 | 
```