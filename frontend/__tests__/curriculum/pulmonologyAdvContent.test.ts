import {
  PULMONOLOGY_ADV_CORE_MODULES,
  getPulmonologyAdvModuleById,
  getPulmonologyAdvModuleByCompetency,
  FLOW_VOLUME_LOOPS_PFT_MODULE,
  MECHANICAL_VENTILATION_MECHANICS_MODULE,
  ARDS_BERLIN_DEFINITIONS_PRONE_MODULE,
  HYPOXEMIA_MECHANISMS_CAPNOGRAPHY_MODULE
} from "../../lib/curriculum/content/pulmonologyadv";

describe("Pulmonary Pathophysiology, Critical Care & Mechanical Ventilation (PULM-301) Learning Content Modules", () => {
  it("should contain all 4 core Pulmonology Advanced modules", () => {
    expect(PULMONOLOGY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    PULMONOLOGY_ADV_CORE_MODULES.forEach((mod) => {
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
    const pft = getPulmonologyAdvModuleById("pulmonology-adv-flow-volume-loops-pft");
    expect(pft).toBeDefined();
    expect(pft?.title).toContain("Flow-Volume Loops");

    const vent = getPulmonologyAdvModuleById("pulmonology-adv-mechanical-ventilation-mechanics");
    expect(vent).toBeDefined();
    expect(vent?.title).toContain("Mechanical Ventilation");

    const ards = getPulmonologyAdvModuleById("pulmonology-adv-ards-berlin-definitions-prone");
    expect(ards).toBeDefined();
    expect(ards?.title).toContain("ARDS Pathophysiology");

    const hypox = getPulmonologyAdvModuleById("pulmonology-adv-hypoxemia-mechanisms-capnography");
    expect(hypox).toBeDefined();
    expect(hypox?.title).toContain("Hypoxemia");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getPulmonologyAdvModuleByCompetency("IM15.1")?.id).toBe(FLOW_VOLUME_LOOPS_PFT_MODULE.id);
    expect(getPulmonologyAdvModuleByCompetency("SU25.1")?.id).toBe(MECHANICAL_VENTILATION_MECHANICS_MODULE.id);
    expect(getPulmonologyAdvModuleByCompetency("IM17.1")?.id).toBe(ARDS_BERLIN_DEFINITIONS_PRONE_MODULE.id);
    expect(getPulmonologyAdvModuleByCompetency("IM18.1")?.id).toBe(HYPOXEMIA_MECHANISMS_CAPNOGRAPHY_MODULE.id);
  });
});
