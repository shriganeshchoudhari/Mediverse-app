# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 03_domain_allopathic.spec.ts >> SPEC 03: Domain 1 — Allopathic Medicine (MBBS / MD / MS) >> ALLO-001: MBBS curriculum portal renders professional phases
- Location: e2e\specs\03_domain_allopathic.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/ALLOPATHIC/MBBS/cardiovascular
Call log:
  - navigating to "http://127.0.0.1:3000/healthcare/ALLOPATHIC/MBBS/cardiovascular", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('SPEC 03: Domain 1 — Allopathic Medicine (MBBS / MD / MS)', () => {
  4  |   test('ALLO-001: MBBS curriculum portal renders professional phases', async ({ page }) => {
  5  |     // Navigate to the master platform dynamic route for a subject
> 6  |     await page.goto('/healthcare/ALLOPATHIC/MBBS/cardiovascular');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/ALLOPATHIC/MBBS/cardiovascular
  7  |     
  8  |     // The subject header should be visible
  9  |     await expect(page.getByText(/MBBS/i)).toBeVisible();
  10 |     await expect(page.getByText(/cardiovascular/i)).toBeVisible();
  11 | 
  12 |     // Verify the curriculum tabs are present
  13 |     await expect(page.getByRole('tab', { name: /Curriculum Syllabus/i })).toBeVisible();
  14 |     await expect(page.getByRole('tab', { name: /Analytics & Progress/i })).toBeVisible();
  15 |   });
  16 | });
  17 | 
```