package com.curiolearn.curriculum;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ReferenceRepository extends JpaRepository<Reference, UUID> {
    List<Reference> findByConceptId(UUID conceptId);
}
