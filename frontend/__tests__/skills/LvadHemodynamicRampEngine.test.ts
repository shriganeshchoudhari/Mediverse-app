import {
  calculatePapi,
  initializeLvadPatientState,
  titratePumpSpeed,
  deliverFluidBolus,
  titrateInotropeOrVasodilator,
  administerAnticoagulation,
  advanceLvadTimeStep,
  evaluateLvadDebrief,
  LVAD_SCENARIOS,
} from '../../.gemini/skills/LvadHemodynamicRampEngine';

describe('LvadHemodynamicRampEngine', () => {
  describe('calculatePapi (Pulmonary Artery Pulsatility Index)', () => {
    it('calculates normal PAPi (> 2.0) for stable hemodynamics', () => {
      // (35 - 15) / 8 = 2.5
      expect(calculatePapi(35, 15, 8)).toBe(2.5);
    });

    it('identifies severe RV failure (PAPi < 1.85) when CVP is elevated', () => {
      // (35 - 12) / 20 = 1.15
      expect(calculatePapi(35, 12, 20)).toBe(1.15);
    });
  });

  describe('initializeLvadPatientState', () => {
    it('initializes stable RAMP scenario with baseline parameters', () => {
      const state = initializeLvadPatientState('RAMP_PROTOCOL_SPEED_OPTIMIZATION');
      expect(state.pump.speedRpm).toBe(5000);
      expect(state.pump.flowLpm).toBe(4.2);
      expect(state.hemodynamics.lveddCm).toBe(6.2);
      expect(state.hemodynamics.aorticValveStatus).toBe('PERMANENTLY_OPEN');
      expect(state.rampProtocolHistory).toHaveLength(1);
    });

    it('initializes acute suction scenario with low flow and suction alarms', () => {
      const state = initializeLvadPatientState('ACUTE_SUCTION_EVENT_HYPOVOLEMIA');
      expect(state.pump.suctionEventActive).toBe(true);
      expect(state.pump.lowFlowAlarmActive).toBe(true);
      expect(state.pump.flowLpm).toBe(2.1);
      expect(state.pump.pulsatilityIndex).toBe(1.6);
      expect(state.clinicalAlarms.some((a) => a.includes('SUCTION'))).toBe(true);
    });

    it('initializes pump thrombosis scenario with massive power spike and hemolysis', () => {
      const state = initializeLvadPatientState('PUMP_THROMBOSIS_POWER_SPIKE_HEMOLYSIS');
      expect(state.pump.powerWatts).toBe(11.5);
      expect(state.labs.serumLdhIuL).toBe(2400);
      expect(state.labs.urineColor).toBe('DARK_TEA_BURGUNDY');
    });
  });

  describe('titratePumpSpeed & RAMP Unloading', () => {
    it('unloads LVEDD and transitions aortic valve to intermittent opening at 5500 rpm', () => {
      const initialState = initializeLvadPatientState('RAMP_PROTOCOL_SPEED_OPTIMIZATION');
      const { updatedState } = titratePumpSpeed(initialState, 5500);

      expect(updatedState.pump.speedRpm).toBe(5500);
      expect(updatedState.hemodynamics.lveddCm).toBeLessThan(initialState.hemodynamics.lveddCm);
      expect(updatedState.hemodynamics.aorticValveStatus).toBe('INTERMITTENT_OPENING_OPTIMAL');
      expect(updatedState.hemodynamics.septalPosition).toBe('MIDLINE_NEUTRAL');
      expect(updatedState.rampProtocolHistory).toHaveLength(2);
    });

    it('permanently closes aortic valve when speed exceeds 5600 rpm', () => {
      const initialState = initializeLvadPatientState('RAMP_PROTOCOL_SPEED_OPTIMIZATION');
      const { updatedState } = titratePumpSpeed(initialState, 6000);

      expect(updatedState.hemodynamics.aorticValveStatus).toBe('PERMANENTLY_CLOSED');
    });
  });

  describe('deliverFluidBolus', () => {
    it('relieves suction event, expands LV, and restores pump flow', () => {
      const initialState = initializeLvadPatientState('ACUTE_SUCTION_EVENT_HYPOVOLEMIA');
      expect(initialState.pump.suctionEventActive).toBe(true);

      const { updatedState, message } = deliverFluidBolus(initialState, 500);
      expect(updatedState.pump.suctionEventActive).toBe(false);
      expect(updatedState.pump.flowLpm).toBeGreaterThanOrEqual(4.0);
      expect(updatedState.hemodynamics.cvpMmHg).toBeGreaterThan(initialState.hemodynamics.cvpMmHg);
      expect(message).toContain('Suction relieved');
    });
  });

  describe('titrateInotropeOrVasodilator', () => {
    it('improves RV hemodynamics, lowers CVP, and increases PAPi with iNO and Milrinone', () => {
      const initialState = initializeLvadPatientState('DECOMPENSATED_RV_FAILURE_POST_IMPLANT');
      let state = titrateInotropeOrVasodilator(initialState, 'INO', 20).updatedState;
      state = titrateInotropeOrVasodilator(state, 'MILRINONE', 0.375).updatedState;

      expect(state.hemodynamics.cvpMmHg).toBeLessThan(initialState.hemodynamics.cvpMmHg);
      expect(state.hemodynamics.papiRatio).toBeGreaterThan(initialState.hemodynamics.papiRatio);
      expect(state.hemodynamics.tapseMm).toBeGreaterThan(initialState.hemodynamics.tapseMm);
    });
  });

  describe('administerAnticoagulation', () => {
    it('resolves power spike and clears hemolysis markers in pump thrombosis', () => {
      const initialState = initializeLvadPatientState('PUMP_THROMBOSIS_POWER_SPIKE_HEMOLYSIS');
      const { updatedState, message } = administerAnticoagulation(initialState, 'HEPARIN_INFUSION');

      expect(updatedState.anticoagulationActive).toBe(true);
      expect(updatedState.pump.powerWatts).toBeLessThanOrEqual(5.0);
      expect(updatedState.labs.serumLdhIuL).toBeLessThan(initialState.labs.serumLdhIuL);
      expect(message).toContain('Rotor drag resolved');
    });
  });

  describe('advanceLvadTimeStep & Alarms', () => {
    it('triggers RV failure alarm when PAPi < 1.85 and CVP > 16 mmHg', () => {
      let state = initializeLvadPatientState('DECOMPENSATED_RV_FAILURE_POST_IMPLANT');
      state = advanceLvadTimeStep(state, 10);

      expect(state.clinicalAlarms.some((a) => a.includes('ACUTE RV FAILURE'))).toBe(true);
    });
  });

  describe('evaluateLvadDebrief', () => {
    it('awards high score when RAMP speed is optimized to target range', () => {
      let state = initializeLvadPatientState('RAMP_PROTOCOL_SPEED_OPTIMIZATION');
      state = titratePumpSpeed(state, 5500).updatedState;

      const debrief = evaluateLvadDebrief(state);
      expect(debrief.scorePercentage).toBeGreaterThanOrEqual(95);
      expect(debrief.letterGrade).toBe('A+');
      expect(debrief.rampSpeedOptimized).toBe(true);
    });

    it('penalizes persistent suction and untreated thrombosis', () => {
      const state = initializeLvadPatientState('ACUTE_SUCTION_EVENT_HYPOVOLEMIA');
      const debrief = evaluateLvadDebrief(state);

      expect(debrief.scorePercentage).toBeLessThan(80);
      expect(debrief.suctionRelievedPromptly).toBe(false);
    });
  });
});
