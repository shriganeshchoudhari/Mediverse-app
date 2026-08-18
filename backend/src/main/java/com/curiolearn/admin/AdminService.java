package com.curiolearn.admin;

import com.curiolearn.admin.AdminStatsDto;
import com.curiolearn.user.User;
import com.curiolearn.quiz.ExamSessionRepository;
import com.curiolearn.quiz.QuizQuestionRepository;
import com.curiolearn.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final ExamSessionRepository examSessionRepository;

    public AdminService(UserRepository userRepository, 
                        QuizQuestionRepository quizQuestionRepository, 
                        ExamSessionRepository examSessionRepository) {
        this.userRepository = userRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.examSessionRepository = examSessionRepository;
    }

    public AdminStatsDto getSystemStats() {
        long totalUsers = userRepository.count();
        long totalQuestions = quizQuestionRepository.count();
        long totalExamsTaken = examSessionRepository.count();

        return AdminStatsDto.builder()
                .totalUsers(totalUsers)
                .totalQuestions(totalQuestions)
                .totalExamsTaken(totalExamsTaken)
                .build();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}

