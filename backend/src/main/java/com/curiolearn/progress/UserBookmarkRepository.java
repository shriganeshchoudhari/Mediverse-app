package com.curiolearn.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface UserBookmarkRepository extends JpaRepository<UserBookmark, UUID> {
    List<UserBookmark> findByUserId(UUID userId);
}
