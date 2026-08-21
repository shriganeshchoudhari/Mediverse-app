package com.curiolearn.flashcard;

import com.curiolearn.flashcard.Flashcard;
import com.curiolearn.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface FlashcardRepository extends JpaRepository<Flashcard, UUID> {
    List<Flashcard> findByUser(User user);

    List<Flashcard> findByUserAndLessonId(User user, String lessonId);

    @Query("SELECT f FROM Flashcard f WHERE f.user = :user AND f.nextReviewAt <= :now")
    List<Flashcard> findDueCards(@Param("user") User user, @Param("now") LocalDateTime now);
}

