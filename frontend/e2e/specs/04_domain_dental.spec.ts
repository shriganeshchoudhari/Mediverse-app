import { test, expect } from '@playwright/test';

test.describe('SPEC 04: Domain 2 — Dental Sciences (BDS / MDS)', () => {
  test('DENT-001 & DENT-004: BDS portal and 3D Tooth Morphology', async ({ page }) => {
    await page.goto('/healthcare/dental/tooth-morphology');
    await expect(page.locator('h1, h2').first()).toContainText(/Tooth|Incisor|Dental|Maxillary/i);
    await expect(page.locator('button:has-text("UR1"), button:has-text("Labial"), button:has-text("Enamel")').first()).toBeVisible();
  });
});
