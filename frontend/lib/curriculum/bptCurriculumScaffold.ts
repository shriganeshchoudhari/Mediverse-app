export interface BPTLesson {
  id: string;
  title: string;
  iapCode: string;
  year: 1 | 2 | 3 | 4;
  hasSimulation: boolean;
  isClinical: boolean;
  description?: string;
}

export interface BPTSubject {
  id: string;
  name: string;
  code: string;
  year: 1 | 2 | 3 | 4;
  creditHours: number;
  description: string;
  lessons: BPTLesson[];
}

export interface BPTYear {
  year: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  subjects: BPTSubject[];
}

export const BPT_CURRICULUM: BPTYear[] = [
  {
    year: 1,
    title: 'First Year',
    description: 'Foundations of Human Biology and Movement',
    subjects: [
      {
        id: 'sub_bpt101',
        name: 'Applied Human Anatomy & Kinesiology',
        code: 'BPT101',
        year: 1,
        creditHours: 200,
        description: 'Study of human body structure relevant to physiotherapy.',
        lessons: [
          { id: 'les_bpt101_1', title: 'Osteology of Upper Limb', iapCode: 'IAP-1.1.1', year: 1, hasSimulation: true, isClinical: false },
          { id: 'les_bpt101_2', title: 'Myology of Lower Limb', iapCode: 'IAP-1.1.2', year: 1, hasSimulation: true, isClinical: false },
          { id: 'les_bpt101_3', title: 'Biomechanics of Shoulder Joint', iapCode: 'IAP-1.1.3', year: 1, hasSimulation: false, isClinical: false }
        ]
      },
      {
        id: 'sub_bpt102',
        name: 'Applied Physiology & Exercise Physiology',
        code: 'BPT102',
        year: 1,
        creditHours: 180,
        description: 'Functioning of the human body and physiological response to exercise.',
        lessons: [
          { id: 'les_bpt102_1', title: 'Cardiovascular Physiology', iapCode: 'IAP-1.2.1', year: 1, hasSimulation: false, isClinical: false },
          { id: 'les_bpt102_2', title: 'Respiratory Physiology', iapCode: 'IAP-1.2.2', year: 1, hasSimulation: true, isClinical: false },
          { id: 'les_bpt102_3', title: 'Energy Systems in Exercise', iapCode: 'IAP-1.2.3', year: 1, hasSimulation: false, isClinical: false }
        ]
      },
      {
        id: 'sub_bpt103',
        name: 'Biomechanics & Ergonomics',
        code: 'BPT103',
        year: 1,
        creditHours: 150,
        description: 'Application of mechanical principles to human movement.',
        lessons: [
          { id: 'les_bpt103_1', title: 'Principles of Kinetics', iapCode: 'IAP-1.3.1', year: 1, hasSimulation: true, isClinical: false },
          { id: 'les_bpt103_2', title: 'Gait Analysis', iapCode: 'IAP-1.3.2', year: 1, hasSimulation: true, isClinical: true },
          { id: 'les_bpt103_3', title: 'Workplace Ergonomics', iapCode: 'IAP-1.3.3', year: 1, hasSimulation: false, isClinical: true }
        ]
      }
    ]
  },
  {
    year: 2,
    title: 'Second Year',
    description: 'Basic Physiotherapy Therapeutic Modalities',
    subjects: [
      {
        id: 'sub_bpt201',
        name: 'Exercise Therapy-I & Goniometry',
        code: 'BPT201',
        year: 2,
        creditHours: 200,
        description: 'Foundations of therapeutic exercise and joint measurement.',
        lessons: [
          { id: 'les_bpt201_1', title: 'Principles of ROM Exercises', iapCode: 'IAP-2.1.1', year: 2, hasSimulation: true, isClinical: true },
          { id: 'les_bpt201_2', title: 'Goniometry of Upper Extremity', iapCode: 'IAP-2.1.2', year: 2, hasSimulation: true, isClinical: true },
          { id: 'les_bpt201_3', title: 'Stretching Techniques', iapCode: 'IAP-2.1.3', year: 2, hasSimulation: false, isClinical: true }
        ]
      },
      {
        id: 'sub_bpt202',
        name: 'Electrotherapy & Physical Agents',
        code: 'BPT202',
        year: 2,
        creditHours: 200,
        description: 'Use of electrical currents and physical agents in therapy.',
        lessons: [
          { id: 'les_bpt202_1', title: 'Low Frequency Currents (TENS)', iapCode: 'IAP-2.2.1', year: 2, hasSimulation: true, isClinical: true },
          { id: 'les_bpt202_2', title: 'Therapeutic Ultrasound', iapCode: 'IAP-2.2.2', year: 2, hasSimulation: true, isClinical: true },
          { id: 'les_bpt202_3', title: 'Cryotherapy and Thermotherapy', iapCode: 'IAP-2.2.3', year: 2, hasSimulation: false, isClinical: true }
        ]
      },
      {
        id: 'sub_bpt203',
        name: 'Applied Pathology & Microbiology',
        code: 'BPT203',
        year: 2,
        creditHours: 150,
        description: 'Pathological changes and microorganisms affecting human health.',
        lessons: [
          { id: 'les_bpt203_1', title: 'Inflammation and Healing', iapCode: 'IAP-2.3.1', year: 2, hasSimulation: false, isClinical: false },
          { id: 'les_bpt203_2', title: 'Bone and Joint Pathology', iapCode: 'IAP-2.3.2', year: 2, hasSimulation: false, isClinical: false },
          { id: 'les_bpt203_3', title: 'Infection Control in Clinic', iapCode: 'IAP-2.3.3', year: 2, hasSimulation: true, isClinical: true }
        ]
      }
    ]
  },
  {
    year: 3,
    title: 'Third Year',
    description: 'Core Clinical Physiotherapy Fields',
    subjects: [
      {
        id: 'sub_bpt301',
        name: 'Orthopedic & Musculoskeletal Physiotherapy',
        code: 'BPT301',
        year: 3,
        creditHours: 250,
        description: 'Management of musculoskeletal and orthopaedic conditions.',
        lessons: [
          { id: 'les_bpt301_1', title: 'Fracture Management', iapCode: 'IAP-3.1.1', year: 3, hasSimulation: true, isClinical: true },
          { id: 'les_bpt301_2', title: 'Spinal Assessment', iapCode: 'IAP-3.1.2', year: 3, hasSimulation: true, isClinical: true },
          { id: 'les_bpt301_3', title: 'Post-operative Joint Replacement Rehab', iapCode: 'IAP-3.1.3', year: 3, hasSimulation: false, isClinical: true }
        ]
      },
      {
        id: 'sub_bpt302',
        name: 'Neurological Physiotherapy',
        code: 'BPT302',
        year: 3,
        creditHours: 250,
        description: 'Rehabilitation of neurological disorders.',
        lessons: [
          { id: 'les_bpt302_1', title: 'Stroke Rehabilitation (NDT)', iapCode: 'IAP-3.2.1', year: 3, hasSimulation: true, isClinical: true },
          { id: 'les_bpt302_2', title: 'Spinal Cord Injury Management', iapCode: 'IAP-3.2.2', year: 3, hasSimulation: true, isClinical: true },
          { id: 'les_bpt302_3', title: 'Parkinson’s Disease Protocols', iapCode: 'IAP-3.2.3', year: 3, hasSimulation: false, isClinical: true }
        ]
      },
      {
        id: 'sub_bpt303',
        name: 'Cardiopulmonary Physiotherapy',
        code: 'BPT303',
        year: 3,
        creditHours: 200,
        description: 'Management of cardiac and respiratory conditions.',
        lessons: [
          { id: 'les_bpt303_1', title: 'Airway Clearance Techniques', iapCode: 'IAP-3.3.1', year: 3, hasSimulation: true, isClinical: true },
          { id: 'les_bpt303_2', title: 'Cardiac Rehabilitation Phases', iapCode: 'IAP-3.3.2', year: 3, hasSimulation: true, isClinical: true },
          { id: 'les_bpt303_3', title: 'ICU Physiotherapy', iapCode: 'IAP-3.3.3', year: 3, hasSimulation: true, isClinical: true }
        ]
      }
    ]
  },
  {
    year: 4,
    title: 'Fourth Year',
    description: 'Advanced Physiotherapy & Specialized Fields',
    subjects: [
      {
        id: 'sub_bpt401',
        name: 'Sports Physiotherapy & Taping',
        code: 'BPT401',
        year: 4,
        creditHours: 150,
        description: 'Sports injury management and performance enhancement.',
        lessons: [
          { id: 'les_bpt401_1', title: 'On-field Injury Assessment', iapCode: 'IAP-4.1.1', year: 4, hasSimulation: true, isClinical: true },
          { id: 'les_bpt401_2', title: 'Kinesiotaping Techniques', iapCode: 'IAP-4.1.2', year: 4, hasSimulation: true, isClinical: true },
          { id: 'les_bpt401_3', title: 'Return to Play Criteria', iapCode: 'IAP-4.1.3', year: 4, hasSimulation: false, isClinical: true }
        ]
      },
      {
        id: 'sub_bpt402',
        name: 'Community-Based Rehabilitation & Geriatrics',
        code: 'BPT402',
        year: 4,
        creditHours: 150,
        description: 'Rehab in community settings and elderly care.',
        lessons: [
          { id: 'les_bpt402_1', title: 'Fall Prevention in Elderly', iapCode: 'IAP-4.2.1', year: 4, hasSimulation: true, isClinical: true },
          { id: 'les_bpt402_2', title: 'Community Needs Assessment', iapCode: 'IAP-4.2.2', year: 4, hasSimulation: false, isClinical: true },
          { id: 'les_bpt402_3', title: 'Accessibility Modifications', iapCode: 'IAP-4.2.3', year: 4, hasSimulation: false, isClinical: true }
        ]
      },
      {
        id: 'sub_bpt403',
        name: 'Ethics & Evidence-Based Practice',
        code: 'BPT403',
        year: 4,
        creditHours: 100,
        description: 'Professional ethics and research in physiotherapy.',
        lessons: [
          { id: 'les_bpt403_1', title: 'IAP Code of Ethics', iapCode: 'IAP-4.3.1', year: 4, hasSimulation: false, isClinical: false },
          { id: 'les_bpt403_2', title: 'Critical Appraisal of Literature', iapCode: 'IAP-4.3.2', year: 4, hasSimulation: false, isClinical: false },
          { id: 'les_bpt403_3', title: 'Designing a Case Study', iapCode: 'IAP-4.3.3', year: 4, hasSimulation: false, isClinical: false }
        ]
      }
    ]
  }
];

export const BPT_METADATA = {
  programName: 'Bachelor of Physiotherapy',
  abbreviation: 'BPT',
  duration: '4.5 Years (including 6-month internship)',
  regulatoryBody: 'IAP (Indian Association of Physiotherapists)',
  totalYears: 4
};

export function getBPTSubjectById(id: string): BPTSubject | undefined {
  for (const year of BPT_CURRICULUM) {
    const subject = year.subjects.find((s) => s.id === id);
    if (subject) return subject;
  }
  return undefined;
}
