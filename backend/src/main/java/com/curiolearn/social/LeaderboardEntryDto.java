package com.curiolearn.social;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardEntryDto {
    private UUID userId;
    private String name;
    private int currentXp;
    private int dailyStreak;
    private int rank;
}
