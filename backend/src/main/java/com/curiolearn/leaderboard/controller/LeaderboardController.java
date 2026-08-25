package com.curiolearn.leaderboard.controller;

import com.curiolearn.leaderboard.model.OsceScore;
import com.curiolearn.leaderboard.repository.OsceScoreRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/leaderboards")
public class LeaderboardController {
    
    private final OsceScoreRepository osceScoreRepository;

    public LeaderboardController(OsceScoreRepository osceScoreRepository) {
        this.osceScoreRepository = osceScoreRepository;
    }

    @GetMapping("/osce/{scenarioId}")
    public List<OsceScore> getTopScores(@PathVariable String scenarioId) {
        return osceScoreRepository.findTop50ByScenarioIdOrderByScorePercentageDescCompletionTimeSecondsAsc(scenarioId);
    }
}
