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

class HealthcareDomainControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        HealthcareDomainController controller = new HealthcareDomainController();
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("TC-API-DOMAIN-001: GET /api/v1/healthcare/domains returns all 9 domains")
    void testGetAllDomains() throws Exception {
        mockMvc.perform(get("/api/v1/healthcare/domains"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(9)))
                .andExpect(jsonPath("$[0].id", is("allopathic")))
                .andExpect(jsonPath("$[1].id", is("dental")))
                .andExpect(jsonPath("$[2].id", is("ayush")));
    }

    @Test
    @DisplayName("TC-API-DOMAIN-002: GET /api/v1/healthcare/domains/dental returns Dental domain details")
    void testGetDomainById_Dental() throws Exception {
        mockMvc.perform(get("/api/v1/healthcare/domains/dental"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is("dental")))
                .andExpect(jsonPath("$.shortName", is("Dental")))
                .andExpect(jsonPath("$.tier", is(1)))
                .andExpect(jsonPath("$.programs[0].name", is("BDS")));
    }

    @Test
    @DisplayName("TC-API-DOMAIN-003: GET /api/v1/healthcare/domains/ayush returns AYUSH domain with 107 Marma highlights")
    void testGetDomainById_Ayush() throws Exception {
        mockMvc.perform(get("/api/v1/healthcare/domains/ayush"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is("ayush")))
                .andExpect(jsonPath("$.shortName", is("AYUSH")))
                .andExpect(jsonPath("$.programs[0].name", is("BAMS")))
                .andExpect(jsonPath("$.keyHighlights", hasItem("3D 107 Marma Points Interactive Map")));
    }

    @Test
    @DisplayName("TC-API-DOMAIN-004: GET /api/v1/healthcare/domains/invalid returns 404")
    void testGetDomainById_NotFound() throws Exception {
        mockMvc.perform(get("/api/v1/healthcare/domains/unknown-domain"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("TC-API-DOMAIN-005: GET /api/v1/healthcare/tiers/1 returns Tier 1 priority domains")
    void testGetDomainsByTier_Tier1() throws Exception {
        mockMvc.perform(get("/api/v1/healthcare/tiers/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(4)))
                .andExpect(jsonPath("$[*].id", containsInAnyOrder("allopathic", "dental", "ayush", "pharmacy")));
    }
}
