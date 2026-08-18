package com.curiolearn.curriculum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Request body for submitting a review decision on a Lesson. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDecisionRequest {
    private String comments;
}
