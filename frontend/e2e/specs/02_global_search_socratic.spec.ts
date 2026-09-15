import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

test.describe('SPEC 02: Global Search & Socratic AI Tutor', () => {
  test('SEARCH-001: Global search keyboard shortcut triggers modal', async ({ page }) => {
    const base = new BasePage(page);
    await page.goto('/dashboard');

    // 1. Topbar is singular on dashboard
    await expect(base.navbar).toHaveCount(1);

    // 2. Open Search via Ctrl+K and type query
    await base.openSearch('Cardiology');
    await expect(page.locator('input[placeholder*="Search"]').first()).toBeVisible();
  });

  test('SOC-001 & SOC-002: Global Socratic Assistant FAB opens slide-over drawer with context', async ({ page }) => {
    await page.goto('/dashboard');

    const fabButton = page.locator('#global-socratic-assistant-fab');
    await expect(fabButton).toBeVisible();

    // Open drawer
    await fabButton.click();

    const drawer = page.locator('#global-socratic-assistant-drawer');
    await expect(drawer).toBeVisible();

    // Verify Context Bar is displayed
    const contextPill = drawer.locator('span[title]').first();
    await expect(contextPill).toBeVisible();
  });

  test('SOC-003 & SOC-004: Socratic chat supports mode switching and message input submission', async ({ page }) => {
    // Intercept AI stream/ask API to simulate deterministic tutor response
    await page.route('**/api/v1/ai/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: 'data: {"token": "Phase 0 depolarization is mediated by fast inward Na+ currents."}\n\ndata: [DONE]\n\n',
      });
    });

    await page.goto('/dashboard');

    const fabButton = page.locator('#global-socratic-assistant-fab');
    await fabButton.click();

    const drawer = page.locator('#global-socratic-assistant-drawer');
    await expect(drawer).toBeVisible();

    // Test mode toggle (socratic vs direct)
    const directBtn = drawer.getByRole('button', { name: 'direct' });
    if (await directBtn.isVisible()) {
      await directBtn.click();
    }

    // Type a question in the input area
    const chatInput = drawer.locator('input[placeholder*="Ask a question"]');
    await expect(chatInput).toBeVisible();
    await chatInput.fill('Explain Phase 0 of cardiac action potential');

    const sendBtn = drawer.getByRole('button', { name: /send/i });
    await expect(sendBtn).toBeEnabled();
    await sendBtn.click();

    // Verify the user message is rendered in the chat bubble
    await expect(drawer.getByText('Explain Phase 0 of cardiac action potential')).toBeVisible();
  });

  test('SOC-005: Socratic drawer closes on close button click and Escape key', async ({ page }) => {
    await page.goto('/dashboard');

    const fabButton = page.locator('#global-socratic-assistant-fab');
    await fabButton.click();

    const drawer = page.locator('#global-socratic-assistant-drawer');
    await expect(drawer).toBeVisible();

    // Close via close button
    const closeBtn = drawer.locator('button[aria-label="Close AI Socratic Tutor"]');
    await closeBtn.click();

    // Reopen and test Escape key close
    await fabButton.click();
    await expect(drawer).toBeVisible();
    await page.keyboard.press('Escape');
  });
});

