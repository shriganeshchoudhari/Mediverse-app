import {
  GENETICS_CORE_MODULES,
  getGeneticsModuleById,
  getGeneticsModuleByCompetency,
  CHROMOSOMAL_ANEUPLOIDIES_REARRANGEMENTS_MODULE,
  MENDELIAN_INHERITANCE_PATTERNS_MODULE,
  EPIGENETICS_IMPRINTING_TRINUCLEOTIDE_MODULE,
  MOLECULAR_DIAGNOSTICS_GENETIC_COUNSELING_MODULE
} from "../../lib/curriculum/content/genetics";

describe("Medical Genetics & Genomics (GEN-201) Learning Content Modules", () => {
  it("should contain all 4 core Genetics modules", () => {
    expect(GENETICS_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    GENETICS_CORE_MODULES.forEach((mod) => {
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
    const aneu = getGeneticsModuleById("genetics-chromosomal-aneuploidies-rearrangements");
    expect(aneu).toBeDefined();
    expect(aneu?.title).toContain("Chromosomal Aneuploidies");

    const mend = getGeneticsModuleById("genetics-mendelian-inheritance-patterns");
    expect(mend).toBeDefined();
    expect(mend?.title).toContain("Mendelian");

    const impr = getGeneticsModuleById("genetics-epigenetics-imprinting-trinucleotide");
    expect(impr).toBeDefined();
    expect(impr?.title).toContain("Epigenetics");

    const diag = getGeneticsModuleById("genetics-molecular-diagnostics-genetic-counseling");
    expect(diag).toBeDefined();
    expect(diag?.title).toContain("Molecular Cytogenetics");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getGeneticsModuleByCompetency("GN1.1")?.id).toBe(CHROMOSOMAL_ANEUPLOIDIES_REARRANGEMENTS_MODULE.id);
    expect(getGeneticsModuleByCompetency("GN3.1")?.id).toBe(MENDELIAN_INHERITANCE_PATTERNS_MODULE.id);
    expect(getGeneticsModuleByCompetency("GN5.1")?.id).toBe(EPIGENETICS_IMPRINTING_TRINUCLEOTIDE_MODULE.id);
    expect(getGeneticsModuleByCompetency("GN7.1")?.id).toBe(MOLECULAR_DIAGNOSTICS_GENETIC_COUNSELING_MODULE.id);
  });
});
