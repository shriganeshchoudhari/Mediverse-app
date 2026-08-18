import {
  INT2_CORE_MODULES,
  getInt2ModuleById,
  getInt2ModuleByCompetency,
  VASCULAR_ACCESS_ARTERIAL_LINE_MODULE,
  PARACENTESIS_THORACENTESIS_FLUID_MODULE,
  LUMBAR_PUNCTURE_CSF_MANOMETRY_MODULE,
  POCUS_CARDIAC_LUNG_VASCULAR_MODULE
} from "../../lib/curriculum/content/int2";

describe("Internship Core Procedural Skills & POCUS (INT-502) Content Modules", () => {
  it("should contain all 4 core Internship Procedural Skills modules", () => {
    expect(INT2_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    INT2_CORE_MODULES.forEach((mod) => {
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
    const vascular = getInt2ModuleById("int2-vascular-access-arterial-line");
    expect(vascular).toBeDefined();
    expect(vascular?.title).toContain("Vascular Access");

    const fluids = getInt2ModuleById("int2-paracentesis-thoracentesis-fluid");
    expect(fluids).toBeDefined();
    expect(fluids?.title).toContain("Paracentesis");

    const csf = getInt2ModuleById("int2-lumbar-puncture-csf-manometry");
    expect(csf).toBeDefined();
    expect(csf?.title).toContain("Lumbar Puncture");

    const pocus = getInt2ModuleById("int2-pocus-cardiac-lung-vascular");
    expect(pocus).toBeDefined();
    expect(pocus?.title).toContain("Point-of-Care Ultrasound");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getInt2ModuleByCompetency("IN2.1")?.id).toBe(VASCULAR_ACCESS_ARTERIAL_LINE_MODULE.id);
    expect(getInt2ModuleByCompetency("IN2.2")?.id).toBe(PARACENTESIS_THORACENTESIS_FLUID_MODULE.id);
    expect(getInt2ModuleByCompetency("IN2.3")?.id).toBe(LUMBAR_PUNCTURE_CSF_MANOMETRY_MODULE.id);
    expect(getInt2ModuleByCompetency("IN2.4")?.id).toBe(POCUS_CARDIAC_LUNG_VASCULAR_MODULE.id);
  });
});
