package com.curiolearn.curriculum;

import com.curiolearn.curriculum.CurriculumYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CurriculumYearRepository extends JpaRepository<CurriculumYear, UUID> {
    List<CurriculumYear> findByCurriculumId(UUID curriculumId);
}

