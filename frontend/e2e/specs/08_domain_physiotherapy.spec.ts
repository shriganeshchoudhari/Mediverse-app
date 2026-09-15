import { test, expect } from '@playwright/test';

test.describe('SPEC 08: Domain 6 — Physiotherapy (BPT / MPT)', () => {
  test('PT-001: BPT Undergraduate Physiotherapy Curriculum Portal', async ({ page }) => {
    await page.goto('/healthcare/physiotherapy/bpt');
    await expect(page.locator('h1, h2').first()).toContainText(/Physiotherapy|BPT/i);
    await expect(page.getByText(/Kinesiology|Biomechanics|Exercise Therapy|Orthopedics/i).first()).toBeVisible();
  });

  test('PT-003: Gait Cycle & Pathological Gait Analysis Simulator', async ({ page }) => {
    await page.goto('/healthcare/physiotherapy/gait-analysis');
    await expect(page.locator('h1, h2').first()).toContainText(/Gait/i);
  });

  test('PT-004: Joint Biomechanics & Instantaneous Center of Rotation (ICR)', async ({ page }) => {
    await page.goto('/healthcare/physiotherapy/joint-biomechanics');
    await expect(page.locator('h1, h2').first()).toContainText(/Biomechanics|Joint/i);
  });

  test('PT-006: Musculoskeletal Special Tests Registry (Lachman, McMurray, Hawkins-Kennedy)', async ({ page }) => {
    await page.goto('/healthcare/physiotherapy/special-tests');
    await expect(page.locator('h1, h2').first()).toContainText(/Special Tests|Orthopedic|Clinical/i);
  });
});
