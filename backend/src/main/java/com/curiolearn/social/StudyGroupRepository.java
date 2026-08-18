package com.curiolearn.social;

import com.curiolearn.social.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface StudyGroupRepository extends JpaRepository<StudyGroup, UUID> {
}

