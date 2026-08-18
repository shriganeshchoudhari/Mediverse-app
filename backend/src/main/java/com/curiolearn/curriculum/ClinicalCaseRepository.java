package com.curiolearn.curriculum;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ClinicalCaseRepository extends JpaRepository<ClinicalCase, UUID> {
    List<ClinicalCase> findByConceptId(UUID conceptId);
}
