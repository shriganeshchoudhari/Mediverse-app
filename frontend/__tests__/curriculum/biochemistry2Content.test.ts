import {
  BIOCHEMISTRY2_CORE_MODULES,
  getBiochemistry2ModuleById,
  getBiochemistry2ModuleByCompetency,
  DNA_REPLICATION_REPAIR_TELOMERASE_MODULE,
  TRANSCRIPTION_EPIGENETICS_SPLICING_MODULE,
  TRANSLATION_GENETIC_CODE_CHAPERONES_MODULE,
  MOLECULAR_DIAGNOSTICS_GENE_EDITING_CRISPR_MODULE
} from "../../lib/curriculum/content/biochemistry2";

describe("Medical Biochemistry II (BIOC-102) Learning Content Modules", () => {
  it("should contain all 4 core Medical Biochemistry II modules", () => {
    expect(BIOCHEMISTRY2_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    BIOCHEMISTRY2_CORE_MODULES.forEach((mod) => {
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
    const rep = getBiochemistry2ModuleById("biochemistry2-dna-replication-repair-telomerase");
    expect(rep).toBeDefined();
    expect(rep?.title).toContain("DNA Replication");

    const tx = getBiochemistry2ModuleById("biochemistry2-transcription-epigenetics-splicing");
    expect(tx).toBeDefined();
    expect(tx?.title).toContain("Transcription & Splicing");

    const tl = getBiochemistry2ModuleById("biochemistry2-translation-genetic-code-chaperones");
    expect(tl).toBeDefined();
    expect(tl?.title).toContain("Translation & Chaperones");

    const mol = getBiochemistry2ModuleById("biochemistry2-molecular-diagnostics-gene-editing-crispr");
    expect(mol).toBeDefined();
    expect(mol?.title).toContain("Molecular Diagnostics & CRISPR");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getBiochemistry2ModuleByCompetency("BI2.1")?.id).toBe(DNA_REPLICATION_REPAIR_TELOMERASE_MODULE.id);
    expect(getBiochemistry2ModuleByCompetency("BI4.1")?.id).toBe(TRANSCRIPTION_EPIGENETICS_SPLICING_MODULE.id);
    expect(getBiochemistry2ModuleByCompetency("BI6.1")?.id).toBe(TRANSLATION_GENETIC_CODE_CHAPERONES_MODULE.id);
    expect(getBiochemistry2ModuleByCompetency("BI8.1")?.id).toBe(MOLECULAR_DIAGNOSTICS_GENE_EDITING_CRISPR_MODULE.id);
  });
});
