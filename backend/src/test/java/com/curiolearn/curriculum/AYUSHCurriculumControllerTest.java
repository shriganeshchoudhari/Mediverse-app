package com.curiolearn.curriculum;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AYUSHCurriculumControllerTest {

    private MockMvc mockMvc;
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        jdbcTemplate = Mockito.mock(JdbcTemplate.class);
        AYUSHCurriculumController controller = new AYUSHCurriculumController(jdbcTemplate);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

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
