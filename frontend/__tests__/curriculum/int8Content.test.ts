import {
  INT8_CORE_MODULES,
  getInt8ModuleById,
  getInt8ModuleByCompetency,
  MEDICO_LEGAL_DEATH_CERTIFICATION_THOTA_MODULE,
  ENTRUSTABLE_PROFESSIONAL_ACTIVITIES_PORTFOLIO_MODULE,
  EXIT_OSCE_MASTER_STATION_SIMULATIONS_MODULE,
  QUALITY_IMPROVEMENT_PATIENT_SAFETY_SBAR_MODULE
} from "../../lib/curriculum/content/int8";

describe("Internship Core Comprehensive Exit Competencies & Portfolio (INT-508) Content Modules", () => {
  it("should contain all 4 core Internship Exit Competency modules", () => {
    expect(INT8_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    INT8_CORE_MODULES.forEach((mod) => {
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
    const mccd = getInt8ModuleById("int8-medico-legal-death-certification-thota");
    expect(mccd).toBeDefined();
    expect(mccd?.title).toContain("Medico-Legal Jurisprudence");

    const epa = getInt8ModuleById("int8-entrustable-professional-activities-portfolio");
    expect(epa).toBeDefined();
    expect(epa?.title).toContain("Entrustable Professional Activities");

    const osce = getInt8ModuleById("int8-exit-osce-master-station-simulations");
    expect(osce).toBeDefined();
    expect(osce?.title).toContain("Exit OSCE Master Stations");

    const qi = getInt8ModuleById("int8-quality-improvement-patient-safety-sbar");
    expect(qi).toBeDefined();
    expect(qi?.title).toContain("Quality Improvement");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getInt8ModuleByCompetency("IN8.1")?.id).toBe(MEDICO_LEGAL_DEATH_CERTIFICATION_THOTA_MODULE.id);
    expect(getInt8ModuleByCompetency("IN8.2")?.id).toBe(ENTRUSTABLE_PROFESSIONAL_ACTIVITIES_PORTFOLIO_MODULE.id);
    expect(getInt8ModuleByCompetency("IN8.3")?.id).toBe(EXIT_OSCE_MASTER_STATION_SIMULATIONS_MODULE.id);
    expect(getInt8ModuleByCompetency("IN8.4")?.id).toBe(QUALITY_IMPROVEMENT_PATIENT_SAFETY_SBAR_MODULE.id);
  });
});
