package com.curiolearn.ai;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class RagControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RagService ragService;

    @BeforeEach
    void setUp() {
        RagController controller = new RagController(ragService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("TC-API-RAG-001: POST /api/v1/rag/ingest with valid path succeeds")
    void testIngestCurriculum_Success() throws Exception {
        doNothing().when(ragService).ingestCurriculum(anyString());

        mockMvc.perform(post("/api/v1/rag/ingest")
                        .param("path", "./docs/curriculum"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Successfully ingested curriculum into Elasticsearch.")));
    }

    @Test
    @DisplayName("TC-API-RAG-002: POST /api/v1/rag/ingest with path traversal returns 400 Bad Request")
    void testIngestCurriculum_PathTraversal_Returns400() throws Exception {
        mockMvc.perform(post("/api/v1/rag/ingest")
                        .param("path", "../../etc/passwd"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-API-RAG-003: POST /api/v1/rag/ingest-db ingests database content blocks")
    void testIngestFromDatabase_Success() throws Exception {
        doNothing().when(ragService).ingestFromDatabase();

        mockMvc.perform(post("/api/v1/rag/ingest-db"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Successfully ingested database content blocks into Elasticsearch.")));
    }
}
