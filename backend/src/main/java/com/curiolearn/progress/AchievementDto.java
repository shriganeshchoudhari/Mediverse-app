package com.curiolearn.progress;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchievementDto {
    private UUID id;
    private String code;
    private String title;
    private String description;
    private String iconEmoji;
    private int xpReward;
    private boolean earned;
    private String earnedAt;
}
