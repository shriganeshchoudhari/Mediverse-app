import {
  PG5_CORE_MODULES,
  getPg5ModuleById,
  getPg5ModuleByCompetency,
  MONOCHORIONIC_TTTS_FETOSCOPIC_LASER_MODULE,
  FETAL_GROWTH_RESTRICTION_DOPPLER_DUCTUS_VENOUS_MODULE,
  AMNIOTIC_FLUID_EMBOLISM_AOK_RESUSCITATION_MODULE,
  RESUSCITATIVE_HYSTEROTOMY_PMCD_ARREST_MODULE
} from "../../lib/curriculum/content/pg5";

describe("Postgraduate Advanced Obstetrics, Fetal Medicine & Maternal Critical Care (PG-605) Content Modules", () => {
  it("should contain all 4 core Postgraduate Obstetrics & Fetal Medicine modules", () => {
    expect(PG5_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    PG5_CORE_MODULES.forEach((mod) => {
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
    const ttts = getPg5ModuleById("pg5-monochorionic-ttts-fetoscopic-laser");
    expect(ttts).toBeDefined();
    expect(ttts?.title).toContain("Monochorionic Twin Gestations");

    const fgr = getPg5ModuleById("pg5-fetal-growth-restriction-doppler-ductus-venous");
    expect(fgr).toBeDefined();
    expect(fgr?.title).toContain("Early-Onset Fetal Growth Restriction");

    const afe = getPg5ModuleById("pg5-amniotic-fluid-embolism-aok-resuscitation");
    expect(afe).toBeDefined();
    expect(afe?.title).toContain("Amniotic Fluid Embolism");

    const pmcd = getPg5ModuleById("pg5-resuscitative-hysterotomy-pmcd-arrest");
    expect(pmcd).toBeDefined();
    expect(pmcd?.title).toContain("Resuscitative Hysterotomy");
  });

  it("should retrieve modules by NMC PG CBME competency code", () => {
    expect(getPg5ModuleByCompetency("PG5.1")?.id).toBe(MONOCHORIONIC_TTTS_FETOSCOPIC_LASER_MODULE.id);
    expect(getPg5ModuleByCompetency("PG5.2")?.id).toBe(FETAL_GROWTH_RESTRICTION_DOPPLER_DUCTUS_VENOUS_MODULE.id);
    expect(getPg5ModuleByCompetency("PG5.3")?.id).toBe(AMNIOTIC_FLUID_EMBOLISM_AOK_RESUSCITATION_MODULE.id);
    expect(getPg5ModuleByCompetency("PG5.4")?.id).toBe(RESUSCITATIVE_HYSTEROTOMY_PMCD_ARREST_MODULE.id);
  });
});
