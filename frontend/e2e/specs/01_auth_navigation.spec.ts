import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

test.describe('SPEC 01: Authentication & Navigation Shell', () => {
  test('AUTH-001 & NAV-001: Header Topbar is unique and renders branding cleanly', async ({ page }) => {
    const base = new BasePage(page);
    await page.goto('/');

    // 1. Strict Cardinality: Guarantee EXACTLY ONE topbar/navbar exists (no duplicates)
    await expect(base.navbar).toHaveCount(1);
    await expect(base.brandLogo).toHaveCount(1);

    // 2. Navigation items
    await expect(page.locator('button:has-text("Domains"), a:has-text("Domains")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Curriculum"), a:has-text("Curriculum")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Simulators"), a:has-text("Simulators")').first()).toBeVisible();

    // 3. Auth Actions
    await expect(page.locator('a[href="/auth/login"], button:has-text("Login")').first()).toBeVisible();
    await expect(page.locator('a[href="/auth/register"], button:has-text("Sign Up")').first()).toBeVisible();

    // 4. Theme Toggle
    await base.toggleTheme();
    await expect(page.locator('html')).toBeVisible();
  });
});
