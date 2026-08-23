package com.curiolearn.ai;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CurriculumVectorEmbeddingRepository extends JpaRepository<CurriculumVectorEmbedding, UUID> {

    List<CurriculumVectorEmbedding> findByLessonId(UUID lessonId);

    @Query(value = "SELECT * FROM curriculum_vector_embeddings " +
                   "WHERE to_tsvector('english', chunk_text || ' ' || COALESCE(heading, '')) @@ plainto_tsquery('english', :query) " +
                   "ORDER BY ts_rank(to_tsvector('english', chunk_text || ' ' || COALESCE(heading, '')), plainto_tsquery('english', :query)) DESC " +
                   "LIMIT :limit", nativeQuery = true)
    List<CurriculumVectorEmbedding> searchPostgresFullTextRanked(@Param("query") String query, @Param("limit") int limit);

    @Query(value = "SELECT * FROM curriculum_vector_embeddings " +
                   "WHERE chunk_text ILIKE %:keyword% OR heading ILIKE %:keyword% " +
                   "LIMIT :limit", nativeQuery = true)
    List<CurriculumVectorEmbedding> searchKeywordFallback(@Param("keyword") String keyword, @Param("limit") int limit);
}
