import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Flashcards and Curriculum Progression Suite @regression @study', () => {
  test('UI-STUDY-001: Authenticated student can view dashboard and navigate to syllabus', async ({ dashboardPage }) => {
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.clickBrowseSyllabus();
    await expect(dashboardPage.page).toHaveURL(/.*subjects/);
  });

  test('UI-STUDY-002: Spaced repetition flashcards interface loads decks and active recall cards', async ({ authenticatedStudentPage: page }) => {
    await page.goto('/dashboard/flashcards');
    await expect(page.getByRole('heading', { name: /flashcards|active recall/i }).first()).toBeVisible();
  });
});
