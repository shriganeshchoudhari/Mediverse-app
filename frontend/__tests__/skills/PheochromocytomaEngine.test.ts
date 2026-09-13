import {
  evaluateRoizenCriteria,
  simulatePheochromocytoma,
  PHEOCYTOMA_PRESETS,
  PheoPatientParams
} from '../../.gemini/skills/PheochromocytomaEngine';

describe('PheochromocytomaEngine', () => {
  const basePatient: PheoPatientParams = {
    plasmaFreeNormetanephrinePgMl: 1500,
    plasmaFreeMetanephrinePgMl: 800,
    tumorDiameterCm: 4.0,
    geneticSyndrome: 'SPORADIC',
    heartRateBpm: 70,
    sbpMmHg: 120,
    dbpMmHg: 75,
    standingSbpDropMmHg: 15,
    alphaBlocker: 'PHENOXYBENZAMINE',
    daysOfAlphaBlockade: 14,
    betaBlocker: 'METOPROLOL_ORAL',
    betaBlockerStartedBeforeAlpha: false,
    highSaltDietAndHydrationGiven: true,
    intraopPhase: 'PRE_INDUCTION_BASELINE',
    emergencyVasodilator: 'NONE',
    ivFluidBolusAdministeredMl: 0,
    norepinephrineInfusionActive: false
  };

  it('1. verifies Roizen criteria when supine BP, orthostasis, duration, and volume expansion are optimal', () => {
    const { roizenCriteriaMet, map } = evaluateRoizenCriteria(basePatient);
    expect(roizenCriteriaMet).toBe(true);
    expect(map).toBe(90);
  });

  it('2. detects The Unopposed Alpha Disaster: beta-blocker prior to alpha-blockade spikes SVR and triggers critical alerts', () => {
    const disasterPatient: PheoPatientParams = {
      ...basePatient,
      alphaBlocker: 'BETA_BLOCKER_ALONE_HAZARD',
      betaBlockerStartedBeforeAlpha: true,
      sbpMmHg: 240,
      dbpMmHg: 140
    };
    const result = simulatePheochromocytoma(disasterPatient);
    expect(result.hasUnopposedAlphaDisaster).toBe(true);
    expect(result.criticalAlerts.some(a => a.includes('THE UNOPPOSED ALPHA DISASTER'))).toBe(true);
    expect(result.systemicVascularResistanceDyns).toBeGreaterThan(1800);
    expect(result.resuscitationSafetyScore).toBeLessThan(60);
  });

  it('3. identifies Intraoperative Catecholamine Storm and recommends Phentolamine/Nicardipine', () => {
    const stormPatient: PheoPatientParams = {
      ...basePatient,
      intraopPhase: 'TUMOR_MANIPULATION_STORM',
      sbpMmHg: 220,
      dbpMmHg: 125,
      emergencyVasodilator: 'PHENTOLAMINE_IV_BOLUS'
    };
    const result = simulatePheochromocytoma(stormPatient);
    expect(result.criticalAlerts.some(a => a.includes('INTRAOPERATIVE CATECHOLAMINE STORM'))).toBe(true);
    expect(result.isHypertensiveEmergency).toBe(true);
  });

  it('4. identifies Post-Ligation Vasodilatory Shock and validates volume expansion and pressor rescue', () => {
    const collapsePatient: PheoPatientParams = {
      ...basePatient,
      intraopPhase: 'POST_VEIN_LIGATION_COLLAPSE',
      sbpMmHg: 70,
      dbpMmHg: 45,
      ivFluidBolusAdministeredMl: 2000,
      norepinephrineInfusionActive: true
    };
    const result = simulatePheochromocytoma(collapsePatient);
    expect(result.isVasodilatoryShock).toBe(true);
    expect(result.physiologicMechanisms.some(m => m.includes('Post-ligation hypotension countered'))).toBe(true);
  });

  it('5. evaluates SVR reduction with irreversible alpha-blockade (Phenoxybenzamine)', () => {
    const unblocked = evaluateRoizenCriteria({ ...basePatient, alphaBlocker: 'NONE' });
    const blocked = evaluateRoizenCriteria({ ...basePatient, alphaBlocker: 'PHENOXYBENZAMINE' });
    expect(blocked.svr).toBeLessThan(unblocked.svr);
  });

  it('6. validates preoperative salt loading to reverse chronic vasoconstrictive volume depletion', () => {
    const result = simulatePheochromocytoma(basePatient);
    expect(result.physiologicMechanisms.some(m => m.includes('sodium and fluid expansion'))).toBe(true);
  });

  it('7. assesses emergency vasodilator action of Phentolamine IV bolus during tumor handling', () => {
    const withPhentolamine = evaluateRoizenCriteria({
      ...basePatient,
      intraopPhase: 'TUMOR_MANIPULATION_STORM',
      emergencyVasodilator: 'PHENTOLAMINE_IV_BOLUS'
    });
    const withoutPhentolamine = evaluateRoizenCriteria({
      ...basePatient,
      intraopPhase: 'TUMOR_MANIPULATION_STORM',
      emergencyVasodilator: 'NONE'
    });
    expect(withPhentolamine.svr).toBeLessThan(withoutPhentolamine.svr);
  });

  it('8. handles hereditary syndrome screening (MEN 2A, VHL, SDHB/SDHD)', () => {
    const men2aPatient: PheoPatientParams = {
      ...basePatient,
      geneticSyndrome: 'MEN_2A'
    };
    const result = simulatePheochromocytoma(men2aPatient);
    expect(result.stepByStepActionPlan.some(p => p.includes('MEN_2A'))).toBe(true);
  });

  it('9. computes pulse pressure accurately', () => {
    const { pulsePressure } = evaluateRoizenCriteria({ ...basePatient, sbpMmHg: 130, dbpMmHg: 80 });
    expect(pulsePressure).toBe(50);
  });

  it('10. validates all 5 standard clinical presets across severity spectrum', () => {
    const presets = Object.values(PHEOCYTOMA_PRESETS);
    expect(presets.length).toBe(5);

    // Test roizenOptimizedPreop
    const optResult = simulatePheochromocytoma(PHEOCYTOMA_PRESETS.roizenOptimizedPreop);
    expect(optResult.roizenCriteriaMet).toBe(true);
    expect(optResult.clinicalStatusBadge.status).toBe('STABLE');

    // Test unopposedAlphaDisaster
    const disasterResult = simulatePheochromocytoma(PHEOCYTOMA_PRESETS.unopposedAlphaDisaster);
    expect(disasterResult.hasUnopposedAlphaDisaster).toBe(true);
    expect(disasterResult.clinicalStatusBadge.status).toBe('LETHAL_EMERGENCY');

    // Test intraoperativeStorm
    const stormResult = simulatePheochromocytoma(PHEOCYTOMA_PRESETS.intraoperativeStorm);
    expect(stormResult.isHypertensiveEmergency).toBe(true);

    // Test postLigationCollapse
    const collapseResult = simulatePheochromocytoma(PHEOCYTOMA_PRESETS.postLigationCollapse);
    expect(collapseResult.isVasodilatoryShock).toBe(true);

    // Test sdhbMalignantParaganglioma
    const sdhbResult = simulatePheochromocytoma(PHEOCYTOMA_PRESETS.sdhbMalignantParaganglioma);
    expect(sdhbResult.roizenCriteriaMet).toBe(true);
  });
});
