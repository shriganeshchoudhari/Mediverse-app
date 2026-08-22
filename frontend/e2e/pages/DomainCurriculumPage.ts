import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DomainCurriculumPage extends BasePage {
  readonly heading: Locator;
  readonly yearTabs: Locator;
  readonly subjectCards: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1, h2').first();
    this.yearTabs = page.locator('button:has-text("Year"), button:has-text("Professional")');
    this.subjectCards = page.locator('div[class*="subjectCard"], div[class*="card"]');
  }

  async selectYear(yearText: string) {
    const tab = this.page.locator(`button:has-text("${yearText}")`).first();
    if (await tab.isVisible()) await tab.click();
  }

  async clickSubject(subjectName: string) {
    const card = this.page.locator(`text=${subjectName}`).first();
    if (await card.isVisible()) await card.click();
  }
}
