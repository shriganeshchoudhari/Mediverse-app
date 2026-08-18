package com.curiolearn.progress;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressDto {

    private String lessonId;


    @Min(value = 0, message = "Percentage cannot be negative")
    @Max(value = 100, message = "Percentage cannot exceed 100")
    private int completionPercentage;

    private boolean completed;
}

