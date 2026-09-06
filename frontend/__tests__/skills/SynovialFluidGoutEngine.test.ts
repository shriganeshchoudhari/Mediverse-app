import {
  categorizeSynovialFluid,
  evaluateCrystalMicroscopy,
  calculateAcrEularGoutScore,
  formulateGoutTherapyPlan,
  SynovialFluidAnalysisInput,
  AcrEularGoutCriteriaInput,
} from '../../.gemini/skills/SynovialFluidGoutEngine';

describe('SynovialFluidGoutEngine Tests', () => {
  it('correctly categorizes arthrocentesis fluid and flags septic arthritis', () => {
    const septicFluid: SynovialFluidAnalysisInput = {
      volumeMl: 15,
      clarity: 'OPAQUE_PURULENT',
      color: 'Greenish-yellow',
      wbcCountPerMm3: 88000,
      neutrophilPercent: 94,
      rbcCountPerMm3: 4000,
      glucoseMgDl: 32,
      serumGlucoseMgDl: 110,
      viscosityStringCm: 1.0,
      gramStainPositive: true,
      bacterialCulturePositive: true,
      crystalIdentified: 'NONE',
    };

    const result = categorizeSynovialFluid(septicFluid);
    expect(result.category).toBe('SEPTIC_OR_EXTREME_INFLAMMATORY');
    expect(result.isSepticSuspicionHigh).toBe(true);
    expect(result.glucoseRatio).toBe(0.29);
    expect(result.differentialDiagnoses[0]).toContain('Septic Arthritis');
  });

  it('accurately models compensated polarized light microscopy (CPLM) for MSU vs CPPD', () => {
    // MSU: strongly negative birefringence -> Yellow parallel to slow axis (45 deg)
    const msuParallel = evaluateCrystalMicroscopy('MONOSODIUM_URATE', 45, true);
    expect(msuParallel.birefringenceType).toBe('STRONGLY_NEGATIVE');
    expect(msuParallel.colorParallelToSlowAxis).toBe('VIVID_YELLOW');
    expect(msuParallel.observedColorAtAngle).toBe('#eab308'); // yellow

    // MSU: Blue perpendicular to slow axis (45 + 90 = 135 deg)
    const msuPerpendicular = evaluateCrystalMicroscopy('MONOSODIUM_URATE', 135, true);
    expect(msuPerpendicular.observedColorAtAngle).toBe('#3b82f6'); // blue

    // CPPD: weakly positive birefringence -> Blue parallel to slow axis (45 deg)
    const cppdParallel = evaluateCrystalMicroscopy('CALCIUM_PYROPHOSPHATE', 45, true);
    expect(cppdParallel.birefringenceType).toBe('WEAKLY_POSITIVE');
    expect(cppdParallel.colorParallelToSlowAxis).toBe('PALE_BLUE');
    expect(cppdParallel.observedColorAtAngle).toBe('#38bdf8'); // sky blue

    // CPPD: Yellow perpendicular (135 deg)
    const cppdPerpendicular = evaluateCrystalMicroscopy('CALCIUM_PYROPHOSPHATE', 135, true);
    expect(cppdPerpendicular.observedColorAtAngle).toBe('#fde047'); // pale yellow
  });

  it('evaluates 2015 ACR/EULAR Gout Classification criteria and triggers Sufficient Criterion', () => {
    // Sufficient Criterion test: MSU positive in joint fluid
    const sufficientCriteria: AcrEularGoutCriteriaInput = {
      symptomPattern: 'FIRST_MTP_PODAGRA',
      characteristicEpisodesCount: 3,
      timeCourseTypical: true,
      clinicalTophusPresent: true,
      serumUrateMgDl: 9.4,
      msuCrystalInSynovialFluid: true,
      imagingUrateDeposition: true,
      imagingErosion: true,
    };

    const sufficientResult = calculateAcrEularGoutScore(sufficientCriteria);
    expect(sufficientResult.isSufficientCriterionMet).toBe(true);
    expect(sufficientResult.probabilityOfGout).toBe('DEFINITIVE_GOUT');

    // Clinical score test when joint not aspirated
    const clinicalCriteria: AcrEularGoutCriteriaInput = {
      symptomPattern: 'FIRST_MTP_PODAGRA', // 3 pts
      characteristicEpisodesCount: 3, // 3 pts
      timeCourseTypical: true, // 2 pts
      clinicalTophusPresent: false, // 0 pts
      serumUrateMgDl: 8.8, // 3 pts
      msuCrystalInSynovialFluid: null, // 0 pts
      imagingUrateDeposition: true, // 4 pts
      imagingErosion: false, // 0 pts
    };

    const clinicalResult = calculateAcrEularGoutScore(clinicalCriteria);
    expect(clinicalResult.isSufficientCriterionMet).toBe(false);
    expect(clinicalResult.totalScore).toBe(15);
    expect(clinicalResult.thresholdMet).toBe(true);
    expect(clinicalResult.probabilityOfGout).toBe('VERY_HIGH');
  });

  it('formulates precision pharmacotherapy adhering to renal function and HLA-B*5801 alerts', () => {
    // Severe renal impairment patient with HLA-B*5801 positive
    const renalFailurePatient = {
      eGfrMlMin: 22,
      hasActivePepticUlcer: true,
      hasSevereHeartFailure: false,
      isTakingStrongCyp3a4OrPgpInhibitor: false,
      hlaB5801Positive: true,
    };

    const plan = formulateGoutTherapyPlan(9.6, true, renalFailurePatient);

    // NSAIDs contraindicated (eGFR < 45 + peptic ulcer)
    expect(plan.acuteContraindications.some((c) => c.includes('NSAIDs contraindicated'))).toBe(true);
    // Prednisone selected as safe acute option
    expect(plan.acuteAgent).toBe('SYSTEMIC_PREDNISONE');
    // HLA-B*5801 strictly contraindicated for Allopurinol -> Febuxostat
    expect(plan.ultDrug).toBe('FEBUXOSTAT');
    expect(plan.safetyAlerts.some((a) => a.includes('HLA-B*5801 Positive'))).toBe(true);
    // Target urate for tophi is < 5.0 mg/dL
    expect(plan.ultTargetSerumUrateMgDl).toBe(5.0);
  });
});
