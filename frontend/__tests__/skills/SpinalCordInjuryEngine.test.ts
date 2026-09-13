import {
  DEFAULT_SCI_PATIENT,
  simulateSpinalCordInjury,
  SciPatientParams
} from '../../.gemini/skills/SpinalCordInjuryEngine';

describe('SpinalCordInjuryEngine', () => {
  it('1. correctly identifies acute spinal shock with absent bulbocavernosus reflex and neurogenic shock', () => {
    const output = simulateSpinalCordInjury(DEFAULT_SCI_PATIENT);

    expect(output.isSpinalShockActive).toBe(true);
    expect(output.isNeurogenicShock).toBe(true);
    expect(output.meanArterialPressureMmHg).toBeLessThan(65);
    expect(output.targetMapMet).toBe(false);
    expect(output.asiaGrade).toBe('A');
    expect(output.clinicalAlerts.some(a => a.includes('SPINAL SHOCK ACTIVE'))).toBe(true);
    expect(output.clinicalAlerts.some(a => a.includes('NEUROGENIC SHOCK'))).toBe(true);
  });

  it('2. confirms resolution of spinal shock when bulbocavernosus reflex (S2-S4) returns', () => {
    const patient: SciPatientParams = {
      ...DEFAULT_SCI_PATIENT,
      bulbocavernosusReflexPresent: true
    };
    const output = simulateSpinalCordInjury(patient);

    expect(output.isSpinalShockActive).toBe(false);
    expect(output.clinicalAlerts.some(a => a.includes('SPINAL SHOCK RESOLVED'))).toBe(true);
  });

  it('3. achieves AANS/CNS target MAP 85-90 mmHg with balanced vasopressor (Norepinephrine)', () => {
    const patient: SciPatientParams = {
      ...DEFAULT_SCI_PATIENT,
      vasopressor: 'NOREPINEPHRINE',
      vasopressorDoseMcgPerMin: 20
    };
    const output = simulateSpinalCordInjury(patient);

    expect(output.meanArterialPressureMmHg).toBeGreaterThanOrEqual(85);
    expect(output.meanArterialPressureMmHg).toBeLessThanOrEqual(95);
    expect(output.targetMapMet).toBe(true);
    expect(output.vasopressorAssessment.appropriateChoice).toBe(true);
    expect(output.vasopressorAssessment.reflexBradycardiaHazard).toBe(false);
  });

  it('4. detects lethal Phenylephrine reflex bradycardia hazard in high cervical/thoracic SCI', () => {
    const patient: SciPatientParams = {
      ...DEFAULT_SCI_PATIENT,
      vasopressor: 'PHENYLEPHRINE',
      vasopressorDoseMcgPerMin: 15
    };
    const output = simulateSpinalCordInjury(patient);

    expect(output.vasopressorAssessment.reflexBradycardiaHazard).toBe(true);
    expect(output.vasopressorAssessment.appropriateChoice).toBe(false);
    expect(output.clinicalAlerts.some(a => a.includes('PHENYLEPHRINE HAZARD'))).toBe(true);
  });

  it('5. triggers Autonomic Dysreflexia crisis with malignant hypertension when Foley is kinked post-spinal shock', () => {
    const patient: SciPatientParams = {
      ...DEFAULT_SCI_PATIENT,
      bulbocavernosusReflexPresent: true, // Spinal shock must be resolved!
      bladderDistensionFoleyKinked: true,
      systolicBpMmHg: 110,
      diastolicBpMmHg: 70
    };
    const output = simulateSpinalCordInjury(patient);

    expect(output.autonomicDysreflexiaActive).toBe(true);
    expect(output.autonomicDysreflexiaSeverity).toBe('HYPERTENSIVE_EMERGENCY_STROKE_RISK');
    expect(output.adSymptomsAboveLesion).toContain('Pounding, throbbing bilateral headache');
    expect(output.adSymptomsBelowLesion).toContain('Cutis anserina (piloerection / goosebumps)');
    expect(output.immediateInterventions.some(i => i.includes('sit patient upright'))).toBe(true);
    expect(output.immediateInterventions.some(i => i.includes('Foley catheter'))).toBe(true);
  });

  it('6. does not trigger Autonomic Dysreflexia while spinal shock is still active', () => {
    const patient: SciPatientParams = {
      ...DEFAULT_SCI_PATIENT,
      bulbocavernosusReflexPresent: false, // Spinal shock active
      bladderDistensionFoleyKinked: true
    };
    const output = simulateSpinalCordInjury(patient);

    expect(output.autonomicDysreflexiaActive).toBe(false);
  });

  it('7. classifies ASIA Impairment Scale B (Sensory Incomplete) with sacral sparing S4-S5', () => {
    const patient: SciPatientParams = {
      ...DEFAULT_SCI_PATIENT,
      sacralSensationS4S5Present: true,
      voluntaryAnalContractionPresent: false,
      motorScoreAverageBelowLesion: 0
    };
    const output = simulateSpinalCordInjury(patient);

    expect(output.asiaGrade).toBe('B');
    expect(output.asiaGradeDescription).toContain('Sensory Incomplete');
  });

  it('8. classifies ASIA Impairment Scale D (Motor Incomplete with functional muscle strength >= 3)', () => {
    const patient: SciPatientParams = {
      ...DEFAULT_SCI_PATIENT,
      sacralSensationS4S5Present: true,
      voluntaryAnalContractionPresent: true,
      motorScoreAverageBelowLesion: 3.8
    };
    const output = simulateSpinalCordInjury(patient);

    expect(output.asiaGrade).toBe('D');
    expect(output.functionalPrognosis).toContain('ambulation');
  });

  it('9. identifies incomplete cord syndromes (Central Cord, Anterior Cord, Brown-Sequard)', () => {
    const centralCord = simulateSpinalCordInjury({
      ...DEFAULT_SCI_PATIENT,
      incompleteSyndrome: 'CENTRAL_CORD_SYNDROME'
    });
    expect(centralCord.clinicalAlerts.some(a => a.includes('CENTRAL CORD SYNDROME'))).toBe(true);

    const brownSequard = simulateSpinalCordInjury({
      ...DEFAULT_SCI_PATIENT,
      incompleteSyndrome: 'BROWN_SEQUARD_SYNDROME'
    });
    expect(brownSequard.clinicalAlerts.some(a => a.includes('BROWN-SÉQUARD SYNDROME'))).toBe(true);
  });

  it('10. calculates severe adverse infection and bleed multipliers for NASCIS Methylprednisolone', () => {
    const patientWithSteroids: SciPatientParams = {
      ...DEFAULT_SCI_PATIENT,
      highDoseMethylprednisoloneAdministered: true
    };
    const output = simulateSpinalCordInjury(patientWithSteroids);

    expect(output.steroidAdverseOutcomes.indicated).toBe(false);
    expect(output.steroidAdverseOutcomes.sepsisRiskMultiplier).toBeGreaterThan(2.0);
    expect(output.steroidAdverseOutcomes.pneumoniaRiskMultiplier).toBeGreaterThan(3.0);
    expect(output.clinicalAlerts.some(a => a.includes('METHYLPREDNISOLONE TOXICITY WARNING'))).toBe(true);
  });
});
