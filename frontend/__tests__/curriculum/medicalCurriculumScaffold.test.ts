import {
  MEDICAL_CURRICULUM_SCAFFOLD,
  getSubjectsByPhase,
  getSubjectsBySystem,
  getSubjectById
} from "../../lib/curriculum/medicalCurriculumScaffold";

describe("Medical Curriculum Scaffold Framework", () => {
  it("should contain all 20 core undergraduate medical subjects and transversal modules", () => {
    expect(MEDICAL_CURRICULUM_SCAFFOLD.length).toBe(20);
  });

  it("should categorize subjects correctly across all 4 phases", () => {
    const preClinical = getSubjectsByPhase("PRE_CLINICAL");
    const paraClinical = getSubjectsByPhase("PARA_CLINICAL");
    const clinical = getSubjectsByPhase("CLINICAL");
    const transversal = getSubjectsByPhase("TRANSVERSAL");

    expect(preClinical.length).toBe(3); // Physiology, Anatomy, Biochemistry
    expect(paraClinical.length).toBe(5); // Pathology, Microbiology, Pharmacology, FMT, PSM
    expect(clinical.length).toBe(11); // Medicine, Surgery, OB-GYN, Pediatrics, Ortho, Ophth, ENT, Derm, Psych, Rad, Anes
    expect(transversal.length).toBe(1); // AETCOM
  });

  it("should retrieve specific subjects by ID or code", () => {
    const physio = getSubjectById("subj-physio");
    expect(physio).toBeDefined();
    expect(physio?.title).toBe("Human Physiology");
    expect(physio?.has3DCanvas).toBe(true);
    expect(physio?.hasSimulators).toBe(true);

    const surgery = getSubjectById("SURG-301");
    expect(surgery).toBeDefined();
    expect(surgery?.title).toBe("General Surgery");
  });

  it("should filter subjects by organ system category", () => {
    const cvSubjects = getSubjectsBySystem("CARDIOVASCULAR");
    expect(cvSubjects.length).toBeGreaterThanOrEqual(1);

    const neuroSubjects = getSubjectsBySystem("NEUROLOGY");
    expect(neuroSubjects.length).toBeGreaterThanOrEqual(1);
  });

  it("should ensure all subjects have defined units, chapters, and competencies", () => {
    MEDICAL_CURRICULUM_SCAFFOLD.forEach(subj => {
      expect(subj.id).toBeTruthy();
      expect(subj.code).toBeTruthy();
      expect(subj.title).toBeTruthy();
      expect(subj.units.length).toBeGreaterThan(0);
      expect(subj.keyCompetencies.length).toBeGreaterThan(0);
      expect(subj.colorTheme.accent).toBeTruthy();

      subj.units.forEach(unit => {
        expect(unit.id).toBeTruthy();
        expect(unit.title).toBeTruthy();
        expect(unit.chapters.length).toBeGreaterThan(0);
      });
    });
  });
});
