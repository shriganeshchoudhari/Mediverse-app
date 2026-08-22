import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly programBadge: Locator;
  readonly switchProgramBtn: Locator;
  readonly pomodoroStartBtn: Locator;
  readonly domainTabs: Locator;

  constructor(page: Page) {
    super(page);
    this.programBadge = page.locator('span:has-text("Program:"), span:has-text("MBBS")').first();
    this.switchProgramBtn = page.locator('button:has-text("Switch Program")').first();
    this.pomodoroStartBtn = page.locator('button:has-text("Start")').first();
    this.domainTabs = page.locator('button:has-text("AYUSH"), button:has-text("Dental")');
  }

  async switchProgram(programCode: string) {
    if (await this.switchProgramBtn.isVisible()) {
      await this.switchProgramBtn.click();
      const option = this.page.locator(`button:has-text("${programCode}")`).first();
      if (await option.isVisible()) await option.click();
    }
  }
}
