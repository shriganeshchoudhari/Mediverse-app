package com.curiolearn.ai;

import com.curiolearn.curriculum.ContentBlock;
import com.curiolearn.curriculum.ContentBlockRepository;
import com.curiolearn.curriculum.Lesson;
import com.curiolearn.curriculum.LessonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AiContentGeneratorServiceTest {

    private AiContentGeneratorService generatorService;
    private LessonRepository lessonRepository;
    private ContentBlockRepository contentBlockRepository;

    @BeforeEach
    void setUp() {
        lessonRepository = Mockito.mock(LessonRepository.class);
        contentBlockRepository = Mockito.mock(ContentBlockRepository.class);
        generatorService = new AiContentGeneratorService(lessonRepository, contentBlockRepository);
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
    @DisplayName("TC-AI-GEN-003: generateClinicalCase returns structured vignette fields")
    void testGenerateClinicalCase_OfflineFallback() {
        Map<String, Object> result = generatorService.generateClinicalCase("Acute ischemic stroke management and ASPECTS score");

        assertNotNull(result);
        assertTrue(result.containsKey("patientProfile"));
        assertTrue(result.containsKey("decisionQuestions"));
    }

    @Test
    @DisplayName("TC-AI-GEN-004: generateRxCard returns first-line regimen and renal adjustments")
    void testGenerateRxCard_OfflineFallback() {
        Map<String, Object> result = generatorService.generateRxCard("Bacterial endocarditis empiric therapy");

        assertNotNull(result);
        assertTrue(result.containsKey("firstLineRegimen"));
        assertTrue(result.containsKey("renalAdjustment"));
    }

    @Test
    @DisplayName("TC-AI-GEN-005: generateDecisionTree returns nodes and triage steps")
    void testGenerateDecisionTree_OfflineFallback() {
        Map<String, Object> result = generatorService.generateDecisionTree("Acute Upper Gastrointestinal Bleeding");

        assertNotNull(result);
        assertTrue(result.containsKey("nodes"));
        assertTrue(result.containsKey("initialNodeId"));
    }

    @Test
    @DisplayName("TC-AI-GEN-006: generateAndSaveForLesson saves DRAFT content block")
    void testGenerateAndSaveForLesson() {
        UUID lessonId = UUID.randomUUID();
        Lesson mockLesson = Lesson.builder().id(lessonId).title("Cardiac Arrhythmias").build();
        when(lessonRepository.findById(lessonId)).thenReturn(Optional.of(mockLesson));
        when(contentBlockRepository.findByLessonIdOrderByOrderIndexAsc(lessonId)).thenReturn(List.of());
        when(contentBlockRepository.save(any(ContentBlock.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContentBlock created = generatorService.generateAndSaveForLesson(lessonId, "QUIZ", 3);

        assertNotNull(created);
        assertEquals("QUIZ", created.getType());
        assertEquals("DRAFT", created.getStatus());
        assertNotNull(created.getMetadata());
    }
}
