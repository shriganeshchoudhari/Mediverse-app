import {
  FORENSIC_CORE_MODULES,
  getForensicModuleById,
  getForensicModuleByCompetency,
  THANATOLOGY_POSTMORTEM_MODULE,
  TRAUMATOLOGY_MECHANICAL_WOUNDS_MODULE,
  FORENSIC_TOXICOLOGY_POISONS_MODULE,
  MEDICAL_JURISPRUDENCE_AUTOPSY_MODULE
} from "../../lib/curriculum/content/forensic";

describe("Forensic Medicine & Toxicology (FOR-201) Learning Content Modules", () => {
  it("should contain all 4 core forensic modules", () => {
    expect(FORENSIC_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    FORENSIC_CORE_MODULES.forEach((mod) => {
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
    const than = getForensicModuleById("for-thanatology");
    expect(than).toBeDefined();
    expect(than?.title).toContain("Thanatology");

    const traum = getForensicModuleById("for-traumatology");
    expect(traum).toBeDefined();
    expect(traum?.title).toContain("Traumatology");

    const tox = getForensicModuleById("for-toxicology");
    expect(tox).toBeDefined();
    expect(tox?.title).toContain("Toxicology");

    const jur = getForensicModuleById("for-jurisprudence");
    expect(jur).toBeDefined();
    expect(jur?.title).toContain("Jurisprudence");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getForensicModuleByCompetency("FM1.1")?.id).toBe(THANATOLOGY_POSTMORTEM_MODULE.id);
    expect(getForensicModuleByCompetency("FM2.1")?.id).toBe(TRAUMATOLOGY_MECHANICAL_WOUNDS_MODULE.id);
    expect(getForensicModuleByCompetency("FM8.1")?.id).toBe(FORENSIC_TOXICOLOGY_POISONS_MODULE.id);
    expect(getForensicModuleByCompetency("FM10.1")?.id).toBe(MEDICAL_JURISPRUDENCE_AUTOPSY_MODULE.id);
  });
});
