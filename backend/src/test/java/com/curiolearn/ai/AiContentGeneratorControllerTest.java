package com.curiolearn.ai;

import com.curiolearn.curriculum.ContentBlock;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AiContentGeneratorControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private AiContentGeneratorService generatorService;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        generatorService = Mockito.mock(AiContentGeneratorService.class);
        AiContentGeneratorController controller = new AiContentGeneratorController(generatorService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("POST /api/v1/ai/generate/quiz returns 200 OK with questions payload")
    void testGenerateQuiz_Success() throws Exception {
        when(generatorService.generateQuiz(anyString(), anyInt()))
                .thenReturn(Map.of("questions", List.of(Map.of("question", "What is GFR?"))));

        AiContentGeneratorController.GenerateRequest request = new AiContentGeneratorController.GenerateRequest();
        request.setText("Renal physiology and glomerulus");
        request.setCount(2);

        mockMvc.perform(post("/api/v1/ai/generate/quiz")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.questions").isArray());
    }

    @Test
    @DisplayName("POST /api/v1/ai/generate/rx-card returns 200 OK with firstLineRegimen")
    void testGenerateRxCard_Success() throws Exception {
        when(generatorService.generateRxCard(anyString()))
                .thenReturn(Map.of(
                        "condition", "Bacterial Meningitis",
                        "firstLineRegimen", List.of(Map.of("drugName", "Ceftriaxone", "dosage", "2g IV"))
                ));

        AiContentGeneratorController.GenerateRequest request = new AiContentGeneratorController.GenerateRequest();
        request.setText("Bacterial Meningitis empiric antimicrobial therapy");

        mockMvc.perform(post("/api/v1/ai/generate/rx-card")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.condition").value("Bacterial Meningitis"))
                .andExpect(jsonPath("$.firstLineRegimen").isArray());
    }

    @Test
    @DisplayName("POST /api/v1/ai/generate/decision-tree returns 200 OK with triage nodes")
    void testGenerateDecisionTree_Success() throws Exception {
        when(generatorService.generateDecisionTree(anyString()))
                .thenReturn(Map.of(
                        "title", "Anaphylaxis Triage",
                        "initialNodeId", "node-1",
                        "nodes", List.of(Map.of("id", "node-1", "prompt", "Is airway compromised?"))
                ));

        AiContentGeneratorController.GenerateRequest request = new AiContentGeneratorController.GenerateRequest();
        request.setText("Acute anaphylaxis resuscitation pathway");

        mockMvc.perform(post("/api/v1/ai/generate/decision-tree")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Anaphylaxis Triage"))
                .andExpect(jsonPath("$.initialNodeId").value("node-1"));
    }

    @Test
    @DisplayName("POST /api/v1/ai/generate/lesson/{lessonId}/{modality} returns persisted DRAFT content block")
    void testGenerateForLesson_Success() throws Exception {
        UUID lessonId = UUID.randomUUID();
        ContentBlock block = ContentBlock.builder()
                .id(UUID.randomUUID())
                .type("QUIZ")
                .status("DRAFT")
                .orderIndex(2)
                .metadata(Map.of("questions", List.of()))
                .build();

        when(generatorService.generateAndSaveForLesson(any(UUID.class), anyString(), anyInt()))
                .thenReturn(block);

        mockMvc.perform(post("/api/v1/ai/generate/lesson/" + lessonId + "/quiz?count=3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DRAFT"))
                .andExpect(jsonPath("$.type").value("QUIZ"));
    }
}
