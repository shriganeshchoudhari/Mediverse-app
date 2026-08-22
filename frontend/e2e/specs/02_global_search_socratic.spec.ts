import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

test.describe('SPEC 02: Global Search & Socratic AI Tutor', () => {
  test('SEARCH-001 & SOC-001: Global search keyboard shortcut triggers modal', async ({ page }) => {
    const base = new BasePage(page);
    await page.goto('/dashboard');

    // 1. Topbar is singular on dashboard too
    await expect(base.navbar).toHaveCount(1);

    // 2. Open Search via Ctrl+K and type query
    await base.openSearch('Cardiology');
    await expect(page.locator('input[placeholder*="Search"]').first()).toBeVisible();

    // 3. Global Socratic button
    await expect(page.locator('button[aria-label*="Socratic"], button[aria-label*="Tutor"], button:has-text("AI")').first()).toBeVisible();
  });
});
