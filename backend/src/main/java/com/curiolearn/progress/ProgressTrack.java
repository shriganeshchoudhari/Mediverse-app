package com.curiolearn.progress;
import com.curiolearn.user.User;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "progress_tracks",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "lesson_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String lessonId; // e.g. homeostasis

    @Column(nullable = false)
    private int completionPercentage;

    @Column(nullable = false)
    private boolean completed;

    @Column(nullable = false)
    private LocalDateTime lastAccessed;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastAccessed = LocalDateTime.now();
    }
}

