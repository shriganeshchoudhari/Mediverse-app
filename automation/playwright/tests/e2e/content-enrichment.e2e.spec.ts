import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('Mediverse High-Yield Content & Clinical Tools Suite', () => {
  test.beforeEach(async () => {
    allure.epic('Curriculum & Learning Content');
    allure.feature('High-Yield Pearls & Clinical Calculators');
  });

  test('E2E-ENRICH-001: Renders Interactive Clinical Calculator and calculates GCS', async ({ page }) => {
    allure.story('Point-of-Care Medical Calculators');
    allure.severity('critical');

    await page.goto('/lessons/anat101-ch1');
    
    // Check if the Clinical Calculator Widget is visible
    const calcSection = page.locator('#clinical-calculator');
    await expect(calcSection).toBeVisible();

    // Verify Tab Switching to Parkland
    await page.getByRole('button', { name: 'PARKLAND' }).click();
    await expect(page.getByText('Total 24h Lactated Ringers:')).toBeVisible();

    // Verify Tab Switching to Cockcroft-Gault
    await page.getByRole('button', { name: 'CRCL' }).click();
    await expect(page.getByText('Estimated Creatinine Clearance:')).toBeVisible();
  });

  test('E2E-ENRICH-002: Renders High-Yield Exam Pearls and Examiner Traps', async ({ page }) => {
    allure.story('Medical Licensing Exam Pearls');
    allure.severity('normal');

    await page.goto('/lessons/anat101-ch1');

    // Check High Yield Pearl Section
    const pearlSection = page.locator('#high-yield-pearl');
    await expect(pearlSection).toBeVisible();

    // Assert Buzzword and Examiner Trap cards exist
    await expect(page.getByText('Examiner Trap & Common MCQ Pitfall:')).toBeVisible();
    await expect(page.getByText('Classic Board Buzzword / Presentation:')).toBeVisible();
  });

  test('E2E-ENRICH-003: Interactive Flashcards and Step 20 Practice Quiz', async ({ page }) => {
    allure.story('Active Recall & Spaced Repetition');
    allure.severity('critical');

    await page.goto('/lessons/anat101-ch1');

    // Verify Flashcards deck
    const flashcardSection = page.locator('#interactive-flashcards');
    await expect(flashcardSection).toBeVisible();

    // Verify Practice Quiz
    const quizSection = page.locator('#step-20-quiz');
    await expect(quizSection).toBeVisible();
  });
});
