import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CollaborativeRoomPage extends BasePage {
  readonly roomTab: Locator;
  readonly claimPresenterBtn: Locator;
  readonly modelStage: Locator;
  readonly chatInput: Locator;
  readonly chatSendBtn: Locator;
  readonly annotateBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.roomTab = page.locator('button:has-text("Live Study Room")').first();
    this.claimPresenterBtn = page.locator('button:has-text("Take the Floor"), button:has-text("Presenting")').first();
    this.modelStage = page.locator('div[class*="canvasStage"]').first();
    this.chatInput = page.locator('input[placeholder*="Type a message"]').first();
    this.chatSendBtn = page.locator('button:has-text("Send")').first();
    this.annotateBtn = page.locator('button:has-text("Annotate Model")').first();
  }

  async enterLiveRoom() {
    if (await this.roomTab.isVisible()) await this.roomTab.click();
  }

  async claimPresenter() {
    if (await this.claimPresenterBtn.isVisible()) await this.claimPresenterBtn.click();
  }

  async sendChat(message: string) {
    if (await this.chatInput.isVisible()) {
      await this.chatInput.fill(message);
      await this.chatSendBtn.click();
    }
  }
}
