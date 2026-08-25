import { test, expect } from '@playwright/test';

test.describe('SPEC 03: Domain 1 — Allopathic Medicine (MBBS / MD / MS)', () => {
  test('ALLO-001: MBBS curriculum portal renders professional phases', async ({ page }) => {
    // Navigate to the master platform dynamic route for allopathic medicine
    await page.goto('/healthcare/allopathic');
    
    // The domain header and program tabs should be visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/MBBS/i).first()).toBeVisible();

    // Navigate to a subject syllabus by canonical code
    await page.goto('/healthcare/allopathic/mbbs/PHYS-101');
    await expect(page.getByRole('heading', { name: /Physiology/i }).first()).toBeVisible();
    await expect(page.getByText(/Syllabus Content/i)).toBeVisible();
  });
});
