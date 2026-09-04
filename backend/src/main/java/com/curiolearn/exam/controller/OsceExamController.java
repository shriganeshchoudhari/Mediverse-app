package com.curiolearn.exam.controller;

import com.curiolearn.exam.dto.OsceEvaluationRequest;
import com.curiolearn.exam.dto.OsceEvaluationResponse;
import com.curiolearn.exam.service.OsceExamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/exam/osce")
@Tag(name = "OSCE Examination Engine", description = "Endpoints for multi-station clinical OSCE examination assessment and debriefing")
@PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN', 'SUPER_ADMIN')")
public class OsceExamController {

    private final OsceExamService osceExamService;

    public OsceExamController(OsceExamService osceExamService) {
        this.osceExamService = osceExamService;
    }

    @PostMapping("/evaluate")
    @Operation(summary = "Evaluate candidate multi-station OSCE performance actions and generate score report")
    public ResponseEntity<OsceEvaluationResponse> evaluateExam(@RequestBody OsceEvaluationRequest request) {
        OsceEvaluationResponse response = osceExamService.evaluateExam(request);
        return ResponseEntity.ok(response);
    }
}
