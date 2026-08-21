package com.curiolearn.curriculum;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.jdbc.core.JdbcTemplate;
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

    private final JdbcTemplate jdbc;

    public AYUSHCurriculumController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

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

    @GetMapping("/bnys/subjects")
    @Operation(summary = "Get BNYS subject list")
    public ResponseEntity<List<Map<String, Object>>> getBnysSubjects() {
        List<Map<String, Object>> subjects = jdbc.queryForList(
            "SELECT s.id, s.title, s.code, s.category FROM subjects s JOIN semesters sem ON s.semester_id = sem.id JOIN curriculum_years cy ON sem.year_id = cy.id JOIN curricula c ON cy.curriculum_id = c.id JOIN programs p ON c.program_id = p.id WHERE p.code = 'BNYS' ORDER BY cy.year_number, sem.semester_number, s.title"
        );
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/bums/subjects")
    @Operation(summary = "Get BUMS subject list")
    public ResponseEntity<List<Map<String, Object>>> getBumsSubjects() {
        List<Map<String, Object>> subjects = jdbc.queryForList(
            "SELECT s.id, s.title, s.code, s.category FROM subjects s JOIN semesters sem ON s.semester_id = sem.id JOIN curriculum_years cy ON sem.year_id = cy.id JOIN curricula c ON cy.curriculum_id = c.id JOIN programs p ON c.program_id = p.id WHERE p.code = 'BUMS' ORDER BY cy.year_number, sem.semester_number, s.title"
        );
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/bsms/subjects")
    @Operation(summary = "Get BSMS subject list")
    public ResponseEntity<List<Map<String, Object>>> getBsmsSubjects() {
        List<Map<String, Object>> subjects = jdbc.queryForList(
            "SELECT s.id, s.title, s.code, s.category FROM subjects s JOIN semesters sem ON s.semester_id = sem.id JOIN curriculum_years cy ON sem.year_id = cy.id JOIN curricula c ON cy.curriculum_id = c.id JOIN programs p ON c.program_id = p.id WHERE p.code = 'BSMS' ORDER BY cy.year_number, sem.semester_number, s.title"
        );
        return ResponseEntity.ok(subjects);
    }
}
