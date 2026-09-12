import {
  evaluatePrerequisites,
  evaluateBrainstemReflexes,
  initializeApneaTest,
  stepApneaTest,
  evaluateApneaTestResult,
  interpretAncillaryTest,
  calculateDonorOptimization,
  BrainDeathPrerequisites,
  BrainstemReflexAssessment,
  DonorManagementState,
} from '../../.gemini/skills/BrainDeathApneaEngine';

describe('BrainDeathApneaEngine', () => {
  describe('evaluatePrerequisites', () => {
    const validPrereqs: BrainDeathPrerequisites = {
      coreTempC: 36.8,
      systolicBp: 118,
      meanArterialPressure: 78,
      neuromuscularBlockadeFree: true,
      cnsDepressantsCleared: true,
      severeMetabolicDerangementAbsent: true,
      proximateCauseKnown: true,
    };

    it('passes when all AAN prerequisites are met', () => {
      const result = evaluatePrerequisites(validPrereqs);
      expect(result.isEligible).toBe(true);
      expect(result.blockers).toHaveLength(0);
    });

    it('blocks determination if core temperature < 36.0 C', () => {
      const result = evaluatePrerequisites({ ...validPrereqs, coreTempC: 35.2 });
      expect(result.isEligible).toBe(false);
      expect(result.blockers.some((b) => b.includes('Hypothermia'))).toBe(true);
    });

    it('blocks determination if SBP < 100 mmHg or MAP < 60 mmHg', () => {
      const result = evaluatePrerequisites({ ...validPrereqs, systolicBp: 88, meanArterialPressure: 55 });
      expect(result.isEligible).toBe(false);
      expect(result.blockers.some((b) => b.includes('Hypotension'))).toBe(true);
    });

    it('blocks determination if neuromuscular blockade is present', () => {
      const result = evaluatePrerequisites({ ...validPrereqs, neuromuscularBlockadeFree: false });
      expect(result.isEligible).toBe(false);
      expect(result.blockers.some((b) => b.includes('Neuromuscular blockade'))).toBe(true);
    });

    it('blocks determination if sedative/CNS depressant clearance is uncleared', () => {
      const result = evaluatePrerequisites({ ...validPrereqs, cnsDepressantsCleared: false });
      expect(result.isEligible).toBe(false);
      expect(result.blockers.some((b) => b.includes('CNS depressant'))).toBe(true);
    });
  });

  describe('evaluateBrainstemReflexes', () => {
    const allAbsentReflexes: BrainstemReflexAssessment = {
      pupillaryLightReflexRight: false,
      pupillaryLightReflexLeft: false,
      cornealReflexRight: false,
      cornealReflexLeft: false,
      oculocephalicDollEyes: false,
      oculovestibularColdCaloricsRight: false,
      oculovestibularColdCaloricsLeft: false,
      facialNoxiousGrimace: false,
      pharyngealGagReflex: false,
      trachealCoughReflex: false,
      spinalReflexesPresent: false,
    };

    it('confirms brainstem reflex absence when all cranial reflexes are absent', () => {
      const evalResult = evaluateBrainstemReflexes(allAbsentReflexes);
      expect(evalResult.allBrainstemReflexesAbsent).toBe(true);
      expect(evalResult.persistentReflexes).toHaveLength(0);
    });

    it('detects persistent pupillary reflex and refutes brain death', () => {
      const evalResult = evaluateBrainstemReflexes({
        ...allAbsentReflexes,
        pupillaryLightReflexRight: true,
      });
      expect(evalResult.allBrainstemReflexesAbsent).toBe(false);
      expect(evalResult.persistentReflexes.some((r) => r.includes('Pupillary'))).toBe(true);
    });

    it('allows spinal reflexes (Lazarus sign, triple flexion) without invalidating brain death', () => {
      const evalResult = evaluateBrainstemReflexes({
        ...allAbsentReflexes,
        spinalReflexesPresent: true,
      });
      expect(evalResult.allBrainstemReflexesAbsent).toBe(true);
      expect(evalResult.spinalReflexNote).toContain('originate from the spinal cord');
    });
  });

  describe('Apnea Testing Kinetics', () => {
    it('accurately simulates PaCO2 rise ~3 mmHg/min and arterial pH drop', () => {
      let state = initializeApneaTest(40, 260, 7.40, 120);
      expect(state.currentPaCO2).toBe(40);

      // Step 5 minutes
      state = stepApneaTest(state, 5, 'apneic_catheter', 'normal');
      expect(state.elapsedMinutes).toBe(5);
      expect(state.currentPaCO2).toBeCloseTo(55, 0);
      expect(state.arterialPH).toBeLessThan(7.35);
      expect(state.targetReached).toBe(false);

      // Step additional 4 minutes (total 9 min -> ~27 mmHg rise -> PaCO2 ~67)
      state = stepApneaTest(state, 4, 'apneic_catheter', 'normal');
      expect(state.currentPaCO2).toBeGreaterThanOrEqual(60);
      expect(state.currentPaCO2 - state.initialPaCO2).toBeGreaterThanOrEqual(20);
      expect(state.targetReached).toBe(true);

      const evaluation = evaluateApneaTestResult(state);
      expect(evaluation.status).toBe('POSITIVE_BRAIN_DEATH');
      expect(evaluation.meetsPaCO2Criteria).toBe(true);
      expect(evaluation.spontaneousBreathingDetected).toBe(false);
    });

    it('aborts apnea test when SpO2 drops below 85%', () => {
      let state = initializeApneaTest(40, 75, 7.40, 110);
      // Run without oxygenation
      state = stepApneaTest(state, 2, 'none', 'normal');
      expect(state.aborted).toBe(true);
      expect(state.abortReason).toContain('Critical hypoxemia');

      const evaluation = evaluateApneaTestResult(state);
      expect(evaluation.status).toBe('ABORTED_INCONCLUSIVE');
      expect(evaluation.nextStepRecommendation).toContain('Ancillary Testing');
    });

    it('immediately aborts and refutes brain death if spontaneous breathing occurs', () => {
      let state = initializeApneaTest(40, 240, 7.40, 120);
      state = stepApneaTest(state, 4, 'apneic_catheter', 'normal', true); // triggered breath
      expect(state.aborted).toBe(true);
      expect(state.spontaneousBreathsObserved).toBe(1);

      const evaluation = evaluateApneaTestResult(state);
      expect(evaluation.status).toBe('NEGATIVE_SPONTANEOUS_BREATHING');
      expect(evaluation.spontaneousBreathingDetected).toBe(true);
    });
  });

  describe('Ancillary Testing Interpretation', () => {
    it('interprets 4-vessel cerebral angiography showing empty skull as consistent with brain death', () => {
      const result = interpretAncillaryTest('angiography', 'brain_death');
      expect(result.isConsistentWithBrainDeath).toBe(true);
      expect(result.keyFeature).toContain('Empty Skull');
    });

    it('interprets Radionuclide SPECT showing hollow skull with hot nose sign as consistent with brain death', () => {
      const result = interpretAncillaryTest('spect_perfusion', 'brain_death');
      expect(result.isConsistentWithBrainDeath).toBe(true);
      expect(result.keyFeature).toContain('Hot Nose');
    });

    it('interprets Transcranial Doppler reverberating flow as consistent with brain death', () => {
      const result = interpretAncillaryTest('tcd', 'brain_death');
      expect(result.isConsistentWithBrainDeath).toBe(true);
      expect(result.keyFeature).toContain('reverberating');
    });

    it('interprets EEG electrocerebral silence (< 2 uV) as consistent with brain death', () => {
      const result = interpretAncillaryTest('eeg', 'brain_death');
      expect(result.isConsistentWithBrainDeath).toBe(true);
      expect(result.keyFeature).toContain('Electrocerebral silence');
    });
  });

  describe('Organ Donor Hemodynamic Optimization', () => {
    const baselineDonor: DonorManagementState = {
      systolicBP: 110,
      meanArterialPressure: 72,
      urineOutputMlHr: 150,
      serumSodium: 142,
      coreTempC: 36.8,
      paO2: 120,
      vasopressinDoseUnitsHr: 1.2,
      levothyroxineActive: true,
      corticosteroidActive: true,
      insulinActive: true,
      fluidBolusMl: 0,
    };

    it('meets Rule of 100s and achieves optimal organ viability in well-managed donor', () => {
      const report = calculateDonorOptimization(baselineDonor);
      expect(report.meetsRuleOf100s).toBe(true);
      expect(report.overallScorePercent).toBeGreaterThanOrEqual(85);
      expect(report.organViabilityYield.heart).toBe('Optimal');
      expect(report.organViabilityYield.kidneys).toBe('Optimal');
    });

    it('flags neurogenic diabetes insipidus polyuria and recommends vasopressin/DDAVP', () => {
      const polyuricDonor: DonorManagementState = {
        ...baselineDonor,
        urineOutputMlHr: 450,
        vasopressinDoseUnitsHr: 0,
      };
      const report = calculateDonorOptimization(polyuricDonor);
      expect(report.interventionsNeeded.some((i) => i.includes('Diabetes Insipidus'))).toBe(true);
    });
  });
});
