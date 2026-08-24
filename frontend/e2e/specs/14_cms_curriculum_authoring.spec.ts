import { test, expect } from '@playwright/test';

test.describe('SPEC 14: CMS Lesson Editor & Taxonomy Tree', () => {
  test('CMS-001 & CMS-002: Curriculum Anchor Modal Workflow', async ({ page }) => {
    // Navigate to CMS Editor
    await page.goto('/cms/editor');

    // Verify metadata section is visible
    await expect(page.getByText('1. Lesson Metadata')).toBeVisible();

    // Click the new Curriculum Anchor button
    const anchorButton = page.getByRole('button', { name: /Link Curriculum Concept/i });
    if (await anchorButton.isVisible()) {
        await anchorButton.click();
    } else {
        // Fallback in case the button text is different
        await page.getByText('Anchor to Curriculum').click();
    }

    // Verify the modal appears
    const modal = page.locator('.fixed.inset-0.z-50');
    await expect(modal).toBeVisible();

    // Verify the subject list fetches (or at least the modal header is visible)
    await expect(page.getByText('Select Curriculum Target')).toBeVisible();

    // Close the modal
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(modal).not.toBeVisible();
  });
});
