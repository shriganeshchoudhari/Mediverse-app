package com.curiolearn.aitutor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    private String role; // "user" or "assistant" / "model"
    private String content;
    private String text; // alternative field mapping
}
