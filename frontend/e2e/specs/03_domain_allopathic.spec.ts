import { test, expect } from '@playwright/test';
import { DomainCurriculumPage } from '../pages/DomainCurriculumPage';

test.describe('SPEC 03: Domain 1 — Allopathic Medicine (MBBS / MD / MS)', () => {
  test('ALLO-001: MBBS curriculum portal renders professional phases', async ({ page }) => {
    const curr = new DomainCurriculumPage(page);
    await page.goto('/healthcare/allopathic');
    await expect(curr.heading).toContainText(/Medicine|Allopathic/i);
  });

  test('ALLO-005: Cardiac Cycle Simulator and ECG waveform interactives', async ({ page }) => {
    await page.goto('/simulators/cardiac-cycle');
    await expect(page.locator('h1, h2').first()).toContainText(/Cardiac|Cycle|Heart|Wiggers/i);
  });
});
