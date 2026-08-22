import { test, expect } from '@playwright/test';

test.describe('SPEC 08: Domain 6 — Physiotherapy & Rehabilitation (BPT / MPT)', () => {
  test('PT-001 & PT-003: BPT portal and Gait Cycle pathological simulator', async ({ page }) => {
    await page.goto('/healthcare/physiotherapy/gait-analysis');
    await expect(page.locator('h1, h2').first()).toContainText(/Gait/i);
  });
});
