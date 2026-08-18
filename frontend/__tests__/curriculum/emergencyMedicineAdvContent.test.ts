import {
  EMERGENCY_MEDICINE_ADV_CORE_MODULES,
  getEmergencyMedicineAdvModuleById,
  getEmergencyMedicineAdvModuleByCompetency,
  ACLS_RESUSCITATION_PROTOCOLS_MODULE,
  SHOCK_CLASSIFICATION_HEMODYNAMICS_MODULE,
  EMERGENCY_TOXICOLOGY_TOXIDROMES_MODULE,
  TRAUMA_RESUSCITATION_EFAST_MODULE
} from "../../lib/curriculum/content/emergencymedicineadv";

describe("Emergency Medicine & Resuscitation Science (EM-301) Learning Content Modules", () => {
  it("should contain all 4 core Emergency Medicine Advanced modules", () => {
    expect(EMERGENCY_MEDICINE_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    EMERGENCY_MEDICINE_ADV_CORE_MODULES.forEach((mod) => {
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
    const acls = getEmergencyMedicineAdvModuleById("emergency-adv-acls-resuscitation-protocols");
    expect(acls).toBeDefined();
    expect(acls?.title).toContain("Advanced Cardiac Life Support");

    const shk = getEmergencyMedicineAdvModuleById("emergency-adv-shock-classification-hemodynamics");
    expect(shk).toBeDefined();
    expect(shk?.title).toContain("Shock Classification");

    const tox = getEmergencyMedicineAdvModuleById("emergency-adv-toxicology-toxidromes");
    expect(tox).toBeDefined();
    expect(tox?.title).toContain("Emergency Toxicology");

    const trm = getEmergencyMedicineAdvModuleById("emergency-adv-trauma-resuscitation-efast");
    expect(trm).toBeDefined();
    expect(trm?.title).toContain("Acute Trauma Resuscitation");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getEmergencyMedicineAdvModuleByCompetency("EM1.1")?.id).toBe(ACLS_RESUSCITATION_PROTOCOLS_MODULE.id);
    expect(getEmergencyMedicineAdvModuleByCompetency("EM1.3")?.id).toBe(SHOCK_CLASSIFICATION_HEMODYNAMICS_MODULE.id);
    expect(getEmergencyMedicineAdvModuleByCompetency("EM1.5")?.id).toBe(EMERGENCY_TOXICOLOGY_TOXIDROMES_MODULE.id);
    expect(getEmergencyMedicineAdvModuleByCompetency("EM1.7")?.id).toBe(TRAUMA_RESUSCITATION_EFAST_MODULE.id);
  });
});
