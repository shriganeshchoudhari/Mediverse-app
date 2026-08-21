package com.curiolearn.curriculum;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ContentReviewRepository extends JpaRepository<ContentReview, UUID> {
    List<ContentReview> findByLessonIdOrderByCreatedAtDesc(UUID lessonId);
}
