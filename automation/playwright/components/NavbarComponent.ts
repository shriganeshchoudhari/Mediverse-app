import { Page, Locator, expect } from '@playwright/test';

export class NavbarComponent {
  readonly page: Page;
  readonly brandLogo: Locator;
  readonly profileMenu: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.brandLogo = page.getByRole('link', { name: /mediverse/i });
    this.profileMenu = page.getByTestId('user-profile-menu');
    this.logoutButton = page.getByRole('button', { name: /logout|sign out/i });
  }

  async logout(): Promise<void> {
    await this.profileMenu.click();
    await this.logoutButton.click();
    await expect(this.page).toHaveURL(/.*login/);
  }
}
