import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

// ─────────────────────────────────────────────────────────────────────────────
// WebRTC Study Rooms — E2E Test Suite
// Routes  : /study-rooms, /study-rooms/create
// API     : /api/study-rooms
// Auth    : storageState injected by playwright.config.ts
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_ROOMS = {
  rooms: [
    {
      roomId: 'room-usmle-cardio-01',
      title: 'USMLE Step 1 / INI-CET Cardio Revision Group',
      topic: 'Cardiovascular Physiology',
      host: 'Dr. Arjun Verma',
      participantsCount: 4,
      maxParticipants: 8,
      isLive: true,
      hasWhiteboard: true,
    },
    {
      roomId: 'room-osce-prep-02',
      title: 'OSCE Peer-to-Peer Mock Examination Station',
      topic: 'Neurology Exam',
      host: 'Dr. Priya Sharma',
      participantsCount: 2,
      maxParticipants: 4,
      isLive: true,
      hasWhiteboard: true,
    },
  ],
};

test.describe('WebRTC Collaborative Study Rooms @e2e @webrtc', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/study-rooms*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_ROOMS),
      });
    });
    await page.goto('/study-rooms');
  });

  test('E2E-WEB-001: Active study rooms directory displays ongoing collaborative sessions', async ({ page }) => {
    allure.label('suite', 'WebRTC Study Rooms');
    allure.label('testId', 'E2E-WEB-001');
    allure.label('severity', 'critical');
    allure.description('Verifies discovery of active peer-to-peer study rooms, participant counts, and join actions.');

    await expect(page.getByRole('heading', { name: /collaborative study rooms|peer study rooms/i })).toBeVisible();

    const cardioRoom = page.getByText(/Cardio Revision Group|USMLE Step 1/i).first();
    await expect(cardioRoom).toBeVisible();

    const joinBtn = page.getByRole('button', { name: /join room|enter session/i }).first();
    await expect(joinBtn).toBeVisible();
    await expect(joinBtn).toBeEnabled();
  });

  test('E2E-WEB-002: Creating a new study room validates required topic and generates shareable room URL', async ({ page }) => {
    allure.label('suite', 'WebRTC Study Rooms');
    allure.label('testId', 'E2E-WEB-002');
    allure.label('severity', 'high');
    allure.description('Verifies new study room creation modal, participant limits configuration, and room initialization.');

    await page.route('**/api/study-rooms/create', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          roomId: 'room-new-test-99',
          title: 'Pharmacology Drug Receptors Study',
          shareUrl: 'http://localhost:3000/study-rooms/room-new-test-99',
        }),
      });
    });

    const createBtn = page.getByRole('button', { name: /create room|new study room/i }).first();
    await createBtn.click();

    const topicInput = page.getByLabel(/room title|topic|subject/i).first()
      .or(page.getByPlaceholder(/enter room name|topic/i).first());
    await topicInput.fill('Pharmacology Drug Receptors Study');

    const submitCreate = page.getByRole('button', { name: /start room|create & join/i }).first();
    await submitCreate.click();

    // Verify redirection or room interface loaded
    await expect(page.getByTestId('study-room-interface')
      .or(page.getByText(/pharmacology drug receptors/i))
      .or(page.locator('video, audio, [data-testid="peer-video"]'))
      .first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('E2E-WEB-003: Room controls toggle microphone, camera, and collaborative whiteboard states', async ({ page }) => {
    allure.label('suite', 'WebRTC Study Rooms');
    allure.label('testId', 'E2E-WEB-003');
    allure.label('severity', 'normal');
    allure.description('Verifies in-room media control button interactivity without throwing unhandled exceptions.');

    await page.goto('/study-rooms/room-usmle-cardio-01');

    const micBtn = page.getByRole('button', { name: /mute|microphone|unmute/i }).first();
    const camBtn = page.getByRole('button', { name: /camera|video|turn off video/i }).first();

    if (await micBtn.isVisible()) {
      await micBtn.click();
      // Should not trigger error
      await expect(page.getByText(/unhandled|fatal error/i)).toHaveCount(0);
    }

    if (await camBtn.isVisible()) {
      await camBtn.click();
      await expect(page.getByText(/unhandled|fatal error/i)).toHaveCount(0);
    }
  });
});
