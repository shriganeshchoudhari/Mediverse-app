import { test, expect } from '@playwright/test';

test.describe('SPEC 09: Domain 7 — Allied Health (Perfusion, Radiology, Dialysis, OT)', () => {
  test('ALLIED-001 & ALLIED-002: Allied Health curriculum and ECMO circuit simulator', async ({ page }) => {
    await page.goto('/healthcare/allied/ecmo-circuit');
    await expect(page.locator('h1, h2').first()).toContainText(/ECMO|Perfusion/i);
  });
});
