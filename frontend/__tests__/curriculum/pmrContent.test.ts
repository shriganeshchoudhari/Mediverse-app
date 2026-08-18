import {
  PMR_CORE_MODULES,
  getPmrModuleById,
  getPmrModuleByCompetency,
  STROKE_NEURO_REHAB_BRUNNSTROM_MODULE,
  SPINAL_CORD_INJURY_ASIA_AUTONOMIC_MODULE,
  PROSTHETICS_ORTHOTICS_K_LEVELS_MODULE,
  GAIT_CYCLE_BIOMECHANICS_PATHOLOGY_MODULE
} from "../../lib/curriculum/content/pmr";

describe("Physical Medicine & Rehabilitation (PMR-401) Learning Content Modules", () => {
  it("should contain all 4 core PMR modules", () => {
    expect(PMR_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    PMR_CORE_MODULES.forEach((mod) => {
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
    const stroke = getPmrModuleById("pmr-stroke-neuro-rehab-brunnstrom");
    expect(stroke).toBeDefined();
    expect(stroke?.title).toContain("Stroke Neuro-Rehabilitation");

    const sci = getPmrModuleById("pmr-spinal-cord-injury-asia-autonomic");
    expect(sci).toBeDefined();
    expect(sci?.title).toContain("Spinal Cord Injury");

    const prosthetics = getPmrModuleById("pmr-prosthetics-orthotics-k-levels");
    expect(prosthetics).toBeDefined();
    expect(prosthetics?.title).toContain("Lower Limb Prosthetics");

    const gait = getPmrModuleById("pmr-gait-cycle-biomechanics-pathology");
    expect(gait).toBeDefined();
    expect(gait?.title).toContain("Gait Cycle Biomechanics");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getPmrModuleByCompetency("PM1.1")?.id).toBe(STROKE_NEURO_REHAB_BRUNNSTROM_MODULE.id);
    expect(getPmrModuleByCompetency("PM3.1")?.id).toBe(SPINAL_CORD_INJURY_ASIA_AUTONOMIC_MODULE.id);
    expect(getPmrModuleByCompetency("PM5.1")?.id).toBe(PROSTHETICS_ORTHOTICS_K_LEVELS_MODULE.id);
    expect(getPmrModuleByCompetency("PM7.1")?.id).toBe(GAIT_CYCLE_BIOMECHANICS_PATHOLOGY_MODULE.id);
  });
});
