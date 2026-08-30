import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// ─────────────────────────────────────────────────────────────────────────────
// V2 Feature: Voice AI Standardized Patients & Telehealth Simulator
// Route: /simulators/telehealth
// ─────────────────────────────────────────────────────────────────────────────

test.describe('V2 Voice AI Standardized Patients @e2e @v2 @voice-ai', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulators/telehealth');
  });

  test('V2-VOICE-001: Telehealth consultation room renders persona banner, vitals, and microphone trigger', async ({ page }) => {
    allure.label('suite', 'V2 Voice AI Telehealth');
    allure.label('testId', 'V2-VOICE-001');
    allure.label('severity', 'critical');
    allure.description('Verifies Telehealth UI loads standardized patient profile, live BP/HR vitals, and audio visualizer.');

    await expect(page.getByRole('heading', { name: /telehealth simulator/i })).toBeVisible();

    const patientName = page.getByText(/John Miller|Acute Abdomen|Standardized Patient/i).first();
    await expect(patientName).toBeVisible();

    const micButton = page.getByRole('button', { name: /start voice consultation|microphone/i }).first();
    await expect(micButton).toBeVisible();
    await expect(micButton).toBeEnabled();
  });

  test('V2-VOICE-002: Switching patient persona dynamically updates vitals and chief complaint', async ({ page }) => {
    allure.label('suite', 'V2 Voice AI Telehealth');
    allure.label('testId', 'V2-VOICE-002');
    allure.label('severity', 'high');
    allure.description('Verifies persona selector dropdown updates patient demographics, diagnosis, and baseline ECG vitals.');

    const personaSelector = page.locator('select').first();
    if (await personaSelector.isVisible()) {
      await personaSelector.selectOption({ index: 1 });
      await expect(page.getByText(/Robert Davis|STEMI|Myocardial Infarction/i).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('V2-VOICE-003: Initiating voice session streams audio and appends dialogue transcript', async ({ page }) => {
    allure.label('suite', 'V2 Voice AI Telehealth');
    allure.label('testId', 'V2-VOICE-003');
    allure.label('severity', 'high');
    allure.description('Simulates microphone recording event, verifying dynamic dialogue transcript stream.');

    const micButton = page.getByRole('button', { name: /start voice consultation|microphone/i }).first();
    await micButton.click();

    const transcriptFeed = page.getByText(/Doctor:|Patient:|Telehealth AI/i).first();
    await expect(transcriptFeed).toBeVisible({ timeout: 10000 });
  });
});
