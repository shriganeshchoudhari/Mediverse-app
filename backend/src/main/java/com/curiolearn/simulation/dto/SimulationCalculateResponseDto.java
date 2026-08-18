package com.curiolearn.simulation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulationCalculateResponseDto {
    private double strokeVolume;
    private double ejectionFraction;
    private double cardiacOutput;
    private double endSystolicVolume;
    private double endDiastolicVolume;
    private double meanArterialPressure;
    private List<PvLoopCoordinateDto> pvLoopCoordinates;
    private Map<String, Object> additionalMetrics;
}
