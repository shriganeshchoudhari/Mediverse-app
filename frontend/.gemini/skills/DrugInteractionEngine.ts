/**
 * DrugInteractionEngine.ts
 * Enterprise Clinical Pharmacology Safety & Clinical Decision Support (CDS) Engine
 * Evaluates Drug-Drug interactions, CYP450 metabolism, QTc prolongation risk,
 * FDA pregnancy/teratogenicity, drug-allergy cross-reactivity, and renal dosing.
 * Location: frontend/.gemini/skills/DrugInteractionEngine.ts
 */

export type SeverityLevel = 'FATAL_CONTRAINDICATION' | 'MAJOR_WARNING' | 'MODERATE_CAUTION' | 'MINOR_NOTE';

export type PregnancyCategory = 'A' | 'B' | 'C' | 'D' | 'X';
export type QtcRiskLevel = 'HIGH' | 'MODERATE' | 'LOW' | 'NONE';
export type CypIsoenzyme = 'CYP3A4' | 'CYP2D6' | 'CYP2C19' | 'CYP2C9' | 'CYP1A2';

export interface DrugRecord {
  id: string;
  name: string;
  genericName: string;
  drugClass: string;
  category:
    | 'CARDIOLOGY'
    | 'ANTIMICROBIAL'
    | 'ANALGESIC'
    | 'ENDOCRINE'
    | 'PULMONARY'
    | 'PSYCHIATRY'
    | 'HEMATOLOGY'
    | 'GASTROENTEROLOGY'
    | 'CRITICAL_CARE';
  standardDose: string;
  routes: ('IV' | 'PO' | 'SC' | 'IM' | 'SUBLINGUAL' | 'INHALATION')[];
  renalAdjustmentThresholdEgfr?: number;
  renalDoseRecommendation?: string;
  contraindicatedVitals?: {
    minSystolicBp?: number;
    maxHeartRate?: number;
    minHeartRate?: number;
  };
  pregnancyCategory?: PregnancyCategory;
  pregnancyWarning?: string;
  qtcRisk?: QtcRiskLevel;
  cypSubstrates?: CypIsoenzyme[];
  cypInhibitors?: CypIsoenzyme[];
  cypInducers?: CypIsoenzyme[];
  isSulfaContaining?: boolean;
}

export interface DrugInteractionRule {
  id: string;
  drugAClassOrName: string;
  drugBClassOrName: string;
  severity: SeverityLevel;
  mechanism: string;
  clinicalConsequence: string;
  actionableGuidance: string;
}

export interface AllergyProfile {
  allergen: string;
  reactionType: 'ANAPHYLAXIS' | 'ANGIOEDEMA' | 'URTICARIA' | 'RASH' | 'GI_UPSET';
  severity: 'SEVERE' | 'MODERATE' | 'MILD';
}

export interface SafetyCheckResult {
  isSafeToAdminister: boolean;
  highestSeverity: SeverityLevel | 'SAFE';
  alerts: {
    ruleId: string;
    severity: SeverityLevel;
    title: string;
    description: string;
    recommendation: string;
  }[];
  renalAlert?: {
    required: boolean;
    recommendation: string;
  };
  qtcAlert?: {
    risk: QtcRiskLevel;
    additiveRisk: boolean;
    recommendation: string;
  };
  pregnancyAlert?: {
    category: PregnancyCategory;
    isContraindicated: boolean;
    description: string;
  };
}

export interface PatientSafetyContext {
  systolicBp?: number;
  heartRate?: number;
  eGfr?: number;
  patientQtcMs?: number;
  isPregnant?: boolean;
  weightKg?: number;
}

/**
 * Standard High-Risk Interaction Catalog
 */
export const HIGH_RISK_INTERACTION_RULES: DrugInteractionRule[] = [
  {
    id: 'DDI-001',
    drugAClassOrName: 'Nitroglycerin',
    drugBClassOrName: 'Sildenafil',
    severity: 'FATAL_CONTRAINDICATION',
    mechanism: 'Synergistic cGMP accumulation causing profound, refractory vasodilation.',
    clinicalConsequence: 'Life-threatening cardiogenic shock, severe hypotension, and sudden cardiac death.',
    actionableGuidance: 'Absolute contraindication within 24 hours of Sildenafil (48h for Tadalafil). Withhold all nitrate therapy immediately.'
  },
  {
    id: 'DDI-002',
    drugAClassOrName: 'Warfarin',
    drugBClassOrName: 'Ibuprofen',
    severity: 'MAJOR_WARNING',
    mechanism: 'Inhibition of platelet COX-1 combined with vitamin K antagonism and gastric mucosal injury.',
    clinicalConsequence: 'Severe gastrointestinal hemorrhage and intracranial bleed risk.',
    actionableGuidance: 'Avoid NSAIDs in patients on therapeutic anticoagulation. Switch to Acetaminophen (max 2g/day) or topical analgesics.'
  },
  {
    id: 'DDI-003',
    drugAClassOrName: 'Clopidogrel',
    drugBClassOrName: 'Omeprazole',
    severity: 'MAJOR_WARNING',
    mechanism: 'Competitive inhibition of hepatic CYP2C19 prevents bioactivation of prodrug Clopidogrel.',
    clinicalConsequence: 'Reduced antiplatelet efficacy leading to increased risk of secondary stent thrombosis and re-infarction.',
    actionableGuidance: 'Switch PPI to Pantoprazole (minimal CYP2C19 inhibition) or H2-receptor antagonist (Famotidine).'
  },
  {
    id: 'DDI-004',
    drugAClassOrName: 'Spironolactone',
    drugBClassOrName: 'Lisinopril',
    severity: 'MAJOR_WARNING',
    mechanism: 'Dual suppression of aldosterone secretion and renal potassium excretion.',
    clinicalConsequence: 'Malignant hyperkalemia (K > 6.0 mEq/L) resulting in sine wave ECG and ventricular fibrillation.',
    actionableGuidance: 'Monitor serum potassium and creatinine within 3-5 days. Withhold concurrent potassium supplements.'
  },
  {
    id: 'DDI-005',
    drugAClassOrName: 'Methotrexate',
    drugBClassOrName: 'Trimethoprim-Sulfamethoxazole',
    severity: 'FATAL_CONTRAINDICATION',
    mechanism: 'Synergistic dihydrofolate reductase inhibition and competitive displacement from albumin binding.',
    clinicalConsequence: 'Fatal bone marrow aplasia, severe pancytopenia, and mucositis.',
    actionableGuidance: 'Strictly avoid co-prescription. Utilize alternate antibiotic coverage.'
  },
  {
    id: 'DDI-006',
    drugAClassOrName: 'Fluoxetine',
    drugBClassOrName: 'Tramadol',
    severity: 'MAJOR_WARNING',
    mechanism: 'Excessive synaptic serotonin accumulation via combined reuptake inhibition and direct agonist activity.',
    clinicalConsequence: 'Serotonin Syndrome (hyperthermia, clonus, tremor, autonomic instability).',
    actionableGuidance: 'Discontinue serotonergic opioid. Consider non-serotonergic analgesia.'
  },
  {
    id: 'DDI-007',
    drugAClassOrName: 'Metoprolol',
    drugBClassOrName: 'Verapamil',
    severity: 'MAJOR_WARNING',
    mechanism: 'Synergistic negative inotropy, chronotropy, and dromotropy at AV node.',
    clinicalConsequence: 'Complete heart block, profound bradycardia, and acute cardiogenic collapse.',
    actionableGuidance: 'Avoid combined non-dihydropyridine CCB with beta-blockers without continuous cardiac pacing.'
  },
  {
    id: 'DDI-008',
    drugAClassOrName: 'Simvastatin',
    drugBClassOrName: 'Clarithromycin',
    severity: 'MAJOR_WARNING',
    mechanism: 'Potent CYP3A4 inhibition elevates statin AUC by 10-fold.',
    clinicalConsequence: 'Severe rhabdomyolysis, myoglobinuria, and acute tubular necrosis.',
    actionableGuidance: 'Temporarily hold Simvastatin while taking Clarithromycin or switch to Rosuvastatin / Azithromycin.'
  },
  {
    id: 'DDI-009',
    drugAClassOrName: 'Amiodarone',
    drugBClassOrName: 'Simvastatin',
    severity: 'MAJOR_WARNING',
    mechanism: 'Amiodarone inhibits CYP3A4, dramatically increasing active statin plasma concentrations.',
    clinicalConsequence: 'Severe toxic myopathy and rhabdomyolysis with acute kidney injury.',
    actionableGuidance: 'Limit Simvastatin dose to max 20 mg/day or switch to Pravastatin / Rosuvastatin.'
  },
  {
    id: 'DDI-010',
    drugAClassOrName: 'Amiodarone',
    drugBClassOrName: 'Warfarin',
    severity: 'FATAL_CONTRAINDICATION',
    mechanism: 'Inhibition of CYP2C9 and CYP3A4 decreases S-warfarin metabolism by 50%.',
    clinicalConsequence: 'Severe INR prolongation (> 5.0), spontaneous gastrointestinal or fatal intracranial hemorrhage.',
    actionableGuidance: 'Reduce Warfarin maintenance dose by 33% to 50% upon starting Amiodarone. Monitor INR every 48-72 hours.'
  },
  {
    id: 'DDI-011',
    drugAClassOrName: 'Azithromycin',
    drugBClassOrName: 'Amiodarone',
    severity: 'FATAL_CONTRAINDICATION',
    mechanism: 'Dual synergistic blockade of ventricular rapid delayed rectifier potassium current (I_Kr).',
    clinicalConsequence: 'Severe QTc prolongation (> 500 ms) triggering polymorphic VT (Torsades de Pointes) and cardiac arrest.',
    actionableGuidance: 'Contraindicated combination. Use non-macrolide antibiotic (e.g., Doxycycline or Ceftriaxone) in patients on Amiodarone.'
  },
  {
    id: 'DDI-012',
    drugAClassOrName: 'Methotrexate',
    drugBClassOrName: 'Aspirin',
    severity: 'MAJOR_WARNING',
    mechanism: 'Salicylates reduce renal tubular excretion of Methotrexate and displace it from plasma albumin binding sites.',
    clinicalConsequence: 'Profound methotrexate toxicity, pancytopenia, acute renal failure, and hepatotoxicity.',
    actionableGuidance: 'Avoid NSAIDs/Salicylates with high-dose methotrexate. Switch to Acetaminophen for pain control.'
  },
  {
    id: 'DDI-013',
    drugAClassOrName: 'Sulfamethoxazole-Trimethoprim',
    drugBClassOrName: 'Warfarin',
    severity: 'FATAL_CONTRAINDICATION',
    mechanism: 'Trimethoprim-sulfamethoxazole potently inhibits CYP2C9 and displaces warfarin from albumin.',
    clinicalConsequence: 'Exponential surge in free active warfarin, precipitating life-threatening internal bleeding.',
    actionableGuidance: 'Avoid co-administration. If mandatory, preemptively reduce Warfarin dose by 50% and monitor daily INR.'
  },
  {
    id: 'DDI-014',
    drugAClassOrName: 'Piperacillin-Tazobactam',
    drugBClassOrName: 'Vancomycin',
    severity: 'MAJOR_WARNING',
    mechanism: 'Synergistic oxidative stress and proximal tubule injury.',
    clinicalConsequence: '3-fold increased incidence of acute kidney injury (AKI) compared to Vancomycin + Cefepime.',
    actionableGuidance: 'Monitor serum creatinine daily. Switch Pip-Tazo to Cefepime or Meropenem in high-risk renal patients.'
  }
];

/**
 * Standard Essential Formulary Records with Full CDS Annotations
 */
export const CLINICAL_FORMULARY: DrugRecord[] = [
  {
    id: 'aspirin',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic acid',
    drugClass: 'Antiplatelet / NSAID',
    category: 'CARDIOLOGY',
    standardDose: '300 mg chewable stat',
    routes: ['PO'],
    pregnancyCategory: 'D',
    pregnancyWarning: 'Contraindicated in 3rd trimester: premature closure of fetal ductus arteriosus and bleeding risk.',
  },
  {
    id: 'clopidogrel',
    name: 'Clopidogrel',
    genericName: 'Clopidogrel bisulfate',
    drugClass: 'P2Y12 Platelet Inhibitor',
    category: 'CARDIOLOGY',
    standardDose: '300-600 mg loading, then 75 mg daily',
    routes: ['PO'],
    pregnancyCategory: 'B',
    cypSubstrates: ['CYP2C19'],
  },
  {
    id: 'ticagrelor',
    name: 'Ticagrelor',
    genericName: 'Ticagrelor',
    drugClass: 'Direct P2Y12 Platelet Inhibitor',
    category: 'CARDIOLOGY',
    standardDose: '180 mg loading, then 90 mg BD',
    routes: ['PO'],
    pregnancyCategory: 'C',
    cypSubstrates: ['CYP3A4'],
  },
  {
    id: 'nitroglycerin',
    name: 'Nitroglycerin',
    genericName: 'Glyceryl trinitrate',
    drugClass: 'Vasodilator / Nitrate',
    category: 'CARDIOLOGY',
    standardDose: '0.4 mg SL every 5 min (max 3 doses)',
    routes: ['SUBLINGUAL', 'IV'],
    contraindicatedVitals: { minSystolicBp: 90 },
    pregnancyCategory: 'C',
  },
  {
    id: 'sildenafil',
    name: 'Sildenafil',
    genericName: 'Sildenafil citrate',
    drugClass: 'PDE-5 Inhibitor',
    category: 'CARDIOLOGY',
    standardDose: '50 mg PO PRN',
    routes: ['PO'],
    pregnancyCategory: 'B',
  },
  {
    id: 'metoprolol',
    name: 'Metoprolol Tartrate',
    genericName: 'Metoprolol',
    drugClass: 'Beta-1 Selective Blocker',
    category: 'CARDIOLOGY',
    standardDose: '25-50 mg PO BD or 5 mg IV stat',
    routes: ['PO', 'IV'],
    contraindicatedVitals: { minSystolicBp: 100, minHeartRate: 60 },
    pregnancyCategory: 'C',
    cypSubstrates: ['CYP2D6'],
  },
  {
    id: 'lisinopril',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    drugClass: 'ACE Inhibitor',
    category: 'CARDIOLOGY',
    standardDose: '10 mg PO once daily',
    routes: ['PO'],
    renalAdjustmentThresholdEgfr: 30,
    renalDoseRecommendation: 'Reduce initial dose by 50% if eGFR < 30 mL/min/1.73m².',
    pregnancyCategory: 'D',
    pregnancyWarning: 'ABSOLUTE CONTRAINDICATION in 2nd/3rd trimester: causes fetal renal dysgenesis, oligohydramnios, skull hypoplasia, and fetal death.',
  },
  {
    id: 'spironolactone',
    name: 'Spironolactone',
    genericName: 'Spironolactone',
    drugClass: 'Aldosterone Antagonist',
    category: 'CARDIOLOGY',
    standardDose: '25 mg PO once daily',
    routes: ['PO'],
    renalAdjustmentThresholdEgfr: 30,
    renalDoseRecommendation: 'Contraindicated if eGFR < 30 mL/min or baseline K > 5.0 mEq/L.',
    pregnancyCategory: 'C',
    pregnancyWarning: 'Antiandrogenic activity may cause feminization of male fetus.',
  },
  {
    id: 'furosemide',
    name: 'Furosemide',
    genericName: 'Furosemide',
    drugClass: 'Loop Diuretic',
    category: 'CARDIOLOGY',
    standardDose: '40-80 mg IV stat',
    routes: ['IV', 'PO'],
    isSulfaContaining: true,
    pregnancyCategory: 'C',
  },
  {
    id: 'enoxaparin',
    name: 'Enoxaparin',
    genericName: 'Enoxaparin sodium',
    drugClass: 'Low Molecular Weight Heparin (LMWH)',
    category: 'HEMATOLOGY',
    standardDose: '1 mg/kg SC q12h',
    routes: ['SC'],
    renalAdjustmentThresholdEgfr: 30,
    renalDoseRecommendation: 'Reduce to 1 mg/kg SC once daily if eGFR < 30 mL/min. Monitor Anti-Xa levels.',
    pregnancyCategory: 'B',
  },
  {
    id: 'omeprazole',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    drugClass: 'Proton Pump Inhibitor (CYP2C19 inhibitor)',
    category: 'GASTROENTEROLOGY',
    standardDose: '40 mg IV/PO daily',
    routes: ['PO', 'IV'],
    pregnancyCategory: 'C',
    cypInhibitors: ['CYP2C19'],
  },
  {
    id: 'pantoprazole',
    name: 'Pantoprazole',
    genericName: 'Pantoprazole sodium',
    drugClass: 'Proton Pump Inhibitor (Minimal CYP2C19 inhibition)',
    category: 'GASTROENTEROLOGY',
    standardDose: '40 mg IV/PO daily',
    routes: ['PO', 'IV'],
    pregnancyCategory: 'B',
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicillin-Clavulanate',
    genericName: 'Amoxicillin + Clavulanic Acid',
    drugClass: 'Penicillin / Beta-lactamase inhibitor',
    category: 'ANTIMICROBIAL',
    standardDose: '1.2 g IV q8h or 625 mg PO TDS',
    routes: ['PO', 'IV'],
    pregnancyCategory: 'B',
  },
  {
    id: 'ceftriaxone',
    name: 'Ceftriaxone',
    genericName: 'Ceftriaxone sodium',
    drugClass: 'Third-generation Cephalosporin',
    category: 'ANTIMICROBIAL',
    standardDose: '2 g IV once daily',
    routes: ['IV', 'IM'],
    pregnancyCategory: 'B',
  },
  {
    id: 'piperacillin-tazobactam',
    name: 'Piperacillin-Tazobactam (Zosyn)',
    genericName: 'Piperacillin + Tazobactam',
    drugClass: 'Antipseudomonal Penicillin / Beta-lactamase inhibitor',
    category: 'ANTIMICROBIAL',
    standardDose: '4.5 g IV q6h (extended 4h infusion)',
    routes: ['IV'],
    renalAdjustmentThresholdEgfr: 50,
    renalDoseRecommendation: 'Reduce to 3.375 g IV q6h if eGFR 20-50, or 2.25 g IV q6h if eGFR < 20.',
    pregnancyCategory: 'B',
  },
  {
    id: 'vancomycin',
    name: 'Vancomycin IV',
    genericName: 'Vancomycin hydrochloride',
    drugClass: 'Glycopeptide Antibiotic',
    category: 'ANTIMICROBIAL',
    standardDose: '25-30 mg/kg loading, then 15-20 mg/kg IV q8-12h',
    routes: ['IV'],
    renalAdjustmentThresholdEgfr: 50,
    renalDoseRecommendation: 'Mandatory AUC-guided or trough (15-20 mcg/mL) TDM. Extend interval to q24-48h if eGFR < 30.',
    pregnancyCategory: 'C',
  },
  {
    id: 'norepinephrine',
    name: 'Norepinephrine (Levophed)',
    genericName: 'Norepinephrine bitartrate',
    drugClass: 'Alpha-1 > Beta-1 Vasopressor',
    category: 'CRITICAL_CARE',
    standardDose: '0.02 - 1.0 mcg/kg/min IV infusion titrate for MAP >= 65',
    routes: ['IV'],
    pregnancyCategory: 'C',
    contraindicatedVitals: { maxHeartRate: 180 },
  },
  {
    id: 'atorvastatin',
    name: 'Atorvastatin (Lipitor)',
    genericName: 'Atorvastatin calcium',
    drugClass: 'HMG-CoA Reductase Inhibitor (High-Intensity Statin)',
    category: 'CARDIOLOGY',
    standardDose: '80 mg PO STAT / daily',
    routes: ['PO'],
    pregnancyCategory: 'X',
    pregnancyWarning: 'ABSOLUTE CONTRAINDICATION. Fetal cholesterol synthesis suppression causes congenital skeletal anomalies and embryopathy.',
    cypSubstrates: ['CYP3A4'],
  },
  {
    id: 'amiodarone',
    name: 'Amiodarone IV/PO',
    genericName: 'Amiodarone hydrochloride',
    drugClass: 'Class III Antiarrhythmic',
    category: 'CARDIOLOGY',
    standardDose: '150-300 mg IV bolus, then 1 mg/min infusion',
    routes: ['IV', 'PO'],
    pregnancyCategory: 'D',
    pregnancyWarning: 'Transplacental passage causes fetal goiter, profound congenital hypothyroidism, and bradycardia.',
    qtcRisk: 'HIGH',
    cypInhibitors: ['CYP3A4', 'CYP2D6', 'CYP2C9'],
  },
  {
    id: 'azithromycin',
    name: 'Azithromycin (Zithromax)',
    genericName: 'Azithromycin dihydrate',
    drugClass: 'Macrolide Antibiotic',
    category: 'ANTIMICROBIAL',
    standardDose: '500 mg IV/PO daily',
    routes: ['IV', 'PO'],
    pregnancyCategory: 'B',
    qtcRisk: 'HIGH',
    cypInhibitors: ['CYP3A4'],
  },
  {
    id: 'clarithromycin',
    name: 'Clarithromycin',
    genericName: 'Clarithromycin',
    drugClass: 'Macrolide Antibiotic',
    category: 'ANTIMICROBIAL',
    standardDose: '500 mg PO BD',
    routes: ['PO'],
    pregnancyCategory: 'C',
    qtcRisk: 'HIGH',
    cypInhibitors: ['CYP3A4'],
  },
  {
    id: 'ondansetron',
    name: 'Ondansetron (Zofran)',
    genericName: 'Ondansetron hydrochloride',
    drugClass: '5-HT3 Receptor Antagonist',
    category: 'GASTROENTEROLOGY',
    standardDose: '4-8 mg IV/PO q8h PRN',
    routes: ['IV', 'PO'],
    pregnancyCategory: 'B',
    qtcRisk: 'MODERATE',
  },
  {
    id: 'haloperidol',
    name: 'Haloperidol (Haldol)',
    genericName: 'Haloperidol lactate',
    drugClass: 'First-Generation Antipsychotic',
    category: 'PSYCHIATRY',
    standardDose: '2.5-5 mg IV/IM q4-6h PRN',
    routes: ['IV', 'IM', 'PO'],
    pregnancyCategory: 'C',
    qtcRisk: 'HIGH',
    cypSubstrates: ['CYP3A4', 'CYP2D6'],
  },
  {
    id: 'methotrexate',
    name: 'Methotrexate',
    genericName: 'Methotrexate sodium',
    drugClass: 'Antifolate Antimetabolite',
    category: 'HEMATOLOGY',
    standardDose: '15-25 mg PO weekly',
    routes: ['PO', 'SC', 'IM'],
    pregnancyCategory: 'X',
    pregnancyWarning: 'ABSOLUTE CONTRAINDICATION. Potent human teratogen and abortifacient causing cranial dysostosis, facial clefts, and fetal death.',
    renalAdjustmentThresholdEgfr: 50,
    renalDoseRecommendation: 'Reduce dose by 50% for eGFR 10-50 mL/min; contraindicated if eGFR < 10 mL/min.',
  },
  {
    id: 'sulfamethoxazole-trimethoprim',
    name: 'Sulfamethoxazole-Trimethoprim (Bactrim)',
    genericName: 'Co-trimoxazole (SMX-TMP)',
    drugClass: 'Sulfonamide Antimicrobial',
    category: 'ANTIMICROBIAL',
    standardDose: '1-2 DS tablets PO BID or 15 mg/kg IV',
    routes: ['PO', 'IV'],
    isSulfaContaining: true,
    pregnancyCategory: 'D',
    pregnancyWarning: 'Contraindicated at term: bilirubin displacement causes neonatal kernicterus. Antifolate teratogenesis in 1st trimester.',
    renalAdjustmentThresholdEgfr: 30,
    renalDoseRecommendation: 'Reduce dose by 50% if eGFR 15-30 mL/min; avoid if eGFR < 15 mL/min.',
    cypInhibitors: ['CYP2C9'],
  },
  {
    id: 'simvastatin',
    name: 'Simvastatin (Zocor)',
    genericName: 'Simvastatin',
    drugClass: 'HMG-CoA Reductase Inhibitor',
    category: 'CARDIOLOGY',
    standardDose: '20-40 mg PO qHS',
    routes: ['PO'],
    pregnancyCategory: 'X',
    pregnancyWarning: 'Contraindicated in pregnancy due to suppression of essential fetal sterol synthesis.',
    cypSubstrates: ['CYP3A4'],
  },
  {
    id: 'warfarin',
    name: 'Warfarin (Coumadin)',
    genericName: 'Warfarin sodium',
    drugClass: 'Vitamin K Antagonist',
    category: 'HEMATOLOGY',
    standardDose: '2-5 mg PO daily adjusted to INR',
    routes: ['PO'],
    pregnancyCategory: 'X',
    pregnancyWarning: 'Fetal Warfarin Syndrome: nasal hypoplasia, chondrodysplasia punctata, microcephaly, and optic atrophy.',
    cypSubstrates: ['CYP2C9', 'CYP3A4'],
  }
];

/**
 * Calculates Creatinine Clearance using Cockcroft-Gault formula
 */
export function calculateCrCl(
  ageYears: number,
  weightKg: number,
  serumCreatinineMgDl: number,
  isFemale: boolean
): number {
  if (serumCreatinineMgDl <= 0) return 100;
  const factor = isFemale ? 0.85 : 1.0;
  return Math.round((((140 - ageYears) * weightKg) / (72 * serumCreatinineMgDl)) * factor);
}

/**
 * Core Clinical Decision Support (CDS) Safety Engine
 */
export function evaluatePrescriptionSafety(
  targetDrug: DrugRecord,
  activeMedications: DrugRecord[],
  allergies: AllergyProfile[],
  patientVitals?: { systolicBp?: number; heartRate?: number },
  patientEgfr?: number,
  additionalContext?: PatientSafetyContext
): SafetyCheckResult {
  const alerts: SafetyCheckResult['alerts'] = [];

  // Helper to match drug against rule pattern (handles formulations like "Amiodarone IV/PO", brand names, generics)
  const checkDrugMatch = (rulePattern: string, drug: DrugRecord) => {
    const p = rulePattern.toLowerCase();
    const dName = drug.name.toLowerCase();
    const dGen = (drug.genericName || '').toLowerCase();
    const dClass = drug.drugClass.toLowerCase();
    const dId = drug.id.toLowerCase();
    return (
      dName.includes(p) ||
      p.includes(dName) ||
      dGen.includes(p) ||
      p.includes(dGen) ||
      dClass.includes(p) ||
      p.includes(dClass) ||
      dId.includes(p) ||
      p.includes(dId)
    );
  };

  // 1. Drug-Drug Interactions (Catalog Rules)
  activeMedications.forEach((activeDrug) => {
    HIGH_RISK_INTERACTION_RULES.forEach((rule) => {
      const matchA = checkDrugMatch(rule.drugAClassOrName, targetDrug);
      const matchB = checkDrugMatch(rule.drugBClassOrName, activeDrug);
      const matchRevA = checkDrugMatch(rule.drugAClassOrName, activeDrug);
      const matchRevB = checkDrugMatch(rule.drugBClassOrName, targetDrug);

      if ((matchA && matchB) || (matchRevA && matchRevB)) {
        alerts.push({
          ruleId: rule.id,
          severity: rule.severity,
          title: `Interacting Pair: ${targetDrug.name} + ${activeDrug.name}`,
          description: `${rule.mechanism} Consequences: ${rule.clinicalConsequence}`,
          recommendation: rule.actionableGuidance,
        });
      }
    });
  });

  // 2. Drug-Allergy & Cross-Reactivity Checks
  allergies.forEach((allergy) => {
    const allergen = allergy.allergen.toLowerCase();
    const drugName = targetDrug.name.toLowerCase();
    const drugClass = targetDrug.drugClass.toLowerCase();

    // Exact allergen match
    if (drugName.includes(allergen) || drugClass.includes(allergen)) {
      alerts.push({
        ruleId: 'ALLERGY-DIRECT',
        severity: allergy.severity === 'SEVERE' ? 'FATAL_CONTRAINDICATION' : 'MAJOR_WARNING',
        title: `Direct Allergy Conflict: Patient Allergic to ${allergy.allergen}`,
        description: `Patient has a documented history of ${allergy.reactionType} to ${allergy.allergen}.`,
        recommendation: 'DO NOT ADMINISTER. Select non-cross-reactive alternative drug class.',
      });
    }

    // Penicillin - Cephalosporin Cross Reactivity
    if (allergen.includes('penicillin') && drugClass.includes('cephalosporin')) {
      alerts.push({
        ruleId: 'ALLERGY-CROSS',
        severity: allergy.severity === 'SEVERE' ? 'MAJOR_WARNING' : 'MODERATE_CAUTION',
        title: `Cross-Reactivity Alert: Penicillin Allergy <-> Cephalosporin`,
        description: `Up to 2-5% cross-reactivity exists due to shared beta-lactam core structure.`,
        recommendation: 'Use with extreme caution. Contraindicated if patient had severe IgE-mediated anaphylaxis or Stevens-Johnson syndrome.',
      });
    }

    // Sulfonamide / Sulfa Hypersensitivity Check
    if (
      (allergen.includes('sulfa') || allergen.includes('sulfonamide')) &&
      targetDrug.isSulfaContaining
    ) {
      alerts.push({
        ruleId: 'ALLERGY-SULFA',
        severity: allergy.severity === 'SEVERE' ? 'FATAL_CONTRAINDICATION' : 'MAJOR_WARNING',
        title: `Sulfonamide Allergy Alert: ${targetDrug.name}`,
        description: `Patient has a documented Sulfa allergy. ${targetDrug.name} contains a sulfonamide moiety capable of triggering life-threatening anaphylaxis or toxic epidermal necrolysis.`,
        recommendation: 'DO NOT ADMINISTER. Switch to non-sulfonamide antimicrobial or non-sulfa diuretic.',
      });
    }
  });

  // 3. QTc Prolongation Risk Scoring
  let qtcAlert: SafetyCheckResult['qtcAlert'];
  const patientQtc = additionalContext?.patientQtcMs;
  const targetQtcRisk = targetDrug.qtcRisk;

  // Check baseline QTc threshold (>= 500 ms is critical torsades danger threshold)
  if (targetQtcRisk && targetQtcRisk !== 'NONE') {
    if (patientQtc && patientQtc >= 500) {
      alerts.push({
        ruleId: 'QTC-BASELINE-CRITICAL',
        severity: 'FATAL_CONTRAINDICATION',
        title: `Malignant Baseline QTc Prolongation (${patientQtc} ms)`,
        description: `Patient baseline QTc is >= 500 ms (high danger threshold for Torsades de Pointes). Administering ${targetDrug.name} risks immediate fatal polymorphic ventricular tachycardia.`,
        recommendation: 'ABSOLUTE CONTRAINDICATION. Hold all QT-prolonging drugs. Verify serum K+ >= 4.0 mEq/L and Mg2+ >= 2.0 mg/dL.',
      });
      qtcAlert = {
        risk: 'HIGH',
        additiveRisk: true,
        recommendation: 'Baseline QTc >= 500 ms — withhold all torsadogenic agents.',
      };
    } else if (patientQtc && patientQtc >= 460) {
      alerts.push({
        ruleId: 'QTC-BASELINE-BORDERLINE',
        severity: 'MAJOR_WARNING',
        title: `Borderline Baseline QTc Prolongation (${patientQtc} ms)`,
        description: `Patient baseline QTc is prolonged (>= 460 ms). ${targetDrug.name} may push QTc past the 500 ms critical boundary.`,
        recommendation: 'Monitor continuous telemetry and obtain daily 12-lead ECG. Recheck electrolytes.',
      });
    }

    // Additive QTc risk from concurrent active meds
    const concurrentQtcMeds = activeMedications.filter(
      (m) => m.qtcRisk === 'HIGH' || m.qtcRisk === 'MODERATE'
    );
    if (concurrentQtcMeds.length > 0) {
      const isHighAdditive = targetQtcRisk === 'HIGH' && concurrentQtcMeds.some((m) => m.qtcRisk === 'HIGH');
      alerts.push({
        ruleId: 'QTC-ADDITIVE-RISK',
        severity: isHighAdditive ? 'FATAL_CONTRAINDICATION' : 'MAJOR_WARNING',
        title: `Additive QTc Prolongation: ${targetDrug.name} + ${concurrentQtcMeds.map((m) => m.name).join(', ')}`,
        description: `Combined blockade of myocardial hERG potassium channels exponentially escalates ventricular repolarization delay.`,
        recommendation: 'Avoid combination if possible. If mandatory, initiate continuous cardiac telemetry and frequent ECG tracing.',
      });
      qtcAlert = {
        risk: isHighAdditive ? 'HIGH' : 'MODERATE',
        additiveRisk: true,
        recommendation: `Additive risk with ${concurrentQtcMeds.map((m) => m.name).join(', ')}.`,
      };
    }
  }

  // 4. Cytochrome P450 (CYP) Competitive Inhibition
  if (targetDrug.cypSubstrates && targetDrug.cypSubstrates.length > 0) {
    activeMedications.forEach((activeDrug) => {
      if (activeDrug.cypInhibitors && activeDrug.cypInhibitors.length > 0) {
        const sharedIsoenzymes = targetDrug.cypSubstrates!.filter((iso) =>
          activeDrug.cypInhibitors!.includes(iso)
        );

        if (sharedIsoenzymes.length > 0) {
          // Avoid duplicate if already triggered by a catalog rule
          const isCatalogCovered = alerts.some((a) =>
            a.title.includes(targetDrug.name) && a.title.includes(activeDrug.name)
          );
          if (!isCatalogCovered) {
            alerts.push({
              ruleId: `CYP-INHIBITION-${sharedIsoenzymes[0]}`,
              severity: 'MAJOR_WARNING',
              title: `CYP450 Inhibition: ${activeDrug.name} inhibits metabolism of ${targetDrug.name}`,
              description: `${activeDrug.name} is a potent inhibitor of ${sharedIsoenzymes.join(', ')}, decreasing the clearance of ${targetDrug.name} and causing dangerous drug accumulation.`,
              recommendation: `Reduce ${targetDrug.name} dose or monitor clinical serum levels closely.`,
            });
          }
        }
      }
    });
  }

  // 5. FDA Teratogenicity & Pregnancy Contraindications
  let pregnancyAlert: SafetyCheckResult['pregnancyAlert'];
  if (additionalContext?.isPregnant && targetDrug.pregnancyCategory) {
    if (targetDrug.pregnancyCategory === 'X') {
      alerts.push({
        ruleId: 'PREGNANCY-CATEGORY-X',
        severity: 'FATAL_CONTRAINDICATION',
        title: `FDA Category X: ABSOLUTE CONTRAINDICATION in Pregnancy`,
        description: targetDrug.pregnancyWarning || `${targetDrug.name} causes proven human fetal death or severe malformations. Risks clearly outweigh any conceivable benefit.`,
        recommendation: 'DO NOT PRESCRIBE. Absolute contraindication in pregnancy. Immediately cancel order.',
      });
      pregnancyAlert = {
        category: 'X',
        isContraindicated: true,
        description: targetDrug.pregnancyWarning || 'Absolute fetal contraindication.',
      };
    } else if (targetDrug.pregnancyCategory === 'D') {
      alerts.push({
        ruleId: 'PREGNANCY-CATEGORY-D',
        severity: 'MAJOR_WARNING',
        title: `FDA Category D: Documented Fetal Risk in Pregnancy`,
        description: targetDrug.pregnancyWarning || `Positive evidence of human fetal risk. Reserve solely for life-threatening emergencies where safer drugs cannot be used.`,
        recommendation: 'Evaluate risk vs benefit. Consult Maternal-Fetal Medicine (MFM) and obtain formal informed consent.',
      });
      pregnancyAlert = {
        category: 'D',
        isContraindicated: false,
        description: targetDrug.pregnancyWarning || 'Documented human fetal risk.',
      };
    } else if (targetDrug.pregnancyCategory === 'C') {
      alerts.push({
        ruleId: 'PREGNANCY-CATEGORY-C',
        severity: 'MODERATE_CAUTION',
        title: `FDA Category C: Caution in Pregnancy`,
        description: `Animal reproduction studies show adverse fetal effects and adequate human studies are lacking. Use only if potential benefit justifies potential fetal risk.`,
        recommendation: 'Review indication with attending obstetrician.',
      });
      pregnancyAlert = {
        category: 'C',
        isContraindicated: false,
        description: 'Animal fetal risk or unestablished human safety.',
      };
    }
  }

  // 6. Hemodynamic Vitals Contraindications
  const vitals = patientVitals || additionalContext;
  if (vitals && targetDrug.contraindicatedVitals) {
    if (
      targetDrug.contraindicatedVitals.minSystolicBp &&
      vitals.systolicBp &&
      vitals.systolicBp < targetDrug.contraindicatedVitals.minSystolicBp
    ) {
      alerts.push({
        ruleId: 'VITALS-HYPOTENSION',
        severity: 'FATAL_CONTRAINDICATION',
        title: `Hemodynamic Contraindication: Severe Hypotension`,
        description: `${targetDrug.name} requires SBP >= ${targetDrug.contraindicatedVitals.minSystolicBp} mmHg. Current SBP is ${vitals.systolicBp} mmHg.`,
        recommendation: `Withhold ${targetDrug.name} immediately. Administration risks precipitous cardiovascular collapse and refractory shock.`,
      });
    }

    if (
      targetDrug.contraindicatedVitals.minHeartRate &&
      vitals.heartRate &&
      vitals.heartRate < targetDrug.contraindicatedVitals.minHeartRate
    ) {
      alerts.push({
        ruleId: 'VITALS-BRADYCARDIA',
        severity: 'MAJOR_WARNING',
        title: `Hemodynamic Contraindication: Sinus Bradycardia`,
        description: `${targetDrug.name} requires HR >= ${targetDrug.contraindicatedVitals.minHeartRate} bpm. Current HR is ${vitals.heartRate} bpm.`,
        recommendation: `Hold dose. Assess cardiac telemetry rhythm and AV conduction.`,
      });
    }

    if (
      targetDrug.contraindicatedVitals.maxHeartRate &&
      vitals.heartRate &&
      vitals.heartRate > targetDrug.contraindicatedVitals.maxHeartRate
    ) {
      alerts.push({
        ruleId: 'VITALS-TACHYCARDIA',
        severity: 'MAJOR_WARNING',
        title: `Hemodynamic Caution: Severe Tachycardia (${vitals.heartRate} bpm)`,
        description: `${targetDrug.name} should be used with extreme caution with HR > ${targetDrug.contraindicatedVitals.maxHeartRate} bpm.`,
        recommendation: `Ensure adequate volume resuscitation prior to initiating infusion.`,
      });
    }
  }

  // 7. Renal Dose Adjustments (eGFR threshold)
  const egfr = patientEgfr !== undefined ? patientEgfr : additionalContext?.eGfr;
  let renalAlert: SafetyCheckResult['renalAlert'];
  if (
    egfr !== undefined &&
    targetDrug.renalAdjustmentThresholdEgfr &&
    egfr < targetDrug.renalAdjustmentThresholdEgfr
  ) {
    renalAlert = {
      required: true,
      recommendation:
        targetDrug.renalDoseRecommendation ||
        `eGFR is ${egfr} mL/min (threshold: ${targetDrug.renalAdjustmentThresholdEgfr}). Dose reduction mandatory.`,
    };
    alerts.push({
      ruleId: 'RENAL-THRESHOLD-EXCEEDED',
      severity: 'MAJOR_WARNING',
      title: `Renal Impairment Warning (eGFR ${egfr} mL/min)`,
      description: `${targetDrug.name} requires renal dosage modification when eGFR < ${targetDrug.renalAdjustmentThresholdEgfr} mL/min.`,
      recommendation: renalAlert.recommendation,
    });
  }

  // Determine overall highest severity
  let highestSeverity: SafetyCheckResult['highestSeverity'] = 'SAFE';
  if (alerts.some((a) => a.severity === 'FATAL_CONTRAINDICATION')) {
    highestSeverity = 'FATAL_CONTRAINDICATION';
  } else if (alerts.some((a) => a.severity === 'MAJOR_WARNING')) {
    highestSeverity = 'MAJOR_WARNING';
  } else if (alerts.some((a) => a.severity === 'MODERATE_CAUTION')) {
    highestSeverity = 'MODERATE_CAUTION';
  } else if (alerts.some((a) => a.severity === 'MINOR_NOTE')) {
    highestSeverity = 'MINOR_NOTE';
  }

  return {
    isSafeToAdminister: highestSeverity !== 'FATAL_CONTRAINDICATION',
    highestSeverity,
    alerts,
    renalAlert,
    qtcAlert,
    pregnancyAlert,
  };
}
