# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 03_domain_allopathic.spec.ts >> SPEC 03: Domain 1 — Allopathic Medicine (MBBS / MD / MS) >> ALLO-001: MBBS curriculum portal renders professional phases
- Location: e2e\specs\03_domain_allopathic.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/allopathic
Call log:
  - navigating to "http://127.0.0.1:3000/healthcare/allopathic", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('SPEC 03: Domain 1 — Allopathic Medicine (MBBS / MD / MS)', () => {
  4  |   test('ALLO-001: MBBS curriculum portal renders professional phases', async ({ page }) => {
  5  |     // Navigate to the master platform dynamic route for allopathic medicine
> 6  |     await page.goto('/healthcare/allopathic');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/allopathic
  7  |     
  8  |     // The domain header and program tabs should be visible
  9  |     await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  10 |     await expect(page.getByText(/MBBS/i).first()).toBeVisible();
  11 | 
  12 |     // Navigate to a subject syllabus by canonical code
  13 |     await page.goto('/healthcare/allopathic/mbbs/PHYS-101');
  14 |     await expect(page.getByRole('heading', { name: /Physiology/i }).first()).toBeVisible();
  15 |     await expect(page.getByText(/Syllabus Content/i)).toBeVisible();
  16 |   });
  17 | });
  18 | 
```