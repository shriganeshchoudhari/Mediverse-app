package com.curiolearn.curriculum;

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
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class CmsReviewControllerTest {

    @Mock
    private CmsReviewService cmsReviewService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        CmsReviewController controller = new CmsReviewController(cmsReviewService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("TC-CMS-001: GET /api/v1/cms/lessons returns queue items by status")
    void testListByStatus() throws Exception {
        UUID lessonId = UUID.randomUUID();
        LessonQueueItemDto item = LessonQueueItemDto.builder()
                .id(lessonId)
                .title("Physiology of Shock")
                .status("IN_REVIEW")
                .version(1)
                .breadcrumb("Physiology > Shock > Hemodynamics")
                .build();

        when(cmsReviewService.listByStatus("IN_REVIEW")).thenReturn(List.of(item));

        mockMvc.perform(get("/api/v1/cms/lessons").param("status", "IN_REVIEW"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Physiology of Shock")));
    }

    @Test
    @DisplayName("TC-CMS-002: POST /api/v1/cms/lessons/{id}/submit-for-review submits lesson")
    void testSubmitForReview() throws Exception {
        UUID lessonId = UUID.randomUUID();
        Lesson lesson = new Lesson();
        lesson.setId(lessonId);
        lesson.setStatus("IN_REVIEW");

        when(cmsReviewService.submitForReview(lessonId)).thenReturn(lesson);

        mockMvc.perform(post("/api/v1/cms/lessons/" + lessonId + "/submit-for-review"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("IN_REVIEW")));
    }
}
