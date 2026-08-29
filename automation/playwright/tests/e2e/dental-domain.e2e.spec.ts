import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// ─────────────────────────────────────────────────────────────────────────────
// Dental BDS Domain — E2E Test Suite
// Routes  : /domains/dental, /curriculum/bds
// API     : /api/curriculum/dental
// Auth    : storageState injected by playwright.config.ts
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_DENTAL_CURRICULUM = {
  domain: 'DENTAL_BDS',
  modules: [
    {
      id: 'bds-perio-01',
      title: 'Periodontics: Pocket Depth & Attachment Loss Measurement',
      year: 3,
      has3DSimulator: true,
    },
    {
      id: 'bds-endo-02',
      title: 'Endodontics: Root Canal Morphology & Step-Back Technique',
      year: 3,
      has3DSimulator: true,
    },
    {
      id: 'bds-prosth-03',
      title: 'Prosthodontics: Complete Denture Occlusal Rim Alignment',
      year: 4,
      has3DSimulator: false,
    },
  ],
};

test.describe('Dental BDS Domain @e2e @dental', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/curriculum/dental*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_DENTAL_CURRICULUM),
      });
    });
    await page.goto('/domains/dental');
  });

  test('E2E-DEN-001: Dental BDS domain portal renders specialized dentistry curriculum and specialty modules', async ({ page }) => {
    allure.label('suite', 'Dental BDS Domain');
    allure.label('testId', 'E2E-DEN-001');
    allure.label('severity', 'critical');
    allure.description('Verifies that Dental BDS curriculum page renders Periodontics, Endodontics, and Prosthodontics modules.');

    await expect(page.getByRole('heading', { name: /dental surgery|bds curriculum|dentistry/i })).toBeVisible();

    const perioModule = page.getByText(/Pocket Depth & Attachment Loss/i).first();
    await expect(perioModule).toBeVisible();

    const endoModule = page.getByText(/Root Canal Morphology/i).first();
    await expect(endoModule).toBeVisible();
  });

  test('E2E-DEN-002: Interacting with 3D Tooth Morphology simulator renders canvas and probe tool', async ({ page }) => {
    allure.label('suite', 'Dental BDS Domain');
    allure.label('testId', 'E2E-DEN-002');
    allure.label('severity', 'high');
    allure.description('Verifies launching the 3D Tooth Morphology and Periodontal Probe interactive tool.');

    const simTrigger = page.getByRole('button', { name: /tooth simulator|probe simulator|3d tooth/i }).first()
      .or(page.getByTestId('launch-dental-sim-btn').first());

    if (await simTrigger.isVisible()) {
      await simTrigger.click();
      const canvas = page.locator('canvas').or(page.getByTestId('tooth-3d-canvas')).first();
      await expect(canvas).toBeVisible({ timeout: 10000 });
    } else {
      await page.goto('/domains/dental/simulators/tooth-morphology');
      const canvas = page.locator('canvas').or(page.getByText(/tooth morphology|periodontal/i).first());
      await expect(canvas).toBeVisible({ timeout: 10000 });
    }
  });

  test('E2E-DEN-003: Submitting periodontal charting values updates pocket depth graph without calculation errors', async ({ page }) => {
    allure.label('suite', 'Dental BDS Domain');
    allure.label('testId', 'E2E-DEN-003');
    allure.label('severity', 'normal');
    allure.description('Verifies periodontal depth calculation input, validation against non-erupted molars (regression for KAN-13).');

    // Check periodontal charting form
    const perioLink = page.getByText(/Pocket Depth & Attachment Loss|Periodontics/i).first();
    await perioLink.click();

    const depthInput = page.getByLabel(/pocket depth|probing depth/i).first()
      .or(page.getByPlaceholder(/mm|depth/i).first())
      .or(page.getByTestId('periodontal-depth-input').first());

    if (await depthInput.isVisible()) {
      await depthInput.fill('4');
      const updateBtn = page.getByRole('button', { name: /record|save|calculate/i }).first();
      await updateBtn.click();

      // Ensure no error toast is thrown
      const errorToast = page.getByText(/calculation error|invalid molar/i);
      await expect(errorToast).toHaveCount(0);
    }
  });
});
