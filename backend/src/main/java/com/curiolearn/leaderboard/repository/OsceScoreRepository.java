package com.curiolearn.leaderboard.repository;

import com.curiolearn.leaderboard.model.OsceScore;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface OsceScoreRepository extends JpaRepository<OsceScore, UUID> {
    List<OsceScore> findTop50ByScenarioIdOrderByScorePercentageDescCompletionTimeSecondsAsc(String scenarioId);
}
