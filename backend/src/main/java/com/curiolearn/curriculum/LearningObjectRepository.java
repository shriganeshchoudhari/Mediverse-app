package com.curiolearn.curriculum;

import com.curiolearn.curriculum.LearningObject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface LearningObjectRepository extends JpaRepository<LearningObject, UUID> {
    List<LearningObject> findByConceptIdOrderBySortOrderAsc(UUID conceptId);
}

