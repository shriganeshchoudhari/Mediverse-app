import {
  INT3_CORE_MODULES,
  getInt3ModuleById,
  getInt3ModuleByCompetency,
  POSTPARTUM_HEMORRHAGE_ECLAMPSIA_MODULE,
  NEONATAL_RESUSCITATION_NRP_MODULE,
  PEDIATRIC_ADVANCED_LIFE_SUPPORT_PALS_MODULE,
  PEDIATRIC_STATUS_EPILEPTICUS_AIRWAY_MODULE
} from "../../lib/curriculum/content/int3";

describe("Internship Core Maternal, Neonatal & Pediatric Emergencies (INT-503) Content Modules", () => {
  it("should contain all 4 core Internship Maternal & Pediatric Emergency modules", () => {
    expect(INT3_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    INT3_CORE_MODULES.forEach((mod) => {
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
    const pph = getInt3ModuleById("int3-postpartum-hemorrhage-eclampsia");
    expect(pph).toBeDefined();
    expect(pph?.title).toContain("Postpartum Hemorrhage");

    const nrp = getInt3ModuleById("int3-neonatal-resuscitation-nrp");
    expect(nrp).toBeDefined();
    expect(nrp?.title).toContain("Neonatal Resuscitation");

    const pals = getInt3ModuleById("int3-pediatric-advanced-life-support-pals");
    expect(pals).toBeDefined();
    expect(pals?.title).toContain("Pediatric Advanced Life Support");

    const seizure = getInt3ModuleById("int3-pediatric-status-epilepticus-airway");
    expect(seizure).toBeDefined();
    expect(seizure?.title).toContain("Pediatric Status Epilepticus");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getInt3ModuleByCompetency("IN3.1")?.id).toBe(POSTPARTUM_HEMORRHAGE_ECLAMPSIA_MODULE.id);
    expect(getInt3ModuleByCompetency("IN3.2")?.id).toBe(NEONATAL_RESUSCITATION_NRP_MODULE.id);
    expect(getInt3ModuleByCompetency("IN3.3")?.id).toBe(PEDIATRIC_ADVANCED_LIFE_SUPPORT_PALS_MODULE.id);
    expect(getInt3ModuleByCompetency("IN3.4")?.id).toBe(PEDIATRIC_STATUS_EPILEPTICUS_AIRWAY_MODULE.id);
  });
});
