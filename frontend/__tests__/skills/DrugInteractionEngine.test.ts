import {
  CLINICAL_FORMULARY,
  evaluatePrescriptionSafety,
  calculateCrCl,
  DrugRecord,
} from '../../.gemini/skills/DrugInteractionEngine';

describe('DrugInteractionEngine', () => {
  const aspirin = CLINICAL_FORMULARY.find((d) => d.id === 'aspirin')!;
  const clopidogrel = CLINICAL_FORMULARY.find((d) => d.id === 'clopidogrel')!;
  const omeprazole = CLINICAL_FORMULARY.find((d) => d.id === 'omeprazole')!;
  const nitroglycerin = CLINICAL_FORMULARY.find((d) => d.id === 'nitroglycerin')!;
  const sildenafil = CLINICAL_FORMULARY.find((d) => d.id === 'sildenafil')!;
  const lisinopril = CLINICAL_FORMULARY.find((d) => d.id === 'lisinopril')!;
  const spironolactone = CLINICAL_FORMULARY.find((d) => d.id === 'spironolactone')!;
  const amoxicillin = CLINICAL_FORMULARY.find((d) => d.id === 'amoxicillin')!;

  it('should detect fatal interaction between Nitroglycerin and Sildenafil', () => {
    const result = evaluatePrescriptionSafety(
      nitroglycerin,
      [sildenafil],
      [],
      { systolicBp: 120, heartRate: 75 },
      90
    );

    expect(result.isSafeToAdminister).toBe(false);
    expect(result.highestSeverity).toBe('FATAL_CONTRAINDICATION');
    expect(result.alerts.some((a) => a.ruleId === 'DDI-001')).toBe(true);
  });

  it('should detect major warning between Clopidogrel and Omeprazole', () => {
    const result = evaluatePrescriptionSafety(
      clopidogrel,
      [omeprazole],
      [],
      { systolicBp: 120, heartRate: 75 },
      90
    );

    expect(result.highestSeverity).toBe('MAJOR_WARNING');
    expect(result.alerts.some((a) => a.ruleId === 'DDI-003')).toBe(true);
  });

  it('should detect fatal contraindication when administering Nitroglycerin in hypotension (SBP < 90)', () => {
    const result = evaluatePrescriptionSafety(
      nitroglycerin,
      [aspirin],
      [],
      { systolicBp: 84, heartRate: 104 },
      90
    );

    expect(result.isSafeToAdminister).toBe(false);
    expect(result.alerts.some((a) => a.ruleId === 'VITALS-HYPOTENSION')).toBe(true);
  });

  it('should flag severe direct penicillin allergy when prescribing Amoxicillin', () => {
    const result = evaluatePrescriptionSafety(
      amoxicillin,
      [],
      [{ allergen: 'Penicillin', reactionType: 'ANAPHYLAXIS', severity: 'SEVERE' }],
      { systolicBp: 120, heartRate: 75 },
      90
    );

    expect(result.isSafeToAdminister).toBe(false);
    expect(result.highestSeverity).toBe('FATAL_CONTRAINDICATION');
    expect(result.alerts.some((a) => a.ruleId === 'ALLERGY-DIRECT')).toBe(true);
  });

  it('should flag renal dose adjustment alert when eGFR is below threshold', () => {
    const result = evaluatePrescriptionSafety(
      lisinopril,
      [],
      [],
      { systolicBp: 130, heartRate: 75 },
      25 // eGFR < 30
    );

    expect(result.renalAlert?.required).toBe(true);
  });

  it('should calculate creatinine clearance using Cockcroft-Gault formula', () => {
    // 60yo male, 70kg, Cr 1.0 mg/dL => ((140-60)*70)/(72*1) = 5600 / 72 = 77.7 => 78
    const crclMale = calculateCrCl(60, 70, 1.0, false);
    expect(crclMale).toBe(78);

    // female => 78 * 0.85 = 66
    const crclFemale = calculateCrCl(60, 70, 1.0, true);
    expect(crclFemale).toBe(66);
  });
});
