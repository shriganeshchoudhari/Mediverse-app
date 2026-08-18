package com.curiolearn.simulation.controller;

import com.curiolearn.simulation.SimulationApiService;
import com.curiolearn.simulation.dto.SimulationCalculateRequestDto;
import com.curiolearn.simulation.dto.SimulationCalculateResponseDto;
import com.curiolearn.simulation.dto.SimulationCatalogItemDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/simulations")
@Tag(name = "Simulations", description = "Endpoints for physiological simulations catalog and calculation solver")
public class SimulationApiController {

    private final SimulationApiService simulationApiService;

    public SimulationApiController(SimulationApiService simulationApiService) {
        this.simulationApiService = simulationApiService;
    }

    @GetMapping("/catalog")
    @Operation(summary = "List all interactive physiological simulations and 3D organ presets")
    public ResponseEntity<List<SimulationCatalogItemDto>> getCatalog() {
        return ResponseEntity.ok(simulationApiService.getCatalog());
    }

    @PostMapping("/calculate")
    @Operation(summary = "Validate and calculate physiological simulation parameters")
    public ResponseEntity<SimulationCalculateResponseDto> calculate(
            @RequestBody(required = false) SimulationCalculateRequestDto request) {
        SimulationCalculateRequestDto req = (request != null) ? request : new SimulationCalculateRequestDto();
        return ResponseEntity.ok(simulationApiService.calculate(req));
    }

    @PostMapping("/{id}/calculate")
    @Operation(summary = "Validate and calculate physiological simulation parameters for specific simulation ID")
    public ResponseEntity<SimulationCalculateResponseDto> calculateById(
            @PathVariable String id,
            @RequestBody(required = false) SimulationCalculateRequestDto request) {
        SimulationCalculateRequestDto req = (request != null) ? request : new SimulationCalculateRequestDto();
        return ResponseEntity.ok(simulationApiService.calculate(req));
    }
}
