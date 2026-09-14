package com.curiolearn.admin;

import com.curiolearn.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AdminService adminService;

    @BeforeEach
    void setUp() {
        AdminController controller = new AdminController(adminService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("TC-API-ADMIN-001: GET /api/v1/admin/stats returns platform operational telemetry")
    void testGetStats_ReturnsMetrics() throws Exception {
        AdminStatsDto stats = AdminStatsDto.builder()
                .totalUsers(1500L)
                .totalQuestions(650L)
                .totalExamsTaken(18000L)
                .build();

        when(adminService.getSystemStats()).thenReturn(stats);

        mockMvc.perform(get("/api/v1/admin/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers", is(1500)))
                .andExpect(jsonPath("$.totalQuestions", is(650)));
    }

    @Test
    @DisplayName("TC-API-ADMIN-002: GET /api/v1/admin/users lists all registered platform users")
    void testGetUsers_ReturnsUserList() throws Exception {
        User user = User.builder()
                .id(UUID.randomUUID())
                .email("student@mediverse.edu")
                .firstName("Arjun")
                .lastName("Sharma")
                .role("STUDENT")
                .build();

        when(adminService.getAllUsers()).thenReturn(List.of(user));

        mockMvc.perform(get("/api/v1/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].email", is("student@mediverse.edu")));
    }
}
