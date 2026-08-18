package com.curiolearn.curriculum;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "learning_objects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningObject {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "concept_id", nullable = false)
    private Concept concept;

    @Column(nullable = false)
    private String objectType; // TEXT, SIMULATION, 3D_MODEL, QUIZ, FLASHCARD, VIVA

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contentPayload;

    @Column(nullable = false)
    private int sortOrder;
}

