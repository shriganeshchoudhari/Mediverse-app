import {
  MICROBIOLOGY_CORE_MODULES,
  getMicrobiologyModuleById,
  getMicrobiologyModuleByCompetency,
  IMMUNOLOGY_HYPERSENSITIVITY_MODULE,
  SYSTEMATIC_BACTERIOLOGY_MODULE,
  BACTERIAL_TOXINS_MODULE,
  VIROLOGY_HEPATITIS_MODULE
} from "../../lib/curriculum/content/microbiology";

describe("Medical Microbiology & Immunology (MICR-201) Learning Content Modules", () => {
  it("should contain all 4 core microbiology modules", () => {
    expect(MICROBIOLOGY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    MICROBIOLOGY_CORE_MODULES.forEach((mod) => {
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
    const immuno = getMicrobiologyModuleById("micr-immunology");
    expect(immuno).toBeDefined();
    expect(immuno?.title).toContain("Innate & Adaptive");

    const bact = getMicrobiologyModuleById("micr-bacteriology");
    expect(bact).toBeDefined();
    expect(bact?.title).toContain("Gram-Positive");

    const toxins = getMicrobiologyModuleById("micr-toxins");
    expect(toxins).toBeDefined();
    expect(toxins?.title).toContain("Bacterial Exotoxins");

    const viro = getMicrobiologyModuleById("micr-virology");
    expect(viro).toBeDefined();
    expect(viro?.title).toContain("Hepatitis B");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getMicrobiologyModuleByCompetency("MI1.1")?.id).toBe(IMMUNOLOGY_HYPERSENSITIVITY_MODULE.id);
    expect(getMicrobiologyModuleByCompetency("MI2.1")?.id).toBe(SYSTEMATIC_BACTERIOLOGY_MODULE.id);
    expect(getMicrobiologyModuleByCompetency("MI2.5")?.id).toBe(BACTERIAL_TOXINS_MODULE.id);
    expect(getMicrobiologyModuleByCompetency("MI8.1")?.id).toBe(VIROLOGY_HEPATITIS_MODULE.id);
  });
});
