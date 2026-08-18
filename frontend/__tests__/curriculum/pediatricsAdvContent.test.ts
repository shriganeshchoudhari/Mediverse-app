import {
  PEDIATRICS_ADV_CORE_MODULES,
  getPediatricsAdvModuleById,
  getPediatricsAdvModuleByCompetency,
  CONGENITAL_HEART_DEFECTS_SHUNTS_MODULE,
  NEONATAL_RESPIRATORY_DISTRESS_NICU_MODULE,
  PEDIATRIC_GASTROINTESTINAL_EMERGENCIES_MODULE,
  PEDIATRIC_IMMUNODEFICIENCY_METABOLIC_MODULE
} from "../../lib/curriculum/content/pediatricsadv";

describe("Pediatric Pathophysiology & Neonatal Intensive Care (PEDS-301) Learning Content Modules", () => {
  it("should contain all 4 core Pediatrics Advanced modules", () => {
    expect(PEDIATRICS_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    PEDIATRICS_ADV_CORE_MODULES.forEach((mod) => {
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
    const chd = getPediatricsAdvModuleById("pediatrics-adv-congenital-heart-defects-shunts");
    expect(chd).toBeDefined();
    expect(chd?.title).toContain("Congenital Heart Defects");

    const rds = getPediatricsAdvModuleById("pediatrics-adv-neonatal-respiratory-distress-nicu");
    expect(rds).toBeDefined();
    expect(rds?.title).toContain("Neonatal Respiratory Distress");

    const gi = getPediatricsAdvModuleById("pediatrics-adv-pediatric-gastrointestinal-emergencies");
    expect(gi).toBeDefined();
    expect(gi?.title).toContain("Pediatric GI Emergencies");

    const imm = getPediatricsAdvModuleById("pediatrics-adv-pediatric-immunodeficiency-metabolic");
    expect(imm).toBeDefined();
    expect(imm?.title).toContain("Pediatric Immunodeficiencies");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getPediatricsAdvModuleByCompetency("PE1.1")?.id).toBe(CONGENITAL_HEART_DEFECTS_SHUNTS_MODULE.id);
    expect(getPediatricsAdvModuleByCompetency("PE1.3")?.id).toBe(NEONATAL_RESPIRATORY_DISTRESS_NICU_MODULE.id);
    expect(getPediatricsAdvModuleByCompetency("PE1.5")?.id).toBe(PEDIATRIC_GASTROINTESTINAL_EMERGENCIES_MODULE.id);
    expect(getPediatricsAdvModuleByCompetency("PE1.7")?.id).toBe(PEDIATRIC_IMMUNODEFICIENCY_METABOLIC_MODULE.id);
  });
});
