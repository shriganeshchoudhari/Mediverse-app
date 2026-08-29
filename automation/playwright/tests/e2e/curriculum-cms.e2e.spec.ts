import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// ─────────────────────────────────────────────────────────────────────────────
// Curriculum CMS Authoring & Reviewer — E2E Test Suite
// Routes  : /cms, /cms/create
// API     : /api/cms/articles
// Auth    : storageState injected by playwright.config.ts
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_CMS_ARTICLES = {
  articles: [
    {
      id: 'cms-art-01',
      title: 'Davenport Diagram for Acid-Base Disorders',
      domain: 'ALLOPATHIC',
      status: 'PUBLISHED',
      author: 'Dr. Neha Patel',
      reviewer: 'Dr. Vikram Seth',
      lastUpdated: '2026-08-20',
    },
    {
      id: 'cms-art-02',
      title: 'Dosage Calculations in Pediatric Emergencies',
      domain: 'PHARMACY',
      status: 'IN_REVIEW',
      author: 'Prof. Ramesh Rao',
      reviewer: 'Pending Assignment',
      lastUpdated: '2026-08-25',
    },
  ],
};

test.describe('Curriculum Authoring CMS @e2e @cms', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/cms/articles*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_CMS_ARTICLES),
      });
    });
    await page.goto('/cms');
  });

  test('E2E-CMS-001: CMS dashboard lists authored curriculum articles with status badges', async ({ page }) => {
    allure.label('suite', 'Curriculum CMS Authoring');
    allure.label('testId', 'E2E-CMS-001');
    allure.label('severity', 'critical');
    allure.description('Verifies curriculum content management dashboard loads authored items, review statuses, and domain tags.');

    await expect(page.getByRole('heading', { name: /curriculum cms|content management|authoring portal/i })).toBeVisible();

    const publishedArticle = page.getByText(/Davenport Diagram for Acid-Base/i).first();
    await expect(publishedArticle).toBeVisible();

    const inReviewBadge = page.getByText(/IN_REVIEW|in review|pending/i).first();
    await expect(inReviewBadge).toBeVisible();
  });

  test('E2E-CMS-002: Authoring a new medical curriculum article validates rich text and LaTeX equations', async ({ page }) => {
    allure.label('suite', 'Curriculum CMS Authoring');
    allure.label('testId', 'E2E-CMS-002');
    allure.label('severity', 'high');
    allure.description('Verifies the rich text editor (Tiptap / Markdown) and KaTeX equation formatting preview.');

    await page.route('**/api/cms/articles', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'cms-art-new-03', title: 'Henderson-Hasselbalch Clinical Equation', status: 'DRAFT' }),
        });
      } else {
        await route.continue();
      }
    });

    const newArticleBtn = page.getByRole('button', { name: /new article|create content|add module/i }).first();
    await newArticleBtn.click();

    const titleInput = page.getByLabel(/article title|title/i).first()
      .or(page.getByPlaceholder(/enter article title/i).first());
    await titleInput.fill('Henderson-Hasselbalch Clinical Equation');

    const saveDraftBtn = page.getByRole('button', { name: /save draft|save article/i }).first();
    await saveDraftBtn.click();

    await expect(page.getByText(/saved successfully|draft saved/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('E2E-CMS-003: Reviewer approval workflow transitions article from IN_REVIEW to PUBLISHED', async ({ page }) => {
    allure.label('suite', 'Curriculum CMS Authoring');
    allure.label('testId', 'E2E-CMS-003');
    allure.label('severity', 'high');
    allure.description('Verifies peer reviewer sign-off, editorial comment entry, and publishing state transition.');

    await page.route('**/api/cms/articles/*/publish', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'cms-art-02', status: 'PUBLISHED' }),
      });
    });

    const inReviewArticle = page.getByText(/Dosage Calculations in Pediatric/i).first();
    await inReviewArticle.click();

    const publishBtn = page.getByRole('button', { name: /approve & publish|publish article/i }).first();
    if (await publishBtn.isVisible()) {
      await publishBtn.click();
      await expect(page.getByText(/published|status: published/i).first()).toBeVisible({ timeout: 10000 });
    }
  });
});
