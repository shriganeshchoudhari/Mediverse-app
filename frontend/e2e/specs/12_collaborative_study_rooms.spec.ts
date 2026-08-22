import { test, expect } from '@playwright/test';
import { CollaborativeRoomPage } from '../pages/CollaborativeRoomPage';
import { mockStudyRoomWebSocket } from '../fixtures/mock-websocket.fixture';

test.describe('SPEC 12: Collaborative Study Rooms & WebRTC/3D Sync', () => {
  test('ROOM-001 & ROOM-002: Live study room entry, Presenter claim and chat', async ({ page }) => {
    await mockStudyRoomWebSocket(page);
    const room = new CollaborativeRoomPage(page);
    await page.goto('/study-groups/cardio-cohort-01');
    await room.enterLiveRoom();
    await room.claimPresenter();
    await room.sendChat('Reviewing coronary angiography');
  });
});
