package com.curiolearn.quiz;

import com.curiolearn.quiz.ExamSession;
import com.curiolearn.user.User;
import com.curiolearn.quiz.ExamSessionRepository;
import com.curiolearn.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import com.curiolearn.quiz.QuizQuestionRepository;
import com.curiolearn.quiz.QuizQuestion;
import com.curiolearn.quiz.QuizQuestionDto;
import java.util.stream.Collectors;

@Service
public class ExamService {

    private final ExamSessionRepository examSessionRepository;
    private final UserRepository userRepository;
    private final QuizQuestionRepository quizQuestionRepository;

    public ExamService(ExamSessionRepository examSessionRepository, UserRepository userRepository, QuizQuestionRepository quizQuestionRepository) {
        this.examSessionRepository = examSessionRepository;
        this.userRepository = userRepository;
        this.quizQuestionRepository = quizQuestionRepository;
    }

    @Transactional
    public ExamSession submitExam(UUID userId, List<String> sectionIds, int score, int totalQuestions, int timeTakenSeconds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ExamSession session = ExamSession.builder()
                .user(user)
                .sectionIds(sectionIds)
                .score(score)
                .totalQuestions(totalQuestions)
                .timeTakenSeconds(timeTakenSeconds)
                .build();

        return examSessionRepository.save(session);
    }

    public List<ExamSession> getUserExamHistory(UUID userId) {
        return examSessionRepository.findByUserIdOrderByCompletedAtDesc(userId);
    }

    public List<QuizQuestionDto> getRandomExamQuestions(int limit) {
        List<QuizQuestion> questions = quizQuestionRepository.findRandomQuestions(limit);
        return questions.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private QuizQuestionDto mapToDto(QuizQuestion q) {
        QuizQuestionDto dto = new QuizQuestionDto();
        dto.setId(q.getId());
        dto.setQuestionText(q.getQuestionText());
        dto.setOptionA(q.getOptionA());
        dto.setOptionB(q.getOptionB());
        dto.setOptionC(q.getOptionC());
        dto.setOptionD(q.getOptionD());
        dto.setCorrectOption(q.getCorrectOption());
        dto.setExplanation(q.getExplanation());
        return dto;
    }
}

