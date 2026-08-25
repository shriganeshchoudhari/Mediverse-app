package com.curiolearn.emr.repository;

import com.curiolearn.emr.model.Patient;
import com.curiolearn.emr.model.ClinicalNote;
import com.curiolearn.emr.model.LabResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {}
