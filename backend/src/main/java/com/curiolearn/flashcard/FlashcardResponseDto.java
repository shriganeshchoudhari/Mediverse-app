package com.curiolearn.flashcard;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashcardResponseDto {
    private UUID id;
    private String lessonId;
    private String frontText;
    private String backText;
    private int intervalDays;
    private double easeFactor;
    private LocalDateTime nextReviewAt;
}

