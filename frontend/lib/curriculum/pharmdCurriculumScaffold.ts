export interface PharmDLesson {
  id: string;
  title: string;
  pciCode: string;
  year: 1 | 2 | 3 | 4 | 5 | 6;
  hasSimulation: boolean;
  isClinical: boolean;
  description: string;
}

export interface PharmDSubject {
  id: string;
  name: string;
  code: string;
  year: number;
  creditHours: number;
  description: string;
  lessons: PharmDLesson[];
}

export interface PharmDYear {
  year: number;
  title: string;
  description: string;
  subjects: PharmDSubject[];
}

export const PHARMD_CURRICULUM: PharmDYear[] = [
  {
    year: 1,
    title: 'Year 1: Foundational Sciences',
    description: 'Foundations of anatomy, physiology, and basic pharmacy.',
    subjects: [
      {
        id: 'p101',
        name: 'Human Anatomy & Physiology',
        code: 'HAP-1',
        year: 1,
        creditHours: 4,
        description: 'Study of human body systems.',
        lessons: [
          { id: 'l1', title: 'Cardiovascular System', pciCode: '1.1', year: 1, hasSimulation: true, isClinical: false, description: 'Heart structure and function.' },
          { id: 'l2', title: 'Nervous System', pciCode: '1.2', year: 1, hasSimulation: true, isClinical: false, description: 'CNS and PNS.' },
          { id: 'l3', title: 'Digestive System', pciCode: '1.3', year: 1, hasSimulation: false, isClinical: false, description: 'GI tract anatomy.' }
        ]
      },
      {
        id: 'p102',
        name: 'Pharmaceutics',
        code: 'PCEUT-1',
        year: 1,
        creditHours: 4,
        description: 'Introduction to dosage forms.',
        lessons: [
          { id: 'l4', title: 'Solid Dosage Forms', pciCode: '2.1', year: 1, hasSimulation: false, isClinical: false, description: 'Tablets and capsules.' },
          { id: 'l5', title: 'Liquid Dosage Forms', pciCode: '2.2', year: 1, hasSimulation: false, isClinical: false, description: 'Syrups and suspensions.' },
          { id: 'l6', title: 'Semi-solid Dosage Forms', pciCode: '2.3', year: 1, hasSimulation: false, isClinical: false, description: 'Ointments and creams.' }
        ]
      },
      {
        id: 'p103',
        name: 'Medicinal Biochemistry',
        code: 'MBIO-1',
        year: 1,
        creditHours: 4,
        description: 'Biochemical principles.',
        lessons: [
          { id: 'l7', title: 'Carbohydrate Metabolism', pciCode: '3.1', year: 1, hasSimulation: false, isClinical: false, description: 'Glycolysis and TCA.' },
          { id: 'l8', title: 'Lipid Metabolism', pciCode: '3.2', year: 1, hasSimulation: false, isClinical: false, description: 'Fatty acid synthesis.' },
          { id: 'l9', title: 'Protein Metabolism', pciCode: '3.3', year: 1, hasSimulation: false, isClinical: false, description: 'Urea cycle.' }
        ]
      }
    ]
  },
  {
    year: 2,
    title: 'Year 2: Pharmacological Basics',
    description: 'Introduction to drugs and microbiology.',
    subjects: [
      {
        id: 'p201',
        name: 'Pharmacology-I',
        code: 'PCOL-1',
        year: 2,
        creditHours: 4,
        description: 'Basic pharmacological principles.',
        lessons: [
          { id: 'l10', title: 'Pharmacokinetics', pciCode: '2.1.1', year: 2, hasSimulation: true, isClinical: false, description: 'ADME.' },
          { id: 'l11', title: 'Pharmacodynamics', pciCode: '2.1.2', year: 2, hasSimulation: true, isClinical: false, description: 'Receptors.' },
          { id: 'l12', title: 'ANS Pharmacology', pciCode: '2.1.3', year: 2, hasSimulation: true, isClinical: false, description: 'Adrenergic and cholinergic drugs.' }
        ]
      },
      {
        id: 'p202',
        name: 'Pharmaceutical Microbiology',
        code: 'PMICRO-1',
        year: 2,
        creditHours: 4,
        description: 'Study of microbes.',
        lessons: [
          { id: 'l13', title: 'Bacteriology', pciCode: '2.2.1', year: 2, hasSimulation: false, isClinical: false, description: 'Bacteria structure.' },
          { id: 'l14', title: 'Sterilization', pciCode: '2.2.2', year: 2, hasSimulation: true, isClinical: false, description: 'Autoclaving.' },
          { id: 'l15', title: 'Immunology Basics', pciCode: '2.2.3', year: 2, hasSimulation: false, isClinical: false, description: 'Antigens and antibodies.' }
        ]
      },
      {
        id: 'p203',
        name: 'Pharmaceutical Organic & Medicinal Chemistry',
        code: 'POC-1',
        year: 2,
        creditHours: 4,
        description: 'Chemistry of drugs.',
        lessons: [
          { id: 'l16', title: 'Aliphatic Compounds', pciCode: '2.3.1', year: 2, hasSimulation: false, isClinical: false, description: 'Alkanes and alkenes.' },
          { id: 'l17', title: 'Aromatic Compounds', pciCode: '2.3.2', year: 2, hasSimulation: false, isClinical: false, description: 'Benzene derivatives.' },
          { id: 'l18', title: 'Heterocyclic Compounds', pciCode: '2.3.3', year: 2, hasSimulation: false, isClinical: false, description: 'Pyridine and pyrrole.' }
        ]
      }
    ]
  },
  {
    year: 3,
    title: 'Year 3: Advanced Pharmacology & Therapeutics',
    description: 'Advanced pharmacology, analysis and therapeutics.',
    subjects: [
      {
        id: 'p301',
        name: 'Pharmacology-II',
        code: 'PCOL-2',
        year: 3,
        creditHours: 4,
        description: 'Systemic pharmacology.',
        lessons: [
          { id: 'l19', title: 'CVS Pharmacology', pciCode: '3.1.1', year: 3, hasSimulation: true, isClinical: true, description: 'Anti-hypertensives.' },
          { id: 'l20', title: 'CNS Pharmacology', pciCode: '3.1.2', year: 3, hasSimulation: true, isClinical: true, description: 'Anti-epileptics.' },
          { id: 'l21', title: 'Endocrine Pharmacology', pciCode: '3.1.3', year: 3, hasSimulation: true, isClinical: true, description: 'Diabetes management.' }
        ]
      },
      {
        id: 'p302',
        name: 'Pharmaceutical Analysis',
        code: 'PANA-1',
        year: 3,
        creditHours: 4,
        description: 'Analytical techniques.',
        lessons: [
          { id: 'l22', title: 'Titrimetric Analysis', pciCode: '3.2.1', year: 3, hasSimulation: true, isClinical: false, description: 'Acid-base titrations.' },
          { id: 'l23', title: 'Spectroscopy', pciCode: '3.2.2', year: 3, hasSimulation: true, isClinical: false, description: 'UV-Vis spectroscopy.' },
          { id: 'l24', title: 'Chromatography', pciCode: '3.2.3', year: 3, hasSimulation: true, isClinical: false, description: 'HPLC and GC.' }
        ]
      },
      {
        id: 'p303',
        name: 'Pharmacotherapeutics-I',
        code: 'PTH-1',
        year: 3,
        creditHours: 4,
        description: 'Therapeutics of systemic diseases.',
        lessons: [
          { id: 'l25', title: 'Cardiovascular Diseases', pciCode: '3.3.1', year: 3, hasSimulation: true, isClinical: true, description: 'Heart failure management.' },
          { id: 'l26', title: 'Respiratory Diseases', pciCode: '3.3.2', year: 3, hasSimulation: true, isClinical: true, description: 'Asthma and COPD.' },
          { id: 'l27', title: 'Gastrointestinal Diseases', pciCode: '3.3.3', year: 3, hasSimulation: true, isClinical: true, description: 'PUD management.' }
        ]
      }
    ]
  },
  {
    year: 4,
    title: 'Year 4: Clinical & Advanced Therapeutics',
    description: 'Clinical pharmacy and biopharmaceutics.',
    subjects: [
      {
        id: 'p401',
        name: 'Pharmacotherapeutics-II',
        code: 'PTH-2',
        year: 4,
        creditHours: 4,
        description: 'Therapeutics of advanced diseases.',
        lessons: [
          { id: 'l28', title: 'Infectious Diseases', pciCode: '4.1.1', year: 4, hasSimulation: true, isClinical: true, description: 'Antibiotic therapy.' },
          { id: 'l29', title: 'Oncology', pciCode: '4.1.2', year: 4, hasSimulation: true, isClinical: true, description: 'Chemotherapy.' },
          { id: 'l30', title: 'Neurological Disorders', pciCode: '4.1.3', year: 4, hasSimulation: true, isClinical: true, description: 'Parkinson’s disease.' }
        ]
      },
      {
        id: 'p402',
        name: 'Clinical Pharmacy',
        code: 'CPH-1',
        year: 4,
        creditHours: 4,
        description: 'Practice of clinical pharmacy.',
        lessons: [
          { id: 'l31', title: 'Patient Counseling', pciCode: '4.2.1', year: 4, hasSimulation: true, isClinical: true, description: 'Counseling skills.' },
          { id: 'l32', title: 'Medication History', pciCode: '4.2.2', year: 4, hasSimulation: true, isClinical: true, description: 'Taking medication history.' },
          { id: 'l33', title: 'Ward Round Participation', pciCode: '4.2.3', year: 4, hasSimulation: true, isClinical: true, description: 'Clinical rounds.' }
        ]
      },
      {
        id: 'p403',
        name: 'Biopharmaceutics & Pharmacokinetics',
        code: 'BPK-1',
        year: 4,
        creditHours: 4,
        description: 'Drug absorption and kinetics.',
        lessons: [
          { id: 'l34', title: 'Drug Absorption', pciCode: '4.3.1', year: 4, hasSimulation: true, isClinical: false, description: 'Mechanisms of absorption.' },
          { id: 'l35', title: 'Compartment Models', pciCode: '4.3.2', year: 4, hasSimulation: true, isClinical: false, description: 'One and two compartment models.' },
          { id: 'l36', title: 'Bioavailability', pciCode: '4.3.3', year: 4, hasSimulation: true, isClinical: false, description: 'Bioequivalence studies.' }
        ]
      }
    ]
  },
  {
    year: 5,
    title: 'Year 5: Applied Clinical Sciences',
    description: 'Clinical pharmacokinetics, research, and hospital pharmacy.',
    subjects: [
      {
        id: 'p501',
        name: 'Clinical Pharmacokinetics & TDM',
        code: 'CPK-1',
        year: 5,
        creditHours: 4,
        description: 'Therapeutic drug monitoring.',
        lessons: [
          { id: 'l37', title: 'TDM Basics', pciCode: '5.1.1', year: 5, hasSimulation: true, isClinical: true, description: 'Principles of TDM.' },
          { id: 'l38', title: 'Phenytoin TDM', pciCode: '5.1.2', year: 5, hasSimulation: true, isClinical: true, description: 'Monitoring phenytoin.' },
          { id: 'l39', title: 'Digoxin TDM', pciCode: '5.1.3', year: 5, hasSimulation: true, isClinical: true, description: 'Monitoring digoxin.' }
        ]
      },
      {
        id: 'p502',
        name: 'Clinical Research & Pharmacovigilance',
        code: 'CRP-1',
        year: 5,
        creditHours: 4,
        description: 'Clinical trials and drug safety.',
        lessons: [
          { id: 'l40', title: 'Clinical Trials', pciCode: '5.2.1', year: 5, hasSimulation: true, isClinical: true, description: 'Phases of clinical trials.' },
          { id: 'l41', title: 'ADR Monitoring', pciCode: '5.2.2', year: 5, hasSimulation: true, isClinical: true, description: 'Adverse drug reactions.' },
          { id: 'l42', title: 'Pharmacovigilance Methods', pciCode: '5.2.3', year: 5, hasSimulation: true, isClinical: true, description: 'Signal detection.' }
        ]
      },
      {
        id: 'p503',
        name: 'Hospital Pharmacy',
        code: 'HP-1',
        year: 5,
        creditHours: 4,
        description: 'Operations of a hospital pharmacy.',
        lessons: [
          { id: 'l43', title: 'Pharmacy Layout', pciCode: '5.3.1', year: 5, hasSimulation: false, isClinical: true, description: 'Design of hospital pharmacy.' },
          { id: 'l44', title: 'Inventory Control', pciCode: '5.3.2', year: 5, hasSimulation: false, isClinical: false, description: 'Managing drug inventory.' },
          { id: 'l45', title: 'Sterile Preparations', pciCode: '5.3.3', year: 5, hasSimulation: true, isClinical: true, description: 'IV admixtures.' }
        ]
      }
    ]
  },
  {
    year: 6,
    title: 'Year 6: Internship / Clerkship',
    description: 'Hospital rotations across major specialties.',
    subjects: [
      {
        id: 'p601',
        name: 'Clinical Clerkship & Hospital Rotations',
        code: 'CLK-1',
        year: 6,
        creditHours: 20,
        description: 'Practical hospital rotations.',
        lessons: [
          { id: 'l46', title: 'Internal Medicine', pciCode: '6.1.1', year: 6, hasSimulation: true, isClinical: true, description: 'Internal medicine rotation.' },
          { id: 'l47', title: 'Pediatrics', pciCode: '6.1.2', year: 6, hasSimulation: true, isClinical: true, description: 'Pediatric rotation.' },
          { id: 'l48', title: 'Critical Care', pciCode: '6.1.3', year: 6, hasSimulation: true, isClinical: true, description: 'ICU rotation.' },
          { id: 'l49', title: 'Surgery', pciCode: '6.1.4', year: 6, hasSimulation: true, isClinical: true, description: 'Surgery rotation.' }
        ]
      }
    ]
  }
];

export const PHARMD_METADATA = {
  programName: 'Doctor of Pharmacy',
  abbreviation: 'Pharm.D',
  duration: '6 Years',
  regulatoryBody: 'PCI (Pharmacy Council of India)',
  totalYears: 6
};

export function getPharmDSubjectById(id: string): PharmDSubject | undefined {
  for (const year of PHARMD_CURRICULUM) {
    for (const subject of year.subjects) {
      if (subject.id === id) return subject;
    }
  }
  return undefined;
}
