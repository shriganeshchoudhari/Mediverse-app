import {
  evaluateHematologyMorphology,
  HEMATOLOGY_PRESETS,
  CompleteBloodCount,
  PeripheralDifferential,
  RbcMorphologyFeatures,
  BoneMarrowFeatures,
  MolecularCytogenetics,
  CairoBishopTlsParams,
} from '../../.gemini/skills/HematologyMorphologyEngine';

describe('HematologyMorphologyEngine', () => {
  it('evaluates normal blood smear and marrow correctly', () => {
    const normal = HEMATOLOGY_PRESETS[0];
    const result = evaluateHematologyMorphology(
      normal.cbc,
      normal.diff,
      normal.rbc,
      normal.marrow,
      normal.molecular,
      normal.tls
    );

    expect(result.category).toBe('NORMAL_PERIPHERAL_SMEAR');
    expect(result.myeloidToErythroidRatio).toBe(3.0);
    expect(result.isMeRatioNormal).toBe(true);
    expect(result.leukostasisRisk).toBe('NONE');
    expect(result.tumorLysisSyndromeStage).toBe('NONE');
    expect(result.emergencyActionRequired).toBe(false);
  });

  it('identifies Acute Promyelocytic Leukemia (APML) and mandates immediate ATRA', () => {
    const apml = HEMATOLOGY_PRESETS[1];
    const result = evaluateHematologyMorphology(
      apml.cbc,
      apml.diff,
      apml.rbc,
      apml.marrow,
      apml.molecular,
      apml.tls
    );

    expect(result.category).toBe('ACUTE_PROMYELOCYTIC_LEUKEMIA');
    expect(result.emergencyActionRequired).toBe(true);
    expect(result.recommendedAction).toContain('All-Trans Retinoic Acid (ATRA)');
    expect(result.confirmatoryWorkup).toContain('RT-PCR or FISH for PML-RARA t(15;17)');
  });

  it('detects leukostasis crisis and clinical TLS in AML with hyperleukocytosis', () => {
    const amlCrisis = HEMATOLOGY_PRESETS[2];
    const result = evaluateHematologyMorphology(
      amlCrisis.cbc,
      amlCrisis.diff,
      amlCrisis.rbc,
      amlCrisis.marrow,
      amlCrisis.molecular,
      amlCrisis.tls
    );

    expect(result.category).toBe('ACUTE_MYELOID_LEUKEMIA');
    expect(result.leukostasisRisk).toBe('IMMINENT_CRISIS');
    expect(result.tumorLysisSyndromeStage).toBe('CLINICAL_TLS');
    expect(result.emergencyActionRequired).toBe(true);
    expect(result.recommendedAction).toContain('LEUKOSTASIS CRISIS');
    expect(result.recommendedAction).toContain('Rasburicase');
  });

  it('identifies TTP microangiopathic hemolytic anemia with schistocytes', () => {
    const ttp = HEMATOLOGY_PRESETS[3];
    const result = evaluateHematologyMorphology(
      ttp.cbc,
      ttp.diff,
      ttp.rbc,
      ttp.marrow,
      ttp.molecular,
      ttp.tls
    );

    expect(result.category).toBe('MICROANGIOPATHIC_HEMOLYTIC_ANEMIA');
    expect(result.emergencyActionRequired).toBe(true);
    expect(result.recommendedAction).toContain('Therapeutic Plasma Exchange (TPE)');
    expect(result.recommendedAction).toContain('DO NOT transfuse platelets');
  });

  it('identifies Chronic Myeloid Leukemia with BCR-ABL1 fusion', () => {
    const cml = HEMATOLOGY_PRESETS[4];
    const result = evaluateHematologyMorphology(
      cml.cbc,
      cml.diff,
      cml.rbc,
      cml.marrow,
      cml.molecular,
      cml.tls
    );

    expect(result.category).toBe('CHRONIC_MYELOID_LEUKEMIA');
    expect(result.recommendedAction).toContain('Tyrosine Kinase Inhibitor (TKI');
    expect(result.confirmatoryWorkup).toContain(
      'Bone marrow cytogenetics: t(9;22)(q34.1;q11.2) Philadelphia chromosome'
    );
  });

  it('identifies Chronic Lymphocytic Leukemia with smudge cells', () => {
    const cll = HEMATOLOGY_PRESETS[5];
    const result = evaluateHematologyMorphology(
      cll.cbc,
      cll.diff,
      cll.rbc,
      cll.marrow,
      cll.molecular,
      cll.tls
    );

    expect(result.category).toBe('CHRONIC_LYMPHOCYTIC_LEUKEMIA');
    expect(result.morphologySummary).toContain('smudge/basket cells');
  });

  it('identifies Multiple Myeloma with Rouleaux and bone marrow plasmacytosis', () => {
    const mm = HEMATOLOGY_PRESETS[6];
    const result = evaluateHematologyMorphology(
      mm.cbc,
      mm.diff,
      mm.rbc,
      mm.marrow,
      mm.molecular,
      mm.tls
    );

    expect(result.category).toBe('MULTIPLE_MYELOMA');
    expect(result.morphologySummary).toContain('Rouleaux');
    expect(result.recommendedAction).toContain('CRAB criteria');
  });

  it('identifies Primary Myelofibrosis with tear-drop dacryocytes and marrow dry tap', () => {
    const pmf = HEMATOLOGY_PRESETS[7];
    const result = evaluateHematologyMorphology(
      pmf.cbc,
      pmf.diff,
      pmf.rbc,
      pmf.marrow,
      pmf.molecular,
      pmf.tls
    );

    expect(result.category).toBe('PRIMARY_MYELOFIBROSIS');
    expect(result.morphologySummary).toContain('tear-drop');
    expect(result.recommendedAction).toContain('JAK1/2 inhibitor');
  });
});
