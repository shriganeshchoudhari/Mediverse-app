package com.curiolearn.curriculum;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    Optional<Lesson> findByConceptId(UUID conceptId);
    List<Lesson> findByConceptIdIn(java.util.Collection<UUID> conceptIds);
    List<Lesson> findByStatusOrderByCreatedAtAsc(String status);
}

