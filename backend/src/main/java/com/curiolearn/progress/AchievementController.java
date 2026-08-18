package com.curiolearn.progress;

import com.curiolearn.progress.AchievementDto;
import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import com.curiolearn.progress.AchievementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/achievements")
public class AchievementController {

    private final AchievementService achievementService;
    private final UserRepository userRepository;

    public AchievementController(AchievementService achievementService, UserRepository userRepository) {
        this.achievementService = achievementService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<AchievementDto>> getAchievements(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(achievementService.getAchievements(user.getId()));
    }
}
