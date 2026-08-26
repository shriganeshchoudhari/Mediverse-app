package com.curiolearn.progress;

import com.curiolearn.progress.ProgressDto;
import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import com.curiolearn.progress.ProgressService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/progress")
@PreAuthorize("isAuthenticated()")
public class ProgressController {

    private final ProgressService progressService;
    private final UserRepository userRepository;

    public ProgressController(ProgressService progressService, UserRepository userRepository) {
        this.progressService = progressService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<ProgressDto>> getProgress(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<ProgressDto> progress = progressService.getProgress(user.getId());
        return ResponseEntity.ok(progress);
    }

    @PostMapping("/{lessonId}")
    public ResponseEntity<ProgressDto> updateProgress(
            @PathVariable String lessonId,
            @Valid @RequestBody ProgressDto request,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        ProgressDto responseDto = progressService.updateProgress(user.getId(), lessonId, request);
        return ResponseEntity.ok(responseDto);
    }
}

