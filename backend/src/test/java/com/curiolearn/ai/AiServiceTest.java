package com.curiolearn.ai;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiServiceTest {

    @Mock
    private RagService ragService;

    private AiService aiService;

    @BeforeEach
    void setUp() {
        aiService = new AiService(ragService);
    }

    @Test
    @DisplayName("TC-AI-001: Academic emergency questions are NOT blocked by crisis filter")
    void testAskTutor_AcademicEmergencyQuestionNotBlocked() {
        String response = aiService.askTutor(
                "What is the first-line emergency pharmacological management for acute anaphylaxis in adults?",
                "Emergency Medicine",
                Collections.emptyList()
        );

        // When GEMINI_API_KEY is not configured, it should return offline message rather than emergency crisis block
        assertTrue(response.contains("AI Tutor is currently offline") || response.contains("epinephrine"));
        assertFalse(response.contains("**CRITICAL SAFETY NOTICE**"));
    }

    @Test
    @DisplayName("TC-AI-002: Personal acute emergency is intercepted with safety dispatch notice")
    void testAskTutor_PersonalEmergencyIntercepted() {
        String response = aiService.askTutor(
                "I am having severe chest pain and I cannot breathe help me",
                "General",
                Collections.emptyList()
        );

        assertTrue(response.contains("**CRITICAL SAFETY NOTICE**"));
        assertTrue(response.contains("112 / 911"));
        verifyNoInteractions(ragService);
    }
}
