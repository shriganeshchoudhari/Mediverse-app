package com.curiolearn.simulation;

import com.curiolearn.simulation.dto.PvLoopCoordinateDto;
import com.curiolearn.simulation.dto.SimulationCalculateRequestDto;
import com.curiolearn.simulation.dto.SimulationCalculateResponseDto;
import com.curiolearn.simulation.dto.SimulationCatalogItemDto;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class SimulationApiService {

    private final SpirometrySolver spirometrySolver;

    public SimulationApiService(SpirometrySolver spirometrySolver) {
        this.spirometrySolver = spirometrySolver;
    }

    public List<SimulationCatalogItemDto> getCatalog() {
        List<SimulationCatalogItemDto> catalog = new ArrayList<>();

        catalog.add(SimulationCatalogItemDto.builder()
                .id("a1b2c3d4-0001-4000-8000-000000000001")
                .code("CARDIOVASCULAR_PV_LOOP")
                .name("Left Ventricular Pressure-Volume Loop & Wiggers Diagram")
                .description("Simulate cardiac hemodynamics, preload (EDV), afterload (SVR), and inotropy (Ees) to observe PV loop shifts and clinical pathologies like Heart Failure, Aortic Stenosis, and Mitral Regurgitation.")
                .category("CARDIOVASCULAR")
                .modelAssetUrl("/models/heart_3d.glb")
                .defaultParameters(Map.of(
                        "preloadEdv", 120.0,
                        "afterloadSvr", 100.0,
                        "inotropyEes", 2.5,
                        "heartRate", 75.0
                ))
                .parameterMetadata(Map.of(
                        "preloadEdv", Map.of("min", 40.0, "max", 250.0, "step", 5.0, "unit", "mL", "label", "End-Diastolic Volume"),
                        "afterloadSvr", Map.of("min", 40.0, "max", 220.0, "step", 5.0, "unit", "mmHg", "label", "Systemic Vascular Resistance / Afterload"),
                        "inotropyEes", Map.of("min", 0.5, "max", 6.0, "step", 0.1, "unit", "mmHg/mL", "label", "End-Systolic Elastance (Inotropy)"),
                        "heartRate", Map.of("min", 40.0, "max", 200.0, "step", 1.0, "unit", "bpm", "label", "Heart Rate")
                ))
                .keyFormulas(List.of(
                        "Stroke Volume (SV) = EDV - ESV",
                        "Ejection Fraction (EF) = (SV / EDV) * 100",
                        "Cardiac Output (CO) = SV * HR / 1000",
                        "Ees = Pes / (ESV - V0)"
                ))
                .build());

        catalog.add(SimulationCatalogItemDto.builder()
                .id("a1b2c3d4-0002-4000-8000-000000000002")
                .code("RESPIRATORY_PULMONARY_MECHANICS")
                .name("Respiratory Mechanics & Ventilation-Perfusion (V/Q)")
                .description("Explore chest wall and lung compliance curves, intrapleural pressure, airway resistance, and alveolar gas exchange matching.")
                .category("RESPIRATORY")
                .modelAssetUrl("/models/lungs_3d.glb")
                .defaultParameters(Map.of(
                        "chestCompliance", 0.2,
                        "airwayResistance", 1.5,
                        "tidalVolume", 500.0,
                        "respiratoryRate", 12.0
                ))
                .parameterMetadata(Map.of(
                        "chestCompliance", Map.of("min", 0.05, "max", 0.4, "step", 0.01, "unit", "L/cmH2O"),
                        "airwayResistance", Map.of("min", 0.5, "max", 8.0, "step", 0.1, "unit", "cmH2O/(L/s)"),
                        "tidalVolume", Map.of("min", 200.0, "max", 1200.0, "step", 25.0, "unit", "mL"),
                        "respiratoryRate", Map.of("min", 6.0, "max", 40.0, "step", 1.0, "unit", "breaths/min")
                ))
                .keyFormulas(List.of(
                        "Compliance (C) = ΔV / ΔP",
                        "Minute Ventilation (VE) = Vt * RR",
                        "Alveolar Gas Equation: PAO2 = FiO2*(Patm - PH2O) - PaCO2/R"
                ))
                .build());

        catalog.add(SimulationCatalogItemDto.builder()
                .id("a1b2c3d4-0003-4000-8000-000000000003")
                .code("SPIROMETRY_PFT")
                .name("Spirometry & Pulmonary Function Testing")
                .description("Simulate forced expiratory flow-volume loops and spirograms to distinguish obstructive (COPD, Asthma) vs restrictive (Fibrosis) lung disorders.")
                .category("RESPIRATORY")
                .modelAssetUrl("/models/lungs_3d.glb")
                .defaultParameters(Map.of(
                        "fvc", 4.8,
                        "fev1", 4.0,
                        "effortFactor", 1.0
                ))
                .parameterMetadata(Map.of(
                        "fvc", Map.of("min", 1.5, "max", 7.0, "step", 0.1, "unit", "L"),
                        "fev1", Map.of("min", 0.8, "max", 6.0, "step", 0.1, "unit", "L")
                ))
                .keyFormulas(List.of(
                        "FEV1/FVC Ratio = (FEV1 / FVC) * 100"
                ))
                .build());

        catalog.add(SimulationCatalogItemDto.builder()
                .id("a1b2c3d4-0004-4000-8000-000000000004")
                .code("RENAL_GLOMERULAR_FILTRATION")
                .name("Renal Hemodynamics & Glomerular Filtration Dynamics")
                .description("Model Starling forces in glomerular capillaries, afferent/efferent arteriolar resistance, GFR, and Renal Plasma Flow.")
                .category("RENAL")
                .modelAssetUrl("/models/kidney_3d.glb")
                .defaultParameters(Map.of(
                        "pgc", 55.0,
                        "pbs", 15.0,
                        "piGc", 30.0,
                        "kf", 12.5
                ))
                .parameterMetadata(Map.of(
                        "pgc", Map.of("min", 35.0, "max", 75.0, "step", 1.0, "unit", "mmHg", "label", "Capillary Hydrostatic Pressure"),
                        "pbs", Map.of("min", 5.0, "max", 30.0, "step", 1.0, "unit", "mmHg", "label", "Bowman Space Pressure"),
                        "piGc", Map.of("min", 15.0, "max", 45.0, "step", 1.0, "unit", "mmHg", "label", "Capillary Oncotic Pressure")
                ))
                .keyFormulas(List.of(
                        "Net Ultrafiltration Pressure (NFP) = (Pgc - Pbs) - (πgc - πbs)",
                        "GFR = Kf * NFP",
                        "Filtration Fraction (FF) = GFR / RPF"
                ))
                .build());

        catalog.add(SimulationCatalogItemDto.builder()
                .id("a1b2c3d4-0005-4000-8000-000000000005")
                .code("NEUROMUSCULAR_ACTION_POTENTIAL")
                .name("Nerve-Muscle Action Potential & Synaptic Transmission")
                .description("Simulate Hodgkin-Huxley ionic conductances (Na+, K+, Cl-), threshold depolarization, refractory periods, and neuromuscular junction potentials.")
                .category("NEUROLOGY")
                .modelAssetUrl("/models/neuron_3d.glb")
                .defaultParameters(Map.of(
                        "stimulusAmplitude", 25.0,
                        "stimulusDuration", 2.0,
                        "extracellularK", 4.0
                ))
                .parameterMetadata(Map.of(
                        "stimulusAmplitude", Map.of("min", 5.0, "max", 60.0, "step", 1.0, "unit", "mA"),
                        "extracellularK", Map.of("min", 2.0, "max", 9.0, "step", 0.1, "unit", "mmol/L")
                ))
                .keyFormulas(List.of(
                        "Nernst Equation: E_ion = (RT / zF) * ln([ion]_out / [ion]_in)",
                        "Goldman-Hodgkin-Katz (GHK) Equation"
                ))
                .build());

        return catalog;
    }

    public SimulationCalculateResponseDto calculate(SimulationCalculateRequestDto request) {
        if ("SPIROMETRY_PFT".equalsIgnoreCase(request.getSimulationType()) || "spirometry".equalsIgnoreCase(request.getSimulationType())) {
            double age = request.getCustomParameters() != null && request.getCustomParameters().containsKey("age") ? ((Number) request.getCustomParameters().get("age")).doubleValue() : 30.0;
            double heightCm = request.getCustomParameters() != null && request.getCustomParameters().containsKey("heightCm") ? ((Number) request.getCustomParameters().get("heightCm")).doubleValue() : 170.0;
            String sex = request.getCustomParameters() != null && request.getCustomParameters().containsKey("sex") ? (String) request.getCustomParameters().get("sex") : "M";
            double fvc = request.getCustomParameters() != null && request.getCustomParameters().containsKey("fvc") ? ((Number) request.getCustomParameters().get("fvc")).doubleValue() : 4.8;
            double fev1 = request.getCustomParameters() != null && request.getCustomParameters().containsKey("fev1") ? ((Number) request.getCustomParameters().get("fev1")).doubleValue() : 4.0;
            Double tlc = request.getCustomParameters() != null && request.getCustomParameters().containsKey("tlc") ? ((Number) request.getCustomParameters().get("tlc")).doubleValue() : null;

            Map<String, Object> spiroResult = spirometrySolver.calculate(age, heightCm, sex, fvc, fev1, tlc);
            return SimulationCalculateResponseDto.builder()
                    .additionalMetrics(spiroResult)
                    .build();
        }

        double edv = (request.getPreloadEdv() != null) ? Math.max(30.0, Math.min(300.0, request.getPreloadEdv())) : 120.0;
        double svr = (request.getAfterloadSvr() != null) ? Math.max(30.0, Math.min(250.0, request.getAfterloadSvr())) : 100.0;
        double ees = (request.getInotropyEes() != null) ? Math.max(0.4, Math.min(8.0, request.getInotropyEes())) : 2.5;
        double hr = (request.getHeartRate() != null) ? Math.max(30.0, Math.min(220.0, request.getHeartRate())) : 75.0;

        double v0 = 10.0; // Volume axis intercept
        double ea = svr * 0.018; // Effective arterial elastance

        // ESV calculation from ventricular-vascular coupling: Ees * (ESV - V0) = Ea * (EDV - ESV)
        double esv = (ea * edv + ees * v0) / (ees + ea);
        esv = Math.max(15.0, Math.min(edv - 10.0, esv));

        double sv = edv - esv;
        double ef = (sv / edv) * 100.0;
        double co = (sv * hr) / 1000.0;

        double peakSystolicPressure = ees * (esv - v0) * 1.08;
        double diastolicPressure = peakSystolicPressure * 0.68;
        double map = diastolicPressure + (peakSystolicPressure - diastolicPressure) / 3.0;

        List<PvLoopCoordinateDto> coordinates = generatePvLoopCoordinates(edv, esv, v0, peakSystolicPressure, diastolicPressure);

        Map<String, Object> additionalMetrics = new LinkedHashMap<>();
        additionalMetrics.put("arterialElastanceEa", round(ea, 2));
        additionalMetrics.put("ventricularVascularCoupling", round(ea / ees, 2));
        additionalMetrics.put("peakSystolicPressure", round(peakSystolicPressure, 1));
        additionalMetrics.put("diastolicPressure", round(diastolicPressure, 1));
        additionalMetrics.put("strokeWorkJoules", round((sv * (map - 8.0) * 0.000133322), 2));

        return SimulationCalculateResponseDto.builder()
                .strokeVolume(round(sv, 1))
                .ejectionFraction(round(ef, 1))
                .cardiacOutput(round(co, 2))
                .endSystolicVolume(round(esv, 1))
                .endDiastolicVolume(round(edv, 1))
                .meanArterialPressure(round(map, 1))
                .pvLoopCoordinates(coordinates)
                .additionalMetrics(additionalMetrics)
                .build();
    }

    private List<PvLoopCoordinateDto> generatePvLoopCoordinates(
            double edv, double esv, double v0, double pSystolic, double pDiastolic) {
        List<PvLoopCoordinateDto> points = new ArrayList<>();

        double pFillingStart = 5.0;
        double pEndDiastolic = 10.0 + (edv - 120.0) * 0.06;
        pEndDiastolic = Math.max(4.0, Math.min(28.0, pEndDiastolic));

        // Segment 1: Isovolumetric Contraction (constant EDV, pressure rises from pEndDiastolic to pDiastolic)
        int numStepsIsovol = 8;
        for (int i = 0; i <= numStepsIsovol; i++) {
            double frac = (double) i / numStepsIsovol;
            double p = pEndDiastolic + frac * (pDiastolic - pEndDiastolic);
            points.add(new PvLoopCoordinateDto(round(edv, 1), round(p, 1), "ISOVOLUMETRIC_CONTRACTION"));
        }

        // Segment 2: Systolic Ejection (volume decreases from EDV to ESV, pressure peaks and resolves to pPes)
        int numStepsEject = 16;
        double pPes = pSystolic * 0.95;
        for (int i = 1; i <= numStepsEject; i++) {
            double frac = (double) i / numStepsEject;
            double vol = edv - frac * (edv - esv);
            // Parabolic / sinusoidal arch for ejection pressure
            double pCurve = Math.sin(frac * Math.PI) * (pSystolic - pDiastolic) * 0.6;
            double pBase = pDiastolic + frac * (pPes - pDiastolic);
            double p = pBase + pCurve;
            points.add(new PvLoopCoordinateDto(round(vol, 1), round(p, 1), "SYSTOLIC_EJECTION"));
        }

        // Segment 3: Isovolumetric Relaxation (constant ESV, pressure drops from pPes to pFillingStart)
        for (int i = 1; i <= numStepsIsovol; i++) {
            double frac = (double) i / numStepsIsovol;
            double p = pPes - frac * (pPes - pFillingStart);
            points.add(new PvLoopCoordinateDto(round(esv, 1), round(p, 1), "ISOVOLUMETRIC_RELAXATION"));
        }

        // Segment 4: Ventricular Diastolic Filling (volume rises from ESV back to EDV following EDPVR)
        int numStepsFill = 16;
        for (int i = 1; i < numStepsFill; i++) {
            double frac = (double) i / numStepsFill;
            double vol = esv + frac * (edv - esv);
            // Non-linear compliant filling curve: P(V) = pFillingStart + (pEndDiastolic - pFillingStart) * (frac^1.8)
            double p = pFillingStart + (pEndDiastolic - pFillingStart) * Math.pow(frac, 1.8);
            points.add(new PvLoopCoordinateDto(round(vol, 1), round(p, 1), "DIASTOLIC_FILLING"));
        }

        // Close the loop to initial point
        points.add(new PvLoopCoordinateDto(round(edv, 1), round(pEndDiastolic, 1), "DIASTOLIC_FILLING"));

        return points;
    }

    private double round(double value, int places) {
        if (Double.isNaN(value) || Double.isInfinite(value)) return 0.0;
        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
