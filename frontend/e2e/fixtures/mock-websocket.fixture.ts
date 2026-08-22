import { Page } from '@playwright/test';

export async function mockStudyRoomWebSocket(page: Page) {
  await page.addInitScript(() => {
    class MockWS extends EventTarget {
      url: string;
      readyState: number = 1; // OPEN
      onopen: any = null;
      onmessage: any = null;
      onclose: any = null;
      onerror: any = null;

      constructor(url: string) {
        super();
        this.url = url;
        setTimeout(() => {
          if (this.onopen) this.onopen(new Event('open'));
          if (this.onmessage) {
            this.onmessage({
              data: JSON.stringify({
                type: 'ROOM_STATE',
                isPresenter: false,
                payload: {
                  peers: [{ userId: 'peer-201', userName: 'Dr. Rita Patel', sessionId: 'sess-201' }],
                  presenterSessionId: 'sess-201',
                  last3DState: { modelId: 'cardiac-3d-v1', zoom: 1.0, activeLayers: ['myocardium'] }
                }
              })
            });
          }
        }, 50);
      }

      send(data: string) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'CLAIM_PRESENTER' && this.onmessage) {
            this.onmessage({
              data: JSON.stringify({
                type: 'CLAIM_PRESENTER',
                senderId: parsed.senderId,
                payload: { presenterSessionId: 'sess-self' }
              })
            });
          }
        } catch (e) {
          // ignore
        }
      }

      close() {
        if (this.onclose) this.onclose(new Event('close'));
      }
    }
    (window as any).WebSocket = MockWS;
  });
}
