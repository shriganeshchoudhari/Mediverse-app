export interface CurriculumSection {
  id: string;
  title: string;
  content: string;
}

export interface CurriculumModule {
  id: string;
  title: string;
  code: string;
  subject: string;
  semester: number;
  description: string;
  estimatedMinutes: number;
  competencies: string[];
  sections: CurriculumSection[];
}
