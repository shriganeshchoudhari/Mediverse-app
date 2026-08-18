import {
  INT4_CORE_MODULES,
  getInt4ModuleById,
  getInt4ModuleByCompetency,
  ACUTE_CORONARY_SYNDROMES_MODULE,
  DKA_HHS_HYPERGLYCEMIA_MODULE,
  AKI_KDIGO_RENAL_REPLACEMENT_MODULE,
  CIRRHOTIC_DECOMPENSATION_ENCEPHALOPATHY_MODULE
} from "../../lib/curriculum/content/int4";

describe("Internship Core Inpatient Medicine & Subspecialty Consults (INT-504) Content Modules", () => {
  it("should contain all 4 core Internship Inpatient Medicine modules", () => {
    expect(INT4_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    INT4_CORE_MODULES.forEach((mod) => {
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
    const acs = getInt4ModuleById("int4-acute-coronary-syndromes");
    expect(acs).toBeDefined();
    expect(acs?.title).toContain("Acute Coronary Syndromes");

    const dka = getInt4ModuleById("int4-dka-hhs-hyperglycemia");
    expect(dka).toBeDefined();
    expect(dka?.title).toContain("Hyperglycemic Crises");

    const aki = getInt4ModuleById("int4-aki-kdigo-renal-replacement");
    expect(aki).toBeDefined();
    expect(aki?.title).toContain("Acute Kidney Injury");

    const cirrhosis = getInt4ModuleById("int4-cirrhotic-decompensation-encephalopathy");
    expect(cirrhosis).toBeDefined();
    expect(cirrhosis?.title).toContain("Cirrhotic Decompensation");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getInt4ModuleByCompetency("IN4.1")?.id).toBe(ACUTE_CORONARY_SYNDROMES_MODULE.id);
    expect(getInt4ModuleByCompetency("IN4.2")?.id).toBe(DKA_HHS_HYPERGLYCEMIA_MODULE.id);
    expect(getInt4ModuleByCompetency("IN4.3")?.id).toBe(AKI_KDIGO_RENAL_REPLACEMENT_MODULE.id);
    expect(getInt4ModuleByCompetency("IN4.4")?.id).toBe(CIRRHOTIC_DECOMPENSATION_ENCEPHALOPATHY_MODULE.id);
  });
});
