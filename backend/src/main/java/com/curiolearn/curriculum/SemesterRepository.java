package com.curiolearn.curriculum;

import com.curiolearn.curriculum.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SemesterRepository extends JpaRepository<Semester, UUID> {
    List<Semester> findByYearId(UUID yearId);
}

