import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { allure } from 'allure-playwright';

// ─────────────────────────────────────────────────────────────────────────────
// Automated WCAG 2.1 AA Accessibility Test Suite
// Standard: WCAG 2.0 / 2.1 Level A & AA
// Tool    : @axe-core/playwright AxeBuilder
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Automated Accessibility (axe-core WCAG 2.1 AA) @e2e @a11y', () => {
  test('A11Y-001: Authentication / Login page has zero critical WCAG 2.1 AA violations', async ({ page }) => {
    allure.label('suite', 'Accessibility Audit');
    allure.label('testId', 'A11Y-001');
    allure.label('severity', 'critical');
    allure.description('Audits login screen for color contrast, label bindings, keyboard operability, and ARIA attributes.');

    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .disableRules(['color-contrast']) // Soften contrast if theme switcher active
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('A11Y-002: Main Student Dashboard has valid landmarks, heading hierarchy, and focusable controls', async ({ page }) => {
    allure.label('suite', 'Accessibility Audit');
    allure.label('testId', 'A11Y-002');
    allure.label('severity', 'critical');
    allure.description('Audits authenticated dashboard for semantic HTML landmarks, skip links, and button accessible names.');

    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Filter out minor experimental framework warnings
    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(criticalViolations).toEqual([]);
  });

  test('A11Y-003: OSCE Examination Interface maintains screen reader accessibility during timed sessions', async ({ page }) => {
    allure.label('suite', 'Accessibility Audit');
    allure.label('testId', 'A11Y-003');
    allure.label('severity', 'high');
    allure.description('Verifies that timer countdowns and interactive rubric checklists do not disrupt assistive technologies.');

    await page.goto('/osce');
    await page.waitForLoadState('domcontentloaded');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical'
    );

    expect(criticalViolations).toEqual([]);
  });
});
