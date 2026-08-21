import { useState, useEffect, useRef, useCallback } from 'react';

export interface RoomPeer {
  userId: string;
  userName: string;
  sessionId: string;
  isSpeaking?: boolean;
}

export interface Sync3DState {
  modelId: string;
  rotation: { x: number; y: number; z: number; w: number };
  zoom: number;
  activeLayers: string[];
  selectedOrganId?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface WhiteboardLine {
  id: string;
  points: number[][];
  color: string;
  width: number;
}

export interface UseCollaborativeRoomOptions {
  roomId: string;
  userId: string;
  userName: string;
  wsUrl?: string;
}

export function useCollaborativeRoom({
  roomId,
  userId,
  userName,
  wsUrl,
}: UseCollaborativeRoomOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [peers, setPeers] = useState<RoomPeer[]>([]);
  const [isPresenter, setIsPresenter] = useState(false);
  const [presenterSessionId, setPresenterSessionId] = useState<string>('');
  
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const [modelSyncState, setModelSyncState] = useState<Sync3DState>({
    modelId: 'cardiac-3d-v1',
    rotation: { x: 0, y: 0, z: 0, w: 1 },
    zoom: 1.0,
    activeLayers: ['myocardium', 'coronary_vessels', 'valves'],
    selectedOrganId: 'left_ventricle',
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [whiteboardLines, setWhiteboardLines] = useState<WhiteboardLine[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!roomId) return;

    const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = typeof window !== 'undefined' ? (window.location.port === '3000' ? 'localhost:8085' : window.location.host) : 'localhost:8085';
    const finalWsUrl = wsUrl || `${protocol}//${host}/ws/study-room`;

    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(finalWsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        // Send JOIN_ROOM
        const joinMsg = {
          type: 'JOIN_ROOM',
          roomId,
          senderId: userId,
          senderName: userName,
        };
        ws?.send(JSON.stringify(joinMsg));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleIncomingMessage(data);
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      ws.onerror = (err) => {
        console.warn('WebSocket study room connection offline or error:', err);
        setIsConnected(false);
      };
    } catch (err) {
      console.warn('Failed to establish WebSocket connection:', err);
    }

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'LEAVE_ROOM', roomId, senderId: userId }));
        ws.close();
      }
    };
  }, [roomId, userId, userName, wsUrl]);

  const handleIncomingMessage = (data: any) => {
    switch (data.type) {
      case 'ROOM_STATE':
        if (data.payload?.peers) {
          setPeers(data.payload.peers);
        }
        if (data.isPresenter !== undefined) {
          setIsPresenter(data.isPresenter);
        }
        if (data.payload?.presenterSessionId) {
          setPresenterSessionId(data.payload.presenterSessionId);
        }
        if (data.payload?.last3DState && Object.keys(data.payload.last3DState).length > 0) {
          setModelSyncState(data.payload.last3DState);
        }
        break;

      case 'PEER_JOINED':
        if (data.payload?.sessionId) {
          setPeers((prev) => {
            if (prev.some((p) => p.sessionId === data.payload.sessionId)) return prev;
            return [...prev, {
              userId: data.payload.userId || data.senderId,
              userName: data.payload.userName || data.senderName || 'Peer',
              sessionId: data.payload.sessionId,
            }];
          });
        }
        break;

      case 'PEER_LEFT':
        if (data.payload?.sessionId) {
          setPeers((prev) => prev.filter((p) => p.sessionId !== data.payload.sessionId));
        }
        if (data.payload?.newPresenterSessionId) {
          setPresenterSessionId(data.payload.newPresenterSessionId);
        }
        break;

      case 'SYNC_3D_STATE':
        if (data.payload) {
          setModelSyncState(data.payload);
        }
        break;

      case 'CLAIM_PRESENTER':
        if (data.payload?.presenterSessionId) {
          setPresenterSessionId(data.payload.presenterSessionId);
          setIsPresenter(data.senderId === userId);
        }
        break;

      case 'CHAT_MESSAGE':
        setChatMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + Math.random()),
            senderId: data.senderId,
            senderName: data.senderName || 'Peer',
            text: data.text || '',
            timestamp: data.timestamp || Date.now(),
          },
        ]);
        break;

      case 'WHITEBOARD_DRAW':
        if (data.payload) {
          setWhiteboardLines((prev) => [...prev, data.payload]);
        }
        break;

      default:
        break;
    }
  };

  const broadcast3DState = useCallback((newState: Partial<Sync3DState>) => {
    setModelSyncState((prev) => {
      const updated = { ...prev, ...newState };
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'SYNC_3D_STATE',
          roomId,
          senderId: userId,
          isPresenter,
          payload: updated,
        }));
      }
      return updated;
    });
  }, [roomId, userId, isPresenter]);

  const claimPresenter = useCallback(() => {
    setIsPresenter(true);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'CLAIM_PRESENTER',
        roomId,
        senderId: userId,
        senderName: userName,
      }));
    }
  }, [roomId, userId, userName]);

  const sendChatMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: String(Date.now()),
      senderId: userId,
      senderName: userName,
      text: text.trim(),
      timestamp: Date.now(),
    };
    setChatMessages((prev) => [...prev, msg]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'CHAT_MESSAGE',
        roomId,
        senderId: userId,
        senderName: userName,
        text: text.trim(),
        timestamp: Date.now(),
      }));
    }
  }, [roomId, userId, userName]);

  const sendWhiteboardLine = useCallback((line: WhiteboardLine) => {
    setWhiteboardLines((prev) => [...prev, line]);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'WHITEBOARD_DRAW',
        roomId,
        senderId: userId,
        payload: line,
      }));
    }
  }, [roomId, userId]);

  const toggleAudio = useCallback(() => {
    setIsAudioMuted((prev) => !prev);
  }, []);

  const toggleVideo = useCallback(() => {
    setIsVideoMuted((prev) => !prev);
  }, []);

  const toggleScreenShare = useCallback(() => {
    setIsScreenSharing((prev) => !prev);
  }, []);

  return {
    isConnected,
    peers,
    isPresenter,
    presenterSessionId,
    isAudioMuted,
    isVideoMuted,
    isScreenSharing,
    modelSyncState,
    chatMessages,
    whiteboardLines,
    broadcast3DState,
    claimPresenter,
    sendChatMessage,
    sendWhiteboardLine,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  };
}
