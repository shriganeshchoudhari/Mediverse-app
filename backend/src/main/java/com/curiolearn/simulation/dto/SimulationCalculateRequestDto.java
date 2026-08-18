package com.curiolearn.simulation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulationCalculateRequestDto {
    private Double preloadEdv;
    private Double afterloadSvr;
    private Double inotropyEes;
    private Double heartRate;
    private String simulationType;
    private Map<String, Object> customParameters;
}
