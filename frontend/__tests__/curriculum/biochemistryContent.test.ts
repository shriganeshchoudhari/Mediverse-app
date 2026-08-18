import {
  BIOCHEMISTRY_CORE_MODULES,
  getBiochemistryModuleById,
  getBiochemistryModuleByCompetency,
  CARBOHYDRATE_METABOLISM_MODULE,
  LIPID_LIPOPROTEIN_MODULE,
  AMINO_ACID_METABOLISM_MODULE,
  MOLECULAR_GENETICS_MODULE
} from "../../lib/curriculum/content/biochemistry";

describe("Medical Biochemistry (BIOC-101) Learning Content Modules", () => {
  it("should contain all 4 core biochemistry modules", () => {
    expect(BIOCHEMISTRY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    BIOCHEMISTRY_CORE_MODULES.forEach((mod) => {
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
    const carbs = getBiochemistryModuleById("bioc-carbohydrate");
    expect(carbs).toBeDefined();
    expect(carbs?.title).toContain("Glycolysis");

    const lipids = getBiochemistryModuleById("bioc-lipid-lipoprotein");
    expect(lipids).toBeDefined();
    expect(lipids?.title).toContain("Lipoprotein");

    const amino = getBiochemistryModuleById("bioc-amino-acid");
    expect(amino).toBeDefined();
    expect(amino?.title).toContain("Urea Cycle");

    const genetics = getBiochemistryModuleById("bioc-molecular-genetics");
    expect(genetics).toBeDefined();
    expect(genetics?.title).toContain("Purine");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getBiochemistryModuleByCompetency("BI3.1")?.id).toBe(CARBOHYDRATE_METABOLISM_MODULE.id);
    expect(getBiochemistryModuleByCompetency("BI4.1")?.id).toBe(LIPID_LIPOPROTEIN_MODULE.id);
    expect(getBiochemistryModuleByCompetency("BI5.1")?.id).toBe(AMINO_ACID_METABOLISM_MODULE.id);
    expect(getBiochemistryModuleByCompetency("BI6.1")?.id).toBe(MOLECULAR_GENETICS_MODULE.id);
  });
});
