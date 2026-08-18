package com.curiolearn.social;

import com.curiolearn.social.LeaderboardEntryDto;
import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.cache.annotation.Cacheable;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class LeaderboardService {

    private final UserRepository userRepository;

    public LeaderboardService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Cacheable(value = "leaderboard", key = "'global'")
    @Transactional(readOnly = true)
    public List<LeaderboardEntryDto> getLeaderboard() {
        List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "currentXp"));
        List<LeaderboardEntryDto> entries = new ArrayList<>();
        
        int rank = 1;
        for (User user : users) {
            String name = (user.getFirstName() != null ? user.getFirstName() : "") + " " +
                           (user.getLastName() != null ? user.getLastName() : "");
            name = name.trim();
            if (name.isEmpty()) {
                name = "Anonymous Student";
            }
            
            entries.add(LeaderboardEntryDto.builder()
                    .userId(user.getId())
                    .name(name)
                    .currentXp(user.getCurrentXp())
                    .dailyStreak(user.getDailyStreak())
                    .rank(rank++)
                    .build());
        }
        return entries;
    }

    @Transactional(readOnly = true)
    public LeaderboardEntryDto getUserRank(UUID userId) {
        List<LeaderboardEntryDto> board = getLeaderboard();
        for (LeaderboardEntryDto entry : board) {
            if (entry.getUserId().equals(userId)) {
                return entry;
            }
        }
        return null;
    }
}

