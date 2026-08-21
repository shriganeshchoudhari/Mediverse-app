export const BUMS_METADATA = {
  programCode: 'BUMS',
  programName: 'Bachelor of Unani Medicine & Surgery',
  regulatoryBody: 'CCIM (Central Council of Indian Medicine — Unani)',
  duration: '5.5 years (5 years + 1 year internship)',
  domain: 'AYUSH',
  description: 'CCIM-regulated undergraduate program in Unani Medicine teaching classical Tibb-e-Unani principles, Ilmul Advia, Moalejat, and surgical practice.'
};

export interface BUMSLesson {
  id: string;
  title: string;
  duration: string;
  type: 'lecture' | 'practical' | 'clinical';
  keyPoints: string[];
}

export interface BUMSSubject {
  id: string;
  code: string;
  title: string;
  year: number;
  semester: number;
  lessons: BUMSLesson[];
  clinicalHours: number;
}

export const BUMS_CURRICULUM: BUMSSubject[] = [
  {
    id: 'bums-kull',
    code: 'BUMS-KULL',
    title: 'Kulliyat-e-Tibb (Unani Principles)',
    year: 1, semester: 1,
    clinicalHours: 0,
    lessons: [
      { id: 'bums-kull-01', title: 'Temperament (Mizaj)', duration: '45 min', type: 'lecture', keyPoints: ['Concept of Mizaj', 'Types of Mizaj', 'Assessment of Mizaj'] },
      { id: 'bums-kull-02', title: 'Humors (Akhlat)', duration: '45 min', type: 'lecture', keyPoints: ['Theory of Humors', 'Four Humors', 'Role of Akhlat'] },
      { id: 'bums-kull-03', title: 'Elements (Arkan)', duration: '45 min', type: 'lecture', keyPoints: ['Four Elements', 'Qualities of Elements'] },
      { id: 'bums-kull-04', title: 'Faculties (Quwa)', duration: '45 min', type: 'lecture', keyPoints: ['Quwa Tabiya', 'Quwa Nafsaniya', 'Quwa Haiwaniya'] }
    ]
  },
  {
    id: 'bums-mufr',
    code: 'BUMS-MUFR',
    title: 'Ilmul Mufradat (Unani Materia Medica)',
    year: 1, semester: 2,
    clinicalHours: 10,
    lessons: [
      { id: 'bums-mufr-01', title: 'Herbal Drugs', duration: '45 min', type: 'lecture', keyPoints: ['Classification of herbal drugs', 'Properties', 'Actions'] },
      { id: 'bums-mufr-02', title: 'Mineral Drugs', duration: '45 min', type: 'lecture', keyPoints: ['Types of mineral drugs', 'Purification methods'] },
      { id: 'bums-mufr-03', title: 'Animal-origin Medicines', duration: '45 min', type: 'lecture', keyPoints: ['Common animal drugs', 'Uses in Unani'] },
      { id: 'bums-mufr-04', title: 'Drug Quality Standards', duration: '45 min', type: 'practical', keyPoints: ['Adulteration', 'Quality testing', 'Standardization'] }
    ]
  },
  {
    id: 'bums-moal',
    code: 'BUMS-MOAL',
    title: 'Moalejat (Medicine & Treatment)',
    year: 2, semester: 3,
    clinicalHours: 50,
    lessons: [
      { id: 'bums-moal-01', title: 'Temperamental Treatment (Ilaj bil Tadbir)', duration: '60 min', type: 'clinical', keyPoints: ['Regimenal therapy', 'Lifestyle modification'] },
      { id: 'bums-moal-02', title: 'Drug Therapy (Ilaj bil Dawa)', duration: '60 min', type: 'clinical', keyPoints: ['Pharmacotherapy principles', 'Prescription writing'] },
      { id: 'bums-moal-03', title: 'Dietotherapy', duration: '45 min', type: 'lecture', keyPoints: ['Diet in different diseases', 'Therapeutic diets'] },
      { id: 'bums-moal-04', title: 'Regimenal Therapy', duration: '60 min', type: 'clinical', keyPoints: ['Massage', 'Exercise', 'Bath'] }
    ]
  },
  {
    id: 'bums-jarah',
    code: 'BUMS-JARAH',
    title: 'Ilmul Jarahat (Unani Surgery)',
    year: 3, semester: 5,
    clinicalHours: 60,
    lessons: [
      { id: 'bums-jarah-01', title: 'Cupping (Hijama)', duration: '60 min', type: 'practical', keyPoints: ['Indications', 'Contraindications', 'Procedure'] },
      { id: 'bums-jarah-02', title: 'Cauterization (Kai)', duration: '45 min', type: 'clinical', keyPoints: ['Types of Kai', 'Methods'] },
      { id: 'bums-jarah-03', title: 'Wound Care', duration: '60 min', type: 'clinical', keyPoints: ['Dressing', 'Healing process', 'Ulcers'] }
    ]
  },
  {
    id: 'bums-atfal',
    code: 'BUMS-ATFAL',
    title: 'Ilmul Atfal (Paediatrics) & Qabalat (Obstetrics)',
    year: 3, semester: 6,
    clinicalHours: 50,
    lessons: [
      { id: 'bums-atfal-01', title: 'Neonatal Care', duration: '45 min', type: 'clinical', keyPoints: ['Immediate care', 'Feeding', 'Common issues'] },
      { id: 'bums-atfal-02', title: 'Child Temperament Assessment', duration: '45 min', type: 'clinical', keyPoints: ['Mizaj of children', 'Growth and development'] },
      { id: 'bums-atfal-03', title: 'Obstetric Care', duration: '60 min', type: 'clinical', keyPoints: ['Antenatal care', 'Delivery', 'Postnatal care'] }
    ]
  },
  {
    id: 'bums-usool',
    code: 'BUMS-USOOL',
    title: 'Usool-e-Tib & Clinical Practice',
    year: 4, semester: 7,
    clinicalHours: 100,
    lessons: [
      { id: 'bums-usool-01', title: 'Case-taking', duration: '60 min', type: 'clinical', keyPoints: ['History taking', 'Examination'] },
      { id: 'bums-usool-02', title: 'Pulse Diagnosis (Nabz)', duration: '60 min', type: 'clinical', keyPoints: ['Technique', 'Interpretation of Nabz'] },
      { id: 'bums-usool-03', title: 'Clinical Management Protocols', duration: '60 min', type: 'clinical', keyPoints: ['Treatment plans', 'Follow-up'] }
    ]
  }
];

export default BUMS_CURRICULUM;
