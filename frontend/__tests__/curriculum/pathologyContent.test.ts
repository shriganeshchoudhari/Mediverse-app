import {
  PATHOLOGY_CORE_MODULES,
  getPathologyModuleById,
  getPathologyModuleByCompetency,
  CELL_INJURY_INFLAMMATION_MODULE,
  NEOPLASIA_ONCOGENESIS_MODULE,
  HEMODYNAMICS_THROMBOSIS_MODULE,
  SYSTEMIC_HISTOPATHOLOGY_MODULE
} from "../../lib/curriculum/content/pathology";

describe("Pathology & Pathophysiology (PATH-201) Learning Content Modules", () => {
  it("should contain all 4 core pathology modules", () => {
    expect(PATHOLOGY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    PATHOLOGY_CORE_MODULES.forEach((mod) => {
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
    const injury = getPathologyModuleById("path-cell-injury");
    expect(injury).toBeDefined();
    expect(injury?.title).toContain("Cellular Adaptations");

    const neoplasia = getPathologyModuleById("path-neoplasia");
    expect(neoplasia).toBeDefined();
    expect(neoplasia?.title).toContain("Neoplasia");

    const hemo = getPathologyModuleById("path-hemodynamics");
    expect(hemo).toBeDefined();
    expect(hemo?.title).toContain("Hemodynamics");

    const histo = getPathologyModuleById("path-histopathology");
    expect(histo).toBeDefined();
    expect(histo?.title).toContain("Myocardial Infarction");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getPathologyModuleByCompetency("PA1.1")?.id).toBe(CELL_INJURY_INFLAMMATION_MODULE.id);
    expect(getPathologyModuleByCompetency("PA8.1")?.id).toBe(NEOPLASIA_ONCOGENESIS_MODULE.id);
    expect(getPathologyModuleByCompetency("PA6.1")?.id).toBe(HEMODYNAMICS_THROMBOSIS_MODULE.id);
    expect(getPathologyModuleByCompetency("PA16.1")?.id).toBe(SYSTEMIC_HISTOPATHOLOGY_MODULE.id);
  });
});
