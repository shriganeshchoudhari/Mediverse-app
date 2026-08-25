import { test, expect } from '../fixtures/auth.fixture';

test.describe('SPEC 14: CMS Lesson Editor & Taxonomy Tree', () => {
  test('CMS-001 & CMS-002: Curriculum Anchor Modal Workflow', async ({ adminPage: page }) => {
    // Navigate to CMS Editor as authenticated admin
    await page.goto('/cms/editor');

    // Verify metadata section is visible
    await expect(page.getByText('1. Lesson Metadata')).toBeVisible();

    // Click the Curriculum Anchor button
    await page.getByText(/Select Canonical Concept to Anchor Lesson/i).click();

    // Verify the modal appears
    const modal = page.locator('.fixed.inset-0.z-50');
    await expect(modal).toBeVisible();

    // Verify the modal header is visible
    await expect(page.getByText('Curriculum Anchor Selection')).toBeVisible();

    // Close the modal via close button
    await modal.locator('button').first().click();
    await expect(modal).not.toBeVisible();
  });
});
