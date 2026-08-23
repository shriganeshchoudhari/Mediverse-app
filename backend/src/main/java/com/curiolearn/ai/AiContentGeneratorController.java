package com.curiolearn.ai;

import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai/generate")
public class AiContentGeneratorController {

    private final AiContentGeneratorService generatorService;

    public AiContentGeneratorController(AiContentGeneratorService generatorService) {
        this.generatorService = generatorService;
    }

    @PostMapping("/quiz")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FACULTY','CONTENT_WRITER')")
    public ResponseEntity<Map<String, Object>> generateQuiz(@RequestBody GenerateRequest request) {
        int count = request.getCount() > 0 ? request.getCount() : 2;
        return ResponseEntity.ok(generatorService.generateQuiz(request.getText(), count));
    }

    @PostMapping("/flashcards")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FACULTY','CONTENT_WRITER')")
    public ResponseEntity<Map<String, Object>> generateFlashcards(@RequestBody GenerateRequest request) {
        int count = request.getCount() > 0 ? request.getCount() : 2;
        return ResponseEntity.ok(generatorService.generateFlashcards(request.getText(), count));
    }

    @PostMapping("/clinical-case")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','FACULTY','CONTENT_WRITER')")
    public ResponseEntity<Map<String, Object>> generateClinicalCase(@RequestBody GenerateRequest request) {
        return ResponseEntity.ok(generatorService.generateClinicalCase(request.getText()));
    }

    @Data
    public static class GenerateRequest {
        private String text;
        private int count;
    }
}
