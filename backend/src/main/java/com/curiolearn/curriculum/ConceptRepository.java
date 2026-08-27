package com.curiolearn.curriculum;

import com.curiolearn.curriculum.Concept;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ConceptRepository extends JpaRepository<Concept, UUID> {
    List<Concept> findByTopicIdOrderBySortOrderAsc(UUID topicId);
    List<Concept> findByTopicIdInOrderBySortOrderAsc(java.util.Collection<UUID> topicIds);
}


