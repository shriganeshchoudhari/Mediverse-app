import { test, expect } from '@playwright/test';

test.describe('SPEC 05: Domain 3 — AYUSH (BAMS, BHMS, BNYS, BUMS, BSMS)', () => {
  test('AYUSH-001 & AYUSH-007: BAMS portal and Prakriti assessment', async ({ page }) => {
    await page.goto('/healthcare/ayush/prakriti-assessment');
    await expect(page.locator('h1, h2').first()).toContainText(/Prakriti/i);
  });
});
