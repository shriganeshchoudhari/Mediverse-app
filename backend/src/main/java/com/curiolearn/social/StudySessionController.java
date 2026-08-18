package com.curiolearn.social;

import com.curiolearn.social.StudySession;
import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import com.curiolearn.social.StudySessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sessions")
public class StudySessionController {

    private final StudySessionService sessionService;
    private final UserRepository userRepository;

    public StudySessionController(StudySessionService sessionService, UserRepository userRepository) {
        this.sessionService = sessionService;
        this.userRepository = userRepository;
    }

    @PostMapping("/start")
    public ResponseEntity<UUID> startSession(
            @RequestParam String lessonId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        StudySession session = sessionService.startSession(user.getId(), lessonId);
        return ResponseEntity.ok(session.getId());
    }

    @PostMapping("/{sessionId}/end")
    public ResponseEntity<Void> endSession(
            @PathVariable UUID sessionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        sessionService.endSession(user.getId(), sessionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/activity")
    public ResponseEntity<List<Map<String, Object>>> getWeeklyActivity(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<Map<String, Object>> activity = sessionService.getWeeklyActivity(user.getId());
        return ResponseEntity.ok(activity);
    }
}
