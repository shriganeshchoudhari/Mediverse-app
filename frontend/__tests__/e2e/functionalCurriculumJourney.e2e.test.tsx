import { MEDICAL_CURRICULUM_SCAFFOLD } from "@/lib/curriculum/medicalCurriculumScaffold";
import { PG1_CORE_MODULES } from "@/lib/curriculum/content/pg1";
import { PG2_CORE_MODULES } from "@/lib/curriculum/content/pg2";
import { PG3_CORE_MODULES } from "@/lib/curriculum/content/pg3";
import { PG4_CORE_MODULES } from "@/lib/curriculum/content/pg4";
import { PG5_CORE_MODULES } from "@/lib/curriculum/content/pg5";
import { PG6_CURRICULUM_MODULES } from "@/lib/curriculum/content/pg6";
import { PG7_CURRICULUM_MODULES } from "@/lib/curriculum/content/pg7";
import { PG8_CURRICULUM_MODULES } from "@/lib/curriculum/content/pg8";
import { PG9_CURRICULUM_MODULES } from "@/lib/curriculum/content/pg9";
import { PG10_MODULES } from "@/lib/curriculum/content/pg10";
import { PG11_MODULES } from "@/lib/curriculum/content/pg11";
import { PG12_MODULES } from "@/lib/curriculum/content/pg12";

describe("E2E Functional: Complete Curriculum Journey & Taxonomy Verification (FR-CURR / FR-STU)", () => {
  test("E2E-CURR-001: Verifies the core medical disciplines in the scaffold framework", () => {
    expect(MEDICAL_CURRICULUM_SCAFFOLD).toBeDefined();
    expect(MEDICAL_CURRICULUM_SCAFFOLD.length).toBeGreaterThanOrEqual(19);

    const phases = new Set(MEDICAL_CURRICULUM_SCAFFOLD.map(s => s.phase));
    expect(phases).toContain("PRE_CLINICAL");
    expect(phases).toContain("PARA_CLINICAL");
    expect(phases).toContain("CLINICAL");
    expect(phases).toContain("TRANSVERSAL");

    MEDICAL_CURRICULUM_SCAFFOLD.forEach(subject => {
      expect(subject.id).toBeTruthy();
      expect(subject.code).toMatch(/^[A-Z0-9-]{2,10}$/);
      expect(subject.title).toBeTruthy();
      expect(subject.units.length).toBeGreaterThan(0);
      expect(subject.keyCompetencies.length).toBeGreaterThan(0);

      // Verify each unit contains valid chapters with high-yield topics
      subject.units.forEach(unit => {
        expect(unit.id).toBeTruthy();
        expect(unit.title).toBeTruthy();
        expect(unit.chapters.length).toBeGreaterThan(0);
        unit.chapters.forEach(ch => {
          expect(ch.id).toBeTruthy();
          expect(ch.title).toBeTruthy();
          expect(ch.highYieldTopics.length).toBeGreaterThan(0);
        });
      });
    });
  });

  test("E2E-CURR-002: Verifies all 12 Postgraduate Residency Curriculum Packs (PG-601 through PG-612)", () => {
    const allPgModules = [
      ...PG1_CORE_MODULES,
      ...PG2_CORE_MODULES,
      ...PG3_CORE_MODULES,
      ...PG4_CORE_MODULES,
      ...PG5_CORE_MODULES,
      ...PG6_CURRICULUM_MODULES,
      ...PG7_CURRICULUM_MODULES,
      ...PG8_CURRICULUM_MODULES,
      ...PG9_CURRICULUM_MODULES,
      ...PG10_MODULES,
      ...PG11_MODULES,
      ...PG12_MODULES
    ];

    // 12 subjects * 4 modules = 48 residency modules
    expect(allPgModules).toHaveLength(48);

    allPgModules.forEach(mod => {
      expect(mod.id).toBeTruthy();
      expect(mod.id.length).toBeGreaterThan(5);
      expect(mod.title).toBeTruthy();
      expect(mod.competencies.length).toBeGreaterThanOrEqual(1);

      // Verify content is present either as markdownContent or sections
      const hasContent = (mod as any).markdownContent || ((mod as any).sections && (mod as any).sections.length > 0);
      expect(hasContent).toBeTruthy();
    });
  });

  test("E2E-CURR-003: Verifies vertical integration linkages between Pre-Clinical and Clinical disciplines", () => {
    const physiologySubject = MEDICAL_CURRICULUM_SCAFFOLD.find(s => s.code === "PHYS-101");
    expect(physiologySubject).toBeDefined();

    const pyCompetencies = physiologySubject!.keyCompetencies;
    expect(pyCompetencies.length).toBeGreaterThan(0);

    // Verify cardiovascular integration
    const cvCompetency = pyCompetencies.find(c => c.code === "PY5.2");
    expect(cvCompetency).toBeDefined();
    expect(cvCompetency!.verticalIntegration).toBeDefined();
    expect(cvCompetency!.verticalIntegration).toContain("MED-301");
  });
});
