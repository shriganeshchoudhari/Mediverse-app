package com.curiolearn.curriculum;

import com.curiolearn.curriculum.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SubjectRepository extends JpaRepository<Subject, UUID> {
    List<Subject> findBySemesterId(UUID semesterId);
    java.util.Optional<Subject> findByCodeIgnoreCase(String code);
    java.util.Optional<Subject> findByTitleIgnoreCase(String title);
}

