package com.curiolearn.progress;

import com.curiolearn.progress.ProgressTrack;
import com.curiolearn.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProgressTrackRepository extends JpaRepository<ProgressTrack, UUID> {
    List<ProgressTrack> findByUser(User user);
    Optional<ProgressTrack> findByUserAndLessonId(User user, String lessonId);
}

