import {
  DEFAULT_MESENTERIC_PATIENT,
  simulateMesentericIschemia,
  MesentericPatientParams
} from '../../.gemini/skills/MesentericIschemiaEngine';

describe('MesentericIschemiaEngine', () => {
  it('1. identifies classic "pain out of proportion" sign in early SMA embolism', () => {
    const output = simulateMesentericIschemia(DEFAULT_MESENTERIC_PATIENT);

    expect(output.clinicalAlerts.some(a => a.includes('CARDINAL DIAGNOSTIC CLUE'))).toBe(true);
    expect(output.clinicalAlerts.some(a => a.includes('OUT OF PROPORTION'))).toBe(true);
  });

  it('2. alerts on the dangerous normal serum lactate pitfall in early ischemia', () => {
    const output = simulateMesentericIschemia(DEFAULT_MESENTERIC_PATIENT);

    expect(output.isLactateMisleadinglyNormal).toBe(true);
    expect(output.clinicalAlerts.some(a => a.includes('SERUM LACTATE PITFALL'))).toBe(true);
    expect(output.clinicalAlerts.some(a => a.includes('Normal lactate DOES NOT exclude'))).toBe(true);
  });

  it('3. flags elevated serum lactate as established transmural bowel ischemia', () => {
    const patient: MesentericPatientParams = {
      ...DEFAULT_MESENTERIC_PATIENT,
      serumLactateMmolPerL: 4.8,
      hoursFromPainOnset: 14
    };
    const output = simulateMesentericIschemia(patient);

    expect(output.isLactateMisleadinglyNormal).toBe(false);
    expect(output.predictedViabilityStage).toBe('STAGE_3_FRANK_GANGRENOUS_NECROSIS');
    expect(output.clinicalAlerts.some(a => a.includes('ELEVATED SERUM LACTATE'))).toBe(true);
  });

  it('4. confirms Biphasic CTA as gold standard and detects oral contrast hazard', () => {
    const ctaValid = simulateMesentericIschemia({
      ...DEFAULT_MESENTERIC_PATIENT,
      imagingOrdered: 'BIPHASIC_CT_ANGIOGRAPHY_CTA'
    });
    expect(ctaValid.diagnosticAccuracy.imagingEffective).toBe(true);
    expect(ctaValid.clinicalAlerts.some(a => a.includes('GOLD STANDARD IMAGING CONFIRMED'))).toBe(true);

    const oralHazard = simulateMesentericIschemia({
      ...DEFAULT_MESENTERIC_PATIENT,
      imagingOrdered: 'CT_WITH_ORAL_CONTRAST'
    });
    expect(oralHazard.diagnosticAccuracy.imagingEffective).toBe(false);
    expect(oralHazard.diagnosticAccuracy.imagingWarning).toContain('IMAGING HAZARD');
  });

  it('5. successfully revascularizes SMA embolism with open surgical embolectomy', () => {
    const patient: MesentericPatientParams = {
      ...DEFAULT_MESENTERIC_PATIENT,
      revascularization: 'OPEN_SURGICAL_EMBOLECTOMY_PATCH'
    };
    const output = simulateMesentericIschemia(patient);

    expect(output.vascularPatencyAchieved).toBe(true);
    expect(output.revascularizationAppropriate).toBe(true);
    expect(output.clinicalAlerts.some(a => a.includes('SUCCESSFUL EMBOLECTOMY'))).toBe(true);
  });

  it('6. relieves NOMI splanchnic vasospasm with intra-arterial Papaverine infusion', () => {
    const patient: MesentericPatientParams = {
      ...DEFAULT_MESENTERIC_PATIENT,
      subtype: 'NON_OCCLUSIVE_NOMI',
      highDoseAlphaVasopressorsActive: true,
      revascularization: 'INTRA_ARTERIAL_PAPAVERINE_INFUSION'
    };
    const output = simulateMesentericIschemia(patient);

    expect(output.vascularPatencyAchieved).toBe(true);
    expect(output.revascularizationAppropriate).toBe(true);
    expect(output.clinicalAlerts.some(a => a.includes('PAPAVERINE VASODILATOR SUCCESS'))).toBe(true);
  });

  it('7. applies systemic anticoagulation for Mesenteric Venous Thrombosis (MVT)', () => {
    const patient: MesentericPatientParams = {
      ...DEFAULT_MESENTERIC_PATIENT,
      subtype: 'MESENTERIC_VENOUS_MVT',
      revascularization: 'SYSTEMIC_ANTICOAGULATION_HEPARIN'
    };
    const output = simulateMesentericIschemia(patient);

    expect(output.vascularPatencyAchieved).toBe(true);
    expect(output.revascularizationAppropriate).toBe(true);
    expect(output.clinicalAlerts.some(a => a.includes('ANTICOAGULATION PROTOCOL'))).toBe(true);
  });

  it('8. enforces mandatory Second-Look Laparotomy within 24-48 hours for stage 2-3 ischemia', () => {
    const patient: MesentericPatientParams = {
      ...DEFAULT_MESENTERIC_PATIENT,
      hoursFromPainOnset: 8 // Stage 2 patchy ischemia
    };
    const output = simulateMesentericIschemia(patient);

    expect(output.secondLookAssessment.mandated).toBe(true);
    expect(output.secondLookAssessment.secondLookRationale).toContain('MANDATORY SECOND-LOOK LAPAROTOMY');
    expect(output.therapeuticPriorities.some(p => p.includes('Second-Look Laparotomy'))).toBe(true);
  });

  it('9. calculates critical Short Bowel Syndrome risk when remaining viable bowel < 150 cm', () => {
    const patient: MesentericPatientParams = {
      ...DEFAULT_MESENTERIC_PATIENT,
      hoursFromPainOnset: 28 // Late perforation
    };
    const output = simulateMesentericIschemia(patient);

    expect(output.estimatedViableSmallBowelLengthCm).toBeLessThan(150);
    expect(output.shortBowelSyndromeRisk).toBe('CRITICAL_EXTENSIVE_RESECTION');
    expect(output.clinicalAlerts.some(a => a.includes('CRITICAL SHORT BOWEL SYNDROME HAZARD'))).toBe(true);
  });

  it('10. prioritizes broad-spectrum antibiotics and heparin in therapeutic directives', () => {
    const output = simulateMesentericIschemia(DEFAULT_MESENTERIC_PATIENT);

    expect(output.therapeuticPriorities.some(p => p.includes('heparin'))).toBe(true);
    expect(output.therapeuticPriorities.some(p => p.includes('broad-spectrum IV antibiotics'))).toBe(true);
  });
});
