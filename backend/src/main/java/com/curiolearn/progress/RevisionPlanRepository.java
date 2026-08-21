package com.curiolearn.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface RevisionPlanRepository extends JpaRepository<RevisionPlan, UUID> {
    List<RevisionPlan> findByUserId(UUID userId);
}
