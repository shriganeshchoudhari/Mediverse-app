package com.curiolearn.ai;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CurriculumVectorEmbeddingRepository extends JpaRepository<CurriculumVectorEmbedding, UUID> {

    List<CurriculumVectorEmbedding> findByLessonId(UUID lessonId);

    @Query(value = "SELECT * FROM curriculum_vector_embeddings " +
                   "WHERE to_tsvector('english', chunk_text || ' ' || COALESCE(heading, '')) @@ plainto_tsquery('english', :query) " +
                   "ORDER BY ts_rank(to_tsvector('english', chunk_text || ' ' || COALESCE(heading, '')), plainto_tsquery('english', :query)) DESC " +
                   "LIMIT :limit", nativeQuery = true)
    List<CurriculumVectorEmbedding> searchPostgresFullTextRanked(@Param("query") String query, @Param("limit") int limit);

    @Query(value = "SELECT * FROM curriculum_vector_embeddings " +
                   "WHERE chunk_text ILIKE CONCAT('%', :keyword, '%') OR heading ILIKE CONCAT('%', :keyword, '%') " +
                   "LIMIT :limit", nativeQuery = true)
    List<CurriculumVectorEmbedding> searchKeywordFallback(@Param("keyword") String keyword, @Param("limit") int limit);

    // Phase 5: True Dense Vector Search using pgvector cosine distance (<=>)
    // NOTE: This requires the :embedding vector string to be passed formatted as '[0.1, 0.2, ...]'
    @Query(value = "SELECT * FROM curriculum_vector_embeddings " +
                   "WHERE embedding IS NOT NULL " +
                   "ORDER BY embedding <=> CAST(:embedding AS vector) " +
                   "LIMIT :limit", nativeQuery = true)
    List<CurriculumVectorEmbedding> searchByVectorSimilarity(@Param("embedding") String embeddingVectorString, @Param("limit") int limit);
}
