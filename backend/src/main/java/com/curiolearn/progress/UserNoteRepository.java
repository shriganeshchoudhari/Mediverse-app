package com.curiolearn.progress;

import com.curiolearn.progress.UserNote;
import com.curiolearn.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserNoteRepository extends JpaRepository<UserNote, UUID> {
    List<UserNote> findByUser(User user);
    Optional<UserNote> findByUserAndLessonId(User user, String lessonId);
}
