package com.curiolearn.emr.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "emr_clinical_notes")
@Data
public class ClinicalNote {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private UUID patientId;
    private String authorId;
    private String noteType;
    private String subjective;
    private String objective;
    private String assessment;
    private String plan;
    
    @Column(insertable = false, updatable = false)
    private ZonedDateTime createdAt;
}
