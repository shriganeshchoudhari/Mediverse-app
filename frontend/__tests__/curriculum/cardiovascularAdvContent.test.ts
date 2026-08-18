import {
  CARDIOVASCULAR_ADV_CORE_MODULES,
  getCardiovascularAdvModuleById,
  getCardiovascularAdvModuleByCompetency,
  WIGGERS_DIAGRAM_PV_LOOPS_MODULE,
  JVP_WAVEFORMS_HEMODYNAMICS_MODULE,
  HEART_FAILURE_SHOCK_HEMODYNAMICS_MODULE,
  ACLS_ARRHYTHMIAS_PHARMACOTHERAPY_MODULE
} from "../../lib/curriculum/content/cardiovascularadv";

describe("Cardiovascular Pathophysiology & Advanced Hemodynamics (CARD-301) Learning Content Modules", () => {
  it("should contain all 4 core Cardiovascular modules", () => {
    expect(CARDIOVASCULAR_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    CARDIOVASCULAR_ADV_CORE_MODULES.forEach((mod) => {
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
    const pv = getCardiovascularAdvModuleById("cardiovascular-adv-wiggers-diagram-pv-loops");
    expect(pv).toBeDefined();
    expect(pv?.title).toContain("Wiggers Diagram");

    const jvp = getCardiovascularAdvModuleById("cardiovascular-adv-jvp-waveforms-hemodynamics");
    expect(jvp).toBeDefined();
    expect(jvp?.title).toContain("Jugular Venous Pressure");

    const shock = getCardiovascularAdvModuleById("cardiovascular-adv-heart-failure-shock-hemodynamics");
    expect(shock).toBeDefined();
    expect(shock?.title).toContain("Heart Failure");

    const acls = getCardiovascularAdvModuleById("cardiovascular-adv-acls-arrhythmias-pharmacotherapy");
    expect(acls).toBeDefined();
    expect(acls?.title).toContain("Advanced ACLS");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getCardiovascularAdvModuleByCompetency("CV1.1")?.id).toBe(WIGGERS_DIAGRAM_PV_LOOPS_MODULE.id);
    expect(getCardiovascularAdvModuleByCompetency("CV3.1")?.id).toBe(JVP_WAVEFORMS_HEMODYNAMICS_MODULE.id);
    expect(getCardiovascularAdvModuleByCompetency("CV5.1")?.id).toBe(HEART_FAILURE_SHOCK_HEMODYNAMICS_MODULE.id);
    expect(getCardiovascularAdvModuleByCompetency("CV7.1")?.id).toBe(ACLS_ARRHYTHMIAS_PHARMACOTHERAPY_MODULE.id);
  });
});
