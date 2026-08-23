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

class PublicHealthCurriculumControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        PublicHealthCurriculumController controller = new PublicHealthCurriculumController();
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("TC-API-PUB-001: GET /api/v1/public-health/mph/subjects returns MPH subjects")
    void testGetMPHSubjects() throws Exception {
        mockMvc.perform(get("/api/v1/public-health/mph/subjects"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].name", is("Principles of Epidemiology")));
    }

    @Test
    @DisplayName("TC-API-PUB-002: GET /api/v1/public-health/policies returns national health policies")
    void testGetPolicies() throws Exception {
        mockMvc.perform(get("/api/v1/public-health/policies"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].name", is("National Health Policy")));
    }
}
