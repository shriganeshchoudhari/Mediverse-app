package com.curiolearn.quiz;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResultDto {
    private int score;
    private int totalQuestions;
    private int xpEarned;
    private boolean passed;
    private String explanationMarkup;
}
