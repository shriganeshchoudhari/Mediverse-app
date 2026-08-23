'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './CollaborativeStudyRoom.module.css';
import { useCollaborativeRoom } from '../../hooks/useCollaborativeRoom';

interface CollaborativeStudyRoomProps {
  roomId: string;
  roomName: string;
  userId: string;
  userName: string;
}

const AVAILABLE_MODELS = [
  { id: 'cardiac-3d-v1', name: '🫀 Human Heart 3D (Wiggers Cycle & Coronaries)', layers: ['myocardium', 'coronary_vessels', 'valves', 'conduction'] },
  { id: 'brain-3d-v1', name: '🧠 Cerebral Hemispheres & Circle of Willis', layers: ['cortex', 'circle_of_willis', 'ventricles', 'brainstem'] },
  { id: 'tooth-3d-v1', name: '🦷 Maxillary Central Incisor Pulp Anatomy', layers: ['enamel', 'dentine', 'pulp_canal', 'periodontal_ligament'] },
  { id: 'knee-3d-v1', name: '🦾 Knee Joint Biomechanics & Menisci', layers: ['femur_tibia', 'cruciate_ligaments', 'menisci', 'patellar_tendon'] },
];

export function CollaborativeStudyRoom({
  roomId,
  roomName,
  userId,
  userName,
}: CollaborativeStudyRoomProps) {
  const {
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
  } = useCollaborativeRoom({ roomId, userId, userName });

  const [activeTab, setActiveTab] = useState<'chat' | 'roster' | 'notes' | 'battle'>('chat');
  const [battleScore, setBattleScore] = useState(0);
  const [battleStreak, setBattleStreak] = useState(0);
  const [currentBattleIndex, setCurrentBattleIndex] = useState(0);
  const [selectedBattleOption, setSelectedBattleOption] = useState<number | null>(null);
  const [hasAnsweredBattle, setHasAnsweredBattle] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isWhiteboardMode, setIsWhiteboardMode] = useState(false);
  const [currentLine, setCurrentLine] = useState<number[][]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current && typeof chatEndRef.current.scrollIntoView === 'function') {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const currentModel = AVAILABLE_MODELS.find((m) => m.id === modelSyncState.modelId) || AVAILABLE_MODELS[0];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isWhiteboardMode) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCurrentLine([[x, y]]);
    } else if (isPresenter) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isWhiteboardMode && currentLine.length > 0) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCurrentLine((prev) => [...prev, [x, y]]);
    } else if (isDragging && isPresenter) {
      const deltaX = (e.clientX - dragStart.x) * 0.01;
      const deltaY = (e.clientY - dragStart.y) * 0.01;

      broadcast3DState({
        rotation: {
          x: modelSyncState.rotation.x + deltaY,
          y: modelSyncState.rotation.y + deltaX,
          z: modelSyncState.rotation.z,
          w: modelSyncState.rotation.w,
        },
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    if (isWhiteboardMode && currentLine.length > 1) {
      sendWhiteboardLine({
        id: String(Date.now()),
        points: currentLine,
        color: '#ef4444',
        width: 3,
      });
      setCurrentLine([]);
    }
    setIsDragging(false);
  };

  const handleLayerToggle = (layer: string) => {
    if (!isPresenter) return;
    const exists = modelSyncState.activeLayers.includes(layer);
    const newLayers = exists
      ? modelSyncState.activeLayers.filter((l) => l !== layer)
      : [...modelSyncState.activeLayers, layer];
    broadcast3DState({ activeLayers: newLayers });
  };

  const handleModelChange = (modelId: string) => {
    if (!isPresenter) return;
    const targetModel = AVAILABLE_MODELS.find((m) => m.id === modelId);
    broadcast3DState({
      modelId,
      activeLayers: targetModel ? targetModel.layers : [],
      zoom: 1.0,
      rotation: { x: 0, y: 0, z: 0, w: 1 },
    });
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput);
    setChatInput('');
  };

  // Render whiteboard lines
  useEffect(() => {
    try {
      const canvas = canvasRef.current;
      if (!canvas || typeof canvas.getContext !== 'function') return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const drawPath = (points: number[][], color: string, width: number) => {
        if (points.length < 2) return;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.stroke();
      };

      whiteboardLines.forEach((line) => {
        drawPath(line.points, line.color, line.width);
      });

      if (currentLine.length > 1) {
        drawPath(currentLine, '#38bdf8', 3);
      }
    } catch {
      // JSDOM / headless fallback
    }
  }, [whiteboardLines, currentLine]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>{roomName}</h2>
          <div className={styles.roomBadge}>
            <span className={styles.dotPulse}></span>
            <span>{isConnected ? 'LIVE COHORT' : 'OFFLINE MODE'}</span>
            <span>• {peers.length + 1} participant(s)</span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            className={`${styles.presenterBtn} ${isPresenter ? styles.presenterBadgeActive : ''}`}
            onClick={claimPresenter}
            disabled={isPresenter}
          >
            {isPresenter ? '★ You are Presenting' : 'Take the Floor (Present)'}
          </button>
        </div>
      </div>

      {/* AV Strip */}
      <div className={styles.avStrip}>
        {/* Self video tile */}
        <div className={`${styles.videoCard} ${!isAudioMuted ? styles.videoCardSpeaking : ''}`}>
          <div className={styles.avatarCircle}>{userName ? userName[0].toUpperCase() : 'U'}</div>
          <div className={styles.peerLabel}>
            <span>{userName} (You)</span>
            <span>{isPresenter ? '👑' : ''}</span>
          </div>
          <div className={styles.controlsBar}>
            <button
              className={`${styles.iconBtn} ${isAudioMuted ? styles.iconBtnActive : ''}`}
              onClick={toggleAudio}
              title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isAudioMuted ? '🔇' : '🎙️'}
            </button>
            <button
              className={`${styles.iconBtn} ${isVideoMuted ? styles.iconBtnActive : ''}`}
              onClick={toggleVideo}
              title={isVideoMuted ? 'Turn on Camera' : 'Turn off Camera'}
            >
              {isVideoMuted ? '🚫' : '📹'}
            </button>
            <button
              className={`${styles.iconBtn} ${isScreenSharing ? styles.iconBtnActive : ''}`}
              onClick={toggleScreenShare}
              title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
            >
              🖥️
            </button>
          </div>
        </div>

        {/* Remote peer video tiles */}
        {peers.map((peer) => (
          <div key={peer.sessionId} className={styles.videoCard}>
            <div className={styles.avatarCircle}>
              {peer.userName ? peer.userName[0].toUpperCase() : 'P'}
            </div>
            <div className={styles.peerLabel}>
              <span>{peer.userName}</span>
              <span>{peer.sessionId === presenterSessionId ? '👑' : ''}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Workspace */}
      <div className={styles.workspace}>
        {/* 3D Anatomical Viewport */}
        <div className={styles.viewportCard}>
          <div className={styles.modelBar}>
            <select
              className={styles.organSelect}
              value={modelSyncState.modelId}
              onChange={(e) => handleModelChange(e.target.value)}
              disabled={!isPresenter}
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <div className={styles.headerActions}>
              <button
                className={`${styles.iconBtn} ${isWhiteboardMode ? styles.iconBtnActive : ''}`}
                onClick={() => setIsWhiteboardMode(!isWhiteboardMode)}
              >
                {isWhiteboardMode ? '✏️ Drawing Active' : '✏️ Annotate Model'}
              </button>
              {isPresenter && (
                <button
                  className={styles.iconBtn}
                  onClick={() => broadcast3DState({ zoom: Math.min(2.0, modelSyncState.zoom + 0.2) })}
                >
                  🔍+
                </button>
              )}
              {isPresenter && (
                <button
                  className={styles.iconBtn}
                  onClick={() => broadcast3DState({ zoom: Math.max(0.6, modelSyncState.zoom - 0.2) })}
                >
                  🔍-
                </button>
              )}
            </div>
          </div>

          <div
            className={styles.canvasStage}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div className={styles.overlayInfo}>
              <span>{isPresenter ? '🎯 You are controlling the 3D view' : '👀 Synchronized to Presenter view'}</span>
            </div>

            {/* SVG Anatomical Model Representation */}
            <svg
              className={styles.anatomicalModelSvg}
              viewBox="0 0 400 400"
              style={{
                transform: `rotateX(${modelSyncState.rotation.x * 30}deg) rotateY(${modelSyncState.rotation.y * 50}deg) scale(${modelSyncState.zoom})`,
              }}
            >
              {/* Background Glow */}
              <circle cx="200" cy="200" r="160" fill="rgba(56, 189, 248, 0.05)" />
              {/* Myocardium / Organ Base */}
              {modelSyncState.activeLayers.includes('myocardium') || modelSyncState.activeLayers.includes('cortex') || modelSyncState.activeLayers.includes('enamel') || modelSyncState.activeLayers.includes('femur_tibia') ? (
                <path
                  d="M 200 120 C 140 60, 80 140, 140 240 C 180 300, 200 340, 200 340 C 200 340, 220 300, 260 240 C 320 140, 260 60, 200 120 Z"
                  fill="#ef4444"
                  opacity="0.85"
                />
              ) : null}

              {/* Coronaries / Vessels Layer */}
              {modelSyncState.activeLayers.includes('coronary_vessels') || modelSyncState.activeLayers.includes('circle_of_willis') ? (
                <path
                  d="M 200 120 Q 220 180, 250 220 M 200 140 Q 170 190, 160 250 M 200 180 Q 210 230, 200 300"
                  stroke="#38bdf8"
                  strokeWidth="6"
                  fill="none"
                />
              ) : null}

              {/* Conduction / Valves Layer */}
              {modelSyncState.activeLayers.includes('valves') || modelSyncState.activeLayers.includes('ventricles') ? (
                <ellipse cx="200" cy="180" rx="35" ry="15" fill="#facc15" opacity="0.9" />
              ) : null}
            </svg>

            {/* Whiteboard Overlay Canvas */}
            <canvas
              ref={canvasRef}
              width={600}
              height={380}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: isWhiteboardMode ? 'auto' : 'none',
              }}
            />
          </div>

          {/* Layer Pills */}
          <div className={styles.layerPills}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, alignSelf: 'center', marginRight: '0.25rem' }}>
              Layers:
            </span>
            {currentModel.layers.map((layer) => {
              const active = modelSyncState.activeLayers.includes(layer);
              return (
                <button
                  key={layer}
                  className={`${styles.layerPill} ${active ? styles.layerPillActive : ''}`}
                  onClick={() => handleLayerToggle(layer)}
                  disabled={!isPresenter}
                >
                  {layer.replace(/_/g, ' ')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Side Panel */}
        <div className={styles.sideTools}>
          <div className={styles.tabHeaders}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'chat' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              💬 Discussion
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'roster' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('roster')}
            >
              👥 Cohort ({peers.length + 1})
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'notes' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              📌 Clinical Pearls
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'battle' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('battle')}
            >
              ⚡ Flashcard Duel
            </button>
          </div>

          {activeTab === 'chat' && (
            <>
              <div className={styles.chatBody}>
                {chatMessages.length === 0 && (
                  <p style={{ color: '#64748b', fontSize: '0.75rem', textAlign: 'center', margin: 'auto' }}>
                    No messages yet. Ask a question or share a clinical pearl!
                  </p>
                )}
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={styles.chatBubble}>
                    <div className={styles.chatSender}>{msg.senderName}</div>
                    <div>{msg.text}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendChat} className={styles.chatInputArea}>
                <input
                  type="text"
                  placeholder="Type a message to peers..."
                  className={styles.chatInput}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className={styles.sendBtn}>
                  Send
                </button>
              </form>
            </>
          )}

          {activeTab === 'roster' && (
            <ul className={styles.rosterList}>
              <li className={styles.rosterItem}>
                <span>
                  {userName} <strong>(You)</strong>
                </span>
                <span style={{ color: isPresenter ? '#f59e0b' : '#34d399', fontWeight: 600 }}>
                  {isPresenter ? 'Presenter ★' : 'Connected'}
                </span>
              </li>
              {peers.map((peer) => (
                <li key={peer.sessionId} className={styles.rosterItem}>
                  <span>{peer.userName}</span>
                  <span style={{ color: peer.sessionId === presenterSessionId ? '#f59e0b' : '#38bdf8' }}>
                    {peer.sessionId === presenterSessionId ? 'Presenter ★' : 'Active Peer'}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'notes' && (
            <div style={{ padding: '0.75rem', fontSize: '0.8125rem', overflowY: 'auto' }}>
              <h4 style={{ color: '#38bdf8', marginBottom: '0.5rem' }}>Anatomical Pinboard</h4>
              <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '0.375rem', marginBottom: '0.5rem' }}>
                <strong>LAD Stenosis:</strong> Look at the anterior interventricular groove branch on 3D view.
              </div>
              <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '0.375rem' }}>
                <strong>Mitral Valve Closure:</strong> Corresponds to S1 heart sound and isovolumetric contraction phase.
              </div>
            </div>
          )}

          {activeTab === 'battle' && (
            <div style={{ padding: '0.75rem', fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #1e293b' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>YOUR DUEL SCORE</span>
                  <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '1.1rem' }}>{battleScore} pts</div>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>CURRENT STREAK</span>
                  <div style={{ color: '#34d399', fontWeight: 800, fontSize: '1.1rem' }}>🔥 {battleStreak}x</div>
                </div>
              </div>

              <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                <span style={{ color: '#38bdf8', fontSize: '0.7rem', fontWeight: 700 }}>VIVA FLASHCARD QUESTION:</span>
                <p style={{ color: '#f8fafc', fontWeight: 600, marginTop: '0.25rem', fontSize: '0.8rem' }}>
                  Which coronary artery occlusion is the most common cause of complete atrioventricular (AV) node block?
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { text: 'A. Right Coronary Artery (RCA)', isCorrect: true },
                  { text: 'B. Left Anterior Descending (LAD)', isCorrect: false },
                  { text: 'C. Left Circumflex (LCx)', isCorrect: false },
                  { text: 'D. Left Main Coronary Artery', isCorrect: false },
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={hasAnsweredBattle}
                    onClick={() => {
                      setSelectedBattleOption(idx);
                      setHasAnsweredBattle(true);
                      if (opt.isCorrect) {
                        setBattleScore((s) => s + 100);
                        setBattleStreak((st) => st + 1);
                      } else {
                        setBattleStreak(0);
                      }
                    }}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid',
                      borderColor: hasAnsweredBattle
                        ? opt.isCorrect
                          ? '#10b981'
                          : selectedBattleOption === idx
                          ? '#ef4444'
                          : '#1e293b'
                        : '#334155',
                      background: hasAnsweredBattle
                        ? opt.isCorrect
                          ? '#064e3b'
                          : selectedBattleOption === idx
                          ? '#7f1d1d'
                          : '#0f172a'
                        : '#0f172a',
                      color: '#f8fafc',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      cursor: hasAnsweredBattle ? 'default' : 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {hasAnsweredBattle && (
                <div style={{ padding: '0.5rem', background: '#1e1b4b', borderRadius: '0.375rem', border: '1px solid #4338ca', fontSize: '0.75rem', color: '#c7d2fe' }}>
                  <strong>High-Yield Rationale:</strong> The RCA supplies the AV node via the AV nodal branch in ~90% of individuals (right-dominant circulation).
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollaborativeStudyRoom;