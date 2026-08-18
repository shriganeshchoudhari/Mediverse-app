import {
  DENTISTRY_CORE_MODULES,
  getDentistryModuleById,
  getDentistryModuleByCompetency,
  DENTAL_ANATOMY_ERUPTION_NOTATION_MODULE,
  ODONTOGENIC_INFECTIONS_FASCIAL_SPACES_MODULE,
  MAXILLOFACIAL_TRAUMA_LE_FORT_FRACTURES_MODULE,
  ORAL_PATHOLOGY_PREMALIGNANCY_TMJ_MODULE
} from "../../lib/curriculum/content/dentistry";

describe("Dentistry & Maxillofacial Surgery (DENT-301) Learning Content Modules", () => {
  it("should contain all 4 core Dentistry modules", () => {
    expect(DENTISTRY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    DENTISTRY_CORE_MODULES.forEach((mod) => {
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
    const anat = getDentistryModuleById("dentistry-dental-anatomy-eruption-notation");
    expect(anat).toBeDefined();
    expect(anat?.title).toContain("Dental Anatomy");

    const infect = getDentistryModuleById("dentistry-odontogenic-infections-fascial-spaces");
    expect(infect).toBeDefined();
    expect(infect?.title).toContain("Ludwig's Angina");

    const trauma = getDentistryModuleById("dentistry-maxillofacial-trauma-le-fort-fractures");
    expect(trauma).toBeDefined();
    expect(trauma?.title).toContain("Le Fort");

    const path = getDentistryModuleById("dentistry-oral-pathology-premalignancy-tmj");
    expect(path).toBeDefined();
    expect(path?.title).toContain("Ameloblastoma");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getDentistryModuleByCompetency("DE1.1")?.id).toBe(DENTAL_ANATOMY_ERUPTION_NOTATION_MODULE.id);
    expect(getDentistryModuleByCompetency("DE3.1")?.id).toBe(ODONTOGENIC_INFECTIONS_FASCIAL_SPACES_MODULE.id);
    expect(getDentistryModuleByCompetency("DE5.1")?.id).toBe(MAXILLOFACIAL_TRAUMA_LE_FORT_FRACTURES_MODULE.id);
    expect(getDentistryModuleByCompetency("DE7.1")?.id).toBe(ORAL_PATHOLOGY_PREMALIGNANCY_TMJ_MODULE.id);
  });
});
