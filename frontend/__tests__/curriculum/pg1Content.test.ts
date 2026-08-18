import {
  PG1_CORE_MODULES,
  getPg1ModuleById,
  getPg1ModuleByCompetency,
  CRITICAL_CARE_HEMODYNAMICS_ECMO_MODULE,
  ADVANCED_VENTILATOR_ASYNCHRONY_ARDS_MODULE,
  SEPSIS_PHENOTYPING_PRECISION_RESUSCITATION_MODULE,
  RESIDENCY_ENTRUSTABLE_ACTIVITIES_QUALITY_AUDIT_MODULE
} from "../../lib/curriculum/content/pg1";

describe("Postgraduate Core Clinical Foundations & Residency Readiness (PG-601) Content Modules", () => {
  it("should contain all 4 core Postgraduate Residency modules", () => {
    expect(PG1_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    PG1_CORE_MODULES.forEach((mod) => {
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
    const hemo = getPg1ModuleById("pg1-critical-care-hemodynamics-ecmo");
    expect(hemo).toBeDefined();
    expect(hemo?.title).toContain("Critical Care Hemodynamics");

    const vent = getPg1ModuleById("pg1-advanced-ventilator-asynchrony-ards");
    expect(vent).toBeDefined();
    expect(vent?.title).toContain("Advanced Mechanical Ventilation");

    const sepsis = getPg1ModuleById("pg1-sepsis-phenotyping-precision-resuscitation");
    expect(sepsis).toBeDefined();
    expect(sepsis?.title).toContain("Sepsis-3 Precision Resuscitation");

    const residency = getPg1ModuleById("pg1-residency-entrustable-activities-quality-audit");
    expect(residency).toBeDefined();
    expect(residency?.title).toContain("Residency Core Competencies");
  });

  it("should retrieve modules by NMC PG CBME competency code", () => {
    expect(getPg1ModuleByCompetency("PG1.1")?.id).toBe(CRITICAL_CARE_HEMODYNAMICS_ECMO_MODULE.id);
    expect(getPg1ModuleByCompetency("PG1.2")?.id).toBe(ADVANCED_VENTILATOR_ASYNCHRONY_ARDS_MODULE.id);
    expect(getPg1ModuleByCompetency("PG1.3")?.id).toBe(SEPSIS_PHENOTYPING_PRECISION_RESUSCITATION_MODULE.id);
    expect(getPg1ModuleByCompetency("PG1.4")?.id).toBe(RESIDENCY_ENTRUSTABLE_ACTIVITIES_QUALITY_AUDIT_MODULE.id);
  });
});
