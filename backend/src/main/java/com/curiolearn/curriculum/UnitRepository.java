package com.curiolearn.curriculum;

import com.curiolearn.curriculum.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface UnitRepository extends JpaRepository<Unit, UUID> {
    List<Unit> findBySubjectIdOrderBySortOrderAsc(UUID subjectId);
}

