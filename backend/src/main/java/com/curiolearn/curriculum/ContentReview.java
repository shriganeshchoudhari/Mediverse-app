package com.curiolearn.curriculum;

import com.curiolearn.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Audit record of a single review decision on a {@link Lesson}.
 * Part of the DRAFT -> IN_REVIEW -> (APPROVED|REJECTED) -> PUBLISHED
 * content workflow (see LessonStatus).
 */
@Entity
@Table(name = "content_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ContentReview {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @Column(nullable = false)
    private String decision; // APPROVED, REJECTED (see LessonStatus)

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "lesson_version_reviewed", nullable = false)
    private int lessonVersionReviewed;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
