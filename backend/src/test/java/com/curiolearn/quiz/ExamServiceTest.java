package com.curiolearn.quiz;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExamServiceTest {

    @Mock
    private QuizQuestionRepository quizQuestionRepository;

    @InjectMocks
    private ExamService examService;

    private QuizQuestion question1;
    private QuizQuestion question2;

    @BeforeEach
    void setUp() {
        question1 = QuizQuestion.builder()
                .id(UUID.randomUUID())
                .questionText("What is the normal cardiac output?")
                .optionA("1 L/min")
                .optionB("4-8 L/min")
                .optionC("10 L/min")
                .optionD("20 L/min")
                .correctOption("B")
                .explanation("Normal CO is 4-8 L/min.")
                .lessonId("cardiac-cycle")
                .difficulty("MEDIUM")
                .build();

        question2 = QuizQuestion.builder()
                .id(UUID.randomUUID())
                .questionText("What is the GFR?")
                .optionA("10 ml/min")
                .optionB("90-120 ml/min")
                .optionC("200 ml/min")
                .optionD("5 ml/min")
                .correctOption("B")
                .explanation("Normal GFR is 90-120 ml/min.")
                .lessonId("renal-filtration")
                .difficulty("HARD")
                .build();
    }

    @Test
    void testGenerateExam_ReturnsMappedDtoList() {
        // Arrange
        int limit = 2;
        when(quizQuestionRepository.findRandomQuestions(limit)).thenReturn(Arrays.asList(question1, question2));

        // Act
        List<QuizQuestionDto> result = examService.getRandomExamQuestions(limit);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());

        QuizQuestionDto dto1 = result.get(0);
        assertEquals(question1.getId(), dto1.getId());
        assertEquals(question1.getQuestionText(), dto1.getQuestionText());
        assertEquals("B", dto1.getCorrectOption());
        assertEquals("Normal CO is 4-8 L/min.", dto1.getExplanation());

        verify(quizQuestionRepository, times(1)).findRandomQuestions(limit);
    }
}
