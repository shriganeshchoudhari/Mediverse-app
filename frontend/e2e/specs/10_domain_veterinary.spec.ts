import { test, expect } from '@playwright/test';

test.describe('SPEC 10: Domain 8 — Veterinary Science (BVSc & AH / MVSc)', () => {
  test('VET-001 & VET-003: BVSc portal and Comparative Anatomy multi-species viewer', async ({ page }) => {
    await page.goto('/healthcare/veterinary/comparative-anatomy');
    await expect(page.locator('h1, h2').first()).toContainText(/Comparative.*Anatomy|Veterinary/i);
  });
});
