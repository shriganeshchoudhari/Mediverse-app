import { test, expect } from '@playwright/test';

test.describe('SPEC 10: Domain 8 — Veterinary Sciences (BVSc & AH / MVSc)', () => {
  test('VET-001: BVSc & AH Undergraduate Veterinary Curriculum Portal', async ({ page }) => {
    await page.goto('/healthcare/veterinary/bvsc');
    await expect(page.locator('h1, h2').first()).toContainText(/Veterinary|BVSc/i);
    await expect(page.getByText(/Veterinary Anatomy|Physiology|Pathology|Surgery|Pharmacology/i).first()).toBeVisible();
  });

  test('VET-003: 3D Comparative Anatomy Explorer (Bovine vs Equine vs Canine)', async ({ page }) => {
    await page.goto('/healthcare/veterinary/comparative-anatomy');
    await expect(page.locator('h1, h2').first()).toContainText(/Comparative Anatomy|Anatomy/i);
  });

  test('VET-004: Zoonotic Disease Spillover & One Health Dynamic Model', async ({ page }) => {
    await page.goto('/healthcare/veterinary/zoonotic-spillover');
    await expect(page.locator('h1, h2').first()).toContainText(/Zoonotic|Spillover|One Health/i);
  });

  test('VET-005: Ruminant Digestive Physiology & SARA Risk Modeling', async ({ page }) => {
    await page.goto('/healthcare/veterinary/ruminant-physiology');
    await expect(page.locator('h1, h2').first()).toContainText(/Ruminant|Digestion|Physiology/i);
  });
});
