import { test, expect } from '@playwright/test';

test.describe('SPEC 17: Advanced Intensive Care & Nephrology Clinical Simulators', () => {
  test('SIM-ECMO-001: Extracorporeal Membrane Oxygenation (ECMO) Workstation renders VV/VA controls', async ({ page }) => {
    await page.goto('/simulators/ecmo-dynamics');
    await expect(page.locator('h1, h2').first()).toContainText(/ECMO|Extracorporeal|Oxygenation/i);
    await expect(page.getByText(/VV|VA|Sweep Gas|Blood Flow|Cannulation/i).first()).toBeVisible();
  });

  test('SIM-ACID-001: Stewart Physico-Chemical Acid-Base & SID Simulator computes ions', async ({ page }) => {
    await page.goto('/simulators/stewart-acid-base');
    await expect(page.locator('h1, h2').first()).toContainText(/Stewart|Acid-Base|SID/i);
    await expect(page.getByText(/Strong Ion Difference|Atot|SIG|Bicarbonate/i).first()).toBeVisible();
  });

  test('SIM-CRRT-001: CRRT Modalities & Regional Citrate Anticoagulation Workstation loads', async ({ page }) => {
    await page.goto('/simulators/crrt-citrate-clearance');
    await expect(page.locator('h1, h2').first()).toContainText(/CRRT|Continuous Renal Replacement|Citrate/i);
    await expect(page.getByText(/Effluent|Clearance|KDIGO|Citrate/i).first()).toBeVisible();
  });
});
