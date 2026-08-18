import {
  ORTHOPEDICS_CORE_MODULES,
  getOrthopedicsModuleById,
  getOrthopedicsModuleByCompetency,
  FRACTURE_CLASSIFICATION_PHYSEAL_MODULE,
  ACUTE_COMPARTMENT_SYNDROME_MODULE,
  JOINT_DISLOCATIONS_SPINE_NERVES_MODULE,
  BONE_TUMORS_INFECTIONS_MODULE
} from "../../lib/curriculum/content/orthopedics";

describe("Orthopedics & Traumatology (ORTH-301) Learning Content Modules", () => {
  it("should contain all 4 core orthopedics modules", () => {
    expect(ORTHOPEDICS_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    ORTHOPEDICS_CORE_MODULES.forEach((mod) => {
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
    const frac = getOrthopedicsModuleById("orth-fractures-physeal");
    expect(frac).toBeDefined();
    expect(frac?.title).toContain("Physeal");

    const comp = getOrthopedicsModuleById("orth-compartment-syndrome");
    expect(comp).toBeDefined();
    expect(comp?.title).toContain("Compartment Syndrome");

    const disloc = getOrthopedicsModuleById("orth-dislocations-nerves");
    expect(disloc).toBeDefined();
    expect(disloc?.title).toContain("Dislocations");

    const tumor = getOrthopedicsModuleById("orth-tumors-osteomyelitis");
    expect(tumor).toBeDefined();
    expect(tumor?.title).toContain("Tumors");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getOrthopedicsModuleByCompetency("OR1.1")?.id).toBe(FRACTURE_CLASSIFICATION_PHYSEAL_MODULE.id);
    expect(getOrthopedicsModuleByCompetency("OR3.1")?.id).toBe(ACUTE_COMPARTMENT_SYNDROME_MODULE.id);
    expect(getOrthopedicsModuleByCompetency("OR5.1")?.id).toBe(JOINT_DISLOCATIONS_SPINE_NERVES_MODULE.id);
    expect(getOrthopedicsModuleByCompetency("OR7.1")?.id).toBe(BONE_TUMORS_INFECTIONS_MODULE.id);
  });
});
