import {
  DERMATOLOGY_ADV_CORE_MODULES,
  getDermatologyAdvModuleById,
  getDermatologyAdvModuleByCompetency,
  CUTANEOUS_EMERGENCIES_SJS_TEN_MODULE,
  AUTOIMMUNE_BULLOUS_PEMPHIGUS_MODULE,
  CUTANEOUS_MALIGNANCIES_MELANOMA_MODULE,
  PSORIASIS_BIOLOGICS_INFLAMMATORY_MODULE
} from "../../lib/curriculum/content/dermatologyadv";

describe("Clinical Dermatology Advanced (DER-301) Learning Content Modules", () => {
  it("should contain all 4 core Dermatology Advanced modules", () => {
    expect(DERMATOLOGY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    DERMATOLOGY_ADV_CORE_MODULES.forEach((mod) => {
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
    const em = getDermatologyAdvModuleById("dermatology-adv-emergencies-sjs-ten");
    expect(em).toBeDefined();
    expect(em?.title).toContain("Cutaneous Emergencies");

    const bul = getDermatologyAdvModuleById("dermatology-adv-bullous-pemphigus");
    expect(bul).toBeDefined();
    expect(bul?.title).toContain("Autoimmune Bullous Diseases");

    const onc = getDermatologyAdvModuleById("dermatology-adv-malignancies-melanoma");
    expect(onc).toBeDefined();
    expect(onc?.title).toContain("Cutaneous Oncology");

    const inf = getDermatologyAdvModuleById("dermatology-adv-psoriasis-necrotizing");
    expect(inf).toBeDefined();
    expect(inf?.title).toContain("Inflammatory & Infectious Dermatoses");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getDermatologyAdvModuleByCompetency("DR1.1")?.id).toBe(CUTANEOUS_EMERGENCIES_SJS_TEN_MODULE.id);
    expect(getDermatologyAdvModuleByCompetency("DR3.1")?.id).toBe(AUTOIMMUNE_BULLOUS_PEMPHIGUS_MODULE.id);
    expect(getDermatologyAdvModuleByCompetency("DR5.1")?.id).toBe(CUTANEOUS_MALIGNANCIES_MELANOMA_MODULE.id);
    expect(getDermatologyAdvModuleByCompetency("DR7.1")?.id).toBe(PSORIASIS_BIOLOGICS_INFLAMMATORY_MODULE.id);
  });
});
