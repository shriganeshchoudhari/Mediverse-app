export interface PMJAYPackage {
  packageCode: string;
  specialty: string;
  procedureName: string;
  packageRateInr: number;
  preAuthRequired: boolean;
  lengthOfStayDays: number;
  mandatoryDocuments: string[];
}

export const PMJAY_PACKAGES: PMJAYPackage[] = [
  {
    packageCode: 'MCG001',
    specialty: 'Cardiothoracic Surgery',
    procedureName: 'CABG',
    packageRateInr: 90000,
    preAuthRequired: true,
    lengthOfStayDays: 8,
    mandatoryDocuments: ['Coronary Angiography Report', 'ECHO Report', 'ECG', 'Fitness for Surgery']
  },
  {
    packageCode: 'MCG002',
    specialty: 'Interventional Cardiology',
    procedureName: 'PTCA with Drug Eluting Stent',
    packageRateInr: 65000,
    preAuthRequired: true,
    lengthOfStayDays: 3,
    mandatoryDocuments: ['Coronary Angiography Report', 'ECG']
  },
  {
    packageCode: 'MOR001',
    specialty: 'Orthopedics',
    procedureName: 'Total Knee Replacement',
    packageRateInr: 80000,
    preAuthRequired: true,
    lengthOfStayDays: 7,
    mandatoryDocuments: ['X-Ray of affected joint', 'Clinical Notes showing failure of conservative treatment']
  },
  {
    packageCode: 'MNE001',
    specialty: 'Nephrology',
    procedureName: 'Hemodialysis',
    packageRateInr: 1500,
    preAuthRequired: false,
    lengthOfStayDays: 1,
    mandatoryDocuments: ['Nephrologist Prescription', 'Baseline Renal Function Tests', 'Viral Markers']
  },
  {
    packageCode: 'MPE001',
    specialty: 'Pediatrics / Neonatology',
    procedureName: 'Neonatal ICU Care',
    packageRateInr: 5000,
    preAuthRequired: true,
    lengthOfStayDays: 14,
    mandatoryDocuments: ['Birth Details', 'Clinical Notes indicating need for NICU']
  },
  {
    packageCode: 'MMO001',
    specialty: 'Medical Oncology',
    procedureName: 'Acute Leukemia Chemotherapy',
    packageRateInr: 25000,
    preAuthRequired: true,
    lengthOfStayDays: 10,
    mandatoryDocuments: ['Bone Marrow Biopsy Report', 'Flow Cytometry Report', 'Chemotherapy Protocol']
  }
];

export interface EligibilityCriteria {
  category: string;
  description: string;
  seccDeprivationCriteria: string[];
}

export const ELIGIBILITY_CATEGORIES: EligibilityCriteria[] = [
  {
    category: 'Rural',
    description: 'Families belonging to rural areas as per SECC 2011 data based on defined deprivation indicators.',
    seccDeprivationCriteria: [
      'D1: Only one room with kucha walls and kucha roof',
      'D2: No adult member between 16 to 59 years of age',
      'D3: Female headed households with no adult male member between 16 to 59 years of age',
      'D4: Disabled member and no able-bodied adult member',
      'D5: SC/ST households',
      'D7: Landless households deriving a major part of their income from manual casual labour'
    ]
  },
  {
    category: 'Urban',
    description: 'Families belonging to urban areas corresponding to specific occupational categories.',
    seccDeprivationCriteria: [
      'Rag picker',
      'Beggar',
      'Domestic worker',
      'Street vendor/Cobbler/hawker / Other service provider working on streets',
      'Construction worker/Plumber/Mason/Labour/Painter/Welder/ Security guard/ Coolie and other head-load worker',
      'Sweeper/Sanitation worker / Mali',
      'Home-based worker/ Artisan/ Handicrafts worker / Tailor',
      'Transport worker/ Driver/ Conductor/ Helper to drivers and conductors/ Cart puller/ Rickshaw puller',
      'Shop worker/ Assistant/ Peon in small establishment/ Helper/ Delivery assistant / Attendant/ Waiter',
      'Electrician/ Mechanic/ Assembler/ Repair worker',
      'Washer-man/ Chowkidar'
    ]
  }
];
