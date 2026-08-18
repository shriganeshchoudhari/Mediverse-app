import {
  ENT_ADV_CORE_MODULES,
  getEntAdvModuleById,
  getEntAdvModuleByCompetency,
  DEEP_NECK_SPACE_AIRWAY_INFECTIONS_MODULE,
  VESTIBULAR_AUDIOLOGY_NEUROMA_MODULE,
  CHOLESTEATOMA_OTOSCLEROSIS_MODULE,
  HEAD_NECK_ONCOLOGY_NECK_DISSECTIONS_MODULE
} from "../../lib/curriculum/content/entadv";

describe("Clinical Otolaryngology Advanced (ENT-301) Learning Content Modules", () => {
  it("should contain all 4 core Otolaryngology Advanced modules", () => {
    expect(ENT_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    ENT_ADV_CORE_MODULES.forEach((mod) => {
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
    const dn = getEntAdvModuleById("ent-adv-deep-neck-infections");
    expect(dn).toBeDefined();
    expect(dn?.title).toContain("Deep Neck Space Infections");

    const ves = getEntAdvModuleById("ent-adv-vestibular-neuroma");
    expect(ves).toBeDefined();
    expect(ves?.title).toContain("Vestibular Pathology");

    const oto = getEntAdvModuleById("ent-adv-cholesteatoma-otosclerosis");
    expect(oto).toBeDefined();
    expect(oto?.title).toContain("Otology & Middle Ear Disorders");

    const onc = getEntAdvModuleById("ent-adv-head-neck-oncology");
    expect(onc).toBeDefined();
    expect(onc?.title).toContain("Head & Neck Surgical Oncology");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getEntAdvModuleByCompetency("EN1.1")?.id).toBe(DEEP_NECK_SPACE_AIRWAY_INFECTIONS_MODULE.id);
    expect(getEntAdvModuleByCompetency("EN3.1")?.id).toBe(VESTIBULAR_AUDIOLOGY_NEUROMA_MODULE.id);
    expect(getEntAdvModuleByCompetency("EN5.1")?.id).toBe(CHOLESTEATOMA_OTOSCLEROSIS_MODULE.id);
    expect(getEntAdvModuleByCompetency("EN7.1")?.id).toBe(HEAD_NECK_ONCOLOGY_NECK_DISSECTIONS_MODULE.id);
  });
});
