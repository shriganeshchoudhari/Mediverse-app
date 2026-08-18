import {
  INT5_CORE_MODULES,
  getInt5ModuleById,
  getInt5ModuleByCompetency,
  ACUTE_ABDOMEN_APPENDICITIS_CHOLECYSTITIS_MODULE,
  BURNS_PARKLAND_FORMULA_RESUSCITATION_MODULE,
  COMPARTMENT_SYNDROME_EMERGENCY_FASCIOTOMY_MODULE,
  NECROTIZING_FASCIITIS_SURGICAL_SEPSIS_MODULE
} from "../../lib/curriculum/content/int5";

describe("Internship Core Surgical Postings & Trauma Call (INT-505) Content Modules", () => {
  it("should contain all 4 core Internship Surgical Postings modules", () => {
    expect(INT5_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    INT5_CORE_MODULES.forEach((mod) => {
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
    const abdomen = getInt5ModuleById("int5-acute-abdomen-appendicitis-cholecystitis");
    expect(abdomen).toBeDefined();
    expect(abdomen?.title).toContain("Acute Abdomen Surgical Triage");

    const burns = getInt5ModuleById("int5-burns-parkland-formula-resuscitation");
    expect(burns).toBeDefined();
    expect(burns?.title).toContain("Thermal Burns");

    const compartment = getInt5ModuleById("int5-compartment-syndrome-emergency-fasciotomy");
    expect(compartment).toBeDefined();
    expect(compartment?.title).toContain("Acute Extremity Compartment Syndrome");

    const necrotizing = getInt5ModuleById("int5-necrotizing-fasciitis-surgical-sepsis");
    expect(necrotizing).toBeDefined();
    expect(necrotizing?.title).toContain("Necrotizing Soft Tissue Infections");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getInt5ModuleByCompetency("IN5.1")?.id).toBe(ACUTE_ABDOMEN_APPENDICITIS_CHOLECYSTITIS_MODULE.id);
    expect(getInt5ModuleByCompetency("IN5.2")?.id).toBe(BURNS_PARKLAND_FORMULA_RESUSCITATION_MODULE.id);
    expect(getInt5ModuleByCompetency("IN5.3")?.id).toBe(COMPARTMENT_SYNDROME_EMERGENCY_FASCIOTOMY_MODULE.id);
    expect(getInt5ModuleByCompetency("IN5.4")?.id).toBe(NECROTIZING_FASCIITIS_SURGICAL_SEPSIS_MODULE.id);
  });
});
