package com.curiolearn.aitutor;

import com.curiolearn.ai.RagService;
import com.curiolearn.aitutor.controller.AITutorApiController;
import com.curiolearn.aitutor.dto.AITutorChatRequest;
import com.curiolearn.aitutor.service.AITutorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AITutorApiControllerTest {

    private MockMvc mockMvc;
    private AITutorService aiTutorService;
    private RagService ragService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        ragService = Mockito.mock(RagService.class);
        aiTutorService = new AITutorService(ragService);
        AITutorApiController controller = new AITutorApiController(aiTutorService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void testStreamChat_ReturnsStreamingEventStream() throws Exception {
        AITutorChatRequest request = AITutorChatRequest.builder()
                .message("Explain the Frank-Starling mechanism and preload.")
                .context("Cardiac Cycle & Wiggers Diagram")
                .build();

        MvcResult mvcResult = mockMvc.perform(post("/api/v1/ai-tutor/chat/stream")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.TEXT_EVENT_STREAM_VALUE)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(request().asyncStarted())
                .andExpect(status().isOk())
                .andReturn();

        Thread.sleep(100);
        mockMvc.perform(asyncDispatch(mvcResult))
                .andExpect(status().isOk());

        String responseBody = mvcResult.getResponse().getContentAsString();
        assertTrue(responseBody.contains("Frank-Starling") || responseBody.contains("Preload") || responseBody.contains("sarcomeres"));
    }

    @Test
    void testStreamChat_EmergencyMedicalScreening() throws Exception {
        assertTrue(aiTutorService.isEmergency("Patient has crushing chest pain and shortness of breath"));
        assertTrue(aiTutorService.isEmergency("Sudden stroke symptoms"));
        assertFalse(aiTutorService.isEmergency("How does calcium influx cause myocyte contraction?"));

        AITutorChatRequest request = AITutorChatRequest.builder()
                .message("I have severe chest pain and cannot breathe!")
                .build();

        MvcResult mvcResult = mockMvc.perform(post("/api/v1/ai-tutor/chat/stream")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(request().asyncStarted())
                .andExpect(status().isOk())
                .andReturn();

        Thread.sleep(100);
        mockMvc.perform(asyncDispatch(mvcResult))
                .andExpect(status().isOk());

        String responseBody = mvcResult.getResponse().getContentAsString();
        assertTrue(responseBody.contains("CRITICAL CLINICAL SAFETY WARNING") || responseBody.contains("911"));
    }

    @Test
    void testDirectServiceStreamingExecution() throws Exception {
        ResponseBodyEmitter emitter = new ResponseBodyEmitter();
        AITutorChatRequest request = AITutorChatRequest.builder()
                .message("Why does GFR change with afferent arteriole resistance?")
                .context("Renal Filtration & Glomerular Dynamics")
                .build();

        assertDoesNotThrow(() -> aiTutorService.streamSocraticResponse(request, emitter));
    }
}
