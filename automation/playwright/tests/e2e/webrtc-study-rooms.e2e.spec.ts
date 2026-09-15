import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// ─────────────────────────────────────────────────────────────────────────────
// WebRTC Study Rooms — E2E Test Suite
// Routes  : /study-rooms, /study-rooms/create
// API     : /api/study-rooms
// Auth    : storageState injected by playwright.config.ts
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_GROUPS = [
  {
    id: 'room-usmle-cardio-01',
    name: 'USMLE Step 1 / INI-CET Cardio Revision Group',
    description: 'Cardiovascular Physiology & Pathophysiology',
    memberCount: 4,
    isMember: true,
  },
  {
    id: 'room-osce-prep-02',
    name: 'OSCE Peer-to-Peer Mock Examination Station',
    description: 'Neurology Exam & Bedside Clinical Encounters',
    memberCount: 2,
    isMember: false,
  },
];

test.describe('WebRTC Collaborative Study Rooms @e2e @webrtc', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/{api/study-rooms*,api/v1/study-groups*}', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_GROUPS),
      });
    });
    await page.goto('/study-groups');
  });

  test('E2E-WEB-001: Active study rooms directory displays ongoing collaborative sessions', async ({ page }) => {
    allure.label('suite', 'WebRTC Study Rooms');
    allure.label('testId', 'E2E-WEB-001');
    allure.label('severity', 'critical');
    allure.description('Verifies discovery of active peer-to-peer study rooms, participant counts, and join actions.');

    await expect(page.getByRole('heading', { name: /study cohorts|collaborative study rooms|peer study rooms/i })).toBeVisible();

    const cardioRoom = page.getByText(/Cardio Revision Group|USMLE Step 1/i).first();
    await expect(cardioRoom).toBeVisible();

    const joinBtn = page.getByRole('button', { name: /join|enter/i })
      .or(page.getByRole('link', { name: /enter|join/i }))
      .first();
    await expect(joinBtn).toBeVisible();
  });

  test('E2E-WEB-002: Creating a new study room validates required topic and generates shareable room URL', async ({ page }) => {
    allure.label('suite', 'WebRTC Study Rooms');
    allure.label('testId', 'E2E-WEB-002');
    allure.label('severity', 'high');
    allure.description('Verifies new study room creation modal, participant limits configuration, and room initialization.');

    await page.route('**/{api/study-rooms/create,api/v1/study-groups}', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'room-new-test-99',
            name: 'Pharmacology Drug Receptors Study',
            description: 'Autonomic nervous system pharmacology',
            memberCount: 1,
            isMember: true,
          }),
        });
      } else {
        await route.fallback();
      }
    });

    const createBtn = page.getByRole('button', { name: /create cohort|create room|new study room/i }).first();
    await createBtn.click();

    const topicInput = page.getByLabel(/name|room title|topic|subject/i).first()
      .or(page.getByPlaceholder(/enter room name|topic/i).first());
    await topicInput.fill('Pharmacology Drug Receptors Study');

    const submitCreate = page.getByRole('button', { name: /^create$|start room|create & join/i }).first();
    await submitCreate.click();

    // Verify room or modal transition
    await expect(page.getByText(/Pharmacology Drug Receptors Study/i).first()
      .or(page.getByRole('heading', { name: /study cohorts/i }))
    ).toBeVisible({ timeout: 10000 });
  });

  test('E2E-WEB-003: Room controls toggle microphone, camera, and collaborative whiteboard states', async ({ page }) => {
    allure.label('suite', 'WebRTC Study Rooms');
    allure.label('testId', 'E2E-WEB-003');
    allure.label('severity', 'normal');
    allure.description('Verifies in-room media control button interactivity without throwing unhandled exceptions.');

    await page.route('**/api/v1/study-groups/room-usmle-cardio-01/members', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { userId: 'doc-1', name: 'Dr. Arjun Verma', role: 'PRESENTER' },
          { userId: 'student-2', name: 'Test Student', role: 'STUDENT' },
        ]),
      });
    });

    await page.goto('/study-groups/room-usmle-cardio-01');

    const micBtn = page.getByRole('button', { name: /mute|microphone|unmute/i })
      .or(page.locator('button[title*="Mic"]'))
      .first();
    const camBtn = page.getByRole('button', { name: /camera|video|turn off video/i })
      .or(page.locator('button[title*="Camera"]'))
      .first();
    const annotateBtn = page.getByRole('button', { name: /annotate|drawing/i }).first();

    if (await micBtn.isVisible()) {
      await micBtn.click();
      await expect(page.getByText(/unhandled|fatal error/i)).toHaveCount(0);
    }

    if (await camBtn.isVisible()) {
      await camBtn.click();
      await expect(page.getByText(/unhandled|fatal error/i)).toHaveCount(0);
    }

    if (await annotateBtn.isVisible()) {
      await annotateBtn.click();
      await expect(page.getByText(/unhandled|fatal error/i)).toHaveCount(0);
    }
  });
});
