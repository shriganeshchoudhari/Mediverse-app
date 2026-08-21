package com.curiolearn.curriculum;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ayush")
public class AYUSHCurriculumController {

    @GetMapping("/bams/subjects")
    public ResponseEntity<List<Object>> getBAMSSubjects() {
        // Return dummy data or fetch from service
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/bams/subjects/{id}")
    public ResponseEntity<Map<String, String>> getBAMSSubjectById(@PathVariable String id) {
        return ResponseEntity.ok(Collections.singletonMap("id", id));
    }

    @GetMapping("/competencies")
    public ResponseEntity<List<Object>> getCompetencies() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/md/specialties")
    public ResponseEntity<List<Object>> getMDSpecialties() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/bhms/subjects")
    public ResponseEntity<List<Object>> getBHMSSubjects() {
        return ResponseEntity.ok(Collections.emptyList());
    }
}
