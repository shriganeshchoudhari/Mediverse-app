import {
  evaluateSep1Compliance,
  calculateAntibioticPkPd,
  evaluateProcalcitoninKinetics,
  PatientSepsisVitals,
  Sep1BundleChecklist,
  AntibioticPkPdDosingInput,
} from '../../.gemini/skills/SepsisAntibioticPkPdEngine';

describe('SepsisAntibioticPkPdEngine Tests', () => {
  it('evaluates SEP-1 Hour-1 bundle compliance and catches delayed antibiotics', () => {
    const septicShockPatient: PatientSepsisVitals = {
      weightKg: 80,
      creatinineClearanceMlMin: 95,
      systolicBpMmHg: 80,
      meanArterialPressureMmHg: 56, // Hypotensive (MAP < 65)
      heartRateBpm: 124,
      serumLactateMmolL: 4.5, // High lactate (>= 4.0)
      baselineProcalcitoninMcgL: 8.5,
      currentProcalcitoninMcgL: 6.2,
      isNorepinephrineInfusing: false,
      norepinephrineDoseMcgKgMin: 0,
      isVasopressinInfusing: false,
    };

    const incompleteBundle: Sep1BundleChecklist = {
      serumLactateMeasuredInitial: true,
      bloodCulturesDrawnBeforeAntibiotics: true,
      broadSpectrumAntibioticsAdministeredWithin1Hour: false, // Missed 1-hour window!
      crystalloid30MlPerKgCompleted: false, // 2400 mL not yet completed
      repeatLactateWithin2To4Hours: false,
      dynamicFluidResponsivenessAssessed: false,
    };

    const result = evaluateSep1Compliance(septicShockPatient, incompleteBundle);
    expect(result.isCompliant).toBe(false);
    expect(result.fluidVolumeRequiredMl).toBe(2400); // 80 * 30
    expect(result.failedElements.some((e) => e.includes('1 hour of sepsis recognition'))).toBe(true);
    expect(result.clinicalActionAlerts.some((a) => a.includes('Norepinephrine'))).toBe(true);
  });

  it('demonstrates that extended infusion of beta-lactams overcomes augmented renal clearance (ARC)', () => {
    const arcPatient: PatientSepsisVitals = {
      weightKg: 75,
      creatinineClearanceMlMin: 160, // Augmented renal clearance
      systolicBpMmHg: 110,
      meanArterialPressureMmHg: 78,
      heartRateBpm: 92,
      serumLactateMmolL: 1.8,
      baselineProcalcitoninMcgL: 4.2,
      currentProcalcitoninMcgL: 3.5,
      isNorepinephrineInfusing: false,
      norepinephrineDoseMcgKgMin: 0,
      isVasopressinInfusing: false,
    };

    // Standard short infusion (0.5 hour)
    const shortInfusionPipTazo: AntibioticPkPdDosingInput = {
      drugName: 'Piperacillin-Tazobactam',
      antibioticClass: 'BETA_LACTAM_TIME_DEPENDENT',
      doseMg: 3375,
      dosingIntervalHours: 6,
      infusionDurationHours: 0.5,
      pathogenMicMgL: 16,
    };

    const shortResult = calculateAntibioticPkPd(arcPatient, shortInfusionPipTazo);
    expect(shortResult.isTargetAttained).toBe(false);
    expect(shortResult.augmentedRenalClearanceHazard).toBe(true);

    // Extended infusion (4.0 hours)
    const extendedInfusionPipTazo: AntibioticPkPdDosingInput = {
      ...shortInfusionPipTazo,
      doseMg: 4500,
      infusionDurationHours: 4.0,
    };

    const extendedResult = calculateAntibioticPkPd(arcPatient, extendedInfusionPipTazo);
    expect(extendedResult.simulatedValue).toBeGreaterThan(shortResult.simulatedValue);
  });

  it('calculates aminoglycoside Cmax/MIC ratio and guides concentration-dependent killing', () => {
    const patient: PatientSepsisVitals = {
      weightKg: 70,
      creatinineClearanceMlMin: 85,
      systolicBpMmHg: 105,
      meanArterialPressureMmHg: 72,
      heartRateBpm: 88,
      serumLactateMmolL: 1.6,
      baselineProcalcitoninMcgL: 3.0,
      currentProcalcitoninMcgL: 2.1,
      isNorepinephrineInfusing: false,
      norepinephrineDoseMcgKgMin: 0,
      isVasopressinInfusing: false,
    };

    const amikacinDose: AntibioticPkPdDosingInput = {
      drugName: 'Amikacin',
      antibioticClass: 'AMINOGLYCOSIDE_CONC_DEPENDENT',
      doseMg: 1400, // 20 mg/kg
      dosingIntervalHours: 24,
      infusionDurationHours: 1.0,
      pathogenMicMgL: 4.0,
    };

    const result = calculateAntibioticPkPd(patient, amikacinDose);
    expect(result.indexType).toBe('CMAX_TO_MIC');
    expect(result.simulatedValue).toBeGreaterThanOrEqual(8.0); // Therapeutic peak
    expect(result.isTargetAttained).toBe(true);
  });

  it('evaluates procalcitonin kinetic drop to guide safe antibiotic de-escalation', () => {
    // 85% drop from baseline of 12.0 to 1.8 mcg/L
    const pctResult = evaluateProcalcitoninKinetics(12.0, 1.8);
    expect(pctResult.procalcitoninDropPercent).toBe(85);
    expect(pctResult.isDeEscalationSafe).toBe(true);
    expect(pctResult.recommendation).toContain('Safe to de-escalate');

    // Inadequate drop (only 25% drop from 10.0 to 7.5 mcg/L)
    const inadequatePct = evaluateProcalcitoninKinetics(10.0, 7.5);
    expect(inadequatePct.isDeEscalationSafe).toBe(false);
    expect(inadequatePct.recommendation).toContain('Treatment non-response');
  });
});
