package com.curiolearn.curriculum;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PharmacyCurriculumController.class)
public class PharmacyCurriculumControllerTest {

    @Autowired
    private MockMvc mockMvc;

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
