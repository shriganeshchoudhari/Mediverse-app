import {
  NEPHROLOGY_ADV_CORE_MODULES,
  getNephrologyAdvModuleById,
  getNephrologyAdvModuleByCompetency,
  GLOMERULOPATHIES_NEPHRITIC_NEPHROTIC_MODULE,
  ACUTE_KIDNEY_INJURY_URINALYSIS_MODULE,
  RENAL_TUBULAR_ACIDOSES_ELECTROLYTES_MODULE,
  SODIUM_POTASSIUM_ELECTROPHYSIOLOGY_MODULE
} from "../../lib/curriculum/content/nephrologyadv";

describe("Clinical Nephrology & Acid-Base Electrophysiology (NEPH-301) Learning Content Modules", () => {
  it("should contain all 4 core Nephrology Advanced modules", () => {
    expect(NEPHROLOGY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    NEPHROLOGY_ADV_CORE_MODULES.forEach((mod) => {
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
    const glom = getNephrologyAdvModuleById("nephrology-adv-glomerulopathies-nephritic-nephrotic");
    expect(glom).toBeDefined();
    expect(glom?.title).toContain("Glomerulopathies");

    const aki = getNephrologyAdvModuleById("nephrology-adv-acute-kidney-injury-urinalysis");
    expect(aki).toBeDefined();
    expect(aki?.title).toContain("Acute Kidney Injury");

    const rta = getNephrologyAdvModuleById("nephrology-adv-renal-tubular-acidoses-electrolytes");
    expect(rta).toBeDefined();
    expect(rta?.title).toContain("Renal Tubular Acidoses");

    const elec = getNephrologyAdvModuleById("nephrology-adv-sodium-potassium-electrophysiology");
    expect(elec).toBeDefined();
    expect(elec?.title).toContain("Sodium");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getNephrologyAdvModuleByCompetency("PA21.1")?.id).toBe(GLOMERULOPATHIES_NEPHRITIC_NEPHROTIC_MODULE.id);
    expect(getNephrologyAdvModuleByCompetency("IM14.1")?.id).toBe(ACUTE_KIDNEY_INJURY_URINALYSIS_MODULE.id);
    expect(getNephrologyAdvModuleByCompetency("IM13.3")?.id).toBe(RENAL_TUBULAR_ACIDOSES_ELECTROLYTES_MODULE.id);
    expect(getNephrologyAdvModuleByCompetency("IM13.5")?.id).toBe(SODIUM_POTASSIUM_ELECTROPHYSIOLOGY_MODULE.id);
  });
});
