export const BSMS_METADATA = {
  programCode: 'BSMS',
  programName: 'Bachelor of Siddha Medicine & Surgery',
  regulatoryBody: 'CCIM (Central Council of Indian Medicine — Siddha)',
  duration: '5.5 years (5 years + 1 year internship)',
  domain: 'AYUSH',
  description: 'CCIM-regulated undergraduate program in Siddha Medicine from Tamil Nadu tradition, covering Siddhanta principles, Gunapadam, Noi Naadal diagnostics, Varmam, and clinical practice.'
};

export interface BSMSLesson {
  id: string;
  title: string;
  duration: string;
  type: 'lecture' | 'practical' | 'clinical';
  keyPoints: string[];
}

export interface BSMSSubject {
  id: string;
  code: string;
  title: string;
  year: number;
  semester: number;
  lessons: BSMSLesson[];
  clinicalHours: number;
}

export const BSMS_CURRICULUM: BSMSSubject[] = [
  {
    id: 'bsms-sidd',
    code: 'BSMS-SIDD',
    title: 'Siddhanta (Siddha Principles)',
    year: 1, semester: 1,
    clinicalHours: 0,
    lessons: [
      { id: 'bsms-sidd-01', title: 'Panchabhoota theory', duration: '45 min', type: 'lecture', keyPoints: ['Five elements', 'Microcosm and macrocosm'] },
      { id: 'bsms-sidd-02', title: 'Tridosham (Vatam/Pittam/Kapam)', duration: '45 min', type: 'lecture', keyPoints: ['Three humors', 'Characteristics', 'Functions'] },
      { id: 'bsms-sidd-03', title: 'Mukkutram', duration: '45 min', type: 'lecture', keyPoints: ['Derangement of Tridosha', 'Pathogenesis'] },
      { id: 'bsms-sidd-04', title: 'Classical Siddha texts', duration: '45 min', type: 'lecture', keyPoints: ['History', 'Key authors'] }
    ]
  },
  {
    id: 'bsms-maram',
    code: 'BSMS-MARAM',
    title: 'Maruthuva Nool (Classical Siddha Texts)',
    year: 1, semester: 2,
    clinicalHours: 0,
    lessons: [
      { id: 'bsms-maram-01', title: 'Thirumoolar\'s Thirumanthiram', duration: '45 min', type: 'lecture', keyPoints: ['Philosophy', 'Yoga'] },
      { id: 'bsms-maram-02', title: 'Bogar 7000', duration: '45 min', type: 'lecture', keyPoints: ['Alchemy', 'Medicine preparation'] },
      { id: 'bsms-maram-03', title: 'Agastyar\'s texts', duration: '45 min', type: 'lecture', keyPoints: ['Anatomy', 'Diagnosis'] }
    ]
  },
  {
    id: 'bsms-gunapm',
    code: 'BSMS-GUNAPM',
    title: 'Gunapadam (Siddha Materia Medica)',
    year: 2, semester: 3,
    clinicalHours: 20,
    lessons: [
      { id: 'bsms-gunapm-01', title: 'Herbal Gunapadam', duration: '45 min', type: 'lecture', keyPoints: ['Plant properties', 'Therapeutic uses'] },
      { id: 'bsms-gunapm-02', title: 'Metallic preparations (Parpam/Chendooram)', duration: '60 min', type: 'practical', keyPoints: ['Calcination', 'Sublimation'] },
      { id: 'bsms-gunapm-03', title: 'Mineral drugs', duration: '45 min', type: 'lecture', keyPoints: ['Purification', 'Toxicity'] },
      { id: 'bsms-gunapm-04', title: 'Toxicology', duration: '45 min', type: 'lecture', keyPoints: ['Poisons', 'Antidotes'] }
    ]
  },
  {
    id: 'bsms-noi',
    code: 'BSMS-NOI',
    title: 'Noi Naadal (Siddha Diagnosis)',
    year: 2, semester: 4,
    clinicalHours: 40,
    lessons: [
      { id: 'bsms-noi-01', title: 'Naadi diagnosis (pulse)', duration: '60 min', type: 'clinical', keyPoints: ['Three pulses', 'Interpretation'] },
      { id: 'bsms-noi-02', title: 'Mutrapariksha (urine analysis)', duration: '60 min', type: 'practical', keyPoints: ['Neerkuri', 'Neikuri'] },
      { id: 'bsms-noi-03', title: 'Vizhipariksha (eye examination)', duration: '45 min', type: 'clinical', keyPoints: ['Signs in eye', 'Correlation with Tridosha'] },
      { id: 'bsms-noi-04', title: '96 Thathuvas', duration: '45 min', type: 'lecture', keyPoints: ['Basic principles', 'Physical and mental faculties'] }
    ]
  },
  {
    id: 'bsms-varmam',
    code: 'BSMS-VARMAM',
    title: 'Varmam (Vital Points Therapy)',
    year: 3, semester: 5,
    clinicalHours: 60,
    lessons: [
      { id: 'bsms-varmam-01', title: '108 Varmapoints', duration: '45 min', type: 'lecture', keyPoints: ['Locations', 'Functions'] },
      { id: 'bsms-varmam-02', title: 'Therapeutic manipulation', duration: '60 min', type: 'practical', keyPoints: ['Techniques', 'Precautions'] },
      { id: 'bsms-varmam-03', title: 'Thodu Varmam and Padu Varmam', duration: '60 min', type: 'clinical', keyPoints: ['Touch therapy', 'Trauma management'] }
    ]
  },
  {
    id: 'bsms-clnsi',
    code: 'BSMS-CLNSI',
    title: 'Clinical Siddha Practice & Internship',
    year: 4, semester: 7,
    clinicalHours: 150,
    lessons: [
      { id: 'bsms-clnsi-01', title: 'Siddha management of chronic diseases', duration: '60 min', type: 'clinical', keyPoints: ['Psoriasis', 'Arthritis', 'Diabetes'] },
      { id: 'bsms-clnsi-02', title: 'Research in Siddha medicine', duration: '45 min', type: 'lecture', keyPoints: ['Clinical trials', 'Documentation'] },
      { id: 'bsms-clnsi-03', title: 'Community Siddha health camps', duration: '120 min', type: 'clinical', keyPoints: ['Public health', 'Awareness'] }
    ]
  }
];

export default BSMS_CURRICULUM;
