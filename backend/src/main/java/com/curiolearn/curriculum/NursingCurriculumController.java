package com.curiolearn.curriculum;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/nursing")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NursingCurriculumController {

    @GetMapping("/bscnursing/subjects")
    public ResponseEntity<?> getBScNursingSubjects() {
        return ResponseEntity.ok(List.of(
            Map.of("year", 1, "title", "First Year", "subjects", List.of())
        ));
    }

    @GetMapping("/bscnursing/subjects/{id}")
    public ResponseEntity<?> getBScNursingSubjectById(@PathVariable String id) {
        return ResponseEntity.ok(Map.of("id", id, "name", "Sample Subject"));
    }

    @GetMapping("/mscnursing/specialties")
    public ResponseEntity<?> getMScNursingSpecialties() {
        return ResponseEntity.ok(List.of(
            Map.of("id", "spec-1", "name", "Critical Care Nursing")
        ));
    }

    @GetMapping("/competencies")
    public ResponseEntity<?> getNursingCompetencies() {
        return ResponseEntity.ok(List.of(
            Map.of("id", "INC-MSN-01", "title", "Wound Care")
        ));
    }

    @GetMapping("/skills")
    public ResponseEntity<?> getNursingSkills() {
        return ResponseEntity.ok(List.of(
            Map.of("id", "skill-1", "name", "IV Insertion")
        ));
    }
}
