package com.curiolearn.progress;

import com.curiolearn.progress.RetentionSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RetentionSnapshotRepository extends JpaRepository<RetentionSnapshot, UUID> {
}

