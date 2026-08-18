package com.curiolearn.progress;

import com.curiolearn.progress.RetentionSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RetentionSnapshotRepository extends JpaRepository<RetentionSnapshot, UUID> {
}

