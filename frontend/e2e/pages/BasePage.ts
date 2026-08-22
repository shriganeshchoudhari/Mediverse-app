import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly navbar: Locator;
  readonly brandLogo: Locator;
  readonly themeToggle: Locator;
  readonly searchTrigger: Locator;
  readonly searchInput: Locator;
  readonly navExplorerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = page.locator('nav:has-text("Medical Education")');
    this.brandLogo = page.locator('a[aria-label*="Mediverse"]');
    this.themeToggle = page.locator('button[aria-label="Toggle Theme"], button:has-text("🌙"), button:has-text("☀️")').first();
    this.searchTrigger = page.locator('button:has-text("Search"), input[placeholder*="Search"]').first();
    this.searchInput = page.locator('input[placeholder*="Search"]').first();
    this.navExplorerLink = page.locator('a[href="/healthcare"]').first();
  }

  async toggleTheme() {
    if (await this.themeToggle.isVisible()) {
      await this.themeToggle.click();
    }
  }

  async openSearch(query?: string) {
    const searchBtn = this.page.locator('button:has-text("Search")').first();
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
    } else {
      await this.page.keyboard.press('Control+K');
    }
    const input = this.page.locator('#global-search-input');
    await input.waitFor({ state: 'visible', timeout: 5000 });
    if (query) {
      await input.fill(query);
    }
  }
}
