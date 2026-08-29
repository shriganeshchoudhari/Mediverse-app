import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Authentication Smoke Suite @smoke @critical', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo('/login');
  });

  test('UI-AUTH-001: Patient can login with valid credentials', async ({ page }) => {
    await loginPage.login(
      process.env.PATIENT_EMAIL || 'patient.test@mediverse.org',
      process.env.PATIENT_PASSWORD || 'Mediverse2026!'
    );
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.verifyDashboardLoaded();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('UI-AUTH-002: Invalid login displays error notification', async () => {
    await loginPage.login('invalid.user@mediverse.org', 'WrongPassword123!');
    await loginPage.verifyLoginError('Invalid credentials');
  });
});
