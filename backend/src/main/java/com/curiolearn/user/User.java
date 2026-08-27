package com.curiolearn.user;
import com.curiolearn.social.StudyGroup;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private String firstName;
    private String lastName;

    @Column(nullable = false)
    private String role; // STUDENT, FACULTY, ADMIN

    @Builder.Default
    private int currentXp = 0;

    @Builder.Default
    private int dailyStreak = 0;

    private LocalDate lastStudyDate;

    @Column(length = 50)
    private String enrolledProgram; // e.g., MBBS, BDS, BAMS, PHARMD, BSCNURSING, BPT, BVSC, MPH

    @Column(length = 50)
    private String healthcareDomain; // e.g., ALLOPATHIC, DENTAL, AYUSH, PHARMACY, NURSING, PHYSIOTHERAPY, ALLIED, VETERINARY, PUBLIC_HEALTH

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToMany(mappedBy = "members")
    @Builder.Default
    private java.util.Set<StudyGroup> studyGroups = new java.util.HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (role == null || role.trim().isEmpty()) {
            role = Roles.STUDENT;
        }
    }

    public boolean hasRole(String targetRole) {
        return role != null && role.equalsIgnoreCase(targetRole);
    }
}


