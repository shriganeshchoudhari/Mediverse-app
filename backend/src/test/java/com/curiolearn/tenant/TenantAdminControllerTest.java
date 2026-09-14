package com.curiolearn.tenant;

import com.curiolearn.tenant.controller.TenantAdminController;
import com.curiolearn.tenant.entity.Tenant;
import com.curiolearn.tenant.entity.TenantUser;
import com.curiolearn.tenant.repository.TenantRepository;
import com.curiolearn.tenant.repository.TenantUserRepository;
import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
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
class TenantAdminControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private TenantUserRepository tenantUserRepository;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        TenantAdminController controller = new TenantAdminController(
                tenantRepository,
                tenantUserRepository,
                userRepository
        );
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("TC-API-TENANT-001: GET /api/v1/admin/tenants lists all institutions")
    void testGetAllTenants_ReturnsList() throws Exception {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());
        tenant.setName("All India Institute of Medical Sciences");
        tenant.setDomain("aiims.edu");

        when(tenantRepository.findAll()).thenReturn(List.of(tenant));

        mockMvc.perform(get("/api/v1/admin/tenants"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("All India Institute of Medical Sciences")));
    }

    @Test
    @DisplayName("TC-API-TENANT-002: GET /api/v1/admin/tenants/{tenantId}/stats returns aggregate metrics")
    void testGetTenantStats_ReturnsStatsMap() throws Exception {
        UUID tenantId = UUID.randomUUID();
        Tenant tenant = new Tenant();
        tenant.setId(tenantId);
        tenant.setName("Harvard Medical School");
        tenant.setDomain("hms.harvard.edu");
        tenant.setSubscriptionTier("ENTERPRISE");

        when(tenantRepository.findById(tenantId)).thenReturn(Optional.of(tenant));
        when(tenantUserRepository.findByTenantId(tenantId)).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/admin/tenants/{tenantId}/stats", tenantId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tenantName", is("Harvard Medical School")))
                .andExpect(jsonPath("$.subscriptionTier", is("ENTERPRISE")));
    }
}
