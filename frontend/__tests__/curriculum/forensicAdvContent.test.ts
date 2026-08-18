import {
  FORENSIC_ADV_CORE_MODULES,
  getForensicAdvModuleById,
  getForensicAdvModuleByCompetency,
  THANATOLOGY_POSTMORTEM_INTERVAL_MODULE,
  FORENSIC_BALLISTICS_GUNSHOT_WOUNDS_MODULE,
  MECHANICAL_ASPHYXIA_NECK_TRAUMA_MODULE,
  FORENSIC_TOXICOLOGY_FATAL_POISONS_MODULE
} from "../../lib/curriculum/content/forensicadv";

describe("Clinical Forensic Pathology & Legal Toxicology (FOR-301) Learning Content Modules", () => {
  it("should contain all 4 core Forensic Advanced modules", () => {
    expect(FORENSIC_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    FORENSIC_ADV_CORE_MODULES.forEach((mod) => {
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
    const than = getForensicAdvModuleById("forensic-adv-thanatology-pmi");
    expect(than).toBeDefined();
    expect(than?.title).toContain("Thanatology & Postmortem Interval");

    const bal = getForensicAdvModuleById("forensic-adv-ballistics-gsw");
    expect(bal).toBeDefined();
    expect(bal?.title).toContain("Forensic Ballistics");

    const asph = getForensicAdvModuleById("forensic-adv-asphyxia-neck-trauma");
    expect(asph).toBeDefined();
    expect(asph?.title).toContain("Mechanical Asphyxia");

    const tox = getForensicAdvModuleById("forensic-adv-toxicology-fatal-poisons");
    expect(tox).toBeDefined();
    expect(tox?.title).toContain("Medicolegal Autopsy Toxicology");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getForensicAdvModuleByCompetency("FM1.1")?.id).toBe(THANATOLOGY_POSTMORTEM_INTERVAL_MODULE.id);
    expect(getForensicAdvModuleByCompetency("FM3.1")?.id).toBe(FORENSIC_BALLISTICS_GUNSHOT_WOUNDS_MODULE.id);
    expect(getForensicAdvModuleByCompetency("FM5.1")?.id).toBe(MECHANICAL_ASPHYXIA_NECK_TRAUMA_MODULE.id);
    expect(getForensicAdvModuleByCompetency("FM7.1")?.id).toBe(FORENSIC_TOXICOLOGY_FATAL_POISONS_MODULE.id);
  });
});
