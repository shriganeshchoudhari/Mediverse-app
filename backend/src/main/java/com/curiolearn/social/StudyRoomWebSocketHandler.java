package com.curiolearn.social;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class StudyRoomWebSocketHandler extends TextWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(StudyRoomWebSocketHandler.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Map of RoomId -> Set of Active WebSocket Sessions
    private final Map<String, Set<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();
    
    // Map of SessionId -> RoomId
    private final Map<String, String> sessionRoomMap = new ConcurrentHashMap<>();
    
    // Map of SessionId -> Peer User Details (id, name)
    private final Map<String, Map<String, String>> sessionPeerMap = new ConcurrentHashMap<>();
    
    // Map of RoomId -> Current Presenter SessionId
    private final Map<String, String> roomPresenters = new ConcurrentHashMap<>();
    
    // Map of RoomId -> Last 3D Sync State
    private final Map<String, Map<String, Object>> room3DStates = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.debug("WebSocket connection established: session {}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        StudyRoomEventDto event = objectMapper.readValue(message.getPayload(), StudyRoomEventDto.class);
        if (event == null || event.getType() == null) return;

        String roomId = event.getRoomId();
        if (roomId == null && sessionRoomMap.containsKey(session.getId())) {
            roomId = sessionRoomMap.get(session.getId());
            event.setRoomId(roomId);
        }

        switch (event.getType()) {
            case JOIN_ROOM -> handleJoinRoom(session, event);
            case LEAVE_ROOM -> handleLeaveRoom(session);
            case SIGNAL_OFFER, SIGNAL_ANSWER, SIGNAL_ICE -> handleWebRTCSignaling(session, event);
            case SYNC_3D_STATE -> handle3DSync(session, event);
            case CLAIM_PRESENTER -> handleClaimPresenter(session, event);
            case CHAT_MESSAGE, WHITEBOARD_DRAW -> broadcastToRoom(roomId, session, event);
            default -> log.warn("Unhandled study room event type: {}", event.getType());
        }
    }

    private void handleJoinRoom(WebSocketSession session, StudyRoomEventDto event) throws IOException {
        String roomId = event.getRoomId();
        String userId = event.getSenderId() != null ? event.getSenderId() : UUID.randomUUID().toString();
        String userName = event.getSenderName() != null ? event.getSenderName() : "Student";

        sessionRoomMap.put(session.getId(), roomId);
        sessionPeerMap.put(session.getId(), Map.of("userId", userId, "userName", userName, "sessionId", session.getId()));

        roomSessions.computeIfAbsent(roomId, k -> new CopyOnWriteArraySet<>()).add(session);

        // If first user, make them presenter by default
        if (!roomPresenters.containsKey(roomId)) {
            roomPresenters.put(roomId, session.getId());
        }

        // Collect existing peers in room
        List<Map<String, String>> peers = new ArrayList<>();
        for (WebSocketSession s : roomSessions.get(roomId)) {
            if (!s.getId().equals(session.getId()) && sessionPeerMap.containsKey(s.getId())) {
                peers.add(sessionPeerMap.get(s.getId()));
            }
        }

        // Send ROOM_STATE to joining peer
        StudyRoomEventDto roomState = StudyRoomEventDto.builder()
                .type(StudyRoomEventDto.EventType.ROOM_STATE)
                .roomId(roomId)
                .senderId("SYSTEM")
                .isPresenter(session.getId().equals(roomPresenters.get(roomId)))
                .payload(Map.of(
                        "peers", peers,
                        "presenterSessionId", roomPresenters.getOrDefault(roomId, ""),
                        "last3DState", room3DStates.getOrDefault(roomId, Collections.emptyMap())
                ))
                .timestamp(System.currentTimeMillis())
                .build();
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(roomState)));

        // Notify other peers in room that a new peer joined
        StudyRoomEventDto peerJoined = StudyRoomEventDto.builder()
                .type(StudyRoomEventDto.EventType.PEER_JOINED)
                .roomId(roomId)
                .senderId(userId)
                .senderName(userName)
                .payload(Map.of("sessionId", session.getId(), "userId", userId, "userName", userName))
                .timestamp(System.currentTimeMillis())
                .build();
        broadcastToRoom(roomId, session, peerJoined);
    }

    private void handleLeaveRoom(WebSocketSession session) throws IOException {
        String roomId = sessionRoomMap.remove(session.getId());
        Map<String, String> peerInfo = sessionPeerMap.remove(session.getId());

        if (roomId != null && roomSessions.containsKey(roomId)) {
            Set<WebSocketSession> sessions = roomSessions.get(roomId);
            sessions.remove(session);

            if (sessions.isEmpty()) {
                roomSessions.remove(roomId);
                roomPresenters.remove(roomId);
                room3DStates.remove(roomId);
            } else {
                // If presenter left, reassign presenter to next available peer
                if (session.getId().equals(roomPresenters.get(roomId))) {
                    WebSocketSession nextPresenter = sessions.iterator().next();
                    roomPresenters.put(roomId, nextPresenter.getId());
                }

                // Notify remaining peers
                if (peerInfo != null) {
                    StudyRoomEventDto peerLeft = StudyRoomEventDto.builder()
                            .type(StudyRoomEventDto.EventType.PEER_LEFT)
                            .roomId(roomId)
                            .senderId(peerInfo.get("userId"))
                            .senderName(peerInfo.get("userName"))
                            .payload(Map.of("sessionId", session.getId(), "newPresenterSessionId", roomPresenters.getOrDefault(roomId, "")))
                            .timestamp(System.currentTimeMillis())
                            .build();
                    broadcastToRoom(roomId, null, peerLeft);
                }
            }
        }
    }

    private void handleWebRTCSignaling(WebSocketSession session, StudyRoomEventDto event) throws IOException {
        String targetSessionId = event.getTargetId();
        if (targetSessionId == null) return;

        String roomId = sessionRoomMap.get(session.getId());
        if (roomId == null) return;

        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if (sessions == null) return;

        for (WebSocketSession target : sessions) {
            if (target.getId().equals(targetSessionId) && target.isOpen()) {
                // Inject sender sessionId as target reply destination
                event.setSenderId(session.getId());
                target.sendMessage(new TextMessage(objectMapper.writeValueAsString(event)));
                break;
            }
        }
    }

    private void handle3DSync(WebSocketSession session, StudyRoomEventDto event) throws IOException {
        String roomId = sessionRoomMap.get(session.getId());
        if (roomId == null) return;

        if (event.getPayload() != null) {
            room3DStates.put(roomId, event.getPayload());
        }
        broadcastToRoom(roomId, session, event);
    }

    private void handleClaimPresenter(WebSocketSession session, StudyRoomEventDto event) throws IOException {
        String roomId = sessionRoomMap.get(session.getId());
        if (roomId == null) return;

        roomPresenters.put(roomId, session.getId());
        event.setIsPresenter(true);
        event.setPayload(Map.of("presenterSessionId", session.getId()));
        broadcastToRoom(roomId, null, event);
    }

    private void broadcastToRoom(String roomId, WebSocketSession sender, StudyRoomEventDto event) throws IOException {
        if (roomId == null || !roomSessions.containsKey(roomId)) return;
        String json = objectMapper.writeValueAsString(event);
        TextMessage textMessage = new TextMessage(json);

        for (WebSocketSession s : roomSessions.get(roomId)) {
            if ((sender == null || !s.getId().equals(sender.getId())) && s.isOpen()) {
                try {
                    s.sendMessage(textMessage);
                } catch (IOException e) {
                    log.error("Failed to send message to session {}: {}", s.getId(), e.getMessage());
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        handleLeaveRoom(session);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("WebSocket transport error for session {}: {}", session.getId(), exception.getMessage());
        handleLeaveRoom(session);
    }

    // Diagnostic accessors for unit tests
    public int getActiveRoomCount() {
        return roomSessions.size();
    }

    public int getPeerCount(String roomId) {
        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        return sessions != null ? sessions.size() : 0;
    }
}
