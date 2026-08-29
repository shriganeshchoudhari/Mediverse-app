import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// ─────────────────────────────────────────────────────────────────────────────
// Socratic AI Tutor — E2E Test Suite
// Routes  : /ai-tutor
// API     : POST /api/ai/socratic/ask
// Auth    : storageState injected by playwright.config.ts (chromium / firefox /
//           webkit projects all depend on the 'setup' project)
// ─────────────────────────────────────────────────────────────────────────────

const SOCRATIC_MOCK_RESPONSE = {
  sessionId: 'soc-session-mock-001',
  question: 'What is the primary function of the mitral valve?',
  followUp:
    'Interesting thought! Can you explain what happens when the mitral valve is stenosed?',
  confidence: 0.92,
};

test.describe('Socratic AI Tutor @e2e @socratic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ai-tutor');
    await expect(page).toHaveURL(/.*ai-tutor/);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // E2E-SOC-001 : Page loads and key UI elements are present
  // ──────────────────────────────────────────────────────────────────────────
  test('E2E-SOC-001: AI Tutor page renders core UI elements', async ({ page }) => {
    allure.label('suite', 'Socratic AI Tutor');
    allure.label('testId', 'E2E-SOC-001');
    allure.label('severity', 'critical');
    allure.description(
      'Verifies that the Socratic AI Tutor page loads with the topic selector, ' +
        'question input, and submission button visible and interactive.',
    );

    // Heading
    await expect(
      page.getByRole('heading', { name: /socratic ai tutor/i }),
    ).toBeVisible();

    // Topic selector / combobox
    const topicSelect = page.getByRole('combobox', { name: /select topic/i });
    await expect(topicSelect).toBeVisible();
    await expect(topicSelect).toBeEnabled();

    // Question / prompt input
    const promptInput = page.getByRole('textbox', { name: /ask a question/i });
    await expect(promptInput).toBeVisible();
    await expect(promptInput).toBeEnabled();

    // Submit button
    const askBtn = page.getByRole('button', { name: /ask tutor/i });
    await expect(askBtn).toBeVisible();

    // Session panel (conversation history area)
    await expect(page.getByTestId('conversation-history')).toBeVisible();
  });

  // ──────────────────────────────────────────────────────────────────────────
  // E2E-SOC-002 : Submitting a question calls the Socratic API and renders
  //               the AI follow-up question (API interception)
  // ──────────────────────────────────────────────────────────────────────────
  test('E2E-SOC-002: Submitting a question triggers API and renders AI response', async ({
    page,
  }) => {
    allure.label('suite', 'Socratic AI Tutor');
    allure.label('testId', 'E2E-SOC-002');
    allure.label('severity', 'critical');
    allure.description(
      'Intercepts POST /api/ai/socratic/ask, mocks a structured response, ' +
        'and asserts the AI follow-up question appears in the conversation panel.',
    );

    // Intercept the Socratic API call
    await page.route('**/api/ai/socratic/ask', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(SOCRATIC_MOCK_RESPONSE),
      });
    });

    // Select a topic
    await page.getByRole('combobox', { name: /select topic/i }).selectOption('Cardiology');

    // Type a student question
    const promptInput = page.getByRole('textbox', { name: /ask a question/i });
    await promptInput.fill('Explain the cardiac cycle to me.');

    // Submit
    await page.getByRole('button', { name: /ask tutor/i }).click();

    // Loader / thinking indicator should appear briefly then hide
    const thinkingIndicator = page.getByTestId('ai-thinking-indicator');
    await thinkingIndicator.waitFor({ state: 'hidden', timeout: 10_000 });

    // The mocked follow-up question must appear in the conversation
    const history = page.getByTestId('conversation-history');
    await expect(history).toContainText(SOCRATIC_MOCK_RESPONSE.followUp);

    // Confidence badge should be visible
    await expect(page.getByTestId('confidence-score')).toBeVisible();
  });

  // ──────────────────────────────────────────────────────────────────────────
  // E2E-SOC-003 : Tutor session persists multiple Q&A turns
  // ──────────────────────────────────────────────────────────────────────────
  test('E2E-SOC-003: Multi-turn conversation accumulates in history panel', async ({
    page,
  }) => {
    allure.label('suite', 'Socratic AI Tutor');
    allure.label('testId', 'E2E-SOC-003');
    allure.label('severity', 'normal');
    allure.description(
      'Validates that two successive Socratic turns both appear in the ' +
        'conversation history, maintaining session continuity.',
    );

    let callCount = 0;
    const responses = [
      { ...SOCRATIC_MOCK_RESPONSE, followUp: 'Turn-1 AI follow-up question?' },
      { ...SOCRATIC_MOCK_RESPONSE, followUp: 'Turn-2 AI follow-up question?' },
    ];

    await page.route('**/api/ai/socratic/ask', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responses[callCount++ % 2]),
      });
    });

    const promptInput = page.getByRole('textbox', { name: /ask a question/i });
    const askBtn = page.getByRole('button', { name: /ask tutor/i });
    const history = page.getByTestId('conversation-history');

    // Turn 1
    await promptInput.fill('What is systole?');
    await askBtn.click();
    await page.getByTestId('ai-thinking-indicator').waitFor({ state: 'hidden', timeout: 10_000 });
    await expect(history).toContainText('Turn-1 AI follow-up question?');

    // Turn 2
    await promptInput.fill('How does afterload affect stroke volume?');
    await askBtn.click();
    await page.getByTestId('ai-thinking-indicator').waitFor({ state: 'hidden', timeout: 10_000 });
    await expect(history).toContainText('Turn-2 AI follow-up question?');

    // Both student messages should be visible in history
    const studentMessages = page.getByTestId('student-message');
    await expect(studentMessages).toHaveCount(2);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // E2E-SOC-004 : API error surfaces a user-friendly error state
  // ──────────────────────────────────────────────────────────────────────────
  test('E2E-SOC-004: API 500 shows error banner without crashing the page', async ({
    page,
  }) => {
    allure.label('suite', 'Socratic AI Tutor');
    allure.label('testId', 'E2E-SOC-004');
    allure.label('severity', 'normal');
    allure.description(
      'Mocks a 500 from /api/ai/socratic/ask and asserts that an accessible ' +
        'error alert is rendered while the page remains usable.',
    );

    await page.route('**/api/ai/socratic/ask', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal AI service error' }),
      });
    });

    await page.getByRole('textbox', { name: /ask a question/i }).fill('Trigger error');
    await page.getByRole('button', { name: /ask tutor/i }).click();

    // Error alert must be visible
    const errorAlert = page.getByRole('alert');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText(/something went wrong|error|try again/i);

    // Page must still be functional — input not disabled
    await expect(page.getByRole('textbox', { name: /ask a question/i })).toBeEnabled();
  });
});
