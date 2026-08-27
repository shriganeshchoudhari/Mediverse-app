package com.curiolearn.quiz;

import com.curiolearn.quiz.QuizQuestionDto;
import com.curiolearn.quiz.QuizSubmitDto;
import com.curiolearn.quiz.QuizResultDto;
import com.curiolearn.quiz.QuizQuestionSyncDto;
import com.curiolearn.quiz.QuizQuestion;
import com.curiolearn.quiz.QuizAttempt;
import com.curiolearn.user.User;
import com.curiolearn.quiz.QuizQuestionRepository;
import com.curiolearn.quiz.QuizAttemptRepository;
import com.curiolearn.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class QuizService {

    private final QuizQuestionRepository questionRepository;
    private final QuizAttemptRepository attemptRepository;
    private final UserRepository userRepository;

    public QuizService(QuizQuestionRepository questionRepository, 
                       QuizAttemptRepository attemptRepository, 
                       UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<QuizQuestionDto> getQuizQuestions(String lessonId) {
        List<QuizQuestion> questions = questionRepository.findByLessonId(lessonId);
        return questions.stream()
                .map(q -> QuizQuestionDto.builder()
                        .id(q.getId())
                        .questionText(q.getQuestionText())
                        .optionA(q.getOptionA())
                        .optionB(q.getOptionB())
                        .optionC(q.getOptionC())
                        .optionD(q.getOptionD())
                        .difficulty(q.getDifficulty())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public QuizResultDto submitQuiz(UUID userId, String lessonId, QuizSubmitDto submission) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<QuizQuestion> questions = questionRepository.findByLessonId(lessonId);
        if (questions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No questions found for lesson: " + lessonId);
        }

        Map<UUID, QuizQuestion> questionMap = questions.stream()
                .collect(Collectors.toMap(QuizQuestion::getId, q -> q));

        int correctCount = 0;
        StringBuilder explanations = new StringBuilder();
        explanations.append("### Quiz Review Summary\n\n");

        for (QuizSubmitDto.AnswerDto ans : submission.getAnswers()) {
            UUID qId;
            try {
                qId = UUID.fromString(ans.getQuestionId());
            } catch (IllegalArgumentException e) {
                continue;
            }

            QuizQuestion question = questionMap.get(qId);
            if (question != null) {
                boolean isCorrect = question.getCorrectOption().trim().equalsIgnoreCase(ans.getSelectedOption().trim());
                if (isCorrect) {
                    correctCount++;
                }

                explanations.append("**Q: ").append(question.getQuestionText()).append("**\n")
                        .append("- Your Answer: ").append(ans.getSelectedOption())
                        .append(isCorrect ? " (Correct) âœ…" : " (Incorrect) âŒ")
                        .append("\n- Correct Option: ").append(question.getCorrectOption())
                        .append("\n- Explanation: ").append(question.getExplanation())
                        .append("\n\n");
            }
        }

        int total = questions.size();
        int scorePercentage = (int) Math.round(((double) correctCount / total) * 100);
        boolean passed = scorePercentage >= 60;

        // Gamification rewards
        int xpEarned = 0;
        if (passed) {
            xpEarned = 50 + (correctCount * 10); // Base passing XP + correct answers bonus
            user.setCurrentXp(user.getCurrentXp() + xpEarned);
            userRepository.save(user);
        }

        // Persist attempt
        QuizAttempt attempt = QuizAttempt.builder()
                .user(user)
                .lessonId(lessonId)
                .score(correctCount)
                .totalQuestions(total)
                .timeTakenSeconds(submission.getTimeTakenSeconds())
                .build();
        attemptRepository.save(attempt);

        return QuizResultDto.builder()
                .score(correctCount)
                .totalQuestions(total)
                .xpEarned(xpEarned)
                .passed(passed)
                .explanationMarkup(explanations.toString())
                .build();
    }

    @Transactional
    public List<QuizQuestionDto> syncQuizQuestions(String lessonId, List<QuizQuestionSyncDto> reqQuestions) {
        List<QuizQuestion> existingQuestions = questionRepository.findByLessonId(lessonId);
        List<QuizQuestion> toSave = new ArrayList<>();

        int reqSize = reqQuestions.size();
        int existSize = existingQuestions.size();

        for (int i = 0; i < reqSize; i++) {
            QuizQuestionSyncDto req = reqQuestions.get(i);
            QuizQuestion q;
            if (i < existSize) {
                // Update existing record in-place to preserve question ID for past QuizAttempts
                q = existingQuestions.get(i);
            } else {
                q = new QuizQuestion();
                q.setLessonId(lessonId);
            }
            q.setQuestionText(req.getQuestionText());
            q.setOptionA(req.getOptionA());
            q.setOptionB(req.getOptionB());
            q.setOptionC(req.getOptionC());
            q.setOptionD(req.getOptionD());
            q.setCorrectOption(req.getCorrectOption());
            q.setExplanation(req.getExplanation());
            q.setDifficulty(req.getDifficulty() == null ? "MEDIUM" : req.getDifficulty());
            toSave.add(q);
        }

        questionRepository.saveAll(toSave);

        // Remove any excess questions if payload has fewer items than before
        if (existSize > reqSize) {
            List<QuizQuestion> excess = existingQuestions.subList(reqSize, existSize);
            questionRepository.deleteAll(excess);
        }

        return getQuizQuestions(lessonId);
    }
}


