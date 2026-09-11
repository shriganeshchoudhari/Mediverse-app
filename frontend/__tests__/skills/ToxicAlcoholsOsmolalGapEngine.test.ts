import {
  computeCalculatedOsmolality,
  evaluateToxicAlcoholKinetics,
  TOXIC_ALCOHOL_PRESETS,
} from '../../.gemini/skills/ToxicAlcoholsOsmolalGapEngine';

describe('ToxicAlcoholsOsmolalGapEngine', () => {
  it('computes calculated serum osmolality with ethanol component correctly', () => {
    // Na = 140, Glucose = 90, BUN = 14, Ethanol = 46 mg/dL
    // Calc = 280 + 5 + 5 + 10 = 300 mOsm/kg
    const calc = computeCalculatedOsmolality(140, 90, 14, 46);
    expect(calc).toBeCloseTo(300, 0);
  });

  it('detects early methanol ingestion with prominent osmolal gap and minimal acidosis', () => {
    const earlyMethanol = evaluateToxicAlcoholKinetics({
      substance: 'METHANOL',
      hoursPostIngestion: 2,
      ingestedVolumeMl: 150,
      bodyWeightKg: 70,
      measuredOsmolalityMOsmKg: 355,
      sodiumMEqL: 140,
      chlorideMEqL: 104,
      bicarbonateMEqL: 22,
      glucoseMgDl: 100,
      bunMgDl: 14,
      ethanolMgDl: 0,
      fomepizoleAdministered: false,
      folicAcidOrThiamineB6Given: false,
      hemodialysisActive: false,
    });

    expect(earlyMethanol.osmolalGapMOsmKg).toBeGreaterThan(50);
    expect(earlyMethanol.anionGapMEqL).toBeLessThanOrEqual(16);
    expect(earlyMethanol.visualImpairmentGrade).toBe('NONE');
    expect(earlyMethanol.fomepizoleLoadingDoseMg).toBe(1050); // 15 mg/kg * 70 kg
    expect(earlyMethanol.adjunctiveCofactors[0]).toMatch(/Folic Acid|Leucovorin/i);
  });

  it('identifies late methanol toxicity with severe HAGMA, blindness, and hemodialysis indication', () => {
    const lateMethanol = evaluateToxicAlcoholKinetics({
      substance: 'METHANOL',
      hoursPostIngestion: 18,
      ingestedVolumeMl: 200,
      bodyWeightKg: 70,
      measuredOsmolalityMOsmKg: 308,
      sodiumMEqL: 138,
      chlorideMEqL: 100,
      bicarbonateMEqL: 8,
      glucoseMgDl: 110,
      bunMgDl: 18,
      ethanolMgDl: 0,
      fomepizoleAdministered: false,
      folicAcidOrThiamineB6Given: false,
      hemodialysisActive: false,
    });

    expect(lateMethanol.anionGapMEqL).toBe(30); // 138 - (100 + 8) = 30
    expect(lateMethanol.arterialPh).toBeLessThan(7.25);
    expect(lateMethanol.visualImpairmentGrade).toBe('SNOWSTORM_BLINDNESS');
    expect(lateMethanol.hemodialysisIndicated).toBe(true);
    expect(lateMethanol.urgentActionChecklist.some((a) => /Hemodialysis/i.test(a))).toBe(true);
  });

  it('accurately evaluates ethylene glycol antifreeze poisoning with oxalate crystals and AKI', () => {
    const eg = evaluateToxicAlcoholKinetics({
      substance: 'ETHYLENE_GLYCOL',
      hoursPostIngestion: 10,
      ingestedVolumeMl: 250,
      bodyWeightKg: 75,
      measuredOsmolalityMOsmKg: 330,
      sodiumMEqL: 142,
      chlorideMEqL: 102,
      bicarbonateMEqL: 10,
      glucoseMgDl: 120,
      bunMgDl: 34,
      ethanolMgDl: 0,
      fomepizoleAdministered: false,
      folicAcidOrThiamineB6Given: false,
      hemodialysisActive: false,
    });

    expect(eg.anionGapMEqL).toBe(30);
    expect(eg.calciumOxalateCrystalsPresent).toBe(true);
    expect(eg.woodsLampUrineFluorescence).toBe(true);
    expect(eg.acuteKidneyInjuryStage).toMatch(/STAGE_2|STAGE_3/i);
    expect(eg.adjunctiveCofactors.some((c) => /Thiamine/i.test(c))).toBe(true);
    expect(eg.adjunctiveCofactors.some((c) => /Pyridoxine/i.test(c))).toBe(true);
  });

  it('differentiates isopropanol: large osmolal gap but NORMAL anion gap and NO fomepizole needed', () => {
    const isopropanol = evaluateToxicAlcoholKinetics({
      substance: 'ISOPROPANOL',
      hoursPostIngestion: 4,
      ingestedVolumeMl: 200,
      bodyWeightKg: 70,
      measuredOsmolalityMOsmKg: 348,
      sodiumMEqL: 140,
      chlorideMEqL: 104,
      bicarbonateMEqL: 24,
      glucoseMgDl: 95,
      bunMgDl: 12,
      ethanolMgDl: 0,
      fomepizoleAdministered: false,
      folicAcidOrThiamineB6Given: false,
      hemodialysisActive: false,
    });

    expect(isopropanol.osmolalGapMOsmKg).toBeGreaterThan(50);
    expect(isopropanol.anionGapMEqL).toBe(12); // Normal AG!
    expect(isopropanol.arterialPh).toBeGreaterThanOrEqual(7.35);
    expect(isopropanol.visualImpairmentGrade).toBe('NONE');
    expect(isopropanol.hemodialysisIndicated).toBe(false);
    expect(isopropanol.adjunctiveCofactors.some((c) => /NOT recommended/i.test(c))).toBe(true);
  });
});
