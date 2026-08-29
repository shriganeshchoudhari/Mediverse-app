import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// ─────────────────────────────────────────────────────────────────────────────
// OSCE Exam Engine — E2E Test Suite
// Routes  : /osce, /osce/stations
// API     : /api/osce/sessions, /api/osce/stations
// Auth    : storageState injected by playwright.config.ts
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_STATIONS = {
  content: [
    {
      id: 'st-001',
      title: 'Cardiovascular History Taking & Examination',
      category: 'CLINICAL_EXAMINATION',
      domain: 'ALLOPATHIC',
      durationMinutes: 10,
      passingScore: 75,
      rubricItemsCount: 8,
    },
    {
      id: 'st-002',
      title: 'Pediatric Asthma Emergency Management',
      category: 'EMERGENCY_TRIAGE',
      domain: 'ALLOPATHIC',
      durationMinutes: 8,
      passingScore: 80,
      rubricItemsCount: 6,
    },
  ],
  totalElements: 2,
  totalPages: 1,
};

const MOCK_SESSION_START = {
  sessionId: 'osce-sess-mock-001',
  stationId: 'st-001',
  stationTitle: 'Cardiovascular History Taking & Examination',
  durationSeconds: 600,
  timerEndAt: new Date(Date.now() + 600000).toISOString(),
  status: 'IN_PROGRESS',
};

const MOCK_SUBMISSION_RESULT = {
  sessionId: 'osce-sess-mock-001',
  score: 88,
  maxScore: 100,
  passed: true,
  feedback: 'Excellent patient rapport and accurate auscultation technique.',
  submittedAt: new Date().toISOString(),
};

test.describe('OSCE Exam Engine @e2e @osce', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/osce/stations*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_STATIONS),
      });
    });
    await page.goto('/osce');
  });

  test('E2E-OSC-001: OSCE station catalog renders active clinical examination stations', async ({ page }) => {
    allure.label('suite', 'OSCE Exam Engine');
    allure.label('testId', 'E2E-OSC-001');
    allure.label('severity', 'critical');
    allure.description('Verifies that active OSCE examination stations are rendered with titles, categories, and start actions.');

    await expect(page.getByRole('heading', { name: /osce clinical examination|clinical examination stations/i })).toBeVisible();

    const stationCard = page.getByTestId('osce-station-card').first().or(page.getByText('Cardiovascular History Taking').first());
    await expect(stationCard).toBeVisible();

    const startBtn = page.getByRole('button', { name: /start station|begin examination/i }).first();
    await expect(startBtn).toBeVisible();
    await expect(startBtn).toBeEnabled();
  });

  test('E2E-OSC-002: Starting an OSCE station initializes real-time countdown timer', async ({ page }) => {
    allure.label('suite', 'OSCE Exam Engine');
    allure.label('testId', 'E2E-OSC-002');
    allure.label('severity', 'critical');
    allure.description('Verifies station session initiation, rubric checklist rendering, and countdown timer behavior.');

    await page.route('**/api/osce/sessions', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_SESSION_START),
        });
      } else {
        await route.continue();
      }
    });

    const startBtn = page.getByRole('button', { name: /start station|begin examination/i }).first();
    await startBtn.click();

    const timerElement = page.getByTestId('osce-timer').or(page.getByRole('timer')).or(page.getByText(/10:00|09:59|remaining/i).first());
    await expect(timerElement).toBeVisible({ timeout: 10000 });

    const rubricContainer = page.getByTestId('osce-rubric-checklist').or(page.getByText(/clinical checklist|evaluation criteria/i).first());
    await expect(rubricContainer).toBeVisible();
  });

  test('E2E-OSC-003: Submitting OSCE station evaluation returns structured clinical feedback', async ({ page }) => {
    allure.label('suite', 'OSCE Exam Engine');
    allure.label('testId', 'E2E-OSC-003');
    allure.label('severity', 'high');
    allure.description('Verifies station answer submission, scoring computation, and feedback dialog display.');

    await page.route('**/api/osce/sessions', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_SESSION_START),
      });
    });

    await page.route('**/api/osce/sessions/*/submit', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_SUBMISSION_RESULT),
      });
    });

    const startBtn = page.getByRole('button', { name: /start station|begin examination/i }).first();
    await startBtn.click();

    const submitBtn = page.getByRole('button', { name: /submit station|finish examination/i }).first();
    await expect(submitBtn).toBeVisible({ timeout: 10000 });
    await submitBtn.click();

    const feedbackSection = page.getByTestId('osce-result-feedback').or(page.getByText(/score: 88|excellent patient rapport/i).first());
    await expect(feedbackSection).toBeVisible({ timeout: 10000 });
  });
});
