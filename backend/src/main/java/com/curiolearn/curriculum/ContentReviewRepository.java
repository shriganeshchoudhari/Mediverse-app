package com.curiolearn.curriculum;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContentReviewRepository extends JpaRepository<ContentReview, UUID> {
    List<ContentReview> findByLessonIdOrderByCreatedAtDesc(UUID lessonId);
}
