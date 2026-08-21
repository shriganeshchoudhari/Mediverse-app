package com.curiolearn.social;

import com.curiolearn.social.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, UUID> {
}

