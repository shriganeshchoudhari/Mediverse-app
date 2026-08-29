import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

type AuthenticatedFixtures = {
  authenticatedPatientPage: Page;
  authenticatedDoctorPage: Page;
  dashboardPage: DashboardPage;
};

export const test = base.extend<AuthenticatedFixtures>({
  authenticatedPatientPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo('/login');
    await loginPage.login(
      process.env.PATIENT_EMAIL || 'patient.test@mediverse.org',
      process.env.PATIENT_PASSWORD || 'Mediverse2026!'
    );
    await expect(page).toHaveURL(/.*dashboard/);
    await use(page);
  },

  authenticatedDoctorPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo('/login');
    await loginPage.login(
      process.env.DOCTOR_EMAIL || 'doctor.test@mediverse.org',
      process.env.DOCTOR_PASSWORD || 'Mediverse2026!'
    );
    await expect(page).toHaveURL(/.*doctor/);
    await use(page);
  },

  dashboardPage: async ({ authenticatedPatientPage }, use) => {
    const dashboard = new DashboardPage(authenticatedPatientPage);
    await use(dashboard);
  },
});

export { expect };
