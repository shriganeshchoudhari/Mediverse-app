import {
  BIOCHEMISTRY_ADV_CORE_MODULES,
  getBiochemistryAdvModuleById,
  getBiochemistryAdvModuleByCompetency,
  AMINOACIDOPATHIES_ORGANIC_ACIDEMIAS_MODULE,
  GLYCOGEN_STORAGE_DISEASES_GLUCONEOGENESIS_MODULE,
  LYSOSOMAL_STORAGE_DISORDERS_SPHINGOLIPIDOSES_MODULE,
  PORPHYRIAS_HEME_SYNTHESIS_UREA_CYCLE_MODULE
} from "../../lib/curriculum/content/biochemistryadv";

describe("Clinical Biochemistry & Metabolic Genetics (BIO-201 Advanced) Learning Content Modules", () => {
  it("should contain all 4 core Clinical Biochemistry modules", () => {
    expect(BIOCHEMISTRY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    BIOCHEMISTRY_ADV_CORE_MODULES.forEach((mod) => {
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
    const amino = getBiochemistryAdvModuleById("biochemistry-adv-aminoacidopathies-organic-acidemias");
    expect(amino).toBeDefined();
    expect(amino?.title).toContain("Amino Acid Metabolism");

    const gsd = getBiochemistryAdvModuleById("biochemistry-adv-glycogen-storage-diseases-gluconeogenesis");
    expect(gsd).toBeDefined();
    expect(gsd?.title).toContain("Glycogen Storage Diseases");

    const lsd = getBiochemistryAdvModuleById("biochemistry-adv-lysosomal-storage-disorders-sphingolipidoses");
    expect(lsd).toBeDefined();
    expect(lsd?.title).toContain("Lysosomal Storage Disorders");

    const porphyria = getBiochemistryAdvModuleById("biochemistry-adv-porphyrias-heme-synthesis-urea-cycle");
    expect(porphyria).toBeDefined();
    expect(porphyria?.title).toContain("Porphyrias");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getBiochemistryAdvModuleByCompetency("BI1.1")?.id).toBe(AMINOACIDOPATHIES_ORGANIC_ACIDEMIAS_MODULE.id);
    expect(getBiochemistryAdvModuleByCompetency("BI3.1")?.id).toBe(GLYCOGEN_STORAGE_DISEASES_GLUCONEOGENESIS_MODULE.id);
    expect(getBiochemistryAdvModuleByCompetency("BI5.1")?.id).toBe(LYSOSOMAL_STORAGE_DISORDERS_SPHINGOLIPIDOSES_MODULE.id);
    expect(getBiochemistryAdvModuleByCompetency("BI7.1")?.id).toBe(PORPHYRIAS_HEME_SYNTHESIS_UREA_CYCLE_MODULE.id);
  });
});
