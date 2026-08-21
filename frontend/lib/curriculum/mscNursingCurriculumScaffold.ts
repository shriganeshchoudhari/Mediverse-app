export interface MScNursingSpecialty {
  id: string;
  name: string;
  shortName: string;
  code: string;
  incSpecialtyCode: string;
  description: string;
  duration: '2 years';
  subjects: Array<{
    id: string;
    name: string;
    code: string;
    description: string;
    lessons: Array<{
      id: string;
      title: string;
      incCode: string;
    }>;
  }>;
}

export const MSC_NURSING_CURRICULUM: MScNursingSpecialty[] = [
  {
    id: 'spec-1',
    name: 'Critical Care Nursing',
    shortName: 'Critical Care',
    code: 'M-CCN',
    incSpecialtyCode: 'INC-M-CCN',
    description: 'Advanced critical care nursing.',
    duration: '2 years',
    subjects: [
      {
        id: 'ms-subj-1',
        name: 'Advanced Critical Care',
        code: 'ACC-1',
        description: 'Advanced concepts in critical care.',
        lessons: [
          { id: 'ml1', title: 'Advanced Hemodynamics', incCode: 'INC-M-01' },
          { id: 'ml2', title: 'Complex Ventilator Modes', incCode: 'INC-M-02' },
          { id: 'ml3', title: 'Neurocritical Care', incCode: 'INC-M-03' }
        ]
      }
    ]
  },
  {
    id: 'spec-2',
    name: 'Cardiopulmonary Nursing',
    shortName: 'Cardiopulmonary',
    code: 'M-CPN',
    incSpecialtyCode: 'INC-M-CPN',
    description: 'Cardiopulmonary specialization.',
    duration: '2 years',
    subjects: [
      {
        id: 'ms-subj-2',
        name: 'Cardiopulmonary Care',
        code: 'CPC-1',
        description: 'Advanced cardiopulmonary care.',
        lessons: [
          { id: 'ml4', title: 'Cardiac Rehab', incCode: 'INC-M-04' },
          { id: 'ml5', title: 'ECMO Management', incCode: 'INC-M-05' },
          { id: 'ml6', title: 'Advanced ECG', incCode: 'INC-M-06' }
        ]
      }
    ]
  },
  {
    id: 'spec-3',
    name: 'Oncology Nursing',
    shortName: 'Oncology',
    code: 'M-ONC',
    incSpecialtyCode: 'INC-M-ONC',
    description: 'Oncology specialization.',
    duration: '2 years',
    subjects: [
      {
        id: 'ms-subj-3',
        name: 'Oncology Care',
        code: 'ONC-1',
        description: 'Cancer care.',
        lessons: [
          { id: 'ml7', title: 'Chemotherapy Admin', incCode: 'INC-M-07' },
          { id: 'ml8', title: 'Palliative Care', incCode: 'INC-M-08' },
          { id: 'ml9', title: 'Radiation Therapy Care', incCode: 'INC-M-09' }
        ]
      }
    ]
  },
  {
    id: 'spec-4',
    name: 'Obstetrics & Gynaecological Nursing',
    shortName: 'OBG',
    code: 'M-OBG',
    incSpecialtyCode: 'INC-M-OBG',
    description: 'OBG specialization.',
    duration: '2 years',
    subjects: [
      {
        id: 'ms-subj-4',
        name: 'Advanced OBG',
        code: 'OBG-1',
        description: 'Advanced maternal care.',
        lessons: [
          { id: 'ml10', title: 'High-risk Pregnancy', incCode: 'INC-M-10' },
          { id: 'ml11', title: 'Advanced Labor Mgmt', incCode: 'INC-M-11' },
          { id: 'ml12', title: 'Neonatal Resuscitation', incCode: 'INC-M-12' }
        ]
      }
    ]
  },
  {
    id: 'spec-5',
    name: 'Pediatric / Neonatal Nursing',
    shortName: 'Pediatric',
    code: 'M-PED',
    incSpecialtyCode: 'INC-M-PED',
    description: 'Pediatric and neonatal specialization.',
    duration: '2 years',
    subjects: [
      {
        id: 'ms-subj-5',
        name: 'Advanced Pediatrics',
        code: 'PED-1',
        description: 'Advanced child care.',
        lessons: [
          { id: 'ml13', title: 'NICU Protocols', incCode: 'INC-M-13' },
          { id: 'ml14', title: 'PICU Management', incCode: 'INC-M-14' },
          { id: 'ml15', title: 'Congenital Anomalies', incCode: 'INC-M-15' }
        ]
      }
    ]
  }
];

export const MSC_NURSING_METADATA = {
  programName: 'Master of Science in Nursing',
  abbreviation: 'M.Sc Nursing',
  duration: '2 Years',
  regulatoryBody: 'INC (Indian Nursing Council)',
  totalYears: 2
};

export function getMScNursingSpecialtyById(id: string): MScNursingSpecialty | undefined {
  return MSC_NURSING_CURRICULUM.find(s => s.id === id);
}
