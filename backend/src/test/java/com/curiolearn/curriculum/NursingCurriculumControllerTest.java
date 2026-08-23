package com.curiolearn.curriculum;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class NursingCurriculumControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        NursingCurriculumController controller = new NursingCurriculumController();
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("TC-API-NURSE-001: GET /api/v1/nursing/bscnursing/subjects returns BSc Nursing subjects")
    void testGetBScNursingSubjects() throws Exception {
        mockMvc.perform(get("/api/v1/nursing/bscnursing/subjects"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", not(empty())));
    }

    @Test
    @DisplayName("TC-API-NURSE-002: GET /api/v1/nursing/competencies returns INC competencies")
    void testGetNursingCompetencies() throws Exception {
        mockMvc.perform(get("/api/v1/nursing/competencies"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id", is("INC-MSN-01")));
    }

    @Test
    @DisplayName("TC-API-NURSE-003: GET /api/v1/nursing/skills returns clinical nursing skills")
    void testGetNursingSkills() throws Exception {
        mockMvc.perform(get("/api/v1/nursing/skills"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].name", is("IV Insertion")));
    }
}
