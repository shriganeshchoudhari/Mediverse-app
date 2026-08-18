package com.curiolearn.progress;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "achievements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String title;

    private String description;
    private String iconEmoji;

    @Builder.Default
    private int xpReward = 0;

    @Column(nullable = false)
    private String criteriaType; // STREAK, XP, LESSONS_COMPLETED, QUIZ_SCORE

    @Column(nullable = false)
    private int criteriaValue;
}

