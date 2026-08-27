package com.curiolearn.curriculum;

import com.curiolearn.curriculum.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ChapterRepository extends JpaRepository<Chapter, UUID> {
    List<Chapter> findByUnitIdOrderBySortOrderAsc(UUID unitId);
    List<Chapter> findByUnitIdInOrderBySortOrderAsc(java.util.Collection<UUID> unitIds);
}


