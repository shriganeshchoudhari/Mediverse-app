import {
  DERMATOLOGY_CORE_MODULES,
  getDermatologyModuleById,
  getDermatologyModuleByCompetency,
  PSORIASIS_PAPULOSQUAMOUS_MODULE,
  BULLOUS_DERMATOSES_NIKOLSKY_MODULE,
  MELANOMA_SKIN_CANCER_MODULE,
  DRUG_ERUPTIONS_SJS_TEN_MODULE
} from "../../lib/curriculum/content/dermatology";

describe("Dermatology & Venereology (DERM-301) Learning Content Modules", () => {
  it("should contain all 4 core dermatology modules", () => {
    expect(DERMATOLOGY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    DERMATOLOGY_CORE_MODULES.forEach((mod) => {
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
    const psor = getDermatologyModuleById("derm-psoriasis-papulosquamous");
    expect(psor).toBeDefined();
    expect(psor?.title).toContain("Psoriasis");

    const bull = getDermatologyModuleById("derm-bullous-nikolsky");
    expect(bull).toBeDefined();
    expect(bull?.title).toContain("Bullous");

    const mel = getDermatologyModuleById("derm-melanoma-skin-cancer");
    expect(mel).toBeDefined();
    expect(mel?.title).toContain("Melanoma");

    const scar = getDermatologyModuleById("derm-drug-eruptions-sjs-ten");
    expect(scar).toBeDefined();
    expect(scar?.title).toContain("SJS");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getDermatologyModuleByCompetency("DR1.1")?.id).toBe(PSORIASIS_PAPULOSQUAMOUS_MODULE.id);
    expect(getDermatologyModuleByCompetency("DR3.1")?.id).toBe(BULLOUS_DERMATOSES_NIKOLSKY_MODULE.id);
    expect(getDermatologyModuleByCompetency("DR5.1")?.id).toBe(MELANOMA_SKIN_CANCER_MODULE.id);
    expect(getDermatologyModuleByCompetency("DR7.1")?.id).toBe(DRUG_ERUPTIONS_SJS_TEN_MODULE.id);
  });
});
