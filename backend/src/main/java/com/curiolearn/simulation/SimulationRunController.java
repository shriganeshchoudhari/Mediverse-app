package com.curiolearn.simulation;

import com.curiolearn.simulation.SimulationRunDto;
import com.curiolearn.simulation.SimulationRunRequestDto;
import com.curiolearn.simulation.SimulationRun;
import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import com.curiolearn.simulation.SimulationRunService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/simulations")
@PreAuthorize("isAuthenticated()")
public class SimulationRunController {

    private final SimulationRunService simulationRunService;
    private final UserRepository userRepository;

    public SimulationRunController(SimulationRunService simulationRunService, UserRepository userRepository) {
        this.simulationRunService = simulationRunService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<SimulationRunDto>> getMySimulations(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<SimulationRun> runs = simulationRunService.getSimulationRuns(user.getId());
        List<SimulationRunDto> dtos = runs.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<SimulationRunDto> saveSimulation(
            @Valid @RequestBody SimulationRunRequestDto request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        SimulationRun run = simulationRunService.saveSimulationRun(
                user.getId(),
                request.getSimulationType(),
                request.getInputParameters(),
                request.getOutcomeMetrics()
        );

        return ResponseEntity.ok(mapToDto(run));
    }

    private SimulationRunDto mapToDto(SimulationRun run) {
        return SimulationRunDto.builder()
                .id(run.getId())
                .simulationType(run.getSimulationType())
                .inputParameters(run.getInputParameters())
                .outcomeMetrics(run.getOutcomeMetrics())
                .executedAt(run.getExecutedAt())
                .build();
    }
}

