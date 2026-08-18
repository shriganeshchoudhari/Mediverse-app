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
public class SimulationCatalogItemDto {
    private String id;
    private String code;
    private String name;
    private String description;
    private String category;
    private String modelAssetUrl;
    private Map<String, Object> defaultParameters;
    private Map<String, Object> parameterMetadata;
    private List<String> keyFormulas;
}
