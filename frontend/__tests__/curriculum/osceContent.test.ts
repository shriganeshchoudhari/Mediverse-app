import {
  OSCE_CORE_MODULES,
  getOsceModuleById,
  getOsceModuleByCompetency,
  OSCE_CARDIOVASCULAR_NEUROLOGICAL_STATIONS_MODULE,
  OSCE_EMERGENCY_TRAUMA_ACLS_STATIONS_MODULE,
  OSCE_SURGICAL_PROCEDURES_ABG_STATIONS_MODULE,
  OSCE_COMMUNICATION_ETHICS_OBGYN_STATIONS_MODULE
} from "../../lib/curriculum/content/osce";

describe("Objective Structured Clinical Examination (OSCE-403) Learning Content Modules", () => {
  it("should contain all 4 core OSCE station modules", () => {
    expect(OSCE_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    OSCE_CORE_MODULES.forEach((mod) => {
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
    const cvs = getOsceModuleById("osce-cardiovascular-neurological-stations");
    expect(cvs).toBeDefined();
    expect(cvs?.title).toContain("Cardiovascular Precordial");

    const acls = getOsceModuleById("osce-emergency-trauma-acls-stations");
    expect(acls).toBeDefined();
    expect(acls?.title).toContain("ATLS Trauma");

    const surg = getOsceModuleById("osce-surgical-procedures-abg-stations");
    expect(surg).toBeDefined();
    expect(surg?.title).toContain("Suture Selection");

    const comm = getOsceModuleById("osce-communication-ethics-obgyn-stations");
    expect(comm).toBeDefined();
    expect(comm?.title).toContain("SPIKES Breaking Bad News");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getOsceModuleByCompetency("OS1.1")?.id).toBe(OSCE_CARDIOVASCULAR_NEUROLOGICAL_STATIONS_MODULE.id);
    expect(getOsceModuleByCompetency("OS3.1")?.id).toBe(OSCE_EMERGENCY_TRAUMA_ACLS_STATIONS_MODULE.id);
    expect(getOsceModuleByCompetency("OS5.1")?.id).toBe(OSCE_SURGICAL_PROCEDURES_ABG_STATIONS_MODULE.id);
    expect(getOsceModuleByCompetency("OS7.1")?.id).toBe(OSCE_COMMUNICATION_ETHICS_OBGYN_STATIONS_MODULE.id);
  });
});
