import {
  isDermatomeHigherOrEqual,
  evaluateEpiduralTestDose,
  calculateLastLipidRescue,
  evaluateNeuraxialWorkstation,
  NEURAXIAL_PRESETS,
} from '../../.gemini/skills/NeuraxialAnesthesiaEngine';

describe('NeuraxialAnesthesiaEngine', () => {
  it('correctly compares dermatome hierarchy', () => {
    expect(isDermatomeHigherOrEqual('T4', 'T10')).toBe(true);
    expect(isDermatomeHigherOrEqual('T1', 'T4')).toBe(true);
    expect(isDermatomeHigherOrEqual('C3', 'T1')).toBe(true);
    expect(isDermatomeHigherOrEqual('T10', 'T4')).toBe(false);
    expect(isDermatomeHigherOrEqual('L1', 'T10')).toBe(false);
  });

  it('evaluates negative and positive epidural test doses accurately', () => {
    // Negative test dose
    const negative = evaluateEpiduralTestDose(true, 4, 2, false, false);
    expect(negative.interpretationVerdict).toBe('NEGATIVE_SAFE');
    expect(negative.isIntravascularCatheter).toBe(false);

    // Intravascular test dose (epinephrine heart rate surge)
    const intravascular = evaluateEpiduralTestDose(true, 26, 18, true, false);
    expect(intravascular.interpretationVerdict).toBe('POSITIVE_INTRAVASCULAR');
    expect(intravascular.isIntravascularCatheter).toBe(true);

    // Intrathecal test dose (rapid motor block)
    const intrathecal = evaluateEpiduralTestDose(true, 2, 0, false, true);
    expect(intrathecal.interpretationVerdict).toBe('POSITIVE_INTRATHECAL');
    expect(intrathecal.isIntrathecalCatheter).toBe(true);
  });

  it('calculates ASRA 20% Lipid Emulsion rescue doses based on body weight', () => {
    // 70 kg adult: Bolus = 1.5 * 70 = 105 mL, Infusion = 0.25 * 70 * 60 = 1050 mL/hr, Max = 12 * 70 = 840 mL
    const doses = calculateLastLipidRescue(70);
    expect(doses.bolusMl).toBe(105);
    expect(doses.infusionMlHr).toBe(1050);
    expect(doses.maxDoseMl).toBe(840);
  });

  it('evaluates surgical block adequacy for Cesarean section and labor analgesia', () => {
    const cSection = NEURAXIAL_PRESETS[1]; // Elective C-Section T4
    const evalCSection = evaluateNeuraxialWorkstation(
      cSection.technique,
      cSection.patient,
      cSection.block,
      cSection.testDose,
      cSection.lastState,
      cSection.pdphState
    );
    expect(evalCSection.blockAdequacyForSurgery).toBe('ADEQUATE_CESAREAN_T4');
    expect(evalCSection.highSpinalState).toBe('NORMAL');

    const labor = NEURAXIAL_PRESETS[0]; // Labor T10
    const evalLabor = evaluateNeuraxialWorkstation(
      labor.technique,
      labor.patient,
      labor.block,
      labor.testDose,
      labor.lastState,
      labor.pdphState
    );
    expect(evalLabor.blockAdequacyForSurgery).toBe('ADEQUATE_LABOR_T10');
  });

  it('identifies High Spinal with Bezold-Jarisch bradycardia and flags emergency resuscitation', () => {
    const highSpinal = NEURAXIAL_PRESETS[2]; // High spinal T1
    const evalHigh = evaluateNeuraxialWorkstation(
      highSpinal.technique,
      highSpinal.patient,
      highSpinal.block,
      highSpinal.testDose,
      highSpinal.lastState,
      highSpinal.pdphState
    );

    expect(evalHigh.highSpinalState).toBe('HIGH_SPINAL_T1_T3');
    expect(evalHigh.blockAdequacyForSurgery).toBe('DANGEROUSLY_HIGH');
    expect(evalHigh.clinicalAlerts.some((a) => a.includes('HIGH SPINAL'))).toBe(true);
    expect(evalHigh.emergencyActionsRequired.length).toBeGreaterThan(0);
  });

  it('identifies Total Spinal brainstem collapse with apnea and requires immediate intubation/epinephrine', () => {
    const totalSpinal = NEURAXIAL_PRESETS[3]; // Total spinal collapse
    const evalTotal = evaluateNeuraxialWorkstation(
      totalSpinal.technique,
      totalSpinal.patient,
      totalSpinal.block,
      totalSpinal.testDose,
      totalSpinal.lastState,
      totalSpinal.pdphState
    );

    expect(evalTotal.highSpinalState).toBe('TOTAL_SPINAL_COLLAPSE');
    expect(evalTotal.emergencyActionsRequired.some((a) => a.includes('intubation'))).toBe(true);
    expect(evalTotal.emergencyActionsRequired.some((a) => a.includes('Epinephrine'))).toBe(true);
  });

  it('evaluates Local Anesthetic Systemic Toxicity (LAST) with ASRA Lipid Emulsion and contraindications', () => {
    const lastPreset = NEURAXIAL_PRESETS[6]; // Bupivacaine LAST
    const evalLast = evaluateNeuraxialWorkstation(
      lastPreset.technique,
      lastPreset.patient,
      lastPreset.block,
      lastPreset.testDose,
      lastPreset.lastState,
      lastPreset.pdphState
    );

    expect(evalLast.lastEval.isActive).toBe(true);
    expect(evalLast.lastEval.recommendedLipidBolusMl).toBeGreaterThan(0);
    expect(evalLast.lastEval.contraindicatedDrugsAlerts.some((a) => a.includes('Vasopressin'))).toBe(true);
  });

  it('detects severe PDPH and indicates Epidural Blood Patch', () => {
    const pdphPreset = NEURAXIAL_PRESETS[7]; // Severe PDPH
    const evalPdph = evaluateNeuraxialWorkstation(
      pdphPreset.technique,
      pdphPreset.patient,
      pdphPreset.block,
      pdphPreset.testDose,
      pdphPreset.lastState,
      pdphPreset.pdphState
    );

    expect(evalPdph.pdphEval.epiduralBloodPatchIndicated).toBe(true);
    expect(evalPdph.pdphEval.recommendedBloodPatchVolumeMl).toBeGreaterThanOrEqual(15);
  });
});
