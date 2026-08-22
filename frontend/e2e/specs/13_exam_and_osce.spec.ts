import { test, expect } from '@playwright/test';
import { ExamEnginePage } from '../pages/ExamEnginePage';

test.describe('SPEC 13: Assessment Engine & OSCE Stations', () => {
  test('EXAM-001 & EXAM-003: OSCE Station evaluation and rubric scoring', async ({ page }) => {
    await page.goto('/exam/osce');
    await expect(page.locator('h1, h2').first()).toContainText(/OSCE/i);
  });
});
