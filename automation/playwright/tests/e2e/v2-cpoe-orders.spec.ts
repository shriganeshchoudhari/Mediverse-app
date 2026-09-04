import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// ─────────────────────────────────────────────────────────────────────────────
// V2.5 Feature: Hospital EMR CPOE & eMAR Order Entry Sandbox
// Route: /simulators/emr
// ─────────────────────────────────────────────────────────────────────────────

test.describe('V2.5 Hospital EMR CPOE & eMAR Safety @e2e @v2 @emr @cpoe', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulators/emr');
  });

  test('V2-CPOE-001: Renders Orders & eMAR tab and Telemetry Vitals Flowsheet', async ({ page }) => {
    allure.label('suite', 'V2.5 Hospital CPOE & Telemetry');
    allure.label('testId', 'V2-CPOE-001');
    allure.label('severity', 'critical');
    allure.description('Verifies Telemetry Vitals flowsheet in Overview and Orders & eMAR navigation tab.');

    // Check Overview & Vitals flowsheet
    await expect(page.getByText(/ICU Telemetry & Vitals Flowsheet/i)).toBeVisible();
    await expect(page.getByText(/HR/i).first()).toBeVisible();

    // Check Orders & eMAR tab
    const cpoeTab = page.getByRole('button', { name: /orders & emar/i });
    await expect(cpoeTab).toBeVisible();
    await cpoeTab.click();

    // Verify CPOE system rendered
    await expect(page.getByText(/Hospital CPOE & eMAR Order Entry/i)).toBeVisible();
    await expect(page.getByText(/Order New Inpatient Medication/i)).toBeVisible();
  });

  test('V2-CPOE-002: Pharmacovigilance blocks contraindicated Nitroglycerin in hypotension', async ({ page }) => {
    allure.label('suite', 'V2.5 Hospital CPOE & Telemetry');
    allure.label('testId', 'V2-CPOE-002');
    allure.label('severity', 'blocker');
    allure.description('Validates real-time pharmacology screening catches fatal hypotension contraindications.');

    const cpoeTab = page.getByRole('button', { name: /orders & emar/i });
    await cpoeTab.click();

    // Select Nitroglycerin
    const medSelect = page.locator('select').first();
    await medSelect.selectOption({ label: /nitroglycerin/i });

    // Run safety screening
    const screenBtn = page.getByRole('button', { name: /run safety screening/i });
    await screenBtn.click();

    // Verify fatal contraindication warning
    await expect(page.getByText(/CRITICAL SAFETY RED FLAG — DO NOT ADMINISTER/i)).toBeVisible();
    await expect(page.getByText(/Hemodynamic Contraindication: Hypotension/i)).toBeVisible();
  });
});
