import { test, expect } from '@playwright/test';

test.describe('SPEC 03: Domain 1 — Allopathic Medicine (MBBS / MD / MS)', () => {
  test('ALLO-001: MBBS curriculum portal renders professional phases', async ({ page }) => {
    // Navigate to the master platform dynamic route for a subject
    await page.goto('/healthcare/ALLOPATHIC/MBBS/cardiovascular');
    
    // The subject header should be visible
    await expect(page.getByText(/MBBS/i)).toBeVisible();
    await expect(page.getByText(/cardiovascular/i)).toBeVisible();

    // Verify the curriculum tabs are present
    await expect(page.getByRole('tab', { name: /Curriculum Syllabus/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Analytics & Progress/i })).toBeVisible();
  });
});
