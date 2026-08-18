import {
  ENT_CORE_MODULES,
  getEntModuleById,
  getEntModuleByCompetency,
  AUDIOMETRY_TUNING_FORK_MODULE,
  OTOLOGY_OTITIS_CHOLESTEATOMA_MODULE,
  RHINOLOGY_EPISTAXIS_SINUSITIS_MODULE,
  PHARYNGOLOGY_AIRWAY_TRACHEOSTOMY_MODULE
} from "../../lib/curriculum/content/ent";

describe("Otorhinolaryngology / ENT (ENT-301) Learning Content Modules", () => {
  it("should contain all 4 core ENT modules", () => {
    expect(ENT_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    ENT_CORE_MODULES.forEach((mod) => {
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
    const audio = getEntModuleById("ent-audiometry-tuning-fork");
    expect(audio).toBeDefined();
    expect(audio?.title).toContain("Tuning Fork");

    const otol = getEntModuleById("ent-otology-cholesteatoma");
    expect(otol).toBeDefined();
    expect(otol?.title).toContain("Cholesteatoma");

    const rhino = getEntModuleById("ent-rhinology-epistaxis");
    expect(rhino).toBeDefined();
    expect(rhino?.title).toContain("Epistaxis");

    const air = getEntModuleById("ent-pharyngology-tracheostomy");
    expect(air).toBeDefined();
    expect(air?.title).toContain("Deep Neck");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getEntModuleByCompetency("EN1.1")?.id).toBe(AUDIOMETRY_TUNING_FORK_MODULE.id);
    expect(getEntModuleByCompetency("EN3.1")?.id).toBe(OTOLOGY_OTITIS_CHOLESTEATOMA_MODULE.id);
    expect(getEntModuleByCompetency("EN5.1")?.id).toBe(RHINOLOGY_EPISTAXIS_SINUSITIS_MODULE.id);
    expect(getEntModuleByCompetency("EN7.1")?.id).toBe(PHARYNGOLOGY_AIRWAY_TRACHEOSTOMY_MODULE.id);
  });
});
