/**
 * Typed wrapper around the backend's curriculum hierarchy API
 * (CurriculumController: /api/v1/curriculum/...).
 *
 * This is the ONE place that knows how to walk
 * Curriculum -> Year -> Semester -> Subject -> Unit -> Chapter -> Topic -> Concept -> LearningObject.
 * Components should call getFullCatalog()/getChapterContent() from here
 * instead of hand-rolling fetch chains or falling back to hardcoded
 * config files as a primary data source.
 */

import { apiClient } from "./client";

export interface CurriculumDto {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface CurriculumYearDto {
  id: string;
  yearNumber: number;
}

export interface SemesterDto {
  id: string;
  semesterNumber: number;
}

export interface SubjectDto {
  id: string;
  title: string;
  code: string;
  category: string;
}

export interface UnitDto {
  id: string;
  title: string;
  sortOrder: number;
}

export interface ChapterDto {
  id: string;
  title: string;
  sortOrder: number;
}

export interface TopicDto {
  id: string;
  title: string;
  sortOrder: number;
}

export interface ConceptDto {
  id: string;
  title: string;
  sortOrder: number;
}

export interface LearningObjectDto {
  id: string;
  objectType: string;
  contentPayload: string;
  sortOrder: number;
}

export interface ContentBlockDto {
  id: string;
  type: string;
  orderIndex: number;
  contentRef?: string;
  metadata?: any;
}

export interface LessonDto {
  id: string;
  title: string;
  status: string;
  version: number;
  contentBlocks?: ContentBlockDto[];
}

export interface ClinicalCaseDto {
  id: string;
  title: string;
  scenarioText: string;
  difficulty: string;
}

export interface ReferenceDto {
  id: string;
  citationText: string;
  sourceType: string;
  url?: string;
}

/** Flattened shape the UI actually renders — one row per subject with its chapters attached. */
export interface CatalogChapter {
  id: string;
  title: string;
  estimatedMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  section: string;
}

export interface CatalogSubject {
  id: string;
  title: string;
  semester: number;
  category: string;
  chapters: CatalogChapter[];
}

const DEFAULT_CURRICULUM_CODE = "mbbs-cbme-2024";

export const curriculumApi = {
  getCurriculum: (code: string = DEFAULT_CURRICULUM_CODE) =>
    apiClient.get<CurriculumDto>(`/curriculum/${code}`),

  getYears: (curriculumId: string) =>
    apiClient.get<CurriculumYearDto[]>(`/curriculum/${curriculumId}/years`),

  getSemesters: (yearId: string) =>
    apiClient.get<SemesterDto[]>(`/curriculum/years/${yearId}/semesters`),

  getSubjects: (semesterId: string) =>
    apiClient.get<SubjectDto[]>(`/curriculum/semesters/${semesterId}/subjects`),

  getUnits: (subjectId: string) =>
    apiClient.get<UnitDto[]>(`/curriculum/subjects/${subjectId}/units`),

  getChapters: (unitId: string) =>
    apiClient.get<ChapterDto[]>(`/curriculum/units/${unitId}/chapters`),

  getChapter: (chapterId: string) =>
    apiClient.get<ChapterDto>(`/curriculum/chapters/${chapterId}`),

  getTopics: (chapterId: string) =>
    apiClient.get<TopicDto[]>(`/curriculum/chapters/${chapterId}/topics`),

  getConcepts: (topicId: string) =>
    apiClient.get<ConceptDto[]>(`/curriculum/topics/${topicId}/concepts`),

  getLearningObjects: (conceptId: string) =>
    apiClient.get<LearningObjectDto[]>(`/curriculum/concepts/${conceptId}/learning-objects`),

  getLesson: (conceptId: string) =>
    apiClient.get<LessonDto>(`/curriculum/concepts/${conceptId}/lesson`),

  getClinicalCases: (conceptId: string) =>
    apiClient.get<ClinicalCaseDto[]>(`/curriculum/concepts/${conceptId}/clinical-cases`),

  getReferences: (conceptId: string) =>
    apiClient.get<ReferenceDto[]>(`/curriculum/concepts/${conceptId}/references`),

  /**
   * Walks the full tree (years -> semesters -> subjects -> units -> chapters)
   * and returns it flattened into the shape the syllabus grid / search need.
   * This replaced the former hardcoded frontend/config/curriculum.ts and
   * syllabus.ts catalogs (now deleted) as the primary data source.
   */
  async getFullCatalog(code: string = DEFAULT_CURRICULUM_CODE): Promise<CatalogSubject[]> {
    const curriculum = await curriculumApi.getCurriculum(code);
    const years = await curriculumApi.getYears(curriculum.id);

    const subjects: CatalogSubject[] = [];

    for (const year of years) {
      const semesters = await curriculumApi.getSemesters(year.id);

      for (const semester of semesters) {
        const semesterSubjects = await curriculumApi.getSubjects(semester.id);

        for (const subject of semesterSubjects) {
          const units = await curriculumApi.getUnits(subject.id);
          const chapters: CatalogChapter[] = [];

          for (const unit of units) {
            const unitChapters = await curriculumApi.getChapters(unit.id);
            for (const chapter of unitChapters) {
              chapters.push({
                id: chapter.id,
                title: chapter.title,
                estimatedMinutes: 30,
                difficulty: "Intermediate",
                section: unit.title,
              });
            }
          }

          subjects.push({
            id: subject.id,
            title: subject.title,
            semester: semester.semesterNumber,
            category: subject.category,
            chapters,
          });
        }
      }
    }

    return subjects;
  },

  /**
   * Assembles a single chapter's full learning content (all topics -> concepts
   * -> learning objects, concatenated as markdown) directly from the database,
   * matching the metadata-driven Content Framework spec.
   */
  async getChapterContent(chapterId: string) {
    const chapter = await curriculumApi.getChapter(chapterId);
    const topics = await curriculumApi.getTopics(chapterId);

    let markdown = `# ${chapter.title}\n\n`;

    for (const topic of topics) {
      markdown += `## ${topic.title}\n\n`;
      const concepts = await curriculumApi.getConcepts(topic.id);

      for (const concept of concepts) {
        try {
          const lesson = await curriculumApi.getLesson(concept.id);
          const blocks = lesson.contentBlocks || [];
          for (const block of blocks) {
            if (block.type === 'EXPLANATION' && block.metadata && block.metadata.text) {
              markdown += `${block.metadata.text}\n\n`;
            }
          }
        } catch (e) {
          // Fallback to legacy learning objects
          try {
            const learningObjects = await curriculumApi.getLearningObjects(concept.id);
            for (const lo of learningObjects) {
              if (lo.contentPayload) {
                markdown += `${lo.contentPayload}\n\n`;
              }
            }
          } catch (err) {
            console.error("Failed to fetch legacy learning objects for concept:", concept.id, err);
          }
        }
      }
    }

    return {
      title: chapter.title,
      markdownContent: markdown,
      difficulty: "Intermediate" as const,
      estimatedMinutes: 30,
      section: "Core Theory",
    };
  },
};
