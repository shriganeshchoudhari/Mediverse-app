export type SeverityLevel = 'major' | 'moderate' | 'minor';
export type CYPEnzyme = 'CYP3A4' | 'CYP2D6' | 'CYP2C9' | 'CYP2C19' | 'CYP1A2' | 'P-gp';

export interface DrugInteraction {
  id: string;
  drugA: string;
  drugB: string;
  severity: SeverityLevel;
  cypEnzymeInvolved?: CYPEnzyme;
  mechanism: string;
  clinicalEffect: string;
  managementStrategy: string;
}

export interface ClinicalDrugItem {
  id: string;
  name: string;
  category: string;
  cypSubstrates: string[];
  cypInhibitors: string[];
  cypInducers: string[];
}

export const CLINICAL_DRUG_DATABASE: ClinicalDrugItem[] = [
  { id: 'warfarin', name: 'Warfarin', category: 'Anticoagulant', cypSubstrates: ['CYP2C9'], cypInhibitors: [], cypInducers: [] },
  { id: 'clopidogrel', name: 'Clopidogrel', category: 'Antiplatelet', cypSubstrates: ['CYP2C19'], cypInhibitors: [], cypInducers: [] },
  { id: 'aspirin', name: 'Aspirin', category: 'NSAID/Antiplatelet', cypSubstrates: [], cypInhibitors: [], cypInducers: [] },
  { id: 'atorvastatin', name: 'Atorvastatin', category: 'Statin', cypSubstrates: ['CYP3A4'], cypInhibitors: [], cypInducers: [] },
  { id: 'simvastatin', name: 'Simvastatin', category: 'Statin', cypSubstrates: ['CYP3A4'], cypInhibitors: [], cypInducers: [] },
  { id: 'clarithromycin', name: 'Clarithromycin', category: 'Macrolide Antibiotic', cypSubstrates: ['CYP3A4'], cypInhibitors: ['CYP3A4'], cypInducers: [] },
  { id: 'erythromycin', name: 'Erythromycin', category: 'Macrolide Antibiotic', cypSubstrates: ['CYP3A4'], cypInhibitors: ['CYP3A4'], cypInducers: [] },
  { id: 'ketoconazole', name: 'Ketoconazole', category: 'Antifungal', cypSubstrates: ['CYP3A4'], cypInhibitors: ['CYP3A4', 'CYP2C9'], cypInducers: [] },
  { id: 'fluconazole', name: 'Fluconazole', category: 'Antifungal', cypSubstrates: [], cypInhibitors: ['CYP2C9', 'CYP2C19', 'CYP3A4'], cypInducers: [] },
  { id: 'rifampin', name: 'Rifampin', category: 'Antimycobacterial', cypSubstrates: [], cypInhibitors: [], cypInducers: ['CYP3A4', 'CYP2C9', 'CYP2C19'] },
  { id: 'phenytoin', name: 'Phenytoin', category: 'Antiepileptic', cypSubstrates: ['CYP2C9'], cypInhibitors: [], cypInducers: ['CYP3A4', 'CYP2C9'] },
  { id: 'carbamazepine', name: 'Carbamazepine', category: 'Antiepileptic', cypSubstrates: ['CYP3A4'], cypInhibitors: [], cypInducers: ['CYP3A4', 'CYP2C9', 'CYP1A2'] },
  { id: 'lithium', name: 'Lithium', category: 'Mood Stabilizer', cypSubstrates: [], cypInhibitors: [], cypInducers: [] },
  { id: 'digoxin', name: 'Digoxin', category: 'Cardiac Glycoside', cypSubstrates: ['P-gp'], cypInhibitors: [], cypInducers: [] },
  { id: 'amiodarone', name: 'Amiodarone', category: 'Antiarrhythmic', cypSubstrates: ['CYP3A4'], cypInhibitors: ['CYP2C9', 'CYP2D6', 'P-gp'], cypInducers: [] },
  { id: 'metoprolol', name: 'Metoprolol', category: 'Beta Blocker', cypSubstrates: ['CYP2D6'], cypInhibitors: [], cypInducers: [] },
  { id: 'amlodipine', name: 'Amlodipine', category: 'CCB', cypSubstrates: ['CYP3A4'], cypInhibitors: [], cypInducers: [] },
  { id: 'lisinopril', name: 'Lisinopril', category: 'ACE Inhibitor', cypSubstrates: [], cypInhibitors: [], cypInducers: [] },
  { id: 'spironolactone', name: 'Spironolactone', category: 'K-Sparing Diuretic', cypSubstrates: [], cypInhibitors: [], cypInducers: [] },
  { id: 'furosemide', name: 'Furosemide', category: 'Loop Diuretic', cypSubstrates: [], cypInhibitors: [], cypInducers: [] },
  { id: 'metformin', name: 'Metformin', category: 'Biguanide', cypSubstrates: [], cypInhibitors: [], cypInducers: [] },
  { id: 'omeprazole', name: 'Omeprazole', category: 'PPI', cypSubstrates: ['CYP2C19'], cypInhibitors: ['CYP2C19'], cypInducers: ['CYP1A2'] },
  { id: 'citalopram', name: 'Citalopram', category: 'SSRI', cypSubstrates: ['CYP2C19', 'CYP3A4'], cypInhibitors: [], cypInducers: [] },
  { id: 'fluoxetine', name: 'Fluoxetine', category: 'SSRI', cypSubstrates: ['CYP2D6'], cypInhibitors: ['CYP2D6', 'CYP2C19'], cypInducers: [] },
  { id: 'tramadol', name: 'Tramadol', category: 'Opioid Analgesic', cypSubstrates: ['CYP2D6', 'CYP3A4'], cypInhibitors: [], cypInducers: [] },
  { id: 'methotrexate', name: 'Methotrexate', category: 'DMARD', cypSubstrates: [], cypInhibitors: [], cypInducers: [] },
  { id: 'sildenafil', name: 'Sildenafil', category: 'PDE5 Inhibitor', cypSubstrates: ['CYP3A4'], cypInhibitors: [], cypInducers: [] },
  { id: 'grapefruit_juice', name: 'Grapefruit juice', category: 'Food', cypSubstrates: [], cypInhibitors: ['CYP3A4'], cypInducers: [] },
  { id: 'st_johns_wort', name: "St John's Wort", category: 'Herbal Supplement', cypSubstrates: [], cypInhibitors: [], cypInducers: ['CYP3A4', 'P-gp'] },
  { id: 'nitrates', name: 'Nitrates', category: 'Vasodilator', cypSubstrates: [], cypInhibitors: [], cypInducers: [] }
];

export const DRUG_INTERACTIONS_REGISTRY: DrugInteraction[] = [
  { id: 'di1', drugA: 'warfarin', drugB: 'aspirin', severity: 'major', mechanism: 'Pharmacodynamic synergy (inhibition of platelet function + coagulation cascade).', clinicalEffect: 'Significantly increased risk of severe bleeding.', managementStrategy: 'Avoid combination if possible. If required, closely monitor for signs of bleeding.' },
  { id: 'di2', drugA: 'simvastatin', drugB: 'clarithromycin', severity: 'major', cypEnzymeInvolved: 'CYP3A4', mechanism: 'Clarithromycin strongly inhibits CYP3A4, reducing simvastatin metabolism.', clinicalEffect: 'Greatly increased risk of statin toxicity, including rhabdomyolysis.', managementStrategy: 'Contraindicated. Suspend simvastatin while on clarithromycin.' },
  { id: 'di3', drugA: 'digoxin', drugB: 'amiodarone', severity: 'major', cypEnzymeInvolved: 'P-gp', mechanism: 'Amiodarone inhibits P-gp, decreasing digoxin clearance.', clinicalEffect: 'Digoxin toxicity (arrhythmias, nausea, visual changes).', managementStrategy: 'Reduce digoxin dose by 50% when starting amiodarone. Monitor levels.' },
  { id: 'di4', drugA: 'lithium', drugB: 'nsaid', severity: 'major', mechanism: 'NSAIDs decrease renal prostaglandin synthesis, reducing lithium clearance.', clinicalEffect: 'Lithium toxicity (tremor, confusion, renal failure).', managementStrategy: 'Avoid NSAIDs; use acetaminophen. Monitor lithium levels closely if used.' },
  { id: 'di5', drugA: 'lisinopril', drugB: 'spironolactone', severity: 'major', mechanism: 'Both drugs decrease aldosterone secretion/action, retaining potassium.', clinicalEffect: 'Hyperkalemia, potentially leading to fatal arrhythmias.', managementStrategy: 'Use combination with caution. Frequently monitor serum potassium and renal function.' },
  { id: 'di6', drugA: 'clopidogrel', drugB: 'omeprazole', severity: 'moderate', cypEnzymeInvolved: 'CYP2C19', mechanism: 'Omeprazole inhibits CYP2C19, preventing clopidogrel conversion to active metabolite.', clinicalEffect: 'Decreased antiplatelet efficacy of clopidogrel.', managementStrategy: 'Use an alternative PPI (e.g., pantoprazole) or H2 blocker.' },
  { id: 'di7', drugA: 'tramadol', drugB: 'fluoxetine', severity: 'major', cypEnzymeInvolved: 'CYP2D6', mechanism: 'Fluoxetine inhibits CYP2D6 (reducing tramadol efficacy) and both increase serotonin.', clinicalEffect: 'Risk of Serotonin Syndrome and decreased analgesia.', managementStrategy: 'Avoid combination due to serotonin syndrome risk.' },
  { id: 'di8', drugA: 'sildenafil', drugB: 'nitrates', severity: 'major', mechanism: 'Both agents increase cGMP leading to smooth muscle relaxation.', clinicalEffect: 'Severe, life-threatening hypotension.', managementStrategy: 'Absolute contraindication.' },
  { id: 'di9', drugA: 'methotrexate', drugB: 'nsaid', severity: 'major', mechanism: 'NSAIDs compete for renal excretion and may displace MTX from proteins.', clinicalEffect: 'Methotrexate toxicity (myelosuppression, renal/hepatic failure).', managementStrategy: 'Avoid concurrent use, especially with high-dose MTX.' },
  { id: 'di10', drugA: 'warfarin', drugB: 'amiodarone', severity: 'major', cypEnzymeInvolved: 'CYP2C9', mechanism: 'Amiodarone inhibits CYP2C9, reducing warfarin clearance.', clinicalEffect: 'Increased INR and severe bleeding risk.', managementStrategy: 'Reduce warfarin dose by 30-50% when starting amiodarone. Monitor INR.' },
  { id: 'di11', drugA: 'atorvastatin', drugB: 'grapefruit_juice', severity: 'moderate', cypEnzymeInvolved: 'CYP3A4', mechanism: 'Grapefruit juice inhibits intestinal CYP3A4, increasing statin bioavailability.', clinicalEffect: 'Increased risk of myopathy.', managementStrategy: 'Limit grapefruit juice intake.' },
  { id: 'di12', drugA: 'simvastatin', drugB: 'amiodarone', severity: 'major', cypEnzymeInvolved: 'CYP3A4', mechanism: 'Amiodarone inhibits CYP3A4 metabolism of simvastatin.', clinicalEffect: 'Increased risk of rhabdomyolysis.', managementStrategy: 'Max simvastatin dose 20 mg/day with amiodarone.' },
  { id: 'di13', drugA: 'phenytoin', drugB: 'fluconazole', severity: 'major', cypEnzymeInvolved: 'CYP2C9', mechanism: 'Fluconazole inhibits CYP2C9 metabolism of phenytoin.', clinicalEffect: 'Phenytoin toxicity.', managementStrategy: 'Monitor phenytoin levels; anticipate dose reduction.' },
  { id: 'di14', drugA: 'carbamazepine', drugB: 'erythromycin', severity: 'major', cypEnzymeInvolved: 'CYP3A4', mechanism: 'Erythromycin inhibits CYP3A4, decreasing carbamazepine clearance.', clinicalEffect: 'Carbamazepine toxicity (ataxia, nystagmus).', managementStrategy: 'Monitor carbamazepine levels closely.' },
  { id: 'di15', drugA: 'warfarin', drugB: 'rifampin', severity: 'major', cypEnzymeInvolved: 'CYP2C9', mechanism: 'Rifampin strongly induces CYP2C9, increasing warfarin metabolism.', clinicalEffect: 'Decreased INR, risk of thrombosis.', managementStrategy: 'Monitor INR frequently; anticipate warfarin dose increase.' },
  { id: 'di16', drugA: 'tacrolimus', drugB: 'ketoconazole', severity: 'major', cypEnzymeInvolved: 'CYP3A4', mechanism: 'Ketoconazole strongly inhibits CYP3A4 and P-gp.', clinicalEffect: 'Tacrolimus toxicity (nephrotoxicity).', managementStrategy: 'Significant reduction in tacrolimus dose required.' },
  { id: 'di17', drugA: 'cyclosporine', drugB: 'st_johns_wort', severity: 'major', cypEnzymeInvolved: 'CYP3A4', mechanism: 'St Johns Wort induces CYP3A4 and P-gp.', clinicalEffect: 'Decreased cyclosporine levels, risk of organ rejection.', managementStrategy: 'Avoid St Johns Wort.' },
  { id: 'di18', drugA: 'methotrexate', drugB: 'omeprazole', severity: 'moderate', mechanism: 'PPIs may inhibit active tubular secretion of MTX.', clinicalEffect: 'Delayed MTX elimination, increased toxicity risk.', managementStrategy: 'Consider switching to H2 blocker.' },
  { id: 'di19', drugA: 'lithium', drugB: 'furosemide', severity: 'moderate', mechanism: 'Loop diuretics can induce sodium loss, increasing lithium reabsorption.', clinicalEffect: 'Increased lithium levels and potential toxicity.', managementStrategy: 'Monitor lithium levels; thiazides are riskier but loops also interact.' },
  { id: 'di20', drugA: 'metformin', drugB: 'cimetidine', severity: 'moderate', mechanism: 'Cimetidine competes for renal tubular secretion.', clinicalEffect: 'Increased metformin levels, potential lactic acidosis risk.', managementStrategy: 'Monitor renal function; consider lower metformin dose.' },
  { id: 'di21', drugA: 'citalopram', drugB: 'fluconazole', severity: 'major', cypEnzymeInvolved: 'CYP2C19', mechanism: 'Fluconazole inhibits CYP2C19, increasing citalopram levels.', clinicalEffect: 'Increased risk of QT prolongation.', managementStrategy: 'Max citalopram dose 20 mg/day.' },
  { id: 'di22', drugA: 'clopidogrel', drugB: 'fluoxetine', severity: 'moderate', cypEnzymeInvolved: 'CYP2C19', mechanism: 'Fluoxetine inhibits CYP2C19.', clinicalEffect: 'Decreased clopidogrel efficacy.', managementStrategy: 'Consider alternative antiplatelet or antidepressant.' },
  { id: 'di23', drugA: 'warfarin', drugB: 'fluconazole', severity: 'major', cypEnzymeInvolved: 'CYP2C9', mechanism: 'Fluconazole inhibits CYP2C9.', clinicalEffect: 'Increased INR and bleeding risk.', managementStrategy: 'Monitor INR closely; anticipate warfarin dose reduction.' },
  { id: 'di24', drugA: 'digoxin', drugB: 'verapamil', severity: 'major', cypEnzymeInvolved: 'P-gp', mechanism: 'Verapamil inhibits P-gp, increasing digoxin levels.', clinicalEffect: 'Digoxin toxicity.', managementStrategy: 'Reduce digoxin dose by 50%.' },
  { id: 'di25', drugA: 'sildenafil', drugB: 'clarithromycin', severity: 'major', cypEnzymeInvolved: 'CYP3A4', mechanism: 'Clarithromycin inhibits CYP3A4.', clinicalEffect: 'Increased sildenafil exposure (hypotension, priapism).', managementStrategy: 'Reduce sildenafil dose.' }
];

export function checkRegimenInteractions(drugIds: string[]): DrugInteraction[] {
  const interactions: DrugInteraction[] = [];
  for (let i = 0; i < drugIds.length; i++) {
    for (let j = i + 1; j < drugIds.length; j++) {
      const d1 = drugIds[i].toLowerCase();
      const d2 = drugIds[j].toLowerCase();
      
      const found = DRUG_INTERACTIONS_REGISTRY.find(di => 
        (di.drugA === d1 && di.drugB === d2) || (di.drugA === d2 && di.drugB === d1)
      );
      
      if (found) {
        interactions.push(found);
      }
    }
  }
  return interactions;
}
