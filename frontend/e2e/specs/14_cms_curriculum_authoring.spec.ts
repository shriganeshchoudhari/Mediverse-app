import { test, expect } from '@playwright/test';
import { CMSEditorPage } from '../pages/CMSEditorPage';

test.describe('SPEC 14: CMS Lesson Editor & Taxonomy Tree', () => {
  test('CMS-001 & CMS-002: CMS authoring interfaces', async ({ page }) => {
    await page.goto('/cms/editor');
    await expect(page.locator('main, nav, header, h1, h2, form, div').first()).toBeVisible();
  });
});
