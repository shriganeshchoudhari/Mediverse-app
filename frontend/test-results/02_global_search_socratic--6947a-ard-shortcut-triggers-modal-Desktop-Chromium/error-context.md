# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02_global_search_socratic.spec.ts >> SPEC 02: Global Search & Socratic AI Tutor >> SEARCH-001 & SOC-001: Global search keyboard shortcut triggers modal
- Location: e2e\specs\02_global_search_socratic.spec.ts:5:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/dashboard
Call log:
  - navigating to "http://127.0.0.1:3000/dashboard", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { BasePage } from '../pages/BasePage';
  3  | 
  4  | test.describe('SPEC 02: Global Search & Socratic AI Tutor', () => {
  5  |   test('SEARCH-001 & SOC-001: Global search keyboard shortcut triggers modal', async ({ page }) => {
  6  |     const base = new BasePage(page);
> 7  |     await page.goto('/dashboard');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/dashboard
  8  | 
  9  |     // 1. Topbar is singular on dashboard too
  10 |     await expect(base.navbar).toHaveCount(1);
  11 | 
  12 |     // 2. Open Search via Ctrl+K and type query
  13 |     await base.openSearch('Cardiology');
  14 |     await expect(page.locator('input[placeholder*="Search"]').first()).toBeVisible();
  15 | 
  16 |     // 3. Global Socratic button
  17 |     await expect(page.locator('button[aria-label*="Socratic"], button[aria-label*="Tutor"], button:has-text("AI")').first()).toBeVisible();
  18 |   });
  19 | });
  20 | 
```