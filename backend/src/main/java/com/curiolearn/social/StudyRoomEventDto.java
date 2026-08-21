package com.curiolearn.social;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StudyRoomEventDto {

    public enum EventType {
        JOIN_ROOM,
        LEAVE_ROOM,
        PEER_JOINED,
        PEER_LEFT,
        SIGNAL_OFFER,
        SIGNAL_ANSWER,
        SIGNAL_ICE,
        SYNC_3D_STATE,
        CLAIM_PRESENTER,
        CHAT_MESSAGE,
        WHITEBOARD_DRAW,
        ROOM_STATE
    }

    private EventType type;
    private String roomId;
    private String senderId;
    private String senderName;
    private String targetId;
    private Boolean isPresenter;
    private Long timestamp;
    private String text;
    private Map<String, Object> payload;
}
