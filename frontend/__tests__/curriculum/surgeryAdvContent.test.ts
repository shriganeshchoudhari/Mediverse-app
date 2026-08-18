import {
  SURGERY_ADV_CORE_MODULES,
  getSurgeryAdvModuleById,
  getSurgeryAdvModuleByCompetency,
  ACUTE_ABDOMEN_BOWEL_OBSTRUCTION_MODULE,
  LAPAROSCOPIC_BILIARY_CRITICAL_VIEW_MODULE,
  GI_HEMORRHAGE_ULCER_PERFORATION_MODULE,
  SURGICAL_ONCOLOGY_LYMPHATIC_STAGING_MODULE
} from "../../lib/curriculum/content/surgeryadv";

describe("Clinical Surgery Advanced (SUR-301) Learning Content Modules", () => {
  it("should contain all 4 core Surgery Advanced modules", () => {
    expect(SURGERY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    SURGERY_ADV_CORE_MODULES.forEach((mod) => {
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
    const sbo = getSurgeryAdvModuleById("surgery-adv-acute-abdomen-sbo");
    expect(sbo).toBeDefined();
    expect(sbo?.title).toContain("Acute Abdomen");

    const cvs = getSurgeryAdvModuleById("surgery-adv-biliary-critical-view");
    expect(cvs).toBeDefined();
    expect(cvs?.title).toContain("Critical View of Safety");

    const bleed = getSurgeryAdvModuleById("surgery-adv-gi-hemorrhage-perforation");
    expect(bleed).toBeDefined();
    expect(bleed?.title).toContain("Upper GI Bleeding");

    const onc = getSurgeryAdvModuleById("surgery-adv-oncology-staging");
    expect(onc).toBeDefined();
    expect(onc?.title).toContain("Surgical Oncology");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getSurgeryAdvModuleByCompetency("SU1.1")?.id).toBe(ACUTE_ABDOMEN_BOWEL_OBSTRUCTION_MODULE.id);
    expect(getSurgeryAdvModuleByCompetency("SU3.1")?.id).toBe(LAPAROSCOPIC_BILIARY_CRITICAL_VIEW_MODULE.id);
    expect(getSurgeryAdvModuleByCompetency("SU5.1")?.id).toBe(GI_HEMORRHAGE_ULCER_PERFORATION_MODULE.id);
    expect(getSurgeryAdvModuleByCompetency("SU7.1")?.id).toBe(SURGICAL_ONCOLOGY_LYMPHATIC_STAGING_MODULE.id);
  });
});
