import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CMSEditorPage extends BasePage {
  readonly addBlockBtn: Locator;
  readonly expandNodeBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.addBlockBtn = page.locator('button:has-text("Add Block")').first();
    this.expandNodeBtn = page.locator('button[aria-label="Expand Node"]').first();
  }
}
