import {
  evaluatePupilDynamics,
  computePupilDiameter,
  PUPIL_PATHOLOGY_PRESETS,
} from '../../.gemini/skills/PupilAnisocoriaHornerEngine';

describe('PupilAnisocoriaHornerEngine', () => {
  it('computes symmetric normal pupils with brisk light constriction', () => {
    const baseline = evaluatePupilDynamics({
      ambientLux: 300,
      flashlight: 'OFF',
      nearEffort: false,
      pathology: 'NORMAL',
      affectedEye: 'NEITHER',
      activeDrop: 'NONE',
    });

    expect(baseline.rightEye.pupilDiameterMm).toBeCloseTo(baseline.leftEye.pupilDiameterMm, 0);
    expect(baseline.anisocoriaMm).toBeLessThan(0.3);
    expect(baseline.dominantDefect).toBe('NONE');
    expect(baseline.rightEye.lightReflexResponse).toBe('NORMAL');

    // With flashlight active
    const lightActive = evaluatePupilDynamics({
      ambientLux: 300,
      flashlight: 'RIGHT_EYE',
      nearEffort: false,
      pathology: 'NORMAL',
      affectedEye: 'NEITHER',
      activeDrop: 'NONE',
    });
    expect(lightActive.rightEye.pupilDiameterMm).toBeLessThan(baseline.rightEye.pupilDiameterMm);
    expect(lightActive.leftEye.pupilDiameterMm).toBeLessThan(baseline.leftEye.pupilDiameterMm);
  });

  it('correctly diagnoses Postganglionic 3rd-Order Horner Syndrome (Carotid Dissection)', () => {
    const horner = evaluatePupilDynamics({
      ambientLux: 20, // Scotopic dark
      flashlight: 'OFF',
      nearEffort: false,
      pathology: 'HORNER_POSTGANGLIONIC_3RD_ORDER',
      affectedEye: 'RIGHT',
      activeDrop: 'NONE',
    });

    expect(horner.dominantDefect).toBe('SYMPATHETIC_DEFICIT');
    expect(horner.anisocoriaCondition).toBe('GREATER_IN_DARK');
    expect(horner.abnormalPupil).toBe('SMALLER_PUPIL');
    expect(horner.rightEye.pupilDiameterMm).toBeLessThan(horner.leftEye.pupilDiameterMm);
    expect(horner.rightEye.ptosisMm).toBeGreaterThanOrEqual(1.5);
    expect(horner.rightEye.anhidrosisArea).toBe('NONE'); // Sparing of facial sweating in 3rd order!

    // Apraclonidine test: reversal of anisocoria
    const apraclonidine = evaluatePupilDynamics({
      ambientLux: 20,
      flashlight: 'OFF',
      nearEffort: false,
      pathology: 'HORNER_POSTGANGLIONIC_3RD_ORDER',
      affectedEye: 'RIGHT',
      activeDrop: 'APRACLONIDINE_05',
    });
    expect(apraclonidine.dropTestInterpretation).toMatch(/REVERSAL OF ANISOCORIA/i);
    expect(apraclonidine.rightEye.pupilDiameterMm).toBeGreaterThan(horner.rightEye.pupilDiameterMm);

    // Hydroxyamphetamine test in 3rd order: fails to dilate
    const hydroxy = evaluatePupilDynamics({
      ambientLux: 20,
      flashlight: 'OFF',
      nearEffort: false,
      pathology: 'HORNER_POSTGANGLIONIC_3RD_ORDER',
      affectedEye: 'RIGHT',
      activeDrop: 'HYDROXYAMPHETAMINE_1',
    });
    expect(hydroxy.dropTestInterpretation).toMatch(/POSTGANGLIONIC \(3RD-ORDER\) LOCALIZATION/i);
  });

  it('identifies Preganglionic 2nd-Order Horner with facial anhidrosis & positive hydroxyamphetamine dilation', () => {
    const pancoast = evaluatePupilDynamics({
      ambientLux: 15,
      flashlight: 'OFF',
      nearEffort: false,
      pathology: 'HORNER_PREGANGLIONIC_2ND_ORDER',
      affectedEye: 'LEFT',
      activeDrop: 'NONE',
    });

    expect(pancoast.leftEye.anhidrosisArea).toBe('IPSILATERAL_HEMIFACE');

    const hydroxy = evaluatePupilDynamics({
      ambientLux: 15,
      flashlight: 'OFF',
      nearEffort: false,
      pathology: 'HORNER_PREGANGLIONIC_2ND_ORDER',
      affectedEye: 'LEFT',
      activeDrop: 'HYDROXYAMPHETAMINE_1',
    });
    expect(hydroxy.dropTestInterpretation).toMatch(/PREGANGLIONIC/i);
    expect(hydroxy.leftEye.pupilDiameterMm).toBeGreaterThan(pancoast.leftEye.pupilDiameterMm);
  });

  it('detects Compressive CN III Palsy with blown pupil and confirms response to 1% pilocarpine', () => {
    const cn3 = evaluatePupilDynamics({
      ambientLux: 500,
      flashlight: 'OFF',
      nearEffort: false,
      pathology: 'CN3_PALSY_COMPRESSIVE',
      affectedEye: 'RIGHT',
      activeDrop: 'NONE',
    });

    expect(cn3.dominantDefect).toBe('PARASYMPATHETIC_DEFICIT');
    expect(cn3.anisocoriaCondition).toBe('GREATER_IN_LIGHT');
    expect(cn3.abnormalPupil).toBe('LARGER_PUPIL');
    expect(cn3.rightEye.pupilDiameterMm).toBeGreaterThanOrEqual(7.0);
    expect(cn3.rightEye.ptosisMm).toBeGreaterThanOrEqual(5.0);
    expect(cn3.rightEye.lightReflexResponse).toBe('ABSENT');

    // 1% pilocarpine constricts CN3 palsy (neurogenic, receptors intact)
    const pilo1 = evaluatePupilDynamics({
      ambientLux: 500,
      flashlight: 'OFF',
      nearEffort: false,
      pathology: 'CN3_PALSY_COMPRESSIVE',
      affectedEye: 'RIGHT',
      activeDrop: 'PILOCARPINE_1',
    });
    expect(pilo1.dropTestInterpretation).toMatch(/CN III PALSY \(NOT PHARMACOLOGIC\)/i);
    expect(pilo1.rightEye.pupilDiameterMm).toBeLessThan(3.0);
  });

  it('demonstrates Adie Tonic Pupil light-near dissociation and dilute 0.125% pilocarpine supersensitivity', () => {
    const adieLight = evaluatePupilDynamics({
      ambientLux: 400,
      flashlight: 'OFF',
      nearEffort: false,
      pathology: 'ADIE_TONIC_PUPIL',
      affectedEye: 'LEFT',
      activeDrop: 'NONE',
    });
    expect(adieLight.leftEye.pupilDiameterMm).toBeGreaterThan(adieLight.rightEye.pupilDiameterMm);
    expect(adieLight.leftEye.lightReflexResponse).toBe('ABSENT');

    // Near convergence effort -> tonic constriction
    const adieNear = evaluatePupilDynamics({
      ambientLux: 400,
      flashlight: 'OFF',
      nearEffort: true,
      pathology: 'ADIE_TONIC_PUPIL',
      affectedEye: 'LEFT',
      activeDrop: 'NONE',
    });
    expect(adieNear.leftEye.nearResponse).toBe('TONIC_EXAGGERATED');
    expect(adieNear.leftEye.pupilDiameterMm).toBeLessThan(adieLight.leftEye.pupilDiameterMm);

    // Dilute pilocarpine supersensitivity
    const dilutePilo = evaluatePupilDynamics({
      ambientLux: 400,
      flashlight: 'OFF',
      nearEffort: false,
      pathology: 'ADIE_TONIC_PUPIL',
      affectedEye: 'LEFT',
      activeDrop: 'PILOCARPINE_0125',
    });
    expect(dilutePilo.dropTestInterpretation).toMatch(/POSITIVE DILUTE PILOCARPINE/i);
    expect(dilutePilo.leftEye.pupilDiameterMm).toBeLessThan(2.5);
  });

  it('evaluates Marcus Gunn RAPD showing paradoxical dilation on swinging flashlight test', () => {
    const rapd = evaluatePupilDynamics({
      ambientLux: 250,
      flashlight: 'RIGHT_EYE',
      nearEffort: false,
      pathology: 'RAPD_MARCUS_GUNN',
      affectedEye: 'RIGHT',
      activeDrop: 'NONE',
    });

    expect(rapd.rapdPresent).toBe(true);
    expect(rapd.dominantDefect).toBe('AFFERENT_DEFICIT');
    expect(rapd.rightEye.lightReflexResponse).toBe('PARADOXICAL_DILATION');
    expect(rapd.leftEye.lightReflexResponse).toBe('PARADOXICAL_DILATION');
  });
});
