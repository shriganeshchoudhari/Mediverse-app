import {
  MEDICINE_CORE_MODULES,
  getMedicineModuleById,
  getMedicineModuleByCompetency,
  CARDIOLOGY_INTERNAL_MEDICINE_MODULE,
  PULMONOLOGY_INTERNAL_MEDICINE_MODULE,
  NEPHROLOGY_ACIDBASE_MODULE,
  ENDOCRINOLOGY_METABOLISM_MODULE
} from "../../lib/curriculum/content/medicine";

describe("General Medicine (MED-301) Learning Content Modules", () => {
  it("should contain all 4 core medicine modules", () => {
    expect(MEDICINE_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    MEDICINE_CORE_MODULES.forEach((mod) => {
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
    const card = getMedicineModuleById("med-cardiology");
    expect(card).toBeDefined();
    expect(card?.title).toContain("Cardiology");

    const pulm = getMedicineModuleById("med-pulmonology");
    expect(pulm).toBeDefined();
    expect(pulm?.title).toContain("Pulmonology");

    const neph = getMedicineModuleById("med-nephrology");
    expect(neph).toBeDefined();
    expect(neph?.title).toContain("Nephrology");

    const endo = getMedicineModuleById("med-endocrinology");
    expect(endo).toBeDefined();
    expect(endo?.title).toContain("Endocrinology");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getMedicineModuleByCompetency("IM1.1")?.id).toBe(CARDIOLOGY_INTERNAL_MEDICINE_MODULE.id);
    expect(getMedicineModuleByCompetency("IM2.1")?.id).toBe(PULMONOLOGY_INTERNAL_MEDICINE_MODULE.id);
    expect(getMedicineModuleByCompetency("IM3.1")?.id).toBe(NEPHROLOGY_ACIDBASE_MODULE.id);
    expect(getMedicineModuleByCompetency("IM4.1")?.id).toBe(ENDOCRINOLOGY_METABOLISM_MODULE.id);
  });
});
