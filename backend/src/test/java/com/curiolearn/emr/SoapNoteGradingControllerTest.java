package com.curiolearn.emr;

import com.curiolearn.emr.controller.SoapNoteGradingController;
import com.curiolearn.emr.service.ClinicalDocumentationEvaluator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class SoapNoteGradingControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ClinicalDocumentationEvaluator evaluator;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        SoapNoteGradingController controller = new SoapNoteGradingController(evaluator);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("TC-API-SOAP-001: POST /api/v1/emr/soap-grade/evaluate grades SOAP clinical note")
    void testEvaluateNote_ReturnsRubricScore() throws Exception {
        Map<String, String> payload = Map.of(
                "subjective", "Chest pain on exertion.",
                "objective", "BP 140/90, troponin negative.",
                "assessment", "Stable Angina Pectoris.",
                "plan", "Start Aspirin and Statin."
        );

        when(evaluator.gradeSoapNote(anyString(), anyString(), anyString(), anyString(), anyString()))
                .thenReturn(Map.of("totalScore", 92, "grade", "A", "feedback", "Thorough clinical documentation"));

        mockMvc.perform(post("/api/v1/emr/soap-grade/evaluate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalScore", is(92)))
                .andExpect(jsonPath("$.grade", is("A")));
    }
}
