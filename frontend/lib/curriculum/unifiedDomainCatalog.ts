import { MEDICAL_CURRICULUM_SCAFFOLD } from './medicalCurriculumScaffold';
import { BDS_CURRICULUM } from './bdsCurriculumScaffold';
import { BAMS_CURRICULUM } from './bamsCurriculumScaffold';
import { BPHARM_CURRICULUM } from './bpharmCurriculumScaffold';
import { BSC_NURSING_CURRICULUM } from './bscNursingCurriculumScaffold';
import { BPT_CURRICULUM } from './bptCurriculumScaffold';
import { ALLIED_HEALTH_MAJORS } from './alliedHealthCurriculumScaffold';
import { BVSC_CURRICULUM } from './bvscCurriculumScaffold';
import { MPH_CURRICULUM } from './mphCurriculumScaffold';
import { MHA_CURRICULUM } from './mhaCurriculumScaffold';

export interface UnifiedDomainChapter {
  id: string;
  title: string;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  section: string;
  competencyCode?: string;
  has3D?: boolean;
  hasSimulation?: boolean;
}

export interface UnifiedDomainSubject {
  id: string;
  code: string;
  title: string;
  semester?: number;
  category: string;
  description?: string;
  chapters: UnifiedDomainChapter[];
}

export interface UnifiedDomainStage {
  key: string;
  label: string;
  semesters?: number[];
  subjects: UnifiedDomainSubject[];
}

export interface DomainCatalog {
  domainId: string;
  domainName: string;
  icon: string;
  stages: UnifiedDomainStage[];
}

export function getUnifiedDomainCatalog(domainId: string): DomainCatalog {
  switch (domainId) {
    case 'dental':
      return {
        domainId: 'dental',
        domainName: 'BDS Dental Surgery',
        icon: '🦷',
        stages: BDS_CURRICULUM.map((yr) => ({
          key: `Year ${yr.year}`,
          label: yr.title,
          semesters: yr.semesters,
          subjects: yr.subjects.map((subj) => ({
            id: subj.id,
            code: subj.code,
            title: subj.name,
            semester: subj.semester,
            category: 'Dental Sciences',
            description: subj.description,
            chapters: subj.lessons.map((l) => ({
              id: l.id,
              title: l.title,
              estimatedMinutes: 45,
              difficulty: 'Intermediate' as const,
              section: subj.name,
              competencyCode: l.dciCode,
              has3D: l.has3DContent,
              hasSimulation: l.hasSimulation,
            })),
          })),
        })),
      };

    case 'ayush':
      return {
        domainId: 'ayush',
        domainName: 'BAMS Ayurvedic Medicine & Surgery',
        icon: '🌿',
        stages: BAMS_CURRICULUM.map((yr) => ({
          key: `Year ${yr.year}`,
          label: yr.title,
          semesters: yr.semesters,
          subjects: yr.subjects.map((subj) => ({
            id: subj.id,
            code: subj.code,
            title: `${subj.name} (${subj.sanskritName})`,
            semester: subj.semester,
            category: 'Ayurvedic Sciences',
            description: subj.description,
            chapters: subj.lessons.map((l) => ({
              id: l.id,
              title: l.title,
              estimatedMinutes: 50,
              difficulty: 'Intermediate' as const,
              section: subj.sanskritName,
              competencyCode: l.ccimCode,
              has3D: l.has3DContent,
              hasSimulation: l.hasSimulation,
            })),
          })),
        })),
      };

    case 'pharmacy':
      return {
        domainId: 'pharmacy',
        domainName: 'B.Pharm & Pharm.D',
        icon: '💊',
        stages: BPHARM_CURRICULUM.map((yr) => ({
          key: `Year ${yr.year}`,
          label: yr.title,
          subjects: yr.subjects.map((subj) => ({
            id: subj.id,
            code: subj.code,
            title: subj.name,
            category: 'Pharmaceutical Sciences',
            description: subj.description,
            chapters: subj.lessons.map((l) => ({
              id: l.id,
              title: l.title,
              estimatedMinutes: 45,
              difficulty: 'Intermediate' as const,
              section: subj.name,
              competencyCode: l.pciCode,
              hasSimulation: l.hasSimulation,
            })),
          })),
        })),
      };

    case 'nursing':
      return {
        domainId: 'nursing',
        domainName: 'B.Sc Nursing',
        icon: '🏥',
        stages: BSC_NURSING_CURRICULUM.map((yr) => ({
          key: `Year ${yr.year}`,
          label: yr.title,
          subjects: yr.subjects.map((subj) => ({
            id: subj.id,
            code: subj.code,
            title: subj.name,
            category: 'Nursing Sciences',
            description: subj.description,
            chapters: subj.lessons.map((l) => ({
              id: l.id,
              title: l.title,
              estimatedMinutes: 40,
              difficulty: 'Intermediate' as const,
              section: subj.name,
              competencyCode: l.incCode,
              hasSimulation: l.hasSimulation,
            })),
          })),
        })),
      };

    case 'physiotherapy':
      return {
        domainId: 'physiotherapy',
        domainName: 'BPT Physiotherapy',
        icon: '🦵',
        stages: BPT_CURRICULUM.map((yr) => ({
          key: `Year ${yr.year}`,
          label: yr.title,
          subjects: yr.subjects.map((subj) => ({
            id: subj.id,
            code: subj.code,
            title: subj.name,
            category: 'Rehabilitation Sciences',
            description: subj.description,
            chapters: subj.lessons.map((l) => ({
              id: l.id,
              title: l.title,
              estimatedMinutes: 45,
              difficulty: 'Intermediate' as const,
              section: subj.name,
              competencyCode: l.iapCode,
              hasSimulation: l.hasSimulation,
            })),
          })),
        })),
      };

    case 'allied':
      return {
        domainId: 'allied',
        domainName: 'B.Sc Allied Health Sciences',
        icon: '🔬',
        stages: ALLIED_HEALTH_MAJORS.map((major) => ({
          key: major.id,
          label: major.name,
          subjects: major.subjects.map((subj) => ({
            id: subj.id,
            code: subj.code,
            title: subj.name,
            category: major.name,
            description: subj.description,
            chapters: subj.lessons.map((l) => ({
              id: l.id,
              title: l.title,
              estimatedMinutes: 40,
              difficulty: 'Intermediate' as const,
              section: subj.name,
              competencyCode: l.ncahpCode,
              hasSimulation: l.hasSimulation,
            })),
          })),
        })),
      };

    case 'veterinary':
      return {
        domainId: 'veterinary',
        domainName: 'BVSc & AH Veterinary Medicine',
        icon: '🐾',
        stages: BVSC_CURRICULUM.map((yr) => ({
          key: `Year ${yr.year}`,
          label: yr.title,
          subjects: yr.subjects.map((subj) => ({
            id: subj.id,
            code: subj.code,
            title: subj.name,
            category: 'Veterinary Medicine',
            description: subj.description,
            chapters: subj.lessons.map((l) => ({
              id: l.id,
              title: l.title,
              estimatedMinutes: 45,
              difficulty: 'Intermediate' as const,
              section: subj.name,
              competencyCode: l.vciCode,
              hasSimulation: l.hasSimulation,
            })),
          })),
        })),
      };

    case 'public-health':
      return {
        domainId: 'public-health',
        domainName: 'Public Health & Hospital Admin (MPH & MHA)',
        icon: '🌍',
        stages: [
          {
            key: 'mph-prog',
            label: 'MPH (Master of Public Health)',
            subjects: MPH_CURRICULUM.map((subj) => ({
              id: subj.id,
              code: subj.code,
              title: subj.name,
              category: 'Epidemiology & Public Health',
              description: subj.description,
              chapters: subj.lessons.map((l) => ({
                id: l.id,
                title: l.title,
                estimatedMinutes: 45,
                difficulty: 'Intermediate' as const,
                section: subj.name,
                competencyCode: l.competencyCode,
                hasSimulation: l.hasSimulation,
              })),
            })),
          },
          {
            key: 'mha-prog',
            label: 'MHA (Master of Hospital Administration)',
            subjects: MHA_CURRICULUM.map((subj) => ({
              id: subj.id,
              code: subj.code,
              title: subj.name,
              category: 'Hospital Administration',
              description: subj.description,
              chapters: subj.lessons.map((l) => ({
                id: l.id,
                title: l.title,
                estimatedMinutes: 45,
                difficulty: 'Intermediate' as const,
                section: subj.name,
                competencyCode: l.code,
              })),
            })),
          },
        ],
      };

    default:
      // MBBS / Allopathic
      return {
        domainId: 'allopathic',
        domainName: 'MBBS (Bachelor of Medicine & Surgery)',
        icon: '🩺',
        stages: [
          {
            key: '1st Professional',
            label: '1st Professional (Sem 1-2)',
            semesters: [1, 2],
            subjects: MEDICAL_CURRICULUM_SCAFFOLD.filter((s) => s.phase === 'PRE_CLINICAL').map((s) => ({
              id: s.id,
              code: s.code,
              title: s.title,
              semester: 1,
              category: s.phase,
              chapters: s.units.flatMap((u) =>
                u.chapters.map((c) => ({
                  id: c.id,
                  title: c.title,
                  estimatedMinutes: c.estimatedMinutes || 45,
                  difficulty: 'Intermediate' as const,
                  section: u.title,
                }))
              ),
            })),
          },
          {
            key: '2nd Professional',
            label: '2nd Professional (Sem 3-4)',
            semesters: [3, 4],
            subjects: MEDICAL_CURRICULUM_SCAFFOLD.filter((s) => s.phase === 'PARA_CLINICAL').map((s) => ({
              id: s.id,
              code: s.code,
              title: s.title,
              semester: 3,
              category: s.phase,
              chapters: s.units.flatMap((u) =>
                u.chapters.map((c) => ({
                  id: c.id,
                  title: c.title,
                  estimatedMinutes: c.estimatedMinutes || 45,
                  difficulty: 'Intermediate' as const,
                  section: u.title,
                }))
              ),
            })),
          },
          {
            key: '3rd Professional I',
            label: '3rd Professional I (Sem 5-6)',
            semesters: [5, 6],
            subjects: MEDICAL_CURRICULUM_SCAFFOLD.filter(
              (s) => s.phase === 'CLINICAL' && s.professionalYear === '3rd Professional I'
            ).map((s) => ({
              id: s.id,
              code: s.code,
              title: s.title,
              semester: 5,
              category: s.phase,
              chapters: s.units.flatMap((u) =>
                u.chapters.map((c) => ({
                  id: c.id,
                  title: c.title,
                  estimatedMinutes: c.estimatedMinutes || 45,
                  difficulty: 'Intermediate' as const,
                  section: u.title,
                }))
              ),
            })),
          },
          {
            key: 'Final Professional II',
            label: 'Final Professional II (Sem 7-9)',
            semesters: [7, 8, 9],
            subjects: MEDICAL_CURRICULUM_SCAFFOLD.filter(
              (s) => s.phase === 'CLINICAL' && s.professionalYear === 'Final Professional II'
            ).map((s) => ({
              id: s.id,
              code: s.code,
              title: s.title,
              semester: 7,
              category: s.phase,
              chapters: s.units.flatMap((u) =>
                u.chapters.map((c) => ({
                  id: c.id,
                  title: c.title,
                  estimatedMinutes: c.estimatedMinutes || 45,
                  difficulty: 'Intermediate' as const,
                  section: u.title,
                }))
              ),
            })),
          },
          {
            key: 'Internship (CRMI)',
            label: 'Internship (CRMI)',
            semesters: [10],
            subjects: MEDICAL_CURRICULUM_SCAFFOLD.filter((s) => s.phase === 'TRANSVERSAL').map((s) => ({
              id: s.id,
              code: s.code,
              title: s.title,
              semester: 10,
              category: s.phase,
              chapters: s.units.flatMap((u) =>
                u.chapters.map((c) => ({
                  id: c.id,
                  title: c.title,
                  estimatedMinutes: c.estimatedMinutes || 45,
                  difficulty: 'Intermediate' as const,
                  section: u.title,
                }))
              ),
            })),
          },
        ],
      };
  }
}
