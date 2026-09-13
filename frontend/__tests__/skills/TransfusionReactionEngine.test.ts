import {
  simulateTransfusionReaction,
  TransfusionParams,
} from '../../.gemini/skills/TransfusionReactionEngine';

describe('TransfusionReactionEngine - AHTR & TRALI vs TACO Simulation', () => {
  const baseParams: TransfusionParams = {
    reactionType: 'ACUTE_HEMOLYTIC_ABO',
    bloodProduct: 'PRBC_PACKED_RED_CELLS',
    volumeInfusedMl: 100,
    infusionRateMlPerHour: 150,
    patientAction: 'STOP_TRANSFUSION_DISCONNECT_TUBING',
    furosemideDoseMg: 0,
    ivSalineBolusMl: 500,
    sodiumBicarbAdministered: true,
    epinephrineAdministered: false,
    preExistingCardiacFailure: false,
    patientWeightKg: 70,
  };

  it('1. identifies AHTR with positive DAT, depleted haptoglobin, free hemoglobin, and dark red urine', () => {
    const result = simulateTransfusionReaction(baseParams);
    expect(result.directAntiglobulinTest).toBe('POSITIVE_IGG_C3D');
    expect(result.serumHaptoglobinMgPerDl).toBeLessThan(10);
    expect(result.serumFreeHemoglobinMgPerDl).toBeGreaterThan(50);
    expect(result.urineColor).toBe('DARK_RED_COCA_COLA');
    expect(result.criticalAlerts.some((a) => a.includes('ACUTE HEMOLYTIC TRANSFUSION REACTION'))).toBe(true);
  });

  it('2. flags acute tubular necrosis risk when urine output is inadequate during AHTR', () => {
    const result = simulateTransfusionReaction({
      ...baseParams,
      ivSalineBolusMl: 0,
      sodiumBicarbAdministered: false,
    });
    expect(result.acuteKidneyInjuryRisk).toBe('SEVERE_ANURIC_ATN');
    expect(result.criticalAlerts.some((a) => a.includes('ACUTE TUBULAR NECROSIS THREAT'))).toBe(true);
    expect(result.criticalAlerts.some((a) => a.includes('ALKALINIZATION OMISSION'))).toBe(true);
  });

  it('3. correctly classifies TRALI with non-cardiogenic PCWP <= 18, exudative protein ratio > 0.65, and fever', () => {
    const result = simulateTransfusionReaction({
      ...baseParams,
      reactionType: 'TRALI_IMMUNE_LUNG_INJURY',
      bloodProduct: 'FFP_FRESH_FROZEN_PLASMA',
    });
    expect(result.pulmonaryCapillaryWedgePressureMmHg).toBeLessThanOrEqual(18);
    expect(result.edemaFluidPlasmaProteinRatio).toBeGreaterThan(0.65);
    expect(result.temperatureCelsius).toBeGreaterThanOrEqual(38.0);
    expect(result.criticalAlerts.some((a) => a.includes('TRALI CONFIRMED'))).toBe(true);
  });

  it('4. correctly classifies TACO with hydrostatic PCWP > 18, severe hypertension, and marked BNP surge', () => {
    const result = simulateTransfusionReaction({
      ...baseParams,
      reactionType: 'TACO_CIRCULATORY_OVERLOAD',
      preExistingCardiacFailure: true,
    });
    expect(result.pulmonaryCapillaryWedgePressureMmHg).toBeGreaterThan(18);
    expect(result.systolicBp).toBeGreaterThan(160);
    expect(result.bnpPgPerMl).toBeGreaterThan(1000);
    expect(result.edemaFluidPlasmaProteinRatio).toBeLessThan(0.50);
    expect(result.criticalAlerts.some((a) => a.includes('TACO CONFIRMED'))).toBe(true);
  });

  it('5. flags the lethal diuretic trap in TRALI as hypovolemic collapse', () => {
    const result = simulateTransfusionReaction({
      ...baseParams,
      reactionType: 'TRALI_IMMUNE_LUNG_INJURY',
      furosemideDoseMg: 40,
    });
    expect(result.diureticResponse).toBe('LETHAL_TRALI_HYPOVOLEMIC_CRASH');
    expect(result.criticalAlerts.some((a) => a.includes('CONTRAINDICATION DISASTER'))).toBe(true);
    expect(result.immediateSafetyScore).toBeLessThanOrEqual(60);
  });

  it('6. demonstrates Furosemide provides appropriate hemodynamic relief in TACO', () => {
    const result = simulateTransfusionReaction({
      ...baseParams,
      reactionType: 'TACO_CIRCULATORY_OVERLOAD',
      furosemideDoseMg: 40,
    });
    expect(result.diureticResponse).toBe('APPROPRIATE_TACO_RELIEF');
    expect(result.pulmonaryCapillaryWedgePressureMmHg).toBeLessThan(20);
    expect(result.spO2Percent).toBeGreaterThan(90);
  });

  it('7. severely penalizes continuing transfusion without immediate cessation', () => {
    const result = simulateTransfusionReaction({
      ...baseParams,
      patientAction: 'CONTINUE_TRANSFUSION',
    });
    expect(result.criticalAlerts.some((a) => a.includes('LETHAL DELAY'))).toBe(true);
    expect(result.immediateSafetyScore).toBeLessThanOrEqual(50);
  });

  it('8. flags tubing flush error as disastrous secondary blood bolus', () => {
    const result = simulateTransfusionReaction({
      ...baseParams,
      patientAction: 'STOP_AND_FLUSH_TUBING_HAZARD',
    });
    expect(result.criticalAlerts.some((a) => a.includes('TUBING FLUSH DISASTER'))).toBe(true);
  });

  it('9. simulates severe anaphylaxis in IgA deficiency and demonstrates Epinephrine response', () => {
    const untreated = simulateTransfusionReaction({
      ...baseParams,
      reactionType: 'ANAPHYLAXIS_IGA_DEFICIENCY',
      epinephrineAdministered: false,
    });
    expect(untreated.systolicBp).toBeLessThan(80);
    expect(untreated.immediateSafetyScore).toBeLessThanOrEqual(65);

    const treated = simulateTransfusionReaction({
      ...baseParams,
      reactionType: 'ANAPHYLAXIS_IGA_DEFICIENCY',
      epinephrineAdministered: true,
    });
    expect(treated.systolicBp).toBeGreaterThanOrEqual(100);
  });

  it('10. verifies benign Febrile Non-Hemolytic Reaction (FNHTR) has negative DAT and preserved hemodynamics', () => {
    const result = simulateTransfusionReaction({
      ...baseParams,
      reactionType: 'FEBRILE_NON_HEMOLYTIC_FNHTR',
    });
    expect(result.directAntiglobulinTest).toBe('NEGATIVE');
    expect(result.temperatureCelsius).toBeGreaterThanOrEqual(38.0);
    expect(result.serumFreeHemoglobinMgPerDl).toBeLessThan(10);
    expect(result.immediateSafetyScore).toBe(100);
  });
});
