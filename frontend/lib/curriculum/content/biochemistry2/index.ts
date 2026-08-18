/**
 * Master Medical Biochemistry II (BIOC-102) Learning Catalog
 * Comprehensive modules covering DNA Replication & Repair, Transcription & Splicing, Translation & Chaperones, and Molecular Diagnostics & CRISPR
 */

import { DNA_REPLICATION_REPAIR_TELOMERASE_MODULE } from "./dnaReplicationRepairTelomeraseContent";
import { TRANSCRIPTION_EPIGENETICS_SPLICING_MODULE } from "./transcriptionEpigeneticsSplicingContent";
import { TRANSLATION_GENETIC_CODE_CHAPERONES_MODULE } from "./translationGeneticCodeChaperonesContent";
import { MOLECULAR_DIAGNOSTICS_GENE_EDITING_CRISPR_MODULE } from "./molecularDiagnosticsGeneEditingCrisprContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./dnaReplicationRepairTelomeraseContent";
export * from "./transcriptionEpigeneticsSplicingContent";
export * from "./translationGeneticCodeChaperonesContent";
export * from "./molecularDiagnosticsGeneEditingCrisprContent";

export const BIOCHEMISTRY2_CORE_MODULES: PhysiologyLessonModule[] = [
  DNA_REPLICATION_REPAIR_TELOMERASE_MODULE,
  TRANSCRIPTION_EPIGENETICS_SPLICING_MODULE,
  TRANSLATION_GENETIC_CODE_CHAPERONES_MODULE,
  MOLECULAR_DIAGNOSTICS_GENE_EDITING_CRISPR_MODULE
];

export function getBiochemistry2ModuleById(id: string): PhysiologyLessonModule | undefined {
  return BIOCHEMISTRY2_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getBiochemistry2ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return BIOCHEMISTRY2_CORE_MODULES.find(m => m.competencies.includes(code));
}
