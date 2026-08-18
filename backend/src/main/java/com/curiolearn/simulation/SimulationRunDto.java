package com.curiolearn.simulation;

import lombok.*;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimulationRunDto {
    private UUID id;
    private String simulationType;
    private Map<String, Object> inputParameters;
    private Map<String, Object> outcomeMetrics;
    private LocalDateTime executedAt;
}

