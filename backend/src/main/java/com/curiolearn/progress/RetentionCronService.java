package com.curiolearn.progress;

import com.curiolearn.progress.RetentionSnapshot;
import com.curiolearn.progress.RetentionSnapshotRepository;
import com.curiolearn.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class RetentionCronService {

    private final RetentionSnapshotRepository retentionSnapshotRepository;
    private final UserRepository userRepository;

    @Scheduled(cron = "0 0 0 * * ?") // Midnight every day
    @Transactional
    public void generateDailyRetentionSnapshot() {
        long totalUsers = userRepository.count();
        long activeToday = userRepository.countActiveUsersToday();
        double avgXp = userRepository.getAverageXp();
        double avgStreak = userRepository.getAverageStreak();

        RetentionSnapshot snapshot = new RetentionSnapshot(
                LocalDate.now(),
                totalUsers,
                activeToday,
                avgXp,
                avgStreak
        );

        retentionSnapshotRepository.save(snapshot);
        System.out.println("Generated daily retention snapshot for " + snapshot.getSnapshotDate());
    }
}

