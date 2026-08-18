package com.curiolearn.ai;

import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> askTutor(@RequestBody AiRequest request) {
        String context = request.getContext() != null ? request.getContext() : "general physiology";
        String prompt = request.getPrompt();

        String response = aiService.askTutor(prompt, context, request.getHistory());

        return ResponseEntity.ok(Map.of("answer", response));
    }

    @Data
    public static class AiRequest {
        private String prompt;
        private String context;
        private java.util.List<ChatMessage> history;
    }

    @Data
    public static class ChatMessage {
        private String role; // "user" or "model"
        private String text;
    }
}

