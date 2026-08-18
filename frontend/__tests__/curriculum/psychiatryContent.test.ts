import {
  PSYCHIATRY_CORE_MODULES,
  getPsychiatryModuleById,
  getPsychiatryModuleByCompetency,
  MENTAL_STATE_EXAM_AFFECTIVE_MODULE,
  BIPOLAR_PSYCHOPHARMACOLOGY_LITHIUM_MODULE,
  SCHIZOPHRENIA_PSYCHOSIS_MODULE,
  ANXIETY_TRAUMA_OBSESSIVE_MODULE
} from "../../lib/curriculum/content/psychiatry";

describe("Psychiatry & Behavioral Health (PSYCH-301) Learning Content Modules", () => {
  it("should contain all 4 core psychiatry modules", () => {
    expect(PSYCHIATRY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    PSYCHIATRY_CORE_MODULES.forEach((mod) => {
      expect(mod.id).toBeTruthy();
      expect(mod.unitCode).toBeTruthy();
      expect(mod.title).toBeTruthy();
      expect(mod.markdownContent.length).toBeGreaterThan(500);
      expect(mod.clinicalVignettes.length).toBeGreaterThan(0);
      expect(mod.clinicalVignettes[0].scenario).toBeTruthy();
      expect(mod.clinicalVignettes[0].question).toBeTruthy();
      expect(mod.clinicalVignettes[0].explanation).toBeTruthy();
    });
  });

  it("should retrieve modules by ID", () => {
    const mse = getPsychiatryModuleById("psych-mse-affective");
    expect(mse).toBeDefined();
    expect(mse?.title).toContain("Mental Status Examination");

    const bipol = getPsychiatryModuleById("psych-bipolar-lithium");
    expect(bipol).toBeDefined();
    expect(bipol?.title).toContain("Bipolar");

    const schiz = getPsychiatryModuleById("psych-schizophrenia-psychosis");
    expect(schiz).toBeDefined();
    expect(schiz?.title).toContain("Schizophrenia");

    const anx = getPsychiatryModuleById("psych-anxiety-trauma-ocd");
    expect(anx).toBeDefined();
    expect(anx?.title).toContain("Anxiety");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getPsychiatryModuleByCompetency("PS1.1")?.id).toBe(MENTAL_STATE_EXAM_AFFECTIVE_MODULE.id);
    expect(getPsychiatryModuleByCompetency("PS4.1")?.id).toBe(BIPOLAR_PSYCHOPHARMACOLOGY_LITHIUM_MODULE.id);
    expect(getPsychiatryModuleByCompetency("PS6.1")?.id).toBe(SCHIZOPHRENIA_PSYCHOSIS_MODULE.id);
    expect(getPsychiatryModuleByCompetency("PS8.1")?.id).toBe(ANXIETY_TRAUMA_OBSESSIVE_MODULE.id);
  });
});
