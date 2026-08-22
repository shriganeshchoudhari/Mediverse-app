import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ExamEnginePage extends BasePage {
  readonly startExamBtn: Locator;
  readonly nextQuestionBtn: Locator;
  readonly options: Locator;
  readonly submitStationBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.startExamBtn = page.locator('button:has-text("Start Exam")').first();
    this.nextQuestionBtn = page.locator('button:has-text("Next")').first();
    this.options = page.locator('input[type="radio"]');
    this.submitStationBtn = page.locator('button:has-text("Submit Station")').first();
  }

  async answerQuestion(optionIndex = 1) {
    const opt = this.options.nth(optionIndex);
    if (await opt.isVisible()) await opt.check();
    if (await this.nextQuestionBtn.isVisible()) await this.nextQuestionBtn.click();
  }
}
