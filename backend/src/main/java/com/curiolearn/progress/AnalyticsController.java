package com.curiolearn.progress;

import com.curiolearn.progress.AnalyticsSpacedRepetitionDto;
import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import com.curiolearn.progress.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    public AnalyticsController(AnalyticsService analyticsService, UserRepository userRepository) {
        this.analyticsService = analyticsService;
        this.userRepository = userRepository;
    }

    @GetMapping("/spaced-repetition")
    public ResponseEntity<AnalyticsSpacedRepetitionDto> getSpacedRepetitionStats(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        AnalyticsSpacedRepetitionDto stats = analyticsService.getSpacedRepetitionStats(user.getId());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/streak")
    public ResponseEntity<Map<String, Integer>> getStreakCalendar(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Integer> calendarMap = analyticsService.getStreakCalendar(user.getId());
        return ResponseEntity.ok(calendarMap);
    }
}

