import {
  SURGERY_CORE_MODULES,
  getSurgeryModuleById,
  getSurgeryModuleByCompetency,
  ACUTE_ABDOMEN_SURGICAL_MODULE,
  TRAUMA_ATLS_RESUSCITATION_MODULE,
  BURNS_FLUID_PARKLAND_MODULE,
  LAPAROSCOPY_HERNIAS_WOUNDS_MODULE
} from "../../lib/curriculum/content/surgery";

describe("General Surgery (SURG-301) Learning Content Modules", () => {
  it("should contain all 4 core surgery modules", () => {
    expect(SURGERY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    SURGERY_CORE_MODULES.forEach((mod) => {
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
    const abd = getSurgeryModuleById("surg-acute-abdomen");
    expect(abd).toBeDefined();
    expect(abd?.title).toContain("Acute Abdomen");

    const trauma = getSurgeryModuleById("surg-trauma-atls");
    expect(trauma).toBeDefined();
    expect(trauma?.title).toContain("Trauma");

    const burns = getSurgeryModuleById("surg-burns-parkland");
    expect(burns).toBeDefined();
    expect(burns?.title).toContain("Burns");

    const lap = getSurgeryModuleById("surg-laparoscopy-hernias");
    expect(lap).toBeDefined();
    expect(lap?.title).toContain("Laparoscopy");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getSurgeryModuleByCompetency("SU1.1")?.id).toBe(ACUTE_ABDOMEN_SURGICAL_MODULE.id);
    expect(getSurgeryModuleByCompetency("SU3.1")?.id).toBe(TRAUMA_ATLS_RESUSCITATION_MODULE.id);
    expect(getSurgeryModuleByCompetency("SU5.1")?.id).toBe(BURNS_FLUID_PARKLAND_MODULE.id);
    expect(getSurgeryModuleByCompetency("SU6.1")?.id).toBe(LAPAROSCOPY_HERNIAS_WOUNDS_MODULE.id);
  });
});
