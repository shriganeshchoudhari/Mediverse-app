export interface BVSCLesson {
  id: string;
  title: string;
  vciCode: string;
  year: 1 | 2 | 3 | 4 | 5;
  hasSimulation: boolean;
  isHighTech: boolean;
  description: string;
}

export interface BVSCSubject {
  id: string;
  name: string;
  code: string;
  year: 1 | 2 | 3 | 4 | 5;
  creditHours: number;
  description: string;
  lessons: BVSCLesson[];
}

export interface BVSCYear {
  year: 1 | 2 | 3 | 4 | 5;
  title: string;
  subjects: BVSCSubject[];
}

export const BVSC_METADATA = {
  programName: 'Bachelor of Veterinary Science & Animal Husbandry',
  regulatoryBody: 'VCI (Veterinary Council of India)',
  duration: '5.5 years'
};

export const BVSC_CURRICULUM: BVSCYear[] = [
  {
    year: 1,
    title: 'First Professional Year',
    subjects: [
      {
        id: 'vet-van',
        name: 'Veterinary Anatomy & Histology',
        code: 'VET-VAN',
        year: 1,
        creditHours: 4,
        description: 'Gross anatomy, histology, and embryology of domestic animals.',
        lessons: [
          { id: 'van-1', title: 'Osteology of Forelimb', vciCode: 'VAN-101', year: 1, hasSimulation: true, isHighTech: true, description: '3D exploration of forelimb bones.' },
          { id: 'van-2', title: 'Digestive System Histology', vciCode: 'VAN-102', year: 1, hasSimulation: true, isHighTech: false, description: 'Microscopic structure of the GI tract.' },
          { id: 'van-3', title: 'Comparative Splanchnology', vciCode: 'VAN-103', year: 1, hasSimulation: false, isHighTech: false, description: 'Visceral organs across species.' }
        ]
      },
      {
        id: 'vet-vpy',
        name: 'Veterinary Physiology & Biochemistry',
        code: 'VET-VPY',
        year: 1,
        creditHours: 4,
        description: 'Functions of animal body systems and metabolic pathways.',
        lessons: [
          { id: 'vpy-1', title: 'Ruminant Digestion', vciCode: 'VPY-101', year: 1, hasSimulation: true, isHighTech: true, description: 'Simulation of rumen fermentation.' },
          { id: 'vpy-2', title: 'Cardiovascular Dynamics', vciCode: 'VPY-102', year: 1, hasSimulation: true, isHighTech: true, description: 'Cardiac output and blood pressure regulation.' },
          { id: 'vpy-3', title: 'Carbohydrate Metabolism', vciCode: 'VPY-103', year: 1, hasSimulation: false, isHighTech: false, description: 'Glycolysis and TCA cycle in animals.' }
        ]
      },
      {
        id: 'vet-lpm',
        name: 'Livestock Production Management',
        code: 'VET-LPM',
        year: 1,
        creditHours: 3,
        description: 'Breeds, housing, and management practices for livestock.',
        lessons: [
          { id: 'lpm-1', title: 'Dairy Cattle Housing', vciCode: 'LPM-101', year: 1, hasSimulation: true, isHighTech: false, description: 'Design and management of dairy barns.' },
          { id: 'lpm-2', title: 'Poultry Management', vciCode: 'LPM-102', year: 1, hasSimulation: false, isHighTech: false, description: 'Broiler and layer management practices.' },
          { id: 'lpm-3', title: 'Swine Husbandry', vciCode: 'LPM-103', year: 1, hasSimulation: false, isHighTech: false, description: 'Breeding and rearing of pigs.' }
        ]
      }
    ]
  },
  {
    year: 2,
    title: 'Second Professional Year',
    subjects: [
      {
        id: 'vet-vpa',
        name: 'Veterinary Pathology',
        code: 'VET-VPA',
        year: 2,
        creditHours: 4,
        description: 'General and systemic pathology of animal diseases.',
        lessons: [
          { id: 'vpa-1', title: 'Inflammation & Repair', vciCode: 'VPA-201', year: 2, hasSimulation: false, isHighTech: false, description: 'Cellular and vascular events in inflammation.' },
          { id: 'vpa-2', title: 'Neoplasia', vciCode: 'VPA-202', year: 2, hasSimulation: true, isHighTech: false, description: 'Characteristics of benign and malignant tumors.' },
          { id: 'vpa-3', title: 'Respiratory System Pathology', vciCode: 'VPA-203', year: 2, hasSimulation: true, isHighTech: true, description: 'Pathology of pneumonia and related disorders.' }
        ]
      },
      {
        id: 'vet-vmc',
        name: 'Veterinary Microbiology',
        code: 'VET-VMC',
        year: 2,
        creditHours: 3,
        description: 'Study of bacteria, viruses, and fungi causing animal diseases.',
        lessons: [
          { id: 'vmc-1', title: 'Bacterial Genetics', vciCode: 'VMC-201', year: 2, hasSimulation: false, isHighTech: false, description: 'Gene transfer mechanisms in bacteria.' },
          { id: 'vmc-2', title: 'Viral Pathogenesis', vciCode: 'VMC-202', year: 2, hasSimulation: true, isHighTech: true, description: 'Mechanisms of viral entry and replication.' },
          { id: 'vmc-3', title: 'Mycology & Mycotoxins', vciCode: 'VMC-203', year: 2, hasSimulation: false, isHighTech: false, description: 'Fungal diseases and their impact.' }
        ]
      },
      {
        id: 'vet-vpr',
        name: 'Veterinary Parasitology',
        code: 'VET-VPR',
        year: 2,
        creditHours: 3,
        description: 'Helminths, arthropods, and protozoa affecting animals.',
        lessons: [
          { id: 'vpr-1', title: 'Nematode Life Cycles', vciCode: 'VPR-201', year: 2, hasSimulation: true, isHighTech: false, description: 'Interactive life cycles of major nematodes.' },
          { id: 'vpr-2', title: 'Tick-Borne Diseases', vciCode: 'VPR-202', year: 2, hasSimulation: true, isHighTech: true, description: 'Transmission dynamics of tick-borne pathogens.' },
          { id: 'vpr-3', title: 'Protozoan Infections', vciCode: 'VPR-203', year: 2, hasSimulation: false, isHighTech: false, description: 'Babesia, Theileria, and Trypanosoma.' }
        ]
      }
    ]
  },
  {
    year: 3,
    title: 'Third Professional Year',
    subjects: [
      {
        id: 'vet-vpt',
        name: 'Veterinary Pharmacology & Toxicology',
        code: 'VET-VPT',
        year: 3,
        creditHours: 4,
        description: 'Drugs, their actions, uses, and toxic effects in animals.',
        lessons: [
          { id: 'vpt-1', title: 'Pharmacokinetics', vciCode: 'VPT-301', year: 3, hasSimulation: true, isHighTech: true, description: 'Drug absorption, distribution, metabolism, excretion.' },
          { id: 'vpt-2', title: 'Antibiotic Resistance', vciCode: 'VPT-302', year: 3, hasSimulation: true, isHighTech: false, description: 'Mechanisms and management of AMR.' },
          { id: 'vpt-3', title: 'Plant Toxicity', vciCode: 'VPT-303', year: 3, hasSimulation: false, isHighTech: false, description: 'Common poisonous plants and their toxins.' }
        ]
      },
      {
        id: 'vet-ann',
        name: 'Animal Nutrition',
        code: 'VET-ANN',
        year: 3,
        creditHours: 3,
        description: 'Nutrient requirements and feed formulation.',
        lessons: [
          { id: 'ann-1', title: 'Ration Formulation', vciCode: 'ANN-301', year: 3, hasSimulation: true, isHighTech: true, description: 'Software-based feed formulation for dairy cows.' },
          { id: 'ann-2', title: 'Mineral & Vitamin Deficiencies', vciCode: 'ANN-302', year: 3, hasSimulation: false, isHighTech: false, description: 'Clinical signs and correction of deficiencies.' },
          { id: 'ann-3', title: 'Feed Evaluation', vciCode: 'ANN-303', year: 3, hasSimulation: true, isHighTech: false, description: 'Proximate analysis and digestibility trials.' }
        ]
      },
      {
        id: 'vet-vgo',
        name: 'Veterinary Gynaecology & Obstetrics',
        code: 'VET-VGO',
        year: 3,
        creditHours: 3,
        description: 'Animal reproduction, pregnancy, and obstetrical emergencies.',
        lessons: [
          { id: 'vgo-1', title: 'Estrous Cycle Regulation', vciCode: 'VGO-301', year: 3, hasSimulation: true, isHighTech: true, description: 'Hormonal control of estrus in cattle.' },
          { id: 'vgo-2', title: 'Dystocia Management', vciCode: 'VGO-302', year: 3, hasSimulation: true, isHighTech: true, description: 'Simulation of obstetrical maneuvers.' },
          { id: 'vgo-3', title: 'Artificial Insemination', vciCode: 'VGO-303', year: 3, hasSimulation: false, isHighTech: false, description: 'Techniques and semen handling.' }
        ]
      }
    ]
  },
  {
    year: 4,
    title: 'Fourth Professional Year',
    subjects: [
      {
        id: 'vet-vcm',
        name: 'Veterinary Clinical Medicine',
        code: 'VET-VCM',
        year: 4,
        creditHours: 4,
        description: 'Diagnosis and treatment of internal and systemic diseases.',
        lessons: [
          { id: 'vcm-1', title: 'Metabolic Diseases of Cattle', vciCode: 'VCM-401', year: 4, hasSimulation: true, isHighTech: true, description: 'Milk fever and ketosis diagnosis.' },
          { id: 'vcm-2', title: 'Canine Cardiology', vciCode: 'VCM-402', year: 4, hasSimulation: true, isHighTech: true, description: 'ECG interpretation and heart failure management.' },
          { id: 'vcm-3', title: 'Equine Colic', vciCode: 'VCM-403', year: 4, hasSimulation: true, isHighTech: false, description: 'Medical management of colic.' }
        ]
      },
      {
        id: 'vet-vsr',
        name: 'Veterinary Surgery & Radiology',
        code: 'VET-VSR',
        year: 4,
        creditHours: 4,
        description: 'Surgical principles, orthopedics, and diagnostic imaging.',
        lessons: [
          { id: 'vsr-1', title: 'Principles of Anesthesia', vciCode: 'VSR-401', year: 4, hasSimulation: true, isHighTech: true, description: 'Anesthetic machine setup and monitoring.' },
          { id: 'vsr-2', title: 'Fracture Repair', vciCode: 'VSR-402', year: 4, hasSimulation: true, isHighTech: true, description: 'Internal and external fixation techniques.' },
          { id: 'vsr-3', title: 'Radiographic Interpretation', vciCode: 'VSR-403', year: 4, hasSimulation: true, isHighTech: false, description: 'Reading X-rays and ultrasound.' }
        ]
      },
      {
        id: 'vet-vah',
        name: 'Veterinary Public Health & One Health',
        code: 'VET-VAH',
        year: 4,
        creditHours: 3,
        description: 'Zoonoses, food safety, and environmental health.',
        lessons: [
          { id: 'vah-1', title: 'Rabies Control', vciCode: 'VAH-401', year: 4, hasSimulation: false, isHighTech: false, description: 'Epidemiology and prevention of rabies.' },
          { id: 'vah-2', title: 'Meat Inspection', vciCode: 'VAH-402', year: 4, hasSimulation: true, isHighTech: false, description: 'Ante-mortem and post-mortem examination.' },
          { id: 'vah-3', title: 'One Health Outbreak', vciCode: 'VAH-403', year: 4, hasSimulation: true, isHighTech: true, description: 'Investigating a zoonotic spillover event.' }
        ]
      }
    ]
  },
  {
    year: 5,
    title: 'Fifth Professional Year',
    subjects: [
      {
        id: 'vet-intern',
        name: 'Clinical Practice & Rotatory Internship',
        code: 'VET-INTERN',
        year: 5,
        creditHours: 12,
        description: 'Hands-on clinical training across various specialties.',
        lessons: [
          { id: 'intern-1', title: 'Small Animal Clinics', vciCode: 'INT-501', year: 5, hasSimulation: true, isHighTech: true, description: 'Outpatient case management.' },
          { id: 'intern-2', title: 'Large Animal Clinics', vciCode: 'INT-502', year: 5, hasSimulation: true, isHighTech: false, description: 'Farm animal medicine and surgery.' },
          { id: 'intern-3', title: 'Diagnostic Laboratory', vciCode: 'INT-503', year: 5, hasSimulation: true, isHighTech: false, description: 'Clinical pathology and microbiology diagnostics.' }
        ]
      }
    ]
  }
];

export function getBVSCSubjectById(id: string): BVSCSubject | undefined {
  for (const year of BVSC_CURRICULUM) {
    const subject = year.subjects.find((s) => s.id === id);
    if (subject) return subject;
  }
  return undefined;
}
