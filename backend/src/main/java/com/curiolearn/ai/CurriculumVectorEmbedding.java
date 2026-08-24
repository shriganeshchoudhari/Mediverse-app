package com.curiolearn.ai;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "curriculum_vector_embeddings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurriculumVectorEmbedding {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "lesson_id")
    private UUID lessonId;

    @Column(name = "block_id")
    private UUID blockId;

    @Column(name = "chunk_text", nullable = false, columnDefinition = "TEXT")
    private String chunkText;

    @Column(name = "heading", length = 255)
    private String heading;

    @Column(name = "domain", length = 50)
    private String domain;

    // Using String to map the vector array to Postgres pgvector type natively via Hibernate's CAST
    // Alternatively can map to float[] if hypersistence-utils is present.
    // For now we map to String (e.g. "[0.1, 0.2, ...]") and cast it in native SQL inserts if needed,
    // or just use native SQL to update it.
    @Column(name = "embedding", columnDefinition = "vector(384)")
    private String embedding;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
