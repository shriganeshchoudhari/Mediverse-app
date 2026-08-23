package com.curiolearn.curriculum;

import lombok.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateLessonRequestDto {
    private String title;
    private UUID conceptId;
    private String difficulty;
    private List<BlockPayload> blocks;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BlockPayload {
        private String type; // EXPLANATION, QUIZ, FLASHCARD, CLINICAL_CASE, 3D_MODEL
        private int orderIndex;
        private Map<String, Object> metadata;
    }
}
