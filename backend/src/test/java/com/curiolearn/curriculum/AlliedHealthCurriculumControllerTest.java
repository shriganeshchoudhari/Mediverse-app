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

class AlliedHealthCurriculumControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        AlliedHealthCurriculumController controller = new AlliedHealthCurriculumController();
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("TC-API-ALLIED-001: GET /api/v1/allied/programs returns 200 OK")
    void testGetAlliedPrograms() throws Exception {
        mockMvc.perform(get("/api/v1/allied/programs"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("TC-API-ALLIED-002: GET /api/v1/allied/subjects/allied-perfusion returns sample subject")
    void testGetSubjectById() throws Exception {
        mockMvc.perform(get("/api/v1/allied/subjects/allied-perfusion"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is("allied-perfusion")));
    }
}
