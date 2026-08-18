package com.curiolearn.aitutor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AITutorChatRequest {
    private String sessionId;
    private String message;
    private String prompt; // alternative field mapping
    private String context; // e.g. "Cardiac Cycle & Wiggers Diagram"
    private String chapterId;
    private List<ChatMessageDto> history;
}
