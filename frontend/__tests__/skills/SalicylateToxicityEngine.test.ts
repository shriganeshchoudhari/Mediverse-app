import {
  evaluateSalicylateCase,
  SALICYLATE_PRESETS,
} from '../../.gemini/skills/SalicylateToxicityEngine';

describe('SalicylateToxicityEngine', () => {
  it('correctly calculates mixed respiratory alkalosis and HAGMA in acute overdose', () => {
    // PaCO2 20 mmHg, HCO3 14 mEq/L -> pH = 6.1 + log10(14 / (0.03 * 20)) = 6.1 + log10(23.33) = 7.47
    const mixedCase = evaluateSalicylateCase({
      exposureType: 'ACUTE_OVERDOSE',
      serumSalicylateMgDl: 72,
      arterialPco2MmHg: 20,
      serumBicarbonateMeqL: 14,
      serumPotassiumMeqL: 4.2,
      urinePh: 6.0,
      patientWeightKg: 70,
      alteredMentalStatusOrSeizures: false,
      pulmonaryEdemaArds: false,
      bicarbonateInfusionActive: false,
    });

    expect(mixedCase.calculatedArterialPh).toBeGreaterThanOrEqual(7.45);
    expect(mixedCase.primaryAcidBaseDisorders.some((d) => /Respiratory Alkalosis/i.test(d))).toBe(true);
    expect(mixedCase.primaryAcidBaseDisorders.some((d) => /Metabolic Acidosis/i.test(d))).toBe(true);
    expect(mixedCase.anionGapMeqL).toBeGreaterThan(12);
    expect(mixedCase.clinicalActionChecklist.some((a) => /URINARY ALKALINIZATION/i.test(a))).toBe(true);
  });

  it('detects hypokalemic paradoxical aciduria preventing urinary alkalinization', () => {
    const hypokalemiaCase = evaluateSalicylateCase({
      exposureType: 'ACUTE_OVERDOSE',
      serumSalicylateMgDl: 65,
      arterialPco2MmHg: 24,
      serumBicarbonateMeqL: 20,
      serumPotassiumMeqL: 3.1, // Hypokalemic
      urinePh: 5.5, // Acidic urine despite bicarb
      patientWeightKg: 65,
      alteredMentalStatusOrSeizures: false,
      pulmonaryEdemaArds: false,
      bicarbonateInfusionActive: true,
    });

    expect(hypokalemiaCase.paradoxicalAciduriaPresent).toBe(true);
    expect(hypokalemiaCase.clinicalActionChecklist.some((a) => /PARADOXICAL ACIDURIA/i.test(a))).toBe(true);
    expect(hypokalemiaCase.clinicalActionChecklist.some((a) => /potassium repletion/i.test(a))).toBe(true);
  });

  it('triggers emergent hemodialysis per EXTRIP guidelines for level >= 100 mg/dL, seizures, and acidemia', () => {
    const extripCase = evaluateSalicylateCase({
      exposureType: 'ACUTE_OVERDOSE',
      serumSalicylateMgDl: 115,
      arterialPco2MmHg: 28,
      serumBicarbonateMeqL: 10,
      serumPotassiumMeqL: 4.4,
      urinePh: 6.2,
      patientWeightKg: 80,
      alteredMentalStatusOrSeizures: true,
      pulmonaryEdemaArds: true,
      bicarbonateInfusionActive: true,
    });

    expect(extripCase.hemodialysisRequiredExtrip).toBe(true);
    expect(extripCase.extripIndicationReasons.length).toBeGreaterThanOrEqual(3);
    expect(extripCase.clinicalActionChecklist.some((a) => /EMERGENT HEMODIALYSIS/i.test(a))).toBe(true);
  });

  it('identifies chronic geriatric salicylism with encephalopathy meeting dialysis criteria', () => {
    const chronicCase = evaluateSalicylateCase({
      exposureType: 'CHRONIC_INGESTION',
      serumSalicylateMgDl: 58,
      arterialPco2MmHg: 22,
      serumBicarbonateMeqL: 16,
      serumPotassiumMeqL: 3.8,
      urinePh: 6.5,
      patientWeightKg: 58,
      alteredMentalStatusOrSeizures: true,
      pulmonaryEdemaArds: false,
      bicarbonateInfusionActive: false,
    });

    expect(chronicCase.hemodialysisRequiredExtrip).toBe(true);
    expect(chronicCase.extripIndicationReasons.some((r) => /Altered mental status/i.test(r))).toBe(true);
  });

  it('models ion trapping: alkalinization dramatically accelerates renal clearance and limits non-ionized fraction', () => {
    const acidicUrine = evaluateSalicylateCase({
      exposureType: 'ACUTE_OVERDOSE',
      serumSalicylateMgDl: 50,
      arterialPco2MmHg: 25,
      serumBicarbonateMeqL: 18,
      serumPotassiumMeqL: 4.5,
      urinePh: 5.5,
      patientWeightKg: 70,
      alteredMentalStatusOrSeizures: false,
      pulmonaryEdemaArds: false,
      bicarbonateInfusionActive: false,
    });

    const alkalineUrine = evaluateSalicylateCase({
      exposureType: 'ACUTE_OVERDOSE',
      serumSalicylateMgDl: 50,
      arterialPco2MmHg: 25,
      serumBicarbonateMeqL: 18,
      serumPotassiumMeqL: 4.5,
      urinePh: 8.0,
      patientWeightKg: 70,
      alteredMentalStatusOrSeizures: false,
      pulmonaryEdemaArds: false,
      bicarbonateInfusionActive: true,
    });

    // Renal clearance at pH 8.0 is dramatically higher than at pH 5.5
    expect(alkalineUrine.renalSalicylateClearanceMlMin).toBeGreaterThan(
      acidicUrine.renalSalicylateClearanceMlMin * 5
    );
  });
});
