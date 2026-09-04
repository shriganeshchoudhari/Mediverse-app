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
public class OsceEvaluationRequest {
    private String scenarioId;
    private int timeRemainingSeconds;
    private List<ActionEntry> actions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActionEntry {
        private String stationId;
        private String actionType;
        private String detail;
        private boolean isContraindicated;
    }
}
