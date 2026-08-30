package com.curiolearn.emr.controller;

import com.curiolearn.emr.service.ClinicalDocumentationEvaluator;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/emr/soap-grade")
@PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN', 'SUPER_ADMIN')")
public class SoapNoteGradingController {

    private final ClinicalDocumentationEvaluator evaluator;

    public SoapNoteGradingController(ClinicalDocumentationEvaluator evaluator) {
        this.evaluator = evaluator;
    }

    @PostMapping("/evaluate")
    public Map<String, Object> evaluateNote(@RequestBody Map<String, String> payload) {
        String subjective = payload.getOrDefault("subjective", "");
        String objective = payload.getOrDefault("objective", "");
        String assessment = payload.getOrDefault("assessment", "");
        String plan = payload.getOrDefault("plan", "");
        String primaryDx = payload.getOrDefault("primaryDiagnosis", "");

        return evaluator.gradeSoapNote(subjective, objective, assessment, plan, primaryDx);
    }
}
