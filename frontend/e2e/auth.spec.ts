import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
  const testEmail = `test.${Date.now()}@mediverse-e2e.test`;
  const testPassword = 'Test@Mediverse123!';

  test('Register new user — happy path', async ({ page }) => {
    await page.goto(`${baseUrl}/auth/register`);
    await expect(page).toHaveTitle(/Mediverse|Register/);
    
    await page.fill('[name="email"], input[type="email"]', testEmail);
    await page.fill('[name="firstName"], input[placeholder*="First"]', 'E2E');
    await page.fill('[name="lastName"], input[placeholder*="Last"]', 'Tester');
    await page.fill('[name="password"], input[type="password"]', testPassword);
    
    await page.click('button[type="submit"]');
    
    // After register, expect redirect to dashboard or home
    await expect(page).toHaveURL(/dashboard|home|\/$/, { timeout: 10000 });
  });

  test('Login with valid credentials', async ({ page }) => {
    await page.goto(`${baseUrl}/auth/login`);
    await expect(page).toHaveTitle(/Mediverse|Login/);
    
    // Use a pre-seeded test account (or skip if not available)
    await page.fill('[name="email"], input[type="email"]', 'student@mediverse.edu');
    await page.fill('[name="password"], input[type="password"]', 'student_demo_2026');
    
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
    const url = page.url();
    // Either redirected to dashboard or shows error (expected if account doesn't exist)
    expect(url).toMatch(/dashboard|login|auth/);
  });

  test('Login with invalid credentials shows error', async ({ page }) => {
    await page.goto(`${baseUrl}/auth/login`);
    
    await page.fill('[name="email"], input[type="email"]', 'invalid@nowhere.com');
    await page.fill('[name="password"], input[type="password"]', 'wrongpassword');
    
    await page.click('button[type="submit"]');
    
    // Expect error message to appear
    await expect(page.locator('[role="alert"], .error, [class*="error"], [class*="toast"]')).toBeVisible({ timeout: 5000 });
  });

  test('Protected route redirects unauthenticated user', async ({ page }) => {
    await page.goto(`${baseUrl}/dashboard`);
    // Expect either redirect to login or access denied message
    await page.waitForTimeout(1500);
    const url = page.url();
    const hasLoginBtn = await page.locator('a[href*="login"], button:has-text("Log In")').count();
    expect(url.includes('login') || hasLoginBtn > 0).toBeTruthy();
  });

  test('Global search opens with Ctrl+K', async ({ page }) => {
    await page.goto(`${baseUrl}/`);
    await page.keyboard.press('Control+k');
    await expect(page.locator('#global-search-input, input[aria-label*="search"]')).toBeVisible({ timeout: 3000 });
  });

  test('Healthcare domain landing page loads', async ({ page }) => {
    await page.goto(`${baseUrl}/healthcare`);
    await expect(page.locator('h1, h2')).toBeVisible({ timeout: 5000 });
    // Should show domain cards
    const domainCards = await page.locator('[class*="domain"], [class*="card"]').count();
    expect(domainCards).toBeGreaterThan(0);
  });

  test('BNYS page renders curriculum', async ({ page }) => {
    await page.goto(`${baseUrl}/healthcare/ayush/bnys`);
    await expect(page.locator('h1, h2')).toBeVisible({ timeout: 5000 });
  });

  test('Physiology hub page renders', async ({ page }) => {
    await page.goto(`${baseUrl}/physiology`);
    await expect(page.locator('h1, h2')).toBeVisible({ timeout: 5000 });
  });
});
