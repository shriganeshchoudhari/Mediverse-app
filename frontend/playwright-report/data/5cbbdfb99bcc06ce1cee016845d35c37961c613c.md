# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 14_cms_curriculum_authoring.spec.ts >> SPEC 14: CMS Lesson Editor & Taxonomy Tree >> CMS-001 & CMS-002: Curriculum Anchor Modal Workflow
- Location: e2e\specs\14_cms_curriculum_authoring.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/cms/editor
Call log:
  - navigating to "http://127.0.0.1:3000/cms/editor", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('SPEC 14: CMS Lesson Editor & Taxonomy Tree', () => {
  4  |   test('CMS-001 & CMS-002: Curriculum Anchor Modal Workflow', async ({ page }) => {
  5  |     // Navigate to CMS Editor
> 6  |     await page.goto('/cms/editor');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/cms/editor
  7  | 
  8  |     // Verify metadata section is visible
  9  |     await expect(page.getByText('1. Lesson Metadata')).toBeVisible();
  10 | 
  11 |     // Click the new Curriculum Anchor button
  12 |     const anchorButton = page.getByRole('button', { name: /Link Curriculum Concept/i });
  13 |     if (await anchorButton.isVisible()) {
  14 |         await anchorButton.click();
  15 |     } else {
  16 |         // Fallback in case the button text is different
  17 |         await page.getByText('Anchor to Curriculum').click();
  18 |     }
  19 | 
  20 |     // Verify the modal appears
  21 |     const modal = page.locator('.fixed.inset-0.z-50');
  22 |     await expect(modal).toBeVisible();
  23 | 
  24 |     // Verify the subject list fetches (or at least the modal header is visible)
  25 |     await expect(page.getByText('Select Curriculum Target')).toBeVisible();
  26 | 
  27 |     // Close the modal
  28 |     await page.getByRole('button', { name: 'Close' }).click();
  29 |     await expect(modal).not.toBeVisible();
  30 |   });
  31 | });
  32 | 
```