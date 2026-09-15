import { test, expect } from '@playwright/test';

test.describe('SPEC 07: Domain 5 — Nursing Sciences (B.Sc / M.Sc Nursing)', () => {
  test('NURS-001: B.Sc Nursing Indian Nursing Council (INC) Curriculum', async ({ page }) => {
    await page.goto('/healthcare/nursing/bscnursing');
    await expect(page.locator('h1, h2').first()).toContainText(/Nursing|B.Sc|INC/i);
    await expect(page.getByText(/Foundations of Nursing|Pharmacology|Medical-Surgical|Community/i).first()).toBeVisible();
  });

  test('NURS-003: NEWS2 Deterioration Score & Clinical Escalation Protocol', async ({ page }) => {
    await page.goto('/healthcare/nursing/news2-escalation');
    await expect(page.locator('h1, h2').first()).toContainText(/NEWS2|Escalation/i);
  });

  test('NURS-004: Braden Scale Pressure Injury & Wound Care Assessment', async ({ page }) => {
    await page.goto('/healthcare/nursing/braden-wound-care');
    await expect(page.locator('h1, h2').first()).toContainText(/Braden|Pressure|Wound/i);
  });

  test('NURS-005: IV Infusion & Drop Rate Calculation Station', async ({ page }) => {
    await page.goto('/healthcare/nursing/iv-drip-rate');
    await expect(page.locator('h1, h2').first()).toContainText(/IV|Infusion|Drip Rate/i);
  });
});
