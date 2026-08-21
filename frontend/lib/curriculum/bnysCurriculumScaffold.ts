// BNYS Curriculum Scaffold — CCYN-regulated 5.5-year program
export const BNYS_METADATA = {
  programCode: 'BNYS',
  programName: 'Bachelor of Naturopathy & Yogic Sciences',
  regulatoryBody: 'CCYN (Central Council of Indian Medicine — Naturopathy)',
  duration: '5.5 years (5 years + 1 year internship)',
  domain: 'AYUSH',
  description: 'CCYN-regulated undergraduate program in Naturopathy and Yogic Sciences covering anatomy, naturopathic diagnostics, yoga therapy, diet therapy, hydrotherapy, and clinical practice.'
};

export interface BNYSLesson {
  id: string;
  title: string;
  duration: string;
  type: 'lecture' | 'practical' | 'clinical';
  keyPoints: string[];
}

export interface BNYSSubject {
  id: string;
  code: string;
  title: string;
  year: number;
  semester: number;
  lessons: BNYSLesson[];
  clinicalHours: number;
}

export const BNYS_CURRICULUM: BNYSSubject[] = [
  {
    id: 'bnys-anat',
    code: 'BNYS-ANAT',
    title: 'Anatomy, Physiology & Biochemistry for Naturopathy',
    year: 1, semester: 1,
    clinicalHours: 0,
    lessons: [
      { id: 'bnys-anat-01', title: 'Cell Structure & Histology', duration: '45 min', type: 'lecture', keyPoints: ['Cell organelles', 'Tissue types', 'Epithelia classification'] },
      { id: 'bnys-anat-02', title: 'Musculoskeletal Anatomy for Yoga', duration: '60 min', type: 'practical', keyPoints: ['Major muscle groups', 'Joint anatomy', 'Fascia and connective tissue'] },
      { id: 'bnys-anat-03', title: 'Autonomic Nervous System & Prana', duration: '45 min', type: 'lecture', keyPoints: ['Sympathetic vs parasympathetic', 'Vagal tone', 'ANS-pranic energy correlation'] },
      { id: 'bnys-anat-04', title: 'Biochemistry: Enzymes, Vitamins & Minerals', duration: '45 min', type: 'lecture', keyPoints: ['Enzyme kinetics', 'Fat-soluble vitamins', 'Mineral cofactors in naturopathic nutrition'] }
    ]
  },
  {
    id: 'bnys-natpath',
    code: 'BNYS-NATPATH',
    title: 'Naturopathic Diagnostics & Case Taking',
    year: 1, semester: 2,
    clinicalHours: 20,
    lessons: [
      { id: 'bnys-natpath-01', title: 'Iridology — Iris Diagnosis Principles', duration: '45 min', type: 'clinical', keyPoints: ['Iris zones', 'Constitutional assessment', 'Scurf rim and drug ring'] },
      { id: 'bnys-natpath-02', title: 'Tongue, Nail & Skin Diagnosis', duration: '45 min', type: 'clinical', keyPoints: ['Tongue coating patterns', 'Nail clubbing and spooning', 'Skin texture and color signs'] },
      { id: 'bnys-natpath-03', title: 'Vitality Assessment & Case Taking Format', duration: '60 min', type: 'clinical', keyPoints: ['Hering\'s Law of Cure', 'SOAP format naturopathic case note', 'Vitality scale 1–10'] }
    ]
  },
  {
    id: 'bnys-yoga',
    code: 'BNYS-YOGA',
    title: 'Yoga Therapy & Pranayama',
    year: 2, semester: 3,
    clinicalHours: 60,
    lessons: [
      { id: 'bnys-yoga-01', title: 'Ashtanga Yoga Foundation: Yama, Niyama, Asana', duration: '45 min', type: 'lecture', keyPoints: ['Patanjali Yoga Sutra foundations', '8 limbs of yoga', 'Therapeutic asana selection'] },
      { id: 'bnys-yoga-02', title: 'Pranayama Techniques: Nadi Shodhana, Kapalabhati, Bhramari', duration: '60 min', type: 'practical', keyPoints: ['Autonomic effects of pranayama', 'HRV improvement', 'Contraindications'] },
      { id: 'bnys-yoga-03', title: 'Yoga Therapy for Lifestyle Diseases (DM, HTN, PCOS)', duration: '60 min', type: 'clinical', keyPoints: ['Yoga protocol for Type 2 DM', 'BP-lowering asanas', 'Hormone-balancing sequences'] },
      { id: 'bnys-yoga-04', title: 'Meditation & Mind-Body Medicine', duration: '45 min', type: 'practical', keyPoints: ['MBSR protocol', 'Yoga nidra', 'Stress-cortisol axis'] }
    ]
  },
  {
    id: 'bnys-diet',
    code: 'BNYS-DIET',
    title: 'Diet Therapy & Clinical Nutrition',
    year: 2, semester: 4,
    clinicalHours: 30,
    lessons: [
      { id: 'bnys-diet-01', title: 'Macronutrient Requirements & Therapeutic Fasting', duration: '45 min', type: 'lecture', keyPoints: ['CHO:Fat:Protein ratios', 'Intermittent fasting protocols', 'Juice fasting detox'] },
      { id: 'bnys-diet-02', title: 'Alkaline-Acid Balance & Raw Food Therapy', duration: '45 min', type: 'lecture', keyPoints: ['Ash residue theory', 'pH of common foods', 'Raw food enzymes'] },
      { id: 'bnys-diet-03', title: 'Disease-Specific Diet Plans (DM, CKD, IBD)', duration: '60 min', type: 'clinical', keyPoints: ['Diabetic meal plan', 'Renal diet potassium restriction', 'FODMAP for IBS'] }
    ]
  },
  {
    id: 'bnys-hydro',
    code: 'BNYS-HYDRO',
    title: 'Hydrotherapy, Mud Therapy & Physical Therapies',
    year: 3, semester: 5,
    clinicalHours: 60,
    lessons: [
      { id: 'bnys-hydro-01', title: 'Hydrotherapy Principles: Thermal, Mechanical & Chemical Effects', duration: '45 min', type: 'lecture', keyPoints: ['Vasodilation vs vasoconstriction', 'Hot vs cold applications', 'Contrast bath technique'] },
      { id: 'bnys-hydro-02', title: 'Mud Therapy: Composition & Therapeutic Applications', duration: '45 min', type: 'practical', keyPoints: ['Mud pack composition', 'Abdominal mud pack for hepatic diseases', 'Eye mud pack technique'] },
      { id: 'bnys-hydro-03', title: 'Chromotherapy, Magneto & Acupressure', duration: '60 min', type: 'practical', keyPoints: ['Color wavelengths', 'Magnetic therapy protocols', 'Acupressure point location'] },
      { id: 'bnys-hydro-04', title: 'Enema Techniques & Colon Hydrotherapy', duration: '45 min', type: 'clinical', keyPoints: ['Retention enema', 'Coffee enema protocol', 'Colon hydrotherapy safety'] }
    ]
  },
  {
    id: 'bnys-cln',
    code: 'BNYS-CLNPRAC',
    title: 'Clinical Naturopathy Practice & Internship',
    year: 4, semester: 7,
    clinicalHours: 200,
    lessons: [
      { id: 'bnys-cln-01', title: 'Naturopathic Management of Musculoskeletal Disorders', duration: '60 min', type: 'clinical', keyPoints: ['Arthritis protocol', 'Backache management', 'Sports injury natural treatment'] },
      { id: 'bnys-cln-02', title: 'Naturopathic Oncology Support Care', duration: '60 min', type: 'clinical', keyPoints: ['Integrative oncology approach', 'Detoxification protocols', 'Nutrition for cancer cachexia'] },
      { id: 'bnys-cln-03', title: 'Research Methodology in Naturopathy (BNYS Dissertation)', duration: '60 min', type: 'lecture', keyPoints: ['RCT design for naturopathic trials', 'CONSORT reporting', 'Ethics in CAM research'] }
    ]
  }
];

export default BNYS_CURRICULUM;
