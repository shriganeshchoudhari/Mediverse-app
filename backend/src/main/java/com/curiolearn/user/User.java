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

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToMany(mappedBy = "members")
    @Builder.Default
    private java.util.Set<StudyGroup> studyGroups = new java.util.HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

