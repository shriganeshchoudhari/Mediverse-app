package com.curiolearn.progress;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "retention_snapshots")
@Data
@NoArgsConstructor
public class RetentionSnapshot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private LocalDate snapshotDate;

    private long totalUsers;
    
    private long activeUsersToday;

    private double averageXp;
    
    private double averageStreak;

    private LocalDateTime createdAt = LocalDateTime.now();

    public RetentionSnapshot(LocalDate snapshotDate, long totalUsers, long activeUsersToday, double averageXp, double averageStreak) {
        this.snapshotDate = snapshotDate;
        this.totalUsers = totalUsers;
        this.activeUsersToday = activeUsersToday;
        this.averageXp = averageXp;
        this.averageStreak = averageStreak;
    }
}

