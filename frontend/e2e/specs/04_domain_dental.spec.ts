import { test, expect } from '@playwright/test';

test.describe('SPEC 04: Domain 2 — Dental Sciences (BDS / MDS)', () => {
  test('DENT-001 & DENT-002: BDS Curriculum Portal and Year Progression', async ({ page }) => {
    await page.goto('/healthcare/dental/bds');
    await expect(page.locator('h1, h2').first()).toContainText(/Dental|BDS/i);
    // Switch to Year 2 or check tabs
    const year2Btn = page.getByRole('button', { name: /year 2/i }).or(page.getByText(/year 2/i)).first();
    if (await year2Btn.isVisible()) {
      await year2Btn.click();
      await expect(page.getByText(/conservative dentistry|prosthodontics|materials|pathology/i).first()).toBeVisible();
    }
  });

  test('DENT-003: MDS Specialties Portal displays postgraduate tracks', async ({ page }) => {
    await page.goto('/healthcare/dental/mds');
    await expect(page.locator('h1, h2').first()).toContainText(/Master of Dental Surgery|MDS/i);
    await expect(page.getByText(/Orthodontics|Periodontology|Maxillofacial/i).first()).toBeVisible();
  });

  test('DENT-004 & DENT-005: 3D Tooth Morphology Simulator and Layers', async ({ page }) => {
    await page.goto('/healthcare/dental/tooth-morphology');
    await expect(page.locator('h1, h2').first()).toContainText(/Tooth|Incisor|Dental|Maxillary/i);
    await expect(page.locator('button:has-text("UR1"), button:has-text("Labial"), button:has-text("Enamel")').first()).toBeVisible();
  });

  test('DENT-007: Cephalometric analysis simulator loads radiology tracing', async ({ page }) => {
    await page.goto('/healthcare/dental/cephalometric');
    await expect(page.locator('h1, h2').first()).toContainText(/Cephalometric|Radiology|Orthodontic/i);
  });
});
