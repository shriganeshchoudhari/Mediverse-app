import {
  PHARMACOLOGY_ADV_CORE_MODULES,
  getPharmacologyAdvModuleById,
  getPharmacologyAdvModuleByCompetency,
  THERAPEUTIC_DRUG_MONITORING_KINETICS_MODULE,
  ANTIMICROBIAL_STEWARDSHIP_RESISTANCE_MODULE,
  ANTICOAGULATION_REVERSAL_AGENTS_MODULE,
  CHEMOTHERAPY_TOXICITIES_RESCUE_MODULE
} from "../../lib/curriculum/content/pharmacologyadv";

describe("Clinical Pharmacology & Rational Therapeutics (PHARM-301) Learning Content Modules", () => {
  it("should contain all 4 core Pharmacology Advanced modules", () => {
    expect(PHARMACOLOGY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    PHARMACOLOGY_ADV_CORE_MODULES.forEach((mod) => {
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
    const tdm = getPharmacologyAdvModuleById("pharmacology-adv-tdm-kinetics");
    expect(tdm).toBeDefined();
    expect(tdm?.title).toContain("Therapeutic Drug Monitoring");

    const abx = getPharmacologyAdvModuleById("pharmacology-adv-antimicrobial-stewardship");
    expect(abx).toBeDefined();
    expect(abx?.title).toContain("Antimicrobial Stewardship");

    const ac = getPharmacologyAdvModuleById("pharmacology-adv-anticoagulation-reversal");
    expect(ac).toBeDefined();
    expect(ac?.title).toContain("Anticoagulation");

    const chemo = getPharmacologyAdvModuleById("pharmacology-adv-chemo-toxicities-rescue");
    expect(chemo).toBeDefined();
    expect(chemo?.title).toContain("Chemotherapeutic Toxicities");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getPharmacologyAdvModuleByCompetency("PH1.1")?.id).toBe(THERAPEUTIC_DRUG_MONITORING_KINETICS_MODULE.id);
    expect(getPharmacologyAdvModuleByCompetency("PH1.3")?.id).toBe(ANTIMICROBIAL_STEWARDSHIP_RESISTANCE_MODULE.id);
    expect(getPharmacologyAdvModuleByCompetency("PH1.5")?.id).toBe(ANTICOAGULATION_REVERSAL_AGENTS_MODULE.id);
    expect(getPharmacologyAdvModuleByCompetency("PH1.7")?.id).toBe(CHEMOTHERAPY_TOXICITIES_RESCUE_MODULE.id);
  });
});
