import {
  classifyHeadachePhenotype,
  simulateHeadacheWorkstation,
  HEADACHE_PRESETS,
  HeadachePatientParams,
} from '../../.gemini/skills/StatusMigrainosusCSFLeakEngine';

describe('StatusMigrainosusCSFLeakEngine', () => {
  const baseParams: HeadachePatientParams = {
    attackDurationHours: 80,
    postureResponse: 'NO_POSTURAL_VARIATION',
    triptanTakenWithin24h: false,
    csfOpeningPressureMmH2O: 150,
    mriBrain: 'NORMAL',
    cranialNervePalsy: 'NONE',
    medicationAdministered: 'DOPAMINE_ANTAGONIST_KETOROLAC',
    interventionSelected: 'CONSERVATIVE_FLUIDS_CAFFEINE',
    bloodPatchVolumeMl: 0,
    acetazolamideGiven: false,
  };

  it('1. classifies refractory status migrainosus when non-postural with normal CSF pressure', () => {
    const classification = classifyHeadachePhenotype(baseParams);
    expect(classification.phenotype).toBe('STATUS_MIGRAINOSUS_REFRACTORY');

    const result = simulateHeadacheWorkstation(baseParams);
    expect(result.phenotype).toBe('STATUS_MIGRAINOSUS_REFRACTORY');
    expect(result.monroKellieCompliance).toBe('BALANCED');
  });

  it('2. classifies spontaneous intracranial hypotension when headache is worse upright', () => {
    const params: HeadachePatientParams = {
      ...baseParams,
      postureResponse: 'WORSE_UPRIGHT_RELIEVED_SUPINE',
      csfOpeningPressureMmH2O: 40,
    };
    const classification = classifyHeadachePhenotype(params);
    expect(classification.phenotype).toBe('INTRACRANIAL_HYPOTENSION_CSF_LEAK');
  });

  it('3. identifies compensatory venous engorgement and brain sagging on MRI', () => {
    const params: HeadachePatientParams = {
      ...baseParams,
      postureResponse: 'WORSE_UPRIGHT_RELIEVED_SUPINE',
      csfOpeningPressureMmH2O: 30,
      mriBrain: 'PACHYMENINGEAL_ENHANCEMENT_BRAIN_SAG',
    };
    const result = simulateHeadacheWorkstation(params);
    expect(result.monroKellieCompliance).toBe('COMPENSATORY_VENOUS_ENGORGEMENT');
    expect(result.contraindicationFlags.epiduralPatchMandated).toBe(true);
  });

  it('4. classifies rebound intracranial hypertension post-EBP with high opening pressure', () => {
    const params: HeadachePatientParams = {
      ...baseParams,
      postureResponse: 'WORSE_SUPINE_RELIEVED_UPRIGHT',
      csfOpeningPressureMmH2O: 290,
      interventionSelected: 'AUTOLOGOUS_EPIDURAL_BLOOD_PATCH',
      bloodPatchVolumeMl: 25,
      acetazolamideGiven: true,
    };
    const classification = classifyHeadachePhenotype(params);
    expect(classification.phenotype).toBe('REBOUND_INTRACRANIAL_HYPERTENSION_POST_EBP');

    const result = simulateHeadacheWorkstation(params);
    expect(result.monroKellieCompliance).toBe('REBOUND_HIGH_PRESSURE');
  });

  it('5. triggers lethal vasospasm alert when DHE is administered within 24h of a triptan', () => {
    const params: HeadachePatientParams = {
      ...baseParams,
      triptanTakenWithin24h: true,
      medicationAdministered: 'DHE_PROTOCOL',
    };
    const result = simulateHeadacheWorkstation(params);
    expect(result.dheTriptanVasospasmHazard).toBe(true);
    expect(result.contraindicationFlags.vasospasmCatastropheActive).toBe(true);
    expect(result.criticalAlerts.some((a) => a.includes('LETHAL VASOSPASM CATASTROPHE'))).toBe(true);
    expect(result.treatmentSafetyScore).toBeLessThanOrEqual(50);
  });

  it('6. triggers surgical evacuation disaster alert when burr hole is attempted for SIH subdurals', () => {
    const params: HeadachePatientParams = {
      ...baseParams,
      postureResponse: 'WORSE_UPRIGHT_RELIEVED_SUPINE',
      csfOpeningPressureMmH2O: 30,
      mriBrain: 'SUBDURAL_HEMATOMA_HYGROMA',
      interventionSelected: 'BURR_HOLE_DRAINAGE_HAZARD',
    };
    const result = simulateHeadacheWorkstation(params);
    expect(result.subduralBurrHoleHazard).toBe(true);
    expect(result.contraindicationFlags.subduralEvacuationContraindicated).toBe(true);
    expect(result.criticalAlerts.some((a) => a.includes('SURGICAL EVACUATION DISASTER'))).toBe(true);
  });

  it('7. triggers diagnostic trap alert when repeated LP is performed in CSF leak', () => {
    const params: HeadachePatientParams = {
      ...baseParams,
      postureResponse: 'WORSE_UPRIGHT_RELIEVED_SUPINE',
      csfOpeningPressureMmH2O: 35,
      interventionSelected: 'REPEATED_DIAGNOSTIC_LP_HAZARD',
    };
    const result = simulateHeadacheWorkstation(params);
    expect(result.repeatLpHazard).toBe(true);
    expect(result.contraindicationFlags.repeatLpContraindicated).toBe(true);
    expect(result.criticalAlerts.some((a) => a.includes('DIAGNOSTIC PRACTICE TRAP'))).toBe(true);
  });

  it('8. triggers misdiagnosis pitfall alert when DHE is given to a CSF leak patient', () => {
    const params: HeadachePatientParams = {
      ...baseParams,
      postureResponse: 'WORSE_UPRIGHT_RELIEVED_SUPINE',
      csfOpeningPressureMmH2O: 40,
      medicationAdministered: 'DHE_PROTOCOL',
    };
    const result = simulateHeadacheWorkstation(params);
    expect(result.criticalAlerts.some((a) => a.includes('MISDIAGNOSIS PITFALL'))).toBe(true);
  });

  it('9. tracks CN VI traction diplopia mechanism in severe brain sagging', () => {
    const params: HeadachePatientParams = {
      ...baseParams,
      postureResponse: 'WORSE_UPRIGHT_RELIEVED_SUPINE',
      cranialNervePalsy: 'CN_VI_DIPLOPIA',
      mriBrain: 'PSEUDO_CHIARI_TONSILLAR_HERNIATION',
    };
    const result = simulateHeadacheWorkstation(params);
    expect(result.monroKellieCompliance).toBe('BRAIN_SAG_CRANIAL_TRACTION');
    expect(result.physiologicMechanisms.some((m) => m.includes('abducens nerve'))).toBe(true);
  });

  it('10. validates all clinical presets accurately', () => {
    const resMigraine = simulateHeadacheWorkstation(HEADACHE_PRESETS.refractoryMigraineStandard);
    expect(resMigraine.phenotype).toBe('STATUS_MIGRAINOSUS_REFRACTORY');

    const resVasospasm = simulateHeadacheWorkstation(HEADACHE_PRESETS.dheTriptanVasospasmTrap);
    expect(resVasospasm.dheTriptanVasospasmHazard).toBe(true);

    const resLeak = simulateHeadacheWorkstation(HEADACHE_PRESETS.spontaneousCsfLeakOrthostatic);
    expect(resLeak.phenotype).toBe('INTRACRANIAL_HYPOTENSION_CSF_LEAK');

    const resBurr = simulateHeadacheWorkstation(HEADACHE_PRESETS.subduralHygromaBurrHoleTrap);
    expect(resBurr.subduralBurrHoleHazard).toBe(true);

    const resRebound = simulateHeadacheWorkstation(HEADACHE_PRESETS.reboundHypertensionPostEbp);
    expect(resRebound.phenotype).toBe('REBOUND_INTRACRANIAL_HYPERTENSION_POST_EBP');
  });
});
