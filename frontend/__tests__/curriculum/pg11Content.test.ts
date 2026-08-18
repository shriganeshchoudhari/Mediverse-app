import {
  PG11_MODULES,
  SPINAL_CORD_INJURY_ASIA_AUTONOMIC_DYSREFLEXIA_MODULE,
  TRAUMATIC_BRAIN_INJURY_RANCHO_CONCUSSION_MODULE,
  STROKE_SPASTICITY_BOTOX_INTRATHECAL_BACLOFEN_MODULE,
  PEDIATRIC_CEREBRAL_PALSY_GAIT_PROSTHETICS_MODULE
} from "@/lib/curriculum/content/pg11";

describe("Postgraduate Advanced PM&R Curriculum (PG-611)", () => {
  test("contains 4 comprehensive modules with valid metadata", () => {
    expect(PG11_MODULES).toHaveLength(4);
    PG11_MODULES.forEach((mod) => {
      expect(mod.id).toBeDefined();
      expect(mod.unitCode).toMatch(/^PG11\.\d$/);
      expect(mod.title).toBeDefined();
      expect(mod.competencies.length).toBeGreaterThan(0);
      expect(mod.markdownContent.length).toBeGreaterThan(200);
      expect(mod.clinicalVignettes.length).toBeGreaterThan(0);
    });
  });

  test("validates Spinal Cord Injury & Autonomic Dysreflexia content (PG11.1)", () => {
    const mod = SPINAL_CORD_INJURY_ASIA_AUTONOMIC_DYSREFLEXIA_MODULE;
    expect(mod.markdownContent).toContain("ISNCSCI");
    expect(mod.markdownContent).toContain("Autonomic Dysreflexia");
    expect(mod.markdownContent).toContain("Nitropaste");
    expect(mod.clinicalVignettes[0].correctAnswerIndex).toBe(0);
  });

  test("validates TBI, Rancho Staging & Concussion content (PG11.2)", () => {
    const mod = TRAUMATIC_BRAIN_INJURY_RANCHO_CONCUSSION_MODULE;
    expect(mod.markdownContent).toContain("Rancho Los Amigos");
    expect(mod.markdownContent).toContain("Confused-Agitated");
    expect(mod.markdownContent).toContain("Amantadine");
    expect(mod.markdownContent).toContain("SCAT-6");
    expect(mod.clinicalVignettes[0].correctAnswerIndex).toBe(0);
  });

  test("validates Stroke Spasticity, Botox & ITB content (PG11.3)", () => {
    const mod = STROKE_SPASTICITY_BOTOX_INTRATHECAL_BACLOFEN_MODULE;
    expect(mod.markdownContent).toContain("Modified Ashworth Scale");
    expect(mod.markdownContent).toContain("Botulinum Toxin");
    expect(mod.markdownContent).toContain("SNAP-25");
    expect(mod.markdownContent).toContain("Intrathecal Baclofen");
    expect(mod.clinicalVignettes[0].correctAnswerIndex).toBe(0);
  });

  test("validates Pediatric CP, Gait Kinematics & Prosthetics content (PG11.4)", () => {
    const mod = PEDIATRIC_CEREBRAL_PALSY_GAIT_PROSTHETICS_MODULE;
    expect(mod.markdownContent).toContain("GMFCS");
    expect(mod.markdownContent).toContain("Crouch Gait");
    expect(mod.markdownContent).toContain("Ground Reaction AFO");
    expect(mod.markdownContent).toContain("Patellar Tendon");
    expect(mod.clinicalVignettes[0].correctAnswerIndex).toBe(0);
  });
});
