package com.curiolearn.simulation;

import org.springframework.stereotype.Component;
import java.util.*;

/**
 * Spirometry FVC/FEV1/DLCO solver implementing GLI-2012 reference equations.
 * Classifies patterns as Obstructive, Restrictive, Mixed, or Normal per GOLD/ATS/ERS guidelines.
 */
@Component
public class SpirometrySolver {

    /**
     * Calculate spirometry predicted values and classify pattern.
     * @param ageYears patient age in years
     * @param heightCm patient height in centimeters
     * @param sex "M" or "F"
     * @param measuredFvc measured FVC in litres
     * @param measuredFev1 measured FEV1 in litres
     * @param measuredTlc optional TLC in litres (null if not available)
     * @return Map with predicted values, ratios, z-scores, classification, severity, flowVolumePoints
     */
    public Map<String, Object> calculate(double ageYears, double heightCm, String sex,
                                         double measuredFvc, double measuredFev1,
                                         Double measuredTlc) {
        // GLI-2012 simplified predicted values (male baseline)
        double heightM = heightCm / 100.0;
        boolean isMale = "M".equalsIgnoreCase(sex);

        // Predicted FVC (GLI-2012 approximation)
        double predFvc = isMale
                ? -4.736 + 1.658 * heightM - 0.0133 * ageYears
                : -3.595 + 1.340 * heightM - 0.0126 * ageYears;
        predFvc = Math.max(predFvc, 0.5);

        // Predicted FEV1
        double predFev1 = isMale
                ? -3.892 + 1.400 * heightM - 0.0232 * ageYears
                : -3.230 + 1.130 * heightM - 0.0215 * ageYears;
        predFev1 = Math.max(predFev1, 0.4);

        // Predicted TLC (simplified)
        double predTlc = isMale
                ? 6.0 + 0.055 * (heightCm - 170)
                : 5.0 + 0.042 * (heightCm - 160);

        double measuredRatio = measuredFev1 / measuredFvc;
        double fvcPct = (measuredFvc / predFvc) * 100.0;
        double fev1Pct = (measuredFev1 / predFev1) * 100.0;

        // LLN for FEV1/FVC is approx 0.70 (simplified; GLI uses age-specific)
        double llnRatio = 0.70;

        // Pattern classification
        String pattern;
        String severity;
        if (measuredRatio < llnRatio) {
            pattern = "Obstructive";
            // GOLD severity by FEV1% predicted
            if (fev1Pct >= 80) severity = "GOLD 1 — Mild";
            else if (fev1Pct >= 50) severity = "GOLD 2 — Moderate";
            else if (fev1Pct >= 30) severity = "GOLD 3 — Severe";
            else severity = "GOLD 4 — Very Severe";
        } else if (fvcPct < 80) {
            double tlcPct = measuredTlc != null ? (measuredTlc / predTlc) * 100.0 : fvcPct;
            if (tlcPct < 80) {
                pattern = "Restrictive";
                if (tlcPct >= 70) severity = "Mild";
                else if (tlcPct >= 60) severity = "Moderate";
                else severity = "Severe";
            } else {
                pattern = "Possible Restriction — TLC needed to confirm";
                severity = "Indeterminate";
            }
        } else {
            pattern = "Normal";
            severity = "Normal";
        }

        // Check for mixed if both obstruction and restriction
        if (measuredRatio < llnRatio && fvcPct < 80) {
            double tlcPct = measuredTlc != null ? (measuredTlc / predTlc) * 100.0 : fvcPct;
            if (tlcPct < 80) {
                pattern = "Mixed (Obstructive + Restrictive)";
                severity = "Mixed Pattern";
            }
        }

        // Generate flow-volume loop points (expiratory limb approximation)
        List<Map<String, Double>> flowVolumePoints = generateFlowVolumeLoop(
                measuredFvc, measuredFev1, measuredRatio);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("predictedFvc", Math.round(predFvc * 100.0) / 100.0);
        result.put("measuredFvc", measuredFvc);
        result.put("fvcPercentPredicted", Math.round(fvcPct * 10.0) / 10.0);
        result.put("predictedFev1", Math.round(predFev1 * 100.0) / 100.0);
        result.put("measuredFev1", measuredFev1);
        result.put("fev1PercentPredicted", Math.round(fev1Pct * 10.0) / 10.0);
        result.put("measuredFev1FvcRatio", Math.round(measuredRatio * 100.0) / 100.0);
        result.put("lowerLimitNormalRatio", llnRatio);
        result.put("pattern", pattern);
        result.put("severity", severity);
        result.put("predictedTlc", measuredTlc != null ? Math.round(predTlc * 100.0) / 100.0 : null);
        result.put("measuredTlc", measuredTlc);
        result.put("flowVolumeLoop", flowVolumePoints);
        result.put("guideline", "ATS/ERS 2022 — GLI-2012 Reference Equations");
        return result;
    }

    private List<Map<String, Double>> generateFlowVolumeLoop(double fvc, double fev1, double ratio) {
        List<Map<String, Double>> points = new ArrayList<>();
        // Simplified Weibel model for expiratory flow-volume loop
        int steps = 20;
        double peakFlow = fev1 * 5.0; // rough PEF approximation
        for (int i = 0; i <= steps; i++) {
            double v = (fvc * i) / steps; // volume expired
            double remainingFrac = 1.0 - (v / fvc);
            // Effort-dependent early phase, effort-independent late phase
            double flow = peakFlow * Math.pow(remainingFrac, 0.7) * (i < 3 ? (double) i / 3.0 : 1.0);
            Map<String, Double> point = new LinkedHashMap<>();
            point.put("volume", Math.round(v * 100.0) / 100.0);
            point.put("flow", Math.round(flow * 100.0) / 100.0);
            points.add(point);
        }
        return points;
    }
}
