import {
  evaluateSevereFeatureCriteria,
  classifyHypertensiveDisorder,
  computeMagnesiumKinetics,
  evaluatePreeclampsiaWorkstation,
  PREECLAMPSIA_PRESETS,
} from '../../.gemini/skills/PreeclampsiaMgso4Engine';

describe('PreeclampsiaMgso4Engine', () => {
  it('identifies severe feature criteria accurately', () => {
    const severeVitals = {
      gestationalAgeWeeks: 34,
      systolicBpMmHg: 168,
      diastolicBpMmHg: 112,
      heartRateBpm: 84,
      respiratoryRateBpm: 16,
      oxygenSaturationPct: 98,
      urineOutputMlHr: 40,
      patellarReflexGrade: 3 as const,
      hasActiveSeizure: false,
      hasPersistentSevereHeadacheOrVisualChanges: true,
      hasSevereEpigastricOrRuqPain: false,
      hasPulmonaryEdema: false,
    };
    const severeLabs = {
      plateletCountPerUl: 85000,
      serumCreatinineMgDl: 1.3,
      astUperL: 82,
      altUperL: 75,
      ldhUperL: 450,
      urineProteinToCreatinineRatio: 0.9,
      twentyFourHourUrineProteinMg: 1200,
    };

    const { hasSevere, criteria } = evaluateSevereFeatureCriteria(severeVitals, severeLabs);
    expect(hasSevere).toBe(true);
    expect(criteria.length).toBeGreaterThanOrEqual(4);
    expect(criteria.some((c) => c.includes('Severe Blood Pressure'))).toBe(true);
    expect(criteria.some((c) => c.includes('Thrombocytopenia'))).toBe(true);
    expect(criteria.some((c) => c.includes('Renal Insufficiency'))).toBe(true);
  });

  it('classifies Eclampsia when active seizure is present', () => {
    const eclampsiaPreset = PREECLAMPSIA_PRESETS[1]; // ACTIVE_ECLAMPTIC_SEIZURE_ACUTE
    const classification = classifyHypertensiveDisorder(
      eclampsiaPreset.vitals,
      eclampsiaPreset.labs
    );
    expect(classification).toBe('ECLAMPSIA');
  });

  it('classifies HELLP Syndrome based on hemolysis, elevated liver enzymes, and low platelets', () => {
    const hellpPreset = PREECLAMPSIA_PRESETS[3]; // HELLP_SYNDROME_THROMBOCYTOPENIA
    const classification = classifyHypertensiveDisorder(
      hellpPreset.vitals,
      hellpPreset.labs
    );
    expect(classification).toBe('HELLP_SYNDROME');
  });

  it('computes therapeutic vs toxic magnesium levels and oliguric accumulation', () => {
    // Normal therapeutic Zuspan: 4g load + 2g/hr for 2h with normal UO (45 mL/hr)
    const normalKinetics = computeMagnesiumKinetics(
      {
        loadingDoseGrams: 4,
        maintenanceRateGramsHr: 2,
        calciumGluconateAdministered: false,
        calciumDoseGrams: 1.0,
        infusionHoursElapsed: 2,
        antihypertensiveSelected: 'NONE',
        antihypertensiveDoseGiven: 'None',
      },
      45,
      0.8
    );
    expect(normalKinetics.estimatedMgMgDl).toBeGreaterThanOrEqual(4.8);
    expect(normalKinetics.estimatedMgMgDl).toBeLessThanOrEqual(8.4);
    expect(normalKinetics.stage).toBe('THERAPEUTIC');
    expect(normalKinetics.isToxic).toBe(false);

    // Toxic kinetics: 8 hours infusion in oliguric renal failure (UO 12 mL/hr, Cr 2.1)
    const toxicKinetics = computeMagnesiumKinetics(
      {
        loadingDoseGrams: 4,
        maintenanceRateGramsHr: 2,
        calciumGluconateAdministered: false,
        calciumDoseGrams: 1.0,
        infusionHoursElapsed: 8,
        antihypertensiveSelected: 'NONE',
        antihypertensiveDoseGiven: 'None',
      },
      12,
      2.1
    );
    expect(toxicKinetics.estimatedMgMgDl).toBeGreaterThan(12.0);
    expect(toxicKinetics.stage).toBe('RESPIRATORY_DEPRESSION');
    expect(toxicKinetics.isToxic).toBe(true);
  });

  it('demonstrates Calcium Gluconate reversal of magnesium toxicity', () => {
    const reversedKinetics = computeMagnesiumKinetics(
      {
        loadingDoseGrams: 4,
        maintenanceRateGramsHr: 2,
        calciumGluconateAdministered: true, // Antidote given
        calciumDoseGrams: 1.0,
        infusionHoursElapsed: 8,
        antihypertensiveSelected: 'NONE',
        antihypertensiveDoseGiven: 'None',
      },
      12,
      2.1
    );
    expect(reversedKinetics.isToxic).toBe(false);
  });

  it('evaluates full workstation recommendations for severe preeclampsia and eclampsia', () => {
    const eclampticPreset = PREECLAMPSIA_PRESETS[1];
    const evalResult = evaluatePreeclampsiaWorkstation(
      eclampticPreset.vitals,
      eclampticPreset.labs,
      eclampticPreset.regimen
    );

    expect(evalResult.classification).toBe('ECLAMPSIA');
    expect(evalResult.mgso4IndicationRecommendation).toMatch(/CRITICAL ECLAMPSIA SEIZURE PROTOCOL/i);
    expect(evalResult.mgso4IndicationRecommendation).toMatch(/6 g IV loading dose/i);
    expect(evalResult.antihypertensiveRecommendation).toMatch(/EMERGENT ANTIHYPERTENSIVE/i);
    expect(evalResult.deliveryTimingRecommendation).toMatch(/EMERGENT DELIVERY INDICATED/i);
    expect(evalResult.clinicalSafetyAlerts.length).toBeGreaterThan(0);
  });

  it('mandates Calcium Gluconate when respiratory depression toxicity is detected', () => {
    const toxicPreset = PREECLAMPSIA_PRESETS[2]; // MAGNESIUM_TOXICITY_RESPIRATORY_ARREST
    const evalResult = evaluatePreeclampsiaWorkstation(
      toxicPreset.vitals,
      toxicPreset.labs,
      toxicPreset.regimen
    );

    expect(evalResult.isMagnesiumToxic).toBe(true);
    expect(evalResult.emergencyActionRequired).toMatch(/MAGNESIUM TOXICITY DETECTED/i);
    expect(evalResult.emergencyActionRequired).toMatch(/10% Calcium Gluconate 1 g/i);
  });
});
