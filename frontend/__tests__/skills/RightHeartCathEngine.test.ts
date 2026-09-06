import {
  evaluateRightHeartCath,
  calculateBsa,
  estimateVo2,
  RHC_PRESETS,
  RhcPressures,
  FickParameters,
} from '../../.gemini/skills/RightHeartCathEngine';

describe('RightHeartCathEngine', () => {
  it('calculates DuBois BSA and VO2 accurately', () => {
    const bsa = calculateBsa(178, 78);
    expect(bsa).toBeCloseTo(1.97, 1);

    const fick: FickParameters = {
      hemoglobinGPerDl: 14,
      arterialO2SaturationPct: 98,
      mixedVenousO2SaturationPct: 75,
      vo2Method: 'MEASURED',
      measuredVo2MlMin: 250,
      patientAge: 40,
      patientSex: 'MALE',
      patientHeightCm: 178,
      patientWeightKg: 78,
      heartRateBpm: 70,
    };
    const vo2 = estimateVo2(fick, bsa);
    expect(vo2).toBe(250);
  });

  it('evaluates normal baseline pulmonary hemodynamics', () => {
    const normal = RHC_PRESETS[0];
    const result = evaluateRightHeartCath(normal.pressures, normal.fick);

    expect(result.hasPulmonaryHypertension).toBe(false);
    expect(result.phenotype).toBe('NO_PULMONARY_HYPERTENSION');
    expect(result.pvrWoodUnits).toBeLessThan(2.0);
    expect(result.pulmonaryArteryPulsatilityIndex).toBeGreaterThan(2.0);
    expect(result.rvFailureRisk).toBe('LOW');
  });

  it('identifies Pre-Capillary PH (Group 1 PAH) with elevated PVR', () => {
    const ipah = RHC_PRESETS[1];
    const result = evaluateRightHeartCath(ipah.pressures, ipah.fick);

    expect(result.hasPulmonaryHypertension).toBe(true);
    expect(result.phenotype).toBe('PRE_CAPILLARY_PH');
    expect(result.pvrWoodUnits).toBeGreaterThan(5.0);
    expect(result.transpulmonaryGradientMmHg).toBeGreaterThan(20);
    expect(result.suggestedClinicalGroup).toBe('GROUP_1_PAH');
  });

  it('evaluates acute vasoreactivity positive responder (Sitbon criteria)', () => {
    const vasoPreset = RHC_PRESETS[2];
    const result = evaluateRightHeartCath(vasoPreset.pressures, vasoPreset.fick, vasoPreset.vaso);

    expect(result.vasoreactiveResponder).toBe(true);
    expect(result.vasoreactivitySummary).toContain('POSITIVE VASOREACTIVE RESPONDER');
    expect(result.treatmentRecommendation).toContain('Calcium Channel Blocker');
  });

  it('identifies Isolated Post-Capillary PH (Ipc-PH)', () => {
    const hfpef = RHC_PRESETS[3];
    const result = evaluateRightHeartCath(hfpef.pressures, hfpef.fick);

    expect(result.hasPulmonaryHypertension).toBe(true);
    expect(result.phenotype).toBe('ISOLATED_POST_CAPILLARY_PH');
    expect(result.pvrWoodUnits).toBeLessThanOrEqual(2.0);
    expect(result.diastolicPulmonaryGradientMmHg).toBeLessThan(7);
    expect(result.treatmentRecommendation).toContain('Targeted PAH therapy');
  });

  it('identifies Combined Post- and Pre-Capillary PH (Cpc-PH)', () => {
    const mr = RHC_PRESETS[4];
    const result = evaluateRightHeartCath(mr.pressures, mr.fick);

    expect(result.hasPulmonaryHypertension).toBe(true);
    expect(result.phenotype).toBe('COMBINED_POST_AND_PRE_CAPILLARY_PH');
    expect(result.pvrWoodUnits).toBeGreaterThan(2.0);
    expect(result.transpulmonaryGradientMmHg).toBeGreaterThan(12);
  });

  it('detects severe RV failure in cardiogenic shock by PAPi and RAP', () => {
    const shock = RHC_PRESETS[7];
    const result = evaluateRightHeartCath(shock.pressures, shock.fick);

    expect(result.pulmonaryArteryPulsatilityIndex).toBeLessThan(1.0);
    expect(result.rvFailureRisk).toBe('SEVERE_RV_FAILURE');
    expect(result.cardiacIndexLMinM2).toBeLessThan(2.0);
  });
});
