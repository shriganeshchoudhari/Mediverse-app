import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// ─────────────────────────────────────────────────────────────────────────────
// V2.5 Feature: Multi-Station Clinical OSCE Examination Engine
// Route: /exam/osce/osce-stemi-cardiology
// ─────────────────────────────────────────────────────────────────────────────

test.describe('V2.5 Multi-Station OSCE Clinical Examination Engine @e2e @v2 @osce', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/exam/osce/osce-stemi-cardiology');
  });

  test('V2-OSCE-001: Renders STEMI scenario header, vitals HUD, and 5-station stepper', async ({ page }) => {
    allure.label('suite', 'V2.5 OSCE Exam Engine');
    allure.label('testId', 'V2-OSCE-001');
    allure.label('severity', 'critical');
    allure.description('Verifies scenario title, patient demographics, and 5-station progression banner.');

    await expect(page.getByText(/Acute Coronary Syndrome — Anterior Wall STEMI/i)).toBeVisible();
    await expect(page.getByText(/Ramesh Sundaram/i)).toBeVisible();
    await expect(page.getByText(/STATION 1/i)).toBeVisible();
    await expect(page.getByText(/STATION 5/i)).toBeVisible();
  });

  test('V2-OSCE-002: Virtual stethoscope auscultation on Station 2', async ({ page }) => {
    allure.label('suite', 'V2.5 OSCE Exam Engine');
    allure.label('testId', 'V2-OSCE-002');
    allure.label('severity', 'critical');
    allure.description('Progresses to Station 2 and verifies interactive thoracic landmarks and acoustic profile.');

    // Move to Station 2
    const nextBtn = page.getByRole('button', { name: /next station/i });
    await nextBtn.click();

    await expect(page.getByText(/Virtual Stethoscope & Auscultation/i)).toBeVisible();
    await expect(page.getByText(/Anterior Thorax/i)).toBeVisible();

    // Click Aortic area
    const aorticBtn = page.locator('button[title*="Aortic"], button:has-text("Aortic Area")').first();
    if (await aorticBtn.isVisible()) {
      await aorticBtn.click();
      await expect(page.getByText(/Acoustic Profile/i)).toBeVisible();
    }
  });

  test('V2-OSCE-003: Completes full 5-station carousel and generates clinical scorecard', async ({ page }) => {
    allure.label('suite', 'V2.5 OSCE Exam Engine');
    allure.label('testId', 'V2-OSCE-003');
    allure.label('severity', 'blocker');
    allure.description('Advances through all 5 stations and verifies holistic competency scoring report card.');

    // Step 1 to 5
    for (let i = 0; i < 4; i++) {
      const nextBtn = page.getByRole('button', { name: /next station/i });
      await nextBtn.click();
    }

    // Submit on station 5
    const submitBtn = page.getByRole('button', { name: /submit & view scorecard|next station/i });
    await submitBtn.click();

    // Check Scorecard
    await expect(page.getByText(/OSCE Clinical Performance Scorecard/i)).toBeVisible();
    await expect(page.getByText(/Overall Score/i)).toBeVisible();
    await expect(page.getByText(/Diagnostic Precision/i)).toBeVisible();
    await expect(page.getByText(/Patient Safety Index/i)).toBeVisible();
    await expect(page.getByText(/Attending Examiner Synthesis & Debrief/i)).toBeVisible();
  });
});
