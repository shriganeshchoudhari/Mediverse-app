import {
  PULMONOLOGY_CORE_MODULES,
  getPulmonologyModuleById,
  getPulmonologyModuleByCompetency,
  SPIROMETRY_PFT_FLOW_VOLUME_CURVES_MODULE,
  TUBERCULOSIS_NTEP_MDR_REGIMENS_MODULE,
  PLEURAL_DISEASES_LIGHTS_CRITERIA_THORACOCENTESIS_MODULE,
  OCCUPATIONAL_LUNG_DISEASES_OSA_MODULE
} from "../../lib/curriculum/content/pulmonology";

describe("Pulmonology & Respiratory Medicine (RESP-401) Learning Content Modules", () => {
  it("should contain all 4 core pulmonology modules", () => {
    expect(PULMONOLOGY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    PULMONOLOGY_CORE_MODULES.forEach((mod) => {
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
    const pft = getPulmonologyModuleById("resp-spirometry-pft-flow-volume-curves");
    expect(pft).toBeDefined();
    expect(pft?.title).toContain("Pulmonary Function Tests");

    const tb = getPulmonologyModuleById("resp-tuberculosis-ntep-mdr-regimens");
    expect(tb).toBeDefined();
    expect(tb?.title).toContain("Tuberculosis");

    const pleural = getPulmonologyModuleById("resp-pleural-diseases-lights-criteria");
    expect(pleural).toBeDefined();
    expect(pleural?.title).toContain("Pleural Diseases");

    const occ = getPulmonologyModuleById("resp-occupational-lung-diseases-osa");
    expect(occ).toBeDefined();
    expect(occ?.title).toContain("Occupational Pneumoconioses");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getPulmonologyModuleByCompetency("CT1.1")?.id).toBe(SPIROMETRY_PFT_FLOW_VOLUME_CURVES_MODULE.id);
    expect(getPulmonologyModuleByCompetency("CT3.1")?.id).toBe(TUBERCULOSIS_NTEP_MDR_REGIMENS_MODULE.id);
    expect(getPulmonologyModuleByCompetency("CT5.1")?.id).toBe(PLEURAL_DISEASES_LIGHTS_CRITERIA_THORACOCENTESIS_MODULE.id);
    expect(getPulmonologyModuleByCompetency("CT7.1")?.id).toBe(OCCUPATIONAL_LUNG_DISEASES_OSA_MODULE.id);
  });
});
