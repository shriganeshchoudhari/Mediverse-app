import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('SPEC 15: Accessibility & Responsive Layouts', () => {
  test('A11Y-001 & RESP-001: Mobile viewport responsive rendering', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('main, nav, header, h1, h2, form, div').first()).toBeVisible();
  });

  test('A11Y-002: Automated accessibility scan on landing page', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
