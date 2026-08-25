package com.curiolearn.leaderboard.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "osce_scores")
@Data
public class OsceScore {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private UUID userId;
    private String username;
    private String avatarUrl;
    private String scenarioId;
    private BigDecimal scorePercentage;
    private Integer completionTimeSeconds;
    
    @Column(insertable = false, updatable = false)
    private ZonedDateTime achievedAt;
}
