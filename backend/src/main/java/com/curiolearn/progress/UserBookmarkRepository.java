package com.curiolearn.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface UserBookmarkRepository extends JpaRepository<UserBookmark, UUID> {
    List<UserBookmark> findByUserId(UUID userId);
}
