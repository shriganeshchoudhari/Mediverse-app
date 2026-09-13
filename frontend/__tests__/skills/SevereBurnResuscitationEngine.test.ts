import {
  simulateBurnResuscitation,
  BURN_PRESETS,
  BurnPatientParams,
} from '../../.gemini/skills/SevereBurnResuscitationEngine';

describe('SevereBurnResuscitationEngine', () => {
  const baseParams: BurnPatientParams = {
    weightKg: 70,
    tbsaPercentage: 40,
    hoursSinceBurnInjury: 2,
    selectedFormula: 'MODIFIED_BROOKE_2ML',
    inhalationInjury: 'NONE',
    circumferentialBurn: 'NONE',
    hourlyUrineOutputMl: 35,
    currentIvRateMlPerHour: 350,
    cumulativeCrystalloidInfusedMl: 1400,
    colloidRescue: 'NONE_CRYSTALLOID_ONLY',
    intraAbdominalPressureMmHg: 8,
    escharotomyPerformed: false,
    coHbPercent: 2,
  };

  it('1. correctly calculates Modified Brooke 2 mL/kg/%TBSA 24-hour volume', () => {
    // 2 * 70 * 40 = 5600 mL
    const result = simulateBurnResuscitation(baseParams);
    expect(result.totalCalculated24hVolumeMl).toBe(5600);
    expect(result.first8hTargetRateMlPerHour).toBe(350); // 2800 / 8 = 350
    expect(result.next16hTargetRateMlPerHour).toBe(175); // 2800 / 16 = 175
  });

  it('2. correctly calculates Parkland 4 mL/kg/%TBSA 24-hour volume', () => {
    // 4 * 70 * 40 = 11200 mL
    const params: BurnPatientParams = {
      ...baseParams,
      selectedFormula: 'PARKLAND_4ML',
    };
    const result = simulateBurnResuscitation(params);
    expect(result.totalCalculated24hVolumeMl).toBe(11200);
    expect(result.first8hTargetRateMlPerHour).toBe(700);
  });

  it('3. accounts for inhalation injury by expanding fluid requirements ~45%', () => {
    const params: BurnPatientParams = {
      ...baseParams,
      inhalationInjury: 'SEVERE_INHALATION_INJURY_AIRWAY_THREAT',
    };
    const result = simulateBurnResuscitation(params);
    expect(result.totalCalculated24hVolumeMl).toBeGreaterThan(5600 * 1.4);
    expect(result.inhalationAirwayThreat).toBe(true);
  });

  it('4. detects fluid creep when cumulative crystalloid exceeds 250 mL/kg', () => {
    const params: BurnPatientParams = {
      ...baseParams,
      cumulativeCrystalloidInfusedMl: 19000, // 19000 / 70 = 271 mL/kg (> 250)
      intraAbdominalPressureMmHg: 22,
    };
    const result = simulateBurnResuscitation(params);
    expect(result.fluidCreepHazardActive).toBe(true);
    expect(result.fluidCreepVolumePerKg).toBeGreaterThan(250);
  });

  it('5. classifies Abdominal Compartment Syndrome (ACS) with high bladder pressure', () => {
    const params: BurnPatientParams = {
      ...baseParams,
      cumulativeCrystalloidInfusedMl: 21000,
      intraAbdominalPressureMmHg: 24, // ACS!
    };
    const result = simulateBurnResuscitation(params);
    expect(result.abdominalCompartmentSyndromeRisk).toBe('FULL_ACS_LAPAROTOMY_MANDATED');
    expect(result.criticalAlerts.some((a) => a.includes('ABDOMINAL COMPARTMENT SYNDROME'))).toBe(true);
  });

  it('6. evaluates urine output adequacy targeting 0.5 mL/kg/hr', () => {
    // 70 kg * 0.5 = 35 mL/hr target
    const paramsOptimal: BurnPatientParams = { ...baseParams, hourlyUrineOutputMl: 35 };
    const resOptimal = simulateBurnResuscitation(paramsOptimal);
    expect(resOptimal.resuscitationAdequacy).toBe('OPTIMAL_TARGET_PERFUSION');

    const paramsOliguric: BurnPatientParams = { ...baseParams, hourlyUrineOutputMl: 15 };
    const resOliguric = simulateBurnResuscitation(paramsOliguric);
    expect(resOliguric.resuscitationAdequacy).toBe('UNDER_RESUSCITATED_AKI');
  });

  it('7. triggers severe inhalation airway emergency alert on smoke inhalation and high COHb', () => {
    const params: BurnPatientParams = {
      ...baseParams,
      inhalationInjury: 'SEVERE_INHALATION_INJURY_AIRWAY_THREAT',
      coHbPercent: 22,
    };
    const result = simulateBurnResuscitation(params);
    expect(result.inhalationAirwayThreat).toBe(true);
    expect(result.criticalAlerts.some((a) => a.includes('SEVERE INHALATION INJURY AIRWAY EMERGENCY'))).toBe(true);
  });

  it('8. triggers unrelieved circumferential eschar alert mandating escharotomy', () => {
    const params: BurnPatientParams = {
      ...baseParams,
      circumferentialBurn: 'CIRCUMFERENTIAL_TORSO',
      escharotomyPerformed: false,
    };
    const result = simulateBurnResuscitation(params);
    expect(result.escharotomyMandated).toBe(true);
    expect(result.criticalAlerts.some((a) => a.includes('UNRELIEVED CIRCUMFERENTIAL ESCHAR'))).toBe(true);
  });

  it('9. acknowledges colloid rescue mechanisms with early 5% albumin', () => {
    const params: BurnPatientParams = {
      ...baseParams,
      colloidRescue: 'EARLY_ALBUMIN_8_12H',
    };
    const result = simulateBurnResuscitation(params);
    expect(result.physiologicMechanisms.some((m) => m.includes('Colloid Rescue Mechanics'))).toBe(true);
  });

  it('10. validates all clinical presets accurately', () => {
    const resOpt = simulateBurnResuscitation(BURN_PRESETS.optimalBrookeResuscitation);
    expect(resOpt.resuscitationAdequacy).toBe('OPTIMAL_TARGET_PERFUSION');

    const resCreep = simulateBurnResuscitation(BURN_PRESETS.fluidCreepAbdominalCompartment);
    expect(resCreep.fluidCreepHazardActive).toBe(true);
    expect(resCreep.abdominalCompartmentSyndromeRisk).toBe('FULL_ACS_LAPAROTOMY_MANDATED');

    const resInhal = simulateBurnResuscitation(BURN_PRESETS.inhalationAirwayEmergency);
    expect(resInhal.inhalationAirwayThreat).toBe(true);

    const resEschar = simulateBurnResuscitation(BURN_PRESETS.circumferentialTorsoConstriction);
    expect(resEschar.escharotomyMandated).toBe(true);

    const resAlbumin = simulateBurnResuscitation(BURN_PRESETS.albuminColloidRescued);
    expect(resAlbumin.fluidCreepHazardActive).toBe(false);
  });
});
