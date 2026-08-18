import {
  NEUROANATOMY_CORE_MODULES,
  getNeuroanatomyModuleById,
  getNeuroanatomyModuleByCompetency,
  BRAINSTEM_STROKE_SYNDROMES_MODULE,
  SPINAL_CORD_SYNDROMES_MYELOPATHY_MODULE,
  CORTICAL_SYNDROMES_APHASIAS_VISUAL_FIELDS_MODULE,
  CRANIAL_NERVES_CAVERNOUS_SINUS_NMJ_MODULE
} from "../../lib/curriculum/content/neuroanatomy";

describe("Clinical Neuroanatomy & Localization Neuropathology (NEURO-201) Learning Content Modules", () => {
  it("should contain all 4 core Neuroanatomy modules", () => {
    expect(NEUROANATOMY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    NEUROANATOMY_CORE_MODULES.forEach((mod) => {
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
    const brainstem = getNeuroanatomyModuleById("neuroanatomy-brainstem-stroke-syndromes");
    expect(brainstem).toBeDefined();
    expect(brainstem?.title).toContain("Brainstem Stroke");

    const spinal = getNeuroanatomyModuleById("neuroanatomy-spinal-cord-syndromes-myelopathy");
    expect(spinal).toBeDefined();
    expect(spinal?.title).toContain("Spinal Cord");

    const cortical = getNeuroanatomyModuleById("neuroanatomy-cortical-syndromes-aphasias-visual-fields");
    expect(cortical).toBeDefined();
    expect(cortical?.title).toContain("Aphasia");

    const nmj = getNeuroanatomyModuleById("neuroanatomy-cranial-nerves-cavernous-sinus-nmj");
    expect(nmj).toBeDefined();
    expect(nmj?.title).toContain("Cranial Nerve");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getNeuroanatomyModuleByCompetency("NE1.1")?.id).toBe(BRAINSTEM_STROKE_SYNDROMES_MODULE.id);
    expect(getNeuroanatomyModuleByCompetency("NE3.1")?.id).toBe(SPINAL_CORD_SYNDROMES_MYELOPATHY_MODULE.id);
    expect(getNeuroanatomyModuleByCompetency("NE5.1")?.id).toBe(CORTICAL_SYNDROMES_APHASIAS_VISUAL_FIELDS_MODULE.id);
    expect(getNeuroanatomyModuleByCompetency("NE7.1")?.id).toBe(CRANIAL_NERVES_CAVERNOUS_SINUS_NMJ_MODULE.id);
  });
});
