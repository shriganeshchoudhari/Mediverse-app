package com.curiolearn.emr;

import com.curiolearn.emr.model.CpoeOrder;
import com.curiolearn.emr.service.CpoeOrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class CpoeOrderServiceTest {

    private CpoeOrderService cpoeOrderService;

    @BeforeEach
    void setUp() {
        cpoeOrderService = new CpoeOrderService();
    }

    @Test
    void testValidateAndPlaceOrder_SafeMedication() {
        CpoeOrder order = CpoeOrder.builder()
                .patientId(UUID.randomUUID())
                .orderType("MEDICATION")
                .orderName("Aspirin 300 mg")
                .priority("STAT")
                .build();

        CpoeOrder result = cpoeOrderService.validateAndPlaceOrder(order, 120.0, List.of("Sulfa"));

        assertNotNull(result.getId());
        assertFalse(result.isContraindicated());
        assertTrue(result.getSafetyNotes().contains("passed"));
        assertEquals("COMPLETED", result.getStatus());
    }

    @Test
    void testValidateAndPlaceOrder_NitroglycerinInHypotension() {
        CpoeOrder order = CpoeOrder.builder()
                .patientId(UUID.randomUUID())
                .orderType("MEDICATION")
                .orderName("Nitroglycerin 0.4 mg SL")
                .priority("STAT")
                .build();

        CpoeOrder result = cpoeOrderService.validateAndPlaceOrder(order, 84.0, List.of());

        assertTrue(result.isContraindicated());
        assertTrue(result.getSafetyNotes().contains("FATAL CONTRAINDICATION"));
        assertTrue(result.getSafetyNotes().contains("hypotension"));
    }

    @Test
    void testValidateAndPlaceOrder_PenicillinDirectAllergy() {
        CpoeOrder order = CpoeOrder.builder()
                .patientId(UUID.randomUUID())
                .orderType("MEDICATION")
                .orderName("Amoxicillin-Clavulanate 1.2 g IV")
                .priority("ROUTINE")
                .build();

        CpoeOrder result = cpoeOrderService.validateAndPlaceOrder(order, 125.0, List.of("Penicillin"));

        assertTrue(result.isContraindicated());
        assertTrue(result.getSafetyNotes().contains("FATAL ALLERGY CONFLICT"));
    }
}
