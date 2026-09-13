/**
 * CrrtCitrateClearanceEngine.test.ts
 * Unit tests for CRRT modalities, convective vs diffusive clearance, filtration fraction, and RCA.
 */

import {
  calculateCrrtDose,
  calculateSoluteClearance,
  evaluateCitrateAnticoagulation,
  calculateFilterPressures,
  CRRT_SCENARIOS,
} from '../../.gemini/skills/CrrtCitrateClearanceEngine';

describe('CrrtCitrateClearanceEngine', () => {
  describe('calculateCrrtDose & Filtration Fraction', () => {
    it('calculates CVVHDF effluent dose accurately', () => {
      const report = calculateCrrtDose({
        modality: 'cvvhdf',
        bloodFlowQbMlMin: 180,
        dialysateFlowQdMlHr: 1000,
        replacementFlowQrepMlHr: 1000,
        replacementMode: 'post_filter',
        netUltrafiltrationMlHr: 100,
        patientWeightKg: 80,
        hematocritFraction: 0.30,
      });

      // Total Effluent = 1000 + 1000 + 100 = 2100 mL/h
      // Dose = 2100 / 80 = 26.25 -> 26.3 mL/kg/h
      expect(report.totalEffluentMlHr).toBe(2100);
      expect(report.prescribedEffluentDoseMlKgHr).toBeCloseTo(26.3, 1);
      expect(report.effectiveDeliveredDoseMlKgHr).toBeCloseTo(26.3, 1);
      expect(report.kdigoDoseAdequate).toBe(true);
      expect(report.preDilutionClearancePenaltyPercent).toBe(0);
    });

    it('applies clearance penalty in pre-filter replacement mode', () => {
      const postReport = calculateCrrtDose({
        modality: 'cvvh',
        bloodFlowQbMlMin: 200,
        dialysateFlowQdMlHr: 0,
        replacementFlowQrepMlHr: 2000,
        replacementMode: 'post_filter',
        netUltrafiltrationMlHr: 100,
        patientWeightKg: 70,
        hematocritFraction: 0.30,
      });

      const preReport = calculateCrrtDose({
        modality: 'cvvh',
        bloodFlowQbMlMin: 200,
        dialysateFlowQdMlHr: 0,
        replacementFlowQrepMlHr: 2000,
        replacementMode: 'pre_filter',
        netUltrafiltrationMlHr: 100,
        patientWeightKg: 70,
        hematocritFraction: 0.30,
      });

      expect(preReport.preDilutionClearancePenaltyPercent).toBeGreaterThan(15);
      expect(preReport.effectiveDeliveredDoseMlKgHr).toBeLessThan(postReport.effectiveDeliveredDoseMlKgHr);
      expect(preReport.filtrationFractionPercent).toBeLessThan(postReport.filtrationFractionPercent);
    });

    it('detects dangerously high filtration fraction (> 25%) in high post-dilution CVVH', () => {
      const report = calculateCrrtDose({
        modality: 'cvvh',
        bloodFlowQbMlMin: 120, // Low blood flow: Qp = 120 * 0.70 * 60 = 5040 mL/h
        dialysateFlowQdMlHr: 0,
        replacementFlowQrepMlHr: 1600, // High post-dilution ultrafiltration
        replacementMode: 'post_filter',
        netUltrafiltrationMlHr: 200, // Total Quf = 1800 mL/h
        patientWeightKg: 70,
        hematocritFraction: 0.30,
      });

      // FF = 1800 / 5040 * 100 = 35.7% > 25%
      expect(report.filtrationFractionPercent).toBeGreaterThan(25);
      expect(report.filtrationFractionSafe).toBe(false);
    });

    it('zeros out replacement fluid in CVVHD and dialysate in CVVH', () => {
      const cvvhd = calculateCrrtDose({
        modality: 'cvvhd',
        bloodFlowQbMlMin: 150,
        dialysateFlowQdMlHr: 1500,
        replacementFlowQrepMlHr: 1000, // should be ignored in CVVHD
        replacementMode: 'post_filter',
        netUltrafiltrationMlHr: 100,
        patientWeightKg: 70,
        hematocritFraction: 0.30,
      });
      expect(cvvhd.totalEffluentMlHr).toBe(1600); // 1500 Qd + 100 Net UF
    });
  });

  describe('calculateSoluteClearance (Small vs Middle Molecules)', () => {
    it('demonstrates superior middle molecule (myoglobin) clearance in CVVH over CVVHD', () => {
      const cvvhParams = {
        modality: 'cvvh' as const,
        bloodFlowQbMlMin: 200,
        dialysateFlowQdMlHr: 0,
        replacementFlowQrepMlHr: 2000,
        replacementMode: 'post_filter' as const,
        netUltrafiltrationMlHr: 100,
        patientWeightKg: 70,
        hematocritFraction: 0.30,
      };
      const cvvhDose = calculateCrrtDose(cvvhParams);
      const cvvhClearance = calculateSoluteClearance(cvvhParams, cvvhDose);

      const cvvhdParams = {
        modality: 'cvvhd' as const,
        bloodFlowQbMlMin: 200,
        dialysateFlowQdMlHr: 2000,
        replacementFlowQrepMlHr: 0,
        replacementMode: 'post_filter' as const,
        netUltrafiltrationMlHr: 100,
        patientWeightKg: 70,
        hematocritFraction: 0.30,
      };
      const cvvhdDose = calculateCrrtDose(cvvhdParams);
      const cvvhdClearance = calculateSoluteClearance(cvvhdParams, cvvhdDose);

      expect(cvvhClearance.myoglobinClearanceMlMin).toBeGreaterThan(cvvhdClearance.myoglobinClearanceMlMin * 5);
      expect(cvvhClearance.middleMoleculeAdvantage).toContain('Convective');
      expect(cvvhdClearance.middleMoleculeAdvantage).toContain('Diffusive');
    });
  });

  describe('evaluateCitrateAnticoagulation & Citrate Lock', () => {
    it('identifies optimal circuit and systemic calcium targets', () => {
      const report = evaluateCitrateAnticoagulation({
        citrateInfusionRateMmolHr: 20,
        circuitIonizedCaMmolL: 0.30,
        systemicIonizedCaMmolL: 1.20,
        totalSerumCaMmolL: 2.30,
        hepaticFunction: 'normal',
      });

      expect(report.circuitAnticoagulationAdequate).toBe(true);
      expect(report.systemicHypocalcemiaAlert).toBe(false);
      expect(report.citrateAccumulationAlert).toBe(false);
      expect(report.totalToIonizedCaRatio).toBeCloseTo(1.92, 1);
    });

    it('detects Citrate Lock when Total/Ionized Ca ratio exceeds 2.5', () => {
      const report = evaluateCitrateAnticoagulation({
        citrateInfusionRateMmolHr: 25,
        circuitIonizedCaMmolL: 0.28,
        systemicIonizedCaMmolL: 0.90, // Low systemic iCa
        totalSerumCaMmolL: 2.70, // High total Ca from bound citrate
        hepaticFunction: 'severe_failure_shock',
      });

      // Ratio = 2.70 / 0.90 = 3.0 > 2.5
      expect(report.totalToIonizedCaRatio).toBe(3.0);
      expect(report.citrateAccumulationAlert).toBe(true);
      expect(report.metabolicStatus).toContain('Citrate Lock');
      expect(report.recommendations.some((r) => r.includes('CITRATE TOXICITY'))).toBe(true);
    });
  });

  describe('calculateFilterPressures', () => {
    it('calculates TMP and warns of membrane fouling when TMP >= 200 mmHg', () => {
      const normalPressures = calculateFilterPressures(100, 120, -50);
      // TMP = (100 + 120)/2 - (-50) = 110 + 50 = 160
      expect(normalPressures.transmembranePressureMmHg).toBe(160);
      expect(normalPressures.membraneFoulingWarning).toBe(false);

      const fouledPressures = calculateFilterPressures(140, 160, -80);
      // TMP = (140 + 160)/2 - (-80) = 150 + 80 = 230
      expect(fouledPressures.transmembranePressureMmHg).toBe(230);
      expect(fouledPressures.membraneFoulingWarning).toBe(true);
    });
  });

  describe('CRRT_SCENARIOS Catalog', () => {
    it('contains all 4 key clinical scenarios', () => {
      expect(CRRT_SCENARIOS.septic_shock_aki).toBeDefined();
      expect(CRRT_SCENARIOS.rhabdomyolysis_myoglobin).toBeDefined();
      expect(CRRT_SCENARIOS.cirrhosis_citrate_lock).toBeDefined();
      expect(CRRT_SCENARIOS.cardiorenal_scuf).toBeDefined();
    });

    it('cirrhosis_citrate_lock demonstrates citrate lock ratio > 2.5', () => {
      const sc = CRRT_SCENARIOS.cirrhosis_citrate_lock;
      const report = evaluateCitrateAnticoagulation(sc.defaultCitrate);
      expect(report.citrateAccumulationAlert).toBe(true);
      expect(report.totalToIonizedCaRatio).toBeGreaterThan(2.5);
    });
  });
});
