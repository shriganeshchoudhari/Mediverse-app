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

  it('should detect fatal contraindication when patient baseline QTc >= 500 ms receiving QTc prolonging drug', () => {
    const amiodarone = CLINICAL_FORMULARY.find((d) => d.id === 'amiodarone')!;
    const result = evaluatePrescriptionSafety(
      amiodarone,
      [],
      [],
      { systolicBp: 120, heartRate: 75 },
      90,
      { patientQtcMs: 512 }
    );

    expect(result.isSafeToAdminister).toBe(false);
    expect(result.highestSeverity).toBe('FATAL_CONTRAINDICATION');
    expect(result.alerts.some((a) => a.ruleId === 'QTC-BASELINE-CRITICAL')).toBe(true);
  });

  it('should flag additive QTc prolongation warning when multiple QTc-prolonging drugs are combined', () => {
    const amiodarone = CLINICAL_FORMULARY.find((d) => d.id === 'amiodarone')!;
    const ondansetron = CLINICAL_FORMULARY.find((d) => d.id === 'ondansetron')!;
    const result = evaluatePrescriptionSafety(
      ondansetron,
      [amiodarone],
      [],
      { systolicBp: 120, heartRate: 75 },
      90,
      { patientQtcMs: 440 }
    );

    expect(result.highestSeverity).toBe('MAJOR_WARNING');
    expect(result.qtcAlert?.additiveRisk).toBe(true);
    expect(result.alerts.some((a) => a.ruleId === 'QTC-ADDITIVE-RISK')).toBe(true);
  });

  it('should detect competitive CYP450 enzyme inhibition between substrate and inhibitor', () => {
    const clarithromycin = CLINICAL_FORMULARY.find((d) => d.id === 'clarithromycin')!;
    const atorvastatin = CLINICAL_FORMULARY.find((d) => d.id === 'atorvastatin')!;
    const result = evaluatePrescriptionSafety(
      atorvastatin,
      [clarithromycin],
      [],
      { systolicBp: 120, heartRate: 75 },
      90
    );

    expect(result.highestSeverity).toBe('MAJOR_WARNING');
    expect(result.alerts.some((a) => a.ruleId.startsWith('CYP-INHIBITION-CYP3A4'))).toBe(true);
  });

  it('should flag fatal contraindication for FDA Pregnancy Category X medication in pregnant patient', () => {
    const atorvastatin = CLINICAL_FORMULARY.find((d) => d.id === 'atorvastatin')!;
    const result = evaluatePrescriptionSafety(
      atorvastatin,
      [],
      [],
      { systolicBp: 120, heartRate: 75 },
      90,
      { isPregnant: true }
    );

    expect(result.isSafeToAdminister).toBe(false);
    expect(result.highestSeverity).toBe('FATAL_CONTRAINDICATION');
    expect(result.pregnancyAlert?.isContraindicated).toBe(true);
    expect(result.alerts.some((a) => a.ruleId === 'PREGNANCY-CATEGORY-X')).toBe(true);
  });

  it('should flag major warning for FDA Pregnancy Category D drug in pregnant patient', () => {
    const lisinopril = CLINICAL_FORMULARY.find((d) => d.id === 'lisinopril')!;
    const result = evaluatePrescriptionSafety(
      lisinopril,
      [],
      [],
      { systolicBp: 120, heartRate: 75 },
      90,
      { isPregnant: true }
    );

    expect(result.highestSeverity).toBe('MAJOR_WARNING');
    expect(result.pregnancyAlert?.category).toBe('D');
    expect(result.alerts.some((a) => a.ruleId === 'PREGNANCY-CATEGORY-D')).toBe(true);
  });

  it('should alert on sulfonamide hypersensitivity for sulfa-containing drugs', () => {
    const furosemide = CLINICAL_FORMULARY.find((d) => d.id === 'furosemide')!;
    const result = evaluatePrescriptionSafety(
      furosemide,
      [],
      [{ allergen: 'Sulfamethoxazole', reactionType: 'RASH', severity: 'MODERATE' }],
      { systolicBp: 120, heartRate: 75 },
      90
    );

    expect(result.alerts.some((a) => a.ruleId === 'ALLERGY-SULFA')).toBe(true);
  });

  it('should detect fatal DDI-010 between Amiodarone and Warfarin', () => {
    const amiodarone = CLINICAL_FORMULARY.find((d) => d.id === 'amiodarone')!;
    const warfarin = CLINICAL_FORMULARY.find((d) => d.id === 'warfarin')!;
    const result = evaluatePrescriptionSafety(
      amiodarone,
      [warfarin],
      [],
      { systolicBp: 120, heartRate: 75 },
      90
    );

    expect(result.highestSeverity).toBe('FATAL_CONTRAINDICATION');
    expect(result.alerts.some((a) => a.ruleId === 'DDI-010')).toBe(true);
  });

  it('should detect fatal DDI-011 between Azithromycin and Amiodarone', () => {
    const azithromycin = CLINICAL_FORMULARY.find((d) => d.id === 'azithromycin')!;
    const amiodarone = CLINICAL_FORMULARY.find((d) => d.id === 'amiodarone')!;
    const result = evaluatePrescriptionSafety(
      azithromycin,
      [amiodarone],
      [],
      { systolicBp: 120, heartRate: 75 },
      90
    );

    expect(result.highestSeverity).toBe('FATAL_CONTRAINDICATION');
    expect(result.alerts.some((a) => a.ruleId === 'DDI-011')).toBe(true);
  });

  it('should detect major warning DDI-014 between Piperacillin-Tazobactam and Vancomycin', () => {
    const piptazo = CLINICAL_FORMULARY.find((d) => d.id === 'piperacillin-tazobactam')!;
    const vancomycin = CLINICAL_FORMULARY.find((d) => d.id === 'vancomycin')!;
    const result = evaluatePrescriptionSafety(
      piptazo,
      [vancomycin],
      [],
      { systolicBp: 120, heartRate: 75 },
      90
    );

    expect(result.highestSeverity).toBe('MAJOR_WARNING');
    expect(result.alerts.some((a) => a.ruleId === 'DDI-014')).toBe(true);
  });
});
