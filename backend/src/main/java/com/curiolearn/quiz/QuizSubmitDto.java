package com.curiolearn.quiz;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSubmitDto {
    private List<AnswerDto> answers;
    private Integer timeTakenSeconds;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnswerDto {
        private String questionId;
        private String selectedOption; // A, B, C, D
    }
}
