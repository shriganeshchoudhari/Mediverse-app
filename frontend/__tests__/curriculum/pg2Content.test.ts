import {
  PG2_CORE_MODULES,
  getPg2ModuleById,
  getPg2ModuleByCompetency,
  ADVANCED_MECHANICAL_CIRCULATORY_SUPPORT_IMPELLA_MODULE,
  RPGN_RENAL_BIOPSY_PATHOLOGY_ANCA_MODULE,
  NEURO_ICU_TIERED_ICP_ESCALATION_HERNIATION_MODULE,
  TARGETED_BIOLOGIC_IMMUNOMODULATION_CRISIS_MODULE
} from "../../lib/curriculum/content/pg2";

describe("Postgraduate Advanced Internal Medicine & Subspecialty Consultations (PG-602) Content Modules", () => {
  it("should contain all 4 core Postgraduate Internal Medicine modules", () => {
    expect(PG2_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    PG2_CORE_MODULES.forEach((mod) => {
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
    const mcs = getPg2ModuleById("pg2-advanced-mechanical-circulatory-support-impella");
    expect(mcs).toBeDefined();
    expect(mcs?.title).toContain("Mechanical Circulatory Support");

    const rpgn = getPg2ModuleById("pg2-rpgn-renal-biopsy-pathology-anca");
    expect(rpgn).toBeDefined();
    expect(rpgn?.title).toContain("Rapidly Progressive Glomerulonephritis");

    const neuro = getPg2ModuleById("pg2-neuro-icu-tiered-icp-escalation-herniation");
    expect(neuro).toBeDefined();
    expect(neuro?.title).toContain("Neuro-ICU Intracranial Hypertension");

    const biologics = getPg2ModuleById("pg2-targeted-biologic-immunomodulation-crisis");
    expect(biologics).toBeDefined();
    expect(biologics?.title).toContain("Targeted Biologic Immunomodulation");
  });

  it("should retrieve modules by NMC PG CBME competency code", () => {
    expect(getPg2ModuleByCompetency("PG2.1")?.id).toBe(ADVANCED_MECHANICAL_CIRCULATORY_SUPPORT_IMPELLA_MODULE.id);
    expect(getPg2ModuleByCompetency("PG2.2")?.id).toBe(RPGN_RENAL_BIOPSY_PATHOLOGY_ANCA_MODULE.id);
    expect(getPg2ModuleByCompetency("PG2.3")?.id).toBe(NEURO_ICU_TIERED_ICP_ESCALATION_HERNIATION_MODULE.id);
    expect(getPg2ModuleByCompetency("PG2.4")?.id).toBe(TARGETED_BIOLOGIC_IMMUNOMODULATION_CRISIS_MODULE.id);
  });
});
