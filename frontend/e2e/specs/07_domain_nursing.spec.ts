import { test, expect } from '@playwright/test';

test.describe('SPEC 07: Domain 5 — Nursing Sciences (B.Sc / M.Sc Nursing)', () => {
  test('NURS-001 & NURS-003: Nursing portal and NEWS2 Deterioration Score', async ({ page }) => {
    await page.goto('/healthcare/nursing/news2-escalation');
    await expect(page.locator('h1, h2').first()).toContainText(/NEWS2|Escalation/i);
  });
});
