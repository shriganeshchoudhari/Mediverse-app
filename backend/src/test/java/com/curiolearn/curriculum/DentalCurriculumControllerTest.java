package com.curiolearn.curriculum;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class DentalCurriculumControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        DentalCurriculumController controller = new DentalCurriculumController();
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void getBDSSubjects_returnsAllEleven() throws Exception {
        mockMvc.perform(get("/api/v1/dental/bds/subjects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(11)))
                .andExpect(jsonPath("$[0].code", is("BDS-GA")));
    }

    @Test
    void getBDSSubjectById_returnsCorrectSubject() throws Exception {
        mockMvc.perform(get("/api/v1/dental/bds/subjects/bds-ga"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", containsString("Anatomy")));
    }

    @Test
    void getBDSSubjectById_unknownId_returns404() throws Exception {
        mockMvc.perform(get("/api/v1/dental/bds/subjects/bds-xyz"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getDCICompetencies_returnsAll() throws Exception {
        mockMvc.perform(get("/api/v1/dental/bds/competencies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(3))));
    }

    @Test
    void getDCICompetencies_filteredBySubject() throws Exception {
        mockMvc.perform(get("/api/v1/dental/bds/competencies?subject=BDS-GA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].subjectCode", is("BDS-GA")));
    }

    @Test
    void getMDSSpecialties_returnsAllEight() throws Exception {
        mockMvc.perform(get("/api/v1/dental/mds/specialties"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(8)));
    }

    @Test
    void getMDSSpecialtyById_returnsOrthodontics() throws Exception {
        mockMvc.perform(get("/api/v1/dental/mds/specialties/mds-ortho"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dciSpecialtyCode", is("MDS-I")));
    }

    @Test
    void getMDSSpecialtyById_unknownId_returns404() throws Exception {
        mockMvc.perform(get("/api/v1/dental/mds/specialties/mds-xyz"))
                .andExpect(status().isNotFound());
    }
}
