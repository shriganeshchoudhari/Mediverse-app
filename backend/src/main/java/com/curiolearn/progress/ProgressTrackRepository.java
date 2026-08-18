package com.curiolearn.progress;

import com.curiolearn.progress.ProgressTrack;
import com.curiolearn.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProgressTrackRepository extends JpaRepository<ProgressTrack, UUID> {
    List<ProgressTrack> findByUser(User user);
    Optional<ProgressTrack> findByUserAndLessonId(User user, String lessonId);
}

