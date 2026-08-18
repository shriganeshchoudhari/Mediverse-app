import {
  ANATOMY_CORE_MODULES,
  getAnatomyModuleById,
  getAnatomyModuleByCompetency,
  BRACHIAL_PLEXUS_MODULE,
  LOWER_LIMB_MODULE,
  THORAX_MEDIASTINUM_MODULE,
  ABDOMEN_INGUINAL_MODULE,
  HEAD_NECK_MODULE,
  HISTOLOGY_MODULE
} from "../../lib/curriculum/content/anatomy";

describe("Human Anatomy & Histology (ANAT-101) Learning Content Modules", () => {
  it("should contain all 6 core anatomical & histological modules", () => {
    expect(ANATOMY_CORE_MODULES.length).toBe(6);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    ANATOMY_CORE_MODULES.forEach((mod) => {
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
    const plexus = getAnatomyModuleById("anat-brachial-plexus");
    expect(plexus).toBeDefined();
    expect(plexus?.title).toContain("Brachial Plexus");

    const lowerLimb = getAnatomyModuleById("anat-lower-limb");
    expect(lowerLimb).toBeDefined();
    expect(lowerLimb?.title).toContain("Lower Limb");

    const thorax = getAnatomyModuleById("anat-thorax");
    expect(thorax).toBeDefined();
    expect(thorax?.title).toContain("Thorax");

    const abdomen = getAnatomyModuleById("anat-abdomen-inguinal");
    expect(abdomen).toBeDefined();
    expect(abdomen?.title).toContain("Abdominal Wall");

    const headNeck = getAnatomyModuleById("anat-head-neck");
    expect(headNeck).toBeDefined();
    expect(headNeck?.title).toContain("Cranial Base");

    const hist = getAnatomyModuleById("anat-histology");
    expect(hist).toBeDefined();
    expect(hist?.title).toContain("Histology");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getAnatomyModuleByCompetency("AN1.1")?.id).toBe(BRACHIAL_PLEXUS_MODULE.id);
    expect(getAnatomyModuleByCompetency("AN14.1")?.id).toBe(LOWER_LIMB_MODULE.id);
    expect(getAnatomyModuleByCompetency("AN21.1")?.id).toBe(THORAX_MEDIASTINUM_MODULE.id);
    expect(getAnatomyModuleByCompetency("AN44.1")?.id).toBe(ABDOMEN_INGUINAL_MODULE.id);
    expect(getAnatomyModuleByCompetency("AN26.1")?.id).toBe(HEAD_NECK_MODULE.id);
    expect(getAnatomyModuleByCompetency("AN65.1")?.id).toBe(HISTOLOGY_MODULE.id);
  });
});
