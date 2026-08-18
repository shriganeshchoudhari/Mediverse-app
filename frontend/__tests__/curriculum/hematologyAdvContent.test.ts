import {
  HEMATOLOGY_ADV_CORE_MODULES,
  getHematologyAdvModuleById,
  getHematologyAdvModuleByCompetency,
  COAGULATION_CASCADE_HEMOSTASIS_MODULE,
  ANEMIA_ALGORITHMIC_PROFILING_MODULE,
  LEUKEMIAS_MYELOPROLIFERATIVE_MODULE,
  PLASMA_CELL_DYSCRASIAS_LYMPHOMAS_MODULE
} from "../../lib/curriculum/content/hematologyadv";

describe("Clinical Hematology, Hemostasis & Oncology (HEM-301) Learning Content Modules", () => {
  it("should contain all 4 core Hematology modules", () => {
    expect(HEMATOLOGY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    HEMATOLOGY_ADV_CORE_MODULES.forEach((mod) => {
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
    const coag = getHematologyAdvModuleById("hematology-adv-coagulation-cascade-hemostasis");
    expect(coag).toBeDefined();
    expect(coag?.title).toContain("Hemostasis");

    const anemia = getHematologyAdvModuleById("hematology-adv-anemia-algorithmic-profiling");
    expect(anemia).toBeDefined();
    expect(anemia?.title).toContain("Anemia");

    const leuk = getHematologyAdvModuleById("hematology-adv-leukemias-myeloproliferative");
    expect(leuk).toBeDefined();
    expect(leuk?.title).toContain("Leukemias");

    const plasma = getHematologyAdvModuleById("hematology-adv-plasma-cell-dyscrasias-lymphomas");
    expect(plasma).toBeDefined();
    expect(plasma?.title).toContain("Plasma Cell");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getHematologyAdvModuleByCompetency("PA13.1")?.id).toBe(COAGULATION_CASCADE_HEMOSTASIS_MODULE.id);
    expect(getHematologyAdvModuleByCompetency("PA15.1")?.id).toBe(ANEMIA_ALGORITHMIC_PROFILING_MODULE.id);
    expect(getHematologyAdvModuleByCompetency("PA17.1")?.id).toBe(LEUKEMIAS_MYELOPROLIFERATIVE_MODULE.id);
    expect(getHematologyAdvModuleByCompetency("PA19.1")?.id).toBe(PLASMA_CELL_DYSCRASIAS_LYMPHOMAS_MODULE.id);
  });
});
