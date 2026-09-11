import {
  determineStatusPhase,
  computeFirstLineBzd,
  computeSecondLineAsm,
  calculateReceptorTraffickingKinetics,
  evaluatePhase3Anesthetic,
  evaluateSalzburgNcseCriteria,
  performStatusEpilepticusEvaluation,
  STATUS_PRESETS,
} from '../../.gemini/skills/StatusEpilepticusEngine';

describe('StatusEpilepticusEngine', () => {
  describe('determineStatusPhase', () => {
    it('correctly stratifies SE phases based on time and treatment response', () => {
      expect(determineStatusPhase(3, 'CONVULSIVE_GCSE', 0, false, 0)).toBe('PRE_STATUS_IMMINENT');
      expect(determineStatusPhase(7, 'CONVULSIVE_GCSE', 0, false, 0)).toBe('PHASE_1_EARLY_SE');
      expect(determineStatusPhase(15, 'CONVULSIVE_GCSE', 1, false, 0)).toBe('PHASE_2_ESTABLISHED_SE');
      expect(determineStatusPhase(35, 'CONVULSIVE_GCSE', 2, true, 0)).toBe('PHASE_3_REFRACTORY_SE');
      expect(determineStatusPhase(120, 'CONVULSIVE_GCSE', 2, true, 26)).toBe('SUPER_REFRACTORY_SE');
    });
  });

  describe('computeFirstLineBzd', () => {
    it('recommends IV Lorazepam when IV access is established', () => {
      const rec = computeFirstLineBzd(70, true);
      expect(rec.agent).toBe('LORAZEPAM_IV');
      expect(rec.recommendedDoseMg).toBe(4.0);
      expect(rec.route).toContain('Intravenous');
      expect(rec.isUnderdosed).toBe(false);
    });

    it('recommends IM Midazolam 10 mg when IV access is absent for adult', () => {
      const rec = computeFirstLineBzd(65, false);
      expect(rec.agent).toBe('MIDAZOLAM_IM');
      expect(rec.recommendedDoseMg).toBe(10.0);
      expect(rec.route).toContain('Intramuscular');
    });

    it('triggers underdosing alert when subtherapeutic dose administered', () => {
      const rec = computeFirstLineBzd(80, true, 'LORAZEPAM_IV', 2.0);
      expect(rec.isUnderdosed).toBe(true);
      expect(rec.underdosedWarning).toContain('SUBTHERAPEUTIC');
      expect(rec.underdosedWarning).toContain('Underdosing benzodiazepines is the #1 preventable driver');
    });
  });

  describe('computeSecondLineAsm', () => {
    it('calculates weight-based Levetiracetam up to 4500 mg max', () => {
      const rec70 = computeSecondLineAsm(70, 'LEVETIRACETAM_IV');
      expect(rec70.recommendedDoseMg).toBe(4200);
      expect(rec70.maxSingleDoseMg).toBe(4500);
      expect(rec70.infusionTimeMinutes).toBe(10);
      expect(rec70.isContraindicated).toBe(false);

      const rec100 = computeSecondLineAsm(100, 'LEVETIRACETAM_IV');
      expect(rec100.recommendedDoseMg).toBe(4500); // capped at 4500 mg
    });

    it('flags Fosphenytoin contraindication in heart block', () => {
      const rec = computeSecondLineAsm(70, 'FOSPHENYTOIN_IV', false, true);
      expect(rec.recommendedDoseMg).toBe(1400); // 20 mg PE/kg
      expect(rec.isContraindicated).toBe(true);
      expect(rec.contraindicationsDetected.length).toBeGreaterThanOrEqual(1);
      expect(rec.contraindicationsDetected[0]).toContain('AV block');
    });

    it('flags Valproate contraindications in liver/mitochondrial disease and pregnancy', () => {
      const recMito = computeSecondLineAsm(70, 'VALPROATE_SODIUM_IV', true, false, false);
      expect(recMito.isContraindicated).toBe(true);
      expect(recMito.contraindicationsDetected[0]).toContain('mitochondrial disorder');

      const recPreg = computeSecondLineAsm(70, 'VALPROATE_SODIUM_IV', false, false, true);
      expect(recPreg.isContraindicated).toBe(true);
      expect(recPreg.contraindicationsDetected[0]).toContain('Pregnancy');
    });
  });

  describe('calculateReceptorTraffickingKinetics', () => {
    it('models GABA_A endocytosis and NMDA upregulation over time', () => {
      const t0 = calculateReceptorTraffickingKinetics(0);
      expect(t0.synapticGabaAReceptorDensityPercent).toBe(100);
      expect(t0.synapticNmdaReceptorDensityPercent).toBe(100);

      const t15 = calculateReceptorTraffickingKinetics(15);
      expect(t15.synapticGabaAReceptorDensityPercent).toBeLessThan(60);
      expect(t15.synapticNmdaReceptorDensityPercent).toBeGreaterThan(130);

      const t45 = calculateReceptorTraffickingKinetics(45);
      expect(t45.synapticGabaAReceptorDensityPercent).toBeLessThan(25);
      expect(t45.synapticNmdaReceptorDensityPercent).toBeGreaterThan(200);
      expect(t45.relativeKetamineSynergyScore).toBeGreaterThanOrEqual(2.0);
    });
  });

  describe('evaluatePhase3Anesthetic', () => {
    it('triggers critical PRIS alert for high propofol dose or prolonged duration', () => {
      const safeProp = evaluatePhase3Anesthetic('PHASE_3_REFRACTORY_SE', 'PROPOFOL', 3.5, 12, 65);
      expect(safeProp.isPrisRiskHigh).toBe(false);

      const highDoseProp = evaluatePhase3Anesthetic('PHASE_3_REFRACTORY_SE', 'PROPOFOL', 5.5, 12, 65);
      expect(highDoseProp.isPrisRiskHigh).toBe(true);
      expect(highDoseProp.prisWarning).toContain('PRIS ALERT');

      const prolongedProp = evaluatePhase3Anesthetic('PHASE_3_REFRACTORY_SE', 'PROPOFOL', 3.5, 52, 65);
      expect(prolongedProp.isPrisRiskHigh).toBe(true);
    });

    it('evaluates burst suppression adequacy accurately', () => {
      const lowBsr = evaluatePhase3Anesthetic('PHASE_3_REFRACTORY_SE', 'PROPOFOL', 4.0, 10, 35);
      expect(lowBsr.currentBurstSuppressionAdequacy).toBe('SUB_THERAPEUTIC');

      const targetBsr = evaluatePhase3Anesthetic('PHASE_3_REFRACTORY_SE', 'PROPOFOL', 4.0, 10, 65);
      expect(targetBsr.currentBurstSuppressionAdequacy).toBe('ON_TARGET');

      const highBsr = evaluatePhase3Anesthetic('PHASE_3_REFRACTORY_SE', 'PROPOFOL', 4.0, 10, 92);
      expect(highBsr.currentBurstSuppressionAdequacy).toBe('EXCESSIVE_SUPPRESSION');
    });
  });

  describe('evaluateSalzburgNcseCriteria', () => {
    it('confirms definite NCSE when epileptiform discharges exceed 2.5 Hz', () => {
      const evalDef = evaluateSalzburgNcseCriteria('NON_CONVULSIVE_NCSE', 2.9, false, false);
      expect(evalDef.isCriteriaMet).toBe(true);
      expect(evalDef.diagnosticConfidence).toBe('DEFINITE_NCSE');
    });

    it('confirms definite NCSE when <= 2.5 Hz with spatiotemporal evolution', () => {
      const evalEvol = evaluateSalzburgNcseCriteria('NON_CONVULSIVE_NCSE', 1.8, true, false);
      expect(evalEvol.isCriteriaMet).toBe(true);
      expect(evalEvol.diagnosticConfidence).toBe('DEFINITE_NCSE');
    });

    it('identifies possible NCSE when <= 2.5 Hz without evolution or IV response', () => {
      const evalPoss = evaluateSalzburgNcseCriteria('NON_CONVULSIVE_NCSE', 1.8, false, false);
      expect(evalPoss.isCriteriaMet).toBe(false);
      expect(evalPoss.diagnosticConfidence).toBe('POSSIBLE_NCSE');
      expect(evalPoss.clinicalManagementAdvice).toContain('IV fast-acting ASM challenge');
    });
  });

  describe('performStatusEpilepticusEvaluation and Presets', () => {
    it('evaluates all clinical presets consistently', () => {
      STATUS_PRESETS.forEach((preset) => {
        const result = performStatusEpilepticusEvaluation(preset.inputs);
        expect(result.statusPhase).toBeDefined();
        expect(result.phaseLabel).toBeDefined();
        expect(result.firstLineBzd).toBeDefined();
        expect(result.secondLineAsm).toBeDefined();
        expect(result.receptorTrafficking).toBeDefined();
        expect(result.urgentActionChecklist.length).toBeGreaterThan(0);
        expect(result.clinicalPearls.length).toBeGreaterThan(0);
      });
    });

    it('correctly flags t2 irreversible injury threshold past 30 min in convulsive GCSE', () => {
      const result45 = performStatusEpilepticusEvaluation({
        patientAgeYears: 40,
        patientWeightKg: 70,
        seizureDurationMinutes: 45,
        seizureType: 'CONVULSIVE_GCSE',
        hasIvAccess: true,
        priorEpilepsyHistory: true,
        knownMitochondrialDisorderOrLiverDisease: false,
        hasSinusBradycardiaOrHeartBlock: false,
        isPregnant: false,
        numberOfBenzodiazepineDosesGiven: 2,
        secondLineInfusionComplete: true,
        isMechanicallyVentilated: true,
        continuousEegActive: true,
        eegDischargeFrequencyHz: 2.0,
        eegHasSpatiotemporalEvolution: false,
        eegHasResponseToIvTrial: false,
      });

      expect(result45.isPastT2Threshold).toBe(true);
      expect(result45.timeToT2DamageThresholdMinutes).toBe(0);
      expect(result45.statusPhase).toBe('PHASE_3_REFRACTORY_SE');
    });
  });
});
