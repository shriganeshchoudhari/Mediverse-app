package com.curiolearn.curriculum;

import com.curiolearn.curriculum.CurriculumYear;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CurriculumYearRepository extends JpaRepository<CurriculumYear, UUID> {
    List<CurriculumYear> findByCurriculumId(UUID curriculumId);
}

