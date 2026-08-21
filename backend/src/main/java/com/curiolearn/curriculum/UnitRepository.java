package com.curiolearn.curriculum;

import com.curiolearn.curriculum.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface UnitRepository extends JpaRepository<Unit, UUID> {
    List<Unit> findBySubjectIdOrderBySortOrderAsc(UUID subjectId);
}

