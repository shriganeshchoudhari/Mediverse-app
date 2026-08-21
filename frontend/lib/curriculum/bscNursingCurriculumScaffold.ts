export interface BScNursingLesson {
  id: string;
  title: string;
  incCode: string;
  year: 1 | 2 | 3 | 4;
  hasSimulation: boolean;
  isClinical: boolean;
  description: string;
}

export interface BScNursingSubject {
  id: string;
  name: string;
  code: string;
  year: 1 | 2 | 3 | 4;
  creditHours: number;
  description: string;
  lessons: BScNursingLesson[];
}

export interface BScNursingYear {
  year: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  subjects: BScNursingSubject[];
}

export const BSC_NURSING_CURRICULUM: BScNursingYear[] = [
  {
    year: 1,
    title: 'First Year B.Sc Nursing',
    description: 'Foundation of Nursing and Basic Sciences',
    subjects: [
      {
        id: 'subj-1-1',
        name: 'Applied Anatomy & Physiology',
        code: 'N-ANP',
        year: 1,
        creditHours: 80,
        description: 'Anatomy and physiology for nursing.',
        lessons: [
          { id: 'l1', title: 'Skeletal System', incCode: 'INC-ANP-01', year: 1, hasSimulation: true, isClinical: false, description: 'Bones and joints.' },
          { id: 'l2', title: 'Cardiovascular System', incCode: 'INC-ANP-02', year: 1, hasSimulation: true, isClinical: false, description: 'Heart and blood vessels.' },
          { id: 'l3', title: 'Respiratory System', incCode: 'INC-ANP-03', year: 1, hasSimulation: true, isClinical: false, description: 'Lungs and airways.' }
        ]
      },
      {
        id: 'subj-1-2',
        name: 'Nursing Foundations',
        code: 'N-FND',
        year: 1,
        creditHours: 120,
        description: 'Basic nursing principles.',
        lessons: [
          { id: 'l4', title: 'Vital Signs', incCode: 'INC-FND-01', year: 1, hasSimulation: true, isClinical: true, description: 'Measuring TPR and BP.' },
          { id: 'l5', title: 'Infection Control', incCode: 'INC-FND-02', year: 1, hasSimulation: true, isClinical: true, description: 'Handwashing and PPE.' },
          { id: 'l6', title: 'Patient Positioning', incCode: 'INC-FND-03', year: 1, hasSimulation: true, isClinical: true, description: 'Positions and transfers.' }
        ]
      },
      {
        id: 'subj-1-3',
        name: 'Applied Biochemistry & Nutrition',
        code: 'N-BCN',
        year: 1,
        creditHours: 60,
        description: 'Biochemistry and nutrition principles.',
        lessons: [
          { id: 'l7', title: 'Carbohydrate Metabolism', incCode: 'INC-BCN-01', year: 1, hasSimulation: false, isClinical: false, description: 'Glycolysis.' },
          { id: 'l8', title: 'Vitamins', incCode: 'INC-BCN-02', year: 1, hasSimulation: false, isClinical: false, description: 'Fat and water soluble vitamins.' },
          { id: 'l9', title: 'Dietary Assessment', incCode: 'INC-BCN-03', year: 1, hasSimulation: false, isClinical: true, description: 'Assessing patient diet.' }
        ]
      }
    ]
  },
  {
    year: 2,
    title: 'Second Year B.Sc Nursing',
    description: 'Medical-Surgical and Pathology',
    subjects: [
      {
        id: 'subj-2-1',
        name: 'Medical-Surgical Nursing-I',
        code: 'N-MSN1',
        year: 2,
        creditHours: 120,
        description: 'Adult nursing.',
        lessons: [
          { id: 'l10', title: 'Perioperative Nursing', incCode: 'INC-MSN-01', year: 2, hasSimulation: true, isClinical: true, description: 'Pre and post-op care.' },
          { id: 'l11', title: 'Wound Care', incCode: 'INC-MSN-02', year: 2, hasSimulation: true, isClinical: true, description: 'Dressing and wound management.' },
          { id: 'l12', title: 'Pain Management', incCode: 'INC-MSN-03', year: 2, hasSimulation: true, isClinical: true, description: 'Assessment and relief.' }
        ]
      },
      {
        id: 'subj-2-2',
        name: 'Applied Pharmacology',
        code: 'N-PHM',
        year: 2,
        creditHours: 60,
        description: 'Drugs and their actions.',
        lessons: [
          { id: 'l13', title: 'Pharmacokinetics', incCode: 'INC-PHM-01', year: 2, hasSimulation: false, isClinical: false, description: 'ADME.' },
          { id: 'l14', title: 'Antibiotics', incCode: 'INC-PHM-02', year: 2, hasSimulation: false, isClinical: false, description: 'Classes and uses.' },
          { id: 'l15', title: 'Medication Administration', incCode: 'INC-PHM-03', year: 2, hasSimulation: true, isClinical: true, description: 'Safe administration.' }
        ]
      },
      {
        id: 'subj-2-3',
        name: 'Applied Pathology & Genetics',
        code: 'N-PGEN',
        year: 2,
        creditHours: 60,
        description: 'Pathology and genetics basics.',
        lessons: [
          { id: 'l16', title: 'Cell Injury', incCode: 'INC-PGEN-01', year: 2, hasSimulation: false, isClinical: false, description: 'Apoptosis and necrosis.' },
          { id: 'l17', title: 'Inflammation', incCode: 'INC-PGEN-02', year: 2, hasSimulation: false, isClinical: false, description: 'Acute and chronic.' },
          { id: 'l18', title: 'Genetic Inheritance', incCode: 'INC-PGEN-03', year: 2, hasSimulation: false, isClinical: false, description: 'Mendelian genetics.' }
        ]
      }
    ]
  },
  {
    year: 3,
    title: 'Third Year B.Sc Nursing',
    description: 'Specialty Nursing',
    subjects: [
      {
        id: 'subj-3-1',
        name: 'Medical-Surgical Nursing-II & Critical Care',
        code: 'N-MSN2',
        year: 3,
        creditHours: 120,
        description: 'Advanced medical surgical.',
        lessons: [
          { id: 'l19', title: 'ECG Interpretation', incCode: 'INC-MSN2-01', year: 3, hasSimulation: true, isClinical: true, description: 'Reading rhythms.' },
          { id: 'l20', title: 'Mechanical Ventilation', incCode: 'INC-MSN2-02', year: 3, hasSimulation: true, isClinical: true, description: 'Ventilator settings.' },
          { id: 'l21', title: 'BLS & ACLS', incCode: 'INC-MSN2-03', year: 3, hasSimulation: true, isClinical: true, description: 'Life support.' }
        ]
      },
      {
        id: 'subj-3-2',
        name: 'Child Health Nursing (Pediatrics)',
        code: 'N-CHN',
        year: 3,
        creditHours: 90,
        description: 'Pediatric care.',
        lessons: [
          { id: 'l22', title: 'Growth and Development', incCode: 'INC-CHN-01', year: 3, hasSimulation: false, isClinical: true, description: 'Milestones.' },
          { id: 'l23', title: 'Immunization', incCode: 'INC-CHN-02', year: 3, hasSimulation: true, isClinical: true, description: 'Schedules and administration.' },
          { id: 'l24', title: 'Pediatric Emergencies', incCode: 'INC-CHN-03', year: 3, hasSimulation: true, isClinical: true, description: 'Managing acute cases.' }
        ]
      },
      {
        id: 'subj-3-3',
        name: 'Mental Health Nursing',
        code: 'N-MHN',
        year: 3,
        creditHours: 90,
        description: 'Psychiatric nursing.',
        lessons: [
          { id: 'l25', title: 'Therapeutic Communication', incCode: 'INC-MHN-01', year: 3, hasSimulation: true, isClinical: true, description: 'Communication skills.' },
          { id: 'l26', title: 'Schizophrenia', incCode: 'INC-MHN-02', year: 3, hasSimulation: false, isClinical: true, description: 'Care of patients.' },
          { id: 'l27', title: 'Mood Disorders', incCode: 'INC-MHN-03', year: 3, hasSimulation: false, isClinical: true, description: 'Depression and bipolar.' }
        ]
      }
    ]
  },
  {
    year: 4,
    title: 'Fourth Year B.Sc Nursing',
    description: 'Community and Leadership',
    subjects: [
      {
        id: 'subj-4-1',
        name: 'Midwifery & Obstetrical Nursing',
        code: 'N-MID',
        year: 4,
        creditHours: 120,
        description: 'Maternal and newborn care.',
        lessons: [
          { id: 'l28', title: 'Antenatal Care', incCode: 'INC-MID-01', year: 4, hasSimulation: true, isClinical: true, description: 'Assessment and education.' },
          { id: 'l29', title: 'Normal Labor', incCode: 'INC-MID-02', year: 4, hasSimulation: true, isClinical: true, description: 'Stages of labor.' },
          { id: 'l30', title: 'Postnatal Care', incCode: 'INC-MID-03', year: 4, hasSimulation: true, isClinical: true, description: 'Mother and newborn care.' }
        ]
      },
      {
        id: 'subj-4-2',
        name: 'Community Health Nursing',
        code: 'N-COM',
        year: 4,
        creditHours: 90,
        description: 'Public health nursing.',
        lessons: [
          { id: 'l31', title: 'Epidemiology', incCode: 'INC-COM-01', year: 4, hasSimulation: false, isClinical: false, description: 'Disease transmission.' },
          { id: 'l32', title: 'Family Health', incCode: 'INC-COM-02', year: 4, hasSimulation: false, isClinical: true, description: 'Home visits.' },
          { id: 'l33', title: 'Health Programs', incCode: 'INC-COM-03', year: 4, hasSimulation: false, isClinical: false, description: 'National health programs.' }
        ]
      },
      {
        id: 'subj-4-3',
        name: 'Nursing Management & Leadership',
        code: 'N-MGT',
        year: 4,
        creditHours: 60,
        description: 'Management in nursing.',
        lessons: [
          { id: 'l34', title: 'Leadership Styles', incCode: 'INC-MGT-01', year: 4, hasSimulation: false, isClinical: false, description: 'Theories of leadership.' },
          { id: 'l35', title: 'Ward Management', incCode: 'INC-MGT-02', year: 4, hasSimulation: false, isClinical: true, description: 'Running a ward.' },
          { id: 'l36', title: 'Quality Assurance', incCode: 'INC-MGT-03', year: 4, hasSimulation: false, isClinical: false, description: 'Audits and standards.' }
        ]
      }
    ]
  }
];

export const BSC_NURSING_METADATA = {
  programName: 'Bachelor of Science in Nursing',
  abbreviation: 'B.Sc Nursing',
  duration: '4 Years',
  regulatoryBody: 'INC (Indian Nursing Council)',
  totalYears: 4
};

export function getBScNursingSubjectById(id: string): BScNursingSubject | undefined {
  for (const year of BSC_NURSING_CURRICULUM) {
    const subject = year.subjects.find((s) => s.id === id);
    if (subject) return subject;
  }
  return undefined;
}
