import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AuthPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[type="email"], input[name="email"]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"]');
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async login(email: string, pass: string) {
    await this.page.goto('/auth/login');
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();
  }

  async register(data: { email: string; pass: string; firstName: string; lastName: string }) {
    await this.page.goto('/auth/register');
    if (await this.firstNameInput.isVisible()) await this.firstNameInput.fill(data.firstName);
    if (await this.lastNameInput.isVisible()) await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.pass);
    await this.submitButton.click();
  }
}
