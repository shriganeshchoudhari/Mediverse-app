# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01_auth_navigation.spec.ts >> SPEC 01: Authentication & Navigation Shell >> AUTH-001 & NAV-001: Header Topbar is unique and renders branding cleanly
- Location: e2e\specs\01_auth_navigation.spec.ts:5:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/
Call log:
  - navigating to "http://127.0.0.1:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { BasePage } from '../pages/BasePage';
  3  | 
  4  | test.describe('SPEC 01: Authentication & Navigation Shell', () => {
  5  |   test('AUTH-001 & NAV-001: Header Topbar is unique and renders branding cleanly', async ({ page }) => {
  6  |     const base = new BasePage(page);
> 7  |     await page.goto('/');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/
  8  | 
  9  |     // 1. Strict Cardinality: Guarantee EXACTLY ONE topbar/navbar exists (no duplicates)
  10 |     await expect(base.navbar).toHaveCount(1);
  11 |     await expect(base.brandLogo).toHaveCount(1);
  12 | 
  13 |     // 2. Navigation items
  14 |     await expect(page.locator('button:has-text("Domains"), a:has-text("Domains")').first()).toBeVisible();
  15 |     await expect(page.locator('button:has-text("Curriculum"), a:has-text("Curriculum")').first()).toBeVisible();
  16 |     await expect(page.locator('button:has-text("Simulators"), a:has-text("Simulators")').first()).toBeVisible();
  17 | 
  18 |     // 3. Auth Actions
  19 |     await expect(page.locator('a[href="/auth/login"], button:has-text("Login")').first()).toBeVisible();
  20 |     await expect(page.locator('a[href="/auth/register"], button:has-text("Sign Up")').first()).toBeVisible();
  21 | 
  22 |     // 4. Theme Toggle
  23 |     await base.toggleTheme();
  24 |     await expect(page.locator('html')).toBeVisible();
  25 |   });
  26 | });
  27 | 
```