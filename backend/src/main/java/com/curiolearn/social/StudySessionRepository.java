package com.curiolearn.social;

import com.curiolearn.social.StudySession;
import com.curiolearn.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

public interface StudySessionRepository extends JpaRepository<StudySession, UUID> {
    List<StudySession> findByUser(User user);
    List<StudySession> findByUserAndStartedAtAfter(User user, LocalDateTime startedAt);
}
