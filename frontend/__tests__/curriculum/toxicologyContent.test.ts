import {
  TOXICOLOGY_CORE_MODULES,
  getToxicologyModuleById,
  getToxicologyModuleByCompetency,
  TOXIDROMES_ACUTE_POISONING_RESUSCITATION_MODULE,
  SIGNATURE_DRUG_OVERDOSES_ANTIDOTE_PROTOCOLS_MODULE,
  HEAVY_METAL_POISONING_CHELATION_CORROSIVES_MODULE,
  TOXIC_ALCOHOLS_ENVENOMATIONS_ENHANCED_ELIMINATION_MODULE
} from "../../lib/curriculum/content/toxicology";

describe("Clinical Toxicology & Poisoning Emergencies (TOX-301) Learning Content Modules", () => {
  it("should contain all 4 core Toxicology modules", () => {
    expect(TOXICOLOGY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    TOXICOLOGY_CORE_MODULES.forEach((mod) => {
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
    const toxi = getToxicologyModuleById("toxicology-toxidromes-acute-poisoning-resuscitation");
    expect(toxi).toBeDefined();
    expect(toxi?.title).toContain("Clinical Toxidromes");

    const drug = getToxicologyModuleById("toxicology-signature-drug-overdoses-antidote-protocols");
    expect(drug).toBeDefined();
    expect(drug?.title).toContain("Signature Overdoses");

    const metal = getToxicologyModuleById("toxicology-heavy-metal-poisoning-chelation-corrosives");
    expect(metal).toBeDefined();
    expect(metal?.title).toContain("Heavy Metal");

    const alc = getToxicologyModuleById("toxicology-toxic-alcohols-envenomations-enhanced-elimination");
    expect(alc).toBeDefined();
    expect(alc?.title).toContain("Toxic Alcohols");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getToxicologyModuleByCompetency("TX1.1")?.id).toBe(TOXIDROMES_ACUTE_POISONING_RESUSCITATION_MODULE.id);
    expect(getToxicologyModuleByCompetency("TX3.1")?.id).toBe(SIGNATURE_DRUG_OVERDOSES_ANTIDOTE_PROTOCOLS_MODULE.id);
    expect(getToxicologyModuleByCompetency("TX5.1")?.id).toBe(HEAVY_METAL_POISONING_CHELATION_CORROSIVES_MODULE.id);
    expect(getToxicologyModuleByCompetency("TX7.1")?.id).toBe(TOXIC_ALCOHOLS_ENVENOMATIONS_ENHANCED_ELIMINATION_MODULE.id);
  });
});
