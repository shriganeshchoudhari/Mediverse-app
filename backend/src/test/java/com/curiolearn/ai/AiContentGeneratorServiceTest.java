package com.curiolearn.ai;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class AiContentGeneratorServiceTest {

    private AiContentGeneratorService generatorService;

    @BeforeEach
    void setUp() {
        generatorService = new AiContentGeneratorService();
    }

    @Test
    @DisplayName("TC-AI-GEN-001: generateQuiz returns structured questions payload in offline fallback")
    void testGenerateQuiz_OfflineFallback() {
        Map<String, Object> result = generatorService.generateQuiz("Valvular pressure-volume loop mechanics in aortic stenosis", 3);

        assertNotNull(result);
        assertTrue(result.containsKey("questions"));
        List<?> questions = (List<?>) result.get("questions");
        assertEquals(3, questions.size());
    }

    @Test
    @DisplayName("TC-AI-GEN-002: generateFlashcards returns high-yield card pairs in offline fallback")
    void testGenerateFlashcards_OfflineFallback() {
        Map<String, Object> result = generatorService.generateFlashcards("Continuous renal replacement therapy modalities", 2);

        assertNotNull(result);
        assertTrue(result.containsKey("cards"));
        List<?> cards = (List<?>) result.get("cards");
        assertEquals(2, cards.size());
    }

    @Test
    @DisplayName("TC-AI-GEN-003: generateClinicalCase returns scenario, question and explanation")
    void testGenerateClinicalCase_OfflineFallback() {
        Map<String, Object> result = generatorService.generateClinicalCase("Acute ischemic stroke management and ASPECTS score");

        assertNotNull(result);
        assertTrue(result.containsKey("scenario"));
        assertTrue(result.containsKey("question"));
        assertTrue(result.containsKey("explanation"));
    }
}
