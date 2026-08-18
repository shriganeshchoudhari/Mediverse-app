package com.curiolearn.quiz;

import com.curiolearn.user.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ExamApiControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ExamService examService;

    @Mock
    private Authentication authentication;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        ExamController controller = new ExamController(examService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("TC-API-EXAM-001: GET /api/v1/exam/questions returns random clinical exam questions")
    void testGetExamQuestions_Success() throws Exception {
        QuizQuestionDto q1 = QuizQuestionDto.builder()
                .id(UUID.randomUUID())
                .questionText("A 65-year-old male presents with exertional syncope...")
                .optionA("Aortic Stenosis")
                .optionB("Mitral Regurgitation")
                .optionC("Aortic Regurgitation")
                .optionD("Tricuspid Stenosis")
                .correctOption("A")
                .explanation("Severe aortic stenosis generates high left ventricular pressure gradient.")
                .build();

        when(examService.getRandomExamQuestions(anyInt())).thenReturn(List.of(q1));

        mockMvc.perform(get("/api/v1/exam/questions")
                        .principal(authentication)
                        .param("limit", "10"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].questionText", containsString("exertional syncope")))
                .andExpect(jsonPath("$[0].optionA", is("Aortic Stenosis")));
    }

    @Test
    @DisplayName("TC-API-EXAM-002: POST /api/v1/exam/submit records exam score and returns session summary")
    void testSubmitExam_Success() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();

        ExamController.ExamSubmitRequest request = new ExamController.ExamSubmitRequest();
        request.setSectionIds(List.of("cardiovascular", "renal"));
        request.setScore(9);
        request.setTotalQuestions(10);
        request.setTimeTakenSeconds(450);

        User user = User.builder().id(userId).email("student@mediverse.edu").build();

        ExamSession session = ExamSession.builder()
                .id(sessionId)
                .user(user)
                .sectionIds(List.of("cardiovascular", "renal"))
                .score(9)
                .totalQuestions(10)
                .timeTakenSeconds(450)
                .completedAt(LocalDateTime.now())
                .build();

        when(authentication.getName()).thenReturn(userId.toString());
        when(examService.submitExam(eq(userId), any(), eq(9), eq(10), eq(450))).thenReturn(session);

        mockMvc.perform(post("/api/v1/exam/submit")
                        .principal(authentication)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(sessionId.toString())))
                .andExpect(jsonPath("$.score", is(9)))
                .andExpect(jsonPath("$.totalQuestions", is(10)))
                .andExpect(jsonPath("$.timeTakenSeconds", is(450)));
    }
}
