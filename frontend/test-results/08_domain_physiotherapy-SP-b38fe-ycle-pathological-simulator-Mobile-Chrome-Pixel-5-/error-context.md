# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 08_domain_physiotherapy.spec.ts >> SPEC 08: Domain 6 — Physiotherapy & Rehabilitation (BPT / MPT) >> PT-001 & PT-003: BPT portal and Gait Cycle pathological simulator
- Location: e2e\specs\08_domain_physiotherapy.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/physiotherapy/gait-analysis
Call log:
  - navigating to "http://127.0.0.1:3000/healthcare/physiotherapy/gait-analysis", waiting until "load"

```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 | 
  3 | test.describe('SPEC 08: Domain 6 — Physiotherapy & Rehabilitation (BPT / MPT)', () => {
  4 |   test('PT-001 & PT-003: BPT portal and Gait Cycle pathological simulator', async ({ page }) => {
> 5 |     await page.goto('/healthcare/physiotherapy/gait-analysis');
    |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/physiotherapy/gait-analysis
  6 |     await expect(page.locator('h1, h2').first()).toContainText(/Gait/i);
  7 |   });
  8 | });
  9 | 
```