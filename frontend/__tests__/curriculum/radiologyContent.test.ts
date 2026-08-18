import {
  RADIOLOGY_CORE_MODULES,
  getRadiologyModuleById,
  getRadiologyModuleByCompetency,
  CHEST_RADIOGRAPHY_ABCDE_MODULE,
  HEAD_CT_INTRACRANIAL_HEMORRHAGE_MODULE,
  ABDOMINAL_FAST_ULTRASOUND_CT_MODULE,
  RADIATION_SAFETY_MRI_PHYSICS_MODULE
} from "../../lib/curriculum/content/radiology";

describe("Radiodiagnosis & Imaging (RAD-301) Learning Content Modules", () => {
  it("should contain all 4 core radiology modules", () => {
    expect(RADIOLOGY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    RADIOLOGY_CORE_MODULES.forEach((mod) => {
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
    const cxr = getRadiologyModuleById("rad-chest-radiography-abcde");
    expect(cxr).toBeDefined();
    expect(cxr?.title).toContain("Chest Radiography");

    const ct = getRadiologyModuleById("rad-head-ct-hemorrhage");
    expect(ct).toBeDefined();
    expect(ct?.title).toContain("Head CT");

    const fast = getRadiologyModuleById("rad-fast-ultrasound-abdomen-ct");
    expect(fast).toBeDefined();
    expect(fast?.title).toContain("E-FAST");

    const mri = getRadiologyModuleById("rad-radiation-safety-mri");
    expect(mri).toBeDefined();
    expect(mri?.title).toContain("Radiation Protection");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getRadiologyModuleByCompetency("RD1.1")?.id).toBe(CHEST_RADIOGRAPHY_ABCDE_MODULE.id);
    expect(getRadiologyModuleByCompetency("RD3.1")?.id).toBe(HEAD_CT_INTRACRANIAL_HEMORRHAGE_MODULE.id);
    expect(getRadiologyModuleByCompetency("RD5.1")?.id).toBe(ABDOMINAL_FAST_ULTRASOUND_CT_MODULE.id);
    expect(getRadiologyModuleByCompetency("RD7.1")?.id).toBe(RADIATION_SAFETY_MRI_PHYSICS_MODULE.id);
  });
});
