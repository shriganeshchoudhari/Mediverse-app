import {
  PG4_CORE_MODULES,
  getPg4ModuleById,
  getPg4ModuleByCompetency,
  NEONATAL_HIE_THERAPEUTIC_HYPOTHERMIA_MODULE,
  PPHN_INHALED_NITRIC_OXIDE_ECMO_MODULE,
  EXTREME_PREMATURITY_LISA_SURFACTANT_BPD_MODULE,
  PEDIATRIC_SEPTIC_SHOCK_VASOACTIVE_SCORES_MODULE
} from "../../lib/curriculum/content/pg4";

describe("Postgraduate Advanced Pediatrics & Neonatal Intensive Care (PG-604) Content Modules", () => {
  it("should contain all 4 core Postgraduate Pediatrics & NICU modules", () => {
    expect(PG4_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    PG4_CORE_MODULES.forEach((mod) => {
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
    const hie = getPg4ModuleById("pg4-neonatal-hie-therapeutic-hypothermia");
    expect(hie).toBeDefined();
    expect(hie?.title).toContain("Neonatal Hypoxic-Ischemic Encephalopathy");

    const pphn = getPg4ModuleById("pg4-pphn-inhaled-nitric-oxide-ecmo");
    expect(pphn).toBeDefined();
    expect(pphn?.title).toContain("Persistent Pulmonary Hypertension of the Newborn");

    const lisa = getPg4ModuleById("pg4-extreme-prematurity-lisa-surfactant-bpd");
    expect(lisa).toBeDefined();
    expect(lisa?.title).toContain("Extreme Prematurity");

    const vis = getPg4ModuleById("pg4-pediatric-septic-shock-vasoactive-scores");
    expect(vis).toBeDefined();
    expect(vis?.title).toContain("Pediatric Septic Shock");
  });

  it("should retrieve modules by NMC PG CBME competency code", () => {
    expect(getPg4ModuleByCompetency("PG4.1")?.id).toBe(NEONATAL_HIE_THERAPEUTIC_HYPOTHERMIA_MODULE.id);
    expect(getPg4ModuleByCompetency("PG4.2")?.id).toBe(PPHN_INHALED_NITRIC_OXIDE_ECMO_MODULE.id);
    expect(getPg4ModuleByCompetency("PG4.3")?.id).toBe(EXTREME_PREMATURITY_LISA_SURFACTANT_BPD_MODULE.id);
    expect(getPg4ModuleByCompetency("PG4.4")?.id).toBe(PEDIATRIC_SEPTIC_SHOCK_VASOACTIVE_SCORES_MODULE.id);
  });
});
