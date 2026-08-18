import {
  IMMUNOLOGY_ADV_CORE_MODULES,
  getImmunologyAdvModuleById,
  getImmunologyAdvModuleByCompetency,
  HYPERSENSITIVITY_CELLULAR_PATHWAYS_MODULE,
  TARGETED_BIOLOGICS_MABS_MODULE,
  CHECKPOINT_INHIBITORS_IRAES_MODULE,
  CART_CELL_CRS_ICANS_MODULE
} from "../../lib/curriculum/content/immunologyadv";

describe("Clinical Immunology & Advanced Immunotherapeutics (IMM-301) Learning Content Modules", () => {
  it("should contain all 4 core Immunology Advanced modules", () => {
    expect(IMMUNOLOGY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    IMMUNOLOGY_ADV_CORE_MODULES.forEach((mod) => {
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
    const hs = getImmunologyAdvModuleById("immunology-adv-hypersensitivity-pathways");
    expect(hs).toBeDefined();
    expect(hs?.title).toContain("Cellular Mechanisms of Hypersensitivity");

    const bio = getImmunologyAdvModuleById("immunology-adv-targeted-biologics-mabs");
    expect(bio).toBeDefined();
    expect(bio?.title).toContain("Targeted Biologics");

    const ici = getImmunologyAdvModuleById("immunology-adv-checkpoint-inhibitors-iraes");
    expect(ici).toBeDefined();
    expect(ici?.title).toContain("Immune Checkpoint Inhibitors");

    const cart = getImmunologyAdvModuleById("immunology-adv-cart-cell-crs-icans");
    expect(cart).toBeDefined();
    expect(cart?.title).toContain("CAR-T Cell Therapy");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getImmunologyAdvModuleByCompetency("IM1.1")?.id).toBe(HYPERSENSITIVITY_CELLULAR_PATHWAYS_MODULE.id);
    expect(getImmunologyAdvModuleByCompetency("IM1.3")?.id).toBe(TARGETED_BIOLOGICS_MABS_MODULE.id);
    expect(getImmunologyAdvModuleByCompetency("IM1.5")?.id).toBe(CHECKPOINT_INHIBITORS_IRAES_MODULE.id);
    expect(getImmunologyAdvModuleByCompetency("IM1.7")?.id).toBe(CART_CELL_CRS_ICANS_MODULE.id);
  });
});
