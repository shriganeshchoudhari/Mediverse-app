package com.curiolearn.curriculum;

import com.curiolearn.curriculum.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface TopicRepository extends JpaRepository<Topic, UUID> {
    List<Topic> findByChapterIdOrderBySortOrderAsc(UUID chapterId);
}

