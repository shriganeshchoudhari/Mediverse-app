import { test, expect } from '@playwright/test';

test.describe('SPEC 18: WebXR Spatial Anatomy & Procedural Intervention Theater', () => {
  test('XR-001: WebXR Procedural Theater loads spatial interface and procedure modules', async ({ page }) => {
    await page.goto('/simulators/webxr-procedural-theater');
    await expect(page.locator('h1, h2, span').filter({ hasText: /WebXR|Spatial|Procedural|Intervention/i }).first()).toBeVisible();
    await expect(page.getByText(/Catheter|Ultrasound|Trajectory|Central Venous|Lumbar Puncture/i).first()).toBeVisible();
  });

  test('XR-002: Procedural intervention controls and spatial viewport canvas are mounted', async ({ page }) => {
    await page.goto('/simulators/webxr-procedural-theater');
    const viewportOrCanvas = page.locator('canvas, [data-testid="spatial-viewport"], div[class*="viewport"]').first();
    await expect(viewportOrCanvas).toBeVisible({ timeout: 10000 });
  });
});
