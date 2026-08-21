package com.curiolearn.curriculum;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AYUSHCurriculumController.class)
public class AYUSHCurriculumControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetBamsSubjects() throws Exception {
        mockMvc.perform(get("/api/v1/ayush/bams/subjects"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetCompetencies() throws Exception {
        mockMvc.perform(get("/api/v1/ayush/competencies"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetMdSpecialties() throws Exception {
        mockMvc.perform(get("/api/v1/ayush/md/specialties"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetBhmsSubjects() throws Exception {
        mockMvc.perform(get("/api/v1/ayush/bhms/subjects"))
                .andExpect(status().isOk());
    }
}
