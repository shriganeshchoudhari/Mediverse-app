import {
  computePneumoperitoneumHemodynamics,
  computeThermalSpreadMm,
  ROBOTIC_SURGERY_PRESETS,
  ROBOTIC_PRESETS,
  RoboticPresetId
} from '@/.gemini/skills/RoboticSurgeryEngine';

describe('RoboticSurgeryEngine', () => {
  describe('Pneumoperitoneum & Table Tilt Hemodynamics', () => {
    it('models normal operating conditions at 12 mmHg IAP and neutral tilt', () => {
      const res = computePneumoperitoneumHemodynamics(12, 0);

      expect(res.peakAirwayPressureCmH2O).toBeLessThan(25);
      expect(res.lungComplianceMlCmH2O).toBeGreaterThan(35);
      expect(res.mapMmHg).toBeGreaterThanOrEqual(75);
      expect(res.cardiacOutputLMin).toBeGreaterThanOrEqual(4.5);
      expect(res.alarms).toContain('OPTIMAL');
    });

    it('elevates peak airway pressure and decreases lung compliance in steep Trendelenburg', () => {
      const neutralRes = computePneumoperitoneumHemodynamics(14, 0);
      const steepRes = computePneumoperitoneumHemodynamics(14, -30);

      expect(steepRes.peakAirwayPressureCmH2O).toBeGreaterThan(neutralRes.peakAirwayPressureCmH2O);
      expect(steepRes.lungComplianceMlCmH2O).toBeLessThan(neutralRes.lungComplianceMlCmH2O);
      expect(steepRes.cvpMmHg).toBeGreaterThan(neutralRes.cvpMmHg);
    });

    it('triggers tension pneumoperitoneum and IVC collapse alarms when IAP > 15 mmHg', () => {
      const highIapRes = computePneumoperitoneumHemodynamics(22, -15);

      expect(highIapRes.alarms).toContain('TENSION_PNEUMOPERITONEUM');
      expect(highIapRes.alarms).toContain('HYPOTENSION_IVC_COLLAPSE');
      expect(highIapRes.cardiacOutputLMin).toBeLessThan(3.0);
      expect(highIapRes.peakAirwayPressureCmH2O).toBeGreaterThanOrEqual(35);
    });

    it('models acute CO2 gas embolism with precipitous drop in EtCO2 and shock', () => {
      const embolusRes = computePneumoperitoneumHemodynamics(14, -20, true, false);

      expect(embolusRes.alarms).toContain('CO2_GAS_EMBOLISM');
      expect(embolusRes.etCo2MmHg).toBeLessThan(20);
      expect(embolusRes.mapMmHg).toBeLessThan(55);
      expect(embolusRes.cardiacOutputLMin).toBeLessThan(2.5);
    });

    it('shows hemodynamic improvement with Durant maneuver rescue during gas embolism', () => {
      const unrescued = computePneumoperitoneumHemodynamics(14, -20, true, false);
      const rescued = computePneumoperitoneumHemodynamics(14, -20, true, true);

      expect(rescued.etCo2MmHg).toBeGreaterThan(unrescued.etCo2MmHg);
      expect(rescued.cardiacOutputLMin).toBeGreaterThan(unrescued.cardiacOutputLMin);
      expect(rescued.mapMmHg).toBeGreaterThan(unrescued.mapMmHg);
    });
  });

  describe('Electrosurgical Thermal Spread', () => {
    it('calculates wider thermal spread for Monopolar Coag compared to Ultrasonic Harmonic', () => {
      const monopolarCoag = computeThermalSpreadMm('MONOPOLAR_COAG', 35);
      const ultrasonic = computeThermalSpreadMm('ULTRASONIC_HARMONIC', 35);

      expect(monopolarCoag).toBeGreaterThan(3.0);
      expect(ultrasonic).toBeLessThan(1.5);
    });

    it('calculates localized thermal spread for Bipolar energy', () => {
      const bipolar = computeThermalSpreadMm('BIPOLAR', 30);
      expect(bipolar).toBeLessThan(1.5);
    });
  });

  describe('Clinical Presets Catalog', () => {
    it('contains all 6 curated robotic and laparoscopic scenarios', () => {
      const presetIds: RoboticPresetId[] = [
        'robotic-radical-prostatectomy-steep-trendelenburg',
        'laparoscopic-cholecystectomy-critical-view-safety',
        'acute-co2-gas-embolism-emergency',
        'tension-pneumoperitoneum-abdominal-compartment',
        'stray-current-capacitive-coupling-bowel',
        'robotic-partial-nephrectomy-warm-ischemia'
      ];

      presetIds.forEach(id => {
        const preset = ROBOTIC_SURGERY_PRESETS[id];
        expect(preset).toBeDefined();
        expect(preset.id).toBe(id);
        expect(preset.title.length).toBeGreaterThan(5);
        expect(preset.surgicalSteps.length).toBeGreaterThanOrEqual(4);
        expect(preset.boardReviewPearls.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('correctly models Critical View of Safety criteria in Lap Chole', () => {
      const cholePreset = ROBOTIC_SURGERY_PRESETS['laparoscopic-cholecystectomy-critical-view-safety'];
      expect(cholePreset.initialState.criticalViewOfSafetyConfirmed).toBe(true);
      expect(cholePreset.procedure).toBe('LAP_CHOLECYSTECTOMY');
    });

    it('correctly tracks warm ischemia time in Robotic Partial Nephrectomy', () => {
      const rpnPreset = ROBOTIC_SURGERY_PRESETS['robotic-partial-nephrectomy-warm-ischemia'];
      expect(rpnPreset.initialState.warmIschemiaSeconds).toBe(780);
      expect(rpnPreset.initialState.clampApplied).toBe(true);
    });
  });
});
