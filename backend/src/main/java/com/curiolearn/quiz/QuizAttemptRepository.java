package com.curiolearn.quiz;

import com.curiolearn.quiz.QuizAttempt;
import com.curiolearn.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, UUID> {
    List<QuizAttempt> findByUser(User user);
    List<QuizAttempt> findByUserAndLessonId(User user, String lessonId);
}
