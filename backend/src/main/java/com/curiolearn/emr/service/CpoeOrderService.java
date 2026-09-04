package com.curiolearn.emr.service;

import com.curiolearn.emr.model.CpoeOrder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CpoeOrderService {

    private final Map<UUID, List<CpoeOrder>> patientOrders = new ConcurrentHashMap<>();

    public CpoeOrder validateAndPlaceOrder(CpoeOrder order, Double currentSystolicBp, List<String> patientAllergies) {
        if (order.getId() == null) {
            order.setId(UUID.randomUUID());
        }
        if (order.getCreatedAt() == null) {
            order.setCreatedAt(Instant.now());
        }
        if (order.getStatus() == null) {
            order.setStatus("COMPLETED");
        }

        List<String> warnings = new ArrayList<>();
        boolean contraindicated = false;

        String name = order.getOrderName() != null ? order.getOrderName().toLowerCase() : "";

        // 1. Hemodynamic safety check
        if (currentSystolicBp != null && currentSystolicBp < 90.0) {
            if (name.contains("nitroglycerin") || name.contains("nitro") || name.contains("hydralazine")) {
                contraindicated = true;
                warnings.add("FATAL CONTRAINDICATION: Administration of vasodilators in hypotension (SBP < 90 mmHg) precipitates cardiovascular collapse.");
            }
            if (name.contains("metoprolol") || name.contains("atenolol") || name.contains("esmolol")) {
                contraindicated = true;
                warnings.add("CONTRAINDICATION: Beta-blockade in cardiogenic shock / severe hypotension worsens negative inotropy.");
            }
        }

        // 2. Allergy cross-reactivity check
        if (patientAllergies != null) {
            for (String allergy : patientAllergies) {
                String allergen = allergy.toLowerCase();
                if (allergen.contains("penicillin")) {
                    if (name.contains("amoxicillin") || name.contains("ampicillin") || name.contains("piperacillin")) {
                        contraindicated = true;
                        warnings.add("FATAL ALLERGY CONFLICT: Direct penicillin allergy documented. Severe anaphylaxis risk.");
                    } else if (name.contains("ceftriaxone") || name.contains("cef") || name.contains("cephalosporin")) {
                        warnings.add("WARNING: Potential 2-5% beta-lactam cross-reactivity with documented penicillin allergy.");
                    }
                }
            }
        }

        order.setContraindicated(contraindicated);
        if (!warnings.isEmpty()) {
            order.setSafetyNotes(String.join(" | ", warnings));
        } else {
            order.setSafetyNotes("Pharmacology safety screening passed. No critical contraindications detected.");
        }

        if (order.getPatientId() != null) {
            patientOrders.computeIfAbsent(order.getPatientId(), k -> new ArrayList<>()).add(order);
        }

        return order;
    }

    public List<CpoeOrder> getOrdersByPatient(UUID patientId) {
        return patientOrders.getOrDefault(patientId, Collections.emptyList());
    }
}
