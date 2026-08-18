package com.curiolearn.simulation;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimulationRunRequestDto {
    @NotBlank(message = "Simulation type is required")
    private String simulationType;
    
    private Map<String, Object> inputParameters;
    private Map<String, Object> outcomeMetrics;
}

