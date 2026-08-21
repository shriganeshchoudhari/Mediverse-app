package com.curiolearn.quiz;

import com.curiolearn.quiz.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, UUID> {
    List<QuizQuestion> findByLessonId(String lessonId);

    @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM quiz_questions ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<QuizQuestion> findRandomQuestions(@org.springframework.data.repository.query.Param("limit") int limit);
}
