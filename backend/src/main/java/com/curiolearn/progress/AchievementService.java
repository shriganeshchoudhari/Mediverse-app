package com.curiolearn.progress;

import com.curiolearn.progress.AchievementDto;
import com.curiolearn.progress.Achievement;
import com.curiolearn.progress.UserAchievement;
import com.curiolearn.user.User;
import com.curiolearn.progress.AchievementRepository;
import com.curiolearn.progress.UserAchievementRepository;
import com.curiolearn.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final UserRepository userRepository;

    public AchievementService(AchievementRepository achievementRepository, 
                              UserAchievementRepository userAchievementRepository, 
                              UserRepository userRepository) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AchievementDto> getAchievements(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<Achievement> allAchievements = achievementRepository.findAll();
        List<UserAchievement> earnedAchievements = userAchievementRepository.findByUser(user);
        
        Map<UUID, UserAchievement> earnedMap = earnedAchievements.stream()
                .collect(Collectors.toMap(ua -> ua.getAchievement().getId(), ua -> ua));

        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

        return allAchievements.stream()
                .map(a -> {
                    UserAchievement earned = earnedMap.get(a.getId());
                    return AchievementDto.builder()
                            .id(a.getId())
                            .code(a.getCode())
                            .title(a.getTitle())
                            .description(a.getDescription())
                            .iconEmoji(a.getIconEmoji())
                            .xpReward(a.getXpReward())
                            .earned(earned != null)
                            .earnedAt(earned != null ? earned.getEarnedAt().format(formatter) : null)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void checkAndUnlockAchievements(UUID userId, String criteriaType, int currentValue) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        List<Achievement> achievements = achievementRepository.findAll();
        for (Achievement a : achievements) {
            if (a.getCriteriaType().equalsIgnoreCase(criteriaType) && currentValue >= a.getCriteriaValue()) {
                boolean alreadyEarned = userAchievementRepository.existsByUserAndAchievement(user, a);
                if (!alreadyEarned) {
                    UserAchievement ua = UserAchievement.builder()
                            .user(user)
                            .achievement(a)
                            .build();
                    userAchievementRepository.save(ua);

                    // Reward XP
                    user.setCurrentXp(user.getCurrentXp() + a.getXpReward());
                    userRepository.save(user);
                }
            }
        }
    }
}

