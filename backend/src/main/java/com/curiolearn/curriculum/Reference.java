package com.curiolearn.curriculum;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "curriculum_references")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "concept"})
public class Reference {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "concept_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Concept concept;

    @Column(name = "citation_text", columnDefinition = "TEXT", nullable = false)
    private String citationText;

    @Column(name = "source_type", nullable = false)
    private String sourceType; // TEXTBOOK, JOURNAL, PYQ

    @Column
    private String url;
}
