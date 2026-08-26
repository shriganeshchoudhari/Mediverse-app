# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 05_domain_ayush.spec.ts >> SPEC 05: Domain 3 — AYUSH (BAMS, BHMS, BNYS, BUMS, BSMS) >> AYUSH-001 & AYUSH-007: BAMS portal and Prakriti assessment
- Location: e2e\specs\05_domain_ayush.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/ayush/prakriti-assessment
Call log:
  - navigating to "http://127.0.0.1:3000/healthcare/ayush/prakriti-assessment", waiting until "load"

```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 | 
  3 | test.describe('SPEC 05: Domain 3 — AYUSH (BAMS, BHMS, BNYS, BUMS, BSMS)', () => {
  4 |   test('AYUSH-001 & AYUSH-007: BAMS portal and Prakriti assessment', async ({ page }) => {
> 5 |     await page.goto('/healthcare/ayush/prakriti-assessment');
    |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/ayush/prakriti-assessment
  6 |     await expect(page.locator('h1, h2').first()).toContainText(/Prakriti/i);
  7 |   });
  8 | });
  9 | 
```