package com.curiolearn.social;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StudyRoomWebSocketHandlerTest {

    private StudyRoomWebSocketHandler handler;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        handler = new StudyRoomWebSocketHandler();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("Peer joining a room registers session and sends room state")
    void testJoinRoom() throws Exception {
        WebSocketSession session1 = mock(WebSocketSession.class);
        when(session1.getId()).thenReturn("session-1");
        when(session1.isOpen()).thenReturn(true);

        StudyRoomEventDto joinEvent = StudyRoomEventDto.builder()
                .type(StudyRoomEventDto.EventType.JOIN_ROOM)
                .roomId("room-cardiology-101")
                .senderId("user-1")
                .senderName("Dr. Rao")
                .build();

        handler.handleTextMessage(session1, new TextMessage(objectMapper.writeValueAsString(joinEvent)));

        assertEquals(1, handler.getActiveRoomCount());
        assertEquals(1, handler.getPeerCount("room-cardiology-101"));

        // Verify session1 received ROOM_STATE message
        verify(session1, atLeastOnce()).sendMessage(any(TextMessage.class));
    }

    @Test
    @DisplayName("Multiple peers joining a room broadcast peer joined event")
    void testMultiPeerJoinAndBroadcast() throws Exception {
        WebSocketSession session1 = mock(WebSocketSession.class);
        when(session1.getId()).thenReturn("session-1");
        when(session1.isOpen()).thenReturn(true);

        WebSocketSession session2 = mock(WebSocketSession.class);
        when(session2.getId()).thenReturn("session-2");
        when(session2.isOpen()).thenReturn(true);

        // Session 1 joins
        StudyRoomEventDto join1 = StudyRoomEventDto.builder()
                .type(StudyRoomEventDto.EventType.JOIN_ROOM)
                .roomId("room-ortho-202")
                .senderId("user-1")
                .senderName("Dr. Rao")
                .build();
        handler.handleTextMessage(session1, new TextMessage(objectMapper.writeValueAsString(join1)));

        // Session 2 joins
        StudyRoomEventDto join2 = StudyRoomEventDto.builder()
                .type(StudyRoomEventDto.EventType.JOIN_ROOM)
                .roomId("room-ortho-202")
                .senderId("user-2")
                .senderName("Dr. Anita")
                .build();
        handler.handleTextMessage(session2, new TextMessage(objectMapper.writeValueAsString(join2)));

        assertEquals(2, handler.getPeerCount("room-ortho-202"));

        // Verify session 1 received notification about session 2 joining
        verify(session1, atLeast(2)).sendMessage(any(TextMessage.class));
    }

    @Test
    @DisplayName("3D state sync is broadcast to other peers in room")
    void test3DStateSync() throws Exception {
        WebSocketSession session1 = mock(WebSocketSession.class);
        when(session1.getId()).thenReturn("session-1");
        when(session1.isOpen()).thenReturn(true);

        WebSocketSession session2 = mock(WebSocketSession.class);
        when(session2.getId()).thenReturn("session-2");
        when(session2.isOpen()).thenReturn(true);

        StudyRoomEventDto join1 = StudyRoomEventDto.builder()
                .type(StudyRoomEventDto.EventType.JOIN_ROOM)
                .roomId("room-anatomy-303")
                .senderId("user-1")
                .build();
        handler.handleTextMessage(session1, new TextMessage(objectMapper.writeValueAsString(join1)));

        StudyRoomEventDto join2 = StudyRoomEventDto.builder()
                .type(StudyRoomEventDto.EventType.JOIN_ROOM)
                .roomId("room-anatomy-303")
                .senderId("user-2")
                .build();
        handler.handleTextMessage(session2, new TextMessage(objectMapper.writeValueAsString(join2)));

        // Reset mock call counters
        Mockito.clearInvocations(session2);

        // Session 1 sends 3D model rotation
        StudyRoomEventDto sync3D = StudyRoomEventDto.builder()
                .type(StudyRoomEventDto.EventType.SYNC_3D_STATE)
                .roomId("room-anatomy-303")
                .senderId("user-1")
                .payload(Map.of(
                        "modelId", "heart-3d",
                        "quaternion", Map.of("x", 0.0, "y", 0.707, "z", 0.0, "w", 0.707),
                        "zoom", 1.5
                ))
                .build();

        handler.handleTextMessage(session1, new TextMessage(objectMapper.writeValueAsString(sync3D)));

        // Verify session 2 received the 3D sync payload
        verify(session2, times(1)).sendMessage(any(TextMessage.class));
    }

    @Test
    @DisplayName("Session disconnection cleans up room state")
    void testDisconnectCleanup() throws Exception {
        WebSocketSession session1 = mock(WebSocketSession.class);
        when(session1.getId()).thenReturn("session-1");
        when(session1.isOpen()).thenReturn(true);

        StudyRoomEventDto join = StudyRoomEventDto.builder()
                .type(StudyRoomEventDto.EventType.JOIN_ROOM)
                .roomId("room-temp-999")
                .senderId("user-1")
                .build();
        handler.handleTextMessage(session1, new TextMessage(objectMapper.writeValueAsString(join)));

        assertEquals(1, handler.getActiveRoomCount());

        handler.afterConnectionClosed(session1, CloseStatus.NORMAL);

        assertEquals(0, handler.getActiveRoomCount());
        assertEquals(0, handler.getPeerCount("room-temp-999"));
    }
}
