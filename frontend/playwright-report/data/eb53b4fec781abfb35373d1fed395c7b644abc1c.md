# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 15_accessibility_and_responsive.spec.ts >> SPEC 15: Accessibility & Responsive Layouts >> A11Y-001 & RESP-001: Mobile viewport responsive rendering
- Location: e2e\specs\15_accessibility_and_responsive.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/
Call log:
  - navigating to "http://127.0.0.1:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('SPEC 15: Accessibility & Responsive Layouts', () => {
  4  |   test('A11Y-001 & RESP-001: Mobile viewport responsive rendering', async ({ page }) => {
  5  |     await page.setViewportSize({ width: 375, height: 667 });
> 6  |     await page.goto('/');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/
  7  |     await expect(page.locator('main, nav, header, h1, h2, form, div').first()).toBeVisible();
  8  |   });
  9  | });
  10 | 
```