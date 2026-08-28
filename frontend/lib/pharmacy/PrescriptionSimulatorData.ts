// Clinical Prescribing Simulator Data & Evaluation Engine
// Mediverse Clinical Pharmacotherapy & Medical Education Platform

export interface PatientProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weightKg: number;
  heightCm: number;
  bmi: number;
  uhid: string;
  occupation: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  vitals: {
    bp: string;
    hr: number;
    rr: number;
    temp: string;
    spo2: string;
  };
  labs: Record<string, string>;
  eGFR: number; // mL/min/1.73m2
  creatinineClearance: number; // mL/min
  organDysfunction: string[];
  knownAllergies: Array<{
    allergen: string;
    reactionType: string;
    severity: 'Mild' | 'Moderate' | 'Severe (Anaphylaxis)';
  }>;
  concurrentMedications: string[];
  coMorbidities: string[];
}

export interface ClinicalCase {
  id: string;
  caseNumber: number;
  title: string;
  subtitle: string;
  specialty: string;
  difficulty: 'Intermediate' | 'Advanced' | 'Expert';
  clinicalSummary: string;
  diagnosis: string;
  patient: PatientProfile;
  guidelineReference: string;
  keyLearningObjectives: string[];
  goldStandardPrescription: PrescribedItem[];
  criticalContraindications: Array<{
    drugIdOrGroup: string;
    reason: string;
    severity: 'Absolute' | 'High' | 'Moderate';
  }>;
  essentialDrugGroups: Array<{
    groupName: string;
    acceptedDrugIds: string[];
    rationale: string;
  }>;
  clinicalDebrief: {
    pathophysiology: string;
    pharmacotherapyRationale: string;
    safetyPitfalls: string;
    guidelineRecommendations: string;
  };
}

export interface FormularyDrug {
  id: string;
  name: string;
  genericName: string;
  brandExamples: string[];
  category: 'Antidiabetic' | 'Antibiotic' | 'Cardiovascular' | 'Antiplatelet / Anticoagulant' | 'Respiratory' | 'Corticosteroid' | 'Analgesic / NSAID' | 'Antihypertensive' | 'GI / PPI' | 'Lipid Lowering' | 'Other';
  formulation: string;
  availableDoses: number[];
  doseUnit: 'mg' | 'mcg' | 'IU' | 'puffs' | 'drops' | 'ml';
  standardDose: number;
  availableRoutes: ('Oral' | 'IV' | 'Inhaled' | 'SC' | 'IM' | 'Sublingual' | 'Topical')[];
  defaultRoute: 'Oral' | 'IV' | 'Inhaled' | 'SC' | 'IM' | 'Sublingual' | 'Topical';
  availableFrequencies: ('OD' | 'BD' | 'TDS' | 'QDS' | 'PRN' | 'STAT' | 'Once Weekly' | 'Continuous Infusion')[];
  defaultFrequency: 'OD' | 'BD' | 'TDS' | 'QDS' | 'PRN' | 'STAT' | 'Once Weekly' | 'Continuous Infusion';
  standardDurationDays: number;
  foodInstructions: string;
  drugClass: string;
  allergyGroup?: 'penicillin' | 'sulfa' | 'nsaid' | 'macrolide' | 'fluoroquinolone';
  renalAdjustmentNotes?: string;
  minSafeEGFR?: number;
  maxDoseInCKD?: { eGFRThreshold: number; maxDose: number };
  contraindicatedConditions?: string[];
  highRiskAlert?: string;
  cypInteractions?: string[];
}

export interface PrescribedItem {
  id: string;
  drugId: string;
  drugName: string;
  genericName: string;
  dose: number;
  doseUnit: string;
  route: string;
  frequency: string;
  durationDays: number;
  specialInstructions: string;
}

export interface LiveAlert {
  id: string;
  type: 'Allergy Contraindication' | 'Renal Warning' | 'Disease Contraindication' | 'Drug-Drug Interaction' | 'Dosing Alert' | 'Best Practice';
  severity: 'contraindicated' | 'major' | 'moderate' | 'info';
  drugName: string;
  title: string;
  message: string;
  mechanism: string;
  recommendation: string;
}

export interface MillerEvaluation {
  overallScore: number; // 0 - 100
  letterGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F';
  passed: boolean;
  scoreBreakdown: {
    efficacyScore: number; // max 35
    safetyScore: number; // max 35
    dosingAccuracyScore: number; // max 15
    prescriptionCompletenessScore: number; // max 15
  };
  millerCompetencies: {
    knows: {
      score: number; // 0-100%
      summary: string;
      details: string[];
    };
    knowsHow: {
      score: number; // 0-100%
      summary: string;
      details: string[];
    };
    showsHow: {
      score: number; // 0-100%
      summary: string;
      details: string[];
    };
    does: {
      score: number; // 0-100%
      summary: string;
      details: string[];
    };
  };
  matchedEssentialDrugs: string[];
  missedEssentialDrugs: string[];
  dangerousPrescriptions: string[];
  dosingIssues: string[];
  feedbackNotes: string[];
}

// -------------------------------------------------------------
// CLINICAL FORMULARY DATABASE
// -------------------------------------------------------------
export const CLINICAL_FORMULARY: FormularyDrug[] = [
  // Antidiabetics
  {
    id: 'metformin',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    brandExamples: ['Glucophage', 'Glycomet'],
    category: 'Antidiabetic',
    formulation: 'Tablet (Immediate / Extended Release)',
    availableDoses: [500, 850, 1000],
    doseUnit: 'mg',
    standardDose: 500,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD', 'BD', 'TDS'],
    defaultFrequency: 'BD',
    standardDurationDays: 90,
    foodInstructions: 'Take with or immediately after meals to reduce GI adverse effects',
    drugClass: 'Biguanide',
    minSafeEGFR: 30,
    maxDoseInCKD: { eGFRThreshold: 45, maxDose: 1000 },
    renalAdjustmentNotes: 'eGFR 30-44 mL/min: Max 1000 mg/day (caution). eGFR < 30 mL/min: CONTRAINDICATED due to high risk of lactic acidosis.',
    contraindicatedConditions: ['Severe renal impairment (eGFR < 30)', 'Acute metabolic acidosis', 'Severe hepatic failure'],
    highRiskAlert: 'Risk of Metformin-Associated Lactic Acidosis (MALA) in impaired renal clearance.',
  },
  {
    id: 'empagliflozin',
    name: 'Empagliflozin',
    genericName: 'Empagliflozin',
    brandExamples: ['Jardiance'],
    category: 'Antidiabetic',
    formulation: 'Film-coated Tablet',
    availableDoses: [10, 25],
    doseUnit: 'mg',
    standardDose: 10,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 90,
    foodInstructions: 'Take once daily in the morning with or without food',
    drugClass: 'SGLT2 Inhibitor',
    minSafeEGFR: 20,
    renalAdjustmentNotes: 'Safe for cardiorenal protection down to eGFR 20 mL/min (EMPA-KIDNEY/KDIGO 2024 guidelines). Dose: 10 mg OD.',
    highRiskAlert: 'Risk of euglycemic DKA during acute illness/surgery; stay well hydrated, risk of mycotic genital infections.',
  },
  {
    id: 'dapagliflozin',
    name: 'Dapagliflozin',
    genericName: 'Dapagliflozin',
    brandExamples: ['Forxiga', 'Farxiga'],
    category: 'Antidiabetic',
    formulation: 'Film-coated Tablet',
    availableDoses: [5, 10],
    doseUnit: 'mg',
    standardDose: 10,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 90,
    foodInstructions: 'Take once daily in the morning with or without food',
    drugClass: 'SGLT2 Inhibitor',
    minSafeEGFR: 25,
    renalAdjustmentNotes: 'Indicated for CKD progression and heart failure down to eGFR 25 mL/min. Standard dose 10 mg OD.',
  },
  {
    id: 'semaglutide_sc',
    name: 'Semaglutide (Subcutaneous)',
    genericName: 'Semaglutide',
    brandExamples: ['Ozempic', 'Wegovy'],
    category: 'Antidiabetic',
    formulation: 'Prefilled Pen for Subcutaneous Injection',
    availableDoses: [0.25, 0.5, 1, 2],
    doseUnit: 'mg',
    standardDose: 0.5,
    availableRoutes: ['SC'],
    defaultRoute: 'SC',
    availableFrequencies: ['Once Weekly'],
    defaultFrequency: 'Once Weekly',
    standardDurationDays: 90,
    foodInstructions: 'Administer subcutaneously once weekly on the same day each week, any time of day',
    drugClass: 'GLP-1 Receptor Agonist',
    minSafeEGFR: 15,
    renalAdjustmentNotes: 'No dose adjustment required in renal impairment down to eGFR 15 mL/min (FLOW trial nephroprotection).',
  },
  {
    id: 'dulaglutide',
    name: 'Dulaglutide',
    genericName: 'Dulaglutide',
    brandExamples: ['Trulicity'],
    category: 'Antidiabetic',
    formulation: 'Single-dose Subcutaneous Pen',
    availableDoses: [0.75, 1.5],
    doseUnit: 'mg',
    standardDose: 0.75,
    availableRoutes: ['SC'],
    defaultRoute: 'SC',
    availableFrequencies: ['Once Weekly'],
    defaultFrequency: 'Once Weekly',
    standardDurationDays: 90,
    foodInstructions: 'Subcutaneous injection into abdomen or thigh once weekly',
    drugClass: 'GLP-1 Receptor Agonist',
    minSafeEGFR: 15,
    renalAdjustmentNotes: 'No dose adjustment required across CKD stages 1-4.',
  },
  {
    id: 'linagliptin',
    name: 'Linagliptin',
    genericName: 'Linagliptin',
    brandExamples: ['Trajenta'],
    category: 'Antidiabetic',
    formulation: 'Film-coated Tablet',
    availableDoses: [5],
    doseUnit: 'mg',
    standardDose: 5,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 90,
    foodInstructions: 'Take once daily with or without food',
    drugClass: 'DPP-4 Inhibitor',
    minSafeEGFR: 15,
    renalAdjustmentNotes: 'Excreted predominantly via bile/feces; NO renal dose adjustment needed at any stage of CKD.',
  },
  {
    id: 'glibenclamide',
    name: 'Glibenclamide (Glyburide)',
    genericName: 'Glibenclamide',
    brandExamples: ['Daonil'],
    category: 'Antidiabetic',
    formulation: 'Tablet',
    availableDoses: [2.5, 5],
    doseUnit: 'mg',
    standardDose: 5,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD', 'BD'],
    defaultFrequency: 'OD',
    standardDurationDays: 30,
    foodInstructions: 'Take 30 minutes before the first meal of the day',
    drugClass: 'Sulfonylurea (2nd Gen)',
    minSafeEGFR: 60,
    contraindicatedConditions: ['eGFR < 60 mL/min', 'Severe renal impairment'],
    highRiskAlert: 'CONTRAINDICATED in CKD due to active metabolites causing prolonged, severe refractory hypoglycemia.',
  },

  // Antibiotics & Antimicrobials
  {
    id: 'amoxicillin',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin Trihydrate',
    brandExamples: ['Amoxil', 'Moxatag'],
    category: 'Antibiotic',
    formulation: 'Capsule / Tablet',
    availableDoses: [250, 500, 875, 1000],
    doseUnit: 'mg',
    standardDose: 500,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['TDS', 'BD'],
    defaultFrequency: 'TDS',
    standardDurationDays: 7,
    foodInstructions: 'Take at evenly spaced intervals with or without food with a full glass of water',
    drugClass: 'Aminopenicillin',
    allergyGroup: 'penicillin',
    contraindicatedConditions: ['Severe Penicillin Allergy (Anaphylaxis, Angioedema, Urticaria)'],
    highRiskAlert: 'STRICTLY CONTRAINDICATED in patients with IgE-mediated Penicillin Anaphylaxis.',
  },
  {
    id: 'amox_clav',
    name: 'Amoxicillin-Clavulanate (Augmentin)',
    genericName: 'Amoxicillin + Clavulanic Acid',
    brandExamples: ['Augmentin', 'Clavam'],
    category: 'Antibiotic',
    formulation: 'Film-coated Tablet',
    availableDoses: [625, 1000],
    doseUnit: 'mg',
    standardDose: 625,
    availableRoutes: ['Oral', 'IV'],
    defaultRoute: 'Oral',
    availableFrequencies: ['BD', 'TDS'],
    defaultFrequency: 'BD',
    standardDurationDays: 7,
    foodInstructions: 'Take at start of a meal to enhance absorption and reduce GI intolerance',
    drugClass: 'Penicillin + Beta-Lactamase Inhibitor',
    allergyGroup: 'penicillin',
    contraindicatedConditions: ['Severe Penicillin Allergy', 'History of Amoxicillin-Clavulanate induced cholestatic jaundice'],
    highRiskAlert: 'STRICTLY CONTRAINDICATED in severe penicillin allergy / anaphylaxis.',
  },
  {
    id: 'levofloxacin',
    name: 'Levofloxacin',
    genericName: 'Levofloxacin Hemihydrate',
    brandExamples: ['Levaquin', 'Levomac'],
    category: 'Antibiotic',
    formulation: 'Tablet / IV Infusion',
    availableDoses: [250, 500, 750],
    doseUnit: 'mg',
    standardDose: 500,
    availableRoutes: ['Oral', 'IV'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 7,
    foodInstructions: 'Take at least 2 hours before or 2 hours after antacids, iron, or sucralfate; drink plenty of fluids',
    drugClass: 'Respiratory Fluoroquinolone',
    allergyGroup: 'fluoroquinolone',
    renalAdjustmentNotes: 'eGFR 20-49 mL/min: 500 mg initial, then 250 mg every 24h. eGFR > 50: 500-750 mg OD.',
    highRiskAlert: 'First-line non-beta-lactam choice for Community-Acquired Pneumonia in severe penicillin allergy.',
  },
  {
    id: 'moxifloxacin',
    name: 'Moxifloxacin',
    genericName: 'Moxifloxacin Hydrochloride',
    brandExamples: ['Avelox', 'Moxicip'],
    category: 'Antibiotic',
    formulation: 'Film-coated Tablet / IV Infusion',
    availableDoses: [400],
    doseUnit: 'mg',
    standardDose: 400,
    availableRoutes: ['Oral', 'IV'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 7,
    foodInstructions: 'Take once daily with or without food. Avoid concurrent multivalent cations (calcium/iron).',
    drugClass: 'Respiratory Fluoroquinolone',
    allergyGroup: 'fluoroquinolone',
    renalAdjustmentNotes: 'No renal dose adjustment needed (hepatic metabolism/elimination).',
    highRiskAlert: 'Excellent atypical and pneumococcal coverage for CAP in penicillin-allergic patients.',
  },
  {
    id: 'azithromycin',
    name: 'Azithromycin',
    genericName: 'Azithromycin Dihydrate',
    brandExamples: ['Zithromax', 'Azithral'],
    category: 'Antibiotic',
    formulation: 'Tablet / Suspension',
    availableDoses: [250, 500],
    doseUnit: 'mg',
    standardDose: 500,
    availableRoutes: ['Oral', 'IV'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 5,
    foodInstructions: 'Take 1 hour before or 2 hours after meals with water',
    drugClass: 'Macrolide',
    allergyGroup: 'macrolide',
    renalAdjustmentNotes: 'No dose adjustment required in mild to moderate renal impairment.',
  },
  {
    id: 'doxycycline',
    name: 'Doxycycline',
    genericName: 'Doxycycline Hyclate',
    brandExamples: ['Vibramycin', 'Doxicip'],
    category: 'Antibiotic',
    formulation: 'Capsule / Tablet',
    availableDoses: [100],
    doseUnit: 'mg',
    standardDose: 100,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['BD', 'OD'],
    defaultFrequency: 'BD',
    standardDurationDays: 7,
    foodInstructions: 'Take with a large glass of water in an upright sitting or standing position; do not lie down for 30 min (pill esophagitis risk)',
    drugClass: 'Tetracycline',
    renalAdjustmentNotes: 'Non-renal elimination; safe in renal impairment.',
  },
  {
    id: 'ceftriaxone',
    name: 'Ceftriaxone',
    genericName: 'Ceftriaxone Sodium',
    brandExamples: ['Rocephin', 'Monocef'],
    category: 'Antibiotic',
    formulation: 'IV / IM Injection Vial',
    availableDoses: [1000, 2000],
    doseUnit: 'mg',
    standardDose: 1000,
    availableRoutes: ['IV', 'IM'],
    defaultRoute: 'IV',
    availableFrequencies: ['OD', 'BD'],
    defaultFrequency: 'OD',
    standardDurationDays: 7,
    foodInstructions: 'Parenteral administration over 30 minutes',
    drugClass: '3rd Generation Cephalosporin',
    contraindicatedConditions: ['Severe immediate IgE-mediated Penicillin Anaphylaxis'],
    highRiskAlert: 'Avoid in history of severe IgE-mediated anaphylaxis / angioedema to penicillins.',
  },

  // Cardiovascular, Antiplatelet, Antihypertensive & Statins
  {
    id: 'aspirin',
    name: 'Aspirin (Low Dose)',
    genericName: 'Acetylsalicylic Acid',
    brandExamples: ['Ecosprin', 'Bayer Aspirin'],
    category: 'Antiplatelet / Anticoagulant',
    formulation: 'Gastro-resistant / Enteric-coated Tablet',
    availableDoses: [75, 81, 100, 150, 300, 325],
    doseUnit: 'mg',
    standardDose: 75,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 365,
    foodInstructions: 'Take once daily after food with a glass of water',
    drugClass: 'Antiplatelet / COX-1 Inhibitor',
    allergyGroup: 'nsaid',
    contraindicatedConditions: ['Aspirin-Exacerbated Respiratory Disease (AERD) / Severe Asthma sensitivity', 'Active peptic ulcer bleeding'],
    highRiskAlert: 'Cornerstone of DAPT post-PCI (75-100 mg OD). STRICTLY CONTRAINDICATED in Aspirin-sensitive asthma (AERD).',
  },
  {
    id: 'ticagrelor',
    name: 'Ticagrelor',
    genericName: 'Ticagrelor',
    brandExamples: ['Brilinta', 'Brilique'],
    category: 'Antiplatelet / Anticoagulant',
    formulation: 'Film-coated Tablet',
    availableDoses: [60, 90],
    doseUnit: 'mg',
    standardDose: 90,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['BD'],
    defaultFrequency: 'BD',
    standardDurationDays: 365,
    foodInstructions: 'Take twice daily with or without food. Do not skip doses.',
    drugClass: 'P2Y12 Receptor Inhibitor (Reversible)',
    contraindicatedConditions: ['Active pathological bleeding', 'History of intracranial hemorrhage', 'Severe hepatic impairment'],
    highRiskAlert: 'Preferred potent P2Y12 inhibitor post-STEMI PCI for 12 months (PLATO trial guideline recommendation).',
  },
  {
    id: 'clopidogrel',
    name: 'Clopidogrel',
    genericName: 'Clopidogrel Bisulfate',
    brandExamples: ['Plavix', 'Clopilet'],
    category: 'Antiplatelet / Anticoagulant',
    formulation: 'Film-coated Tablet',
    availableDoses: [75, 300],
    doseUnit: 'mg',
    standardDose: 75,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 365,
    foodInstructions: 'Take once daily at the same time each day with or without food',
    drugClass: 'P2Y12 Receptor Inhibitor (Irreversible Thienopyridine)',
    cypInteractions: ['CYP2C19 (Inhibited by Omeprazole/Esomeprazole)'],
    highRiskAlert: 'Avoid concurrent Omeprazole due to CYP2C19 competitive activation inhibition; use Pantoprazole instead.',
  },
  {
    id: 'atorvastatin',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    brandExamples: ['Lipitor', 'Atorva'],
    category: 'Lipid Lowering',
    formulation: 'Film-coated Tablet',
    availableDoses: [10, 20, 40, 80],
    doseUnit: 'mg',
    standardDose: 80,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 365,
    foodInstructions: 'Take once daily at night or in the evening with or without food',
    drugClass: 'HMG-CoA Reductase Inhibitor (High-Intensity Statin)',
    highRiskAlert: 'High-intensity statin (80 mg OD) mandatory post-STEMI to stabilize plaque and reduce recurrent MACE.',
  },
  {
    id: 'rosuvastatin',
    name: 'Rosuvastatin',
    genericName: 'Rosuvastatin Calcium',
    brandExamples: ['Crestor', 'Rozucor'],
    category: 'Lipid Lowering',
    formulation: 'Film-coated Tablet',
    availableDoses: [10, 20, 40],
    doseUnit: 'mg',
    standardDose: 20,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 365,
    foodInstructions: 'Take once daily any time of day with or without food',
    drugClass: 'HMG-CoA Reductase Inhibitor (High-Intensity Statin)',
  },
  {
    id: 'metoprolol_succinate',
    name: 'Metoprolol Succinate (ER)',
    genericName: 'Metoprolol Succinate Extended Release',
    brandExamples: ['Toprol-XL', 'Betaloc 50'],
    category: 'Cardiovascular',
    formulation: 'Extended Release Tablet',
    availableDoses: [25, 50, 100],
    doseUnit: 'mg',
    standardDose: 50,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 365,
    foodInstructions: 'Take once daily in the morning with or immediately following a meal',
    drugClass: 'Beta-1 Selective Adrenergic Antagonist',
    contraindicatedConditions: ['Severe bradycardia (< 50 bpm)', 'Cardiogenic shock', 'Decompensated acute heart failure', 'Severe active asthma/bronchospasm'],
    highRiskAlert: 'Cardioselective beta-blocker indicated post-STEMI to reduce myocardial oxygen demand and sudden death.',
  },
  {
    id: 'bisoprolol',
    name: 'Bisoprolol',
    genericName: 'Bisoprolol Fumarate',
    brandExamples: ['Zebeta', 'Concor'],
    category: 'Cardiovascular',
    formulation: 'Tablet',
    availableDoses: [2.5, 5, 10],
    doseUnit: 'mg',
    standardDose: 2.5,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 365,
    foodInstructions: 'Take once daily in the morning with water',
    drugClass: 'Beta-1 Highly Selective Antagonist',
    contraindicatedConditions: ['Severe active bronchospasm / Severe Asthma', '2nd/3rd degree AV block'],
  },
  {
    id: 'propranolol',
    name: 'Propranolol',
    genericName: 'Propranolol Hydrochloride',
    brandExamples: ['Inderal', 'Ciplar'],
    category: 'Cardiovascular',
    formulation: 'Tablet',
    availableDoses: [10, 20, 40, 80],
    doseUnit: 'mg',
    standardDose: 40,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['BD', 'TDS'],
    defaultFrequency: 'BD',
    standardDurationDays: 30,
    foodInstructions: 'Take before meals',
    drugClass: 'Non-Selective Beta Blocker (Beta-1 and Beta-2)',
    contraindicatedConditions: ['Bronchial Asthma / History of Bronchospasm', 'COPD with bronchospasm', 'Severe Bradycardia'],
    highRiskAlert: 'FATAL IN ASTHMA: Non-selective beta-2 blockade triggers catastrophic, irreversible bronchoconstriction.',
  },
  {
    id: 'ramipril',
    name: 'Ramipril',
    genericName: 'Ramipril',
    brandExamples: ['Altace', 'Cardace'],
    category: 'Antihypertensive',
    formulation: 'Capsule / Tablet',
    availableDoses: [2.5, 5, 10],
    doseUnit: 'mg',
    standardDose: 2.5,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 365,
    foodInstructions: 'Take once daily at night or in morning with or without food',
    drugClass: 'ACE Inhibitor',
    renalAdjustmentNotes: 'Monitor eGFR and potassium within 1-2 weeks of initiation; titrate carefully in CKD.',
    contraindicatedConditions: ['History of ACEi-induced Angioedema', 'Bilateral renal artery stenosis', 'Pregnancy'],
    highRiskAlert: 'Indicated post-STEMI to prevent adverse LV remodeling and in diabetic nephropathy for renal protection.',
  },
  {
    id: 'telmisartan',
    name: 'Telmisartan',
    genericName: 'Telmisartan',
    brandExamples: ['Micardis', 'Telma'],
    category: 'Antihypertensive',
    formulation: 'Tablet',
    availableDoses: [20, 40, 80],
    doseUnit: 'mg',
    standardDose: 40,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 365,
    foodInstructions: 'Take once daily with or without food',
    drugClass: 'Angiotensin II Receptor Blocker (ARB)',
    contraindicatedConditions: ['Pregnancy', 'Bilateral renal artery stenosis', 'Concurrent Aliskiren in diabetes'],
    highRiskAlert: 'First-line renoprotective ARB for CKD with microalbuminuria / diabetes.',
  },
  {
    id: 'pantoprazole',
    name: 'Pantoprazole',
    genericName: 'Pantoprazole Sodium',
    brandExamples: ['Protonix', 'Pan 40'],
    category: 'GI / PPI',
    formulation: 'Gastro-resistant Tablet / IV',
    availableDoses: [20, 40],
    doseUnit: 'mg',
    standardDose: 40,
    availableRoutes: ['Oral', 'IV'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 90,
    foodInstructions: 'Take once daily 30-60 minutes before morning breakfast',
    drugClass: 'Proton Pump Inhibitor (PPI)',
    highRiskAlert: 'Preferred PPI with DAPT (Aspirin + Clopidogrel/Ticagrelor) due to low CYP2C19 inhibition affinity.',
  },
  {
    id: 'omeprazole',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    brandExamples: ['Prilosec', 'Omez'],
    category: 'GI / PPI',
    formulation: 'Capsule',
    availableDoses: [20, 40],
    doseUnit: 'mg',
    standardDose: 20,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 30,
    foodInstructions: 'Take 30 minutes before morning meal',
    drugClass: 'Proton Pump Inhibitor (PPI)',
    cypInteractions: ['Potent CYP2C19 Inhibitor'],
    highRiskAlert: 'CAUTION with Clopidogrel: Inhibits CYP2C19 bioactivation of Clopidogrel, increasing stent thrombosis risk.',
  },

  // Respiratory & Pulmonary Agents
  {
    id: 'salbutamol_neb',
    name: 'Salbutamol (Albuterol) Respirator Solution',
    genericName: 'Salbutamol Sulfate',
    brandExamples: ['Ventolin Nebules', 'Asthalin'],
    category: 'Respiratory',
    formulation: 'Nebulizer Solution (2.5 mg / 2.5 mL)',
    availableDoses: [2.5, 5],
    doseUnit: 'mg',
    standardDose: 2.5,
    availableRoutes: ['Inhaled'],
    defaultRoute: 'Inhaled',
    availableFrequencies: ['PRN', 'TDS', 'QDS'],
    defaultFrequency: 'PRN',
    standardDurationDays: 5,
    foodInstructions: 'Administer via oxygen-driven nebulizer (6-8 L/min) or air compressor. Inhale normally until cup is empty.',
    drugClass: 'Short-Acting Beta-2 Agonist (SABA)',
    highRiskAlert: 'First-line emergency rescue bronchodilator for acute asthma exacerbation.',
  },
  {
    id: 'salbutamol_mdi',
    name: 'Salbutamol (Albuterol) Inhaler MDI',
    genericName: 'Salbutamol Inhaler',
    brandExamples: ['Ventolin Inhaler', 'Asthalin MDI'],
    category: 'Respiratory',
    formulation: 'Metered Dose Inhaler (100 mcg/puff)',
    availableDoses: [2, 4, 8],
    doseUnit: 'puffs',
    standardDose: 4,
    availableRoutes: ['Inhaled'],
    defaultRoute: 'Inhaled',
    availableFrequencies: ['PRN', 'QDS'],
    defaultFrequency: 'PRN',
    standardDurationDays: 30,
    foodInstructions: 'Always use with a spacer chamber device; shake well before each puff, slow deep inhalation followed by 10s breath hold.',
    drugClass: 'Short-Acting Beta-2 Agonist (SABA)',
  },
  {
    id: 'ipratropium_neb',
    name: 'Ipratropium Bromide Nebulizer Solution',
    genericName: 'Ipratropium Bromide',
    brandExamples: ['Atrovent Nebules', 'Ipravent'],
    category: 'Respiratory',
    formulation: 'Nebulizer Solution (500 mcg / 2 mL)',
    availableDoses: [250, 500],
    doseUnit: 'mcg',
    standardDose: 500,
    availableRoutes: ['Inhaled'],
    defaultRoute: 'Inhaled',
    availableFrequencies: ['TDS', 'QDS', 'PRN'],
    defaultFrequency: 'QDS',
    standardDurationDays: 3,
    foodInstructions: 'Nebulize with Salbutamol for synergistic bronchodilation during acute severe exacerbation. Avoid eye contact.',
    drugClass: 'Short-Acting Muscarinic Antagonist (SAMA)',
    highRiskAlert: 'Add to SABA in acute severe asthma for additive bronchodilation and hospital admission reduction (GINA 2024).',
  },
  {
    id: 'prednisolone_oral',
    name: 'Prednisolone Oral',
    genericName: 'Prednisolone',
    brandExamples: ['Prelone', 'Wysolone'],
    category: 'Corticosteroid',
    formulation: 'Tablet',
    availableDoses: [5, 10, 20, 40, 50],
    doseUnit: 'mg',
    standardDose: 40,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['OD'],
    defaultFrequency: 'OD',
    standardDurationDays: 5,
    foodInstructions: 'Take once daily in the morning with or immediately after breakfast to reduce gastric irritation',
    drugClass: 'Systemic Glucocorticoid',
    highRiskAlert: 'Mandatory systemic corticosteroid (40-50 mg OD for 5-7 days) in acute asthma exacerbation to resolve airway edema.',
  },
  {
    id: 'hydrocortisone_iv',
    name: 'Hydrocortisone Sodium Succinate IV',
    genericName: 'Hydrocortisone IV',
    brandExamples: ['Solu-Cortef', 'Primacort'],
    category: 'Corticosteroid',
    formulation: 'IV Injection Vial',
    availableDoses: [100, 200],
    doseUnit: 'mg',
    standardDose: 100,
    availableRoutes: ['IV'],
    defaultRoute: 'IV',
    availableFrequencies: ['QDS', 'TDS', 'STAT'],
    defaultFrequency: 'QDS',
    standardDurationDays: 2,
    foodInstructions: 'IV Bolus over 2-3 minutes or continuous infusion',
    drugClass: 'Systemic Glucocorticoid',
  },
  {
    id: 'budesonide_formoterol',
    name: 'Budesonide + Formoterol Inhaler',
    genericName: 'Budesonide / Formoterol Fumarate',
    brandExamples: ['Symbicort', 'Foracort 200'],
    category: 'Respiratory',
    formulation: 'DPI / MDI (200/6 mcg per actuation)',
    availableDoses: [1, 2],
    doseUnit: 'puffs',
    standardDose: 2,
    availableRoutes: ['Inhaled'],
    defaultRoute: 'Inhaled',
    availableFrequencies: ['BD'],
    defaultFrequency: 'BD',
    standardDurationDays: 30,
    foodInstructions: 'Rinse mouth and gargle with water and spit out after inhalation to prevent oral candidiasis and dysphonia',
    drugClass: 'ICS + LABA (Inhaled Corticosteroid + Long-Acting Beta Agonist)',
  },

  // Analgesics, Antipyretics & NSAIDs
  {
    id: 'paracetamol',
    name: 'Paracetamol (Acetaminophen)',
    genericName: 'Paracetamol',
    brandExamples: ['Tylenol', 'Calpol', 'Dolo 650'],
    category: 'Analgesic / NSAID',
    formulation: 'Tablet / IV Infusion',
    availableDoses: [500, 650, 1000],
    doseUnit: 'mg',
    standardDose: 650,
    availableRoutes: ['Oral', 'IV'],
    defaultRoute: 'Oral',
    availableFrequencies: ['TDS', 'QDS', 'PRN'],
    defaultFrequency: 'TDS',
    standardDurationDays: 5,
    foodInstructions: 'Take with or without food. Maximum 4000 mg (4g) in 24 hours (2000-3000 mg in hepatic impairment/frail patients).',
    drugClass: 'Central Analgesic / Antipyretic',
    renalAdjustmentNotes: 'Safe first-line analgesic/antipyretic in renal impairment and asthma.',
    highRiskAlert: 'Safe choice in asthma and renal disease where NSAIDs are contraindicated.',
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    brandExamples: ['Advil', 'Brufen', 'Motrin'],
    category: 'Analgesic / NSAID',
    formulation: 'Film-coated Tablet',
    availableDoses: [200, 400, 600, 800],
    doseUnit: 'mg',
    standardDose: 400,
    availableRoutes: ['Oral'],
    defaultRoute: 'Oral',
    availableFrequencies: ['TDS', 'BD', 'PRN'],
    defaultFrequency: 'TDS',
    standardDurationDays: 5,
    foodInstructions: 'Take with food or milk to minimize GI irritation',
    drugClass: 'Non-Selective NSAID',
    allergyGroup: 'nsaid',
    minSafeEGFR: 60,
    contraindicatedConditions: ['Aspirin-Exacerbated Respiratory Disease (AERD) / Severe Asthma sensitivity', 'CKD Stage 3-5 (eGFR < 60)', 'Active GI bleeding', 'Post-CABG/Post-PCI'],
    highRiskAlert: 'CONTRAINDICATED in Asthma with NSAID sensitivity (triggers fatal bronchospasm) and in CKD (induces acute renal failure).',
  },
  {
    id: 'diclofenac',
    name: 'Diclofenac Sodium',
    genericName: 'Diclofenac',
    brandExamples: ['Voltaren', 'Voveran'],
    category: 'Analgesic / NSAID',
    formulation: 'Tablet / IM Injection',
    availableDoses: [50, 75],
    doseUnit: 'mg',
    standardDose: 50,
    availableRoutes: ['Oral', 'IM'],
    defaultRoute: 'Oral',
    availableFrequencies: ['BD', 'TDS'],
    defaultFrequency: 'BD',
    standardDurationDays: 3,
    foodInstructions: 'Take with meals',
    drugClass: 'NSAID',
    allergyGroup: 'nsaid',
    minSafeEGFR: 60,
    contraindicatedConditions: ['Severe Asthma / AERD', 'CKD', 'Established ischemic heart disease'],
    highRiskAlert: 'High cardiovascular and renal hazard. Strictly contraindicated in asthma sensitivity and CKD.',
  }
];

// -------------------------------------------------------------
// 4 REALISTIC CLINICAL PATIENT CASES
// -------------------------------------------------------------
export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'case-ckd-t2d',
    caseNumber: 1,
    title: 'Type 2 Diabetes Mellitus with CKD Stage 3b & Hypertension',
    subtitle: 'Complex Renometabolic Optimization & Lactic Acidosis Risk Prevention',
    specialty: 'Nephrology & Endocrinology',
    difficulty: 'Advanced',
    clinicalSummary:
      'A 62-year-old male with long-standing Type 2 Diabetes presents for routine quarterly review. His recent labs reveal an HbA1c of 9.2%, eGFR of 38 mL/min/1.73m² (CKD Stage 3b), and persistent microalbuminuria (uACR 180 mg/g). He is currently on Metformin 1000 mg BD, which poses high risk of lactic acidosis at this reduced clearance. Formulate a guideline-adherent, renoprotective, and glycemic-safe prescription.',
    diagnosis: 'Type 2 Diabetes with Diabetic Kidney Disease (CKD Stage 3b, G3bA2) and Uncontrolled Hypertension',
    guidelineReference: 'KDIGO 2024 / ADA Standards of Care in Diabetes: CKD Management Guideline',
    keyLearningObjectives: [
      'Recognize Metformin toxicity risk and dosage adjustment/contraindication in eGFR < 45 mL/min.',
      'Initiate an evidence-based SGLT2 inhibitor (Empagliflozin / Dapagliflozin) for cardiorenal protection.',
      'Select a renal-safe incretin agent (GLP-1 Receptor Agonist like Semaglutide/Dulaglutide or Linagliptin).',
      'Optimize renoprotective RAAS blockade (Telmisartan / Ramipril) while monitoring serum potassium.',
      'Avoid nephrotoxic agents (NSAIDs) in CKD stage 3b.'
    ],
    patient: {
      name: 'Rajesh Sharma',
      age: 62,
      gender: 'Male',
      weightKg: 78,
      heightCm: 172,
      bmi: 26.4,
      uhid: 'MED-NEPH-84920',
      occupation: 'Senior Accountant',
      chiefComplaint: 'Quarterly diabetic follow-up, progressive bilateral pedal puffiness, fatigue, and glycemic escalation.',
      historyOfPresentIllness:
        'Patient reports persistent polydipsia, nocturia (3 times/night), and fluctuating lethargy. Home blood glucose logs show fasting BG 180-210 mg/dL and postprandial BG 240-290 mg/dL. Denies chest pain, orthopnea, or hematuria.',
      vitals: {
        bp: '148/92 mmHg',
        hr: 74,
        rr: 16,
        temp: '36.8 °C (98.2 °F)',
        spo2: '98% on room air'
      },
      labs: {
        'HbA1c': '9.2% (Baseline 8.1% 6 months ago)',
        'Serum Creatinine': '1.82 mg/dL (Elevated)',
        'eGFR (CKD-EPI)': '38 mL/min/1.73m² (Stage 3b CKD)',
        'Blood Urea Nitrogen (BUN)': '34 mg/dL',
        'Serum Potassium (K+)': '4.5 mEq/L (Normal)',
        'Serum Sodium (Na+)': '138 mEq/L',
        'Urine ACR': '180 mg/g (Moderately increased microalbuminuria)',
        'Fasting Plasma Glucose': '194 mg/dL',
        'AST / ALT': '24 / 28 U/L (Normal)'
      },
      eGFR: 38,
      creatinineClearance: 41,
      organDysfunction: ['Moderate to Severe Renal Impairment (CKD Stage 3b)', 'Microalbuminuria'],
      knownAllergies: [],
      concurrentMedications: ['Metformin 1000 mg PO BD (Warning: Overdose for eGFR 38)', 'Amlodipine 5 mg PO OD'],
      coMorbidities: ['Type 2 Diabetes Mellitus (12 yrs)', 'Essential Hypertension (8 yrs)', 'Diabetic Nephropathy']
    },
    criticalContraindications: [
      {
        drugIdOrGroup: 'metformin_high_dose',
        reason: 'Metformin dose > 1000 mg/day in eGFR 30-44 mL/min carries severe risk of Metformin-Associated Lactic Acidosis (MALA). Max safe dose is 500-1000 mg/day, or discontinue.',
        severity: 'High'
      },
      {
        drugIdOrGroup: 'glibenclamide',
        reason: 'Glibenclamide active metabolites accumulate in renal impairment (eGFR < 60 mL/min), causing severe, prolonged fatal hypoglycemia.',
        severity: 'Absolute'
      },
      {
        drugIdOrGroup: 'ibuprofen',
        reason: 'NSAIDs inhibit renal prostaglandins, precipitating acute renal hemodynamics failure and accelerating CKD progression.',
        severity: 'Absolute'
      },
      {
        drugIdOrGroup: 'diclofenac',
        reason: 'NSAIDs cause afferent arteriolar constriction and acute-on-chronic kidney injury.',
        severity: 'Absolute'
      }
    ],
    essentialDrugGroups: [
      {
        groupName: 'SGLT2 Inhibitor (Renal & Cardiovascular Protection)',
        acceptedDrugIds: ['empagliflozin', 'dapagliflozin'],
        rationale: 'Class 1A KDIGO/ADA recommendation for CKD Stage 3b with microalbuminuria to halt eGFR decline, reduce heart failure hospitalization, and lower cardiovascular mortality.'
      },
      {
        groupName: 'Renal-Safe Second Antidiabetic Agent (GLP-1 RA or Linagliptin)',
        acceptedDrugIds: ['semaglutide_sc', 'dulaglutide', 'linagliptin'],
        rationale: 'GLP-1 RA (Semaglutide/Dulaglutide) offers potent HbA1c reduction with proven renal outcome benefits (FLOW trial) without dose adjustment. Linagliptin requires no renal adjustment.'
      },
      {
        groupName: 'Renoprotective RAAS Blocker (ARB or ACEi)',
        acceptedDrugIds: ['telmisartan', 'ramipril'],
        rationale: 'First-line for diabetic nephropathy with albuminuria (uACR > 30 mg/g) to reduce intraglomerular pressure and proteinuria.'
      }
    ],
    goldStandardPrescription: [
      {
        id: 'gs-1',
        drugId: 'empagliflozin',
        drugName: 'Empagliflozin 10 mg',
        genericName: 'Empagliflozin',
        dose: 10,
        doseUnit: 'mg',
        route: 'Oral',
        frequency: 'OD',
        durationDays: 90,
        specialInstructions: 'Take once daily in the morning with or without food. Maintain adequate hydration.'
      },
      {
        id: 'gs-2',
        drugId: 'semaglutide_sc',
        drugName: 'Semaglutide 0.5 mg SC Pen',
        genericName: 'Semaglutide',
        dose: 0.5,
        doseUnit: 'mg',
        route: 'SC',
        frequency: 'Once Weekly',
        durationDays: 90,
        specialInstructions: 'Inject subcutaneously once weekly into abdomen or thigh on the same day each week.'
      },
      {
        id: 'gs-3',
        drugId: 'telmisartan',
        drugName: 'Telmisartan 40 mg',
        genericName: 'Telmisartan',
        dose: 40,
        doseUnit: 'mg',
        route: 'Oral',
        frequency: 'OD',
        durationDays: 90,
        specialInstructions: 'Take once daily. Monitor serum creatinine and potassium in 2-4 weeks.'
      }
    ],
    clinicalDebrief: {
      pathophysiology:
        'In diabetic kidney disease with eGFR 38 mL/min, hyperglycemia induces hyperfiltration and glomerular sclerosis. Metformin clearance is reduced by ~60%, causing biguanide tissue accumulation and inhibiting hepatic gluconeogenesis/mitochondrial complex I, which drives anaerobic lactate production and triggers life-threatening Metformin-Associated Lactic Acidosis (MALA).',
      pharmacotherapyRationale:
        'SGLT2 inhibitors (Empagliflozin 10mg / Dapagliflozin 10mg) induce tubuloglomerular feedback by increasing distal sodium delivery to the macula densa, constricting the hyperfiltrating afferent arteriole and reducing intraglomerular hypertension. GLP-1 receptor agonists provide potent glycemic control without hypoglycemia risk and lower cardiovascular and renal endpoints.',
      safetyPitfalls:
        'Never maintain Metformin at 2000 mg/day in eGFR 38 mL/min; if kept, max dose is 500-1000 mg/day. Never prescribe Glibenclamide in CKD due to active metabolites. Strictly avoid NSAIDs for pain in CKD patients.',
      guidelineRecommendations:
        'KDIGO 2024 and ADA 2024 consensus: 1. SGLT2i + GLP-1 RA for all T2D patients with CKD eGFR >= 20 mL/min. 2. ACEi or ARB titrated to maximum tolerated dose for uACR > 30 mg/g. 3. Metformin capped at <= 1000 mg/day for eGFR 30-44 mL/min and stopped if eGFR < 30 mL/min.'
    }
  },

  {
    id: 'case-cap-penicillin-allergy',
    caseNumber: 2,
    title: 'Community-Acquired Pneumonia with Severe Penicillin Anaphylaxis',
    subtitle: 'Navigating Fatal Beta-Lactam Hypersensitivity & Target Antimicrobial Stewardship',
    specialty: 'Infectious Diseases & Pulmonology',
    difficulty: 'Advanced',
    clinicalSummary:
      'A 48-year-old female presents with acute right lower lobe Community-Acquired Pneumonia (CURB-65 = 1, fever 39.1°C, productive cough, pleuritic pain). She has a documented history of severe IgE-mediated Penicillin Anaphylaxis (facial angioedema, stridor, hypotension requiring epinephrine and ICU resuscitation). Formulate an effective non-beta-lactam antimicrobial regimen while strictly avoiding fatal allergenic cross-reactivity.',
    diagnosis: 'Moderate Community-Acquired Pneumonia (Right Lower Lobe) in a Patient with Severe Penicillin Anaphylaxis',
    guidelineReference: 'ATS / IDSA Community-Acquired Pneumonia Guidelines 2024',
    keyLearningObjectives: [
      'Identify and strictly avoid all Penicillin class agents (Amoxicillin, Augmentin, Ampicillin, Piperacillin).',
      'Understand why severe IgE-mediated anaphylaxis mandates avoidance of beta-lactams without prior desensitization.',
      'Select first-line guideline-adherent non-beta-lactam monotherapy (Respiratory Fluoroquinolone: Levofloxacin / Moxifloxacin) OR combination (Macrolide + Doxycycline).',
      'Provide appropriate antipyretic/analgesic support (Paracetamol) and patient administration instructions.',
      'Specify correct dosing, route (Oral), frequency, and duration (5-7 days) for outpatient CAP.'
    ],
    patient: {
      name: 'Eleanor Vance',
      age: 48,
      gender: 'Female',
      weightKg: 64,
      heightCm: 165,
      bmi: 23.5,
      uhid: 'MED-PULM-33104',
      occupation: 'High School Biology Teacher',
      chiefComplaint: '4-day history of high fever (39.1°C), shivering chills, productive cough with rust-colored sputum, and right-sided pleuritic chest pain.',
      historyOfPresentIllness:
        'Patient was in usual health until 4 days ago when she developed acute shivering chills, high fever, and productive cough. Pleuritic right lower chest pain worse with deep inspiration. No prior hospitalizations in the last 12 months.',
      vitals: {
        bp: '118/76 mmHg',
        hr: 102,
        rr: 22,
        temp: '39.1 °C (102.4 °F)',
        spo2: '93% on room air'
      },
      labs: {
        'WBC Count': '15,800 /uL (86% Neutrophils, Left Shift)',
        'C-Reactive Protein (CRP)': '142 mg/L (Significantly elevated)',
        'Serum Procalcitonin': '1.8 ng/mL (Bacterial infection)',
        'Blood Urea Nitrogen': '14 mg/dL',
        'Serum Creatinine': '0.8 mg/dL',
        'eGFR': '>90 mL/min (Normal)',
        'CXR Findings': 'Dense alveolar consolidation in Right Lower Lobe with air bronchograms, no effusion',
        'CURB-65 Score': '1 (Mild-to-moderate, eligible for outpatient oral therapy with close follow-up)'
      },
      eGFR: 95,
      creatinineClearance: 98,
      organDysfunction: ['Acute Pulmonary Infection / Consolidation'],
      knownAllergies: [
        {
          allergen: 'Penicillin / Beta-Lactams',
          reactionType: 'Type 1 IgE-Mediated Immediate Anaphylaxis (Angioedema, Bronchospasm, Hypotension)',
          severity: 'Severe (Anaphylaxis)'
        }
      ],
      concurrentMedications: ['Multivitamin 1 tab OD'],
      coMorbidities: ['None (Non-smoker, Immunocompetent)']
    },
    criticalContraindications: [
      {
        drugIdOrGroup: 'amoxicillin',
        reason: 'FATAL TYPE 1 ANAPHYLAXIS RISK: Patient experienced life-threatening anaphylaxis, angioedema, and airway compromise to penicillin.',
        severity: 'Absolute'
      },
      {
        drugIdOrGroup: 'amox_clav',
        reason: 'Augmentin contains Amoxicillin and triggers immediate fatal mast-cell degranulation and anaphylactic shock in sensitized individuals.',
        severity: 'Absolute'
      },
      {
        drugIdOrGroup: 'ceftriaxone',
        reason: 'Cephalosporins carry potential cross-reactivity in severe anaphylaxis and should be avoided when safe non-beta-lactam alternatives exist.',
        severity: 'High'
      }
    ],
    essentialDrugGroups: [
      {
        groupName: 'Respiratory Fluoroquinolone OR Macrolide + Doxycycline',
        acceptedDrugIds: ['levofloxacin', 'moxifloxacin', 'azithromycin', 'doxycycline'],
        rationale: 'ATS/IDSA first-line guideline recommendation for CAP in patients with severe beta-lactam anaphylaxis, covering Streptococcus pneumoniae, Haemophilus influenzae, and atypical pathogens (Mycoplasma, Chlamydia, Legionella).'
      },
      {
        groupName: 'Antipyretic / Analgesic for Symptomatic Fever & Pleurisy',
        acceptedDrugIds: ['paracetamol'],
        rationale: 'Paracetamol provides safe, effective antipyresis and pleuritic pain relief without renal or GI toxicities.'
      }
    ],
    goldStandardPrescription: [
      {
        id: 'gs-cap-1',
        drugId: 'levofloxacin',
        drugName: 'Levofloxacin 500 mg Tablet',
        genericName: 'Levofloxacin',
        dose: 500,
        doseUnit: 'mg',
        route: 'Oral',
        frequency: 'OD',
        durationDays: 7,
        specialInstructions: 'Take once daily with a full glass of water. Space at least 2 hours away from antacids, calcium, or iron.'
      },
      {
        id: 'gs-cap-2',
        drugId: 'paracetamol',
        drugName: 'Paracetamol 650 mg',
        genericName: 'Paracetamol',
        dose: 650,
        doseUnit: 'mg',
        route: 'Oral',
        frequency: 'TDS',
        durationDays: 5,
        specialInstructions: 'Take every 8 hours as needed for fever and chest pain. Do not exceed 4000 mg in 24 hours.'
      }
    ],
    clinicalDebrief: {
      pathophysiology:
        'In IgE-mediated penicillin allergy, minor and major penicillin determinant breakdown products (penicilloyl polylysine) cross-link IgE antibodies on tissue mast cells and circulating basophils, causing explosive histamine, leukotriene, and tryptase release resulting in fatal laryngospasm, circulatory collapse, and asphyxiation.',
      pharmacotherapyRationale:
        'Respiratory fluoroquinolones (Levofloxacin 500-750 mg OD or Moxifloxacin 400 mg OD) inhibit bacterial DNA gyrase and Topoisomerase IV, achieving high pulmonary alveolar epithelial lining fluid concentrations against penicillin-resistant S. pneumoniae and atypical intracellular organisms without any beta-lactam ring cross-reactivity.',
      safetyPitfalls:
        'Never prescribe Amoxicillin, Augmentin, or Ampicillin under the assumption that "it has been a few years since the reaction". In severe anaphylaxis, do not risk cephalosporins when oral fluoroquinolones are readily available.',
      guidelineRecommendations:
        'ATS/IDSA CAP Guidelines: For outpatients with comorbidities or beta-lactam contraindications: Respiratory Fluoroquinolone monotherapy (Levofloxacin 750mg OD x 5d or 500mg OD x 7d, or Moxifloxacin 400mg OD x 5-7d) OR Macrolide (Azithromycin) + Doxycycline.'
    }
  },

  {
    id: 'case-stemi-post-pci',
    caseNumber: 3,
    title: 'Acute Anterior STEMI Post-PCI (Drug-Eluting Stent in LAD)',
    subtitle: 'Comprehensive Secondary Prevention, DAPT Optimization & Gastroprotection',
    specialty: 'Cardiology & Intensive Care',
    difficulty: 'Expert',
    clinicalSummary:
      'A 55-year-old male is admitted to the Cardiac Care Unit (CCU) following successful primary Percutaneous Coronary Intervention (PCI) with 2 Drug-Eluting Stents (DES) in the proximal LAD for an acute anterior STEMI. Left ventricular ejection fraction is 45%, LDL is 162 mg/dL. Formulate a comprehensive, evidence-based post-STEMI discharge regimen comprising Dual Antiplatelet Therapy (DAPT), high-intensity statin, cardioselective beta-blocker, ACE inhibitor, and gastroprotection.',
    diagnosis: 'Acute Anterior Wall ST-Elevation Myocardial Infarction (STEMI), Status Post Primary PCI with DES to LAD',
    guidelineReference: 'ACC / AHA / ESC 2023 Guidelines for the Management of Acute Coronary Syndromes',
    keyLearningObjectives: [
      'Prescribe Dual Antiplatelet Therapy (DAPT) with Aspirin (75-100 mg OD) + potent P2Y12 inhibitor (Ticagrelor 90 mg BD or Clopidogrel 75 mg OD) for 12 months.',
      'Initiate High-Intensity Statin therapy (Atorvastatin 80 mg OD or Rosuvastatin 20-40 mg OD) regardless of baseline cholesterol.',
      'Select a cardioselective Beta-Blocker (Metoprolol Succinate ER 25-50 mg OD or Bisoprolol) to reduce post-MI mortality and arrhythmias.',
      'Add an ACE Inhibitor (Ramipril 2.5-5 mg OD) or ARB (Telmisartan) to prevent adverse post-infarction LV remodeling in EF < 50%.',
      'Add Gastroprotection with Pantoprazole to prevent upper GI bleeding on DAPT while avoiding CYP2C19 interaction pitfalls.'
    ],
    patient: {
      name: 'Marcus Thorne',
      age: 55,
      gender: 'Male',
      weightKg: 82,
      heightCm: 178,
      bmi: 25.9,
      uhid: 'MED-CARD-90155',
      occupation: 'Civil Engineer',
      chiefComplaint: 'Post-primary PCI recovery following severe crushing retrosternal chest pain radiating to left jaw and diaphoresis.',
      historyOfPresentIllness:
        'Patient developed sudden crushing sub-sternal chest pressure while at work 6 hours ago. ECG revealed 4mm ST elevations in V1-V4 with reciprocal ST depressions in II, III, aVF. Underwent emergency coronary angiography: 99% thrombotic occlusion of proximal LAD. Successfully deployed 2 drug-eluting stents (DES) with TIMI-3 flow restoration. Transferred to CCU hemodynamically stable.',
      vitals: {
        bp: '124/80 mmHg',
        hr: 68,
        rr: 16,
        temp: '36.9 °C',
        spo2: '97% on room air'
      },
      labs: {
        'Peak High-Sensitivity Troponin I': '42,500 ng/L (Markedly elevated)',
        'CK-MB': '128 U/L',
        '2D Echocardiogram': 'LVEF 45%, Anterior and apical wall hypokinesia, no mural thrombus',
        'Total Cholesterol': '242 mg/dL',
        'LDL Cholesterol': '162 mg/dL (Target < 55 mg/dL)',
        'HDL Cholesterol': '38 mg/dL',
        'Triglycerides': '190 mg/dL',
        'Serum Creatinine': '0.95 mg/dL (eGFR 88 mL/min)',
        'Serum Potassium': '4.3 mEq/L'
      },
      eGFR: 88,
      creatinineClearance: 92,
      organDysfunction: ['Mild Left Ventricular Systolic Dysfunction (LVEF 45%)', 'Post-PCI Endothelial Injury'],
      knownAllergies: [],
      concurrentMedications: ['Unfractionated Heparin infusion completed in Cath Lab'],
      coMorbidities: ['Coronary Artery Disease (CAD)', 'Dyslipidemia', 'Ex-smoker (Quit 2 yrs ago)']
    },
    criticalContraindications: [
      {
        drugIdOrGroup: 'dapt_omission',
        reason: 'Omission of either Aspirin or P2Y12 inhibitor within 12 months of DES implantation carries up to 30% risk of acute/subacute Stent Thrombosis, catastrophic massive re-infarction, and sudden death.',
        severity: 'Absolute'
      },
      {
        drugIdOrGroup: 'propranolol',
        reason: 'Non-selective beta-blockers like Propranolol can provoke unopposed alpha-mediated coronary vasoconstriction and are inferior to cardioselective beta-1 blockers in post-MI mortality reduction.',
        severity: 'Moderate'
      },
      {
        drugIdOrGroup: 'ibuprofen',
        reason: 'NSAIDs in post-STEMI patients increase risk of myocardial rupture, recurrent infarction, heart failure, and severe DAPT-associated gastrointestinal hemorrhage.',
        severity: 'Absolute'
      }
    ],
    essentialDrugGroups: [
      {
        groupName: 'Dual Antiplatelet Therapy - Aspirin',
        acceptedDrugIds: ['aspirin'],
        rationale: 'Lifelong maintenance antiplatelet therapy (75-100 mg OD) to inhibit platelet thromboxane A2.'
      },
      {
        groupName: 'Dual Antiplatelet Therapy - P2Y12 Inhibitor',
        acceptedDrugIds: ['ticagrelor', 'clopidogrel'],
        rationale: 'Ticagrelor 90 mg BD (or Clopidogrel 75 mg OD) for 12 months minimum to prevent stent thrombosis on the newly endothelializing metallic stent struts.'
      },
      {
        groupName: 'High-Intensity Statin Therapy',
        acceptedDrugIds: ['atorvastatin', 'rosuvastatin'],
        rationale: 'Atorvastatin 80 mg OD or Rosuvastatin 20-40 mg OD is mandatory post-ACS for plaque stabilization, endothelial nitric oxide upregulation, and >50% LDL lowering.'
      },
      {
        groupName: 'Cardioselective Beta-Blocker',
        acceptedDrugIds: ['metoprolol_succinate', 'bisoprolol'],
        rationale: 'Reduces myocardial oxygen consumption, suppresses malignant ventricular arrhythmias, and improves long-term post-MI survival.'
      },
      {
        groupName: 'ACE Inhibitor / ARB for LV Remodeling',
        acceptedDrugIds: ['ramipril', 'telmisartan'],
        rationale: 'Reduces afterload, inhibits cardiac fibroblast collagen deposition, and halts adverse left ventricular dilatation in LVEF <= 45%.'
      },
      {
        groupName: 'Gastroprotection (PPI)',
        acceptedDrugIds: ['pantoprazole'],
        rationale: 'Prophylaxis against DAPT-induced gastric mucosal bleeding. Pantoprazole has negligible CYP2C19 inhibition.'
      }
    ],
    goldStandardPrescription: [
      {
        id: 'gs-stemi-1',
        drugId: 'aspirin',
        drugName: 'Aspirin 75 mg Gastro-resistant Tablet',
        genericName: 'Aspirin',
        dose: 75,
        doseUnit: 'mg',
        route: 'Oral',
        frequency: 'OD',
        durationDays: 365,
        specialInstructions: 'Take once daily after lunch/dinner with water. Lifelong therapy.'
      },
      {
        id: 'gs-stemi-2',
        drugId: 'ticagrelor',
        drugName: 'Ticagrelor 90 mg Tablet',
        genericName: 'Ticagrelor',
        dose: 90,
        doseUnit: 'mg',
        route: 'Oral',
        frequency: 'BD',
        durationDays: 365,
        specialInstructions: 'Take 1 tablet every 12 hours with or without food. Do not miss doses.'
      },
      {
        id: 'gs-stemi-3',
        drugId: 'atorvastatin',
        drugName: 'Atorvastatin 80 mg Tablet',
        genericName: 'Atorvastatin',
        dose: 80,
        doseUnit: 'mg',
        route: 'Oral',
        frequency: 'OD',
        durationDays: 365,
        specialInstructions: 'Take once daily at bedtime.'
      },
      {
        id: 'gs-stemi-4',
        drugId: 'metoprolol_succinate',
        drugName: 'Metoprolol Succinate ER 50 mg Tablet',
        genericName: 'Metoprolol Succinate',
        dose: 50,
        doseUnit: 'mg',
        route: 'Oral',
        frequency: 'OD',
        durationDays: 365,
        specialInstructions: 'Take once daily in the morning with breakfast. Check heart rate periodically.'
      },
      {
        id: 'gs-stemi-5',
        drugId: 'ramipril',
        drugName: 'Ramipril 2.5 mg Tablet',
        genericName: 'Ramipril',
        dose: 2.5,
        doseUnit: 'mg',
        route: 'Oral',
        frequency: 'OD',
        durationDays: 365,
        specialInstructions: 'Take once daily in the morning. Titrate to 5 mg in 2 weeks as tolerated.'
      },
      {
        id: 'gs-stemi-6',
        drugId: 'pantoprazole',
        drugName: 'Pantoprazole 40 mg Tablet',
        genericName: 'Pantoprazole',
        dose: 40,
        doseUnit: 'mg',
        route: 'Oral',
        frequency: 'OD',
        durationDays: 365,
        specialInstructions: 'Take once daily 30 minutes before breakfast for GI protection while on DAPT.'
      }
    ],
    clinicalDebrief: {
      pathophysiology:
        'Following balloon expansion and drug-eluting stent placement, denuded coronary endothelium exposes prothrombotic collagen and subendothelial tissue factor. Platelets adhere via GP Ib-IX and aggregate via GPIIb/IIIa cross-linked by fibrinogen. Dual antiplatelet inhibition of COX-1 (Aspirin) and the P2Y12 ADP receptor (Ticagrelor) provides synergistic platelet blockade until the polymeric stent is re-endothelialized (~12 months).',
      pharmacotherapyRationale:
        'Secondary prevention post-STEMI relies on the "Fantastic 5" pillars: DAPT (Aspirin + Ticagrelor), High-intensity statin (Atorvastatin 80mg), Cardioselective beta-blocker (Metoprolol Succinate), ACEi/ARB (Ramipril), and a gastroprotective PPI (Pantoprazole).',
      safetyPitfalls:
        'If Clopidogrel is chosen instead of Ticagrelor, avoid Omeprazole because of CYP2C19 competitive inhibition which reduces active clopidogrel thiol metabolite generation. Always use Pantoprazole. Never prescribe NSAIDs post-MI.',
      guidelineRecommendations:
        'ESC 2023 / ACC/AHA 2023 ACS Guidelines: DAPT with Aspirin + Ticagrelor 90mg BD is Class 1A for 12 months post-PCI STEMI. Atorvastatin 80mg OD is Class 1A for all ACS patients. Beta-blockers and ACEi are Class 1A in LVEF <= 40-50%.'
    }
  },

  {
    id: 'case-severe-asthma-exacerbation',
    caseNumber: 4,
    title: 'Severe Acute Asthma Exacerbation with NSAID/Aspirin Sensitivity',
    subtitle: 'Emergency Bronchodilation, Systemic Corticosteroid Rescue & Fatal Contraindication Warning',
    specialty: 'Pulmonary & Emergency Medicine',
    difficulty: 'Advanced',
    clinicalSummary:
      'A 24-year-old female presents to the emergency room in acute respiratory distress with severe asthma exacerbation (RR 28, HR 118, SpO2 91%, PEFR 42% of predicted, speaking in broken phrases). She has a known history of Aspirin/NSAID-Exacerbated Respiratory Disease (AERD). Formulate an aggressive acute rescue regimen using inhaled SABA, SAMA, and systemic corticosteroids while avoiding catastrophic non-selective beta-blockers and NSAIDs.',
    diagnosis: 'Severe Acute Asthma Exacerbation with Aspirin-Exacerbated Respiratory Disease (AERD)',
    guidelineReference: 'Global Initiative for Asthma (GINA 2024 Guidelines) / British Thoracic Society',
    keyLearningObjectives: [
      'Prescribe high-dose inhaled/nebulized SABA (Salbutamol 2.5-5 mg) as immediate first-line bronchodilator.',
      'Add inhaled SAMA (Ipratropium Bromide 500 mcg) for synergistic anticholinergic bronchodilation in severe exacerbations.',
      'Administer early Systemic Corticosteroids (Prednisolone 40-50 mg Oral OD or IV Hydrocortisone) to suppress airway inflammation.',
      'Recognize and strictly avoid Non-Selective Beta-Blockers (Propranolol, Timolol, Carvedilol) which trigger fatal bronchospasm.',
      'Recognize and strictly avoid all NSAIDs/Aspirin due to severe Aspirin-Exacerbated Respiratory Disease (AERD).'
    ],
    patient: {
      name: 'Aisha Patel',
      age: 24,
      gender: 'Female',
      weightKg: 56,
      heightCm: 160,
      bmi: 21.9,
      uhid: 'MED-ER-55410',
      occupation: 'Graphic Designer',
      chiefComplaint: 'Acute severe dyspnea, loud wheezing, chest tightness, and inability to speak in full sentences, triggered by a viral cold 24 hours ago.',
      historyOfPresentIllness:
        'Patient had a mild upper respiratory infection over the last 2 days. This morning she developed progressively severe breathlessness and chest tightness. Took 8 puffs of her home Salbutamol inhaler without sustained relief. Arrived via emergency EMS on oxygen.',
      vitals: {
        bp: '126/82 mmHg',
        hr: 118,
        rr: 28,
        temp: '37.1 °C',
        spo2: '91% on room air (95% on 4L nasal cannula O2)'
      },
      labs: {
        'Peak Expiratory Flow Rate (PEFR)': '180 L/min (42% of predicted normal 430 L/min -> Severe Exacerbation)',
        'Arterial Blood Gas (ABG)': 'pH 7.42, PaCO2 36 mmHg (Normalizing PaCO2 in tachypneic patient signals impending respiratory muscle fatigue!), PaO2 68 mmHg, HCO3 23 mEq/L',
        'Serum Potassium': '3.9 mEq/L',
        'WBC Count': '11,200 /uL (Eosinophils 8%)',
        'Chest X-Ray': 'Bilateral lung hyperinflation with flattened diaphragms, no pneumothorax or focal infiltrate'
      },
      eGFR: 104,
      creatinineClearance: 102,
      organDysfunction: ['Severe Reversible Airway Obstruction / Impending Respiratory Fatigue'],
      knownAllergies: [
        {
          allergen: 'Aspirin & All NSAIDs (Ibuprofen, Diclofenac, Naproxen)',
          reactionType: 'AERD (Aspirin-Exacerbated Respiratory Disease - Severe Bronchospasm, Rhinorrhea, Ocular Congestion)',
          severity: 'Severe (Anaphylaxis)'
        }
      ],
      concurrentMedications: ['Budesonide/Formoterol 200/6 mcg 1 puff BD (Maintenance)', 'Salbutamol 100 mcg MDI PRN'],
      coMorbidities: ['Persistent Bronchial Asthma (Since childhood)', 'Allergic Rhinitis', 'AERD / Samter Triad']
    },
    criticalContraindications: [
      {
        drugIdOrGroup: 'propranolol',
        reason: 'FATAL BRONCHOSPASM: Non-selective beta-blockade (Propranolol, Timolol, Carvedilol) completely blocks bronchial beta-2 receptors, inducing catastrophic, therapy-resistant bronchoconstriction and fatal asphyxiation.',
        severity: 'Absolute'
      },
      {
        drugIdOrGroup: 'ibuprofen',
        reason: 'FATAL AERD ATTACK: In patients with Aspirin-Exacerbated Respiratory Disease, COX-1 inhibition shunts arachidonic acid into the 5-lipoxygenase pathway, creating massive leukotriene C4/D4/E4 release that triggers intense bronchospasm.',
        severity: 'Absolute'
      },
      {
        drugIdOrGroup: 'aspirin',
        reason: 'Strictly contraindicated in AERD / Samter triad; causes life-threatening bronchoconstriction within 30-120 minutes of ingestion.',
        severity: 'Absolute'
      },
      {
        drugIdOrGroup: 'diclofenac',
        reason: 'Potent COX-1 inhibitor triggering massive cysteinyl leukotriene surge and severe bronchospasm in AERD.',
        severity: 'Absolute'
      }
    ],
    essentialDrugGroups: [
      {
        groupName: 'Rapid-Acting Inhaled Bronchodilator (SABA)',
        acceptedDrugIds: ['salbutamol_neb', 'salbutamol_mdi'],
        rationale: 'Immediate relaxation of airway smooth muscle via beta-2 receptor adenylyl cyclase activation and intracellular cAMP rise.'
      },
      {
        groupName: 'Inhaled Anticholinergic (SAMA)',
        acceptedDrugIds: ['ipratropium_neb'],
        rationale: 'Synergistic bronchodilation with SABA via M3 muscarinic receptor blockade, reducing vagal bronchomotor tone and hospital admission rates in severe exacerbations.'
      },
      {
        groupName: 'Systemic Corticosteroid (Oral Prednisolone or IV Hydrocortisone)',
        acceptedDrugIds: ['prednisolone_oral', 'hydrocortisone_iv'],
        rationale: 'Essential to suppress mucosal inflammation, decrease microvascular permeability, and upregulate beta-2 receptor expression.'
      }
    ],
    goldStandardPrescription: [
      {
        id: 'gs-asthma-1',
        drugId: 'salbutamol_neb',
        drugName: 'Salbutamol Nebulizer Solution 2.5 mg',
        genericName: 'Salbutamol',
        dose: 2.5,
        doseUnit: 'mg',
        route: 'Inhaled',
        frequency: 'PRN',
        durationDays: 5,
        specialInstructions: 'Nebulize every 20-30 minutes for the first hour with oxygen (6 L/min), then every 2-4 hours as needed.'
      },
      {
        id: 'gs-asthma-2',
        drugId: 'ipratropium_neb',
        drugName: 'Ipratropium Bromide Nebulizer 500 mcg',
        genericName: 'Ipratropium Bromide',
        dose: 500,
        doseUnit: 'mcg',
        route: 'Inhaled',
        frequency: 'QDS',
        durationDays: 3,
        specialInstructions: 'Nebulize concurrently with Salbutamol every 4-6 hours during acute severe phase.'
      },
      {
        id: 'gs-asthma-3',
        drugId: 'prednisolone_oral',
        drugName: 'Prednisolone 40 mg Tablet',
        genericName: 'Prednisolone',
        dose: 40,
        doseUnit: 'mg',
        route: 'Oral',
        frequency: 'OD',
        durationDays: 5,
        specialInstructions: 'Take 40 mg once daily in the morning with breakfast for 5-7 days. No tapering needed for short courses.'
      }
    ],
    clinicalDebrief: {
      pathophysiology:
        'In acute severe asthma, mast cell and eosinophil degranulation causes extensive mucosal edema, tenacious mucous plugging, and intense smooth muscle bronchospasm. In AERD, basal 5-lipoxygenase activity is upregulated and LTC4 synthase is overexpressed. When COX-1 is blocked by NSAIDs/Aspirin, protective PGE2 is depleted, triggering unchecked release of potent cysteinyl leukotrienes (LTC4, LTD4, LTE4) that are 1,000 times more bronchoconstrictive than histamine.',
      pharmacotherapyRationale:
        'Combined SABA (Salbutamol) + SAMA (Ipratropium) produces additive bronchodilation because they act through distinct second-messenger pathways (cAMP stimulation vs cGMP inhibition). Systemic steroids (Prednisolone 40-50mg OD) take 4-6 hours to initiate genomic anti-inflammatory effects and restore beta-receptor responsiveness.',
      safetyPitfalls:
        'Never prescribe non-selective beta-blockers (Propranolol, Carvedilol, Timolol eye drops). Never give Aspirin, Ibuprofen, or Diclofenac to an asthma patient with known AERD; use Paracetamol for pain/fever.',
      guidelineRecommendations:
        'GINA 2024 / BTS Guidelines: Severe Acute Asthma: 1. High-dose inhaled SABA (2.5-5mg neb) + SAMA (500mcg neb). 2. Early systemic corticosteroid (Oral Prednisolone 40-50mg OD x 5-7 days or IV Hydrocortisone 100mg QDS). 3. Controlled O2 to maintain SpO2 93-95%.'
    }
  }
];

// -------------------------------------------------------------
// LIVE CONTRAINDICATION & INTERACTION CHECKER ENGINE
// -------------------------------------------------------------
export function evaluateLivePrescriptionSafety(
  currentPrescription: PrescribedItem[],
  selectedCase: ClinicalCase
): LiveAlert[] {
  const alerts: LiveAlert[] = [];
  const patient = selectedCase.patient;
  const prescribedDrugIds = currentPrescription.map(p => p.drugId);

  // 1. Check Allergy Contraindications
  for (const item of currentPrescription) {
    const drug = CLINICAL_FORMULARY.find(d => d.id === item.drugId);
    if (!drug) continue;

    // Check against patient's allergies
    for (const allergy of patient.knownAllergies) {
      const allergenLower = allergy.allergen.toLowerCase();

      // Penicillin allergy check
      if (
        allergenLower.includes('penicillin') ||
        allergenLower.includes('beta-lactam')
      ) {
        if (drug.allergyGroup === 'penicillin') {
          alerts.push({
            id: `alert-allergy-${drug.id}`,
            type: 'Allergy Contraindication',
            severity: 'contraindicated',
            drugName: drug.name,
            title: `CRITICAL ALLERGY ALERT: ${drug.name} in Penicillin Hypersensitivity`,
            message: `Patient has a documented history of ${allergy.reactionType}. Prescribing ${drug.name} (${drug.genericName}) carries extreme risk of fatal Type 1 anaphylaxis.`,
            mechanism: 'Cross-linking of drug-hapten complex to IgE on mast cells triggering explosive systemic degranulation.',
            recommendation: 'IMMEDIATELY REMOVE. Select non-beta-lactam alternatives: Respiratory Fluoroquinolones (Levofloxacin/Moxifloxacin) or Macrolide (Azithromycin) + Doxycycline.'
          });
        }
      }

      // NSAID / Aspirin allergy check
      if (allergenLower.includes('aspirin') || allergenLower.includes('nsaid')) {
        if (drug.allergyGroup === 'nsaid' || drug.id === 'aspirin' || drug.id === 'ibuprofen' || drug.id === 'diclofenac') {
          alerts.push({
            id: `alert-nsaid-${drug.id}`,
            type: 'Allergy Contraindication',
            severity: 'contraindicated',
            drugName: drug.name,
            title: `CRITICAL ALERT: ${drug.name} in AERD / NSAID Sensitivity`,
            message: `Patient has documented severe Aspirin-Exacerbated Respiratory Disease (AERD). Ingesting ${drug.name} will trigger severe, potentially fatal bronchospasm.`,
            mechanism: 'COX-1 inhibition depletes bronchoprotective PGE2 and shunts arachidonic acid to 5-LOX, generating massive cysteinyl leukotriene surge.',
            recommendation: 'STRICTLY AVOID all NSAIDs and Aspirin. Use Paracetamol (Acetaminophen) for analgesia/antipyresis.'
          });
        }
      }
    }

    // 2. Check Renal Dysfunction (eGFR) & Dosing Thresholds
    if (patient.eGFR < 60) {
      // Metformin in CKD
      if (drug.id === 'metformin') {
        if (patient.eGFR < 30) {
          alerts.push({
            id: `alert-metformin-severe-ckd`,
            type: 'Renal Warning',
            severity: 'contraindicated',
            drugName: drug.name,
            title: `CONTRAINDICATED: Metformin in Severe CKD (eGFR ${patient.eGFR} mL/min)`,
            message: `Metformin is absolutely contraindicated when eGFR < 30 mL/min due to high mortality risk from Metformin-Associated Lactic Acidosis (MALA).`,
            mechanism: 'Impaired renal excretion causes biguanide accumulation, blocking mitochondrial oxidative phosphorylation and driving anaerobic lactate production.',
            recommendation: 'Discontinue Metformin. Use renal-safe options: SGLT2i (down to eGFR 20), GLP-1 RA (Semaglutide/Dulaglutide), or Linagliptin.'
          });
        } else if (patient.eGFR < 45 && item.dose > 1000) {
          alerts.push({
            id: `alert-metformin-moderate-ckd`,
            type: 'Dosing Alert',
            severity: 'major',
            drugName: drug.name,
            title: `DOSE EXCESS: Metformin ${item.dose} mg/day in CKD Stage 3b (eGFR ${patient.eGFR} mL/min)`,
            message: `FDA and KDIGO guidelines restrict maximum Metformin dose to 500-1000 mg/day for eGFR between 30 and 44 mL/min. Current dose of ${item.dose} mg exceeds safe limits.`,
            mechanism: 'Decreased tubular clearance increases systemic biguanide levels.',
            recommendation: 'Reduce Metformin dose to 500 mg BD or 1000 mg OD, or replace with SGLT2i / GLP-1 RA.'
          });
        } else if (patient.eGFR < 45) {
          alerts.push({
            id: `alert-metformin-ckd-info`,
            type: 'Renal Warning',
            severity: 'moderate',
            drugName: drug.name,
            title: `Renal Caution: Metformin in CKD Stage 3b (eGFR ${patient.eGFR} mL/min)`,
            message: `Metformin requires close monitoring of renal function every 3-6 months. Ensure total daily dose does not exceed 1000 mg.`,
            mechanism: 'Renal excretion.',
            recommendation: 'Monitor eGFR regularly; discontinue if eGFR drops below 30 mL/min.'
          });
        }
      }

      // Glibenclamide in CKD
      if (drug.id === 'glibenclamide') {
        alerts.push({
          id: `alert-glibenclamide-ckd`,
          type: 'Renal Warning',
          severity: 'contraindicated',
          drugName: drug.name,
          title: `CONTRAINDICATED: Glibenclamide in Renal Impairment`,
          message: `Active metabolites (4-trans-hydroxy-glibenclamide) accumulate in renal dysfunction, causing severe, prolonged, and refractory hypoglycemia.`,
          mechanism: 'Metabolite accumulation with prolonged pancreatic beta-cell stimulation.',
          recommendation: 'Avoid Glibenclamide in CKD. Choose Linagliptin, SGLT2i, or GLP-1 RA.'
        });
      }

      // NSAIDs in CKD
      if ((drug.id === 'ibuprofen' || drug.id === 'diclofenac') && patient.eGFR < 60) {
        alerts.push({
          id: `alert-nsaid-ckd-${drug.id}`,
          type: 'Renal Warning',
          severity: 'contraindicated',
          drugName: drug.name,
          title: `NEPHROTOXIC CONTRAINDICATION: ${drug.name} in CKD (eGFR ${patient.eGFR} mL/min)`,
          message: `NSAIDs cause afferent renal arteriolar vasoconstriction, precipitating acute renal decompensation and worsening chronic kidney disease.`,
          mechanism: 'Inhibition of renal vasodilatory prostacyclin (PGI2) and PGE2 synthesis.',
          recommendation: 'Avoid NSAIDs in CKD. Use Paracetamol for pain/fever.'
        });
      }
    }

    // 3. Check Specific Disease Contraindications (e.g. Asthma & Beta-Blockers)
    if (selectedCase.id === 'case-severe-asthma-exacerbation') {
      if (drug.id === 'propranolol') {
        alerts.push({
          id: `alert-propranolol-asthma`,
          type: 'Disease Contraindication',
          severity: 'contraindicated',
          drugName: drug.name,
          title: `FATAL CONTRAINDICATION: Propranolol in Bronchial Asthma`,
          message: `Non-selective beta-adrenergic antagonism blocks bronchial beta-2 receptors, precipitating acute refractory bronchospasm, respiratory failure, and death.`,
          mechanism: 'Antagonism of beta-2 adrenoceptor-mediated cyclic AMP airway relaxation.',
          recommendation: 'STRICTLY CONTRAINDICATED. Never administer non-selective beta-blockers to asthma patients.'
        });
      }
      if (drug.id === 'metoprolol_succinate' || drug.id === 'bisoprolol') {
        alerts.push({
          id: `alert-cardioselective-asthma-${drug.id}`,
          type: 'Disease Contraindication',
          severity: 'major',
          drugName: drug.name,
          title: `HIGH CAUTION: ${drug.name} during Acute Asthma Exacerbation`,
          message: `Even cardioselective beta-1 blockers can lose selectivity at higher doses and impair response to rescue SABA (Salbutamol) during acute status asthmaticus.`,
          mechanism: 'Partial beta-2 blockade and competitive inhibition of high-dose SABA.',
          recommendation: 'Avoid beta-blockers during acute severe exacerbation unless critically indicated under specialist monitoring.'
        });
      }
    }

    // 4. Case 3 STEMI Post-PCI checks
    if (selectedCase.id === 'case-stemi-post-pci') {
      if (drug.id === 'ibuprofen' || drug.id === 'diclofenac') {
        alerts.push({
          id: `alert-nsaid-post-stemi`,
          type: 'Disease Contraindication',
          severity: 'contraindicated',
          drugName: drug.name,
          title: `CONTRAINDICATED: NSAID (${drug.name}) Post-Myocardial Infarction`,
          message: `NSAIDs in post-MI patients are associated with increased mortality, recurrent infarction, heart failure, and catastrophic GI bleeding on DAPT.`,
          mechanism: 'Inhibition of vascular prostacyclin, fluid retention, and platelet interference.',
          recommendation: 'Avoid NSAIDs after myocardial infarction. Use Paracetamol for analgesia.'
        });
      }
    }
  }

  // 5. Check Drug-Drug Interactions within the current prescription
  if (prescribedDrugIds.includes('clopidogrel') && prescribedDrugIds.includes('omeprazole')) {
    alerts.push({
      id: 'alert-ddi-clopidogrel-omeprazole',
      type: 'Drug-Drug Interaction',
      severity: 'major',
      drugName: 'Clopidogrel + Omeprazole',
      title: 'MAJOR INTERACTION: Omeprazole reduces Clopidogrel Antiplatelet Efficacy',
      message: 'Omeprazole is a potent inhibitor of CYP2C19, which converts prodrug Clopidogrel into its active platelet-inhibiting thiol metabolite. This significantly increases the risk of stent thrombosis.',
      mechanism: 'Competitive inhibition of hepatic CYP2C19 bioactivation.',
      recommendation: 'Switch Omeprazole to Pantoprazole (minimal CYP2C19 affinity) or use Ticagrelor.'
    });
  }

  // Duplicate NSAID check
  const nsaidCount = currentPrescription.filter(p => {
    const d = CLINICAL_FORMULARY.find(f => f.id === p.drugId);
    return d && d.drugClass.includes('NSAID') && d.id !== 'aspirin';
  }).length;

  if (nsaidCount > 1) {
    alerts.push({
      id: 'alert-ddi-duplicate-nsaid',
      type: 'Drug-Drug Interaction',
      severity: 'major',
      drugName: 'Multiple NSAIDs',
      title: 'DUPLICATE THERAPY: Multiple Concurrent NSAIDs Prescribed',
      message: 'Combining two systemic NSAIDs provides no additive analgesic efficacy but dramatically multiplies risks of severe GI ulceration, acute renal failure, and bleeding.',
      mechanism: 'Additive COX inhibition with synergistic mucosal and renal toxicity.',
      recommendation: 'Select a single appropriate analgesic agent.'
    });
  }

  return alerts;
}

// -------------------------------------------------------------
// MILLER PYRAMID COMPETENCY EVALUATION ENGINE
// -------------------------------------------------------------
export function gradePrescriptionSubmission(
  currentPrescription: PrescribedItem[],
  selectedCase: ClinicalCase
): MillerEvaluation {
  let efficacyScore = 0; // Max 35
  let safetyScore = 35; // Max 35 (starts at 35, penalized for errors)
  let dosingAccuracyScore = 0; // Max 15
  let prescriptionCompletenessScore = 0; // Max 15

  const matchedEssentialDrugs: string[] = [];
  const missedEssentialDrugs: string[] = [];
  const dangerousPrescriptions: string[] = [];
  const dosingIssues: string[] = [];
  const feedbackNotes: string[] = [];

  const prescribedDrugIds = currentPrescription.map(p => p.drugId);

  // 1. Efficacy Evaluation: Check Essential Drug Groups (Max 35 points)
  const pointsPerGroup = 35 / selectedCase.essentialDrugGroups.length;
  for (const group of selectedCase.essentialDrugGroups) {
    const matched = group.acceptedDrugIds.some(id => prescribedDrugIds.includes(id));
    if (matched) {
      efficacyScore += pointsPerGroup;
      matchedEssentialDrugs.push(group.groupName);
      feedbackNotes.push(`+ Correctly included guideline-recommended class: ${group.groupName}`);
    } else {
      missedEssentialDrugs.push(group.groupName);
      feedbackNotes.push(`- Missed essential therapy: ${group.groupName} (${group.rationale})`);
    }
  }

  // 2. Safety & Contraindication Evaluation (Max 35 points)
  const alerts = evaluateLivePrescriptionSafety(currentPrescription, selectedCase);
  for (const alert of alerts) {
    if (alert.severity === 'contraindicated') {
      safetyScore -= 25;
      dangerousPrescriptions.push(`${alert.drugName}: ${alert.title}`);
      feedbackNotes.push(`CRITICAL SAFETY ERROR (-25 pts): ${alert.message}`);
    } else if (alert.severity === 'major') {
      safetyScore -= 12;
      dangerousPrescriptions.push(`${alert.drugName}: ${alert.title}`);
      feedbackNotes.push(`MAJOR SAFETY WARNING (-12 pts): ${alert.message}`);
    } else if (alert.severity === 'moderate') {
      safetyScore -= 5;
      feedbackNotes.push(`MODERATE SAFETY CAUTION (-5 pts): ${alert.message}`);
    }
  }

  // If empty prescription
  if (currentPrescription.length === 0) {
    safetyScore = 0;
    feedbackNotes.push('No medications prescribed. A complete prescription is required.');
  }

  safetyScore = Math.max(0, Math.min(35, safetyScore));
  efficacyScore = Math.max(0, Math.min(35, efficacyScore));

  // 3. Dosing Accuracy Evaluation (Max 15 points)
  if (currentPrescription.length > 0) {
    let validDoseCount = 0;
    for (const item of currentPrescription) {
      const formulary = CLINICAL_FORMULARY.find(f => f.id === item.drugId);
      if (!formulary) continue;

      let isDoseCorrect = true;

      // Check against standard available doses
      if (item.dose <= 0 || !formulary.availableDoses.includes(item.dose)) {
        isDoseCorrect = false;
        dosingIssues.push(`${item.drugName}: Non-standard dose of ${item.dose} ${item.doseUnit} (Standard: ${formulary.availableDoses.join(', ')} ${item.doseUnit}).`);
      }

      // Check renal dose caps
      if (selectedCase.patient.eGFR < 45 && formulary.id === 'metformin' && item.dose > 1000) {
        isDoseCorrect = false;
        dosingIssues.push(`${item.drugName}: Dose of ${item.dose} mg exceeds CKD 3b max limit of 1000 mg/day.`);
      }

      if (isDoseCorrect) {
        validDoseCount++;
      }
    }

    const doseRatio = validDoseCount / currentPrescription.length;
    dosingAccuracyScore = Math.round(doseRatio * 15);
  }

  // 4. Prescription Completeness (Routes, Frequencies, Durations, Instructions) (Max 15 points)
  if (currentPrescription.length > 0) {
    let completenessPoints = 0;
    let completeItemsCount = 0;

    for (const item of currentPrescription) {
      const formulary = CLINICAL_FORMULARY.find(f => f.id === item.drugId);
      let isItemComplete = true;

      if (!item.route || (formulary && !formulary.availableRoutes.includes(item.route as any))) {
        isItemComplete = false;
      }
      if (!item.frequency || (formulary && !formulary.availableFrequencies.includes(item.frequency as any))) {
        isItemComplete = false;
      }
      if (item.durationDays <= 0) {
        isItemComplete = false;
      }
      if (!item.specialInstructions || item.specialInstructions.trim().length < 5) {
        isItemComplete = false;
      }

      if (isItemComplete) {
        completeItemsCount++;
      }
    }

    completenessPoints = Math.round((completeItemsCount / currentPrescription.length) * 15);
    prescriptionCompletenessScore = Math.min(15, completenessPoints);
  }

  const overallScore = Math.round(efficacyScore + safetyScore + dosingAccuracyScore + prescriptionCompletenessScore);
  const passed = overallScore >= 70 && dangerousPrescriptions.length === 0;

  let letterGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F' = 'F';
  if (overallScore >= 92 && dangerousPrescriptions.length === 0) letterGrade = 'A+';
  else if (overallScore >= 82 && dangerousPrescriptions.length === 0) letterGrade = 'A';
  else if (overallScore >= 74) letterGrade = 'B+';
  else if (overallScore >= 65) letterGrade = 'B';
  else if (overallScore >= 50) letterGrade = 'C';
  else letterGrade = 'F';

  // Miller Pyramid Rubric Breakdown
  const knowsScore = Math.min(100, Math.round((efficacyScore / 35) * 100));
  const knowsHowScore = Math.min(100, Math.round((safetyScore / 35) * 100));
  const showsHowScore = Math.min(100, Math.round(((dosingAccuracyScore + prescriptionCompletenessScore) / 30) * 100));
  const doesScore = Math.min(100, Math.round(overallScore));

  const millerCompetencies = {
    knows: {
      score: knowsScore,
      summary: knowsScore >= 80 ? 'Mastery of Core Pharmacodynamics & Drug Indications' : 'Gaps in Indication & Guideline-Directed Therapy Selection',
      details: [
        `Matched ${matchedEssentialDrugs.length} of ${selectedCase.essentialDrugGroups.length} required pharmacological drug classes.`,
        missedEssentialDrugs.length === 0 ? 'All essential guideline drug pillars were identified.' : `Missed: ${missedEssentialDrugs.join(', ')}`
      ]
    },
    knowsHow: {
      score: knowsHowScore,
      summary: dangerousPrescriptions.length === 0 ? 'Exemplary Contraindication & Safety Screening' : 'Critical Patient Safety / Contraindication Breaches Detected',
      details: [
        dangerousPrescriptions.length === 0
          ? 'Successfully avoided all absolute contraindications, allergenic cross-reactivities, and organ toxicity risks.'
          : `Safety violations detected: ${dangerousPrescriptions.join('; ')}`,
        `Safety evaluation score: ${safetyScore}/35 pts.`
      ]
    },
    showsHow: {
      score: showsHowScore,
      summary: showsHowScore >= 80 ? 'Accurate Dosage, Route & Regimen Formulation' : 'Deficiencies in Dosing Precision or Route Specifications',
      details: [
        `Dosing precision: ${dosingAccuracyScore}/15 pts.`,
        dosingIssues.length === 0 ? 'All medication doses adhere to standard clinical ranges.' : `Dosing remarks: ${dosingIssues.join('; ')}`
      ]
    },
    does: {
      score: doesScore,
      summary: passed ? 'Clinical Readiness for Independent Practice' : 'Prescription Requires Faculty Review & Remediation',
      details: [
        `Overall Clinical Prescribing Performance: ${overallScore}% (${letterGrade}).`,
        `Completeness and patient instructions score: ${prescriptionCompletenessScore}/15 pts.`,
        passed ? 'The prescription is safe, guideline-adherent, and ready for clinical dispensing.' : 'Resolve identified safety contraindications and complete guideline regimens before dispensing.'
      ]
    }
  };

  return {
    overallScore,
    letterGrade,
    passed,
    scoreBreakdown: {
      efficacyScore: Math.round(efficacyScore),
      safetyScore: Math.round(safetyScore),
      dosingAccuracyScore: Math.round(dosingAccuracyScore),
      prescriptionCompletenessScore: Math.round(prescriptionCompletenessScore)
    },
    millerCompetencies,
    matchedEssentialDrugs,
    missedEssentialDrugs,
    dangerousPrescriptions,
    dosingIssues,
    feedbackNotes
  };
}
