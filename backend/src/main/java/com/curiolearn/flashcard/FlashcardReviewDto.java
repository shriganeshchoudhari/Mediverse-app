package com.curiolearn.flashcard;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashcardReviewDto {

    @Min(value = 1, message = "Rating must be at least 1 (Again)")
    @Max(value = 4, message = "Rating cannot exceed 4 (Easy)")
    private int rating; // 1 = Again, 2 = Hard, 3 = Good, 4 = Easy
}

