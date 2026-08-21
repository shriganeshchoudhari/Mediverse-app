package com.curiolearn.simulation;

import com.curiolearn.simulation.SimulationRun;
import com.curiolearn.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SimulationRunRepository extends JpaRepository<SimulationRun, UUID> {
    List<SimulationRun> findByUser(User user);
}

