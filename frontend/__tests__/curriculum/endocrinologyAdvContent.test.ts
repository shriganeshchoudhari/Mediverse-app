import {
  ENDOCRINOLOGY_ADV_CORE_MODULES,
  getEndocrinologyAdvModuleById,
  getEndocrinologyAdvModuleByCompetency,
  ADRENAL_DISORDERS_CUSHING_CONN_MODULE,
  THYROID_DISORDERS_STORM_MYXEDEMA_MODULE,
  CALCIUM_HOMEOSTASIS_PARATHYROID_MODULE,
  MULTIPLE_ENDOCRINE_NEOPLASIA_PITUITARY_MODULE
} from "../../lib/curriculum/content/endocrinologyadv";

describe("Clinical Endocrinology & Metabolic Pathophysiology (ENDO-301) Learning Content Modules", () => {
  it("should contain all 4 core Endocrinology Advanced modules", () => {
    expect(ENDOCRINOLOGY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    ENDOCRINOLOGY_ADV_CORE_MODULES.forEach((mod) => {
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
    const adr = getEndocrinologyAdvModuleById("endocrinology-adv-adrenal-disorders-cushing-conn");
    expect(adr).toBeDefined();
    expect(adr?.title).toContain("Adrenal Pathophysiology");

    const thy = getEndocrinologyAdvModuleById("endocrinology-adv-thyroid-disorders-storm-myxedema");
    expect(thy).toBeDefined();
    expect(thy?.title).toContain("Thyroid Pathophysiology");

    const ca = getEndocrinologyAdvModuleById("endocrinology-adv-calcium-homeostasis-parathyroid");
    expect(ca).toBeDefined();
    expect(ca?.title).toContain("Calcium Homeostasis");

    const men = getEndocrinologyAdvModuleById("endocrinology-adv-multiple-endocrine-neoplasia-pituitary");
    expect(men).toBeDefined();
    expect(men?.title).toContain("Multiple Endocrine Neoplasia");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getEndocrinologyAdvModuleByCompetency("IM9.1")?.id).toBe(ADRENAL_DISORDERS_CUSHING_CONN_MODULE.id);
    expect(getEndocrinologyAdvModuleByCompetency("IM9.3")?.id).toBe(THYROID_DISORDERS_STORM_MYXEDEMA_MODULE.id);
    expect(getEndocrinologyAdvModuleByCompetency("IM9.5")?.id).toBe(CALCIUM_HOMEOSTASIS_PARATHYROID_MODULE.id);
    expect(getEndocrinologyAdvModuleByCompetency("IM9.7")?.id).toBe(MULTIPLE_ENDOCRINE_NEOPLASIA_PITUITARY_MODULE.id);
  });
});
