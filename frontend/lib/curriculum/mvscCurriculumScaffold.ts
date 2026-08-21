export interface MVSCSpecialty {
  id: string;
  name: string;
  description: string;
  duration: string;
  courses: { id: string; title: string; creditHours: number }[];
}

export const MVSC_CURRICULUM: MVSCSpecialty[] = [
  {
    id: 'mvsc-surg',
    name: 'Veterinary Surgery & Radiology',
    description: 'Advanced surgical techniques, orthopedics, and advanced imaging modalities.',
    duration: '2 years',
    courses: [
      { id: 'surg-1', title: 'Advanced Soft Tissue Surgery', creditHours: 3 },
      { id: 'surg-2', title: 'Orthopedics & Traumatology', creditHours: 3 },
      { id: 'surg-3', title: 'Diagnostic Imaging Techniques', creditHours: 2 }
    ]
  },
  {
    id: 'mvsc-med',
    name: 'Veterinary Clinical Medicine',
    description: 'Specialized diagnosis and treatment of complex medical conditions in animals.',
    duration: '2 years',
    courses: [
      { id: 'med-1', title: 'Advanced Canine & Feline Medicine', creditHours: 3 },
      { id: 'med-2', title: 'Bovine & Equine Internal Medicine', creditHours: 3 },
      { id: 'med-3', title: 'Clinical Toxicology', creditHours: 2 }
    ]
  },
  {
    id: 'mvsc-gyn',
    name: 'Veterinary Gynaecology & Obstetrics',
    description: 'Reproductive biotechnologies, infertility management, and advanced obstetrics.',
    duration: '2 years',
    courses: [
      { id: 'gyn-1', title: 'Assisted Reproductive Technologies', creditHours: 3 },
      { id: 'gyn-2', title: 'Infertility in Farm Animals', creditHours: 3 },
      { id: 'gyn-3', title: 'Advanced Obstetrics & Pediatrics', creditHours: 2 }
    ]
  },
  {
    id: 'mvsc-path',
    name: 'Veterinary Pathology',
    description: 'In-depth study of disease pathogenesis, histopathology, and clinical pathology.',
    duration: '2 years',
    courses: [
      { id: 'path-1', title: 'Advanced Systemic Pathology', creditHours: 3 },
      { id: 'path-2', title: 'Oncology and Tumor Pathology', creditHours: 3 },
      { id: 'path-3', title: 'Clinical Pathology and Diagnostics', creditHours: 2 }
    ]
  },
  {
    id: 'mvsc-pub',
    name: 'Veterinary Public Health & Epidemiology',
    description: 'Zoonoses control, food safety, and application of One Health principles.',
    duration: '2 years',
    courses: [
      { id: 'pub-1', title: 'Epidemiology of Infectious Diseases', creditHours: 3 },
      { id: 'pub-2', title: 'Zoonoses and One Health', creditHours: 3 },
      { id: 'pub-3', title: 'Food Hygiene and Quality Control', creditHours: 2 }
    ]
  }
];

export const MVSC_SPECIALTIES = MVSC_CURRICULUM;
