import {
  CLIN1_CORE_MODULES,
  getClin1ModuleById,
  getClin1ModuleByCompetency,
  WARD_ROUNDS_SOAP_DOCUMENTATION_MODULE,
  BEDSIDE_CARDIOVASCULAR_JVP_SIGNS_MODULE,
  BEDSIDE_PULMONARY_ABDOMINAL_NEURO_SIGNS_MODULE,
  FLUID_MANAGEMENT_ELECTROLYTE_EMERGENCY_MODULE
} from "../../lib/curriculum/content/clin1";

describe("Clinical Postings I (CLIN-201) Content Modules", () => {
  it("should contain all 4 core Clinical Postings I modules", () => {
    expect(CLIN1_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    CLIN1_CORE_MODULES.forEach((mod) => {
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
    const soap = getClin1ModuleById("clin1-ward-rounds-soap-documentation");
    expect(soap).toBeDefined();
    expect(soap?.title).toContain("Ward Rounds");

    const cardio = getClin1ModuleById("clin1-bedside-cardiovascular-jvp-signs");
    expect(cardio).toBeDefined();
    expect(cardio?.title).toContain("Cardiovascular Signs");

    const signs = getClin1ModuleById("clin1-bedside-pulmonary-abdominal-neuro-signs");
    expect(signs).toBeDefined();
    expect(signs?.title).toContain("Physical Signs");

    const fluids = getClin1ModuleById("clin1-fluid-management-electrolyte-emergency");
    expect(fluids).toBeDefined();
    expect(fluids?.title).toContain("Fluid & Electrolyte");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getClin1ModuleByCompetency("CP1.1")?.id).toBe(WARD_ROUNDS_SOAP_DOCUMENTATION_MODULE.id);
    expect(getClin1ModuleByCompetency("CP1.2")?.id).toBe(BEDSIDE_CARDIOVASCULAR_JVP_SIGNS_MODULE.id);
    expect(getClin1ModuleByCompetency("CP1.3")?.id).toBe(BEDSIDE_PULMONARY_ABDOMINAL_NEURO_SIGNS_MODULE.id);
    expect(getClin1ModuleByCompetency("CP1.4")?.id).toBe(FLUID_MANAGEMENT_ELECTROLYTE_EMERGENCY_MODULE.id);
  });
});
