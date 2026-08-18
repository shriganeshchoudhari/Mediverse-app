import {
  PHYSIOLOGY_CORE_MODULES,
  getPhysiologyModuleById,
  getPhysiologyModuleByCompetency,
  CARDIAC_CYCLE_MODULE,
  RESPIRATORY_MECHANICS_MODULE,
  RENAL_FILTRATION_MODULE,
  NERVE_MUSCLE_MODULE,
  ACID_BASE_MODULE,
  HEMATOLOGY_MODULE,
  GASTROINTESTINAL_MODULE,
  ENDOCRINE_MODULE,
  NEUROPHYSIOLOGY_MODULE
} from "../../lib/curriculum/content/physiology";

describe("Human Physiology (PHYS-101) Learning Content Modules", () => {
  it("should contain all 9 core simulation and organ-linked modules", () => {
    expect(PHYSIOLOGY_CORE_MODULES.length).toBe(9);
  });

  it("should have valid metadata and non-empty markdown for all modules", () => {
    PHYSIOLOGY_CORE_MODULES.forEach(mod => {
      expect(mod.id).toBeTruthy();
      expect(mod.unitCode).toBeTruthy();
      expect(mod.title).toBeTruthy();
      expect(mod.markdownContent.length).toBeGreaterThan(500);
      expect(mod.clinicalVignettes.length).toBeGreaterThan(0);
    });
  });

  it("should retrieve modules by ID", () => {
    const cardiac = getPhysiologyModuleById("phys-cardiac-cycle");
    expect(cardiac).toBeDefined();
    expect(cardiac?.title).toContain("Cardiac Cycle");

    const hem = getPhysiologyModuleById("phys-hematology");
    expect(hem).toBeDefined();
    expect(hem?.title).toContain("Hemostasis");

    const gi = getPhysiologyModuleById("phys-gastrointestinal");
    expect(gi).toBeDefined();
    expect(gi?.title).toContain("Gastrointestinal");

    const endo = getPhysiologyModuleById("phys-endocrine");
    expect(endo).toBeDefined();
    expect(endo?.title).toContain("Endocrine");

    const neuro = getPhysiologyModuleById("phys-neurophysiology");
    expect(neuro).toBeDefined();
    expect(neuro?.title).toContain("Basal Ganglia");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getPhysiologyModuleByCompetency("PY5.2")?.id).toBe(CARDIAC_CYCLE_MODULE.id);
    expect(getPhysiologyModuleByCompetency("PY6.2")?.id).toBe(RESPIRATORY_MECHANICS_MODULE.id);
    expect(getPhysiologyModuleByCompetency("PY7.1")?.id).toBe(RENAL_FILTRATION_MODULE.id);
    expect(getPhysiologyModuleByCompetency("PY1.3")?.id).toBe(NERVE_MUSCLE_MODULE.id);
    expect(getPhysiologyModuleByCompetency("PY7.4")?.id).toBe(ACID_BASE_MODULE.id);
    expect(getPhysiologyModuleByCompetency("PY2.1")?.id).toBe(HEMATOLOGY_MODULE.id);
    expect(getPhysiologyModuleByCompetency("PY4.1")?.id).toBe(GASTROINTESTINAL_MODULE.id);
    expect(getPhysiologyModuleByCompetency("PY8.1")?.id).toBe(ENDOCRINE_MODULE.id);
    expect(getPhysiologyModuleByCompetency("PY10.1")?.id).toBe(NEUROPHYSIOLOGY_MODULE.id);
  });
});
