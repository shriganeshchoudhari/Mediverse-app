import {
  simulateHighSpinalHemodynamics,
  HighSpinalParams,
} from '../../.gemini/skills/HighSpinalEngine';

describe('HighSpinalEngine - Biophysical High & Total Spinal Simulation', () => {
  const baseParams: HighSpinalParams = {
    blockLevel: 'L5_S1',
    bromageScore: 3,
    minutesSinceInjection: 15,
    localAnestheticType: 'HYPERBARIC_BUPIVACAINE',
    ivFluidInfusedMl: 500,
    pressorAdministered: 'NONE',
    vagolyticAdministered: 'NONE',
    positioning: 'HEAD_NEUTRAL_LEGS_ELEVATED',
    airwayManagement: 'NONE_ROOM_AIR',
    weightKg: 70,
    baselineHeartRate: 75,
    baselineMap: 90,
  };

  it('1. maintains hemodynamic stability and clear vocalization at L5-S1 lumbar block', () => {
    const result = simulateHighSpinalHemodynamics(baseParams);
    expect(result.meanArterialPressure).toBeGreaterThanOrEqual(75);
    expect(result.heartRate).toBeGreaterThanOrEqual(70);
    expect(result.phrenicNerveDiaphragmExcursionPercent).toBe(100);
    expect(result.vocalizationStatus).toBe('CLEAR_SPEECH');
    expect(result.consciousnessLevel).toBe('ALERT_COGNIZANT');
    expect(result.bezoldJarischRisk).toBe('LOW');
  });

  it('2. demonstrates mild sympathectomy with preserved cardioaccelerator and phrenic function at T10', () => {
    const result = simulateHighSpinalHemodynamics({
      ...baseParams,
      blockLevel: 'T10_UMBILICUS',
      positioning: 'SUPINE_FLAT',
      ivFluidInfusedMl: 200,
    });
    expect(result.meanArterialPressure).toBeLessThan(baseParams.baselineMap);
    expect(result.phrenicNerveDiaphragmExcursionPercent).toBe(100);
    expect(result.vocalizationStatus).toBe('CLEAR_SPEECH');
    expect(result.safetyScore).toBeGreaterThanOrEqual(80);
  });

  it('3. blocks cardiac accelerator fibers (T1-T4) at T4 nipple level causing bradycardia and whispering', () => {
    const result = simulateHighSpinalHemodynamics({
      ...baseParams,
      blockLevel: 'T4_NIPPLE_CARDIAC_SYMPATHECTOMY',
    });
    expect(result.heartRate).toBeLessThan(65);
    expect(result.vocalizationStatus).toBe('DIFFICULT_WHISPER');
    expect(result.warnings.some((w) => w.includes('EARLY CLINICAL WARNING SIGN'))).toBe(true);
  });

  it('4. triggers Bezold-Jarisch Reflex (BJR) critical asystolic risk when underfilled in high spinal', () => {
    const result = simulateHighSpinalHemodynamics({
      ...baseParams,
      blockLevel: 'T4_NIPPLE_CARDIAC_SYMPATHECTOMY',
      ivFluidInfusedMl: 100, // severely underfilled
      positioning: 'REVERSE_TRENDELENBURG', // worse pooling
    });
    expect(result.bezoldJarischRisk).toBe('CRITICAL_ASYSTOLIC_ARREST');
    expect(result.centralVenousPressureMmHg).toBeLessThan(3.5);
    expect(result.warnings.some((w) => w.includes('BEZOLD-JARISCH REFLEX ACTIVE'))).toBe(true);
  });

  it('5. identifies Phenylephrine reflex bradycardia hazard in T4 block', () => {
    const result = simulateHighSpinalHemodynamics({
      ...baseParams,
      blockLevel: 'T4_NIPPLE_CARDIAC_SYMPATHECTOMY',
      pressorAdministered: 'PHENYLEPHRINE_BOLUS',
      ivFluidInfusedMl: 200,
    });
    expect(result.phenylephrineReflexBradycardiaHazard).toBe(true);
    expect(result.warnings.some((w) => w.includes('PRESSOR CONTRAINDICATION TRAP'))).toBe(true);
    expect(result.safetyScore).toBeLessThanOrEqual(50);
  });

  it('6. demonstrates Epinephrine restores heart rate, inotropy, and MAP during high block', () => {
    const result = simulateHighSpinalHemodynamics({
      ...baseParams,
      blockLevel: 'T4_NIPPLE_CARDIAC_SYMPATHECTOMY',
      pressorAdministered: 'EPINEPHRINE_LOW_DOSE',
    });
    expect(result.heartRate).toBeGreaterThanOrEqual(80);
    expect(result.strokeVolumeMl).toBeGreaterThan(60);
    expect(result.phenylephrineReflexBradycardiaHazard).toBe(false);
  });

  it('7. shows Atropine effectively reverses vagal predominance and elevates heart rate', () => {
    const result = simulateHighSpinalHemodynamics({
      ...baseParams,
      blockLevel: 'T4_NIPPLE_CARDIAC_SYMPATHECTOMY',
      vagolyticAdministered: 'ATROPINE_0_5_1MG',
    });
    expect(result.heartRate).toBeGreaterThanOrEqual(75);
    expect(result.safetyScore).toBeGreaterThanOrEqual(70);
  });

  it('8. flags steep Trendelenburg positioning with hyperbaric LA within 20 mins as cephalad spread hazard', () => {
    const result = simulateHighSpinalHemodynamics({
      ...baseParams,
      blockLevel: 'T6_XIPHOID',
      positioning: 'STEEP_TRENDELENBURG',
      minutesSinceInjection: 8,
      localAnestheticType: 'HYPERBARIC_BUPIVACAINE',
    });
    expect(result.trendelenburgCephaladSpreadHazard).toBe(true);
    expect(result.warnings.some((w) => w.includes('LETHAL GRAVITATIONAL DISASTER'))).toBe(true);
  });

  it('9. identifies C3 phrenic nerve arrest causing diaphragmatic paralysis and aphonia', () => {
    const result = simulateHighSpinalHemodynamics({
      ...baseParams,
      blockLevel: 'C3_PHRENIC_DIAPHRAGM_ARREST',
      airwayManagement: 'NONE_ROOM_AIR',
    });
    expect(result.phrenicNerveDiaphragmExcursionPercent).toBeLessThanOrEqual(15);
    expect(result.vocalizationStatus).toBe('APHONIC_SILENT');
    expect(result.airwayCompromiseUrgent).toBe(true);
    expect(result.spO2Percent).toBeLessThan(70);
  });

  it('10. handles total spinal anesthesia with unconsciousness, fixed dilated pupils, and intubation rescue', () => {
    const result = simulateHighSpinalHemodynamics({
      ...baseParams,
      blockLevel: 'TOTAL_SPINAL_BRAINSTEM_APNEA',
      airwayManagement: 'ENDOTRACHEAL_INTUBATION_VENTILATED',
      pressorAdministered: 'EPINEPHRINE_LOW_DOSE',
      ivFluidInfusedMl: 1500,
    });
    expect(result.consciousnessLevel).toBe('UNCONSCIOUS_APNEIC');
    expect(result.pupilState).toBe('FIXED_DILATED_TOTAL_SPINAL');
    expect(result.minuteVentilationLpm).toBe(7.0);
    expect(result.spO2Percent).toBe(100);
    expect(result.warnings.some((w) => w.includes('TOTAL SPINAL ANESTHESIA DECLARED'))).toBe(true);
  });
});
