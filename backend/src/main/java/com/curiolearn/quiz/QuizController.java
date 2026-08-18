package com.curiolearn.quiz;

import com.curiolearn.quiz.QuizQuestionDto;
import com.curiolearn.quiz.QuizSubmitDto;
import com.curiolearn.quiz.QuizResultDto;
import com.curiolearn.quiz.QuizQuestionSyncDto;
import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import com.curiolearn.quiz.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quiz")
public class QuizController {

    private final QuizService quizService;
    private final UserRepository userRepository;

    public QuizController(QuizService quizService, UserRepository userRepository) {
        this.quizService = quizService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<List<QuizQuestionDto>> getQuizQuestions(
            @PathVariable String lessonId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(quizService.getQuizQuestions(lessonId));
    }

    @PostMapping("/{lessonId}/submit")
    public ResponseEntity<QuizResultDto> submitQuiz(
            @PathVariable String lessonId,
            @Valid @RequestBody QuizSubmitDto request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(quizService.submitQuiz(user.getId(), lessonId, request));
    }

    @PostMapping("/{lessonId}/sync")
    public ResponseEntity<List<QuizQuestionDto>> syncQuizQuestions(
            @PathVariable String lessonId,
            @RequestBody List<QuizQuestionSyncDto> request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        // Admin or student can sync for simple development flows
        return ResponseEntity.ok(quizService.syncQuizQuestions(lessonId, request));
    }
}
