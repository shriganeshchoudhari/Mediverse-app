import { test, expect } from '@playwright/test';

test.describe('SPEC 06: Domain 4 — Pharmacy (B.Pharm, M.Pharm, Pharm.D)', () => {
  test('PHARM-001 & PHARM-004: B.Pharm portal and Drug Interaction analyzer', async ({ page }) => {
    await page.goto('/healthcare/pharmacy/drug-interactions');
    await expect(page.locator('h1, h2').first()).toContainText(/Drug Interaction/i);
  });
});
