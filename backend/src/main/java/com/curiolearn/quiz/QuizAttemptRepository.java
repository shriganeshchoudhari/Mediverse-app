package com.curiolearn.quiz;

import com.curiolearn.quiz.QuizAttempt;
import com.curiolearn.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, UUID> {
    List<QuizAttempt> findByUser(User user);
    List<QuizAttempt> findByUserAndLessonId(User user, String lessonId);
}
