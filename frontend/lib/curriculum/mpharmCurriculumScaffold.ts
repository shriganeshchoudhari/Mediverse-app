export interface MPharmSubject {
  id: string;
  name: string;
  code: string;
  description: string;
  lessons: any[];
}

export interface MPharmSpecialty {
  id: string;
  name: string;
  description: string;
  subjects: MPharmSubject[];
}

export const MPHARM_CURRICULUM: MPharmSpecialty[] = [
  {
    id: 'm1',
    name: 'Pharmaceutics',
    description: 'Formulation and drug delivery.',
    subjects: [
      {
        id: 'ms1', name: 'Modern Pharmaceutics', code: 'MP-1', description: 'Advanced formulation.',
        lessons: [
          { id: 'ml1', title: 'Preformulation', pciCode: '1.1' },
          { id: 'ml2', title: 'Optimization', pciCode: '1.2' },
          { id: 'ml3', title: 'Validation', pciCode: '1.3' }
        ]
      }
    ]
  },
  {
    id: 'm2',
    name: 'Pharmacology',
    description: 'Advanced pharmacology and screening.',
    subjects: [
      {
        id: 'ms2', name: 'Advanced Pharmacology', code: 'MCOL-1', description: 'Molecular pharmacology.',
        lessons: [
          { id: 'ml4', title: 'Receptor Pharmacology', pciCode: '2.1' },
          { id: 'ml5', title: 'Pharmacogenetics', pciCode: '2.2' },
          { id: 'ml6', title: 'Toxicology', pciCode: '2.3' }
        ]
      }
    ]
  },
  {
    id: 'm3',
    name: 'Pharmaceutical Chemistry',
    description: 'Drug design and synthesis.',
    subjects: [
      {
        id: 'ms3', name: 'Advanced Pharmaceutical Chemistry', code: 'MPC-1', description: 'Synthetic chemistry.',
        lessons: [
          { id: 'ml7', title: 'Drug Design', pciCode: '3.1' },
          { id: 'ml8', title: 'Stereochemistry', pciCode: '3.2' },
          { id: 'ml9', title: 'Advanced Spectroscopy', pciCode: '3.3' }
        ]
      }
    ]
  },
  {
    id: 'm4',
    name: 'Pharmacy Practice',
    description: 'Clinical pharmacy and therapeutics.',
    subjects: [
      {
        id: 'ms4', name: 'Clinical Pharmacy Practice', code: 'MPP-1', description: 'Advanced clinical practice.',
        lessons: [
          { id: 'ml10', title: 'Evidence Based Medicine', pciCode: '4.1' },
          { id: 'ml11', title: 'Therapeutic Guidelines', pciCode: '4.2' },
          { id: 'ml12', title: 'Patient Care', pciCode: '4.3' }
        ]
      }
    ]
  }
];

export const MPHARM_METADATA = {
  programName: 'Master of Pharmacy',
  abbreviation: 'M.Pharm',
  duration: '2 Years',
  regulatoryBody: 'PCI'
};

export function getMPharmSpecialtyById(id: string): MPharmSpecialty | undefined {
  return MPHARM_CURRICULUM.find(s => s.id === id);
}
