import {
  OBGYN_CORE_MODULES,
  getObgynModuleById,
  getObgynModuleByCompetency,
  LABOR_MECHANICS_PARTOGRAM_MODULE,
  POSTPARTUM_HEMORRHAGE_UTEROTONICS_MODULE,
  HYPERTENSIVE_PREGNANCY_PREECLAMPSIA_MODULE,
  OBSTETRIC_EMERGENCIES_FETAL_HEART_MODULE
} from "../../lib/curriculum/content/obgyn";

describe("Obstetrics & Gynecology (OBG-301) Learning Content Modules", () => {
  it("should contain all 4 core OB/GYN modules", () => {
    expect(OBGYN_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    OBGYN_CORE_MODULES.forEach((mod) => {
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
    const labor = getObgynModuleById("obg-labor-partogram");
    expect(labor).toBeDefined();
    expect(labor?.title).toContain("Labor");

    const pph = getObgynModuleById("obg-pph-uterotonics");
    expect(pph).toBeDefined();
    expect(pph?.title).toContain("Postpartum Hemorrhage");

    const preeclampsia = getObgynModuleById("obg-preeclampsia-mgso4");
    expect(preeclampsia).toBeDefined();
    expect(preeclampsia?.title).toContain("Preeclampsia");

    const ctg = getObgynModuleById("obg-emergencies-ctg");
    expect(ctg).toBeDefined();
    expect(ctg?.title).toContain("Antepartum Hemorrhage");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getObgynModuleByCompetency("OG1.1")?.id).toBe(LABOR_MECHANICS_PARTOGRAM_MODULE.id);
    expect(getObgynModuleByCompetency("OG3.1")?.id).toBe(POSTPARTUM_HEMORRHAGE_UTEROTONICS_MODULE.id);
    expect(getObgynModuleByCompetency("OG5.1")?.id).toBe(HYPERTENSIVE_PREGNANCY_PREECLAMPSIA_MODULE.id);
    expect(getObgynModuleByCompetency("OG6.1")?.id).toBe(OBSTETRIC_EMERGENCIES_FETAL_HEART_MODULE.id);
  });
});
