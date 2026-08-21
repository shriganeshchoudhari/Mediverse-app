package com.curiolearn.quiz;

import com.curiolearn.quiz.ExamSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ExamSessionRepository extends JpaRepository<ExamSession, UUID> {
    List<ExamSession> findByUserIdOrderByCompletedAtDesc(UUID userId);
}

