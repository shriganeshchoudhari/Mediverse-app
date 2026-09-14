package com.curiolearn.ai;

import com.curiolearn.ai.RagService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/rag")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class RagController {

    private static final Logger log = LoggerFactory.getLogger(RagController.class);
    private final RagService ragService;

    public RagController(RagService ragService) {
        this.ragService = ragService;
    }

    @PostMapping("/ingest")
    public ResponseEntity<Map<String, String>> ingestCurriculum(@RequestParam(defaultValue = "./docs/curriculum") String path) {
        // Guard against path traversal attacks
        Path resolved = Paths.get(path).normalize();
        if (resolved.toString().contains("..")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid path parameter");
        }
        try {
            ragService.ingestCurriculum(resolved.toString());
            return ResponseEntity.ok(Map.of("message", "Successfully ingested curriculum into Elasticsearch."));
        } catch (Exception e) {
            log.error("RAG ingest failed for path {}: {}", path, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Ingestion failed. Please contact an administrator."));
        }
    }

    @PostMapping("/ingest-db")
    public ResponseEntity<Map<String, String>> ingestFromDatabase() {
        try {
            ragService.ingestFromDatabase();
            return ResponseEntity.ok(Map.of("message", "Successfully ingested database content blocks into Elasticsearch."));
        } catch (Exception e) {
            log.error("RAG database ingest failed: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Database ingestion failed. Please contact an administrator."));
        }
    }
}

