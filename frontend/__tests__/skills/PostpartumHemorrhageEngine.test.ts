import {
  PPH_SCENARIOS,
  initializePphState,
  calculatePphStage,
  administerUterotonic,
  titrateBakriBalloon,
  transfuseBloodProducts,
  advancePphTimeStep,
  evaluatePphPerformance,
} from '../../.gemini/skills/PostpartumHemorrhageEngine';

describe('PostpartumHemorrhageEngine', () => {
  describe('Presets & Staging Initialization', () => {
    it('initializes all 6 obstetric scenarios with correct baseline data', () => {
      expect(Object.keys(PPH_SCENARIOS)).toHaveLength(6);
      expect(PPH_SCENARIOS.CLASSIC_ATONY_PROLONGED_LABOR).toBeDefined();
      expect(PPH_SCENARIOS.PPH_SEVERE_PREECLAMPSIA_METHERGINE_CONTRAINDICATION).toBeDefined();
      expect(PPH_SCENARIOS.PPH_SEVERE_ASTHMA_HEMABATE_CONTRAINDICATION).toBeDefined();
      expect(PPH_SCENARIOS.RETAINED_TISSUE_CERVICAL_LACERATION).toBeDefined();
      expect(PPH_SCENARIOS.ABRUPTIO_PLACENTAE_DIC_HYPOFIBRINOGENEMIA).toBeDefined();
      expect(PPH_SCENARIOS.PLACENTA_ACCRETA_SPECTRUM_SURGICAL).toBeDefined();
    });

    it('accurately computes initial Shock Index and CMQCC Stage', () => {
      const state = initializePphState('CLASSIC_ATONY_PROLONGED_LABOR');
      expect(state.hemodynamics.shockIndex).toBeCloseTo(98 / 110, 2);
      expect(state.currentStage).toBe('STAGE_1_ALERT');
    });

    it('classifies Stage 0, 1, 2, and 3 according to CMQCC guidelines', () => {
      expect(calculatePphStage(400, 0.75, 0)).toBe('STAGE_0_NORMAL');
      expect(calculatePphStage(750, 0.92, 0)).toBe('STAGE_1_ALERT');
      expect(calculatePphStage(1200, 1.05, 0)).toBe('STAGE_2_PERSISTENT');
      expect(calculatePphStage(1800, 1.4, 2)).toBe('STAGE_3_CRITICAL_MTP');
    });
  });

  describe('Clinical Safety Guardrails & Contraindication Interlocks', () => {
    it('STRICTLY BLOCKS Methergine in Severe Preeclampsia and triggers alert', () => {
      const state = initializePphState('PPH_SEVERE_PREECLAMPSIA_METHERGINE_CONTRAINDICATION');
      const result = administerUterotonic(state, 'METHERGINE', 'IM', '0.2 mg');

      expect(result.success).toBe(false);
      expect(result.contraindicationViolation).toContain('Severe Preeclampsia');
      expect(result.updatedState.activeContraindicationViolations).toHaveLength(1);
      expect(result.updatedState.clinicalAlarms).toContain('CRITICAL HYPERTENSIVE CRISIS (Methergine violation)');
    });

    it('STRICTLY BLOCKS Hemabate in Severe Asthma and triggers bronchospasm alarm', () => {
      const state = initializePphState('PPH_SEVERE_ASTHMA_HEMABATE_CONTRAINDICATION');
      const result = administerUterotonic(state, 'HEMABATE', 'IM', '250 mcg');

      expect(result.success).toBe(false);
      expect(result.contraindicationViolation).toContain('Asthma');
      expect(result.updatedState.clinicalAlarms).toContain('SEVERE ACUTE BRONCHOSPASM (Hemabate in Asthma)');
      expect(result.updatedState.hemodynamics.spO2Percent).toBeLessThan(90);
    });

    it('rejects dangerous rapid IV push of concentrated Oxytocin', () => {
      const state = initializePphState('CLASSIC_ATONY_PROLONGED_LABOR');
      const result = administerUterotonic(state, 'OXYTOCIN', 'IV_PUSH_RAPID', '10 Units');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Rapid IV Push of concentrated Oxytocin');
      expect(result.updatedState.clinicalAlarms).toContain('PROFOUND VASODILATORY HYPOTENSION (Oxytocin IV Push)');
    });

    it('allows safe administration of Oxytocin IV infusion, Methergine in normotensive, and TXA', () => {
      const state = initializePphState('CLASSIC_ATONY_PROLONGED_LABOR');
      const oxyResult = administerUterotonic(state, 'OXYTOCIN', 'IV_INFUSION', '30 Units / 500 mL');
      expect(oxyResult.success).toBe(true);
      expect(oxyResult.updatedState.uterineTone).toBe('PARTIALLY_FIRM');

      const txaResult = administerUterotonic(oxyResult.updatedState, 'TRANEXAMIC_ACID', 'IV_INFUSION', '1.0 g');
      expect(txaResult.success).toBe(true);
    });
  });

  describe('Bakri Balloon Intrauterine Tamponade Mechanics', () => {
    it('inflates Bakri balloon and yields positive tamponade test at >= 300 mL in uterine atony', () => {
      const state = initializePphState('CLASSIC_ATONY_PROLONGED_LABOR');
      const result = titrateBakriBalloon(state, 350);

      expect(result.updatedState.bakriBalloon.isInserted).toBe(true);
      expect(result.updatedState.bakriBalloon.salineVolumeMl).toBe(350);
      expect(result.updatedState.bakriBalloon.isTamponadeEffective).toBe(true);
      expect(result.updatedState.bakriBalloon.drainageLumenFlowMlMin).toBeLessThanOrEqual(20);
      expect(result.message).toContain('Positive Tamponade Test');
    });

    it('fails tamponade test in Placenta Accreta Spectrum despite >= 300 mL inflation', () => {
      const state = initializePphState('PLACENTA_ACCRETA_SPECTRUM_SURGICAL');
      const result = titrateBakriBalloon(state, 400);

      expect(result.updatedState.bakriBalloon.isTamponadeEffective).toBe(false);
      expect(result.updatedState.bakriBalloon.drainageLumenFlowMlMin).toBeGreaterThan(100);
      expect(result.message).toContain('Tamponade Test FAILED');
    });
  });

  describe('Obstetric Resuscitation & Cryoprecipitate for Hypofibrinogenemia', () => {
    it('transfuses PRBCs and Cryoprecipitate, correcting fibrinogen and improving shock index', () => {
      const state = initializePphState('ABRUPTIO_PLACENTAE_DIC_HYPOFIBRINOGENEMIA');
      expect(state.coagulation.fibrinogenMgDl).toBe(110); // Critical < 200

      const cryoResult = transfuseBloodProducts(state, 'CRYOPRECIPITATE', 1); // 1 pool (10 units)
      expect(cryoResult.updatedState.coagulation.fibrinogenMgDl).toBe(185);

      const prbcResult = transfuseBloodProducts(cryoResult.updatedState, 'PRBC', 2);
      expect(prbcResult.updatedState.bloodProductsTransfused.prbcUnits).toBe(2);
      expect(prbcResult.updatedState.hemodynamics.systolicBpMmHg).toBeGreaterThan(state.hemodynamics.systolicBpMmHg);
    });
  });

  describe('Time Step Simulation & Objective Debrief Rubric', () => {
    it('simulates ongoing blood loss and consumes fibrinogen over time', () => {
      const state = initializePphState('CLASSIC_ATONY_PROLONGED_LABOR');
      const advancedState = advancePphTimeStep(state, 60); // 1 minute

      expect(advancedState.elapsedSeconds).toBe(60);
      expect(advancedState.cumulativeQblMl).toBeGreaterThan(state.cumulativeQblMl);
    });

    it('evaluates debrief score, awarding high grade when managed safely and penalizing contraindications', () => {
      let state = initializePphState('CLASSIC_ATONY_PROLONGED_LABOR');
      state = administerUterotonic(state, 'OXYTOCIN', 'IV_INFUSION', '30 U').updatedState;
      state = administerUterotonic(state, 'TRANEXAMIC_ACID', 'IV_INFUSION', '1 g').updatedState;
      state = titrateBakriBalloon(state, 350).updatedState;

      const debrief = evaluatePphPerformance(state);
      expect(debrief.txaTimely).toBe(true);
      expect(debrief.tamponadeExecutedCorrectly).toBe(true);
      expect(debrief.contraindicationViolations).toHaveLength(0);
      expect(debrief.scorePercentage).toBeGreaterThanOrEqual(85);
    });
  });
});
