package com.curiolearn.emr;

import com.curiolearn.emr.controller.CpoeOrderController;
import com.curiolearn.emr.model.CpoeOrder;
import com.curiolearn.emr.service.CpoeOrderService;
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
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class CpoeOrderControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CpoeOrderService cpoeOrderService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        CpoeOrderController controller = new CpoeOrderController(cpoeOrderService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("TC-API-CPOE-001: POST /api/v1/emr/orders places and validates CPOE order")
    void testPlaceOrder_Success() throws Exception {
        UUID patientId = UUID.randomUUID();
        CpoeOrder incoming = new CpoeOrder();
        incoming.setPatientId(patientId);
        incoming.setOrderName("Metoprolol");
        incoming.setDetails("25mg PO BID");

        CpoeOrder processed = new CpoeOrder();
        processed.setId(UUID.randomUUID());
        processed.setPatientId(patientId);
        processed.setOrderName("Metoprolol");
        processed.setStatus("APPROVED");

        when(cpoeOrderService.validateAndPlaceOrder(any(CpoeOrder.class), eq(130.0), any())).thenReturn(processed);

        mockMvc.perform(post("/api/v1/emr/orders")
                        .param("systolicBp", "130.0")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(incoming)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderName", is("Metoprolol")))
                .andExpect(jsonPath("$.status", is("APPROVED")));
    }

    @Test
    @DisplayName("TC-API-CPOE-002: GET /api/v1/emr/orders/patient/{patientId} returns orders")
    void testGetOrdersByPatient_ReturnsList() throws Exception {
        UUID patientId = UUID.randomUUID();
        CpoeOrder order = new CpoeOrder();
        order.setId(UUID.randomUUID());
        order.setPatientId(patientId);
        order.setOrderName("Lisinopril");

        when(cpoeOrderService.getOrdersByPatient(patientId)).thenReturn(List.of(order));

        mockMvc.perform(get("/api/v1/emr/orders/patient/{patientId}", patientId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].orderName", is("Lisinopril")));
    }
}
