export interface BHMSLesson {
  id: string;
  title: string;
  cchCode: string;
  has3DContent: boolean;
  hasSimulation: boolean;
  isClinical: boolean;
  description: string;
}

export interface BHMSSubject {
  id: string;
  name: string;
  code: string;
  creditHours: number;
  description: string;
  lessons: BHMSLesson[];
}

export interface BHMSYear {
  year: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  subjects: BHMSSubject[];
}

export const BHMS_CURRICULUM: BHMSYear[] = [
  {
    year: 1,
    title: 'First Year BHMS',
    description: 'Foundational principles and anatomy/physiology.',
    subjects: [
      {
        id: 'bhms-s1-1',
        name: 'Homeopathic Pharmacy',
        code: 'HOM-PHARM-1',
        creditHours: 200,
        description: 'Preparation of homeopathic medicines.',
        lessons: [
          { id: 'l1', title: 'Sources of Homeopathic Drugs', cchCode: 'PH-1', has3DContent: false, hasSimulation: false, isClinical: false, description: 'Plant, animal, mineral sources.' },
          { id: 'l2', title: 'Potentization and Trituration', cchCode: 'PH-2', has3DContent: false, hasSimulation: true, isClinical: false, description: 'Dynamization.' },
          { id: 'l3', title: 'Vehicles in Homeopathy', cchCode: 'PH-3', has3DContent: false, hasSimulation: false, isClinical: false, description: 'Sugar of milk, alcohol.' }
        ]
      },
      {
        id: 'bhms-s1-2',
        name: 'Anatomy',
        code: 'ANAT-1',
        creditHours: 300,
        description: 'Human anatomy.',
        lessons: [
          { id: 'l4', title: 'Upper Limb', cchCode: 'AN-1', has3DContent: true, hasSimulation: false, isClinical: false, description: 'Bones and muscles.' },
          { id: 'l5', title: 'Thorax', cchCode: 'AN-2', has3DContent: true, hasSimulation: false, isClinical: false, description: 'Lungs and heart.' },
          { id: 'l6', title: 'Abdomen', cchCode: 'AN-3', has3DContent: true, hasSimulation: false, isClinical: false, description: 'Digestive system organs.' }
        ]
      }
    ]
  },
  {
    year: 2,
    title: 'Second Year BHMS',
    description: 'Pathology and early Materia Medica.',
    subjects: [
      {
        id: 'bhms-s2-1',
        name: 'Pathology & Microbiology',
        code: 'PATH-2',
        creditHours: 250,
        description: 'Disease processes.',
        lessons: [
          { id: 'l7', title: 'General Pathology', cchCode: 'PA-1', has3DContent: true, hasSimulation: false, isClinical: true, description: 'Inflammation and repair.' },
          { id: 'l8', title: 'Bacteriology', cchCode: 'PA-2', has3DContent: false, hasSimulation: true, isClinical: false, description: 'Pathogenic bacteria.' },
          { id: 'l9', title: 'Virology', cchCode: 'PA-3', has3DContent: true, hasSimulation: false, isClinical: false, description: 'Viral infections.' }
        ]
      },
      {
        id: 'bhms-s2-2',
        name: 'Organon of Medicine & Homeopathic Philosophy',
        code: 'ORG-2',
        creditHours: 200,
        description: 'Aphorisms of Hahnemann.',
        lessons: [
          { id: 'l10', title: 'Aphorisms 1-71', cchCode: 'OR-1', has3DContent: false, hasSimulation: false, isClinical: false, description: 'The physician and disease.' },
          { id: 'l11', title: 'Vital Force Concept', cchCode: 'OR-2', has3DContent: false, hasSimulation: false, isClinical: false, description: 'Dynamic nature of life.' },
          { id: 'l12', title: 'Theory of Chronic Diseases', cchCode: 'OR-3', has3DContent: false, hasSimulation: false, isClinical: true, description: 'Psora, Sycosis, Syphilis.' }
        ]
      }
    ]
  },
  {
    year: 3,
    title: 'Third Year BHMS',
    description: 'Surgery, Gynecology, and advanced Materia Medica.',
    subjects: [
      {
        id: 'bhms-s3-1',
        name: 'Homeopathic Materia Medica',
        code: 'HMM-3',
        creditHours: 300,
        description: 'Study of drugs.',
        lessons: [
          { id: 'l13', title: 'Polychrest Remedies', cchCode: 'MM-1', has3DContent: false, hasSimulation: false, isClinical: true, description: 'Deep acting remedies.' },
          { id: 'l14', title: 'Sulphur', cchCode: 'MM-2', has3DContent: false, hasSimulation: false, isClinical: true, description: 'Anti-psoric remedy.' },
          { id: 'l15', title: 'Lycopodium', cchCode: 'MM-3', has3DContent: false, hasSimulation: false, isClinical: true, description: 'Right-sided remedy.' }
        ]
      },
      {
        id: 'bhms-s3-2',
        name: 'Surgery & Homeopathic Therapeutics',
        code: 'SURG-3',
        creditHours: 250,
        description: 'Surgical conditions and their homeopathic management.',
        lessons: [
          { id: 'l16', title: 'Wounds and Healing', cchCode: 'SU-1', has3DContent: true, hasSimulation: false, isClinical: true, description: 'Management of wounds.' },
          { id: 'l17', title: 'Diseases of Bones', cchCode: 'SU-2', has3DContent: true, hasSimulation: false, isClinical: true, description: 'Fractures and homeopathic aids.' },
          { id: 'l18', title: 'Abdominal Surgeries', cchCode: 'SU-3', has3DContent: false, hasSimulation: true, isClinical: true, description: 'Appendicitis, hernia.' }
        ]
      }
    ]
  },
  {
    year: 4,
    title: 'Fourth Year BHMS',
    description: 'Practice of medicine, Repertory, and Community Medicine.',
    subjects: [
      {
        id: 'bhms-s4-1',
        name: 'Practice of Medicine in Homeopathy',
        code: 'PM-4',
        creditHours: 400,
        description: 'Clinical medicine.',
        lessons: [
          { id: 'l19', title: 'Respiratory System', cchCode: 'PM-1', has3DContent: true, hasSimulation: true, isClinical: true, description: 'Asthma, COPD.' },
          { id: 'l20', title: 'Cardiovascular System', cchCode: 'PM-2', has3DContent: true, hasSimulation: true, isClinical: true, description: 'Hypertension, IHD.' },
          { id: 'l21', title: 'Endocrine Disorders', cchCode: 'PM-3', has3DContent: true, hasSimulation: false, isClinical: true, description: 'Diabetes, Thyroid.' }
        ]
      },
      {
        id: 'bhms-s4-2',
        name: 'Homeopathic Repertory',
        code: 'REP-4',
        creditHours: 200,
        description: 'Index of symptoms.',
        lessons: [
          { id: 'l22', title: 'Kent Repertory', cchCode: 'RE-1', has3DContent: false, hasSimulation: true, isClinical: true, description: 'Structure and use.' },
          { id: 'l23', title: 'Boenninghausen Repertory', cchCode: 'RE-2', has3DContent: false, hasSimulation: true, isClinical: true, description: 'Therapeutic pocketbook.' },
          { id: 'l24', title: 'Synthesis Repertory', cchCode: 'RE-3', has3DContent: false, hasSimulation: true, isClinical: true, description: 'Modern repertorization.' }
        ]
      }
    ]
  }
];

export function getBHMSSubjectById(id: string): BHMSSubject | undefined {
  for (const year of BHMS_CURRICULUM) {
    const subject = year.subjects.find(s => s.id === id);
    if (subject) return subject;
  }
  return undefined;
}

export const BHMS_METADATA = {
  totalYears: BHMS_CURRICULUM.length,
  domain: 'AYUSH',
  programType: 'Undergraduate',
  regulatoryBody: 'CCH (Central Council of Homeopathy)'
};
