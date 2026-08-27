package com.curiolearn.progress;

import com.curiolearn.progress.RetentionSnapshot;
import com.curiolearn.progress.RetentionSnapshotRepository;
import com.curiolearn.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class RetentionCronService {

    private static final Logger log = LoggerFactory.getLogger(RetentionCronService.class);

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
        log.info("Generated daily retention snapshot for {}: totalUsers={}, activeToday={}, avgXp={}, avgStreak={}",
                snapshot.getSnapshotDate(), totalUsers, activeToday, avgXp, avgStreak);
    }
}


