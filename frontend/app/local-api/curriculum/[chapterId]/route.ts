import { NextRequest, NextResponse } from "next/server";
import { AETCOM_CORE_MODULES } from "@/lib/curriculum/content/aetcom";
import { ANATOMY_CORE_MODULES } from "@/lib/curriculum/content/anatomy";
import { ANATOMY2_CORE_MODULES } from "@/lib/curriculum/content/anatomy2";
import { ANESTHESIOLOGY_CORE_MODULES } from "@/lib/curriculum/content/anesthesiology";
import { ANESTHESIOLOGY_ADV_CORE_MODULES } from "@/lib/curriculum/content/anesthesiologyadv";
import { BIOCHEMISTRY_CORE_MODULES } from "@/lib/curriculum/content/biochemistry";
import { BIOCHEMISTRY2_CORE_MODULES } from "@/lib/curriculum/content/biochemistry2";
import { BIOCHEMISTRY_ADV_CORE_MODULES } from "@/lib/curriculum/content/biochemistryadv";
import { CARDIOVASCULAR_ADV_CORE_MODULES } from "@/lib/curriculum/content/cardiovascularadv";
import { CLIN1_CORE_MODULES } from "@/lib/curriculum/content/clin1";
import { CLIN2_CORE_MODULES } from "@/lib/curriculum/content/clin2";
import { COMMUNITY_CORE_MODULES } from "@/lib/curriculum/content/community";
import { CRITICAL_CARE_ADV_CORE_MODULES } from "@/lib/curriculum/content/criticalcareadv";
import { DENTISTRY_CORE_MODULES } from "@/lib/curriculum/content/dentistry";
import { DERMATOLOGY_CORE_MODULES } from "@/lib/curriculum/content/dermatology";
import { DERMATOLOGY_ADV_CORE_MODULES } from "@/lib/curriculum/content/dermatologyadv";
import { ECE2_CORE_MODULES } from "@/lib/curriculum/content/ece2";
import { EMERGENCY_MEDICINE_CORE_MODULES } from "@/lib/curriculum/content/emergencymedicine";
import { EMERGENCY_MEDICINE_ADV_CORE_MODULES } from "@/lib/curriculum/content/emergencymedicineadv";
import { ENDOCRINOLOGY_ADV_CORE_MODULES } from "@/lib/curriculum/content/endocrinologyadv";
import { ENT_CORE_MODULES } from "@/lib/curriculum/content/ent";
import { ENT_ADV_CORE_MODULES } from "@/lib/curriculum/content/entadv";
import { FAM_CORE_MODULES } from "@/lib/curriculum/content/fam";
import { FORENSIC_CORE_MODULES } from "@/lib/curriculum/content/forensic";
import { FORENSIC_ADV_CORE_MODULES } from "@/lib/curriculum/content/forensicadv";
import { FOUNDATION_CORE_MODULES } from "@/lib/curriculum/content/foundation";
import { GASTROENTEROLOGY_ADV_CORE_MODULES } from "@/lib/curriculum/content/gastroenterologyadv";
import { GENETICS_CORE_MODULES } from "@/lib/curriculum/content/genetics";
import { HEMATOLOGY_ADV_CORE_MODULES } from "@/lib/curriculum/content/hematologyadv";
import { HOSPITAL_ADMIN_CORE_MODULES } from "@/lib/curriculum/content/hospitaladmin";
import { IMMUNOLOGY_CORE_MODULES } from "@/lib/curriculum/content/immunology";
import { IMMUNOLOGY_ADV_CORE_MODULES } from "@/lib/curriculum/content/immunologyadv";
import { INFECTIOUS_DISEASES_CORE_MODULES } from "@/lib/curriculum/content/infectiousdiseases";
import { INT1_CORE_MODULES } from "@/lib/curriculum/content/int1";
import { INT2_CORE_MODULES } from "@/lib/curriculum/content/int2";
import { INT3_CORE_MODULES } from "@/lib/curriculum/content/int3";
import { INT4_CORE_MODULES } from "@/lib/curriculum/content/int4";
import { INT5_CORE_MODULES } from "@/lib/curriculum/content/int5";
import { INT6_CORE_MODULES } from "@/lib/curriculum/content/int6";
import { INT7_CORE_MODULES } from "@/lib/curriculum/content/int7";
import { INT8_CORE_MODULES } from "@/lib/curriculum/content/int8";
import { MEDICINE_CORE_MODULES } from "@/lib/curriculum/content/medicine";
import { MEDICINE_ADV_CORE_MODULES } from "@/lib/curriculum/content/medicineadv";
import { MICROBIOLOGY_CORE_MODULES } from "@/lib/curriculum/content/microbiology";
import { NEPHROLOGY_ADV_CORE_MODULES } from "@/lib/curriculum/content/nephrologyadv";
import { NEUROANATOMY_CORE_MODULES } from "@/lib/curriculum/content/neuroanatomy";
import { NEUROLOGY_ADV_CORE_MODULES } from "@/lib/curriculum/content/neurologyadv";
import { NUCLEAR_MEDICINE_CORE_MODULES } from "@/lib/curriculum/content/nuclearmedicine";
import { OBGYN_CORE_MODULES } from "@/lib/curriculum/content/obgyn";
import { OBGYN_ADV_CORE_MODULES } from "@/lib/curriculum/content/obgynadv";
import { ONCOLOGY_CORE_MODULES } from "@/lib/curriculum/content/oncology";
import { OPHTHALMOLOGY_CORE_MODULES } from "@/lib/curriculum/content/ophthalmology";
import { OPHTHALMOLOGY_ADV_CORE_MODULES } from "@/lib/curriculum/content/ophthalmologyadv";
import { ORTHOPEDICS_CORE_MODULES } from "@/lib/curriculum/content/orthopedics";
import { ORTHOPEDICS_ADV_CORE_MODULES } from "@/lib/curriculum/content/orthopedicsadv";
import { OSCE_CORE_MODULES } from "@/lib/curriculum/content/osce";
import { PATHOLOGY_CORE_MODULES } from "@/lib/curriculum/content/pathology";
import { PEDIATRICS_CORE_MODULES } from "@/lib/curriculum/content/pediatrics";
import { PEDIATRICS_ADV_CORE_MODULES } from "@/lib/curriculum/content/pediatricsadv";
import { PG1_CORE_MODULES } from "@/lib/curriculum/content/pg1";
import { PG10_MODULES } from "@/lib/curriculum/content/pg10";
import { PG11_MODULES } from "@/lib/curriculum/content/pg11";
import { PG12_MODULES } from "@/lib/curriculum/content/pg12";
import { PG2_CORE_MODULES } from "@/lib/curriculum/content/pg2";
import { PG3_CORE_MODULES } from "@/lib/curriculum/content/pg3";
import { PG4_CORE_MODULES } from "@/lib/curriculum/content/pg4";
import { PG5_CORE_MODULES } from "@/lib/curriculum/content/pg5";
import { PG6_CURRICULUM_MODULES } from "@/lib/curriculum/content/pg6";
import { PG7_CURRICULUM_MODULES } from "@/lib/curriculum/content/pg7";
import { PG8_CURRICULUM_MODULES } from "@/lib/curriculum/content/pg8";
import { PG9_CURRICULUM_MODULES } from "@/lib/curriculum/content/pg9";
import { PHARMACOLOGY_CORE_MODULES } from "@/lib/curriculum/content/pharmacology";
import { PHARMACOLOGY_ADV_CORE_MODULES } from "@/lib/curriculum/content/pharmacologyadv";
import { PHYSIOLOGY_CORE_MODULES } from "@/lib/curriculum/content/physiology";
import { PMR_CORE_MODULES } from "@/lib/curriculum/content/pmr";
import { PSYCHIATRY_CORE_MODULES } from "@/lib/curriculum/content/psychiatry";
import { PSYCHIATRY_ADV_CORE_MODULES } from "@/lib/curriculum/content/psychiatryadv";
import { PULMONOLOGY_CORE_MODULES } from "@/lib/curriculum/content/pulmonology";
import { PULMONOLOGY_ADV_CORE_MODULES } from "@/lib/curriculum/content/pulmonologyadv";
import { RADIOLOGY_CORE_MODULES } from "@/lib/curriculum/content/radiology";
import { RADIOLOGY_ADV_CORE_MODULES } from "@/lib/curriculum/content/radiologyadv";
import { RHEUMATOLOGY_ADV_CORE_MODULES } from "@/lib/curriculum/content/rheumatologyadv";
import { SURGERY_CORE_MODULES } from "@/lib/curriculum/content/surgery";
import { SURGERY_ADV_CORE_MODULES } from "@/lib/curriculum/content/surgeryadv";
import { TOXICOLOGY_CORE_MODULES } from "@/lib/curriculum/content/toxicology";
import { TRANSFUSION_CORE_MODULES } from "@/lib/curriculum/content/transfusion";

// Aggregate all 86 static module catalogs for instant lookup across all domains
const ALL_STATIC_MODULES = [
  ...AETCOM_CORE_MODULES,
  ...ANATOMY_CORE_MODULES,
  ...ANATOMY2_CORE_MODULES,
  ...ANESTHESIOLOGY_CORE_MODULES,
  ...ANESTHESIOLOGY_ADV_CORE_MODULES,
  ...BIOCHEMISTRY_CORE_MODULES,
  ...BIOCHEMISTRY2_CORE_MODULES,
  ...BIOCHEMISTRY_ADV_CORE_MODULES,
  ...CARDIOVASCULAR_ADV_CORE_MODULES,
  ...CLIN1_CORE_MODULES,
  ...CLIN2_CORE_MODULES,
  ...COMMUNITY_CORE_MODULES,
  ...CRITICAL_CARE_ADV_CORE_MODULES,
  ...DENTISTRY_CORE_MODULES,
  ...DERMATOLOGY_CORE_MODULES,
  ...DERMATOLOGY_ADV_CORE_MODULES,
  ...ECE2_CORE_MODULES,
  ...EMERGENCY_MEDICINE_CORE_MODULES,
  ...EMERGENCY_MEDICINE_ADV_CORE_MODULES,
  ...ENDOCRINOLOGY_ADV_CORE_MODULES,
  ...ENT_CORE_MODULES,
  ...ENT_ADV_CORE_MODULES,
  ...FAM_CORE_MODULES,
  ...FORENSIC_CORE_MODULES,
  ...FORENSIC_ADV_CORE_MODULES,
  ...FOUNDATION_CORE_MODULES,
  ...GASTROENTEROLOGY_ADV_CORE_MODULES,
  ...GENETICS_CORE_MODULES,
  ...HEMATOLOGY_ADV_CORE_MODULES,
  ...HOSPITAL_ADMIN_CORE_MODULES,
  ...IMMUNOLOGY_CORE_MODULES,
  ...IMMUNOLOGY_ADV_CORE_MODULES,
  ...INFECTIOUS_DISEASES_CORE_MODULES,
  ...INT1_CORE_MODULES,
  ...INT2_CORE_MODULES,
  ...INT3_CORE_MODULES,
  ...INT4_CORE_MODULES,
  ...INT5_CORE_MODULES,
  ...INT6_CORE_MODULES,
  ...INT7_CORE_MODULES,
  ...INT8_CORE_MODULES,
  ...MEDICINE_CORE_MODULES,
  ...MEDICINE_ADV_CORE_MODULES,
  ...MICROBIOLOGY_CORE_MODULES,
  ...NEPHROLOGY_ADV_CORE_MODULES,
  ...NEUROANATOMY_CORE_MODULES,
  ...NEUROLOGY_ADV_CORE_MODULES,
  ...NUCLEAR_MEDICINE_CORE_MODULES,
  ...OBGYN_CORE_MODULES,
  ...OBGYN_ADV_CORE_MODULES,
  ...ONCOLOGY_CORE_MODULES,
  ...OPHTHALMOLOGY_CORE_MODULES,
  ...OPHTHALMOLOGY_ADV_CORE_MODULES,
  ...ORTHOPEDICS_CORE_MODULES,
  ...ORTHOPEDICS_ADV_CORE_MODULES,
  ...OSCE_CORE_MODULES,
  ...PATHOLOGY_CORE_MODULES,
  ...PEDIATRICS_CORE_MODULES,
  ...PEDIATRICS_ADV_CORE_MODULES,
  ...PG1_CORE_MODULES,
  ...PG10_MODULES,
  ...PG11_MODULES,
  ...PG12_MODULES,
  ...PG2_CORE_MODULES,
  ...PG3_CORE_MODULES,
  ...PG4_CORE_MODULES,
  ...PG5_CORE_MODULES,
  ...PG6_CURRICULUM_MODULES,
  ...PG7_CURRICULUM_MODULES,
  ...PG8_CURRICULUM_MODULES,
  ...PG9_CURRICULUM_MODULES,
  ...PHARMACOLOGY_CORE_MODULES,
  ...PHARMACOLOGY_ADV_CORE_MODULES,
  ...PHYSIOLOGY_CORE_MODULES,
  ...PMR_CORE_MODULES,
  ...PSYCHIATRY_CORE_MODULES,
  ...PSYCHIATRY_ADV_CORE_MODULES,
  ...PULMONOLOGY_CORE_MODULES,
  ...PULMONOLOGY_ADV_CORE_MODULES,
  ...RADIOLOGY_CORE_MODULES,
  ...RADIOLOGY_ADV_CORE_MODULES,
  ...RHEUMATOLOGY_ADV_CORE_MODULES,
  ...SURGERY_CORE_MODULES,
  ...SURGERY_ADV_CORE_MODULES,
  ...TOXICOLOGY_CORE_MODULES,
  ...TRANSFUSION_CORE_MODULES
];

// Slug and alias mapping for glossary terms, clinical keywords, and canonical URLs
const SLUG_ALIASES: Record<string, string> = {
  "synaptic-transmission": "phys-neurophysiology",
  "cns-synapse": "phys-neurophysiology",
  "action-potential": "phys-nerve-muscle",
  "action-potentials": "phys-nerve-muscle",
  "cardiac-cycle": "phys-cardiac-cycle",
  "cardiac-pv-loop": "phys-cardiac-cycle",
  "renal-filtration": "phys-renal-filtration",
  "gfr-clearance": "phys-renal-filtration",
  "respiratory-mechanics": "phys-respiratory-mechanics",
  "lung-volumes": "phys-respiratory-mechanics",
  "endocrine-hormones": "phys-endocrine",
  "endocrine": "phys-endocrine",
  "acid-base": "phys-acid-base",
  "hematology": "phys-hematology",
  "gastrointestinal": "phys-gastrointestinal",
  "neurophysiology": "phys-neurophysiology",
  "homeostasis": "phys-nerve-muscle",
  "vision": "phys-neurophysiology",
  "spirometry": "phys-respiratory-mechanics",
  "hemodynamics": "critical-care-adv-hemodynamics-oxygen-delivery",
  "ards": "critical-care-adv-ards-mechanical-ventilation",
  "mechanical-ventilation": "critical-care-adv-ards-mechanical-ventilation",
  "delirium": "critical-care-adv-sedation-delirium-abcdef",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function findStaticModule(slugOrId: string) {
  const normalized = slugOrId.toLowerCase().trim();
  const targetId = SLUG_ALIASES[normalized] || normalized;

  return ALL_STATIC_MODULES.find((item: any) => {
    const id = (item?.id || "").toLowerCase();
    const unitCode = (item?.unitCode || item?.code || "").toLowerCase();
    const title = (item?.title || item?.name || "").toLowerCase();
    return (
      id === targetId ||
      id === normalized ||
      unitCode === targetId ||
      unitCode === normalized ||
      title.includes(normalized)
    );
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  const { chapterId } = params;

  if (!chapterId) {
    return NextResponse.json({ error: "Chapter ID is required" }, { status: 400 });
  }

  // 1. If it's a UUID, attempt to query the Spring Boot database first
  if (UUID_REGEX.test(chapterId)) {
    try {
      const chapRes = await fetch(`http://localhost:8085/api/v1/curriculum/chapters/${chapterId}`);
      if (chapRes.ok) {
        const chapter = await chapRes.json();

        // Fetch topics
        const topicsRes = await fetch(`http://localhost:8085/api/v1/curriculum/chapters/${chapterId}/topics`);
        const topics = topicsRes.ok ? await topicsRes.json() : [];

        let combinedMarkdown = `# ${chapter.title}\n\n`;
        const topicsWithLessons = [];

        for (const topic of topics) {
          combinedMarkdown += `## ${topic.title}\n\n`;
          const conceptsRes = await fetch(`http://localhost:8085/api/v1/curriculum/topics/${topic.id}/concepts`);
          const concepts = conceptsRes.ok ? await conceptsRes.json() : [];
          const conceptsWithLessons = [];

          for (const concept of concepts) {
            const lessonRes = await fetch(`http://localhost:8085/api/v1/curriculum/concepts/${concept.id}/lesson`);
            let lesson = null;
            if (lessonRes.ok) {
              lesson = await lessonRes.json();
              const blocks = lesson.contentBlocks || [];
              for (const block of blocks) {
                if (block.type === "EXPLANATION" && block.metadata && block.metadata.text) {
                  combinedMarkdown += `${block.metadata.text}\n\n`;
                } else if (block.type === "FORMULA" && block.metadata && block.metadata.latex) {
                  combinedMarkdown += `$$${block.metadata.latex}$$\n\n`;
                } else if (block.type === "CLINICAL_PEARL" && block.metadata && block.metadata.text) {
                  combinedMarkdown += `> **Clinical Pearl**: ${block.metadata.text}\n\n`;
                }
              }
            }
            conceptsWithLessons.push({ ...concept, lesson });
          }
          topicsWithLessons.push({ ...topic, concepts: conceptsWithLessons });
        }

        return NextResponse.json({
          title: chapter.title,
          markdownContent: combinedMarkdown,
          difficulty: "Intermediate",
          estimatedMinutes: 45,
          section: `Unit ${chapter.sortOrder || 1}`,
          topics: topicsWithLessons,
        });
      }
    } catch (dbError) {
      console.warn("Spring Boot curriculum query failed; checking static catalog:", dbError);
    }
  }

  // 2. Resolve against static modules
  const staticMod = findStaticModule(chapterId) as any;
  if (staticMod) {
    return NextResponse.json({
      title: staticMod.title || staticMod.name,
      markdownContent: staticMod.markdownContent || staticMod.content || "",
      difficulty: staticMod.difficulty || "Intermediate",
      estimatedMinutes: staticMod.estimatedMinutes || 45,
      section: staticMod.unitCode || staticMod.code || "Core Module",
      isStatic: true,
      topics: [],
    });
  }

  // 3. Fallback: Return honest 404 for unmapped/unauthored chapters
  return NextResponse.json(
    {
      error: "Chapter not found",
      code: "NOT_PUBLISHED",
      chapterId,
      message: `The curriculum module for "${chapterId}" has not yet been published in the official curriculum repository.`,
    },
    { status: 404 }
  );
}
