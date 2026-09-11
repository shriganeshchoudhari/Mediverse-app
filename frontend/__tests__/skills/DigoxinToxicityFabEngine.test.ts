import {
  evaluateDigoxinCase,
  DIGOXIN_PRESETS,
} from '../../.gemini/skills/DigoxinToxicityFabEngine';

describe('DigoxinToxicityFabEngine', () => {
  it('calculates acute known dose stoichiometry (10 mg ingested = 16 vials) and flags hyperkalemia mortality', () => {
    // 10 mg * 0.8 / 0.5 = 16 vials
    const acuteCase = evaluateDigoxinCase({
      toxicityType: 'ACUTE_INGESTION',
      patientWeightKg: 70,
      serumDigoxinNgMl: 8.5,
      serumPotassiumMeqL: 6.4,
      ingestedDoseMg: 10.0,
      estimatedGfrMlMin: 90,
      arrhythmia: 'BIDIRECTIONAL_VENTRICULAR_TACHYCARDIA',
      cardiacArrestOrHemodynamicCollapse: false,
      fabAdministeredVials: 0,
    });

    expect(acuteCase.isToxicityConfirmed).toBe(true);
    expect(acuteCase.dosingCalculationMethod).toBe('ACUTE_KNOWN_DOSE');
    expect(acuteCase.requiredFabVialsExact).toBe(16);
    expect(acuteCase.recommendedFabVialsRounded).toBe(16);
    expect(acuteCase.hyperkalemiaMortalityRiskPercent).toBeGreaterThan(80);
    expect(acuteCase.clinicalActionChecklist.some((a) => /CRITICAL HYPERKALEMIA/i.test(a))).toBe(true);
  });

  it('calculates chronic toxicity SDC formula: SDC * weight / 100', () => {
    // SDC = 4.2, Weight = 55 kg -> 4.2 * 55 / 100 = 2.31 -> rounded up to 3 vials
    const chronicCase = evaluateDigoxinCase({
      toxicityType: 'CHRONIC_ACCUMULATION',
      patientWeightKg: 55,
      serumDigoxinNgMl: 4.2,
      serumPotassiumMeqL: 4.8,
      ingestedDoseMg: 0,
      estimatedGfrMlMin: 18,
      arrhythmia: 'BIDIRECTIONAL_VENTRICULAR_TACHYCARDIA',
      cardiacArrestOrHemodynamicCollapse: false,
      fabAdministeredVials: 0,
    });

    expect(chronicCase.dosingCalculationMethod).toBe('STEADY_STATE_SDC');
    expect(chronicCase.requiredFabVialsExact).toBe(2.3);
    expect(chronicCase.recommendedFabVialsRounded).toBe(3);
    expect(chronicCase.totalFabDoseMg).toBe(3 * 38);
    expect(chronicCase.calciumAdministrationStrictlyContraindicated).toBe(true);
  });

  it('mandates 20 vials empiric in cardiac arrest and warns against calcium administration', () => {
    const arrestCase = evaluateDigoxinCase({
      toxicityType: 'ACUTE_INGESTION',
      patientWeightKg: 80,
      serumDigoxinNgMl: 12.0,
      serumPotassiumMeqL: 6.8,
      ingestedDoseMg: 0,
      estimatedGfrMlMin: 60,
      arrhythmia: 'VENTRICULAR_FIBRILLATION_ASYSTOLE',
      cardiacArrestOrHemodynamicCollapse: true,
      fabAdministeredVials: 0,
    });

    expect(arrestCase.dosingCalculationMethod).toBe('EMPIRIC_EMERGENCY_CODE');
    expect(arrestCase.recommendedFabVialsRounded).toBe(20);
    expect(arrestCase.clinicalActionChecklist.some((a) => /Stone Heart/i.test(a))).toBe(true);
  });

  it('recognizes therapeutic digitalis level with Salvador Dali scooped ST depression', () => {
    const therapeuticCase = evaluateDigoxinCase({
      toxicityType: 'CHRONIC_ACCUMULATION',
      patientWeightKg: 75,
      serumDigoxinNgMl: 0.8,
      serumPotassiumMeqL: 4.2,
      ingestedDoseMg: 0,
      estimatedGfrMlMin: 75,
      arrhythmia: 'NORMAL_SINUS_DIG_EFFECT',
      cardiacArrestOrHemodynamicCollapse: false,
      fabAdministeredVials: 0,
    });

    expect(therapeuticCase.isToxicityConfirmed).toBe(false);
    expect(therapeuticCase.recommendedFabVialsRounded).toBe(0);
    expect(therapeuticCase.salvadorDaliScoopedSt).toBe(true);
    expect(therapeuticCase.clinicalActionChecklist.some((a) => /Salvador Dali/i.test(a))).toBe(true);
  });

  it('calculates post-Fab free digoxin reduction and issues assay interference warning', () => {
    const postFabCase = evaluateDigoxinCase({
      toxicityType: 'ACUTE_INGESTION',
      patientWeightKg: 70,
      serumDigoxinNgMl: 6.0,
      serumPotassiumMeqL: 5.2,
      ingestedDoseMg: 6.0,
      estimatedGfrMlMin: 80,
      arrhythmia: 'JUNCTIONAL_TACHYCARDIA_WITH_AV_DISSOCIATION',
      cardiacArrestOrHemodynamicCollapse: false,
      fabAdministeredVials: 5,
    });

    expect(postFabCase.postFabTotalDigoxinAssayInterferenceWarning).toBe(true);
    expect(postFabCase.postFabFreeDigoxinEstimatedNgMl).toBeLessThan(6.0);
    expect(postFabCase.clinicalActionChecklist.some((a) => /POST-FAB LAB WARNING/i.test(a))).toBe(true);
  });
});
