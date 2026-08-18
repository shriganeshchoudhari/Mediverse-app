package com.curiolearn.curriculum;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ContentBlockRepository extends JpaRepository<ContentBlock, UUID> {
    List<ContentBlock> findByLessonIdOrderByOrderIndexAsc(UUID lessonId);
}
