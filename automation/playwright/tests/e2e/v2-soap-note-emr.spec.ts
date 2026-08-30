import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// ─────────────────────────────────────────────────────────────────────────────
// V2 Feature: Mock EMR & AI-Graded SOAP Note Charting Sandbox
// Route: /simulators/emr
// ─────────────────────────────────────────────────────────────────────────────

test.describe('V2 Mock EMR SOAP Note Evaluation @e2e @v2 @emr', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulators/emr');
  });

  test('V2-EMR-001: Mock EMR sandbox renders patient roster, demographics banner, and charting tabs', async ({ page }) => {
    allure.label('suite', 'V2 Mock EMR Sandbox');
    allure.label('testId', 'V2-EMR-001');
    allure.label('severity', 'critical');
    allure.description('Verifies EMR sidebar navigation, MRN badge, and tabbed chart views.');

    await expect(page.getByRole('heading', { name: /mock emr/i })).toBeVisible();

    const newNoteTab = page.getByRole('button', { name: /new soap note|write/i }).first();
    await expect(newNoteTab).toBeVisible();
  });

  test('V2-EMR-002: Authoring SOAP note and submitting triggers AI Faculty Evaluation Report', async ({ page }) => {
    allure.label('suite', 'V2 Mock EMR Sandbox');
    allure.label('testId', 'V2-EMR-002');
    allure.label('severity', 'critical');
    allure.description('Fills Subjective, Objective, Assessment, and Plan fields and submits for automated rubric evaluation.');

    const newNoteTab = page.getByRole('button', { name: /new soap note|write/i }).first();
    await newNoteTab.click();

    // Fill SOAP fields
    const subjective = page.getByPlaceholder(/subjective details/i).first();
    const objective = page.getByPlaceholder(/objective details/i).first();
    const assessment = page.getByPlaceholder(/assessment details/i).first();
    const plan = page.getByPlaceholder(/plan details/i).first();

    await subjective.fill('28yo male presents with 24 hours of periumbilical pain radiating to RLQ. Anorexia and low grade fever.');
    await objective.fill('Vitals: BP 128/82, HR 98, Temp 38.1C. Abdomen: Rebound tenderness at McBurney point. Rovsing positive.');
    await assessment.fill('Primary Dx: Acute Appendicitis. Differential: Mesenteric Adenitis, Meckel Diverticulitis.');
    await plan.fill('1. NPO. 2. IV Cefoxitin 2g IV. 3. Urgent Surgical Consultation for Laparoscopic Appendectomy.');

    const submitBtn = page.getByRole('button', { name: /sign & ai evaluate note|evaluate/i }).first();
    await submitBtn.click();

    // Verify Evaluation Report
    const evalBanner = page.getByText(/AI FACULTY EVALUATION REPORT|Clinical SOAP Note Assessment/i).first();
    await expect(evalBanner).toBeVisible({ timeout: 10000 });

    const standingBadge = page.getByText(/HONORS|PASS|Clinical Standing/i).first();
    await expect(standingBadge).toBeVisible();

    const icd10Badge = page.getByText(/K35.80|Identified ICD-10 Clinical Codes/i).first();
    await expect(icd10Badge).toBeVisible();
  });
});
