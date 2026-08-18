import {
  PG10_MODULES,
  TREATMENT_RESISTANT_DEPRESSION_NEUROMODULATION_MODULE,
  CATATONIA_NMS_SEROTONIN_SYNDROME_MODULE,
  REFRACTORY_SCHIZOPHRENIA_CLOZAPINE_MODULE,
  BIPOLAR_MANIA_PERINATAL_PSYCHIATRY_LITHIUM_MODULE
} from "@/lib/curriculum/content/pg10";

describe("Postgraduate Advanced Psychiatry Curriculum (PG-610)", () => {
  test("contains 4 comprehensive modules with valid metadata", () => {
    expect(PG10_MODULES).toHaveLength(4);
    PG10_MODULES.forEach((mod) => {
      expect(mod.id).toBeDefined();
      expect(mod.unitCode).toMatch(/^PG10\.\d$/);
      expect(mod.title).toBeDefined();
      expect(mod.competencies.length).toBeGreaterThan(0);
      expect(mod.markdownContent.length).toBeGreaterThan(200);
      expect(mod.clinicalVignettes.length).toBeGreaterThan(0);
    });
  });

  test("validates Treatment-Resistant Depression & Neuromodulation content (PG10.1)", () => {
    const mod = TREATMENT_RESISTANT_DEPRESSION_NEUROMODULATION_MODULE;
    expect(mod.markdownContent).toContain("Electroconvulsive Therapy");
    expect(mod.markdownContent).toContain("Methohexital");
    expect(mod.markdownContent).toContain("rTMS");
    expect(mod.markdownContent).toContain("Esketamine");
    expect(mod.clinicalVignettes[0].correctAnswerIndex).toBe(0);
  });

  test("validates Catatonia, NMS & Serotonin Syndrome content (PG10.2)", () => {
    const mod = CATATONIA_NMS_SEROTONIN_SYNDROME_MODULE;
    expect(mod.markdownContent).toContain("Bush-Francis");
    expect(mod.markdownContent).toContain("Lorazepam");
    expect(mod.markdownContent).toContain("Dantrolene");
    expect(mod.markdownContent).toContain("Cyproheptadine");
    expect(mod.clinicalVignettes[0].correctAnswerIndex).toBe(0);
  });

  test("validates Refractory Schizophrenia & Clozapine REMS content (PG10.3)", () => {
    const mod = REFRACTORY_SCHIZOPHRENIA_CLOZAPINE_MODULE;
    expect(mod.markdownContent).toContain("Absolute Neutrophil Count");
    expect(mod.markdownContent).toContain("Agranulocytosis");
    expect(mod.markdownContent).toContain("Myocarditis");
    expect(mod.clinicalVignettes[0].correctAnswerIndex).toBe(0);
  });

  test("validates Bipolar Mania, Perinatal Psychiatry & Lithium content (PG10.4)", () => {
    const mod = BIPOLAR_MANIA_PERINATAL_PSYCHIATRY_LITHIUM_MODULE;
    expect(mod.markdownContent).toContain("HEMODIALYSIS");
    expect(mod.markdownContent).toContain("Postpartum Psychosis");
    expect(mod.markdownContent).toContain("Ebstein Anomaly");
    expect(mod.markdownContent).toContain("Valproate");
    expect(mod.clinicalVignettes[0].correctAnswerIndex).toBe(0);
  });
});
