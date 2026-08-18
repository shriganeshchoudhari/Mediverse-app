import {
  ANESTHESIOLOGY_ADV_CORE_MODULES,
  getAnesthesiologyAdvModuleById,
  getAnesthesiologyAdvModuleByCompetency,
  DIFFICULT_AIRWAY_CRICOTHYROIDOTOMY_MODULE,
  LOCAL_ANESTHETIC_TOXICITY_LIPID_RESCUE_MODULE,
  ANESTHETIC_PHARMACOLOGY_MALIGNANT_HYPERTHERMIA_MODULE,
  NEUROMUSCULAR_BLOCKADE_SUGAMMADEX_MODULE
} from "../../lib/curriculum/content/anesthesiologyadv";

describe("Clinical Anesthesiology Advanced (ANE-301) Learning Content Modules", () => {
  it("should contain all 4 core Anesthesiology Advanced modules", () => {
    expect(ANESTHESIOLOGY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    ANESTHESIOLOGY_ADV_CORE_MODULES.forEach((mod) => {
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
    const air = getAnesthesiologyAdvModuleById("anesthesiology-adv-difficult-airway-cricothyroidotomy");
    expect(air).toBeDefined();
    expect(air?.title).toContain("Difficult Airway");

    const tox = getAnesthesiologyAdvModuleById("anesthesiology-adv-local-anesthetic-toxicity-lipid-rescue");
    expect(tox).toBeDefined();
    expect(tox?.title).toContain("Local Anesthetic Systemic Toxicity");

    const hyp = getAnesthesiologyAdvModuleById("anesthesiology-adv-pharmacology-malignant-hyperthermia");
    expect(hyp).toBeDefined();
    expect(hyp?.title).toContain("Anesthetic Pharmacology");

    const nm = getAnesthesiologyAdvModuleById("anesthesiology-adv-neuromuscular-blockade-sugammadex");
    expect(nm).toBeDefined();
    expect(nm?.title).toContain("Neuromuscular Blockade");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getAnesthesiologyAdvModuleByCompetency("AN1.1")?.id).toBe(DIFFICULT_AIRWAY_CRICOTHYROIDOTOMY_MODULE.id);
    expect(getAnesthesiologyAdvModuleByCompetency("AN3.1")?.id).toBe(LOCAL_ANESTHETIC_TOXICITY_LIPID_RESCUE_MODULE.id);
    expect(getAnesthesiologyAdvModuleByCompetency("AN5.1")?.id).toBe(ANESTHETIC_PHARMACOLOGY_MALIGNANT_HYPERTHERMIA_MODULE.id);
    expect(getAnesthesiologyAdvModuleByCompetency("AN7.1")?.id).toBe(NEUROMUSCULAR_BLOCKADE_SUGAMMADEX_MODULE.id);
  });
});
