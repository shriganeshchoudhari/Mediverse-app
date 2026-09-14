package com.curiolearn.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Component;

/**
 * WebSocket handler for the AI Telehealth patient-simulator stream.
 *
 * <p>Security hardening (D22):
 * <ul>
 *   <li>Tracks {@code lastActivity} per session in a {@link ConcurrentHashMap}.</li>
 *   <li>A background scheduler evicts sessions that have been idle for more than
 *       {@link #IDLE_TIMEOUT_MS} (30 minutes) by closing them with
 *       {@link CloseStatus#SESSION_NOT_RELIABLE}. This prevents unbounded memory
 *       growth from sessions whose clients silently disconnect (e.g., mobile sleep,
 *       NAT timeout, browser crash).</li>
 * </ul>
 */
@Component
public class TelehealthWebSocketHandler extends BinaryWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(TelehealthWebSocketHandler.class);
    private static final long IDLE_TIMEOUT_MS = 30 * 60 * 1_000L; // 30 minutes
    private static final long EVICTION_INTERVAL_MS = 5 * 60 * 1_000L; // check every 5 minutes

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, WebSocketSession> activeSessions = new ConcurrentHashMap<>();
    /** Epoch-ms timestamp of last binary message received per session. */
    private final Map<String, Long> lastActivity = new ConcurrentHashMap<>();

    private final ScheduledExecutorService evictionScheduler =
            Executors.newSingleThreadScheduledExecutor(r -> {
                Thread t = new Thread(r, "telehealth-ws-eviction");
                t.setDaemon(true);
                return t;
            });

    public TelehealthWebSocketHandler() {
        evictionScheduler.scheduleWithFixedDelay(
                this::evictIdleSessions,
                EVICTION_INTERVAL_MS,
                EVICTION_INTERVAL_MS,
                TimeUnit.MILLISECONDS
        );
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("Telehealth WebSocket connected: {}", session.getId());
        activeSessions.put(session.getId(), session);
        lastActivity.put(session.getId(), System.currentTimeMillis());

        // Initial setup payload (mocking connection to Gemini Live)
        session.sendMessage(new TextMessage(
                "{\"type\":\"connection_established\",\"message\":\"Connected to AI Patient Simulator\"}"));
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws Exception {
        // Update activity timestamp on every audio chunk received
        lastActivity.put(session.getId(), System.currentTimeMillis());

        // Receive binary audio chunks (PCM 16-bit 16kHz) from the frontend
        byte[] audioBytes = message.getPayload().array();

        // TODO: In a production environment, pipe these bytes to the Gemini Multimodal Live WebSocket.
        // For now, simulate receiving audio and confirm streaming works.
        log.debug("Received {} bytes of audio from {}", audioBytes.length, session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("Telehealth WebSocket closed: {} with status {}", session.getId(), status);
        activeSessions.remove(session.getId());
        lastActivity.remove(session.getId());
    }

    /**
     * Evicts sessions idle longer than {@link #IDLE_TIMEOUT_MS}.
     * Runs on the dedicated {@link #evictionScheduler} daemon thread.
     */
    private void evictIdleSessions() {
        long now = System.currentTimeMillis();
        lastActivity.forEach((sessionId, lastActive) -> {
            if (now - lastActive > IDLE_TIMEOUT_MS) {
                WebSocketSession session = activeSessions.get(sessionId);
                if (session != null && session.isOpen()) {
                    try {
                        log.warn("Evicting idle Telehealth session {} (idle {}s)",
                                sessionId, (now - lastActive) / 1000);
                        session.close(CloseStatus.SESSION_NOT_RELIABLE);
                    } catch (IOException e) {
                        log.error("Error closing idle session {}: {}", sessionId, e.getMessage());
                    }
                }
                activeSessions.remove(sessionId);
                lastActivity.remove(sessionId);
            }
        });
    }
}
