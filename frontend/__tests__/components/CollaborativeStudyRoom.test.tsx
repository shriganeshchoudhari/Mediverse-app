import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CollaborativeStudyRoom } from '../../components/study-group/CollaborativeStudyRoom';

// Mock the hook
jest.mock('../../hooks/useCollaborativeRoom', () => ({
  useCollaborativeRoom: jest.fn(() => ({
    isConnected: true,
    peers: [
      { userId: 'peer-1', userName: 'Dr. John Doe', sessionId: 'sess-1' }
    ],
    isPresenter: false,
    presenterSessionId: 'sess-1',
    isAudioMuted: false,
    isVideoMuted: false,
    isScreenSharing: false,
    modelSyncState: {
      modelId: 'cardiac-3d-v1',
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      zoom: 1.0,
      activeLayers: ['myocardium', 'coronary_vessels'],
      selectedOrganId: 'left_ventricle',
    },
    chatMessages: [
      { id: '1', senderId: 'peer-1', senderName: 'Dr. John Doe', text: 'Hello everyone', timestamp: Date.now() }
    ],
    whiteboardLines: [],
    broadcast3DState: jest.fn(),
    claimPresenter: jest.fn(),
    sendChatMessage: jest.fn(),
    sendWhiteboardLine: jest.fn(),
    toggleAudio: jest.fn(),
    toggleVideo: jest.fn(),
    toggleScreenShare: jest.fn(),
  })),
}));

describe('CollaborativeStudyRoom Component', () => {
  beforeAll(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      stroke: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
    })) as any;
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('renders room title, connected badge, and video tiles', () => {
    render(
      <CollaborativeStudyRoom
        roomId="room-cardio-1"
        roomName="Cardiovascular Grand Rounds"
        userId="user-test-1"
        userName="Dr. Sarah Connor"
      />
    );

    expect(screen.getByText('Cardiovascular Grand Rounds')).toBeInTheDocument();
    expect(screen.getByText(/LIVE COHORT/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr. Sarah Connor \(You\)/i)).toBeInTheDocument();
    expect(screen.getAllByText('Dr. John Doe').length).toBeGreaterThanOrEqual(1);
  });

  it('renders 3D model controls and layer toggles', () => {
    render(
      <CollaborativeStudyRoom
        roomId="room-cardio-1"
        roomName="Cardiovascular Grand Rounds"
        userId="user-test-1"
        userName="Dr. Sarah Connor"
      />
    );

    expect(screen.getByText(/myocardium/i)).toBeInTheDocument();
    expect(screen.getByText(/coronary vessels/i)).toBeInTheDocument();
    expect(screen.getByText(/Take the Floor \(Present\)/i)).toBeInTheDocument();
  });

  it('allows switching tabs between chat, roster, and notes', () => {
    render(
      <CollaborativeStudyRoom
        roomId="room-cardio-1"
        roomName="Cardiovascular Grand Rounds"
        userId="user-test-1"
        userName="Dr. Sarah Connor"
      />
    );

    // Initial is chat
    expect(screen.getByText('Hello everyone')).toBeInTheDocument();

    // Click Roster tab
    const rosterTab = screen.getByText(/👥 Cohort/i);
    fireEvent.click(rosterTab);
    expect(screen.getByText(/Active Peer|Connected/i)).toBeInTheDocument();

    // Click Notes tab
    const notesTab = screen.getByText(/📌 Clinical Pearls/i);
    fireEvent.click(notesTab);
    expect(screen.getByText(/Anatomical Pinboard/i)).toBeInTheDocument();
  });
});