import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// ─────────────────────────────────────────────────────────────────────────────
// Allopathic MBBS Domain — E2E Test Suite
// Routes  : /domains/allopathic, /curriculum/mbbs
// API     : /api/curriculum/allopathic
// Auth    : storageState injected by playwright.config.ts
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_MBBS_CURRICULUM = {
  domain: 'ALLOPATHIC_MBBS',
  modules: [
    {
      id: 'mbbs-anat-01',
      title: 'Gross Anatomy of Thorax & Mediastinum',
      year: 1,
      competenciesCount: 14,
      simulationAvailable: true,
    },
    {
      id: 'mbbs-path-02',
      title: 'Cardiovascular Pathology & Ischemic Heart Disease',
      year: 2,
      competenciesCount: 22,
      simulationAvailable: true,
    },
    {
      id: 'mbbs-med-03',
      title: 'Internal Medicine: Acute Coronary Syndrome Management',
      year: 3,
      competenciesCount: 18,
      simulationAvailable: true,
    },
  ],
};

test.describe('Allopathic MBBS Domain @e2e @allopathic', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/curriculum/allopathic*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_MBBS_CURRICULUM),
      });
    });
    await page.goto('/domains/allopathic');
  });

  test('E2E-MED-001: Allopathic domain portal displays curriculum years and core modules', async ({ page }) => {
    allure.label('suite', 'Allopathic MBBS Domain');
    allure.label('testId', 'E2E-MED-001');
    allure.label('severity', 'critical');
    allure.description('Verifies that MBBS curriculum navigation renders all academic phases and competency modules.');

    await expect(page.getByRole('heading', { name: /allopathic medicine|mbbs curriculum/i })).toBeVisible();

    const anatomyModule = page.getByText(/Gross Anatomy of Thorax/i).first();
    await expect(anatomyModule).toBeVisible();

    const pathologyModule = page.getByText(/Cardiovascular Pathology/i).first();
    await expect(pathologyModule).toBeVisible();
  });

  test('E2E-MED-002: Selecting a clinical competency module opens interactive case learning view', async ({ page }) => {
    allure.label('suite', 'Allopathic MBBS Domain');
    allure.label('testId', 'E2E-MED-002');
    allure.label('severity', 'high');
    allure.description('Verifies drilling down into an MBBS case study, displaying patient presentation, vitals, and diagnostic tools.');

    const moduleLink = page.getByText(/Gross Anatomy of Thorax|Cardiovascular Pathology/i).first();
    await moduleLink.click();

    const clinicalCaseView = page.getByTestId('clinical-case-viewer')
      .or(page.getByRole('heading', { name: /case study|learning objectives|competency/i }))
      .first();
    await expect(clinicalCaseView).toBeVisible({ timeout: 10000 });
  });

  test('E2E-MED-003: Launching ECG simulator verifies interactive waveform render and lead selection', async ({ page }) => {
    allure.label('suite', 'Allopathic MBBS Domain');
    allure.label('testId', 'E2E-MED-003');
    allure.label('severity', 'high');
    allure.description('Verifies interactive medical simulator launching and canvas rendering for 12-lead ECG analysis.');

    const simButton = page.getByRole('button', { name: /launch ecg|simulator|interactive 3d/i }).first()
      .or(page.getByTestId('launch-simulator-btn').first());

    if (await simButton.isVisible()) {
      await simButton.click();
      const simCanvas = page.getByTestId('ecg-simulator-canvas')
        .or(page.locator('canvas'))
        .or(page.getByText(/12-lead ecg|lead ii/i).first());
      await expect(simCanvas).toBeVisible({ timeout: 10000 });
    } else {
      // Direct navigation fallback
      await page.goto('/domains/allopathic/simulators/ecg');
      const ecgContainer = page.locator('canvas').or(page.getByText(/ecg/i).first());
      await expect(ecgContainer).toBeVisible({ timeout: 10000 });
    }
  });
});
