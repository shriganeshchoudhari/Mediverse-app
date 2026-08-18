package com.curiolearn.quiz;

import com.curiolearn.quiz.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, UUID> {
    List<QuizQuestion> findByLessonId(String lessonId);

    @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM quiz_questions ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<QuizQuestion> findRandomQuestions(@org.springframework.data.repository.query.Param("limit") int limit);
}
