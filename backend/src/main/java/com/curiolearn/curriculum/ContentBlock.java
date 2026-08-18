package com.curiolearn.curriculum;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "content_blocks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "lesson"})
public class ContentBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Lesson lesson;

    @Column(nullable = false)
    private String type; // EXPLANATION, SUMMARY, DIAGRAM, THREE_D, ANIMATION, FLOWCHART, Video, QUIZ, FLASHCARD_SET

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    @Column(name = "content_ref")
    private String contentRef;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata")
    private Map<String, Object> metadata;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
