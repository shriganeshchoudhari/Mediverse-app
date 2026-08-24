# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 07_domain_nursing.spec.ts >> SPEC 07: Domain 5 — Nursing Sciences (B.Sc / M.Sc Nursing) >> NURS-001 & NURS-003: Nursing portal and NEWS2 Deterioration Score
- Location: e2e\specs\07_domain_nursing.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/nursing/news2-escalation
Call log:
  - navigating to "http://127.0.0.1:3000/healthcare/nursing/news2-escalation", waiting until "load"

```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 | 
  3 | test.describe('SPEC 07: Domain 5 — Nursing Sciences (B.Sc / M.Sc Nursing)', () => {
  4 |   test('NURS-001 & NURS-003: Nursing portal and NEWS2 Deterioration Score', async ({ page }) => {
> 5 |     await page.goto('/healthcare/nursing/news2-escalation');
    |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/healthcare/nursing/news2-escalation
  6 |     await expect(page.locator('h1, h2').first()).toContainText(/NEWS2|Escalation/i);
  7 |   });
  8 | });
  9 | 
```