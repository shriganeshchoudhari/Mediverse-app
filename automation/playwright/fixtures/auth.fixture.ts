import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

type AuthenticatedFixtures = {
  authenticatedStudentPage: Page;
  authenticatedFacultyPage: Page;
  authenticatedPatientPage: Page;
  authenticatedDoctorPage: Page;
  dashboardPage: DashboardPage;
};

export const test = base.extend<AuthenticatedFixtures>({
  authenticatedStudentPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo('/auth/login');
    await loginPage.login(
      process.env.TEST_USER_EMAIL || process.env.STUDENT_EMAIL || 'student.test@mediverse.org',
      process.env.TEST_USER_PASSWORD || 'Mediverse2026!'
    );
    await expect(page).toHaveURL(/.*(dashboard|$)/);
    await use(page);
  },

  authenticatedFacultyPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo('/auth/login');
    await loginPage.login(
      process.env.FACULTY_EMAIL || 'faculty.test@mediverse.org',
      process.env.FACULTY_PASSWORD || 'Mediverse2026!'
    );
    await expect(page).toHaveURL(/.*(dashboard|faculty|$)/);
    await use(page);
  },

  authenticatedPatientPage: async ({ authenticatedStudentPage }, use) => {
    await use(authenticatedStudentPage);
  },

  authenticatedDoctorPage: async ({ authenticatedFacultyPage }, use) => {
    await use(authenticatedFacultyPage);
  },

  dashboardPage: async ({ authenticatedStudentPage }, use) => {
    const dashboard = new DashboardPage(authenticatedStudentPage);
    await use(dashboard);
  },
});

export { expect };
