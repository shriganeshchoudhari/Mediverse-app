import {
  calculateBsa,
  computeCPBState,
  CPB_PRESETS,
  PatientParameters,
  CPBControls
} from '../../.gemini/skills/CPBPerfusionEngine';

describe('CPBPerfusionEngine', () => {
  describe('calculateBsa', () => {
    it('calculates Mosteller body surface area correctly', () => {
      // 70kg, 170cm: sqrt((170 * 70) / 3600) = sqrt(3.3055) = 1.82 m2
      const bsa = calculateBsa(70, 170);
      expect(bsa).toBeCloseTo(1.82, 1);
    });
  });

  describe('computeCPBState Hemodynamics & Circuit Dynamics', () => {
    it('computes on-bypass hemodiluted hematocrit accurately', () => {
      const preset = CPB_PRESETS.find(p => p.id === 'routine-cabg-normothermia')!;
      const state = computeCPBState(preset.patient, preset.controls);

      // Baseline Hct is 39%, prime volume is 1200 mL, patient PBV is ~5460 mL -> ~31.9%
      expect(state.onBypassHematocritPct).toBeLessThan(preset.patient.baselineHematocritPct);
      expect(state.onBypassHematocritPct).toBeGreaterThan(20);
      expect(state.cardiacIndexLpmM2).toBeGreaterThanOrEqual(2.2);
    });

    it('triggers RESERVOIR_CRITICAL_LOW alarm when venous reservoir drops below 800 mL', () => {
      const airlockPreset = CPB_PRESETS.find(p => p.id === 'venous-airlock-reservoir-depletion')!;
      const state = computeCPBState(airlockPreset.patient, airlockPreset.controls);

      expect(state.circuitAlarmStatus).toBe('RESERVOIR_CRITICAL_LOW');
      expect(state.alarmMessages.some(m => m.includes('CRITICAL VENOUS RESERVOIR LEVEL'))).toBe(true);
    });

    it('detects heparin resistance in Antithrombin III deficient patients', () => {
      const resistancePreset = CPB_PRESETS.find(p => p.id === 'at3-deficiency-heparin-resistance')!;
      const state = computeCPBState(resistancePreset.patient, resistancePreset.controls);

      expect(state.circuitAlarmStatus).toBe('HEPARIN_RESISTANCE');
      expect(state.currentActSeconds).toBeLessThan(480);
      expect(state.alarmMessages.some(m => m.includes('SUB-THERAPEUTIC ACT'))).toBe(true);
    });

    it('identifies Type III protamine pulmonary crisis with rapid bolus', () => {
      const protaminePreset = CPB_PRESETS.find(p => p.id === 'protamine-type3-pulmonary-crisis')!;
      const state = computeCPBState(protaminePreset.patient, protaminePreset.controls);

      expect(state.circuitAlarmStatus).toBe('PROTAMINE_CRISIS');
      expect(state.alarmMessages.some(m => m.includes('PROTAMINE PULMONARY CRISIS'))).toBe(true);
    });

    it('flags coronary sinus rupture hazard when retrograde pressure exceeds 50 mmHg', () => {
      const csPreset = CPB_PRESETS.find(p => p.id === 'coronary-sinus-overpressure-risk')!;
      const state = computeCPBState(csPreset.patient, csPreset.controls);

      expect(state.circuitAlarmStatus).toBe('RETROGRADE_SINUS_RUPTURE_RISK');
      expect(state.alarmMessages.some(m => m.includes('CORONARY SINUS OVERPRESSURE'))).toBe(true);
    });

    it('models Deep Hypothermic Circulatory Arrest (DHCA) with Antegrade Cerebral Perfusion (ACP)', () => {
      const dhcaPreset = CPB_PRESETS.find(p => p.id === 'aortic-arch-dhca-acp')!;
      const state = computeCPBState(dhcaPreset.patient, dhcaPreset.controls);

      expect(dhcaPreset.controls.circulatoryArrestActive).toBe(true);
      expect(dhcaPreset.controls.acpActive).toBe(true);
      expect(state.oxygenConsumptionVo2MlMinM2).toBeLessThan(50); // CMRO2 profoundly reduced
      expect(state.paco2CorrectedMmHg).toBe(40); // pH-stat strategy keeps corrected PaCO2 ~40
    });
  });
});
