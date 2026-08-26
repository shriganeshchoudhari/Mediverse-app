# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 12_collaborative_study_rooms.spec.ts >> SPEC 12: Collaborative Study Rooms & WebRTC/3D Sync >> ROOM-001 & ROOM-002: Live study room entry, Presenter claim and chat
- Location: e2e\specs\12_collaborative_study_rooms.spec.ts:6:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/study-groups/cardio-cohort-01
Call log:
  - navigating to "http://127.0.0.1:3000/study-groups/cardio-cohort-01", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { CollaborativeRoomPage } from '../pages/CollaborativeRoomPage';
  3  | import { mockStudyRoomWebSocket } from '../fixtures/mock-websocket.fixture';
  4  | 
  5  | test.describe('SPEC 12: Collaborative Study Rooms & WebRTC/3D Sync', () => {
  6  |   test('ROOM-001 & ROOM-002: Live study room entry, Presenter claim and chat', async ({ page }) => {
  7  |     await mockStudyRoomWebSocket(page);
  8  |     const room = new CollaborativeRoomPage(page);
> 9  |     await page.goto('/study-groups/cardio-cohort-01');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:3000/study-groups/cardio-cohort-01
  10 |     await room.enterLiveRoom();
  11 |     await room.claimPresenter();
  12 |     await room.sendChat('Reviewing coronary angiography');
  13 |   });
  14 | });
  15 | 
```