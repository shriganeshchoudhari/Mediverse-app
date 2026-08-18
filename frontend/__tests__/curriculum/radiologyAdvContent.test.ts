import {
  RADIOLOGY_ADV_CORE_MODULES,
  getRadiologyAdvModuleById,
  getRadiologyAdvModuleByCompetency,
  CONTRAST_MEDIA_CIN_NSF_PROTOCOLS_MODULE,
  HRCT_CHEST_PATTERNS_PATHOLOGY_MODULE,
  ACUTE_ABDOMEN_EMERGENCY_CT_MODULE,
  INTERVENTIONAL_RADIOLOGY_PROCEDURES_MODULE
} from "../../lib/curriculum/content/radiologyadv";

describe("Clinical Diagnostic Radiology & Interventional Protocols (RAD-301) Learning Content Modules", () => {
  it("should contain all 4 core Radiology Advanced modules", () => {
    expect(RADIOLOGY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    RADIOLOGY_ADV_CORE_MODULES.forEach((mod) => {
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
    const cin = getRadiologyAdvModuleById("radiology-adv-contrast-cin-nsf");
    expect(cin).toBeDefined();
    expect(cin?.title).toContain("Contrast Media Safety");

    const hrct = getRadiologyAdvModuleById("radiology-adv-hrct-chest-patterns");
    expect(hrct).toBeDefined();
    expect(hrct?.title).toContain("High-Resolution Chest CT");

    const abd = getRadiologyAdvModuleById("radiology-adv-acute-abdomen-ct");
    expect(abd).toBeDefined();
    expect(abd?.title).toContain("Acute Abdomen Emergency CT");

    const ir = getRadiologyAdvModuleById("radiology-adv-interventional-procedures");
    expect(ir).toBeDefined();
    expect(ir?.title).toContain("Emergency Interventional Radiology");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getRadiologyAdvModuleByCompetency("RD1.1")?.id).toBe(CONTRAST_MEDIA_CIN_NSF_PROTOCOLS_MODULE.id);
    expect(getRadiologyAdvModuleByCompetency("RD1.3")?.id).toBe(HRCT_CHEST_PATTERNS_PATHOLOGY_MODULE.id);
    expect(getRadiologyAdvModuleByCompetency("RD1.5")?.id).toBe(ACUTE_ABDOMEN_EMERGENCY_CT_MODULE.id);
    expect(getRadiologyAdvModuleByCompetency("RD1.7")?.id).toBe(INTERVENTIONAL_RADIOLOGY_PROCEDURES_MODULE.id);
  });
});
