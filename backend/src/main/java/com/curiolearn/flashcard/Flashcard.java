package com.curiolearn.flashcard;
import com.curiolearn.user.User;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "flashcards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flashcard {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String lessonId;

    @Column(length = 50)
    private String domain; // e.g., ALLOPATHIC, DENTAL, AYUSH

    @Column(length = 50)
    private String programCode; // e.g., MBBS, BDS, BAMS

    @Column(nullable = false, columnDefinition = "TEXT")
    private String frontText;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String backText;

    @Builder.Default
    private int intervalDays = 0;

    @Builder.Default
    private double easeFactor = 2.5;

    @Column(nullable = false)
    private LocalDateTime nextReviewAt;

    @PrePersist
    protected void onCreate() {
        if (nextReviewAt == null) {
            nextReviewAt = LocalDateTime.now();
        }
    }
}

