package com.curiolearn.ai;

import com.curiolearn.ai.RagService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/rag")
public class RagController {

    private final RagService ragService;

    public RagController(RagService ragService) {
        this.ragService = ragService;
    }

    @PostMapping("/ingest")
    public ResponseEntity<Map<String, String>> ingestCurriculum(@RequestParam(defaultValue = "./docs/curriculum") String path) {
        try {
            ragService.ingestCurriculum(path);
            return ResponseEntity.ok(Map.of("message", "Successfully ingested curriculum from " + path + " into Elasticsearch."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/ingest-db")
    public ResponseEntity<Map<String, String>> ingestFromDatabase() {
        try {
            ragService.ingestFromDatabase();
            return ResponseEntity.ok(Map.of("message", "Successfully ingested database content blocks into Elasticsearch."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}

