package com.curiolearn.emr.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "emr_patients")
@Data
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private String mrn;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodType;
    private String allergies;
    
    @Column(insertable = false, updatable = false)
    private ZonedDateTime createdAt;
}
