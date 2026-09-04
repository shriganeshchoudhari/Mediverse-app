package com.curiolearn.emr.controller;

import com.curiolearn.emr.model.CpoeOrder;
import com.curiolearn.emr.service.CpoeOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/emr/orders")
@Tag(name = "EMR CPOE Orders", description = "Endpoints for Computerized Physician Order Entry and pharmacology safety validation")
@PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN', 'SUPER_ADMIN')")
public class CpoeOrderController {

    private final CpoeOrderService cpoeOrderService;

    public CpoeOrderController(CpoeOrderService cpoeOrderService) {
        this.cpoeOrderService = cpoeOrderService;
    }

    @PostMapping
    @Operation(summary = "Validate and place a clinical CPOE order with contraindication check")
    public ResponseEntity<CpoeOrder> placeOrder(
            @RequestBody CpoeOrder order,
            @RequestParam(required = false, defaultValue = "120.0") Double systolicBp,
            @RequestParam(required = false) List<String> allergies) {
        CpoeOrder processed = cpoeOrderService.validateAndPlaceOrder(order, systolicBp, allergies);
        return ResponseEntity.ok(processed);
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get all active and completed CPOE orders for a patient")
    public ResponseEntity<List<CpoeOrder>> getOrdersByPatient(@PathVariable UUID patientId) {
        return ResponseEntity.ok(cpoeOrderService.getOrdersByPatient(patientId));
    }
}
