package com.curiolearn.curriculum;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ClinicalCaseRepository extends JpaRepository<ClinicalCase, UUID> {
    List<ClinicalCase> findByConceptId(UUID conceptId);
}
