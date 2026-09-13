import {
  determinePeRiskStratification,
  calculateHemodynamicIndices,
  checkLyticContraindications,
  simulateMassivePulmonaryEmbolism,
  MASSIVE_PE_PRESETS,
  MassivePePatientParams
} from '../../.gemini/skills/MassivePulmonaryEmbolismEngine';

describe('MassivePulmonaryEmbolismEngine', () => {
  const basePatient: MassivePePatientParams = {
    sbpMmHg: 120,
    dbpMmHg: 80,
    heartRateBpm: 75,
    respiratoryRateBpm: 16,
    spO2Percent: 98,
    rvLvDiameterRatio: 0.7,
    tapseMm: 22,
    mcConnellSignPresent: false,
    sixtySixtySignPresent: false,
    interventricularSeptalFlattening: false,
    ivcDiameterMm: 15,
    ivcInspiratoryCollapsePercent: 60,
    cardiacTroponinElevated: false,
    bnpElevated: false,
    serumLactateMmolL: 1.1,
    arterialPh: 7.40,
    ivFluidAdministeredMl: 0,
    vasopressor: 'NONE',
    inotrope: 'NONE',
    inhaledVasodilator: 'NONE',
    reperfusion: 'ANTICOAGULATION_ONLY',
    priorHemorrhagicStroke: false,
    ischemicStrokeWithin3Months: false,
    activeInternalBleeding: false,
    recentMajorSurgeryOrTraumaWithin3Weeks: false,
    intracranialNeoplasm: false
  };

  it('1. correctly identifies Low-Risk PE when normotensive with no RV strain or biomarker elevation', () => {
    const risk = determinePeRiskStratification(basePatient);
    expect(risk).toBe('LOW_RISK');
  });

  it('2. classifies High-Risk Massive PE when sustained hypotension (SBP < 90) or shock index >= 1.0', () => {
    const hypotensivePatient: MassivePePatientParams = {
      ...basePatient,
      sbpMmHg: 82,
      dbpMmHg: 50,
      heartRateBpm: 110,
      rvLvDiameterRatio: 1.3,
      tapseMm: 13,
      cardiacTroponinElevated: true
    };
    const risk = determinePeRiskStratification(hypotensivePatient);
    expect(risk).toBe('HIGH_RISK_MASSIVE');
  });

  it('3. classifies Intermediate-High Submassive PE when normotensive with BOTH RV strain AND elevated biomarkers', () => {
    const submassivePatient: MassivePePatientParams = {
      ...basePatient,
      sbpMmHg: 118,
      dbpMmHg: 76,
      heartRateBpm: 95,
      rvLvDiameterRatio: 1.25,
      tapseMm: 14,
      mcConnellSignPresent: true,
      cardiacTroponinElevated: true,
      bnpElevated: true
    };
    const risk = determinePeRiskStratification(submassivePatient);
    expect(risk).toBe('INTERMEDIATE_HIGH_SUBMASSIVE');
  });

  it('4. classifies Intermediate-Low when only RV strain OR biomarker elevation is present, but not both', () => {
    const strainOnly: MassivePePatientParams = {
      ...basePatient,
      sbpMmHg: 125,
      rvLvDiameterRatio: 1.1,
      tapseMm: 15,
      cardiacTroponinElevated: false,
      bnpElevated: false
    };
    expect(determinePeRiskStratification(strainOnly)).toBe('INTERMEDIATE_LOW');

    const biomarkerOnly: MassivePePatientParams = {
      ...basePatient,
      sbpMmHg: 125,
      rvLvDiameterRatio: 0.7,
      tapseMm: 20,
      cardiacTroponinElevated: true,
      bnpElevated: false
    };
    expect(determinePeRiskStratification(biomarkerOnly)).toBe('INTERMEDIATE_LOW');
  });

  it('5. computes hemodynamic indices, IVC-derived CVP, and RCA perfusion pressure gradient', () => {
    const params: MassivePePatientParams = {
      ...basePatient,
      sbpMmHg: 90,
      dbpMmHg: 60,
      heartRateBpm: 120,
      ivcDiameterMm: 26,
      ivcInspiratoryCollapsePercent: 10
    };
    const { map, shockIndex, estimatedCvp, rcaPerfusionPressure } = calculateHemodynamicIndices(params);
    expect(map).toBe(70); // (90 + 120)/3 = 70
    expect(shockIndex).toBe(1.33); // 120 / 90 = 1.33
    expect(estimatedCvp).toBe(18); // plethoric IVC with non-collapse
    expect(rcaPerfusionPressure).toBe(42); // 60 - 18 = 42
  });

  it('6. simulates the RV Volume Overload Disaster: excessive fluid (> 500 mL) penalizes cardiac index and triggers critical alerts', () => {
    const fluidOverloaded: MassivePePatientParams = {
      ...basePatient,
      sbpMmHg: 85,
      dbpMmHg: 55,
      rvLvDiameterRatio: 1.4,
      tapseMm: 12,
      interventricularSeptalFlattening: true,
      ivFluidAdministeredMl: 2000
    };
    const result = simulateMassivePulmonaryEmbolism(fluidOverloaded);
    expect(result.criticalAlerts.some(a => a.includes('RV VOLUME OVERLOAD DISASTER'))).toBe(true);
    expect(result.rvWallStressIndex).toBeGreaterThan(60);
    expect(result.resuscitationSafetyScore).toBeLessThan(70);
  });

  it('7. detects lethal vasopressor selection: Phenylephrine spikes PVR without inotropic support', () => {
    const phenylephrineCase: MassivePePatientParams = {
      ...basePatient,
      sbpMmHg: 80,
      vasopressor: 'PHENYLEPHRINE_HAZARD'
    };
    const result = simulateMassivePulmonaryEmbolism(phenylephrineCase);
    expect(result.criticalAlerts.some(a => a.includes('LETHAL VASOPRESSOR SELECTION'))).toBe(true);
    expect(result.resuscitationSafetyScore).toBeLessThan(70);
  });

  it('8. recommends Norepinephrine as 1st-line vasopressor to restore aortic root pressure and RCA perfusion', () => {
    const norepinephrineCase: MassivePePatientParams = {
      ...basePatient,
      sbpMmHg: 84,
      dbpMmHg: 52,
      vasopressor: 'NOREPINEPHRINE'
    };
    const result = simulateMassivePulmonaryEmbolism(norepinephrineCase);
    expect(result.physiologicMechanisms.some(m => m.includes('Norepinephrine is the vasopressor of choice'))).toBe(true);
  });

  it('9. identifies absolute contraindications to systemic thrombolysis and elevates bleeding risk', () => {
    const postOpCase: MassivePePatientParams = {
      ...basePatient,
      sbpMmHg: 85,
      recentMajorSurgeryOrTraumaWithin3Weeks: true,
      reperfusion: 'FULL_DOSE_SYSTEMIC_TPA_100MG'
    };
    expect(checkLyticContraindications(postOpCase)).toBe(true);
    const result = simulateMassivePulmonaryEmbolism(postOpCase);
    expect(result.hasAbsoluteLyticContraindication).toBe(true);
    expect(result.criticalAlerts.some(a => a.includes('CATASTROPHIC CONTRAINDICATION'))).toBe(true);
    expect(result.majorBleedingRiskPercent).toBeGreaterThanOrEqual(20);
  });

  it('10. validates all 5 standard clinical presets across severity spectrum', () => {
    const presets = Object.values(MASSIVE_PE_PRESETS);
    expect(presets.length).toBe(5);

    // Test massiveShock
    const shockResult = simulateMassivePulmonaryEmbolism(MASSIVE_PE_PRESETS.massiveShock);
    expect(shockResult.riskCategory).toBe('HIGH_RISK_MASSIVE');
    expect(shockResult.resuscitationSafetyScore).toBeGreaterThan(60);

    // Test fluidOverloadDisaster
    const fluidDisasterResult = simulateMassivePulmonaryEmbolism(MASSIVE_PE_PRESETS.fluidOverloadDisaster);
    expect(fluidDisasterResult.criticalAlerts.length).toBeGreaterThan(1);
    expect(fluidDisasterResult.resuscitationSafetyScore).toBeLessThan(30);

    // Test submassiveIntermediateHigh
    const subResult = simulateMassivePulmonaryEmbolism(MASSIVE_PE_PRESETS.submassiveIntermediateHigh);
    expect(subResult.riskCategory).toBe('INTERMEDIATE_HIGH_SUBMASSIVE');

    // Test postOpHighBleedRisk
    const postOpResult = simulateMassivePulmonaryEmbolism(MASSIVE_PE_PRESETS.postOpHighBleedRisk);
    expect(postOpResult.hasAbsoluteLyticContraindication).toBe(true);
    expect(postOpResult.physiologicMechanisms.some(m => m.includes('Mechanical Aspiration'))).toBe(true);

    // Test cardiacArrestPeaCrash
    const crashResult = simulateMassivePulmonaryEmbolism(MASSIVE_PE_PRESETS.cardiacArrestPeaCrash);
    expect(crashResult.rvDeathSpiralStage).toBe('PEA_CARDIAC_ARREST');
    expect(crashResult.clinicalStatusBadge.status).toBe('LETHAL_EMERGENCY');
  });
});
