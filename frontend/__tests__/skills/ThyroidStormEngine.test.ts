import {
  calculateBwps,
  calculateAkamizu,
  evaluateIodineTiming,
  generatePharmacotherapyPlan,
  performThyroidStormEvaluation,
  THYROID_STORM_PRESETS,
  ThyroidStormPatientInput,
} from '../../.gemini/skills/ThyroidStormEngine';

describe('ThyroidStormEngine', () => {
  const baseInput: ThyroidStormPatientInput = {
    patientAgeYears: 30,
    patientWeightKg: 60,
    temperatureFahrenheit: 104.5,
    cnsDysfunction: 'SEVERE_COMA_SEIZURES',
    giHepaticDysfunction: 'SEVERE_JAUNDICE',
    heartRateBpm: 155,
    congestiveHeartFailure: 'SEVERE_PULMONARY_EDEMA',
    hasAtrialFibrillation: true,
    hasPrecipitatingHistory: true,
    freeT4NgDl: 7.2,
    totalT3NgDl: 490,
    tshUiuMl: 0.005,
    totalBilirubinMgDl: 4.2,
    selectedThionamide: 'PTU',
    isThionamideAdministered: true,
    minutesElapsedSinceThionamide: 90,
    isIodineAdministered: true,
    isStressDoseSteroidGiven: true,
    selectedBetaBlocker: 'PROPRANOLOL',
    isBetaBlockerAdministered: true,
    isCholestyramineGiven: true,
    isAspirinAdministered: false,
    hasSevereAsthmaOrCopd: false,
    leftVentricularEjectionFractionPercent: 55,
  };

  describe('calculateBwps', () => {
    it('calculates maximum BWPS score in severe thyroid storm (score >= 45)', () => {
      const res = calculateBwps(baseInput);
      expect(res.category).toBe('HIGHLY_SUGGESTIVE_THYROID_STORM');
      expect(res.totalScore).toBeGreaterThanOrEqual(45);
      expect(res.estimatedMortalityPercent).toBe(25);
    });

    it('identifies impending thyroid storm when score is 25-44', () => {
      const impendingInput: ThyroidStormPatientInput = {
        ...baseInput,
        temperatureFahrenheit: 100.5, // 10 pts
        cnsDysfunction: 'MILD_AGITATION', // 10 pts
        giHepaticDysfunction: 'NONE', // 0 pts
        heartRateBpm: 115, // 10 pts
        congestiveHeartFailure: 'NONE', // 0 pts
        hasAtrialFibrillation: false, // 0 pts
        hasPrecipitatingHistory: false, // 0 pts
      };
      const res = calculateBwps(impendingInput);
      expect(res.totalScore).toBe(30);
      expect(res.category).toBe('IMPENDING_THYROID_STORM');
      expect(res.estimatedMortalityPercent).toBe(10);
    });

    it('classifies low-scoring patient (<25) as storm unlikely', () => {
      const lowInput: ThyroidStormPatientInput = {
        ...baseInput,
        temperatureFahrenheit: 98.6,
        cnsDysfunction: 'NONE',
        giHepaticDysfunction: 'NONE',
        heartRateBpm: 88,
        congestiveHeartFailure: 'NONE',
        hasAtrialFibrillation: false,
        hasPrecipitatingHistory: false,
      };
      const res = calculateBwps(lowInput);
      expect(res.totalScore).toBe(0);
      expect(res.category).toBe('THYROTOXIC_STORM_UNLIKELY');
    });
  });

  describe('calculateAkamizu', () => {
    it('diagnoses TS1 Definite Thyroid Storm when CNS + other organ dysfunction are present', () => {
      const res = calculateAkamizu(baseInput);
      expect(res.category).toBe('TS1_DEFINITE_THYROID_STORM');
      expect(res.meetsFreeThyroidElevation).toBe(true);
      expect(res.cnsManifestationPresent).toBe(true);
    });

    it('classifies TS2 Suspected Thyroid Storm when CNS is present without non-CNS criteria', () => {
      const ts2Input: ThyroidStormPatientInput = {
        ...baseInput,
        temperatureFahrenheit: 98.6,
        heartRateBpm: 100,
        congestiveHeartFailure: 'NONE',
        giHepaticDysfunction: 'NONE',
        totalBilirubinMgDl: 1.0,
      };
      const res = calculateAkamizu(ts2Input);
      expect(res.category).toBe('TS2_SUSPECTED_THYROID_STORM');
    });
  });

  describe('evaluateIodineTiming', () => {
    it('flags CRITICAL hazard if iodine is given without thionamide', () => {
      const unblockedInput: ThyroidStormPatientInput = {
        ...baseInput,
        isThionamideAdministered: false,
        minutesElapsedSinceThionamide: 0,
      };
      const res = evaluateIodineTiming(unblockedInput);
      expect(res.isSafeToAdministerIodine).toBe(false);
      expect(res.timingWarning).toContain('THIONAMIDE NOT ADMINISTERED');
    });

    it('enforces 60-minute delay post-thionamide before iodine administration', () => {
      const prematureInput: ThyroidStormPatientInput = {
        ...baseInput,
        isThionamideAdministered: true,
        minutesElapsedSinceThionamide: 25,
      };
      const res = evaluateIodineTiming(prematureInput);
      expect(res.isSafeToAdministerIodine).toBe(false);
      expect(res.minutesRemainingUntilSafe).toBe(35);
      expect(res.timingWarning).toContain('Wait 35 more minutes');
    });

    it('confirms safe status once >= 60 minutes elapsed post-thionamide', () => {
      const safeInput: ThyroidStormPatientInput = {
        ...baseInput,
        isThionamideAdministered: true,
        minutesElapsedSinceThionamide: 65,
      };
      const res = evaluateIodineTiming(safeInput);
      expect(res.isSafeToAdministerIodine).toBe(true);
      expect(res.minutesRemainingUntilSafe).toBe(0);
      expect(res.timingWarning).toBeNull();
    });
  });

  describe('generatePharmacotherapyPlan & Antipyretic Safety', () => {
    it('flags lethal aspirin contraindication due to TBG displacement', () => {
      const aspirinInput: ThyroidStormPatientInput = {
        ...baseInput,
        isAspirinAdministered: true,
      };
      const plan = generatePharmacotherapyPlan(aspirinInput);
      expect(plan.antipyreticSafeguard.aspirinHazardDetected).toBe(true);
      expect(plan.antipyreticSafeguard.aspirinMechanismWarning).toContain('displaces T4 and T3 from Thyroxine-Binding Globulin');
    });

    it('recommends Acetaminophen and passive cooling for temperature control', () => {
      const plan = generatePharmacotherapyPlan(baseInput);
      expect(plan.antipyreticSafeguard.recommendedAntipyresis).toContain('Acetaminophen');
    });

    it('recommends PTU first-line for peripheral deiodinase blockade', () => {
      const plan = generatePharmacotherapyPlan(baseInput);
      expect(plan.thionamideRegimen.drug).toBe('PTU');
      expect(plan.thionamideRegimen.doseString).toContain('Propylthiouracil');
    });

    it('warns against Propranolol in patient with severe asthma', () => {
      const asthmaInput: ThyroidStormPatientInput = {
        ...baseInput,
        selectedBetaBlocker: 'PROPRANOLOL',
        hasSevereAsthmaOrCopd: true,
      };
      const plan = generatePharmacotherapyPlan(asthmaInput);
      expect(plan.betaBlockerRegimen.cautionNote).toContain('Non-selective beta-blockade');
    });
  });

  describe('performThyroidStormEvaluation & Presets', () => {
    it('executes cleanly on all presets in THYROID_STORM_PRESETS', () => {
      for (const preset of THYROID_STORM_PRESETS) {
        const out = performThyroidStormEvaluation(preset.inputs);
        expect(out.bwps.totalScore).toBeGreaterThanOrEqual(0);
        expect(out.immediateActionDirectives.length).toBeGreaterThanOrEqual(5);
        expect(out.clinicalPearls.length).toBeGreaterThanOrEqual(5);
      }
    });

    it('triggers critical safety interlocks for premature iodine and aspirin in Preset 2 and 3', () => {
      const outPreset2 = performThyroidStormEvaluation(THYROID_STORM_PRESETS[1].inputs);
      expect(outPreset2.safetyInterlocks.some((i) => i.includes('TIMING HAZARD'))).toBe(true);

      const outPreset3 = performThyroidStormEvaluation(THYROID_STORM_PRESETS[2].inputs);
      expect(outPreset3.safetyInterlocks.some((i) => i.includes('Aspirin administered'))).toBe(true);
    });
  });
});
