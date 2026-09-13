import {
  simulateCriticalCareOmnisuite,
  OmnisuitePatientParams,
} from '../../.gemini/skills/CriticalCareOmnisuiteEngine';

describe('CriticalCareOmnisuiteEngine - Whole-Body Multi-Organ Critical Care Capstone', () => {
  const baseParams: OmnisuitePatientParams = {
    scenario: 'CARDIOGENIC_SHOCK_HARLEQUIN_ECMO',
    eclsConfig: 'VA_ECMO_PERIPHERAL',
    ecmoFlowLpm: 4.5,
    impellaPLevel: 0,
    vasopressor: 'NOREPINEPHRINE_MONOTHERAPY',
    norepinephrineDoseMcgKgMin: 0.2,
    ventilationMode: 'LUNG_PROTECTIVE_LOW_VT',
    peepCmH2O: 10,
    fio2Percent: 60,
    tidalVolumeMlPerKgPbw: 6,
    cumulativeFluidBalanceLiters: 3,
    hyperosmolarTherapyActive: false,
    evdOpenDrain: false,
    patientWeightKg: 70,
  };

  it('1. identifies cardiogenic shock with LV overdistension under peripheral VA-ECMO', () => {
    const result = simulateCriticalCareOmnisuite(baseParams);
    expect(result.leftVentricularAfterloadStress).toBe('SEVERE_DISTENSION_PULMONARY_FLOODING');
    expect(result.pulmonaryCapillaryWedgePressureMmHg).toBeGreaterThan(25);
    expect(result.multiOrganCriticalAlerts.some((a) => a.includes('LV OVERDISTENSION HAZARD'))).toBe(true);
  });

  it('2. demonstrates Impella microaxial unloading (ECPELLA) reverses LV overdistension', () => {
    const result = simulateCriticalCareOmnisuite({
      ...baseParams,
      eclsConfig: 'ECPELLA_VA_ECMO_PLUS_IMPELLA',
      impellaPLevel: 8,
    });
    expect(result.leftVentricularAfterloadStress).toBe('OPTIMAL_UNLOADED');
    expect(result.pulmonaryCapillaryWedgePressureMmHg).toBeLessThanOrEqual(18);
  });

  it('3. detects Harlequin syndrome with differential right radial vs femoral SpO2', () => {
    const result = simulateCriticalCareOmnisuite(baseParams);
    expect(result.harlequinNorthSouthSyndromePresent).toBe(true);
    expect(result.rightRadialPreDuctalSpO2Percent).toBeLessThan(80);
    expect(result.femoralPostDuctalSpO2Percent).toBe(100);
    expect(result.multiOrganCriticalAlerts.some((a) => a.includes('HARLEQUIN'))).toBe(true);
  });

  it('4. demonstrates VAV Hybrid ECMO upgrade cures cerebral hypoxia in Harlequin syndrome', () => {
    const result = simulateCriticalCareOmnisuite({
      ...baseParams,
      eclsConfig: 'VAV_HYBRID_HARLEQUIN_RESCUE',
    });
    expect(result.harlequinNorthSouthSyndromePresent).toBe(false);
    expect(result.rightRadialPreDuctalSpO2Percent).toBeGreaterThanOrEqual(95);
  });

  it('5. evaluates Polytrauma TBI with Monro-Kellie intracranial hypertension (ICP >= 25)', () => {
    const result = simulateCriticalCareOmnisuite({
      ...baseParams,
      scenario: 'POLYTRAUMA_TBI_MONRO_KELLIE',
      eclsConfig: 'NONE',
    });
    expect(result.intracranialPressureMmHg).toBeGreaterThanOrEqual(25);
    expect(result.brainHerniationRisk).toBe('IMMINENT_UNCAL_HERNIATION');
    expect(result.multiOrganCriticalAlerts.some((a) => a.includes('IMMINENT BRAIN HERNIATION'))).toBe(true);
  });

  it('6. shows hyperosmolar therapy and EVD drainage reduce ICP and restore CPP', () => {
    const result = simulateCriticalCareOmnisuite({
      ...baseParams,
      scenario: 'POLYTRAUMA_TBI_MONRO_KELLIE',
      eclsConfig: 'NONE',
      norepinephrineDoseMcgKgMin: 0.5,
      hyperosmolarTherapyActive: true,
      evdOpenDrain: true,
    });
    expect(result.intracranialPressureMmHg).toBeLessThan(20);
    expect(result.cerebralPerfusionPressureMmHg).toBeGreaterThanOrEqual(60);
  });

  it('7. evaluates septic shock with fluid creep crystalloid overload causing Abdominal Compartment Syndrome', () => {
    const result = simulateCriticalCareOmnisuite({
      ...baseParams,
      scenario: 'SEPTIC_SHOCK_ARDS_FLUID_CREEP_ACS',
      cumulativeFluidBalanceLiters: 12, // severe fluid creep
    });
    expect(result.intraAbdominalPressureMmHg).toBeGreaterThanOrEqual(20);
    expect(result.abdominalCompartmentSyndrome).toBe(true);
    expect(result.multiOrganCriticalAlerts.some((a) => a.includes('ABDOMINAL COMPARTMENT SYNDROME'))).toBe(true);
  });

  it('8. flags ventilator-induced lung injury (VILI) risk when driving pressure is excessive', () => {
    const result = simulateCriticalCareOmnisuite({
      ...baseParams,
      ventilationMode: 'SPONTANEOUS_BREATHING',
      peepCmH2O: 5,
      tidalVolumeMlPerKgPbw: 9, // unprotective
    });
    expect(result.ventilatorInducedLungInjuryRisk).toBe('CRITICAL_VILI_HAZARD');
    expect(result.drivingPressureCmH2O).toBeGreaterThan(15);
  });

  it('9. demonstrates ultra-protective rest-lung ventilation under ECMO reduces driving pressure', () => {
    const result = simulateCriticalCareOmnisuite({
      ...baseParams,
      ventilationMode: 'ULTRA_PROTECTIVE_REST_LUNG_ECMO',
      peepCmH2O: 10,
    });
    expect(result.ventilatorInducedLungInjuryRisk).toBe('LOW_LUNG_PROTECTIVE');
    expect(result.drivingPressureCmH2O).toBeLessThanOrEqual(8);
  });

  it('10. evaluates Massive PE RV failure with elevated CVP and inotropic response', () => {
    const result = simulateCriticalCareOmnisuite({
      ...baseParams,
      scenario: 'MASSIVE_PE_RV_FAILURE',
      eclsConfig: 'NONE',
      vasopressor: 'EPINEPHRINE_INOTROPIC_RESCUE',
    });
    expect(result.centralVenousPressureMmHg).toBeGreaterThanOrEqual(18);
    expect(result.meanArterialPressure).toBeGreaterThanOrEqual(60);
  });
});
