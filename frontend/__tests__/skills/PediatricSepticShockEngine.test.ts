import {
  calculateMinimumSbp,
  calculateVisScore,
  classifyShockPhenotype,
  initializePediatricShockState,
  deliverFluidBolus,
  titrateVasoactiveDrug,
  executeBundleAction,
  advancePediatricTimeStep,
  evaluatePediatricShockDebrief,
  PEDIATRIC_SHOCK_SCENARIOS,
  VasoactiveInfusionRates,
} from '../../.gemini/skills/PediatricSepticShockEngine';

describe('PediatricSepticShockEngine', () => {
  describe('calculateMinimumSbp (PALS 5th percentile)', () => {
    it('calculates minimum acceptable SBP for infant (<1y)', () => {
      expect(calculateMinimumSbp(0.5)).toBe(70);
    });

    it('calculates age-adjusted minimum SBP for toddler (2y: 74 mmHg)', () => {
      expect(calculateMinimumSbp(2)).toBe(74);
    });

    it('calculates age-adjusted minimum SBP for 4-year-old (78 mmHg)', () => {
      expect(calculateMinimumSbp(4)).toBe(78);
    });

    it('calculates age-adjusted minimum SBP for 10-year-old (90 mmHg)', () => {
      expect(calculateMinimumSbp(10)).toBe(90);
    });

    it('caps minimum SBP at 90 mmHg for adolescents (>10y)', () => {
      expect(calculateMinimumSbp(14)).toBe(90);
    });
  });

  describe('calculateVisScore (Vasoactive-Inotropic Score)', () => {
    it('calculates 0 when no vasoactive infusions are active', () => {
      const zeroRates: VasoactiveInfusionRates = {
        epinephrineMcgKgMin: 0,
        norepinephrineMcgKgMin: 0,
        dobutamineMcgKgMin: 0,
        dopamineMcgKgMin: 0,
        milrinoneMcgKgMin: 0,
        vasopressinUnitsKgMin: 0,
      };
      expect(calculateVisScore(zeroRates)).toBe(0);
    });

    it('correctly weighs multi-agent catecholamine & inotrope infusions', () => {
      const activeRates: VasoactiveInfusionRates = {
        dopamineMcgKgMin: 5, // 5
        dobutamineMcgKgMin: 5, // 5
        epinephrineMcgKgMin: 0.1, // 100 * 0.1 = 10
        milrinoneMcgKgMin: 0.5, // 10 * 0.5 = 5
        vasopressinUnitsKgMin: 0.0005, // 10000 * 0.0005 = 5
        norepinephrineMcgKgMin: 0.05, // 100 * 0.05 = 5
      };
      // 5 + 5 + 10 + 5 + 5 + 5 = 35
      expect(calculateVisScore(activeRates)).toBe(35);
    });
  });

  describe('classifyShockPhenotype', () => {
    it('classifies Cold Shock with delayed cap refill and cool mottled extremities', () => {
      const phenotype = classifyShockPhenotype('COOL_MOTTLED', 4.5, 'THREADY_WEAK', 72, 74);
      expect(phenotype).toBe('COLD_SHOCK');
    });

    it('classifies Warm Shock with flash cap refill and bounding pulses', () => {
      const phenotype = classifyShockPhenotype('WARM_FLUSHED', 0.5, 'BOUNDING_WATERHAMMER', 78, 90);
      expect(phenotype).toBe('WARM_SHOCK');
    });

    it('classifies Resolved Euvolemic when warm, refill normal, and normotensive', () => {
      const phenotype = classifyShockPhenotype('NORMAL_WARM', 2.0, 'NORMAL', 98, 74);
      expect(phenotype).toBe('RESOLVED_EUVOLEMIC');
    });
  });

  describe('initializePediatricShockState', () => {
    it('initializes Cold Shock toddler pneumonia scenario with metabolic derangements', () => {
      const state = initializePediatricShockState('COLD_SHOCK_TODDLER_PNEUMONIA');
      expect(state.patientAgeYears).toBe(2);
      expect(state.weightKg).toBe(12);
      expect(state.hemodynamics.phenotype).toBe('COLD_SHOCK');
      expect(state.hemodynamics.minimumAcceptableSbpMmHg).toBe(74);
      expect(state.metabolic.bloodGlucoseMgDl).toBe(64); // Hypoglycemic
      expect(state.metabolic.ionizedCalciumMmolL).toBe(0.98); // Hypocalcemic
      expect(state.fluidState.liverEdgeBelowCostalMarginCm).toBe(1.0);
    });

    it('initializes Catecholamine Resistant CIRCI scenario with existing vasoactives and elevated VIS', () => {
      const state = initializePediatricShockState('CATECHOLAMINE_RESISTANT_CIRCI_SCHOOL_AGE');
      expect(state.vasoactiveRates.epinephrineMcgKgMin).toBe(0.3);
      expect(state.vasoactiveRates.norepinephrineMcgKgMin).toBe(0.2);
      expect(state.visScore).toBe(50); // (100 * 0.3) + (100 * 0.2)
    });
  });

  describe('deliverFluidBolus & Safety Overload Guardrail', () => {
    it('delivers 20 mL/kg crystalloid bolus and increments cumulative fluid', () => {
      const initialState = initializePediatricShockState('COLD_SHOCK_TODDLER_PNEUMONIA');
      const { updatedState, success } = deliverFluidBolus(initialState, 20);

      expect(success).toBe(true);
      expect(updatedState.fluidState.cumulativeFluidMlKg).toBe(20);
      expect(updatedState.fluidState.liverEdgeBelowCostalMarginCm).toBe(1.8);
      expect(updatedState.administeredFluidBolusesCount).toBe(1);
    });

    it('triggers fluid stop safety interlock when liver edge descends >= 3.0 cm', () => {
      let state = initializePediatricShockState('COLD_SHOCK_TODDLER_PNEUMONIA');
      // Bolus 1: 1.0 -> 1.8 cm
      state = deliverFluidBolus(state, 20).updatedState;
      // Bolus 2: 1.8 -> 2.6 cm
      state = deliverFluidBolus(state, 20).updatedState;
      // Bolus 3: 2.6 -> 3.4 cm (exceeds 3.0 cm threshold!)
      const result3 = deliverFluidBolus(state, 20);

      expect(result3.updatedState.fluidState.fluidStopTriggered).toBe(true);
      expect(result3.updatedState.fluidState.pulmonaryCracklesPresent).toBe(true);
      expect(result3.updatedState.fluidState.workOfBreathing).toBe('SEVERE_GRUNTING_FLARING');

      // Subsequent attempt must be blocked by safety interlock
      const blockedAttempt = deliverFluidBolus(result3.updatedState, 20);
      expect(blockedAttempt.success).toBe(false);
      expect(blockedAttempt.message).toContain('FLUID STOP SAFETY INTERLOCK TRIGGERED');
    });
  });

  describe('titrateVasoactiveDrug', () => {
    it('titrates Epinephrine infusion and restores SBP in cold shock', () => {
      const initialState = initializePediatricShockState('COLD_SHOCK_TODDLER_PNEUMONIA');
      const { updatedState } = titrateVasoactiveDrug(initialState, 'EPINEPHRINE', 0.1);

      expect(updatedState.vasoactiveRates.epinephrineMcgKgMin).toBe(0.1);
      expect(updatedState.visScore).toBe(10);
      expect(updatedState.hemodynamics.systolicBpMmHg).toBeGreaterThan(initialState.hemodynamics.systolicBpMmHg);
      expect(updatedState.hemodynamics.extremityTemperature).toBe('NORMAL_WARM');
    });

    it('titrates Norepinephrine infusion and increases diastolic BP in warm shock', () => {
      const initialState = initializePediatricShockState('WARM_SHOCK_ADOLESCENT_TSS');
      const { updatedState } = titrateVasoactiveDrug(initialState, 'NOREPINEPHRINE', 0.1);

      expect(updatedState.vasoactiveRates.norepinephrineMcgKgMin).toBe(0.1);
      expect(updatedState.visScore).toBe(10);
      expect(updatedState.hemodynamics.diastolicBpMmHg).toBeGreaterThan(initialState.hemodynamics.diastolicBpMmHg);
    });
  });

  describe('executeBundleAction', () => {
    it('executes blood cultures and records intervention', () => {
      const state = initializePediatricShockState('COLD_SHOCK_TODDLER_PNEUMONIA');
      const { updatedState } = executeBundleAction(state, 'BLOOD_CULTURES');
      expect(updatedState.bloodCulturesObtained).toBe(true);
    });

    it('administers antibiotics and records drug', () => {
      const state = initializePediatricShockState('COLD_SHOCK_TODDLER_PNEUMONIA');
      const { updatedState } = executeBundleAction(state, 'ANTIBIOTICS');
      expect(updatedState.antibioticsAdministered).toBe(true);
      expect(updatedState.antibioticName).toBeDefined();
    });

    it('administers D10W bolus and normalizes hypoglycemia', () => {
      const state = initializePediatricShockState('COLD_SHOCK_TODDLER_PNEUMONIA');
      const { updatedState } = executeBundleAction(state, 'D10W_GLUCOSE');
      expect(updatedState.glucoseAdministered).toBe(true);
      expect(updatedState.metabolic.bloodGlucoseMgDl).toBeGreaterThanOrEqual(70);
    });

    it('administers Calcium Gluconate and normalizes ionized calcium', () => {
      const state = initializePediatricShockState('COLD_SHOCK_TODDLER_PNEUMONIA');
      const { updatedState } = executeBundleAction(state, 'CALCIUM_GLUCONATE');
      expect(updatedState.calciumAdministered).toBe(true);
      expect(updatedState.metabolic.ionizedCalciumMmolL).toBe(1.22);
    });

    it('administers stress-dose Hydrocortisone for CIRCI and restores hemodynamics', () => {
      const state = initializePediatricShockState('CATECHOLAMINE_RESISTANT_CIRCI_SCHOOL_AGE');
      const { updatedState } = executeBundleAction(state, 'HYDROCORTISONE');
      expect(updatedState.hydrocortisoneAdministered).toBe(true);
      expect(updatedState.hemodynamics.phenotype).toBe('RESOLVED_EUVOLEMIC');
    });
  });

  describe('advancePediatricTimeStep & Alarms', () => {
    it('triggers alarms for decompensated hypotension, hypoglycemia, and hypocalcemia', () => {
      let state = initializePediatricShockState('COLD_SHOCK_TODDLER_PNEUMONIA');
      state = advancePediatricTimeStep(state, 15);

      expect(state.clinicalAlarms.some((a) => a.includes('DECOMPENSATED HYPOTENSION'))).toBe(true);
      expect(state.clinicalAlarms.some((a) => a.includes('CRITICAL HYPOGLYCEMIA'))).toBe(true);
      expect(state.clinicalAlarms.some((a) => a.includes('CRITICAL HYPOCALCEMIA'))).toBe(true);
    });
  });

  describe('evaluatePediatricShockDebrief', () => {
    it('awards high grade when all clinical bundles, correct inotrope, and metabolic rescues are executed', () => {
      let state = initializePediatricShockState('COLD_SHOCK_TODDLER_PNEUMONIA');
      state = executeBundleAction(state, 'BLOOD_CULTURES').updatedState;
      state = executeBundleAction(state, 'ANTIBIOTICS').updatedState;
      state = executeBundleAction(state, 'D10W_GLUCOSE').updatedState;
      state = executeBundleAction(state, 'CALCIUM_GLUCONATE').updatedState;
      state = titrateVasoactiveDrug(state, 'EPINEPHRINE', 0.1).updatedState;
      state = deliverFluidBolus(state, 20).updatedState;

      const debrief = evaluatePediatricShockDebrief(state);
      expect(debrief.scorePercentage).toBeGreaterThanOrEqual(90);
      expect(debrief.letterGrade).toMatch(/A|A\+/);
      expect(debrief.firstLineVasoactiveCorrect).toBe(true);
      expect(debrief.metabolicCorrectionsDone).toBe(true);
    });

    it('penalizes fluid overload and omission of first-line vasoactive', () => {
      const state = initializePediatricShockState('FLUID_OVERLOAD_HEPATOMEGALY_PRESCHOOL');
      // Deliver an extra bolus in fluid overloaded state
      const stateWithOverload = {
        ...state,
        administeredFluidBolusesCount: 3,
        fluidState: {
          ...state.fluidState,
          liverEdgeBelowCostalMarginCm: 4.5,
        },
      };

      const debrief = evaluatePediatricShockDebrief(stateWithOverload);
      expect(debrief.fluidOverloadAvoided).toBe(false);
      expect(debrief.facultyFeedback.some((f) => f.includes('Critical Safety Error'))).toBe(true);
    });
  });
});
