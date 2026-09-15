import { test, expect } from '@playwright/test';

test.describe('SPEC 09: Domain 7 — Allied Health Sciences (NCAHP Programs)', () => {
  test('ALLIED-001: Allied Health Multi-Track Curriculum Portal', async ({ page }) => {
    await page.goto('/healthcare/allied/curriculum');
    await expect(page.locator('h1, h2').first()).toContainText(/Allied Health|Curriculum/i);
    await expect(page.getByText(/Perfusion|Radiology|Dialysis|Operation Theatre/i).first()).toBeVisible();
  });

  test('ALLIED-002: ECMO & Cardiopulmonary Bypass Circuit Simulator', async ({ page }) => {
    await page.goto('/healthcare/allied/ecmo-circuit');
    await expect(page.locator('h1, h2').first()).toContainText(/ECMO|Bypass|Circuit/i);
  });

  test('ALLIED-003: CT Slice Windowing & Radiological Attenuation Station', async ({ page }) => {
    await page.goto('/healthcare/allied/ct-slice-explorer');
    await expect(page.locator('h1, h2').first()).toContainText(/CT|Slice|Radiology|Window/i);
  });

  test('ALLIED-004: Dialysis Clearance & Urea Kinetic Modeling Station', async ({ page }) => {
    await page.goto('/healthcare/allied/dialysis-clearance');
    await expect(page.locator('h1, h2').first()).toContainText(/Dialysis|Clearance|Kt\/V/i);
  });
});
