package com.curiolearn.aitutor.controller;

import com.curiolearn.aitutor.dto.AITutorChatRequest;
import com.curiolearn.aitutor.service.AITutorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/ai-tutor")
@Tag(name = "AI Tutor", description = "Endpoints for Socratic AI Tutor streaming dialogue and physiological reasoning")
public class AITutorApiController {

    private final AITutorService aiTutorService;

    public AITutorApiController(AITutorService aiTutorService) {
        this.aiTutorService = aiTutorService;
    }

    @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Stream multi-turn Socratic AI Tutor response tokens via SSE / streaming text")
    public ResponseBodyEmitter streamChat(@RequestBody AITutorChatRequest request) {
        ResponseBodyEmitter emitter = new ResponseBodyEmitter(180_000L); // 3 minutes timeout

        CompletableFuture.runAsync(() -> {
            try {
                aiTutorService.streamSocraticResponse(request, emitter);
                emitter.complete();
            } catch (Exception ex) {
                try {
                    emitter.completeWithError(ex);
                } catch (Exception ignored) {
                }
            }
        });

        return emitter;
    }
}
