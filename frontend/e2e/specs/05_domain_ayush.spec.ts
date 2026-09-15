import { test, expect } from '@playwright/test';

test.describe('SPEC 05: Domain 3 — AYUSH (BAMS, BHMS, BNYS, BUMS, BSMS)', () => {
  test('AYUSH-001: BAMS Undergraduate Curriculum Portal', async ({ page }) => {
    await page.goto('/healthcare/ayush/bams');
    await expect(page.locator('h1, h2').first()).toContainText(/Ayurved|BAMS|NCISM/i);
    await expect(page.getByText(/Kriya Sharir|Rachana Sharir|Dravyaguna|Samhita/i).first()).toBeVisible();
  });

  test('AYUSH-007: Prakriti Assessment interactive diagnostic engine', async ({ page }) => {
    await page.goto('/healthcare/ayush/prakriti-assessment');
    await expect(page.locator('h1, h2').first()).toContainText(/Prakriti/i);
    const assessmentBtn = page.getByRole('button', { name: /start|calculate|submit|next/i }).first();
    if (await assessmentBtn.isVisible()) {
      await expect(assessmentBtn).toBeEnabled();
    }
  });

  test('AYUSH-008: 3D Marma Point Map vital anatomical locations', async ({ page }) => {
    await page.goto('/healthcare/ayush/marma-map');
    await expect(page.locator('h1, h2').first()).toContainText(/Marma/i);
    await expect(page.getByText(/Hridaya|Sadyo|Pranahara|Varmam|Anatomy/i).first()).toBeVisible();
  });

  test('AYUSH-009: Dravyaguna herbology explorer and virya classification', async ({ page }) => {
    await page.goto('/healthcare/ayush/dravyaguna-explorer');
    await expect(page.locator('h1, h2').first()).toContainText(/Dravyaguna|Herbs|Materia Medica/i);
  });
});
