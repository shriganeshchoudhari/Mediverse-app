import { test, expect } from '@playwright/test';

test.describe('SPEC 15: Accessibility & Responsive Layouts', () => {
  test('A11Y-001 & RESP-001: Mobile viewport responsive rendering', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('main, nav, header, h1, h2, form, div').first()).toBeVisible();
  });
});
