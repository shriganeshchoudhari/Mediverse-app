package com.curiolearn.quiz;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/exam/osce")
@Tag(name = "OSCE Exam", description = "Objective Structured Clinical Examination station management")
public class OsceController {

    private final JdbcTemplate jdbc;

    public OsceController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/stations")
    @Operation(summary = "List OSCE stations, optionally filtered by domain")
    public ResponseEntity<List<Map<String, Object>>> getStations(
            @RequestParam(required = false) String domain) {
        String sql = domain != null && !domain.isBlank()
                ? "SELECT id, title, domain, description, scenario_json, checklist_json, time_limit_minutes, passing_score_pct, difficulty FROM osce_stations WHERE is_active = true AND domain = ? ORDER BY difficulty, title"
                : "SELECT id, title, domain, description, scenario_json, checklist_json, time_limit_minutes, passing_score_pct, difficulty FROM osce_stations WHERE is_active = true ORDER BY domain, difficulty, title";
        List<Map<String, Object>> results = domain != null && !domain.isBlank()
                ? jdbc.queryForList(sql, domain)
                : jdbc.queryForList(sql);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/stations/{id}")
    @Operation(summary = "Get a specific OSCE station by ID")
    public ResponseEntity<Map<String, Object>> getStation(@PathVariable String id) {
        List<Map<String, Object>> rows = jdbc.queryForList(
                "SELECT id, title, domain, description, scenario_json, checklist_json, time_limit_minutes, passing_score_pct, difficulty FROM osce_stations WHERE id = ?::uuid AND is_active = true",
                id);
        if (rows.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(rows.get(0));
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit an OSCE attempt")
    public ResponseEntity<Map<String, Object>> submitAttempt(@RequestBody Map<String, Object> body) {
        // Lightweight acknowledgment — full persistence would use ExamService
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "SUBMITTED");
        response.put("stationId", body.get("stationId"));
        response.put("score", body.get("score"));
        response.put("submittedAt", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}
