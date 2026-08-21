export interface BPharmLesson {
  id: string;
  title: string;
  pciCode: string;
  hasSimulation: boolean;
  description: string;
}

export interface BPharmSubject {
  id: string;
  name: string;
  code: string;
  year: number;
  creditHours: number;
  description: string;
  lessons: BPharmLesson[];
}

export interface BPharmYear {
  year: number;
  title: string;
  description: string;
  subjects: BPharmSubject[];
}

export const BPHARM_CURRICULUM: BPharmYear[] = [
  {
    year: 1,
    title: 'Year 1: Basic Sciences',
    description: 'Foundations of pharmacy.',
    subjects: [
      {
        id: 'b101', name: 'Pharmaceutical Chemistry', code: 'BPC-1', year: 1, creditHours: 4, description: 'Inorganic and organic chemistry.',
        lessons: [
          { id: 'bl1', title: 'Acid-Base', pciCode: '1.1', hasSimulation: false, description: 'Acid-base concepts.' },
          { id: 'bl2', title: 'Impurities', pciCode: '1.2', hasSimulation: false, description: 'Impurities in pharmaceuticals.' },
          { id: 'bl3', title: 'Radiopharmaceuticals', pciCode: '1.3', hasSimulation: false, description: 'Radioactive drugs.' }
        ]
      }
    ]
  },
  {
    year: 2,
    title: 'Year 2: Core Pharmacy Subjects',
    description: 'Physical pharmaceutics and basic pharmacology.',
    subjects: [
      {
        id: 'b201', name: 'Physical Pharmaceutics', code: 'BPP-1', year: 2, creditHours: 4, description: 'Physicochemical principles.',
        lessons: [
          { id: 'bl4', title: 'Solubility', pciCode: '2.1', hasSimulation: true, description: 'Solubility of drugs.' },
          { id: 'bl5', title: 'Rheology', pciCode: '2.2', hasSimulation: true, description: 'Flow properties.' },
          { id: 'bl6', title: 'Micromeritics', pciCode: '2.3', hasSimulation: true, description: 'Particle size analysis.' }
        ]
      }
    ]
  },
  {
    year: 3,
    title: 'Year 3: Applied Pharmacy Subjects',
    description: 'Pharmacology and pharmacognosy.',
    subjects: [
      {
        id: 'b301', name: 'Pharmacology', code: 'BCOL-1', year: 3, creditHours: 4, description: 'Systemic pharmacology.',
        lessons: [
          { id: 'bl7', title: 'Autonomic Pharmacology', pciCode: '3.1', hasSimulation: true, description: 'ANS drugs.' },
          { id: 'bl8', title: 'Cardiovascular Pharmacology', pciCode: '3.2', hasSimulation: true, description: 'CVS drugs.' },
          { id: 'bl9', title: 'CNS Pharmacology', pciCode: '3.3', hasSimulation: true, description: 'CNS drugs.' }
        ]
      },
      {
        id: 'b302', name: 'Pharmacognosy', code: 'BPG-1', year: 3, creditHours: 4, description: 'Natural drugs.',
        lessons: [
          { id: 'bl10', title: 'Alkaloids', pciCode: '3.4', hasSimulation: false, description: 'Plant alkaloids.' },
          { id: 'bl11', title: 'Glycosides', pciCode: '3.5', hasSimulation: false, description: 'Plant glycosides.' },
          { id: 'bl12', title: 'Tannins & Resins', pciCode: '3.6', hasSimulation: false, description: 'Tannins and resins.' }
        ]
      }
    ]
  },
  {
    year: 4,
    title: 'Year 4: Advanced Pharmacy Subjects',
    description: 'Biotechnology and quality assurance.',
    subjects: [
      {
        id: 'b401', name: 'Pharmaceutical Biotechnology', code: 'BPB-1', year: 4, creditHours: 4, description: 'Biotech in pharmacy.',
        lessons: [
          { id: 'bl13', title: 'Enzyme Technology', pciCode: '4.1', hasSimulation: true, description: 'Enzymes.' },
          { id: 'bl14', title: 'Recombinant DNA', pciCode: '4.2', hasSimulation: true, description: 'rDNA tech.' },
          { id: 'bl15', title: 'Immunology', pciCode: '4.3', hasSimulation: true, description: 'Vaccines.' }
        ]
      },
      {
        id: 'b402', name: 'Quality Assurance', code: 'BQA-1', year: 4, creditHours: 4, description: 'QA and QC.',
        lessons: [
          { id: 'bl16', title: 'GLP & GMP', pciCode: '4.4', hasSimulation: false, description: 'Good practices.' },
          { id: 'bl17', title: 'Validation', pciCode: '4.5', hasSimulation: false, description: 'Process validation.' },
          { id: 'bl18', title: 'Documentation', pciCode: '4.6', hasSimulation: false, description: 'QA documents.' }
        ]
      }
    ]
  }
];

export const BPHARM_METADATA = {
  programName: 'Bachelor of Pharmacy',
  abbreviation: 'B.Pharm',
  duration: '4 Years',
  regulatoryBody: 'PCI'
};

export function getBPharmSubjectById(id: string): BPharmSubject | undefined {
  for (const year of BPHARM_CURRICULUM) {
    for (const subject of year.subjects) {
      if (subject.id === id) return subject;
    }
  }
  return undefined;
}
