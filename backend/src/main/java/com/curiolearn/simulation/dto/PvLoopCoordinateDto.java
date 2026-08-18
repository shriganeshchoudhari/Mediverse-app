package com.curiolearn.simulation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PvLoopCoordinateDto {
    private double volume;
    private double pressure;
    private String phase;
}
