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

class VeterinaryCurriculumControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        VeterinaryCurriculumController controller = new VeterinaryCurriculumController();
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("TC-API-VET-001: GET /api/v1/veterinary/bvsc/subjects returns BVSc curriculum")
    void testGetBVSCCurriculum() throws Exception {
        mockMvc.perform(get("/api/v1/veterinary/bvsc/subjects"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", not(empty())))
                .andExpect(jsonPath("$[0].subjects[0].id", is("vet-van")));
    }

    @Test
    @DisplayName("TC-API-VET-002: GET /api/v1/veterinary/mvsc/specialties returns MVSc specialties")
    void testGetMVSCSpecialties() throws Exception {
        mockMvc.perform(get("/api/v1/veterinary/mvsc/specialties"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id", is("mvsc-surg")));
    }

    @Test
    @DisplayName("TC-API-VET-003: GET /api/v1/veterinary/competencies returns VCI competencies")
    void testGetCompetencies() throws Exception {
        mockMvc.perform(get("/api/v1/veterinary/competencies"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].code", is("VAN-101.1")));
    }
}
