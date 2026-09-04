/**
 * DrugInteractionEngine.ts
 * Enterprise Clinical Pharmacology Safety & Interaction Evaluation Engine
 * Evaluates Drug-Drug interactions, Drug-Allergy conflicts, and Renal Dose Adjustments.
 * Location: frontend/.gemini/skills/DrugInteractionEngine.ts
 */

export type SeverityLevel = 'FATAL_CONTRAINDICATION' | 'MAJOR_WARNING' | 'MODERATE_CAUTION' | 'MINOR_NOTE';

export interface DrugRecord {
  id: string;
  name: string;
  genericName: string;
  drugClass: string;
  category: 'CARDIOLOGY' | 'ANTIMICROBIAL' | 'ANALGESIC' | 'ENDOCRINE' | 'PULMONARY' | 'PSYCHIATRY' | 'HEMATOLOGY';
  standardDose: string;
  routes: ('IV' | 'PO' | 'SC' | 'IM' | 'SUBLINGUAL' | 'INHALATION')[];
  renalAdjustmentThresholdEgfr?: number;
  renalDoseRecommendation?: string;
  contraindicatedVitals?: {
    minSystolicBp?: number;
    maxHeartRate?: number;
    minHeartRate?: number;
  };
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
  }
];

/**
 * Standard Essential Formulary Records
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
  },
  {
    id: 'clopidogrel',
    name: 'Clopidogrel',
    genericName: 'Clopidogrel',
    drugClass: 'P2Y12 Inhibitor',
    category: 'CARDIOLOGY',
    standardDose: '300-600 mg loading, then 75 mg daily',
    routes: ['PO'],
  },
  {
    id: 'ticagrelor',
    name: 'Ticagrelor',
    genericName: 'Ticagrelor',
    drugClass: 'P2Y12 Inhibitor',
    category: 'CARDIOLOGY',
    standardDose: '180 mg loading, then 90 mg BD',
    routes: ['PO'],
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
  },
  {
    id: 'sildenafil',
    name: 'Sildenafil',
    genericName: 'Sildenafil citrate',
    drugClass: 'PDE-5 Inhibitor',
    category: 'CARDIOLOGY',
    standardDose: '50 mg PO PRN',
    routes: ['PO'],
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
  },
  {
    id: 'furosemide',
    name: 'Furosemide',
    genericName: 'Furosemide',
    drugClass: 'Loop Diuretic',
    category: 'CARDIOLOGY',
    standardDose: '40-80 mg IV stat',
    routes: ['IV', 'PO'],
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
  },
  {
    id: 'omeprazole',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    drugClass: 'Proton Pump Inhibitor (CYP2C19 inhibitor)',
    category: 'GASTROENTEROLOGY' as any,
    standardDose: '40 mg IV/PO daily',
    routes: ['PO', 'IV'],
  },
  {
    id: 'pantoprazole',
    name: 'Pantoprazole',
    genericName: 'Pantoprazole',
    drugClass: 'Proton Pump Inhibitor (Minimal CYP2C19 inhibition)',
    category: 'GASTROENTEROLOGY' as any,
    standardDose: '40 mg IV/PO daily',
    routes: ['PO', 'IV'],
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicillin-Clavulanate',
    genericName: 'Amoxicillin + Clavulanic Acid',
    drugClass: 'Penicillin / Beta-lactamase inhibitor',
    category: 'ANTIMICROBIAL',
    standardDose: '1.2 g IV q8h or 625 mg PO TDS',
    routes: ['PO', 'IV'],
  },
  {
    id: 'ceftriaxone',
    name: 'Ceftriaxone',
    genericName: 'Ceftriaxone sodium',
    drugClass: 'Third-generation Cephalosporin',
    category: 'ANTIMICROBIAL',
    standardDose: '2 g IV once daily',
    routes: ['IV', 'IM'],
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
 * Core Clinical Safety Check Engine
 */
export function evaluatePrescriptionSafety(
  targetDrug: DrugRecord,
  activeMedications: DrugRecord[],
  allergies: AllergyProfile[],
  patientVitals?: { systolicBp?: number; heartRate?: number },
  patientEgfr?: number
): SafetyCheckResult {
  const alerts: SafetyCheckResult['alerts'] = [];

  // 1. Drug-Drug Interactions
  activeMedications.forEach((activeDrug) => {
    HIGH_RISK_INTERACTION_RULES.forEach((rule) => {
      const matchA =
        rule.drugAClassOrName.toLowerCase() === targetDrug.name.toLowerCase() ||
        rule.drugAClassOrName.toLowerCase() === targetDrug.drugClass.toLowerCase();
      const matchB =
        rule.drugBClassOrName.toLowerCase() === activeDrug.name.toLowerCase() ||
        rule.drugBClassOrName.toLowerCase() === activeDrug.drugClass.toLowerCase();

      const matchRevA =
        rule.drugAClassOrName.toLowerCase() === activeDrug.name.toLowerCase() ||
        rule.drugAClassOrName.toLowerCase() === activeDrug.drugClass.toLowerCase();
      const matchRevB =
        rule.drugBClassOrName.toLowerCase() === targetDrug.name.toLowerCase() ||
        rule.drugBClassOrName.toLowerCase() === targetDrug.drugClass.toLowerCase();

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

  // 2. Drug-Allergy & Cross-Reactivity Check
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
        title: `Cross-Reactivity Alert: Penicillin Allergy $\\leftrightarrow$ Cephalosporin`,
        description: `Up to 2-5% cross-reactivity exists due to shared beta-lactam side chains.`,
        recommendation: 'Use with extreme caution. Contraindicated if patient had severe IgE-mediated anaphylaxis or Stevens-Johnson syndrome.',
      });
    }
  });

  // 3. Hemodynamic Vitals Contraindications
  if (patientVitals && targetDrug.contraindicatedVitals) {
    if (
      targetDrug.contraindicatedVitals.minSystolicBp &&
      patientVitals.systolicBp &&
      patientVitals.systolicBp < targetDrug.contraindicatedVitals.minSystolicBp
    ) {
      alerts.push({
        ruleId: 'VITALS-HYPOTENSION',
        severity: 'FATAL_CONTRAINDICATION',
        title: `Hemodynamic Contraindication: Hypotension`,
        description: `${targetDrug.name} requires SBP $\\ge$ ${targetDrug.contraindicatedVitals.minSystolicBp} mmHg. Current SBP is ${patientVitals.systolicBp} mmHg.`,
        recommendation: `Withhold ${targetDrug.name} immediately. Administration risks precipitous cardiovascular collapse.`,
      });
    }

    if (
      targetDrug.contraindicatedVitals.minHeartRate &&
      patientVitals.heartRate &&
      patientVitals.heartRate < targetDrug.contraindicatedVitals.minHeartRate
    ) {
      alerts.push({
        ruleId: 'VITALS-BRADYCARDIA',
        severity: 'MAJOR_WARNING',
        title: `Hemodynamic Contraindication: Bradycardia`,
        description: `${targetDrug.name} requires HR $\\ge$ ${targetDrug.contraindicatedVitals.minHeartRate} bpm. Current HR is ${patientVitals.heartRate} bpm.`,
        recommendation: `Hold dose. Assess cardiac rhythm on telemetry.`,
      });
    }
  }

  // 4. Renal Dose Adjustment
  let renalAlert: SafetyCheckResult['renalAlert'];
  if (
    patientEgfr !== undefined &&
    targetDrug.renalAdjustmentThresholdEgfr &&
    patientEgfr < targetDrug.renalAdjustmentThresholdEgfr
  ) {
    renalAlert = {
      required: true,
      recommendation: targetDrug.renalDoseRecommendation || `eGFR is ${patientEgfr} mL/min (threshold: ${targetDrug.renalAdjustmentThresholdEgfr}). Dose reduction mandatory.`,
    };
  }

  // Highest severity ranking
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
  };
}
