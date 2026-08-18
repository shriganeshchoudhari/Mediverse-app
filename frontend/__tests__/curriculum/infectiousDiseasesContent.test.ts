import {
  INFECTIOUS_DISEASES_CORE_MODULES,
  getInfectiousDiseaseModuleById,
  getInfectiousDiseaseModuleByCompetency,
  SEPSIS_DEFINITIONS_SURVIVING_SEPSIS_BUNDLE_MODULE,
  FEVER_UNKNOWN_ORIGIN_TROPICAL_FEVERS_MODULE,
  MDR_PATHOGENS_ESKAPE_DIAGNOSTICS_MODULE,
  ANTIMICROBIAL_STEWARDSHIP_AWARE_FRAMEWORK_MODULE
} from "../../lib/curriculum/content/infectiousdiseases";

describe("Infectious Diseases & Antimicrobial Stewardship (ID-301) Learning Content Modules", () => {
  it("should contain all 4 core Infectious Diseases modules", () => {
    expect(INFECTIOUS_DISEASES_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    INFECTIOUS_DISEASES_CORE_MODULES.forEach((mod) => {
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
    const sepsis = getInfectiousDiseaseModuleById("infectious-diseases-sepsis-definitions-surviving-sepsis-bundle");
    expect(sepsis).toBeDefined();
    expect(sepsis?.title).toContain("Sepsis-3");

    const fuo = getInfectiousDiseaseModuleById("infectious-diseases-fever-unknown-origin-tropical-fevers");
    expect(fuo).toBeDefined();
    expect(fuo?.title).toContain("Fever of Unknown Origin");

    const mdr = getInfectiousDiseaseModuleById("infectious-diseases-mdr-pathogens-eskape-diagnostics");
    expect(mdr).toBeDefined();
    expect(mdr?.title).toContain("MDR");

    const asp = getInfectiousDiseaseModuleById("infectious-diseases-antimicrobial-stewardship-aware-framework");
    expect(asp).toBeDefined();
    expect(asp?.title).toContain("Antimicrobial Stewardship");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getInfectiousDiseaseModuleByCompetency("ID1.1")?.id).toBe(SEPSIS_DEFINITIONS_SURVIVING_SEPSIS_BUNDLE_MODULE.id);
    expect(getInfectiousDiseaseModuleByCompetency("ID3.1")?.id).toBe(FEVER_UNKNOWN_ORIGIN_TROPICAL_FEVERS_MODULE.id);
    expect(getInfectiousDiseaseModuleByCompetency("ID5.1")?.id).toBe(MDR_PATHOGENS_ESKAPE_DIAGNOSTICS_MODULE.id);
    expect(getInfectiousDiseaseModuleByCompetency("ID7.1")?.id).toBe(ANTIMICROBIAL_STEWARDSHIP_AWARE_FRAMEWORK_MODULE.id);
  });
});
