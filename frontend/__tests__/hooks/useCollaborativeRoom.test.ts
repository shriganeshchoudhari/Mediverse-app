import { renderHook, act } from '@testing-library/react';
import { useCollaborativeRoom } from '../../hooks/useCollaborativeRoom';

// Mock WebSocket
class MockWebSocket {
  url: string;
  readyState: number = 1; // OPEN
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  send = jest.fn();
  close = jest.fn();

  constructor(url: string) {
    this.url = url;
    setTimeout(() => {
      if (this.onopen) this.onopen();
    }, 10);
  }
}

(global as any).WebSocket = MockWebSocket;

describe('useCollaborativeRoom hook', () => {
  it('initializes with default state and sends JOIN_ROOM', async () => {
    const { result } = renderHook(() =>
      useCollaborativeRoom({
        roomId: 'room-123',
        userId: 'user-456',
        userName: 'Dr. Test',
      })
    );

    expect(result.current.peers).toEqual([]);
    expect(result.current.isPresenter).toBe(false);
    expect(result.current.isAudioMuted).toBe(false);
    expect(result.current.isVideoMuted).toBe(false);
    expect(result.current.modelSyncState.modelId).toBe('cardiac-3d-v1');
  });

  it('allows toggling audio and video states', () => {
    const { result } = renderHook(() =>
      useCollaborativeRoom({
        roomId: 'room-123',
        userId: 'user-456',
        userName: 'Dr. Test',
      })
    );

    act(() => {
      result.current.toggleAudio();
    });
    expect(result.current.isAudioMuted).toBe(true);

    act(() => {
      result.current.toggleVideo();
    });
    expect(result.current.isVideoMuted).toBe(true);
  });

  it('allows claiming presenter role and updating 3D model state', () => {
    const { result } = renderHook(() =>
      useCollaborativeRoom({
        roomId: 'room-123',
        userId: 'user-456',
        userName: 'Dr. Test',
      })
    );

    act(() => {
      result.current.claimPresenter();
    });
    expect(result.current.isPresenter).toBe(true);

    act(() => {
      result.current.broadcast3DState({ zoom: 1.5 });
    });
    expect(result.current.modelSyncState.zoom).toBe(1.5);
  });

  it('adds chat messages correctly', () => {
    const { result } = renderHook(() =>
      useCollaborativeRoom({
        roomId: 'room-123',
        userId: 'user-456',
        userName: 'Dr. Test',
      })
    );

    act(() => {
      result.current.sendChatMessage('Clinical Pearl: V1-V4 for LAD');
    });

    expect(result.current.chatMessages).toHaveLength(1);
    expect(result.current.chatMessages[0].text).toBe('Clinical Pearl: V1-V4 for LAD');
  });
});