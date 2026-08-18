package com.curiolearn.curriculum;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    Optional<Lesson> findByConceptId(UUID conceptId);
    List<Lesson> findByStatusOrderByCreatedAtAsc(String status);
}
