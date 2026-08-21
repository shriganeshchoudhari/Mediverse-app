package com.curiolearn.search;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/search")
@Tag(name = "Search", description = "Multi-domain curriculum full-text search")
public class SearchController {

    private final JdbcTemplate jdbc;

    public SearchController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping
    @Operation(summary = "Search curriculum content across all healthcare domains")
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam String q,
            @RequestParam(required = false) String domain,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "0") int offset) {

        if (q == null || q.trim().length() < 2) {
            Map<String, Object> empty = new LinkedHashMap<>();
            empty.put("query", q);
            empty.put("total", 0);
            empty.put("results", List.of());
            return ResponseEntity.ok(empty);
        }

        String searchTerm = "%" + q.trim().toLowerCase() + "%";

        // Search across subjects, units, and chapters using ILIKE full-text match
        String sql = """
                SELECT
                    s.id::text        AS id,
                    s.title           AS title,
                    s.code            AS code,
                    s.category        AS type,
                    p.name            AS program,
                    p.healthcare_domain AS domain,
                    'subject'         AS result_type,
                    '/subjects/' || s.id AS path
                FROM subjects s
                JOIN semesters sem ON s.semester_id = sem.id
                JOIN curriculum_years cy ON sem.year_id = cy.id
                JOIN curricula c ON cy.curriculum_id = c.id
                JOIN programs p ON c.program_id = p.id
                WHERE LOWER(s.title) LIKE ? OR LOWER(s.code) LIKE ?
                """
                + (domain != null && !domain.isBlank() ? " AND p.healthcare_domain = '" + domain.toUpperCase().replace("'", "") + "'" : "")
                + """
                UNION ALL
                SELECT
                    u.id::text        AS id,
                    u.title           AS title,
                    s.code            AS code,
                    'unit'            AS type,
                    p.name            AS program,
                    p.healthcare_domain AS domain,
                    'unit'            AS result_type,
                    '/subjects/' || s.id AS path
                FROM units u
                JOIN subjects s ON u.subject_id = s.id
                JOIN semesters sem ON s.semester_id = sem.id
                JOIN curriculum_years cy ON sem.year_id = cy.id
                JOIN curricula c ON cy.curriculum_id = c.id
                JOIN programs p ON c.program_id = p.id
                WHERE LOWER(u.title) LIKE ?
                """
                + (domain != null && !domain.isBlank() ? " AND p.healthcare_domain = '" + domain.toUpperCase().replace("'", "") + "'" : "")
                + " ORDER BY title LIMIT ? OFFSET ?";

        List<Map<String, Object>> rows;
        try {
            rows = jdbc.queryForList(sql,
                    searchTerm, searchTerm,
                    searchTerm,
                    limit, offset);
        } catch (Exception e) {
            // Fallback: simple subject search only
            rows = jdbc.queryForList(
                    "SELECT id::text AS id, title, code, category AS type, 'subject' AS result_type FROM subjects WHERE LOWER(title) LIKE ? LIMIT ?",
                    searchTerm, limit);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("query", q);
        response.put("domain", domain);
        response.put("total", rows.size());
        response.put("results", rows);
        return ResponseEntity.ok(response);
    }
}
