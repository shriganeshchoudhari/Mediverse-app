import {
  calculateCRRTPressures,
  calculateKDIGODose,
  calculateRCAMetrics,
  calculateSoluteClearance,
  simulateCRRT24HourKinetics,
  CRRT_PRESETS,
  CRRTPumpSettings,
  CRRTPatientParameters,
} from '../../.gemini/skills/CRRTEngine';

describe('CRRTEngine', () => {
  const standardSettings: CRRTPumpSettings = {
    modality: 'CVVHDF',
    bloodFlowQbMlMin: 200,
    dialysateFlowQdMlHr: 1000,
    replacementFlowQrepMlHr: 1000,
    dilutionMode: 'POST_DILUTION',
    netUltrafiltrationRateMlHr: 150,
    anticoagulation: 'REGIONAL_CITRATE',
    citrateDoseMmolPerLBlood: 3.0,
    calciumInfusionRateMmolHr: 2.2,
  };

  const standardPatient: CRRTPatientParameters = {
    weightKg: 80,
    hematocritPct: 30,
    baselineBUNMgDl: 90,
    baselineCreatinineMgDl: 5.0,
    baselinePotassiumMeqL: 5.8,
    baselineBicarbonateMeqL: 16,
    totalCalciumMmolL: 2.25,
    systemicIonizedCalciumMmolL: 1.15,
    fluidOverloadLiters: 4.5,
  };

  describe('Circuit Hydraulics & Transmembrane Pressure (TMP)', () => {
    it('computes baseline normal pressures for fresh circuit', () => {
      const pressures = calculateCRRTPressures(standardSettings, 0.0);

      expect(pressures.accessPressureMmHg).toBeLessThan(-100);
      expect(pressures.filterReturnPressureMmHg).toBeGreaterThan(100);
      expect(pressures.filterInletPressureMmHg).toBeGreaterThan(pressures.filterReturnPressureMmHg);
      expect(pressures.filterPressureDropMmHg).toBeGreaterThan(40);
      expect(pressures.filterPressureDropMmHg).toBeLessThan(90);
      expect(pressures.transmembranePressureMmHg).toBeGreaterThan(50);
      expect(pressures.isHighTMPAlarm).toBe(false);
      expect(pressures.isFilterClotted).toBe(false);
    });

    it('triggers high TMP alarm and clotting status on severe membrane fouling', () => {
      const cloggedPressures = calculateCRRTPressures(standardSettings, 0.9);

      expect(cloggedPressures.transmembranePressureMmHg).toBeGreaterThan(250);
      expect(cloggedPressures.filterPressureDropMmHg).toBeGreaterThan(150);
      expect(cloggedPressures.isHighTMPAlarm).toBe(true);
      expect(cloggedPressures.isFilterClotted).toBe(true);
    });
  });

  describe('KDIGO Effluent Dosing & Filtration Fraction', () => {
    it('accurately computes KDIGO target dose for standard CVVHDF settings', () => {
      // Effluent = 1000 + 1000 + 150 = 2150 mL/hr. Weight = 80 kg.
      // Prescribed = 2150 / 80 = 26.9 mL/kg/hr. Delivered (88%) = 23.6 mL/kg/hr (KDIGO target 20-25).
      const dose = calculateKDIGODose(standardSettings, standardPatient.weightKg, standardPatient.hematocritPct);

      expect(dose.totalEffluentFlowMlHr).toBe(2150);
      expect(dose.prescribedDoseMlKgHr).toBeCloseTo(26.9, 1);
      expect(dose.deliveredDoseMlKgHr).toBeGreaterThanOrEqual(20);
      expect(dose.deliveredDoseMlKgHr).toBeLessThanOrEqual(25);
      expect(dose.doseCategory).toBe('KDIGO_TARGET');
    });

    it('flags subtherapeutic dosing when effluent rate is inadequate', () => {
      const lowDoseSettings: CRRTPumpSettings = {
        ...standardSettings,
        dialysateFlowQdMlHr: 500,
        replacementFlowQrepMlHr: 500,
        netUltrafiltrationRateMlHr: 100,
      };
      // Total effluent = 1100 mL/hr. Delivered = (1100/80)*0.88 = 12.1 mL/kg/hr
      const dose = calculateKDIGODose(lowDoseSettings, 80, 30);

      expect(dose.doseCategory).toBe('SUBTHERAPEUTIC');
      expect(dose.deliveredDoseMlKgHr).toBeLessThan(20);
    });

    it('flags excessive filtration fraction in post-dilution high hemofiltration', () => {
      const highUfSettings: CRRTPumpSettings = {
        ...standardSettings,
        modality: 'CVVH',
        bloodFlowQbMlMin: 120, // low blood flow
        replacementFlowQrepMlHr: 2200, // high post-dilution
        dilutionMode: 'POST_DILUTION',
        netUltrafiltrationRateMlHr: 300,
      };
      const dose = calculateKDIGODose(highUfSettings, 70, 35);

      expect(dose.filtrationFractionPct).toBeGreaterThan(22);
      expect(dose.isFiltrationFractionHigh).toBe(true);
    });
  });

  describe('Regional Citrate Anticoagulation (RCA) Protocol', () => {
    it('binds circuit ionized calcium below 0.35 mmol/L with normal systemic balance', () => {
      const rca = calculateRCAMetrics(standardSettings, 1.15, 2.25, false);

      expect(rca.circuitIonizedCalciumMmolL).toBeLessThanOrEqual(0.35);
      expect(rca.systemicIonizedCalciumMmolL).toBeGreaterThanOrEqual(1.10);
      expect(rca.totalCalciumToIonizedCalciumRatio).toBeLessThan(2.5);
      expect(rca.isCitrateAccumulationWarning).toBe(false);
    });

    it('detects Citrate Lock / Toxicity (ratio >= 2.5) in impaired hepatic clearance', () => {
      const rcaLock = calculateRCAMetrics(standardSettings, 1.15, 2.25, true);

      expect(rcaLock.totalCalciumToIonizedCalciumRatio).toBeGreaterThanOrEqual(2.5);
      expect(rcaLock.isCitrateAccumulationWarning).toBe(true);
      expect(rcaLock.clinicalStatus).toContain('Citrate Lock');
    });

    it('returns baseline parameters when non-citrate anticoagulation is used', () => {
      const noCitrateSettings: CRRTPumpSettings = {
        ...standardSettings,
        anticoagulation: 'HEPARIN',
      };
      const rca = calculateRCAMetrics(noCitrateSettings, 1.15, 2.25);

      expect(rca.circuitIonizedCalciumMmolL).toBe(1.15);
      expect(rca.isCitrateAccumulationWarning).toBe(false);
    });
  });

  describe('Solute Transport Kinetics (Convection vs Diffusion)', () => {
    it('verifies pre-dilution decreases convective solute clearance compared to post-dilution', () => {
      const postDilutionSettings: CRRTPumpSettings = {
        ...standardSettings,
        modality: 'CVVH',
        replacementFlowQrepMlHr: 2000,
        dilutionMode: 'POST_DILUTION',
      };

      const preDilutionSettings: CRRTPumpSettings = {
        ...standardSettings,
        modality: 'CVVH',
        replacementFlowQrepMlHr: 2000,
        dilutionMode: 'PRE_DILUTION',
      };

      const postClearance = calculateSoluteClearance(postDilutionSettings, 30);
      const preClearance = calculateSoluteClearance(preDilutionSettings, 30);

      expect(preClearance.ureaClearanceMlMin).toBeLessThan(postClearance.ureaClearanceMlMin);
    });

    it('confirms SCUF provides minimal solute clearance compared to dialysis', () => {
      const scufSettings: CRRTPumpSettings = {
        ...standardSettings,
        modality: 'SCUF',
        dialysateFlowQdMlHr: 0,
        replacementFlowQrepMlHr: 0,
        netUltrafiltrationRateMlHr: 250,
      };

      const scufClearance = calculateSoluteClearance(scufSettings, 30);
      const cvvhdClearance = calculateSoluteClearance(standardSettings, 30);

      // SCUF clearance is only net UF (250 mL/h = ~4.16 mL/min)
      expect(scufClearance.ureaClearanceMlMin).toBeCloseTo(4.2, 0);
      expect(cvvhdClearance.ureaClearanceMlMin).toBeGreaterThan(20);
    });
  });

  describe('24-Hour Dynamic Kinetic Simulation', () => {
    it('models progressive reduction in BUN, potassium control, and cumulative fluid removal', () => {
      const curve = simulateCRRT24HourKinetics(standardSettings, standardPatient);

      expect(curve.length).toBe(13); // 0, 2, 4, ... 24 hours
      const hour0 = curve[0];
      const hour24 = curve[curve.length - 1];

      expect(hour0.bunMgDl).toBe(standardPatient.baselineBUNMgDl);
      expect(hour24.bunMgDl).toBeLessThan(hour0.bunMgDl);
      expect(hour24.potassiumMeqL).toBeLessThan(hour0.potassiumMeqL);
      expect(hour24.bicarbonateMeqL).toBeGreaterThan(hour0.bicarbonateMeqL);
      expect(hour24.cumulativeNetFluidRemovedMl).toBe(150 * 24); // 3600 mL
      expect(hour24.transmembranePressureMmHg).toBeGreaterThan(hour0.transmembranePressureMmHg);
    });
  });

  describe('Clinical Presets', () => {
    it('has all 6 high-yield ICU AKI presets with complete configurations', () => {
      expect(CRRT_PRESETS.length).toBe(6);
      const presetIds = CRRT_PRESETS.map(p => p.id);

      expect(presetIds).toContain('septic-aki-cvvhdf');
      expect(presetIds).toContain('hyperkalemia-cvvhd');
      expect(presetIds).toContain('lactic-acidosis-cvvh');
      expect(presetIds).toContain('filter-clotting-tmp');
      expect(presetIds).toContain('citrate-toxicity-lock');
      expect(presetIds).toContain('post-cardiac-scuf');
    });
  });
});
