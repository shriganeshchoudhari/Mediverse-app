package com.curiolearn.emr.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CpoeOrder {
    private UUID id;
    private UUID patientId;
    private String orderType; // LAB, IMAGING, MEDICATION, NURSING
    private String orderName;
    private String details;
    private String priority; // STAT, URGENT, ROUTINE
    private String status; // PENDING, PROCESSING, COMPLETED, CANCELLED
    private String safetyNotes;
    private boolean isContraindicated;
    private Instant createdAt;
}
