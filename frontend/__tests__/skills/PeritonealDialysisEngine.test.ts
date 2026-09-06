import {
  evaluatePeritonealDialysis,
  calculateWatsonTbw,
  calculateBsa,
  correctDialysateCreatinine,
  classifyPetTransport,
  evaluateUltrafiltrationFailure,
  PD_CLINICAL_PRESETS,
} from '../../.gemini/skills/PeritonealDialysisEngine';

describe('PeritonealDialysisEngine', () => {
  it('calculates Watson TBW and Mosteller BSA accurately', () => {
    // Male: 50yo, 175cm, 75kg
    const maleV = calculateWatsonTbw(50, 'MALE', 175, 75);
    expect(maleV).toBeGreaterThan(38);
    expect(maleV).toBeLessThan(45);

    // Female: 50yo, 160cm, 60kg
    const femaleV = calculateWatsonTbw(50, 'FEMALE', 160, 60);
    expect(femaleV).toBeGreaterThan(26);
    expect(femaleV).toBeLessThan(33);

    const bsa = calculateBsa(175, 75);
    expect(bsa).toBeCloseTo(1.91, 1);
  });

  it('corrects dialysate creatinine for glucose interference in Jaffe assay', () => {
    const measuredCr = 6.0;
    const measuredGlu = 2000; // mg/dL
    const corrected = correctDialysateCreatinine(measuredCr, measuredGlu, 'JAFFE_CORRECTED');
    // 6.0 - (0.0005 * 2000) = 6.0 - 1.0 = 5.0
    expect(corrected).toBeCloseTo(5.0, 2);

    // Enzymatic assay does not subtract
    const enzymatic = correctDialysateCreatinine(measuredCr, measuredGlu, 'ENZYMATIC_DIRECT');
    expect(enzymatic).toBe(6.0);
  });

  it('classifies PET transport categories according to Twardowski standards', () => {
    expect(classifyPetTransport(0.86, 0.22)).toBe('HIGH_TRANSPORTER');
    expect(classifyPetTransport(0.72, 0.35)).toBe('HIGH_AVERAGE_TRANSPORTER');
    expect(classifyPetTransport(0.58, 0.42)).toBe('LOW_AVERAGE_TRANSPORTER');
    expect(classifyPetTransport(0.44, 0.55)).toBe('LOW_TRANSPORTER');
  });

  it('evaluates normal high-average transporter with optimal Kt/V on CAPD', () => {
    const normal = PD_CLINICAL_PRESETS[0];
    const result = evaluatePeritonealDialysis(
      normal.patient,
      normal.pet,
      normal.rx,
      normal.renal,
      normal.peritonitis
    );

    expect(result.petTransportCategory).toBe('HIGH_AVERAGE_TRANSPORTER');
    expect(result.hasIntactAquaporins).toBe(true);
    expect(result.sodiumDipMmolL).toBeGreaterThanOrEqual(5);
    expect(result.hasUltrafiltrationFailure).toBe(false);
    expect(result.totalWeeklyKtV).toBeGreaterThanOrEqual(1.7);
    expect(result.adequacyStatus).toBe('OPTIMAL');
    expect(result.peritonitisCriteriaMet).toBe(false);
  });

  it('identifies Type I Ultrafiltration Failure in high transporter', () => {
    const type1 = PD_CLINICAL_PRESETS[1];
    const result = evaluatePeritonealDialysis(
      type1.patient,
      type1.pet,
      type1.rx,
      type1.renal,
      type1.peritonitis
    );

    expect(result.petTransportCategory).toBe('HIGH_TRANSPORTER');
    expect(result.hasUltrafiltrationFailure).toBe(true);
    expect(result.uffClassification).toBe('TYPE_I_HYPERPERMEABILITY');
    expect(result.recommendedModality).toBe('APD_CCPD');
    expect(result.modalityRationale).toContain('Icodextrin');
  });

  it('identifies Aquaporin-1 defect (Type II UFF) with lost sodium sieving', () => {
    const aop1 = PD_CLINICAL_PRESETS[2];
    const result = evaluatePeritonealDialysis(
      aop1.patient,
      aop1.pet,
      aop1.rx,
      aop1.renal,
      aop1.peritonitis
    );

    expect(result.hasIntactAquaporins).toBe(false);
    expect(result.sodiumDipMmolL).toBeLessThan(5);
    expect(result.hasUltrafiltrationFailure).toBe(true);
    expect(result.uffClassification).toBe('TYPE_II_AQUAPORIN_DEFECT');
  });

  it('identifies membrane sclerosis / EPS precursor (Type III UFF)', () => {
    const eps = PD_CLINICAL_PRESETS[3];
    const result = evaluatePeritonealDialysis(
      eps.patient,
      eps.pet,
      eps.rx,
      eps.renal,
      eps.peritonitis
    );

    expect(result.petTransportCategory).toBe('LOW_TRANSPORTER');
    expect(result.hasUltrafiltrationFailure).toBe(true);
    expect(result.uffClassification).toBe('TYPE_III_MEMBRANE_SCLEROSIS');
  });

  it('diagnoses ISPD 2022 Peritonitis and generates empiric antibiotic regimen', () => {
    const peritonitis = PD_CLINICAL_PRESETS[4];
    const result = evaluatePeritonealDialysis(
      peritonitis.patient,
      peritonitis.pet,
      peritonitis.rx,
      peritonitis.renal,
      peritonitis.peritonitis
    );

    expect(result.peritonitisCriteriaMet).toBe(true);
    expect(result.peritonitisSeverity).toBe('CONFIRMED_PERITONITIS');
    expect(result.recommendedAntibiotics.length).toBeGreaterThanOrEqual(2);
    expect(result.recommendedAntibiotics[0]).toContain('Cefazolin');
    expect(result.recommendedAntibiotics[1]).toContain('Ceftazidime');
  });

  it('flags fungal peritonitis as absolute indication for catheter removal', () => {
    const base = PD_CLINICAL_PRESETS[0];
    const fungalPeritonitis = {
      hasAbdominalPain: true,
      isEffluentCloudy: true,
      effluentWbcPerMicroL: 3200,
      neutrophilPercent: 88,
      dwellDurationHours: 4,
      cultureGramStain: 'FUNGAL' as const,
    };

    const result = evaluatePeritonealDialysis(
      base.patient,
      base.pet,
      base.rx,
      base.renal,
      fungalPeritonitis
    );

    expect(result.catheterRemovalIndicated).toBe(true);
    expect(result.catheterRemovalReason).toContain('Fungal Peritonitis');
  });

  it('flags inadequate weekly Kt/V when total clearance is below 1.70', () => {
    const anuric = PD_CLINICAL_PRESETS[5];
    const result = evaluatePeritonealDialysis(
      anuric.patient,
      anuric.pet,
      anuric.rx,
      anuric.renal,
      anuric.peritonitis
    );

    expect(result.totalWeeklyKtV).toBeLessThan(1.7);
    expect(['MARGINAL', 'INADEQUATE']).toContain(result.adequacyStatus);
    expect(result.clinicalAlerts.some((a) => a.includes('Kt/V'))).toBe(true);
  });
});
