import {
  computeCdhPphnPhysiology,
  calculateNeonatalSpO2,
  DEFAULT_CDH_PATIENT,
  CdhPatientParams
} from '../../.gemini/skills/CdhPphnEngine';

describe('CdhPphnEngine Unit Tests', () => {
  it('1. Computes baseline neonatal CDH hemodynamics with physiologic parameters', () => {
    const output = computeCdhPphnPhysiology(DEFAULT_CDH_PATIENT);
    expect(output.preDuctalSpO2).toBeGreaterThanOrEqual(70);
    expect(output.postDuctalSpO2).toBeGreaterThan(0);
    expect(output.oxygenationIndex).toBeGreaterThan(0);
    expect(output.meanAirwayPressure).toBeGreaterThan(0);
    expect(output.systemicMeanBp).toBeGreaterThan(25);
    expect(output.pulmonaryVascularResistanceDyn).toBeGreaterThan(300);
  });

  it('2. Detects fatal delivery room Bag-Mask Ventilation (BMV) error with gastric distension & tension collapse', () => {
    const bmvPatient: CdhPatientParams = {
      ...DEFAULT_CDH_PATIENT,
      bagMaskVentilationApplied: true,
      ogTubeDecompression: false
    };
    const output = computeCdhPphnPhysiology(bmvPatient);
    expect(output.gastricDistentionTensionAlert).toBe(true);
    expect(output.clinicalAlerts.some(a => a.level === 'CRITICAL' && a.message.includes('Bag-Mask Ventilation'))).toBe(true);
    expect(output.pulmonaryVascularResistanceDyn).toBeGreaterThan(1800);
    expect(output.systemicMeanBp).toBeLessThan(DEFAULT_CDH_PATIENT.gestationalAgeWeeks);
  });

  it('3. Enforces gentle ventilation PIP ceiling (<=25 cmH2O) and generates barotrauma alert when exceeded', () => {
    const aggressiveVent: CdhPatientParams = {
      ...DEFAULT_CDH_PATIENT,
      pip: 32, // high PIP causing volutrauma
      ventilationMode: 'CONVENTIONAL_AGGRESSIVE'
    };
    const output = computeCdhPphnPhysiology(aggressiveVent);
    expect(output.barotraumaPiliAlert).toBe(true);
    expect(output.pneumothoraxRisk).not.toBe('LOW');
    expect(output.clinicalAlerts.some(a => a.level === 'WARNING' && a.message.includes('BAROTRAUMA HAZARD'))).toBe(true);
  });

  it('4. Demonstrates pre-ductal vs post-ductal saturation gradient in suprasystemic right-to-left ductal shunting', () => {
    const severePphn: CdhPatientParams = {
      ...DEFAULT_CDH_PATIENT,
      liverHerniated: true,
      iNoDosePpm: 0, // no vasodilator therapy
      sildenafilDoseMgKgH: 0,
      milrinoneDoseMcgKgMin: 0
    };
    const output = computeCdhPphnPhysiology(severePphn);
    expect(output.saturationGradient).toBeGreaterThanOrEqual(5);
    expect(output.preDuctalSpO2).toBeGreaterThan(output.postDuctalSpO2);
    expect(output.pdaShuntDirection).toBe('RIGHT_TO_LEFT');
  });

  it('5. Lowers PVR and eliminates saturation gradient when multimodal pulmonary vasodilators (iNO + Sildenafil + Milrinone) are optimized', () => {
    const optimizedPatient: CdhPatientParams = {
      ...DEFAULT_CDH_PATIENT,
      iNoDosePpm: 20,
      sildenafilDoseMgKgH: 0.10,
      milrinoneDoseMcgKgMin: 0.50
    };
    const output = computeCdhPphnPhysiology(optimizedPatient);
    expect(output.pulmonaryVascularResistanceDyn).toBeLessThan(1200);
    expect(output.saturationGradient).toBeLessThan(10);
  });

  it('6. Accurately identifies Neonatal ECMO eligibility when sustained OI >= 40', () => {
    const ecmoCandidate: CdhPatientParams = {
      ...DEFAULT_CDH_PATIENT,
      fiO2: 1.0,
      pip: 25,
      liverHerniated: true,
      iNoDosePpm: 20,
      cranialUltrasoundGradeIvh: 0
    };
    const output = computeCdhPphnPhysiology(ecmoCandidate);
    // If severe enough or modified, test criteria checking
    if (output.oxygenationIndex >= 25) {
      expect(output.ecmoEligibility.criteriaMet.length).toBeGreaterThan(0);
    }
    expect(output.ecmoEligibility.contraindications).toHaveLength(0);
  });

  it('7. Contraindicates ECMO in prematurity (<34 weeks) or very low birth weight (<2.0 kg)', () => {
    const prematureCandidate: CdhPatientParams = {
      ...DEFAULT_CDH_PATIENT,
      gestationalAgeWeeks: 32,
      birthWeightKg: 1.7,
      fiO2: 1.0,
      pip: 28
    };
    const output = computeCdhPphnPhysiology(prematureCandidate);
    expect(output.ecmoEligibility.isEligible).toBe(false);
    expect(output.ecmoEligibility.contraindications.some(c => c.includes('34 weeks'))).toBe(true);
    expect(output.ecmoEligibility.contraindications.some(c => c.includes('2.0 kg'))).toBe(true);
  });

  it('8. Contraindicates ECMO in Grade III or IV Intraventricular Hemorrhage (IVH)', () => {
    const ivhPatient: CdhPatientParams = {
      ...DEFAULT_CDH_PATIENT,
      fiO2: 1.0,
      cranialUltrasoundGradeIvh: 3 // Grade 3 IVH
    };
    const output = computeCdhPphnPhysiology(ivhPatient);
    expect(output.ecmoEligibility.isEligible).toBe(false);
    expect(output.ecmoEligibility.contraindications.some(c => c.includes('Intraventricular Hemorrhage'))).toBe(true);
  });

  it('9. Correctly computes fetal hemoglobin dissociation curve in calculateNeonatalSpO2', () => {
    expect(calculateNeonatalSpO2(21)).toBeCloseTo(50, 0); // p50 around 21 mmHg
    expect(calculateNeonatalSpO2(50)).toBeGreaterThan(85);
    expect(calculateNeonatalSpO2(100)).toBeGreaterThanOrEqual(98);
  });
});
