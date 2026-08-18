package com.curiolearn.progress;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AnalyticsSpacedRepetitionDto {
    private int totalCards;
    private int dueToday;
    private double averageRetention;
    private List<RetentionDataDto> retentionData;
    private List<FutureDueDataDto> futureDueData;
}

