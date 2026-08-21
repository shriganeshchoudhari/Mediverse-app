package com.curiolearn.curriculum;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/allied")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AlliedHealthCurriculumController {

    @GetMapping("/programs")
    public ResponseEntity<?> getPrograms() {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/subjects")
    public ResponseEntity<?> getSubjects() {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/subjects/{id}")
    public ResponseEntity<?> getSubjectById(@PathVariable String id) {
        return ResponseEntity.ok(Map.of("id", id, "name", "Sample Subject"));
    }

    @GetMapping("/competencies")
    public ResponseEntity<?> getCompetencies() {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/skills")
    public ResponseEntity<?> getSkills() {
        return ResponseEntity.ok(List.of());
    }
}
