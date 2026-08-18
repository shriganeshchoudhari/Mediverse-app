package com.curiolearn.quiz;

import com.curiolearn.quiz.ExamSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExamSessionRepository extends JpaRepository<ExamSession, UUID> {
    List<ExamSession> findByUserIdOrderByCompletedAtDesc(UUID userId);
}

