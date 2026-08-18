package com.curiolearn.quiz;

import com.curiolearn.quiz.ExamSession;
import com.curiolearn.quiz.ExamService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import com.curiolearn.quiz.QuizQuestionDto;

@RestController
@RequestMapping("/api/v1/exam")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @PostMapping("/submit")
    public ResponseEntity<ExamSessionResponse> submitExam(@RequestBody ExamSubmitRequest request, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        ExamSession session = examService.submitExam(
                userId,
                request.getSectionIds(),
                request.getScore(),
                request.getTotalQuestions(),
                request.getTimeTakenSeconds()
        );
        return ResponseEntity.ok(mapToResponse(session));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ExamSessionResponse>> getHistory(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        List<ExamSession> history = examService.getUserExamHistory(userId);
        List<ExamSessionResponse> responses = history.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/questions")
    public ResponseEntity<List<QuizQuestionDto>> getExamQuestions(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(examService.getRandomExamQuestions(limit));
    }

    private ExamSessionResponse mapToResponse(ExamSession session) {
        ExamSessionResponse res = new ExamSessionResponse();
        res.setId(session.getId());
        res.setSectionIds(session.getSectionIds());
        res.setScore(session.getScore());
        res.setTotalQuestions(session.getTotalQuestions());
        res.setTimeTakenSeconds(session.getTimeTakenSeconds());
        res.setCompletedAt(session.getCompletedAt());
        return res;
    }

    @Data
    public static class ExamSubmitRequest {
        private List<String> sectionIds;
        private int score;
        private int totalQuestions;
        private int timeTakenSeconds;
    }

    @Data
    public static class ExamSessionResponse {
        private UUID id;
        private List<String> sectionIds;
        private int score;
        private int totalQuestions;
        private Integer timeTakenSeconds;
        private LocalDateTime completedAt;
    }
}

