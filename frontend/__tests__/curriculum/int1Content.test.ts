import {
  INT1_CORE_MODULES,
  getInt1ModuleById,
  getInt1ModuleByCompetency,
  ACLS_PATHWAYS_ARREST_MODULE,
  SEPSIS3_RESUSCITATION_BUNDLE_MODULE,
  TRAUMA_ATLS_FAST_EXAM_MODULE,
  RAPID_SEQUENCE_INTUBATION_7PS_MODULE
} from "../../lib/curriculum/content/int1";

describe("Internship Core Emergency & Critical Care (INT-501) Content Modules", () => {
  it("should contain all 4 core Internship Emergency & Critical Care modules", () => {
    expect(INT1_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    INT1_CORE_MODULES.forEach((mod) => {
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
    const acls = getInt1ModuleById("int1-acls-pathways-arrest");
    expect(acls).toBeDefined();
    expect(acls?.title).toContain("Advanced Cardiac Life Support");

    const sepsis = getInt1ModuleById("int1-sepsis3-resuscitation-bundle");
    expect(sepsis).toBeDefined();
    expect(sepsis?.title).toContain("Sepsis-3 Resuscitation");

    const trauma = getInt1ModuleById("int1-trauma-atls-fast-exam");
    expect(trauma).toBeDefined();
    expect(trauma?.title).toContain("Trauma Resuscitation");

    const rsi = getInt1ModuleById("int1-rapid-sequence-intubation-7ps");
    expect(rsi).toBeDefined();
    expect(rsi?.title).toContain("Rapid Sequence Intubation");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getInt1ModuleByCompetency("IN1.1")?.id).toBe(ACLS_PATHWAYS_ARREST_MODULE.id);
    expect(getInt1ModuleByCompetency("IN1.2")?.id).toBe(SEPSIS3_RESUSCITATION_BUNDLE_MODULE.id);
    expect(getInt1ModuleByCompetency("IN1.3")?.id).toBe(TRAUMA_ATLS_FAST_EXAM_MODULE.id);
    expect(getInt1ModuleByCompetency("IN1.4")?.id).toBe(RAPID_SEQUENCE_INTUBATION_7PS_MODULE.id);
  });
});
