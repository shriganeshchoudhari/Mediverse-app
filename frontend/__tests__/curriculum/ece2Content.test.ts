import {
  ECE2_CORE_MODULES,
  getEce2ModuleById,
  getEce2ModuleByCompetency,
  PATIENT_SAFETY_ROOT_CAUSE_ANALYSIS_MODULE,
  INTERPROFESSIONAL_COMMUNICATION_SBAR_MODULE,
  DIAGNOSTIC_STEWARDSHIP_EBM_MODULE,
  CLINICAL_REASONING_COGNITIVE_BIASES_MODULE
} from "../../lib/curriculum/content/ece2";

describe("Early Clinical Exposure II (ECE-102) Content Modules", () => {
  it("should contain all 4 core Early Clinical Exposure II modules", () => {
    expect(ECE2_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    ECE2_CORE_MODULES.forEach((mod) => {
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
    const saf = getEce2ModuleById("ece2-patient-safety-root-cause-analysis");
    expect(saf).toBeDefined();
    expect(saf?.title).toContain("Patient Safety");

    const sb = getEce2ModuleById("ece2-interprofessional-communication-sbar");
    expect(sb).toBeDefined();
    expect(sb?.title).toContain("Interprofessional Communication");

    const ebm = getEce2ModuleById("ece2-diagnostic-stewardship-ebm");
    expect(ebm).toBeDefined();
    expect(ebm?.title).toContain("Diagnostic Stewardship");

    const rs = getEce2ModuleById("ece2-clinical-reasoning-cognitive-biases");
    expect(rs).toBeDefined();
    expect(rs?.title).toContain("Clinical Reasoning");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getEce2ModuleByCompetency("ECE2.1")?.id).toBe(PATIENT_SAFETY_ROOT_CAUSE_ANALYSIS_MODULE.id);
    expect(getEce2ModuleByCompetency("ECE2.2")?.id).toBe(INTERPROFESSIONAL_COMMUNICATION_SBAR_MODULE.id);
    expect(getEce2ModuleByCompetency("ECE2.3")?.id).toBe(DIAGNOSTIC_STEWARDSHIP_EBM_MODULE.id);
    expect(getEce2ModuleByCompetency("ECE2.4")?.id).toBe(CLINICAL_REASONING_COGNITIVE_BIASES_MODULE.id);
  });
});
