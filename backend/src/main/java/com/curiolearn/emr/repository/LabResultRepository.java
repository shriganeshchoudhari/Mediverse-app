package com.curiolearn.emr.repository;

import com.curiolearn.emr.model.LabResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface LabResultRepository extends JpaRepository<LabResult, UUID> {
    List<LabResult> findByPatientIdOrderByResultTimeDesc(UUID patientId);
}
