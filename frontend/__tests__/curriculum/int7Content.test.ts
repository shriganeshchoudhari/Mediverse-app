import {
  INT7_CORE_MODULES,
  getInt7ModuleById,
  getInt7ModuleByCompetency,
  INPATIENT_DERMATOLOGY_SJS_TEN_MODULE,
  EMERGENCY_PSYCHIATRY_NMS_SEROTONIN_MODULE,
  OPHTHALMIC_EMERGENCIES_GLAUCOMA_CRAO_MODULE,
  ENT_EMERGENCIES_EPISTAXIS_QUINSY_MODULE
} from "../../lib/curriculum/content/int7";

describe("Internship Core Elective Rotations & Subspecialty Postings (INT-507) Content Modules", () => {
  it("should contain all 4 core Internship Subspecialty modules", () => {
    expect(INT7_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    INT7_CORE_MODULES.forEach((mod) => {
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
    const derm = getInt7ModuleById("int7-inpatient-dermatology-sjs-ten");
    expect(derm).toBeDefined();
    expect(derm?.title).toContain("Inpatient Dermatology");

    const psych = getInt7ModuleById("int7-emergency-psychiatry-nms-serotonin");
    expect(psych).toBeDefined();
    expect(psych?.title).toContain("Emergency Psychiatry");

    const eye = getInt7ModuleById("int7-ophthalmic-emergencies-glaucoma-crao");
    expect(eye).toBeDefined();
    expect(eye?.title).toContain("Ophthalmic Emergencies");

    const ent = getInt7ModuleById("int7-ent-emergencies-epistaxis-quinsy");
    expect(ent).toBeDefined();
    expect(ent?.title).toContain("ENT Emergencies");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getInt7ModuleByCompetency("IN7.1")?.id).toBe(INPATIENT_DERMATOLOGY_SJS_TEN_MODULE.id);
    expect(getInt7ModuleByCompetency("IN7.2")?.id).toBe(EMERGENCY_PSYCHIATRY_NMS_SEROTONIN_MODULE.id);
    expect(getInt7ModuleByCompetency("IN7.3")?.id).toBe(OPHTHALMIC_EMERGENCIES_GLAUCOMA_CRAO_MODULE.id);
    expect(getInt7ModuleByCompetency("IN7.4")?.id).toBe(ENT_EMERGENCIES_EPISTAXIS_QUINSY_MODULE.id);
  });
});
