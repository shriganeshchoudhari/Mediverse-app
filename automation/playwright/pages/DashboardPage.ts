import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly welcomeHeader: Locator;
  readonly browseSyllabusLink: Locator;
  readonly changeProgramLink: Locator;
  readonly xpCard: Locator;
  readonly streakCard: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeader = page.getByRole('heading', { level: 1 });
    this.browseSyllabusLink = page.getByRole('link', { name: /browse syllabus/i });
    this.changeProgramLink = page.getByRole('link', { name: /change program/i });
    this.xpCard = page.getByText(/total experience/i);
    this.streakCard = page.getByText(/daily streak/i);
  }

  async verifyDashboardLoaded(): Promise<void> {
    await expect(this.welcomeHeader).toBeVisible();
  }

  async clickBrowseSyllabus(): Promise<void> {
    await this.browseSyllabusLink.click();
  }
}
