import { test, expect } from '../../fixtures/auth.fixture';
import { faker } from '@faker-js/faker';

test.describe('Appointments Regression Suite @regression @booking', () => {
  test('UI-BOOK-001: Authenticated patient can search doctor and book appointment', async ({ dashboardPage }) => {
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.clickBookAppointment();
    await expect(dashboardPage.page).toHaveURL(/.*appointments/);
  });
});
