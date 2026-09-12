import {
  calculateGir,
  calculateIwl,
  calculatePdaHemodynamics,
  initializeElbwPatientState,
  adjustIsoletteSettings,
  titrateTpnSettings,
  deliverSurfactant,
  adjustVentilatorSettings,
  treatPatentDuctusArteriosus,
  deliverInhaledNitricOxide,
  advanceNicuTimeStep,
  evaluateNicuDebrief,
  ELBW_NICU_SCENARIOS,
} from '../../.gemini/skills/ElbwNicuResuscitationEngine';

describe('ElbwNicuResuscitationEngine', () => {
  describe('calculateGir (Glucose Infusion Rate)', () => {
    it('calculates initial starter GIR for D10W @ 80 mL/kg/day', () => {
      // (10 * 80) / 144 = 5.55 -> 5.6
      expect(calculateGir(10, 80)).toBe(5.6);
    });

    it('calculates advancing GIR for D12.5W @ 120 mL/kg/day', () => {
      // (12.5 * 120) / 144 = 10.41 -> 10.4
      expect(calculateGir(12.5, 120)).toBe(10.4);
    });

    it('returns 0 for non-positive values', () => {
      expect(calculateGir(0, 100)).toBe(0);
      expect(calculateGir(10, 0)).toBe(0);
    });
  });

  describe('calculateIwl (Insensible Water Loss)', () => {
    it('shows high evaporative loss at 55% humidity vs low loss at 85% humidity', () => {
      const iwlLowHumidity = calculateIwl(55, false, false, 620);
      const iwlHighHumidity = calculateIwl(85, false, false, 620);
      expect(iwlLowHumidity).toBeGreaterThan(iwlHighHumidity * 2);
    });

    it('adds evaporative penalty for phototherapy and radiant warmers', () => {
      const baseIwl = calculateIwl(80, false, false, 800);
      const photoIwl = calculateIwl(80, true, false, 800);
      const warmerIwl = calculateIwl(80, false, true, 800);

      expect(photoIwl).toBeGreaterThan(baseIwl);
      expect(warmerIwl).toBeGreaterThan(photoIwl);
    });
  });

  describe('calculatePdaHemodynamics', () => {
    it('returns closed ductus metrics when diameter <= 0.5 mm', () => {
      const metrics = calculatePdaHemodynamics(0.4, 'CLOSED');
      expect(metrics.qpQsRatio).toBe(1.0);
      expect(metrics.ductalStealPresent).toBe(false);
      expect(metrics.mesentericRi).toBe(0.68);
    });

    it('identifies ductal steal and wide pulse pressure runoff with large hsPDA (2.8 mm)', () => {
      const metrics = calculatePdaHemodynamics(2.8, 'LEFT_TO_RIGHT');
      expect(metrics.qpQsRatio).toBe(2.4);
      expect(metrics.ductalStealPresent).toBe(true);
      expect(metrics.mesentericRi).toBeGreaterThanOrEqual(0.85);
      expect(metrics.pulsePressureDrop).toBeGreaterThan(12);
    });
  });

  describe('initializeElbwPatientState', () => {
    it('initializes 24-week infant with high IWL and hypernatremia', () => {
      const state = initializeElbwPatientState('ELBW_24WK_620G_HYPERNATREMIC_DEHYDRATION');
      expect(state.gestationalAgeWeeks).toBe(24);
      expect(state.electrolytes.birthWeightGrams).toBe(620);
      expect(state.electrolytes.serumSodiumMEqL).toBe(158);
      expect(state.electrolytes.weightChangePercent).toBe(-18.1);
    });

    it('initializes hsPDA scenario with bounding pulses and wide pulse pressure', () => {
      const state = initializeElbwPatientState('HSPDA_DUCTAL_STEAL_26WK_780G');
      expect(state.pdaState.ductalDiameterMm).toBe(2.8);
      expect(state.pdaState.ductalStealPresent).toBe(true);
      expect(state.hemodynamics.pulsePressureMmHg).toBe(38);
      expect(state.hemodynamics.peripheralPerfusion).toBe('BOUNDING_HYPERDYNAMIC');
    });

    it('initializes PPHN scenario with pre/post-ductal SpO2 saturation gradient', () => {
      const state = initializeElbwPatientState('NEONATAL_SEPSIS_PPHN_28WK_980G');
      expect(state.hemodynamics.preDuctalSpO2).toBe(92);
      expect(state.hemodynamics.postDuctalSpO2).toBe(78);
      expect(state.hemodynamics.prePostSpO2Delta).toBe(14);
      expect(state.pdaState.shuntDirection).toBe('RIGHT_TO_LEFT');
    });
  });

  describe('adjustIsoletteSettings', () => {
    it('adjusts humidity, reduces IWL, and stabilizes severe hypernatremia', () => {
      const initialState = initializeElbwPatientState('ELBW_24WK_620G_HYPERNATREMIC_DEHYDRATION');
      const { updatedState, message } = adjustIsoletteSettings(initialState, 85, 36.5);

      expect(updatedState.isolette.incubatorHumidityPercent).toBe(85);
      expect(updatedState.isolette.calculatedIwlMlKgDay).toBeLessThan(initialState.isolette.calculatedIwlMlKgDay);
      expect(updatedState.electrolytes.serumSodiumMEqL).toBeLessThan(initialState.electrolytes.serumSodiumMEqL);
      expect(message).toContain('Isolette humidity set to 85%');
    });
  });

  describe('titrateTpnSettings', () => {
    it('reduces excessive GIR and resolves osmotic diuresis', () => {
      const initialState = initializeElbwPatientState('TPN_GIR_HYPERGLYCEMIA_OSMOTIC_DIURESIS');
      expect(initialState.tpn.calculatedGirMgKgMin).toBeGreaterThan(13);

      const { updatedState } = titrateTpnSettings(initialState, 10, 100);
      expect(updatedState.tpn.calculatedGirMgKgMin).toBe(6.9);
      expect(updatedState.tpn.bloodGlucoseMgDl).toBeLessThan(200);
      expect(updatedState.tpn.glucosuriaPresent).toBe(false);
    });
  });

  describe('deliverSurfactant & adjustVentilatorSettings', () => {
    it('administers surfactant, surges compliance, and warns about volutrauma if PIP is high', () => {
      const initialState = initializeElbwPatientState('SEVERE_RDS_SURFACTANT_WEANING_27WK_920G');
      const { updatedState, success } = deliverSurfactant(initialState, 200);

      expect(success).toBe(true);
      expect(updatedState.respiratory.surfactantGiven).toBe(true);
      expect(updatedState.respiratory.lungComplianceMlCmH2oKg).toBe(0.55);
      expect(updatedState.respiratory.volutraumaRiskActive).toBe(true);
      expect(updatedState.clinicalAlarms.some((a) => a.includes('VOLUTRAUMA'))).toBe(true);
    });

    it('weans PIP to safe target and resolves volutrauma alarm', () => {
      const initialState = initializeElbwPatientState('SEVERE_RDS_SURFACTANT_WEANING_27WK_920G');
      const postSurfactant = deliverSurfactant(initialState, 200).updatedState;

      // Wean PIP from 22 to 16 cmH2O
      const { updatedState } = adjustVentilatorSettings(postSurfactant, 16, 30);
      expect(updatedState.respiratory.pipCmH2o).toBe(16);
      expect(updatedState.respiratory.deliveredTidalVolumeMlKg).toBeLessThanOrEqual(6.0);
      expect(updatedState.respiratory.volutraumaRiskActive).toBe(false);
    });
  });

  describe('treatPatentDuctusArteriosus & Contraindication Interlocks', () => {
    it('blocks Indomethacin when severe thrombocytopenia or AKI is present', () => {
      const initialState = initializeElbwPatientState('PDA_PHARMACOTHERAPY_CONTRAINDICATION_SELECTION');
      const result = treatPatentDuctusArteriosus(initialState, 'INDOMETHACIN');

      expect(result.success).toBe(false);
      expect(result.message).toContain('CONTRAINDICATION BLOCKED: Severe Thrombocytopenia');
    });

    it('allows Paracetamol when NSAIDs are contraindicated, closing ductus and normalizing BP', () => {
      const initialState = initializeElbwPatientState('PDA_PHARMACOTHERAPY_CONTRAINDICATION_SELECTION');
      const result = treatPatentDuctusArteriosus(initialState, 'PARACETAMOL');

      expect(result.success).toBe(true);
      expect(result.updatedState.pdaState.pdaTreatmentGiven).toBe('PARACETAMOL');
      expect(result.updatedState.pdaState.isClosed).toBe(false);
      expect(result.updatedState.pdaState.ductalDiameterMm).toBeLessThan(initialState.pdaState.ductalDiameterMm);
    });
  });

  describe('deliverInhaledNitricOxide', () => {
    it('improves post-ductal SpO2 and narrows pre/post-ductal difference in PPHN', () => {
      const initialState = initializeElbwPatientState('NEONATAL_SEPSIS_PPHN_28WK_980G');
      const { updatedState } = deliverInhaledNitricOxide(initialState, 20);

      expect(updatedState.hemodynamics.postDuctalSpO2).toBeGreaterThan(initialState.hemodynamics.postDuctalSpO2);
      expect(updatedState.hemodynamics.prePostSpO2Delta).toBeLessThan(initialState.hemodynamics.prePostSpO2Delta);
    });
  });

  describe('evaluateNicuDebrief', () => {
    it('awards top score when humidity, GIR, PDA, and surfactant weaning are correctly managed', () => {
      let state = initializeElbwPatientState('SEVERE_RDS_SURFACTANT_WEANING_27WK_920G');
      state = deliverSurfactant(state, 200).updatedState;
      state = adjustVentilatorSettings(state, 16, 30).updatedState;

      const debrief = evaluateNicuDebrief(state);
      expect(debrief.scorePercentage).toBe(100);
      expect(debrief.letterGrade).toBe('A+');
      expect(debrief.surfactantAndWeaningCorrect).toBe(true);
    });

    it('penalizes unmanaged hsPDA and unweaned volutrauma', () => {
      const state = initializeElbwPatientState('HSPDA_DUCTAL_STEAL_26WK_780G');
      const debrief = evaluateNicuDebrief(state);

      expect(debrief.scorePercentage).toBeLessThan(90);
      expect(debrief.pdaAddressedSafely).toBe(false);
    });
  });
});
