import {
  NUCLEAR_MEDICINE_CORE_MODULES,
  getNuclearMedicineModuleById,
  getNuclearMedicineModuleByCompetency,
  RADIOPHARMACEUTICALS_DECAY_PHYSICS_MODULE,
  PLANAR_SCINTIGRAPHY_SPECT_ORGAN_IMAGING_MODULE,
  PET_CT_ONCOLOGY_NEUROLOGY_METABOLISM_MODULE,
  THERANOSTICS_TARGETED_RADIONUCLIDE_THERAPY_MODULE
} from "../../lib/curriculum/content/nuclearmedicine";

describe("Nuclear Medicine & Molecular Theranostics (NUCL-401) Learning Content Modules", () => {
  it("should contain all 4 core Nuclear Medicine modules", () => {
    expect(NUCLEAR_MEDICINE_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    NUCLEAR_MEDICINE_CORE_MODULES.forEach((mod) => {
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
    const phys = getNuclearMedicineModuleById("nuclearmedicine-radiopharmaceuticals-decay-physics");
    expect(phys).toBeDefined();
    expect(phys?.title).toContain("Radiopharmaceutical Physics");

    const spect = getNuclearMedicineModuleById("nuclearmedicine-planar-scintigraphy-spect-organ-imaging");
    expect(spect).toBeDefined();
    expect(spect?.title).toContain("Planar Scintigraphy");

    const pet = getNuclearMedicineModuleById("nuclearmedicine-pet-ct-oncology-neurology-metabolism");
    expect(pet).toBeDefined();
    expect(pet?.title).toContain("PET-CT");

    const thera = getNuclearMedicineModuleById("nuclearmedicine-theranostics-targeted-radionuclide-therapy");
    expect(thera).toBeDefined();
    expect(thera?.title).toContain("Molecular Theranostics");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getNuclearMedicineModuleByCompetency("NM1.1")?.id).toBe(RADIOPHARMACEUTICALS_DECAY_PHYSICS_MODULE.id);
    expect(getNuclearMedicineModuleByCompetency("NM3.1")?.id).toBe(PLANAR_SCINTIGRAPHY_SPECT_ORGAN_IMAGING_MODULE.id);
    expect(getNuclearMedicineModuleByCompetency("NM5.1")?.id).toBe(PET_CT_ONCOLOGY_NEUROLOGY_METABOLISM_MODULE.id);
    expect(getNuclearMedicineModuleByCompetency("NM7.1")?.id).toBe(THERANOSTICS_TARGETED_RADIONUCLIDE_THERAPY_MODULE.id);
  });
});
