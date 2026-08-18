import {
  CRITICAL_CARE_ADV_CORE_MODULES,
  getCriticalCareAdvModuleById,
  getCriticalCareAdvModuleByCompetency,
  ADVANCED_HEMODYNAMICS_OXYGEN_DELIVERY_MODULE,
  ARDS_MECHANICAL_VENTILATION_MODULE,
  FLUID_RESPONSIVENESS_VASOPRESSORS_MODULE,
  ICU_SEDATION_DELIRIUM_ABCDEF_MODULE
} from "../../lib/curriculum/content/criticalcareadv";

describe("Critical Care Medicine & Hemodynamic Monitoring (CCM-301) Learning Content Modules", () => {
  it("should contain all 4 core Critical Care Advanced modules", () => {
    expect(CRITICAL_CARE_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    CRITICAL_CARE_ADV_CORE_MODULES.forEach((mod) => {
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
    const hemo = getCriticalCareAdvModuleById("critical-care-adv-hemodynamics-oxygen-delivery");
    expect(hemo).toBeDefined();
    expect(hemo?.title).toContain("Advanced Hemodynamic Monitoring");

    const ards = getCriticalCareAdvModuleById("critical-care-adv-ards-mechanical-ventilation");
    expect(ards).toBeDefined();
    expect(ards?.title).toContain("Acute Respiratory Distress Syndrome");

    const flu = getCriticalCareAdvModuleById("critical-care-adv-fluid-responsiveness-vasopressors");
    expect(flu).toBeDefined();
    expect(flu?.title).toContain("Dynamic Fluid Responsiveness");

    const del = getCriticalCareAdvModuleById("critical-care-adv-sedation-delirium-abcdef");
    expect(del).toBeDefined();
    expect(del?.title).toContain("ICU Sedation");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getCriticalCareAdvModuleByCompetency("CC1.1")?.id).toBe(ADVANCED_HEMODYNAMICS_OXYGEN_DELIVERY_MODULE.id);
    expect(getCriticalCareAdvModuleByCompetency("CC1.3")?.id).toBe(ARDS_MECHANICAL_VENTILATION_MODULE.id);
    expect(getCriticalCareAdvModuleByCompetency("CC1.5")?.id).toBe(FLUID_RESPONSIVENESS_VASOPRESSORS_MODULE.id);
    expect(getCriticalCareAdvModuleByCompetency("CC1.7")?.id).toBe(ICU_SEDATION_DELIRIUM_ABCDEF_MODULE.id);
  });
});
