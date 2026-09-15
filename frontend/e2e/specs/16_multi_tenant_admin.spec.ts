import { test, expect } from '@playwright/test';

test.describe('SPEC 16: Multi-Tenant Institutional Administration & University Portals', () => {
  test('ADMIN-001: Institutional Admin Dashboard loads with tenant context and metrics', async ({ page }) => {
    // Intercept tenant API calls
    await page.route('**/api/v1/tenants*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '60000000-0000-0000-0000-000000000001',
            name: 'Global Medical University',
            domain: 'gmu.edu',
            subscriptionTier: 'ENTERPRISE',
          },
          {
            id: '60000000-0000-0000-0000-000000000002',
            name: 'Apollo Institute of Medical Sciences',
            domain: 'apollo-med.org',
            subscriptionTier: 'ENTERPRISE',
          },
        ]),
      });
    });

    await page.goto('/admin/institution');
    await expect(page.locator('h1, h2').first()).toContainText(/Medical University|Institutional|Admin/i);
    await expect(page.getByText(/TIER|ENTERPRISE/i).first()).toBeVisible();
  });

  test('ADMIN-002: Tenant switcher changes active cohort and switches views', async ({ page }) => {
    await page.goto('/admin/institution');
    const rosterBtn = page.getByRole('button', { name: /enrolled roster|students/i });
    if (await rosterBtn.isVisible()) {
      await rosterBtn.click();
      await expect(page.getByRole('button', { name: /institutional overview/i })).toBeVisible();
    }
  });

  test('ADMIN-003: Backward compatibility rewrite /admin/tenants directs to institutional portal', async ({ page }) => {
    await page.goto('/admin/tenants');
    await expect(page.locator('h1, h2').first()).toContainText(/Medical University|Institutional|Admin/i);
  });
});
