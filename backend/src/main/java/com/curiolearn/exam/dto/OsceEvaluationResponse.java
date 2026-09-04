package com.curiolearn.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OsceEvaluationResponse {
    private String scenarioId;
    private int totalScore;
    private boolean passed;
    private int communicationScore;
    private int diagnosticPrecisionScore;
    private int safetyScore;
    private int timeManagementScore;
    private List<StationResult> stationResults;
    private String attendingFeedback;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StationResult {
        private int stationNumber;
        private String title;
        private int score;
        private List<String> feedback;
        private List<String> safetyViolations;
    }
}
