import { test as base, Page } from '@playwright/test';

export interface AuthFixtures {
  authenticatedPage: Page;
  adminPage: Page;
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/auth/login');
    await page.evaluate(() => {
      localStorage.setItem('token', 'mock-jwt-student-token-2026');
      localStorage.setItem('user', JSON.stringify({
        userId: 'student-e2e-01',
        email: 'student@mediverse.edu',
        firstName: 'Dr. Alex',
        lastName: 'Sharma',
        role: 'STUDENT',
        enrolledProgram: 'MBBS',
        healthcareDomain: 'ALLOPATHIC',
      }));
    });
    await page.goto('/dashboard');
    await use(page);
  },

  adminPage: async ({ page }, use) => {
    await page.goto('/auth/login');
    await page.evaluate(() => {
      localStorage.setItem('token', 'mock-jwt-admin-token-2026');
      localStorage.setItem('user', JSON.stringify({
        userId: 'admin-e2e-01',
        email: 'admin@mediverse.edu',
        firstName: 'Prof. Sarah',
        lastName: 'Vance',
        role: 'ADMIN',
        enrolledProgram: 'ALLOPATHIC',
        healthcareDomain: 'ALLOPATHIC',
      }));
    });
    await page.goto('/dashboard');
    await use(page);
  },
});

export { expect } from '@playwright/test';
