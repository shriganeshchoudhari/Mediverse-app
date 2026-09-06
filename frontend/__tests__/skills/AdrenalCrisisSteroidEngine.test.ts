import {
  calculateSteroidEquivalency,
  evaluateCosyntropinTest,
  getRequiredStressDoseHydrocortisoneMg,
  simulateAdrenalCrisisResuscitation,
  PatientAdrenalParameters,
  AdrenalEmergencyTreatmentPlan,
} from '../../.gemini/skills/AdrenalCrisisSteroidEngine';

describe('AdrenalCrisisSteroidEngine Unit Tests', () => {
  it('correctly calculates steroid equivalencies and potencies', () => {
    // 20 mg Hydrocortisone == 5 mg Prednisone == 0.75 mg Dexamethasone
    const predEq = calculateSteroidEquivalency('HYDROCORTISONE', 20, 'PREDNISONE');
    expect(predEq.equivalentTargetDoseMg).toBe(5);

    const dexaEq = calculateSteroidEquivalency('HYDROCORTISONE', 20, 'DEXAMETHASONE');
    expect(dexaEq.equivalentTargetDoseMg).toBe(0.75);

    const fludroEq = calculateSteroidEquivalency('FLUDROCORTISONE', 0.1, 'HYDROCORTISONE');
    expect(fludroEq.mineralocorticoidEquivalentHydrocortisoneMg).toBeGreaterThan(20);
  });

  it('evaluates cosyntropin stimulation test and flags assay interference', () => {
    const primaryTest = evaluateCosyntropinTest(3.2, 'PRIMARY_ADDISONS_AUTOIMMUNE', 'NONE');
    expect(primaryTest.passedStimulationTest).toBe(false);
    expect(primaryTest.cortisolAt60MinMcgDl).toBeLessThan(18.0);
    expect(primaryTest.interpretation).toContain('Adrenal Insufficiency Confirmed');

    // Dexamethasone does not cross-react
    const dexaTest = evaluateCosyntropinTest(4.0, 'PRIMARY_ADDISONS_AUTOIMMUNE', 'DEXAMETHASONE');
    expect(dexaTest.interpretation).not.toContain('INVALID TEST');

    // Hydrocortisone cross-reacts
    const hcTest = evaluateCosyntropinTest(4.0, 'PRIMARY_ADDISONS_AUTOIMMUNE', 'HYDROCORTISONE');
    expect(hcTest.interpretation).toContain('INVALID TEST');
  });

  it('determines stress-dose hydrocortisone requirements across stress tiers', () => {
    const basal = getRequiredStressDoseHydrocortisoneMg('BASAL_PHYSIOLOGIC');
    expect(basal.requiredDailyHydrocortisoneMg).toBe(20);
    expect(basal.fludrocortisoneRequired).toBe(true);

    const major = getRequiredStressDoseHydrocortisoneMg('MAJOR_SURGICAL_OR_SEPTIC_SHOCK');
    expect(major.requiredDailyHydrocortisoneMg).toBe(200);
    expect(major.fludrocortisoneRequired).toBe(false);
  });

  it('simulates acute adrenal crisis resuscitation and flags under-resuscitation', () => {
    const crisisPatient: PatientAdrenalParameters = {
      pathology: 'PRIMARY_ADDISONS_AUTOIMMUNE',
      stressLevel: 'MAJOR_SURGICAL_OR_SEPTIC_SHOCK',
      systolicBpMmHg: 76,
      diastolicBpMmHg: 44,
      heartRateBpm: 124,
      serumSodiumMeqL: 124,
      serumPotassiumMeqL: 6.4,
      serumGlucoseMgDl: 54,
      baselineSerumCortisolMcgDl: 2.1,
      plasmaActhPgMl: 340,
    };

    // Sub-therapeutic treatment
    const badTreatment: AdrenalEmergencyTreatmentPlan = {
      ivBolusHydrocortisoneMg: 25,
      continuousInfusionHydrocortisoneMgDay: 50,
      dexamethasoneUsedAsInitialBolus: false,
      isotonicSalineLitersFirst24Hours: 1.0,
      dextroseGivenForHypoglycemia: false,
      fludrocortisoneDoseMgDaily: 0,
    };

    const badOutcome = simulateAdrenalCrisisResuscitation(crisisPatient, badTreatment);
    expect(badOutcome.crisisAvertedOrControlled).toBe(false);
    expect(badOutcome.clinicalSafetyAlerts.some(a => a.includes('UNDER-RESUSCITATION'))).toBe(true);
    expect(badOutcome.clinicalSafetyAlerts.some(a => a.includes('HYPOGLYCEMIA UNCORRECTED'))).toBe(true);

    // Guideline-adherent treatment
    const goodTreatment: AdrenalEmergencyTreatmentPlan = {
      ivBolusHydrocortisoneMg: 100,
      continuousInfusionHydrocortisoneMgDay: 200,
      dexamethasoneUsedAsInitialBolus: false,
      isotonicSalineLitersFirst24Hours: 3.0,
      dextroseGivenForHypoglycemia: true,
      fludrocortisoneDoseMgDaily: 0,
    };

    const goodOutcome = simulateAdrenalCrisisResuscitation(crisisPatient, goodTreatment);
    expect(goodOutcome.crisisAvertedOrControlled).toBe(true);
    expect(goodOutcome.predicted24HrSystolicBp).toBeGreaterThanOrEqual(95);
    expect(goodOutcome.mineralocorticoidReplacedSufficiently).toBe(true);
  });
});
