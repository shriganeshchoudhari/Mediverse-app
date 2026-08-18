import {
  EMERGENCY_MEDICINE_CORE_MODULES,
  getEmergencyMedicineModuleById,
  getEmergencyMedicineModuleByCompetency,
  ACLS_CARDIAC_ARREST_ALGORITHMS_MODULE,
  SHOCK_HEMODYNAMIC_RESUSCITATION_MODULE,
  TOXICOLOGY_TOXIDROMES_ANTIDOTES_MODULE,
  TRAUMA_ATLS_EMERGENCY_PROCEDURES_MODULE
} from "../../lib/curriculum/content/emergencymedicine";

describe("Emergency Medicine & Resuscitation (EM-301) Learning Content Modules", () => {
  it("should contain all 4 core emergency medicine modules", () => {
    expect(EMERGENCY_MEDICINE_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    EMERGENCY_MEDICINE_CORE_MODULES.forEach((mod) => {
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
    const acls = getEmergencyMedicineModuleById("em-acls-cardiac-arrest-algorithms");
    expect(acls).toBeDefined();
    expect(acls?.title).toContain("ACLS Cardiac Arrest");

    const shock = getEmergencyMedicineModuleById("em-shock-hemodynamic-resuscitation");
    expect(shock).toBeDefined();
    expect(shock?.title).toContain("Shock Classification");

    const tox = getEmergencyMedicineModuleById("em-toxicology-toxidromes-antidotes");
    expect(tox).toBeDefined();
    expect(tox?.title).toContain("Toxicology Toxidromes");

    const trauma = getEmergencyMedicineModuleById("em-trauma-atls-emergency-procedures");
    expect(trauma).toBeDefined();
    expect(trauma?.title).toContain("ATLS Primary Survey");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getEmergencyMedicineModuleByCompetency("EM1.1")?.id).toBe(ACLS_CARDIAC_ARREST_ALGORITHMS_MODULE.id);
    expect(getEmergencyMedicineModuleByCompetency("EM3.1")?.id).toBe(SHOCK_HEMODYNAMIC_RESUSCITATION_MODULE.id);
    expect(getEmergencyMedicineModuleByCompetency("EM5.1")?.id).toBe(TOXICOLOGY_TOXIDROMES_ANTIDOTES_MODULE.id);
    expect(getEmergencyMedicineModuleByCompetency("EM7.1")?.id).toBe(TRAUMA_ATLS_EMERGENCY_PROCEDURES_MODULE.id);
  });
});
