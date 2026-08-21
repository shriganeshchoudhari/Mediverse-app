package com.curiolearn.curriculum;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/pharmacy")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PharmacyCurriculumController {

    @GetMapping("/pharmd/subjects")
    public ResponseEntity<List<Map<String, Object>>> getPharmDSubjects() {
        return ResponseEntity.ok(List.of(
            Map.of("id", "p101", "name", "Human Anatomy & Physiology"),
            Map.of("id", "p102", "name", "Pharmaceutics")
        ));
    }

    @GetMapping("/pharmd/subjects/{id}")
    public ResponseEntity<Map<String, Object>> getPharmDSubjectById(@PathVariable String id) {
        return ResponseEntity.ok(Map.of("id", id, "name", "Sample Subject"));
    }

    @GetMapping("/bpharm/subjects")
    public ResponseEntity<List<Map<String, Object>>> getBPharmSubjects() {
        return ResponseEntity.ok(List.of(
            Map.of("id", "b101", "name", "Pharmaceutical Chemistry")
        ));
    }

    @GetMapping("/competencies")
    public ResponseEntity<List<Map<String, Object>>> getCompetencies() {
        return ResponseEntity.ok(List.of(
            Map.of("id", "1", "code", "PCI-PH-1.1", "description", "Describe pharmacokinetic models")
        ));
    }

    @GetMapping("/tdm/drugs")
    public ResponseEntity<List<String>> getTdmDrugs() {
        return ResponseEntity.ok(List.of("Phenytoin", "Digoxin", "Vancomycin"));
    }

    @GetMapping("/interactions")
    public ResponseEntity<List<String>> getInteractions() {
        return ResponseEntity.ok(List.of("Aspirin - Warfarin", "Omeprazole - Clopidogrel"));
    }
}
