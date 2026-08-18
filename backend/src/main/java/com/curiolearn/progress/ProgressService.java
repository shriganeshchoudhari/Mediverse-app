package com.curiolearn.progress;

import com.curiolearn.progress.ProgressDto;
import com.curiolearn.progress.ProgressTrack;
import com.curiolearn.user.User;
import com.curiolearn.progress.ProgressTrackRepository;
import com.curiolearn.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.cache.annotation.CacheEvict;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    private final ProgressTrackRepository progressRepository;
    private final UserRepository userRepository;
    private final AchievementService achievementService;

    public ProgressService(ProgressTrackRepository progressRepository, 
                           UserRepository userRepository,
                           AchievementService achievementService) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.achievementService = achievementService;
    }

    @Transactional(readOnly = true)
    public List<ProgressDto> getProgress(UUID userId) {
        User user = findUserById(userId);
        List<ProgressTrack> tracks = progressRepository.findByUser(user);

        return tracks.stream()
                .map(t -> ProgressDto.builder()
                        .lessonId(t.getLessonId())
                        .completionPercentage(t.getCompletionPercentage())
                        .completed(t.isCompleted())
                        .build())
                .collect(Collectors.toList());
    }

    @CacheEvict(value = "leaderboard", allEntries = true)
    @Transactional
    public ProgressDto updateProgress(UUID userId, String lessonId, ProgressDto request) {
        User user = findUserById(userId);
        ProgressTrack track = progressRepository.findByUserAndLessonId(user, lessonId)
                .orElse(ProgressTrack.builder()
                        .user(user)
                        .lessonId(lessonId)
                        .build());

        boolean previouslyCompleted = track.isCompleted();
        track.setCompletionPercentage(request.getCompletionPercentage());
        track.setCompleted(request.getCompletionPercentage() >= 100);
        track.setLastAccessed(LocalDateTime.now());

        progressRepository.save(track);

        // Date-aware Daily Streak calculation
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDate lastStudy = user.getLastStudyDate();

        if (lastStudy == null) {
            user.setDailyStreak(1);
            user.setLastStudyDate(today);
        } else if (lastStudy.isBefore(today)) {
            if (lastStudy.equals(today.minusDays(1))) {
                user.setDailyStreak(user.getDailyStreak() + 1);
            } else {
                user.setDailyStreak(1);
            }
            user.setLastStudyDate(today);
        }

        // Gamification check: award XP points on first completion
        if (track.isCompleted() && !previouslyCompleted) {
            user.setCurrentXp(user.getCurrentXp() + 100);
            
            achievementService.checkAndUnlockAchievements(user.getId(), "STREAK", user.getDailyStreak());
            achievementService.checkAndUnlockAchievements(user.getId(), "XP", user.getCurrentXp());
        }
        
        userRepository.save(user);

        return ProgressDto.builder()
                .lessonId(track.getLessonId())
                .completionPercentage(track.getCompletionPercentage())
                .completed(track.isCompleted())
                .build();
    }

    private User findUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}

