import {
  MEDICINE_ADV_CORE_MODULES,
  getMedicineAdvModuleById,
  getMedicineAdvModuleByCompetency,
  ACUTE_CORONARY_SYNDROMES_ECG_MODULE,
  HEART_FAILURE_REDUCED_EF_GDMT_MODULE,
  ADVANCED_ACID_BASE_ABG_INTERPRETATION_MODULE,
  ACUTE_KIDNEY_INJURY_KDIGO_FENA_MODULE
} from "../../lib/curriculum/content/medicineadv";

describe("Clinical Internal Medicine (MED-301) Learning Content Modules", () => {
  it("should contain all 4 core Medicine Advanced modules", () => {
    expect(MEDICINE_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    MEDICINE_ADV_CORE_MODULES.forEach((mod) => {
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
    const acs = getMedicineAdvModuleById("medicine-adv-acute-coronary-syndromes");
    expect(acs).toBeDefined();
    expect(acs?.title).toContain("Acute Coronary Syndromes");

    const hf = getMedicineAdvModuleById("medicine-adv-heart-failure-hfref");
    expect(hf).toBeDefined();
    expect(hf?.title).toContain("Heart Failure with Reduced Ejection Fraction");

    const abg = getMedicineAdvModuleById("medicine-adv-acid-base-abg");
    expect(abg).toBeDefined();
    expect(abg?.title).toContain("Advanced Acid-Base & ABG Interpretation");

    const aki = getMedicineAdvModuleById("medicine-adv-aki-kdigo-fena");
    expect(aki).toBeDefined();
    expect(aki?.title).toContain("Acute Kidney Injury");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getMedicineAdvModuleByCompetency("IM1.1")?.id).toBe(ACUTE_CORONARY_SYNDROMES_ECG_MODULE.id);
    expect(getMedicineAdvModuleByCompetency("IM1.3")?.id).toBe(HEART_FAILURE_REDUCED_EF_GDMT_MODULE.id);
    expect(getMedicineAdvModuleByCompetency("IM1.5")?.id).toBe(ADVANCED_ACID_BASE_ABG_INTERPRETATION_MODULE.id);
    expect(getMedicineAdvModuleByCompetency("IM1.7")?.id).toBe(ACUTE_KIDNEY_INJURY_KDIGO_FENA_MODULE.id);
  });
});
