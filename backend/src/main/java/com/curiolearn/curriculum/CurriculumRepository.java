package com.curiolearn.curriculum;

import com.curiolearn.curriculum.Curriculum;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface CurriculumRepository extends JpaRepository<Curriculum, UUID> {
    Optional<Curriculum> findByCode(String code);
}

