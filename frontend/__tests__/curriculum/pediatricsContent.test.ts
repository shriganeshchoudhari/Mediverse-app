import {
  PEDIATRICS_CORE_MODULES,
  getPediatricsModuleById,
  getPediatricsModuleByCompetency,
  DEVELOPMENTAL_MILESTONES_GROWTH_MODULE,
  NEONATAL_JAUNDICE_PHOTOTHERAPY_MODULE,
  NEONATAL_RESUSCITATION_RDS_MODULE,
  PEDIATRIC_INFECTIONS_DEHYDRATION_MODULE
} from "../../lib/curriculum/content/pediatrics";

describe("Pediatrics & Neonatology (PED-301) Learning Content Modules", () => {
  it("should contain all 4 core pediatrics modules", () => {
    expect(PEDIATRICS_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    PEDIATRICS_CORE_MODULES.forEach((mod) => {
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
    const dev = getPediatricsModuleById("ped-milestones-growth");
    expect(dev).toBeDefined();
    expect(dev?.title).toContain("Milestones");

    const jaund = getPediatricsModuleById("ped-jaundice-phototherapy");
    expect(jaund).toBeDefined();
    expect(jaund?.title).toContain("Hyperbilirubinemia");

    const nrp = getPediatricsModuleById("ped-nrp-rds");
    expect(nrp).toBeDefined();
    expect(nrp?.title).toContain("NRP");

    const deh = getPediatricsModuleById("ped-dehydration-infections");
    expect(deh).toBeDefined();
    expect(deh?.title).toContain("Dehydration");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getPediatricsModuleByCompetency("PE1.1")?.id).toBe(DEVELOPMENTAL_MILESTONES_GROWTH_MODULE.id);
    expect(getPediatricsModuleByCompetency("PE3.1")?.id).toBe(NEONATAL_JAUNDICE_PHOTOTHERAPY_MODULE.id);
    expect(getPediatricsModuleByCompetency("PE4.1")?.id).toBe(NEONATAL_RESUSCITATION_RDS_MODULE.id);
    expect(getPediatricsModuleByCompetency("PE5.1")?.id).toBe(PEDIATRIC_INFECTIONS_DEHYDRATION_MODULE.id);
  });
});
