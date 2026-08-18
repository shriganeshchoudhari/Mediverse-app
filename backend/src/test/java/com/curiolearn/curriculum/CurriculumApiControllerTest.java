package com.curiolearn.curriculum;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class CurriculumApiControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CurriculumService curriculumService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        CurriculumController controller = new CurriculumController(curriculumService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("TC-API-CURR-001: GET /api/v1/curriculum/{code} returns curriculum metadata")
    void testGetCurriculumByCode_Success() throws Exception {
        UUID currId = UUID.randomUUID();
        Curriculum curriculum = Curriculum.builder()
                .id(currId)
                .code("MBBS-2026")
                .name("Competency Based Medical Curriculum (CBME)")
                .build();

        when(curriculumService.getCurriculumByCode("MBBS-2026")).thenReturn(Optional.of(curriculum));

        mockMvc.perform(get("/api/v1/curriculum/MBBS-2026"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(currId.toString())))
                .andExpect(jsonPath("$.code", is("MBBS-2026")))
                .andExpect(jsonPath("$.name", is("Competency Based Medical Curriculum (CBME)")));
    }

    @Test
    @DisplayName("TC-API-CURR-002: GET /api/v1/curriculum/{code} with non-existent code returns 404 Not Found")
    void testGetCurriculumByCode_NotFound() throws Exception {
        when(curriculumService.getCurriculumByCode("INVALID-CODE")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/curriculum/INVALID-CODE"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("TC-API-CURR-003: GET /api/v1/curriculum/{curriculumId}/years returns list of professional years")
    void testGetYears_Success() throws Exception {
        UUID currId = UUID.randomUUID();
        CurriculumYear year1 = CurriculumYear.builder()
                .id(UUID.randomUUID())
                .yearNumber(1)
                .build();

        when(curriculumService.getYears(currId)).thenReturn(List.of(year1));

        mockMvc.perform(get("/api/v1/curriculum/{curriculumId}/years", currId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].yearNumber", is(1)));
    }

    @Test
    @DisplayName("TC-API-CURR-004: GET /api/v1/curriculum/semesters/{semesterId}/subjects returns subjects")
    void testGetSubjects_Success() throws Exception {
        UUID semesterId = UUID.randomUUID();
        Subject physio = Subject.builder()
                .id(UUID.randomUUID())
                .code("PHYS-101")
                .title("Human Physiology")
                .category("PRE_CLINICAL")
                .build();

        when(curriculumService.getSubjects(semesterId)).thenReturn(List.of(physio));

        mockMvc.perform(get("/api/v1/curriculum/semesters/{semesterId}/subjects", semesterId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].code", is("PHYS-101")))
                .andExpect(jsonPath("$[0].title", is("Human Physiology")));
    }

    @Test
    @DisplayName("TC-API-CURR-005: GET /api/v1/curriculum/concepts/{conceptId}/lesson returns interactive lesson content")
    void testGetLesson_Success() throws Exception {
        UUID conceptId = UUID.randomUUID();
        Lesson lesson = Lesson.builder()
                .id(UUID.randomUUID())
                .title("Cardiac Cycle & Suga-Sagawa PV Loops")
                .status("PUBLISHED")
                .version(1)
                .build();

        when(curriculumService.getLessonByConceptId(conceptId)).thenReturn(Optional.of(lesson));

        mockMvc.perform(get("/api/v1/curriculum/concepts/{conceptId}/lesson", conceptId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Cardiac Cycle & Suga-Sagawa PV Loops")))
                .andExpect(jsonPath("$.status", is("PUBLISHED")));
    }
}
