package com.curiolearn.social;

import com.curiolearn.social.LeaderboardEntryDto;
import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import com.curiolearn.social.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;
    private final UserRepository userRepository;

    public LeaderboardController(LeaderboardService leaderboardService, UserRepository userRepository) {
        this.leaderboardService = leaderboardService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<LeaderboardEntryDto>> getLeaderboard(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(leaderboardService.getLeaderboard());
    }

    @GetMapping("/me")
    public ResponseEntity<LeaderboardEntryDto> getMyRank(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(leaderboardService.getUserRank(user.getId()));
    }
}
