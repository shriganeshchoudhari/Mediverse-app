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

import org.springframework.stereotype.Component;

@Component
public class TelehealthWebSocketHandler extends BinaryWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(TelehealthWebSocketHandler.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, WebSocketSession> activeSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("Telehealth WebSocket connected: {}", session.getId());
        activeSessions.put(session.getId(), session);
        
        // Initial setup payload (mocking connection to Gemini Live)
        session.sendMessage(new TextMessage("{\"type\":\"connection_established\",\"message\":\"Connected to AI Patient Simulator\"}"));
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws Exception {
        // Receive binary audio chunks (PCM 16-bit 16kHz) from the frontend
        byte[] audioBytes = message.getPayload().array();
        
        // TODO: In a production environment, we pipe these bytes to the Gemini Multimodal Live WebSocket.
        // For now, we simulate receiving audio and sending back a dummy transcript/audio after a delay.
        
        // This is a placeholder log to confirm streaming works
        log.debug("Received {} bytes of audio from {}", audioBytes.length, session.getId());
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("Telehealth WebSocket closed: {} with status {}", session.getId(), status);
        activeSessions.remove(session.getId());
    }
}


