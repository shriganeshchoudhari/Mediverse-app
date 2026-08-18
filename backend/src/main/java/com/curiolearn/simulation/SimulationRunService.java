package com.curiolearn.simulation;

import com.curiolearn.simulation.SimulationRun;
import com.curiolearn.user.User;
import com.curiolearn.simulation.SimulationRunRepository;
import com.curiolearn.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class SimulationRunService {

    private final SimulationRunRepository simulationRunRepository;
    private final UserRepository userRepository;

    public SimulationRunService(SimulationRunRepository simulationRunRepository, UserRepository userRepository) {
        this.simulationRunRepository = simulationRunRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<SimulationRun> getSimulationRuns(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return simulationRunRepository.findByUser(user);
    }

    @Transactional
    public SimulationRun saveSimulationRun(UUID userId, String simulationType, Map<String, Object> inputParams, Map<String, Object> outcomeMetrics) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        SimulationRun run = SimulationRun.builder()
                .user(user)
                .simulationType(simulationType)
                .inputParameters(inputParams)
                .outcomeMetrics(outcomeMetrics)
                .build();

        return simulationRunRepository.save(run);
    }
}

