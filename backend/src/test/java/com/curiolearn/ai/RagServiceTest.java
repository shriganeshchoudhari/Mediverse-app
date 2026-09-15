package com.curiolearn.ai;

import com.curiolearn.curriculum.Lesson;
import com.curiolearn.curriculum.ContentBlock;
import com.curiolearn.curriculum.LessonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RagServiceTest {

    @Mock
    private TextbookChunkRepository textbookChunkRepository;

    @Mock
    private ElasticsearchOperations elasticsearchOperations;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private CurriculumVectorEmbeddingRepository vectorEmbeddingRepository;

    @Mock
    private EmbeddingService embeddingService;

    private RagService ragService;

    @BeforeEach
    void setUp() {
        ragService = new RagService(
                textbookChunkRepository,
                elasticsearchOperations,
                lessonRepository,
                vectorEmbeddingRepository,
                embeddingService
        );
    }

    @Test
    @DisplayName("TC-RAG-001: ingestFromDatabase indexes EXPLANATION and CLINICAL_CASE blocks")
    void testIngestFromDatabase() {
        Lesson lesson = new Lesson();
        lesson.setId(UUID.randomUUID());
        lesson.setTitle("Cardiac Action Potential");

        ContentBlock explanationBlock = new ContentBlock();
        explanationBlock.setId(UUID.randomUUID());
        explanationBlock.setType("EXPLANATION");
        explanationBlock.setMetadata(Map.of("text", "The cardiac action potential is divided into Phase 0 through Phase 4..."));

        ContentBlock caseBlock = new ContentBlock();
        caseBlock.setId(UUID.randomUUID());
        caseBlock.setType("CLINICAL_CASE");
        caseBlock.setMetadata(Map.of(
                "scenario", "A 55-year-old male presents with palpitations.",
                "question", "What is the primary antiarrhythmic mechanism?",
                "explanation", "Class I antiarrhythmics block fast sodium channels during Phase 0."
        ));

        lesson.setContentBlocks(List.of(explanationBlock, caseBlock));

        when(lessonRepository.findAll()).thenReturn(List.of(lesson));

        ragService.ingestFromDatabase();

        verify(textbookChunkRepository).deleteAll();
        verify(vectorEmbeddingRepository).deleteAll();
        verify(textbookChunkRepository, atLeast(2)).save(any(TextbookChunk.class));
        verify(vectorEmbeddingRepository).saveAll(anyList());
    }

    @Test
    @DisplayName("TC-RAG-002: searchRelevantContext executes RRF hybrid fusion over Postgres and ES")
    void testSearchRelevantContext_RRFRetrieval() {
        when(vectorEmbeddingRepository.searchPostgresFullTextRanked("action potential", 5)).thenReturn(List.of(
                CurriculumVectorEmbedding.builder()
                        .heading("Electrophysiology")
                        .chunkText("Phase 0 depolarization is mediated by inward Na+ current.")
                        .build()
        ));

        String context = ragService.searchRelevantContext("action potential");

        assertNotNull(context);
        assertTrue(context.contains("Phase 0 depolarization"));
        assertTrue(context.contains("RRF Hybrid Search"));
    }

    @Test
    @DisplayName("TC-RAG-003: searchRelevantContext gracefully handles embedding service failure")
    void testSearchRelevantContext_EmbeddingExceptionGracefulFallback() {
        when(vectorEmbeddingRepository.searchPostgresFullTextRanked("action potential", 5)).thenReturn(List.of(
                CurriculumVectorEmbedding.builder()
                        .heading("Electrophysiology")
                        .chunkText("Phase 0 depolarization is mediated by inward Na+ current.")
                        .build()
        ));
        when(embeddingService.getEmbedding("action potential")).thenThrow(new RuntimeException("Gemini API rate limited"));

        String context = ragService.searchRelevantContext("action potential");

        assertNotNull(context);
        assertTrue(context.contains("Phase 0 depolarization"));
        assertTrue(context.contains("RRF Hybrid Search"));
    }

    @Test
    @DisplayName("TC-RAG-004: searchRelevantContext combines dense vector search when available")
    void testSearchRelevantContext_WithDenseVectorSearch() {
        when(vectorEmbeddingRepository.searchPostgresFullTextRanked("antiarrhythmic", 5)).thenReturn(List.of(
                CurriculumVectorEmbedding.builder()
                        .heading("Pharmacology")
                        .chunkText("Class IA blocks fast sodium channels.")
                        .build()
        ));
        when(embeddingService.getEmbedding("antiarrhythmic")).thenReturn(List.of(0.12, 0.34, -0.56));
        when(vectorEmbeddingRepository.searchByVectorSimilarity(anyString(), eq(5))).thenReturn(List.of(
                CurriculumVectorEmbedding.builder()
                        .heading("Cardiology")
                        .chunkText("Vaughan-Williams classification of antiarrhythmic agents.")
                        .build()
        ));

        String context = ragService.searchRelevantContext("antiarrhythmic");

        assertNotNull(context);
        assertTrue(context.contains("Class IA blocks fast sodium"));
        assertTrue(context.contains("Vaughan-Williams"));
    }

    @Test
    @DisplayName("TC-RAG-005: searchRelevantContext returns empty for blank or null prompt")
    void testSearchRelevantContext_EmptyOrNullPrompt() {
        assertEquals("", ragService.searchRelevantContext(""));
        assertEquals("", ragService.searchRelevantContext("   "));
        assertEquals("", ragService.searchRelevantContext(null));
    }
}
