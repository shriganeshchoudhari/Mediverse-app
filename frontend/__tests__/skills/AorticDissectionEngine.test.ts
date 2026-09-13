import {
  calculateAntiImpulseDynamics,
  simulateAorticDissection,
  AORTIC_DISSECTION_PRESETS,
  AorticDissectionPatientParams
} from '../../.gemini/skills/AorticDissectionEngine';

describe('AorticDissectionEngine', () => {
  const basePatient: AorticDissectionPatientParams = {
    stanfordClass: 'STANFORD_TYPE_B_UNCOMPLICATED',
    aasSubtype: 'CLASSIC_AORTIC_DISSECTION',
    maximumAorticDiameterMm: 40,
    aorticGrowthMmPerYear: 1,
    falseLumenPatency: 'PATENT',
    heartRateBpm: 56,
    sbpMmHg: 115,
    dbpMmHg: 70,
    refractoryHypertension: false,
    refractorySeverePain: false,
    betaBlocker: 'ESMOLOL_INFUSION',
    vasodilator: 'NICARDIPINE_IV',
    vasodilatorStartedBeforeBetaBlocker: false,
    coronaryMalperfusionRcaStemi: false,
    cerebralMalperfusionStroke: false,
    mesentericMalperfusionIschemia: false,
    serumLactateMmolL: 1.2,
    renalMalperfusionAki: false,
    spinalCordMalperfusionParaplegia: false,
    lowerExtremityLimbPulseDeficit: false,
    retrogradeAorticRegurgitation: 'NONE',
    hemopericardiumTamponadePresent: false,
    surgicalIntervention: 'MEDICAL_MANAGEMENT_ONLY'
  };

  it('1. correctly computes anti-impulse dynamics and verifies target achievement (HR <= 60 and SBP 100-120)', () => {
    const dynamics = calculateAntiImpulseDynamics(basePatient);
    expect(dynamics.map).toBe(85);
    expect(dynamics.isAntiImpulseTargetAchieved).toBe(true);
    expect(dynamics.dpDt).toBeLessThan(1000);
  });

  it('2. detects The Vasodilator Catastrophe: starting vasodilators before beta-blockade spikes dP/dt and triggers critical alert', () => {
    const catastrophePatient: AorticDissectionPatientParams = {
      ...basePatient,
      heartRateBpm: 110,
      sbpMmHg: 160,
      betaBlocker: 'NONE',
      vasodilator: 'NICARDIPINE_IV',
      vasodilatorStartedBeforeBetaBlocker: true
    };
    const result = simulateAorticDissection(catastrophePatient);
    expect(result.hasVasodilatorCatastrophe).toBe(true);
    expect(result.criticalAlerts.some(a => a.includes('THE VASODILATOR CATASTROPHE'))).toBe(true);
    expect(result.estimatedDpDtMmHgPerSec).toBeGreaterThan(1800);
    expect(result.resuscitationSafetyScore).toBeLessThan(60);
  });

  it('3. flags Hydralazine as contraindicated in acute aortic syndromes due to reflex sympathetic surge', () => {
    const hydralazinePatient: AorticDissectionPatientParams = {
      ...basePatient,
      vasodilator: 'HYDRALAZINE_HAZARD'
    };
    const result = simulateAorticDissection(hydralazinePatient);
    expect(result.criticalAlerts.some(a => a.includes('HYDRALAZINE CONTRAINDICATION'))).toBe(true);
  });

  it('4. identifies Stanford Type A dissection as an emergent surgical indication and alerts if repair delayed', () => {
    const typeAPatient: AorticDissectionPatientParams = {
      ...basePatient,
      stanfordClass: 'STANFORD_TYPE_A',
      surgicalIntervention: 'MEDICAL_MANAGEMENT_ONLY'
    };
    const result = simulateAorticDissection(typeAPatient);
    expect(result.criticalAlerts.some(a => a.includes('LETHAL SURGICAL DELAY'))).toBe(true);
    expect(result.inHospitalMortalityRiskPercent).toBeGreaterThanOrEqual(50);
  });

  it('5. flags complete pericardiocentesis in Type A hemopericardium as a lethal blowout hazard', () => {
    const tamponadePatient: AorticDissectionPatientParams = {
      ...basePatient,
      stanfordClass: 'STANFORD_TYPE_A',
      hemopericardiumTamponadePresent: true,
      surgicalIntervention: 'PERICARDIOCENTESIS_COMPLETE_HAZARD'
    };
    const result = simulateAorticDissection(tamponadePatient);
    expect(result.criticalAlerts.some(a => a.includes('LETHAL PERICARDIOCENTESIS BLOWOUT'))).toBe(true);
    expect(result.inHospitalMortalityRiskPercent).toBeGreaterThanOrEqual(90);
    expect(result.resuscitationSafetyScore).toBeLessThan(50);
  });

  it('6. recognizes controlled micro-pericardiocentesis (10-20 mL) as temporizing rescue for arrest', () => {
    const rescuePatient: AorticDissectionPatientParams = {
      ...basePatient,
      stanfordClass: 'STANFORD_TYPE_A',
      hemopericardiumTamponadePresent: true,
      surgicalIntervention: 'CONTROLLED_MICRO_PERICARDIOCENTESIS'
    };
    const result = simulateAorticDissection(rescuePatient);
    expect(result.physiologicMechanisms.some(m => m.includes('Controlled micro-pericardiocentesis'))).toBe(true);
  });

  it('7. warns that RCA involvement mimics inferior STEMI and contraindicates thrombolysis', () => {
    const rcaStemiCase: AorticDissectionPatientParams = {
      ...basePatient,
      stanfordClass: 'STANFORD_TYPE_A',
      coronaryMalperfusionRcaStemi: true
    };
    const result = simulateAorticDissection(rcaStemiCase);
    expect(result.criticalAlerts.some(a => a.includes('CORONARY MALPERFUSION HAZARD'))).toBe(true);
  });

  it('8. recognizes Complicated Type B criteria (mesenteric, renal, limb malperfusion) and indicates TEVAR', () => {
    const complicatedB: AorticDissectionPatientParams = {
      ...basePatient,
      stanfordClass: 'STANFORD_TYPE_B_COMPLICATED',
      mesentericMalperfusionIschemia: true,
      serumLactateMmolL: 4.2,
      surgicalIntervention: 'TEVAR_ENDOVASCULAR_STENT'
    };
    const result = simulateAorticDissection(complicatedB);
    expect(result.physiologicMechanisms.some(m => m.includes('TEVAR'))).toBe(true);
    expect(result.malperfusionOrgansCount).toBeGreaterThanOrEqual(1);
  });

  it('9. simulates optimal medical anti-impulse therapy in Uncomplicated Type B', () => {
    const uncompResult = simulateAorticDissection(basePatient);
    expect(uncompResult.isAntiImpulseTargetAchieved).toBe(true);
    expect(uncompResult.inHospitalMortalityRiskPercent).toBeLessThan(10);
    expect(uncompResult.resuscitationSafetyScore).toBeGreaterThanOrEqual(80);
  });

  it('10. validates all 5 standard clinical presets across severity spectrum', () => {
    const presets = Object.values(AORTIC_DISSECTION_PRESETS);
    expect(presets.length).toBe(5);

    // Test stanfordTypeASurgicalEmergency
    const typeAResult = simulateAorticDissection(AORTIC_DISSECTION_PRESETS.stanfordTypeASurgicalEmergency);
    expect(typeAResult.isAntiImpulseTargetAchieved).toBe(true);
    expect(typeAResult.physiologicMechanisms.some(m => m.includes('Emergent open surgical repair'))).toBe(true);

    // Test vasodilatorCatastropheDisaster
    const disasterResult = simulateAorticDissection(AORTIC_DISSECTION_PRESETS.vasodilatorCatastropheDisaster);
    expect(disasterResult.hasVasodilatorCatastrophe).toBe(true);
    expect(disasterResult.clinicalStatusBadge.status).toBe('LETHAL_EMERGENCY');

    // Test complicatedTypeBMalperfusion
    const compBResult = simulateAorticDissection(AORTIC_DISSECTION_PRESETS.complicatedTypeBMalperfusion);
    expect(compBResult.malperfusionOrgansCount).toBeGreaterThanOrEqual(3);

    // Test uncomplicatedTypeBMedical
    const uncompBResult = simulateAorticDissection(AORTIC_DISSECTION_PRESETS.uncomplicatedTypeBMedical);
    expect(uncompBResult.inHospitalMortalityRiskPercent).toBeLessThan(10);

    // Test tamponadePericardiocentesisBlowout
    const blowoutResult = simulateAorticDissection(AORTIC_DISSECTION_PRESETS.tamponadePericardiocentesisBlowout);
    expect(blowoutResult.criticalAlerts.some(a => a.includes('LETHAL PERICARDIOCENTESIS BLOWOUT'))).toBe(true);
  });
});
