import {
  ANATOMY2_CORE_MODULES,
  getAnatomy2ModuleById,
  getAnatomy2ModuleByCompetency,
  CRANIAL_NERVES_BRAINSTEM_SYNDROMES_MODULE,
  DEEP_FASCIAL_SPACES_HEAD_NECK_MODULE,
  ORBIT_CAVERNOUS_SINUS_OTIC_MODULE,
  CLINICAL_EMBRYOLOGY_BRANCHIAL_APPARATUS_MODULE
} from "../../lib/curriculum/content/anatomy2";

describe("Human Anatomy II (ANAT-102) Learning Content Modules", () => {
  it("should contain all 4 core Human Anatomy II modules", () => {
    expect(ANATOMY2_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    ANATOMY2_CORE_MODULES.forEach((mod) => {
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
    const cr = getAnatomy2ModuleById("anatomy2-cranial-nerves-brainstem-syndromes");
    expect(cr).toBeDefined();
    expect(cr?.title).toContain("Cranial Nerves");

    const sp = getAnatomy2ModuleById("anatomy2-deep-fascial-spaces-head-neck");
    expect(sp).toBeDefined();
    expect(sp?.title).toContain("Deep Cervical Fascia");

    const cav = getAnatomy2ModuleById("anatomy2-orbit-cavernous-sinus-otic");
    expect(cav).toBeDefined();
    expect(cav?.title).toContain("Orbit, Cavernous Sinus");

    const emb = getAnatomy2ModuleById("anatomy2-clinical-embryology-branchial-apparatus");
    expect(emb).toBeDefined();
    expect(emb?.title).toContain("Clinical Embryology");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getAnatomy2ModuleByCompetency("AN26.1")?.id).toBe(CRANIAL_NERVES_BRAINSTEM_SYNDROMES_MODULE.id);
    expect(getAnatomy2ModuleByCompetency("AN35.1")?.id).toBe(DEEP_FASCIAL_SPACES_HEAD_NECK_MODULE.id);
    expect(getAnatomy2ModuleByCompetency("AN41.1")?.id).toBe(ORBIT_CAVERNOUS_SINUS_OTIC_MODULE.id);
    expect(getAnatomy2ModuleByCompetency("AN64.1")?.id).toBe(CLINICAL_EMBRYOLOGY_BRANCHIAL_APPARATUS_MODULE.id);
  });
});
