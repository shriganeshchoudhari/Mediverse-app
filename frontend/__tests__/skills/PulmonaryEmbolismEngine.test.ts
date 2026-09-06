import {
  calculateSpesiScore,
  evaluateRvStrain,
  evaluateMyocardialInjury,
  evaluateHemodynamicInstability,
  classifyPeRisk,
  evaluatePulmonaryEmbolismWorkstation,
  PE_PRESETS,
} from '../../.gemini/skills/PulmonaryEmbolismEngine';

describe('PulmonaryEmbolismEngine', () => {
  it('calculates sPESI score and prognostic risk class accurately', () => {
    // Low risk: 45 yo, no cancer/lung disease, HR 88, BP 120, SpO2 97% -> Score 0
    const lowRisk = calculateSpesiScore(
      {
        systolicBpMmHg: 120,
        diastolicBpMmHg: 80,
        heartRateBpm: 88,
        respiratoryRateBpm: 16,
        oxygenSaturationPct: 97,
        requiresVasopressors: false,
        hasCardiacArrestOrPea: false,
        systolicBpBelow90DurationMinutes: 0,
      },
      {
        ageYears: 45,
        isMale: true,
        hasActiveCancer: false,
        hasChronicCardiopulmonaryDisease: false,
        hasAlteredMentalStatus: false,
        temperatureCelsius: 36.8,
        hasMajorBleedingContraindicationToTpa: false,
      }
    );
    expect(lowRisk.score).toBe(0);
    expect(lowRisk.riskClass).toBe('LOW_RISK');
    expect(lowRisk.mortalityPct).toBe(1.0);

    // High risk: 82 yo (+1), cancer (+1), HR 115 (+1), SBP 95 (+1) -> Score 4
    const highRisk = calculateSpesiScore(
      {
        systolicBpMmHg: 95,
        diastolicBpMmHg: 60,
        heartRateBpm: 115,
        respiratoryRateBpm: 24,
        oxygenSaturationPct: 88, // SpO2 < 90 (+1) -> total 5
        requiresVasopressors: false,
        hasCardiacArrestOrPea: false,
        systolicBpBelow90DurationMinutes: 0,
      },
      {
        ageYears: 82,
        isMale: false,
        hasActiveCancer: true,
        hasChronicCardiopulmonaryDisease: false,
        hasAlteredMentalStatus: false,
        temperatureCelsius: 36.5,
        hasMajorBleedingContraindicationToTpa: false,
      }
    );
    expect(highRisk.score).toBe(5);
    expect(highRisk.riskClass).toBe('HIGH_RISK');
    expect(highRisk.mortalityPct).toBeGreaterThan(15);
  });

  it('evaluates RV strain and myocardial injury criteria correctly', () => {
    const normalStrain = {
      rvToLvDiameterRatio: 0.7,
      tapseMm: 22,
      hasMcConnellSign: false,
      hasParadoxicalSeptalShiftDsign: false,
      troponinIngMl: 0.01,
      bnpPgMl: 45,
    };
    expect(evaluateRvStrain(normalStrain)).toBe(false);
    expect(evaluateMyocardialInjury(normalStrain)).toBe(false);

    const severeStrain = {
      rvToLvDiameterRatio: 1.4,
      tapseMm: 12,
      hasMcConnellSign: true,
      hasParadoxicalSeptalShiftDsign: true,
      troponinIngMl: 0.35,
      bnpPgMl: 780,
    };
    expect(evaluateRvStrain(severeStrain)).toBe(true);
    expect(evaluateMyocardialInjury(severeStrain)).toBe(true);
  });

  it('classifies High-Risk Massive PE in cardiogenic shock', () => {
    const massivePreset = PE_PRESETS[0]; // MASSIVE_PE_CARDIOGENIC_SHOCK
    expect(evaluateHemodynamicInstability(massivePreset.hemo)).toBe(true);

    const classification = classifyPeRisk(
      massivePreset.hemo,
      massivePreset.strain,
      'HIGH_RISK'
    );
    expect(classification).toBe('HIGH_RISK_MASSIVE');
  });

  it('classifies Intermediate-High Risk when both RV strain and biomarkers are positive', () => {
    const submassivePreset = PE_PRESETS[1]; // SUBMASSIVE_INTERMEDIATE_HIGH_RISK_EKOS
    expect(evaluateHemodynamicInstability(submassivePreset.hemo)).toBe(false);

    const classification = classifyPeRisk(
      submassivePreset.hemo,
      submassivePreset.strain,
      'HIGH_RISK'
    );
    expect(classification).toBe('INTERMEDIATE_HIGH_RISK');
  });

  it('evaluates systemic thrombolysis recommendations for massive PE', () => {
    const massivePreset = PE_PRESETS[0];
    const evalResult = evaluatePulmonaryEmbolismWorkstation(
      massivePreset.hemo,
      massivePreset.history,
      massivePreset.strain,
      massivePreset.plan
    );

    expect(evalResult.riskCategory).toBe('HIGH_RISK_MASSIVE');
    expect(evalResult.recommendedReperfusionStrategy).toMatch(/Alteplase 100 mg IV over 2 hours/i);
    expect(evalResult.anticoagulationRecommendation).toMatch(/Unfractionated Heparin/i);
    expect(evalResult.tpaDosingProtocol).toMatch(/100 mg IV infusion/i);
  });

  it('recommends Mechanical Thrombectomy when systemic thrombolysis is contraindicated', () => {
    const postOpPreset = PE_PRESETS[2]; // MASSIVE_PE_POST_OPERATIVE_CONTRAINDICATED
    const evalResult = evaluatePulmonaryEmbolismWorkstation(
      postOpPreset.hemo,
      postOpPreset.history,
      postOpPreset.strain,
      postOpPreset.plan
    );

    expect(evalResult.riskCategory).toBe('HIGH_RISK_MASSIVE');
    expect(evalResult.recommendedReperfusionStrategy).toMatch(/Percutaneous Mechanical Thrombectomy/i);
    expect(evalResult.contraindicationWarning).toMatch(/ABSOLUTE CONTRAINDICATION/i);
  });

  it('recommends Catheter-Directed Thrombolysis (EKOS) in Intermediate-High Risk PE', () => {
    const ekosPreset = PE_PRESETS[1];
    const evalResult = evaluatePulmonaryEmbolismWorkstation(
      ekosPreset.hemo,
      ekosPreset.history,
      ekosPreset.strain,
      ekosPreset.plan
    );

    expect(evalResult.riskCategory).toBe('INTERMEDIATE_HIGH_RISK');
    expect(evalResult.recommendedReperfusionStrategy).toMatch(/Catheter-Directed Thrombolysis \(EKOS/i);
    expect(evalResult.tpaDosingProtocol).toMatch(/Ultrasound-Accelerated Thrombolysis/i);
  });
});
