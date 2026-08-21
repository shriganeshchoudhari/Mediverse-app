export interface MPTLesson {
  id: string;
  title: string;
  iapCode: string;
}

export interface MPTSubject {
  id: string;
  name: string;
  code: string;
  description: string;
  lessons: MPTLesson[];
}

export interface MPTSpecialty {
  id: string;
  name: string;
  shortName: string;
  code: string;
  iapSpecialtyCode: string;
  description: string;
  duration: '2 years';
  subjects: MPTSubject[];
}

export const MPT_CURRICULUM: MPTSpecialty[] = [
  {
    id: 'mpt_ortho',
    name: 'Musculoskeletal / Orthopedic Physiotherapy',
    shortName: 'Ortho',
    code: 'MPT-ORTHO',
    iapSpecialtyCode: 'IAP-S1',
    description: 'Advanced management of musculoskeletal disorders and post-operative orthopedic care.',
    duration: '2 years',
    subjects: [
      {
        id: 'mpt_ortho_s1',
        name: 'Advanced Biomechanics',
        code: 'MPT-ORTHO-101',
        description: 'Advanced joint biomechanics.',
        lessons: [
          { id: 'mpt_ortho_s1_l1', title: 'Spinal Kinematics', iapCode: 'IAP-S1.1' },
          { id: 'mpt_ortho_s1_l2', title: 'Peripheral Joint Mechanics', iapCode: 'IAP-S1.2' },
          { id: 'mpt_ortho_s1_l3', title: 'Pathomechanics', iapCode: 'IAP-S1.3' }
        ]
      }
    ]
  },
  {
    id: 'mpt_neuro',
    name: 'Neurological Physiotherapy',
    shortName: 'Neuro',
    code: 'MPT-NEURO',
    iapSpecialtyCode: 'IAP-S2',
    description: 'Advanced neuro-rehabilitation techniques.',
    duration: '2 years',
    subjects: [
      {
        id: 'mpt_neuro_s1',
        name: 'Applied Neuroanatomy',
        code: 'MPT-NEURO-101',
        description: 'Advanced study of the nervous system.',
        lessons: [
          { id: 'mpt_neuro_s1_l1', title: 'Brain Plasticity', iapCode: 'IAP-S2.1' },
          { id: 'mpt_neuro_s1_l2', title: 'Motor Control Theories', iapCode: 'IAP-S2.2' },
          { id: 'mpt_neuro_s1_l3', title: 'Advanced NDT', iapCode: 'IAP-S2.3' }
        ]
      }
    ]
  },
  {
    id: 'mpt_sports',
    name: 'Sports Physiotherapy',
    shortName: 'Sports',
    code: 'MPT-SPORTS',
    iapSpecialtyCode: 'IAP-S3',
    description: 'Sports injury management and athlete rehabilitation.',
    duration: '2 years',
    subjects: [
      {
        id: 'mpt_sports_s1',
        name: 'Sports Injury Management',
        code: 'MPT-SPORTS-101',
        description: 'Management of acute and chronic sports injuries.',
        lessons: [
          { id: 'mpt_sports_s1_l1', title: 'Advanced Taping', iapCode: 'IAP-S3.1' },
          { id: 'mpt_sports_s1_l2', title: 'Sports Biomechanics', iapCode: 'IAP-S3.2' },
          { id: 'mpt_sports_s1_l3', title: 'Return to Sport Protocols', iapCode: 'IAP-S3.3' }
        ]
      }
    ]
  },
  {
    id: 'mpt_cardio',
    name: 'Cardiopulmonary Physiotherapy',
    shortName: 'Cardio',
    code: 'MPT-CARDIO',
    iapSpecialtyCode: 'IAP-S4',
    description: 'Advanced cardiac and pulmonary rehabilitation.',
    duration: '2 years',
    subjects: [
      {
        id: 'mpt_cardio_s1',
        name: 'Critical Care Physiotherapy',
        code: 'MPT-CARDIO-101',
        description: 'Physiotherapy in ICU and critical care.',
        lessons: [
          { id: 'mpt_cardio_s1_l1', title: 'Mechanical Ventilation', iapCode: 'IAP-S4.1' },
          { id: 'mpt_cardio_s1_l2', title: 'ABG Interpretation', iapCode: 'IAP-S4.2' },
          { id: 'mpt_cardio_s1_l3', title: 'Advanced Airway Clearance', iapCode: 'IAP-S4.3' }
        ]
      }
    ]
  },
  {
    id: 'mpt_pediatric',
    name: 'Pediatric Physiotherapy',
    shortName: 'Pediatrics',
    code: 'MPT-PEDS',
    iapSpecialtyCode: 'IAP-S5',
    description: 'Rehabilitation of pediatric conditions.',
    duration: '2 years',
    subjects: [
      {
        id: 'mpt_peds_s1',
        name: 'Pediatric Neurology',
        code: 'MPT-PEDS-101',
        description: 'Management of pediatric neurological disorders.',
        lessons: [
          { id: 'mpt_peds_s1_l1', title: 'Cerebral Palsy Management', iapCode: 'IAP-S5.1' },
          { id: 'mpt_peds_s1_l2', title: 'Developmental Milestones', iapCode: 'IAP-S5.2' },
          { id: 'mpt_peds_s1_l3', title: 'Pediatric Orthotics', iapCode: 'IAP-S5.3' }
        ]
      }
    ]
  }
];

export const MPT_METADATA = {
  programName: 'Master of Physiotherapy',
  abbreviation: 'MPT',
  duration: '2 Years',
  regulatoryBody: 'IAP (Indian Association of Physiotherapists)'
};

export function getMPTSpecialtyById(id: string): MPTSpecialty | undefined {
  return MPT_CURRICULUM.find(s => s.id === id);
}
