import {
  PHARMACOLOGY_CORE_MODULES,
  getPharmacologyModuleById,
  getPharmacologyModuleByCompetency,
  PHARMACOKINETICS_DYNAMICS_MODULE,
  AUTONOMIC_PHARMACOLOGY_MODULE,
  CARDIOVASCULAR_RENAL_PHARM_MODULE,
  ANTIMICROBIAL_CHEMOTHERAPY_MODULE
} from "../../lib/curriculum/content/pharmacology";

describe("Pharmacology & Therapeutics (PHARM-201) Learning Content Modules", () => {
  it("should contain all 4 core pharmacology modules", () => {
    expect(PHARMACOLOGY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    PHARMACOLOGY_CORE_MODULES.forEach((mod) => {
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
    const pkpd = getPharmacologyModuleById("pharm-pkpd");
    expect(pkpd).toBeDefined();
    expect(pkpd?.title).toContain("Pharmacokinetics");

    const auto = getPharmacologyModuleById("pharm-autonomics");
    expect(auto).toBeDefined();
    expect(auto?.title).toContain("Autonomic");

    const cr = getPharmacologyModuleById("pharm-cardiorenal");
    expect(cr).toBeDefined();
    expect(cr?.title).toContain("Cardiovascular");

    const anti = getPharmacologyModuleById("pharm-antimicrobials");
    expect(anti).toBeDefined();
    expect(anti?.title).toContain("Antimicrobial");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getPharmacologyModuleByCompetency("PH1.1")?.id).toBe(PHARMACOKINETICS_DYNAMICS_MODULE.id);
    expect(getPharmacologyModuleByCompetency("PH1.5")?.id).toBe(AUTONOMIC_PHARMACOLOGY_MODULE.id);
    expect(getPharmacologyModuleByCompetency("PH2.1")?.id).toBe(CARDIOVASCULAR_RENAL_PHARM_MODULE.id);
    expect(getPharmacologyModuleByCompetency("PH3.1")?.id).toBe(ANTIMICROBIAL_CHEMOTHERAPY_MODULE.id);
  });
});
