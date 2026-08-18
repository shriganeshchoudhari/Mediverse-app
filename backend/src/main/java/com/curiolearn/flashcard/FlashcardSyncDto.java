package com.curiolearn.flashcard;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashcardSyncDto {
    private String frontText;
    private String backText;
}

