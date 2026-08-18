import {
  PSYCHIATRY_ADV_CORE_MODULES,
  getPsychiatryAdvModuleById,
  getPsychiatryAdvModuleByCompetency,
  PSYCHIATRIC_EMERGENCIES_TOX_SYNDROMES_MODULE,
  MOOD_DISORDERS_LITHIUM_TERATOLOGY_MODULE,
  PSYCHOTIC_DISORDERS_ANTIPSYCHOTICS_MODULE,
  SUBSTANCE_USE_ADDICTION_PROTOCOLS_MODULE
} from "../../lib/curriculum/content/psychiatryadv";

describe("Clinical Psychiatry Advanced (PSY-301) Learning Content Modules", () => {
  it("should contain all 4 core Psychiatry Advanced modules", () => {
    expect(PSYCHIATRY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    PSYCHIATRY_ADV_CORE_MODULES.forEach((mod) => {
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
    const em = getPsychiatryAdvModuleById("psychiatry-adv-emergencies-tox");
    expect(em).toBeDefined();
    expect(em?.title).toContain("Acute Psychiatric Emergencies");

    const md = getPsychiatryAdvModuleById("psychiatry-adv-mood-lithium");
    expect(md).toBeDefined();
    expect(md?.title).toContain("Mood Disorders & Psychopharmacology");

    const ps = getPsychiatryAdvModuleById("psychiatry-adv-psychosis-antipsychotics");
    expect(ps).toBeDefined();
    expect(ps?.title).toContain("Psychotic Disorders & Antipsychotic");

    const ad = getPsychiatryAdvModuleById("psychiatry-adv-substance-addiction");
    expect(ad).toBeDefined();
    expect(ad?.title).toContain("Substance Use Disorders");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getPsychiatryAdvModuleByCompetency("PS1.1")?.id).toBe(PSYCHIATRIC_EMERGENCIES_TOX_SYNDROMES_MODULE.id);
    expect(getPsychiatryAdvModuleByCompetency("PS3.1")?.id).toBe(MOOD_DISORDERS_LITHIUM_TERATOLOGY_MODULE.id);
    expect(getPsychiatryAdvModuleByCompetency("PS5.1")?.id).toBe(PSYCHOTIC_DISORDERS_ANTIPSYCHOTICS_MODULE.id);
    expect(getPsychiatryAdvModuleByCompetency("PS7.1")?.id).toBe(SUBSTANCE_USE_ADDICTION_PROTOCOLS_MODULE.id);
  });
});
