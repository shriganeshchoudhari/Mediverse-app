import {
  evaluateRenalTubularAcidosis,
  SerumElectrolytesInput,
  UrineElectrolytesInput,
} from '../../.gemini/skills/RenalTubularAcidosisEngine';

describe('RenalTubularAcidosisEngine Tests', () => {
  it('identifies Distal RTA (Type 1) with alkaline urine, positive UAG, and hypokalemia', () => {
    const serum: SerumElectrolytesInput = {
      sodiumMeqL: 140,
      potassiumMeqL: 3.1, // Hypokalemia
      chlorideMeqL: 114,
      bicarbonateMeqL: 16,
      arterialPh: 7.28,
      pco2MmHg: 34,
      creatinineMgDl: 1.0,
    };

    const urine: UrineElectrolytesInput = {
      urineSodiumMeqL: 50,
      urinePotassiumMeqL: 30,
      urineChlorideMeqL: 45, // UAG = 50 + 30 - 45 = +35 (Positive)
      urinePh: 6.8, // Inability to acidify urine (> 5.3)
      measuredUrineOsmolalityMOsmKg: 350,
      urineUreaNitrogenMgDl: 300,
      urineGlucoseMgDl: 0,
      urineCreatinineMgDl: 80,
    };

    const result = evaluateRenalTubularAcidosis(serum, urine);
    expect(result.diagnosis).toBe('DISTAL_RTA_TYPE_1');
    expect(result.urineAnionGap).toBe(35);
    expect(result.isAmmoniumExcretionImpaired).toBe(true);
    expect(result.recommendedTherapy.firstLineDrug).toContain('Potassium Citrate');
    expect(result.pathophysiologicalMechanism).toContain('alpha-intercalated cell');
  });

  it('differentiates secretory diarrhea from RTA via negative UAG and brisk NH4+ excretion', () => {
    const serum: SerumElectrolytesInput = {
      sodiumMeqL: 138,
      potassiumMeqL: 3.2,
      chlorideMeqL: 116,
      bicarbonateMeqL: 14,
      arterialPh: 7.26,
      pco2MmHg: 30,
      creatinineMgDl: 1.1,
    };

    const urine: UrineElectrolytesInput = {
      urineSodiumMeqL: 25,
      urinePotassiumMeqL: 20,
      urineChlorideMeqL: 85, // UAG = 25 + 20 - 85 = -40 (Negative)
      urinePh: 4.9, // Acidified (< 5.3)
      measuredUrineOsmolalityMOsmKg: 520,
      urineUreaNitrogenMgDl: 420,
      urineGlucoseMgDl: 0,
      urineCreatinineMgDl: 100,
    };

    const result = evaluateRenalTubularAcidosis(serum, urine);
    expect(result.diagnosis).toBe('DIARRHEA_GI_BICARB_LOSS');
    expect(result.urineAnionGap).toBe(-40);
    expect(result.urineOsmolalGap).toBeGreaterThan(150);
    expect(result.estimatedUrineAmmoniumMeqL).toBeGreaterThan(100);
  });

  it('detects Hyperkalemic RTA (Type 4) with hyperkalemia and low urine pH', () => {
    const serum: SerumElectrolytesInput = {
      sodiumMeqL: 136,
      potassiumMeqL: 5.8, // Hyperkalemia
      chlorideMeqL: 110,
      bicarbonateMeqL: 17,
      arterialPh: 7.30,
      pco2MmHg: 35,
      creatinineMgDl: 1.6,
    };

    const urine: UrineElectrolytesInput = {
      urineSodiumMeqL: 40,
      urinePotassiumMeqL: 18,
      urineChlorideMeqL: 35, // UAG = 40 + 18 - 35 = +23
      urinePh: 5.1, // Distal H+ pumps intact (pH <= 5.3)
      measuredUrineOsmolalityMOsmKg: 380,
      urineUreaNitrogenMgDl: 350,
      urineGlucoseMgDl: 0,
      urineCreatinineMgDl: 90,
    };

    const result = evaluateRenalTubularAcidosis(serum, urine);
    expect(result.diagnosis).toBe('HYPERKALEMIC_RTA_TYPE_4');
    expect(result.hypokalemiaOrHyperkalemia).toBe('HYPERKALEMIA');
    expect(result.recommendedTherapy.firstLineDrug).toContain('Loop Diuretic');
    expect(
      result.recommendedTherapy.contraindicatedDrugs.some((d) => d.includes('Spironolactone'))
    ).toBe(true);
  });

  it('recognizes Proximal RTA (Type 2) with massive FE_HCO3 wasting', () => {
    const serum: SerumElectrolytesInput = {
      sodiumMeqL: 138,
      potassiumMeqL: 3.3,
      chlorideMeqL: 112,
      bicarbonateMeqL: 18,
      arterialPh: 7.32,
      pco2MmHg: 36,
      creatinineMgDl: 1.0,
    };

    const urine: UrineElectrolytesInput = {
      urineSodiumMeqL: 60,
      urinePotassiumMeqL: 35,
      urineChlorideMeqL: 75,
      urinePh: 6.5,
      measuredUrineOsmolalityMOsmKg: 400,
      urineUreaNitrogenMgDl: 320,
      urineGlucoseMgDl: 120, // Glucosuria with normal serum glucose (Fanconi)
      urineCreatinineMgDl: 30,
      urineBicarbonateMeqL: 120, // High urine HCO3-
    };

    const result = evaluateRenalTubularAcidosis(serum, urine);
    expect(result.diagnosis).toBe('PROXIMAL_RTA_TYPE_2');
    expect(result.fractionalExcretionBicarbonatePercent).toBeGreaterThan(15);
    expect(result.recommendedTherapy.firstLineDrug).toContain('High-Dose Oral Alkali');
  });
});
