import {
  IMMUNOLOGY_CORE_MODULES,
  getImmunologyModuleById,
  getImmunologyModuleByCompetency,
  INNATE_IMMUNITY_COMPLEMENT_DEFICIENCIES_MODULE,
  HYPERSENSITIVITY_REACTIONS_TYPES_I_TO_IV_MODULE,
  AUTOIMMUNITY_HLA_TOLERANCE_BREAKDOWN_MODULE,
  FLOW_CYTOMETRY_BIOLOGICS_IMMUNOTHERAPY_MODULE
} from "../../lib/curriculum/content/immunology";

describe("Clinical Immunology & Immunopathology (IMM-201) Learning Content Modules", () => {
  it("should contain all 4 core Immunology modules", () => {
    expect(IMMUNOLOGY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    IMMUNOLOGY_CORE_MODULES.forEach((mod) => {
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
    const inn = getImmunologyModuleById("immunology-innate-immunity-complement-deficiencies");
    expect(inn).toBeDefined();
    expect(inn?.title).toContain("Innate Immunity");

    const hyper = getImmunologyModuleById("immunology-hypersensitivity-reactions-types-i-to-iv");
    expect(hyper).toBeDefined();
    expect(hyper?.title).toContain("Hypersensitivity");

    const auto = getImmunologyModuleById("immunology-autoimmunity-hla-tolerance-breakdown");
    expect(auto).toBeDefined();
    expect(auto?.title).toContain("Tolerance");

    const bio = getImmunologyModuleById("immunology-flow-cytometry-biologics-immunotherapy");
    expect(bio).toBeDefined();
    expect(bio?.title).toContain("Flow Cytometry");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getImmunologyModuleByCompetency("IM1.1")?.id).toBe(INNATE_IMMUNITY_COMPLEMENT_DEFICIENCIES_MODULE.id);
    expect(getImmunologyModuleByCompetency("IM3.1")?.id).toBe(HYPERSENSITIVITY_REACTIONS_TYPES_I_TO_IV_MODULE.id);
    expect(getImmunologyModuleByCompetency("IM5.1")?.id).toBe(AUTOIMMUNITY_HLA_TOLERANCE_BREAKDOWN_MODULE.id);
    expect(getImmunologyModuleByCompetency("IM7.1")?.id).toBe(FLOW_CYTOMETRY_BIOLOGICS_IMMUNOTHERAPY_MODULE.id);
  });
});
