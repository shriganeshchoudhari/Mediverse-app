package com.curiolearn.curriculum;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class PharmacyCurriculumControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        PharmacyCurriculumController controller = new PharmacyCurriculumController();
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    public void getPharmDSubjects_Returns200() throws Exception {
        mockMvc.perform(get("/api/v1/pharmacy/pharmd/subjects"))
               .andExpect(status().isOk());
    }

    @Test
    public void getBPharmSubjects_Returns200() throws Exception {
        mockMvc.perform(get("/api/v1/pharmacy/bpharm/subjects"))
               .andExpect(status().isOk());
    }

    @Test
    public void getCompetencies_Returns200() throws Exception {
        mockMvc.perform(get("/api/v1/pharmacy/competencies"))
               .andExpect(status().isOk());
    }

    @Test
    public void getTdmDrugs_Returns200() throws Exception {
        mockMvc.perform(get("/api/v1/pharmacy/tdm/drugs"))
               .andExpect(status().isOk());
    }
}
