import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Production Synthetic Heartbeat @synthetic', () => {
  test('SYNTH-001: Health check & synthetic user login latency probe', async ({ page }) => {
    const startTime = Date.now();
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateTo('/login');
    await expect(loginPage.emailInput).toBeVisible({ timeout: 5000 });
    
    const loadDuration = Date.now() - startTime;
    expect(loadDuration).toBeLessThan(3000); // Latency SLA < 3000ms
  });
});
