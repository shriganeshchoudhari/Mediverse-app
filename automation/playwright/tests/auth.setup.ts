import { test as setup, expect } from '@playwright/test';
import * as path from 'path';

/**
 * Global authentication setup for Playwright.
 * Runs once before all tests; saves authenticated browser state to disk.
 * All subsequent tests load this state and skip the login UI flow.
 *
 * Usage: add `storageState: STORAGE_STATE` to any project in playwright.config.ts
 *        that requires authentication.
 */

import * as fs from 'fs';

const AUTH_FILE = path.join(__dirname, '../test-data/.auth/user.json');

setup('authenticate as test student', async ({ page }) => {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  const email   = process.env.STUDENT_EMAIL || 'student@mediverse.edu';
  const password = process.env.STUDENT_PASSWORD || 'StudentPass123!';

  // Ensure target directory exists
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  // ── Navigate to canonical login page ──────────────────────────────────────
  await page.goto(`${baseURL}/auth/login`);
  await expect(page).toHaveTitle(/Mediverse|Login/i);

  // ── Fill credentials ────────────────────────────────────────────────────
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);

  // ── Submit ──────────────────────────────────────────────────────────────
  await page.getByRole('button', { name: /sign in|log in|login/i }).click();

  // ── Wait for authenticated state ────────────────────────────────────────
  // Expect redirect to dashboard or home after login
  await expect(page).toHaveURL(/dashboard|home|\/$/i, { timeout: 15_000 });

  // ── Persist authentication state ─────────────────────────────────────────
  await page.context().storageState({ path: AUTH_FILE });
});
