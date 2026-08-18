import {
  AETCOM_CORE_MODULES,
  getAetcomModuleById,
  getAetcomModuleByCompetency,
  BIOETHICS_FOUR_PRINCIPLES_CONSENT_MODULE,
  SPIKES_BREAKING_BAD_NEWS_MODULE,
  CONFIDENTIALITY_TARASOFF_NEGLIGENCE_MODULE,
  END_OF_LIFE_EUTHANASIA_ORGAN_DONATION_MODULE
} from "../../lib/curriculum/content/aetcom";

describe("AETCOM & Medical Ethics (AETCOM-001) Learning Content Modules", () => {
  it("should contain all 4 core AETCOM modules", () => {
    expect(AETCOM_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    AETCOM_CORE_MODULES.forEach((mod) => {
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
    const consent = getAetcomModuleById("aetcom-bioethics-principles-consent");
    expect(consent).toBeDefined();
    expect(consent?.title).toContain("4 Principles of Bioethics");

    const spikes = getAetcomModuleById("aetcom-spikes-breaking-bad-news");
    expect(spikes).toBeDefined();
    expect(spikes?.title).toContain("SPIKES Protocol");

    const conf = getAetcomModuleById("aetcom-confidentiality-tarasoff-negligence");
    expect(conf).toBeDefined();
    expect(conf?.title).toContain("Confidentiality");

    const eol = getAetcomModuleById("aetcom-end-of-life-double-effect-brain-death");
    expect(eol).toBeDefined();
    expect(eol?.title).toContain("End-of-Life Ethics");
  });

  it("should retrieve modules by NMC AETCOM competency code", () => {
    expect(getAetcomModuleByCompetency("AET1.1")?.id).toBe(BIOETHICS_FOUR_PRINCIPLES_CONSENT_MODULE.id);
    expect(getAetcomModuleByCompetency("AET2.1")?.id).toBe(SPIKES_BREAKING_BAD_NEWS_MODULE.id);
    expect(getAetcomModuleByCompetency("AET3.1")?.id).toBe(CONFIDENTIALITY_TARASOFF_NEGLIGENCE_MODULE.id);
    expect(getAetcomModuleByCompetency("AET4.1")?.id).toBe(END_OF_LIFE_EUTHANASIA_ORGAN_DONATION_MODULE.id);
  });
});
