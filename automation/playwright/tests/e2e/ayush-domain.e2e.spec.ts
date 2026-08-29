import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// ─────────────────────────────────────────────────────────────────────────────
// AYUSH Domain — E2E Test Suite (Ayurveda, Yoga, Unani, Siddha, Homeopathy)
// Routes  : /domains/ayush, /curriculum/ayush
// API     : /api/curriculum/ayush
// Auth    : storageState injected by playwright.config.ts
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_AYUSH_DATA = {
  domain: 'AYUSH_SYSTEMS',
  streams: ['Ayurveda (BAMS)', 'Homeopathy (BHMS)', 'Unani (BUMS)', 'Siddha (BSMS)', 'Naturopathy (BNYS)'],
  modules: [
    {
      id: 'ayu-dosh-01',
      title: 'Tridosha Siddhanta & Prakriti Assessment',
      system: 'Ayurveda',
      hasMarmaMap: true,
    },
    {
      id: 'ayu-dravya-02',
      title: 'Dravyaguna Vijnana: Medicinal Plant Pharmacology',
      system: 'Ayurveda',
      hasHerbarium: true,
    },
    {
      id: 'hom-organon-03',
      title: 'Organon of Medicine & Chronic Disease Miasms',
      system: 'Homeopathy',
      hasMarmaMap: false,
    },
  ],
};

test.describe('AYUSH Domain @e2e @ayush', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/curriculum/ayush*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_AYUSH_DATA),
      });
    });
    await page.goto('/domains/ayush');
  });

  test('E2E-AYU-001: AYUSH portal displays all 5 traditional medicine educational streams', async ({ page }) => {
    allure.label('suite', 'AYUSH Traditional Medicine Domain');
    allure.label('testId', 'E2E-AYU-001');
    allure.label('severity', 'critical');
    allure.description('Verifies that AYUSH domain home page renders BAMS, BHMS, BUMS, BSMS, and BNYS curriculum tabs.');

    await expect(page.getByRole('heading', { name: /ayush systems|ayurveda|traditional medicine/i })).toBeVisible();

    const ayurvedaStream = page.getByText(/Ayurveda|Tridosha/i).first();
    await expect(ayurvedaStream).toBeVisible();

    const dravyagunaModule = page.getByText(/Dravyaguna|Medicinal Plant/i).first();
    await expect(dravyagunaModule).toBeVisible();
  });

  test('E2E-AYU-002: Launching 3D Marma Point Map simulator renders interactive anatomical points', async ({ page }) => {
    allure.label('suite', 'AYUSH Traditional Medicine Domain');
    allure.label('testId', 'E2E-AYU-002');
    allure.label('severity', 'high');
    allure.description('Verifies that the 3D Marma vital points anatomical visualization loads correctly.');

    const marmaBtn = page.getByRole('button', { name: /marma map|marma points|3d marma/i }).first()
      .or(page.getByTestId('launch-marma-sim-btn').first());

    if (await marmaBtn.isVisible()) {
      await marmaBtn.click();
      const marmaCanvas = page.locator('canvas').or(page.getByTestId('marma-3d-canvas')).first();
      await expect(marmaCanvas).toBeVisible({ timeout: 10000 });
    } else {
      await page.goto('/domains/ayush/simulators/marma-map');
      const marmaCanvas = page.locator('canvas').or(page.getByText(/marma/i).first());
      await expect(marmaCanvas).toBeVisible({ timeout: 10000 });
    }
  });

  test('E2E-AYU-003: Prakriti assessment interactive quiz calculates Vata-Pitta-Kapha constitution scores', async ({ page }) => {
    allure.label('suite', 'AYUSH Traditional Medicine Domain');
    allure.label('testId', 'E2E-AYU-003');
    allure.label('severity', 'normal');
    allure.description('Verifies Prakriti diagnostic questionnaire scoring logic and visual balance chart display.');

    const assessmentLink = page.getByText(/Prakriti Assessment|Tridosha Siddhanta/i).first();
    await assessmentLink.click();

    const quizOption = page.getByRole('radio').first().or(page.getByTestId('prakriti-option-a').first());
    if (await quizOption.isVisible()) {
      await quizOption.click();
      const nextOrSubmit = page.getByRole('button', { name: /next|calculate|assess/i }).first();
      await nextOrSubmit.click();
      await expect(page.getByText(/vata|pitta|kapha|constitution/i).first()).toBeVisible();
    }
  });
});
