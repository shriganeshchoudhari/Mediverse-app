package com.curiolearn.curriculum;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class PhysiotherapyCurriculumControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        PhysiotherapyCurriculumController controller = new PhysiotherapyCurriculumController();
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("TC-API-PHYSIO-001: GET /api/v1/physiotherapy/bpt/subjects returns 200 OK")
    void testGetBPTSubjects() throws Exception {
        mockMvc.perform(get("/api/v1/physiotherapy/bpt/subjects"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("TC-API-PHYSIO-002: GET /api/v1/physiotherapy/competencies returns 200 OK")
    void testGetCompetencies() throws Exception {
        mockMvc.perform(get("/api/v1/physiotherapy/competencies"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}
