import {
  OBGYN_ADV_CORE_MODULES,
  getObgynAdvModuleById,
  getObgynAdvModuleByCompetency,
  PREECLAMPSIA_ECLAMPSIA_PROTOCOLS_MODULE,
  POSTPARTUM_HEMORRHAGE_UTEROTONICS_MODULE,
  ELECTRONIC_FETAL_MONITORING_CATEGORIES_MODULE,
  GYNECOLOGIC_ONCOLOGY_PELVIC_MALIGNANCIES_MODULE
} from "../../lib/curriculum/content/obgynadv";

describe("Clinical Obgyn Advanced (OBG-301) Learning Content Modules", () => {
  it("should contain all 4 core Obgyn Advanced modules", () => {
    expect(OBGYN_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    OBGYN_ADV_CORE_MODULES.forEach((mod) => {
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
    const pre = getObgynAdvModuleById("obgyn-adv-preeclampsia-eclampsia");
    expect(pre).toBeDefined();
    expect(pre?.title).toContain("Hypertensive Disorders of Pregnancy");

    const pph = getObgynAdvModuleById("obgyn-adv-postpartum-hemorrhage");
    expect(pph).toBeDefined();
    expect(pph?.title).toContain("Postpartum Hemorrhage");

    const efm = getObgynAdvModuleById("obgyn-adv-fetal-monitoring-efm");
    expect(efm).toBeDefined();
    expect(efm?.title).toContain("Electronic Fetal Monitoring");

    const onc = getObgynAdvModuleById("obgyn-adv-gynecologic-oncology");
    expect(onc).toBeDefined();
    expect(onc?.title).toContain("Gynecologic Oncology");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getObgynAdvModuleByCompetency("OG1.1")?.id).toBe(PREECLAMPSIA_ECLAMPSIA_PROTOCOLS_MODULE.id);
    expect(getObgynAdvModuleByCompetency("OG3.1")?.id).toBe(POSTPARTUM_HEMORRHAGE_UTEROTONICS_MODULE.id);
    expect(getObgynAdvModuleByCompetency("OG5.1")?.id).toBe(ELECTRONIC_FETAL_MONITORING_CATEGORIES_MODULE.id);
    expect(getObgynAdvModuleByCompetency("OG7.1")?.id).toBe(GYNECOLOGIC_ONCOLOGY_PELVIC_MALIGNANCIES_MODULE.id);
  });
});
