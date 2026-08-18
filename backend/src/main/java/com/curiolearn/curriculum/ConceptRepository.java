package com.curiolearn.curriculum;

import com.curiolearn.curriculum.Concept;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ConceptRepository extends JpaRepository<Concept, UUID> {
    List<Concept> findByTopicIdOrderBySortOrderAsc(UUID topicId);
}

