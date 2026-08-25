package com.curiolearn.emr.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "emr_lab_results")
@Data
public class LabResult {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private UUID patientId;
    private String panelName;
    private String testName;
    private String value;
    private String unit;
    private String referenceRange;
    private String flag;
    private ZonedDateTime resultTime;
    
    @Column(insertable = false, updatable = false)
    private ZonedDateTime createdAt;
}
