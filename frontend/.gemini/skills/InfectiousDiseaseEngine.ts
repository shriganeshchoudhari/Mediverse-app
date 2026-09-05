/**
 * InfectiousDiseaseEngine.ts
 * Mediverse — Clinical Infectious Disease & Antibiogram Biophysical Engine
 *
 * Models:
 * - CLSI / EUCAST Minimum Inhibitory Concentration (MIC) Breakpoints (S, I, R)
 * - Pharmacodynamic Target Attainment (PK/PD):
 *   • Time above MIC (%T > MIC) for Beta-lactams (target >= 40-70% of dosing interval)
 *   • Peak / MIC ratio (Cmax / MIC >= 8-10) for Aminoglycosides
 *   • Area Under the Curve / MIC (AUC24 / MIC >= 400-600) for Vancomycin
 * - Multi-Drug Resistant Organisms (MDRO):
 *   • MRSA (mecA gene / PBP2a)
 *   • VRE (vanA / vanB operons)
 *   • ESBL (CTX-M, TEM, SHV enzymes)
 *   • CRE / Carbapenemase (KPC, NDM-1 metallo-beta-lactamase, OXA-48)
 *   • MDR Pseudomonas aeruginosa
 * - Institutional Hospital Antibiogram Matrix (% susceptible by unit: ICU vs General Medical Floor)
 * - Surviving Sepsis Campaign 1-Hour Bundle & qSOFA / SOFA Scoring
 * - Antimicrobial Stewardship: De-escalation & Renal Dosing Adjustments (CrCl Cockcroft-Gault)
 */

// ─── Enums & Types ────────────────────────────────────────────────────────────

export type SusceptibilityCategory = 'SUSCEPTIBLE' | 'INTERMEDIATE' | 'RESISTANT';

export type PathogenSpecies =
  | 'STAPHYLOCOCCUS_AUREUS'
  | 'ENTEROCOCCUS_FAECALIS'
  | 'ENTEROCOCCUS_FAECIUM'
  | 'ESCHERICHIA_COLI'
  | 'KLEBSIELLA_PNEUMONIAE'
  | 'PSEUDOMONAS_AERUGINOSA'
  | 'ACINETOBACTER_BAUMANNII'
  | 'CLOSTRIDIOIDES_DIFFICILE';

export type AntibioticDrug =
  | 'PENICILLIN_G'
  | 'OXACILLIN'
  | 'VANCOMYCIN'
  | 'DAPTOMYCIN'
  | 'LINEZOLID'
  | 'CEFAZOLIN'
  | 'CEFTRIAXONE'
  | 'CEFEPIME'
  | 'PIPERACILLIN_TAZOBACTAM'
  | 'MEROPENEM'
  | 'CIPROFLOXACIN'
  | 'GENTAMICIN'
  | 'AMIKACIN'
  | 'COLISTIN';

export type ResistanceMechanism =
  | 'WILD_TYPE'
  | 'MECA_PBP2A'
  | 'VANA_PEPTIDOGLYCAN'
  | 'ESBL_CTXM'
  | 'CARBAPENEMASE_KPC'
  | 'METALLO_BETA_LACTAMASE_NDM'
  | 'EFFLUX_PORIN_MUTATION';

export type ClinicalInfectionSite =
  | 'BLOODSTREAM_SEPSIS'
  | 'VENTILATOR_ASSOCIATED_PNEUMONIA'
  | 'COMPLICATED_UTI_PYELONEPHRITIS'
  | 'INTRA_ABDOMINAL_ABSCESS'
  | 'SKIN_SOFT_TISSUE_MRSA'
  | 'BACTERIAL_MENINGITIS';

export type SepsisSeverity = 'UNCOMPLICATED_INFECTION' | 'SEPSIS' | 'SEPTIC_SHOCK';

export type IDAlarm =
  | 'OPTIMAL'
  | 'MDRO_RESISTANCE_DETECTED'
  | 'CRE_CARBAPENEMASE_ALERT'
  | 'PKPD_TARGET_UNMET'
  | 'SEPSIS_BUNDLE_OVERDUE'
  | 'SEPTIC_SHOCK_REFRACTORY'
  | 'NEPHROTOXICITY_PEAK_TROUGH'
  | 'INAPPROPRIATE_EMPIRIC_SPECTRUM';

export type PresetId =
  | 'MRSA_BACTEREMIA_ENDOCARDITIS'
  | 'ESBL_KLEBSIELLA_PYELONEPHRITIS'
  | 'CRE_NDM_PNEUMONIA_ICU'
  | 'PSEUDOMONAS_SEPTIC_SHOCK'
  | 'VRE_INTRAABDOMINAL_SEPSIS'
  | 'COMMUNITY_ACQUIRED_PNEUMONIA_DEESCALATION';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface MICBreakpointEntry {
  antibiotic: AntibioticDrug;
  patientMicUgMl: number;
  susceptibleThreshold: number; // MIC <= threshold is S
  resistantThreshold: number; // MIC >= threshold is R
  category: SusceptibilityCategory;
  pkPdMetric: 'TIME_ABOVE_MIC' | 'AUC_MIC' | 'CMAX_MIC';
  pkPdAttainmentPct: number; // 0–100% target attainment probability
}

export interface PathogenProfile {
  species: PathogenSpecies;
  gramStain: 'GRAM_POSITIVE_COCCI_CLUSTERS' | 'GRAM_POSITIVE_COCCI_PAIRS' | 'GRAM_NEGATIVE_RODS';
  resistanceMechanism: ResistanceMechanism;
  antibiogram: MICBreakpointEntry[];
}

export interface QSOFAScore {
  respiratoryRateGe22: boolean; // 1 pt
  alteredMentationGcsLt15: boolean; // 1 pt
  systolicBpLe100: boolean; // 1 pt
  totalScore: number; // 0–3 (>=2 predicts in-hospital mortality)
}

export interface SepsisOneHourBundle {
  bloodCulturesDrawnBeforeAntibiotics: boolean;
  lactateMeasuredMmolL: number;
  broadSpectrumAntibioticsAdministered: boolean;
  crystalloid30MlPerKgGiven: boolean;
  vasopressorsAppliedIfMapLt65: boolean;
  bundleCompletedWithin60Min: boolean;
}

export interface InfectiousDiseaseState {
  patientAge: number;
  serumCreatinineMgDl: number;
  crClMlMin: number; // Cockcroft-Gault
  infectionSite: ClinicalInfectionSite;
  pathogen: PathogenProfile;
  activeRegimen: AntibioticDrug[];
  effectiveCoverage: boolean; // At least one active drug is SUSCEPTIBLE
  qsofa: QSOFAScore;
  sepsisSeverity: SepsisSeverity;
  oneHourBundle: SepsisOneHourBundle;
  serumLactateMmolL: number;
  mapMmHg: number;
  antibiogramMatrix: Record<AntibioticDrug, { icuSusceptibilityPct: number; floorSusceptibilityPct: number }>;
  stewardshipRecommendation: string;
  activeAlarms: IDAlarm[];
}

export interface PresetInfo {
  id: PresetId;
  title: string;
  description: string;
  pathogen: string;
  resistanceMechanism: string;
  antibiogramHighlight: string;
  initialState: Partial<InfectiousDiseaseInputParams>;
}

export interface InfectiousDiseaseInputParams {
  presetId: PresetId;
  patientAge: number;
  serumCreatinineMgDl: number;
  weightKg: number;
  infectionSite: ClinicalInfectionSite;
  selectedAntibiotics: AntibioticDrug[];
  bundleCulturesDrawn: boolean;
  bundleAntibioticsGiven: boolean;
  bundleFluidsGiven: boolean;
  bundleVasopressorsGiven: boolean;
  sbpMmHg: number;
  rrPerMin: number;
  gcsScore: number;
  baselineLactateMmolL: number;
}

// ─── CLSI Breakpoint Catalog ──────────────────────────────────────────────────

export const CLSI_BREAKPOINTS: Record<PathogenSpecies, Partial<Record<AntibioticDrug, { s: number; r: number; metric: 'TIME_ABOVE_MIC' | 'AUC_MIC' | 'CMAX_MIC' }>>> = {
  STAPHYLOCOCCUS_AUREUS: {
    OXACILLIN: { s: 2, r: 4, metric: 'TIME_ABOVE_MIC' },
    CEFAZOLIN: { s: 8, r: 32, metric: 'TIME_ABOVE_MIC' },
    VANCOMYCIN: { s: 2, r: 8, metric: 'AUC_MIC' },
    DAPTOMYCIN: { s: 1, r: 2, metric: 'AUC_MIC' },
    LINEZOLID: { s: 4, r: 8, metric: 'AUC_MIC' },
    GENTAMICIN: { s: 4, r: 16, metric: 'CMAX_MIC' },
  },
  ENTEROCOCCUS_FAECALIS: {
    PENICILLIN_G: { s: 8, r: 16, metric: 'TIME_ABOVE_MIC' },
    VANCOMYCIN: { s: 4, r: 32, metric: 'AUC_MIC' },
    DAPTOMYCIN: { s: 2, r: 8, metric: 'AUC_MIC' },
    LINEZOLID: { s: 2, r: 8, metric: 'AUC_MIC' },
  },
  ENTEROCOCCUS_FAECIUM: {
    VANCOMYCIN: { s: 4, r: 32, metric: 'AUC_MIC' },
    DAPTOMYCIN: { s: 4, r: 8, metric: 'AUC_MIC' },
    LINEZOLID: { s: 2, r: 8, metric: 'AUC_MIC' },
  },
  ESCHERICHIA_COLI: {
    CEFTRIAXONE: { s: 1, r: 4, metric: 'TIME_ABOVE_MIC' },
    CEFEPIME: { s: 2, r: 16, metric: 'TIME_ABOVE_MIC' },
    PIPERACILLIN_TAZOBACTAM: { s: 16, r: 128, metric: 'TIME_ABOVE_MIC' },
    MEROPENEM: { s: 1, r: 4, metric: 'TIME_ABOVE_MIC' },
    CIPROFLOXACIN: { s: 0.25, r: 1, metric: 'AUC_MIC' },
    GENTAMICIN: { s: 4, r: 16, metric: 'CMAX_MIC' },
    AMIKACIN: { s: 16, r: 64, metric: 'CMAX_MIC' },
  },
  KLEBSIELLA_PNEUMONIAE: {
    CEFTRIAXONE: { s: 1, r: 4, metric: 'TIME_ABOVE_MIC' },
    CEFEPIME: { s: 2, r: 16, metric: 'TIME_ABOVE_MIC' },
    PIPERACILLIN_TAZOBACTAM: { s: 16, r: 128, metric: 'TIME_ABOVE_MIC' },
    MEROPENEM: { s: 1, r: 4, metric: 'TIME_ABOVE_MIC' },
    CIPROFLOXACIN: { s: 0.25, r: 1, metric: 'AUC_MIC' },
    GENTAMICIN: { s: 4, r: 16, metric: 'CMAX_MIC' },
    AMIKACIN: { s: 16, r: 64, metric: 'CMAX_MIC' },
    COLISTIN: { s: 2, r: 4, metric: 'AUC_MIC' },
  },
  PSEUDOMONAS_AERUGINOSA: {
    CEFEPIME: { s: 8, r: 32, metric: 'TIME_ABOVE_MIC' },
    PIPERACILLIN_TAZOBACTAM: { s: 16, r: 128, metric: 'TIME_ABOVE_MIC' },
    MEROPENEM: { s: 2, r: 8, metric: 'TIME_ABOVE_MIC' },
    CIPROFLOXACIN: { s: 0.5, r: 2, metric: 'AUC_MIC' },
    GENTAMICIN: { s: 4, r: 16, metric: 'CMAX_MIC' },
    AMIKACIN: { s: 16, r: 64, metric: 'CMAX_MIC' },
    COLISTIN: { s: 2, r: 4, metric: 'AUC_MIC' },
  },
  ACINETOBACTER_BAUMANNII: {
    MEROPENEM: { s: 2, r: 8, metric: 'TIME_ABOVE_MIC' },
    AMIKACIN: { s: 16, r: 64, metric: 'CMAX_MIC' },
    COLISTIN: { s: 2, r: 4, metric: 'AUC_MIC' },
  },
  CLOSTRIDIOIDES_DIFFICILE: {
    VANCOMYCIN: { s: 2, r: 8, metric: 'AUC_MIC' },
  },
};

// ─── Preset Catalog ──────────────────────────────────────────────────────────

export const ID_PRESETS: Record<PresetId, PresetInfo> = {
  MRSA_BACTEREMIA_ENDOCARDITIS: {
    id: 'MRSA_BACTEREMIA_ENDOCARDITIS',
    title: 'Hospital-Acquired MRSA Bacteremia & Endocarditis',
    description: 'Blood cultures positive for Gram-positive cocci in clusters. mecA gene confirmed (PBP2a mutation) conferring class resistance to all beta-lactams including oxacillin and cefazolin. Vancomycin MIC = 1.5 ug/mL (AUC/MIC target 400–600).',
    pathogen: 'Staphylococcus aureus (MRSA)',
    resistanceMechanism: 'mecA (PBP2a altered transpeptidase)',
    antibiogramHighlight: 'Oxacillin R, Cefazolin R, Vancomycin S (MIC 1.5), Daptomycin S (MIC 0.5)',
    initialState: {
      presetId: 'MRSA_BACTEREMIA_ENDOCARDITIS',
      infectionSite: 'BLOODSTREAM_SEPSIS',
      selectedAntibiotics: ['VANCOMYCIN'],
      patientAge: 62,
      serumCreatinineMgDl: 1.2,
      weightKg: 75,
      sbpMmHg: 96,
      rrPerMin: 24,
      gcsScore: 14,
      baselineLactateMmolL: 2.8,
      bundleCulturesDrawn: true,
      bundleAntibioticsGiven: true,
      bundleFluidsGiven: true,
      bundleVasopressorsGiven: false,
    },
  },
  ESBL_KLEBSIELLA_PYELONEPHRITIS: {
    id: 'ESBL_KLEBSIELLA_PYELONEPHRITIS',
    title: 'ESBL Klebsiella pneumoniae Pyelonephritis',
    description: 'Complicated urinary tract infection with bacteremic sepsis. CTX-M extended-spectrum beta-lactamase hydrolyzes 3rd/4th generation cephalosporins and piperacillin-tazobactam. Meropenem is drug of choice.',
    pathogen: 'Klebsiella pneumoniae (ESBL+)',
    resistanceMechanism: 'CTX-M Extended-Spectrum Beta-Lactamase',
    antibiogramHighlight: 'Ceftriaxone R (MIC >64), Cefepime R (MIC 32), Pip/Tazo R, Meropenem S (MIC 0.25)',
    initialState: {
      presetId: 'ESBL_KLEBSIELLA_PYELONEPHRITIS',
      infectionSite: 'COMPLICATED_UTI_PYELONEPHRITIS',
      selectedAntibiotics: ['MEROPENEM'],
      patientAge: 58,
      serumCreatinineMgDl: 1.5,
      weightKg: 70,
      sbpMmHg: 104,
      rrPerMin: 22,
      gcsScore: 15,
      baselineLactateMmolL: 2.1,
      bundleCulturesDrawn: true,
      bundleAntibioticsGiven: true,
      bundleFluidsGiven: false,
      bundleVasopressorsGiven: false,
    },
  },
  CRE_NDM_PNEUMONIA_ICU: {
    id: 'CRE_NDM_PNEUMONIA_ICU',
    title: 'Carbapenem-Resistant Enterobacterales (CRE/NDM-1) VAP',
    description: 'ICU ventilator-associated pneumonia in a post-transplant patient. Klebsiella expressing New Delhi Metallo-beta-lactamase (NDM-1). Resistant to all carbapenems, cephalosporins, and beta-lactamase inhibitors. Colistin + Aztreonam-Avibactam synergy required.',
    pathogen: 'Klebsiella pneumoniae (CRE / NDM-1)',
    resistanceMechanism: 'NDM-1 Metallo-Beta-Lactamase (zinc-dependent)',
    antibiogramHighlight: 'Meropenem R (MIC >32), Pip/Tazo R, Cefepime R, Colistin S (MIC 0.5), Amikacin S',
    initialState: {
      presetId: 'CRE_NDM_PNEUMONIA_ICU',
      infectionSite: 'VENTILATOR_ASSOCIATED_PNEUMONIA',
      selectedAntibiotics: ['COLISTIN', 'AMIKACIN'],
      patientAge: 68,
      serumCreatinineMgDl: 1.8,
      weightKg: 80,
      sbpMmHg: 88,
      rrPerMin: 28,
      gcsScore: 11,
      baselineLactateMmolL: 4.2,
      bundleCulturesDrawn: true,
      bundleAntibioticsGiven: true,
      bundleFluidsGiven: true,
      bundleVasopressorsGiven: true,
    },
  },
  PSEUDOMONAS_SEPTIC_SHOCK: {
    id: 'PSEUDOMONAS_SEPTIC_SHOCK',
    title: 'MDR Pseudomonas aeruginosa Septic Shock',
    description: 'Neutropenic fever in acute leukemia with rapid hemodynamic collapse. Extracellular metalloprotease and elastase. Requires double antipseudomonal coverage (Cefepime + Amikacin or Meropenem + Ciprofloxacin).',
    pathogen: 'Pseudomonas aeruginosa (MDR)',
    resistanceMechanism: 'OprD porin loss + AmpC derepression + MexAB efflux',
    antibiogramHighlight: 'Cefepime S (MIC 4), Meropenem S (MIC 1), Pip/Tazo R, Cipro R, Amikacin S (MIC 4)',
    initialState: {
      presetId: 'PSEUDOMONAS_SEPTIC_SHOCK',
      infectionSite: 'BLOODSTREAM_SEPSIS',
      selectedAntibiotics: ['CEFEPIME', 'AMIKACIN'],
      patientAge: 45,
      serumCreatinineMgDl: 0.9,
      weightKg: 68,
      sbpMmHg: 76,
      rrPerMin: 30,
      gcsScore: 12,
      baselineLactateMmolL: 5.5,
      bundleCulturesDrawn: true,
      bundleAntibioticsGiven: true,
      bundleFluidsGiven: true,
      bundleVasopressorsGiven: true,
    },
  },
  VRE_INTRAABDOMINAL_SEPSIS: {
    id: 'VRE_INTRAABDOMINAL_SEPSIS',
    title: 'Vancomycin-Resistant Enterococcus (VRE) Intra-Abdominal Sepsis',
    description: 'Enterococcus faecium harboring vanA operon causing D-Ala-D-Ala to D-Ala-D-Lac cell wall reprogramming (1000-fold reduction in vancomycin binding affinity). Requires Linezolid or high-dose Daptomycin.',
    pathogen: 'Enterococcus faecium (VRE)',
    resistanceMechanism: 'vanA operon (D-Ala-D-Lac dipeptide target alteration)',
    antibiogramHighlight: 'Vancomycin R (MIC >128), Ampicillin R, Linezolid S (MIC 1.5), Daptomycin S (MIC 2)',
    initialState: {
      presetId: 'VRE_INTRAABDOMINAL_SEPSIS',
      infectionSite: 'INTRA_ABDOMINAL_ABSCESS',
      selectedAntibiotics: ['LINEZOLID'],
      patientAge: 71,
      serumCreatinineMgDl: 1.4,
      weightKg: 72,
      sbpMmHg: 98,
      rrPerMin: 22,
      gcsScore: 15,
      baselineLactateMmolL: 2.6,
      bundleCulturesDrawn: true,
      bundleAntibioticsGiven: true,
      bundleFluidsGiven: true,
      bundleVasopressorsGiven: false,
    },
  },
  COMMUNITY_ACQUIRED_PNEUMONIA_DEESCALATION: {
    id: 'COMMUNITY_ACQUIRED_PNEUMONIA_DEESCALATION',
    title: 'Antimicrobial Stewardship: De-escalation in Severe CAP',
    description: 'Patient admitted on broad-spectrum Vancomycin + Piperacillin-tazobactam. Sputum and blood cultures now reveal wild-type Streptococcus pneumoniae and MSSA. De-escalate to targeted narrow-spectrum Cefazolin or Ceftriaxone to reduce selective pressure.',
    pathogen: 'Staphylococcus aureus (MSSA / Wild-Type)',
    resistanceMechanism: 'WILD_TYPE (Beta-lactamase positive, methicillin-susceptible)',
    antibiogramHighlight: 'Oxacillin S (MIC 0.5), Cefazolin S (MIC 1), Ceftriaxone S, Vancomycin S',
    initialState: {
      presetId: 'COMMUNITY_ACQUIRED_PNEUMONIA_DEESCALATION',
      infectionSite: 'VENTILATOR_ASSOCIATED_PNEUMONIA',
      selectedAntibiotics: ['CEFAZOLIN'],
      patientAge: 52,
      serumCreatinineMgDl: 0.8,
      weightKg: 78,
      sbpMmHg: 118,
      rrPerMin: 18,
      gcsScore: 15,
      baselineLactateMmolL: 1.3,
      bundleCulturesDrawn: true,
      bundleAntibioticsGiven: true,
      bundleFluidsGiven: true,
      bundleVasopressorsGiven: false,
    },
  },
};

export const INFECTIOUS_DISEASE_PRESETS = ID_PRESETS;

// ─── Cockcroft-Gault Equation ─────────────────────────────────────────────────

export function calculateCrCl(age: number, weightKg: number, serumCrMgDl: number, isFemale = false): number {
  if (serumCrMgDl <= 0) return 100;
  const crcl = ((140 - age) * weightKg) / (72 * serumCrMgDl);
  return Math.round(isFemale ? crcl * 0.85 : crcl);
}

// ─── qSOFA Solver ─────────────────────────────────────────────────────────────

export function calculateQSOFA(rr: number, gcs: number, sbp: number): QSOFAScore {
  const respiratoryRateGe22 = rr >= 22;
  const alteredMentationGcsLt15 = gcs < 15;
  const systolicBpLe100 = sbp <= 100;

  let totalScore = 0;
  if (respiratoryRateGe22) totalScore += 1;
  if (alteredMentationGcsLt15) totalScore += 1;
  if (systolicBpLe100) totalScore += 1;

  return {
    respiratoryRateGe22,
    alteredMentationGcsLt15,
    systolicBpLe100,
    totalScore,
  };
}

// ─── Antibiogram Matrix Generator ─────────────────────────────────────────────

export function getInstitutionalAntibiogram(): Record<AntibioticDrug, { icuSusceptibilityPct: number; floorSusceptibilityPct: number }> {
  return {
    PENICILLIN_G: { icuSusceptibilityPct: 15, floorSusceptibilityPct: 22 },
    OXACILLIN: { icuSusceptibilityPct: 45, floorSusceptibilityPct: 58 },
    VANCOMYCIN: { icuSusceptibilityPct: 98, floorSusceptibilityPct: 99 },
    DAPTOMYCIN: { icuSusceptibilityPct: 99, floorSusceptibilityPct: 100 },
    LINEZOLID: { icuSusceptibilityPct: 97, floorSusceptibilityPct: 99 },
    CEFAZOLIN: { icuSusceptibilityPct: 48, floorSusceptibilityPct: 62 },
    CEFTRIAXONE: { icuSusceptibilityPct: 68, floorSusceptibilityPct: 82 },
    CEFEPIME: { icuSusceptibilityPct: 78, floorSusceptibilityPct: 89 },
    PIPERACILLIN_TAZOBACTAM: { icuSusceptibilityPct: 72, floorSusceptibilityPct: 84 },
    MEROPENEM: { icuSusceptibilityPct: 86, floorSusceptibilityPct: 96 },
    CIPROFLOXACIN: { icuSusceptibilityPct: 62, floorSusceptibilityPct: 76 },
    GENTAMICIN: { icuSusceptibilityPct: 82, floorSusceptibilityPct: 88 },
    AMIKACIN: { icuSusceptibilityPct: 94, floorSusceptibilityPct: 98 },
    COLISTIN: { icuSusceptibilityPct: 92, floorSusceptibilityPct: 98 },
  };
}

// ─── Pathogen Antibiogram Generator ───────────────────────────────────────────

export function generatePathogenProfile(presetId: PresetId): PathogenProfile {
  if (presetId === 'MRSA_BACTEREMIA_ENDOCARDITIS') {
    return {
      species: 'STAPHYLOCOCCUS_AUREUS',
      gramStain: 'GRAM_POSITIVE_COCCI_CLUSTERS',
      resistanceMechanism: 'MECA_PBP2A',
      antibiogram: [
        { antibiotic: 'OXACILLIN', patientMicUgMl: 8, susceptibleThreshold: 2, resistantThreshold: 4, category: 'RESISTANT', pkPdMetric: 'TIME_ABOVE_MIC', pkPdAttainmentPct: 0 },
        { antibiotic: 'CEFAZOLIN', patientMicUgMl: 64, susceptibleThreshold: 8, resistantThreshold: 32, category: 'RESISTANT', pkPdMetric: 'TIME_ABOVE_MIC', pkPdAttainmentPct: 0 },
        { antibiotic: 'VANCOMYCIN', patientMicUgMl: 1.5, susceptibleThreshold: 2, resistantThreshold: 8, category: 'SUSCEPTIBLE', pkPdMetric: 'AUC_MIC', pkPdAttainmentPct: 88 },
        { antibiotic: 'DAPTOMYCIN', patientMicUgMl: 0.5, susceptibleThreshold: 1, resistantThreshold: 2, category: 'SUSCEPTIBLE', pkPdMetric: 'AUC_MIC', pkPdAttainmentPct: 96 },
        { antibiotic: 'LINEZOLID', patientMicUgMl: 2, susceptibleThreshold: 4, resistantThreshold: 8, category: 'SUSCEPTIBLE', pkPdMetric: 'AUC_MIC', pkPdAttainmentPct: 92 },
        { antibiotic: 'GENTAMICIN', patientMicUgMl: 1, susceptibleThreshold: 4, resistantThreshold: 16, category: 'SUSCEPTIBLE', pkPdMetric: 'CMAX_MIC', pkPdAttainmentPct: 85 },
      ],
    };
  }

  if (presetId === 'ESBL_KLEBSIELLA_PYELONEPHRITIS') {
    return {
      species: 'KLEBSIELLA_PNEUMONIAE',
      gramStain: 'GRAM_NEGATIVE_RODS',
      resistanceMechanism: 'ESBL_CTXM',
      antibiogram: [
        { antibiotic: 'CEFTRIAXONE', patientMicUgMl: 64, susceptibleThreshold: 1, resistantThreshold: 4, category: 'RESISTANT', pkPdMetric: 'TIME_ABOVE_MIC', pkPdAttainmentPct: 0 },
        { antibiotic: 'CEFEPIME', patientMicUgMl: 32, susceptibleThreshold: 2, resistantThreshold: 16, category: 'RESISTANT', pkPdMetric: 'TIME_ABOVE_MIC', pkPdAttainmentPct: 15 },
        { antibiotic: 'PIPERACILLIN_TAZOBACTAM', patientMicUgMl: 64, susceptibleThreshold: 16, resistantThreshold: 128, category: 'INTERMEDIATE', pkPdMetric: 'TIME_ABOVE_MIC', pkPdAttainmentPct: 35 },
        { antibiotic: 'MEROPENEM', patientMicUgMl: 0.25, susceptibleThreshold: 1, resistantThreshold: 4, category: 'SUSCEPTIBLE', pkPdMetric: 'TIME_ABOVE_MIC', pkPdAttainmentPct: 98 },
        { antibiotic: 'CIPROFLOXACIN', patientMicUgMl: 4, susceptibleThreshold: 0.25, resistantThreshold: 1, category: 'RESISTANT', pkPdMetric: 'AUC_MIC', pkPdAttainmentPct: 5 },
        { antibiotic: 'AMIKACIN', patientMicUgMl: 4, susceptibleThreshold: 16, resistantThreshold: 64, category: 'SUSCEPTIBLE', pkPdMetric: 'CMAX_MIC', pkPdAttainmentPct: 95 },
      ],
    };
  }

  if (presetId === 'CRE_NDM_PNEUMONIA_ICU') {
    return {
      species: 'KLEBSIELLA_PNEUMONIAE',
      gramStain: 'GRAM_NEGATIVE_RODS',
      resistanceMechanism: 'METALLO_BETA_LACTAMASE_NDM',
      antibiogram: [
        { antibiotic: 'MEROPENEM', patientMicUgMl: 64, susceptibleThreshold: 1, resistantThreshold: 4, category: 'RESISTANT', pkPdMetric: 'TIME_ABOVE_MIC', pkPdAttainmentPct: 0 },
        { antibiotic: 'PIPERACILLIN_TAZOBACTAM', patientMicUgMl: 256, susceptibleThreshold: 16, resistantThreshold: 128, category: 'RESISTANT', pkPdMetric: 'TIME_ABOVE_MIC', pkPdAttainmentPct: 0 },
        { antibiotic: 'CEFEPIME', patientMicUgMl: 64, susceptibleThreshold: 2, resistantThreshold: 16, category: 'RESISTANT', pkPdMetric: 'TIME_ABOVE_MIC', pkPdAttainmentPct: 0 },
        { antibiotic: 'CIPROFLOXACIN', patientMicUgMl: 16, susceptibleThreshold: 0.25, resistantThreshold: 1, category: 'RESISTANT', pkPdMetric: 'AUC_MIC', pkPdAttainmentPct: 0 },
        { antibiotic: 'COLISTIN', patientMicUgMl: 0.5, susceptibleThreshold: 2, resistantThreshold: 4, category: 'SUSCEPTIBLE', pkPdMetric: 'AUC_MIC', pkPdAttainmentPct: 92 },
        { antibiotic: 'AMIKACIN', patientMicUgMl: 8, susceptibleThreshold: 16, resistantThreshold: 64, category: 'SUSCEPTIBLE', pkPdMetric: 'CMAX_MIC', pkPdAttainmentPct: 88 },
      ],
    };
  }

  if (presetId === 'PSEUDOMONAS_SEPTIC_SHOCK') {
    return {
      species: 'PSEUDOMONAS_AERUGINOSA',
      gramStain: 'GRAM_NEGATIVE_RODS',
      resistanceMechanism: 'EFFLUX_PORIN_MUTATION',
      antibiogram: [
        { antibiotic: 'CEFEPIME', patientMicUgMl: 4, susceptibleThreshold: 8, resistantThreshold: 32, category: 'SUSCEPTIBLE', pkPdMetric: 'TIME_ABOVE_MIC', pkPdAttainmentPct: 85 },
        { antibiotic: 'PIPERACILLIN_TAZOBACTAM', patientMicUgMl: 64, susceptibleThreshold: 16, resistantThreshold: 128, category: 'INTERMEDIATE', pkPdMetric: 'TIME_ABOVE_MIC', pkPdAttainmentPct: 40 },
        { antibiotic: 'MEROPENEM', patientMicUgMl: 1, susceptibleThreshold: 2, resistantThreshold: 8, category: 'SUSCEPTIBLE', pkPdMetric: 'TIME_ABOVE_MIC', pkPdAttainmentPct: 92 },
        { antibiotic: 'CIPROFLOXACIN', patientMicUgMl: 4, susceptibleThreshold: 0.5, resistantThreshold: 2, category: 'RESISTANT', pkPdMetric: 'AUC_MIC', pkPdAttainmentPct: 10 },
        { antibiotic: 'AMIKACIN', patientMicUgMl: 4, susceptibleThreshold: 16, resistantThreshold: 64, category: 'SUSCEPTIBLE', pkPdMetric: 'CMAX_MIC', pkPdAttainmentPct: 94 },
        { antibiotic: 'COLISTIN', patientMicUgMl: 1, susceptibleThreshold: 2, resistantThreshold: 4, category: 'SUSCEPTIBLE', pkPdMetric: 'AUC_MIC', pkPdAttainmentPct: 95 },
      ],
    };
  }

  if (presetId === 'VRE_INTRAABDOMINAL_SEPSIS') {
    return {
      species: 'ENTEROCOCCUS_FAECIUM',
      gramStain: 'GRAM_POSITIVE_COCCI_PAIRS',
      resistanceMechanism: 'VANA_PEPTIDOGLYCAN',
      antibiogram: [
        { antibiotic: 'VANCOMYCIN', patientMicUgMl: 128, susceptibleThreshold: 4, resistantThreshold: 32, category: 'RESISTANT', pkPdMetric: 'AUC_MIC', pkPdAttainmentPct: 0 },
        { antibiotic: 'DAPTOMYCIN', patientMicUgMl: 2, susceptibleThreshold: 4, resistantThreshold: 8, category: 'SUSCEPTIBLE', pkPdMetric: 'AUC_MIC', pkPdAttainmentPct: 90 },
        { antibiotic: 'LINEZOLID', patientMicUgMl: 1.5, susceptibleThreshold: 2, resistantThreshold: 8, category: 'SUSCEPTIBLE', pkPdMetric: 'AUC_MIC', pkPdAttainmentPct: 94 },
      ],
    };
  }

  // Wild-type CAP
  return {
    species: 'STAPHYLOCOCCUS_AUREUS',
    gramStain: 'GRAM_POSITIVE_COCCI_CLUSTERS',
    resistanceMechanism: 'WILD_TYPE',
    antibiogram: [
      { antibiotic: 'OXACILLIN', patientMicUgMl: 0.5, susceptibleThreshold: 2, resistantThreshold: 4, category: 'SUSCEPTIBLE', pkPdMetric: 'TIME_ABOVE_MIC', pkPdAttainmentPct: 98 },
      { antibiotic: 'CEFAZOLIN', patientMicUgMl: 1, susceptibleThreshold: 8, resistantThreshold: 32, category: 'SUSCEPTIBLE', pkPdMetric: 'TIME_ABOVE_MIC', pkPdAttainmentPct: 99 },
      { antibiotic: 'CEFTRIAXONE', patientMicUgMl: 0.5, susceptibleThreshold: 1, resistantThreshold: 4, category: 'SUSCEPTIBLE', pkPdMetric: 'TIME_ABOVE_MIC', pkPdAttainmentPct: 99 },
      { antibiotic: 'VANCOMYCIN', patientMicUgMl: 1, susceptibleThreshold: 2, resistantThreshold: 8, category: 'SUSCEPTIBLE', pkPdMetric: 'AUC_MIC', pkPdAttainmentPct: 94 },
    ],
  };
}

// ─── Main Solver ──────────────────────────────────────────────────────────────

export function computeInfectiousDiseaseState(params: InfectiousDiseaseInputParams): InfectiousDiseaseState {
  const {
    presetId,
    patientAge,
    serumCreatinineMgDl,
    weightKg,
    infectionSite,
    selectedAntibiotics,
    bundleCulturesDrawn,
    bundleAntibioticsGiven,
    bundleFluidsGiven,
    bundleVasopressorsGiven,
    sbpMmHg,
    rrPerMin,
    gcsScore,
    baselineLactateMmolL,
  } = params;

  const crClMlMin = calculateCrCl(patientAge, weightKg, serumCreatinineMgDl);
  const qsofa = calculateQSOFA(rrPerMin, gcsScore, sbpMmHg);
  const pathogen = generatePathogenProfile(presetId);

  // Evaluate active regimen against pathogen susceptibility
  const susceptibleEntries = pathogen.antibiogram.filter(e => e.category === 'SUSCEPTIBLE');
  const effectiveCoverage = selectedAntibiotics.some(abx =>
    susceptibleEntries.some(s => s.antibiotic === abx)
  );

  // Mean Arterial Pressure
  const dbpMmHg = Math.round(sbpMmHg * 0.65);
  let mapMmHg = Math.round((sbpMmHg + 2 * dbpMmHg) / 3);
  if (bundleFluidsGiven) mapMmHg += 8;
  if (bundleVasopressorsGiven) mapMmHg = Math.max(65, mapMmHg + 14);

  // Lactate dynamics: drops with adequate fluids and effective coverage
  let serumLactateMmolL = baselineLactateMmolL;
  if (bundleFluidsGiven && effectiveCoverage) {
    serumLactateMmolL = Math.max(1.0, serumLactateMmolL - 1.2);
  }

  // Sepsis Severity
  let sepsisSeverity: SepsisSeverity = 'UNCOMPLICATED_INFECTION';
  if (qsofa.totalScore >= 2 || serumLactateMmolL >= 2.0) {
    sepsisSeverity = 'SEPSIS';
  }
  if (mapMmHg < 65 && serumLactateMmolL > 2.0) {
    sepsisSeverity = 'SEPTIC_SHOCK';
  }

  // 1-Hour Sepsis Bundle
  const bundleCompletedWithin60Min =
    bundleCulturesDrawn &&
    bundleAntibioticsGiven &&
    bundleFluidsGiven &&
    (sepsisSeverity !== 'SEPTIC_SHOCK' || bundleVasopressorsGiven);

  const oneHourBundle: SepsisOneHourBundle = {
    bloodCulturesDrawnBeforeAntibiotics: bundleCulturesDrawn,
    lactateMeasuredMmolL: parseFloat(serumLactateMmolL.toFixed(1)),
    broadSpectrumAntibioticsAdministered: bundleAntibioticsGiven,
    crystalloid30MlPerKgGiven: bundleFluidsGiven,
    vasopressorsAppliedIfMapLt65: bundleVasopressorsGiven,
    bundleCompletedWithin60Min,
  };

  // Antimicrobial Stewardship Recommendation
  let stewardshipRecommendation = 'Continue current empiric regimen. Await speciation.';
  if (presetId === 'COMMUNITY_ACQUIRED_PNEUMONIA_DEESCALATION') {
    if (selectedAntibiotics.includes('VANCOMYCIN') || selectedAntibiotics.includes('PIPERACILLIN_TAZOBACTAM')) {
      stewardshipRecommendation = 'STEWARDSHIP ALERT: De-escalate from Vancomycin / Pip-Tazo to Cefazolin or Ceftriaxone based on MSSA / wild-type culture.';
    } else if (selectedAntibiotics.includes('CEFAZOLIN') || selectedAntibiotics.includes('CEFTRIAXONE')) {
      stewardshipRecommendation = 'EXCELLENT STEWARDSHIP: Targeted narrow-spectrum beta-lactam selected for MSSA.';
    }
  } else if (!effectiveCoverage) {
    stewardshipRecommendation = `CRITICAL COVERAGE GAP: Current regimen does NOT cover ${pathogen.species} (${pathogen.resistanceMechanism}). Review antibiogram!`;
  } else if (crClMlMin < 50 && (selectedAntibiotics.includes('VANCOMYCIN') || selectedAntibiotics.includes('CEFEPIME') || selectedAntibiotics.includes('MEROPENEM'))) {
    stewardshipRecommendation = `RENAL DOSE ADJUSTMENT: CrCl is ${crClMlMin} mL/min. Reduce dosing interval or dose to prevent neurotoxicity / nephrotoxicity.`;
  }

  // Alarms
  const activeAlarms: IDAlarm[] = [];
  if (pathogen.resistanceMechanism === 'CARBAPENEMASE_KPC' || pathogen.resistanceMechanism === 'METALLO_BETA_LACTAMASE_NDM') {
    activeAlarms.push('CRE_CARBAPENEMASE_ALERT');
  }
  if (pathogen.resistanceMechanism !== 'WILD_TYPE') {
    activeAlarms.push('MDRO_RESISTANCE_DETECTED');
  }
  if (!effectiveCoverage) {
    activeAlarms.push('INAPPROPRIATE_EMPIRIC_SPECTRUM');
  }
  if (!bundleCompletedWithin60Min && qsofa.totalScore >= 2) {
    activeAlarms.push('SEPSIS_BUNDLE_OVERDUE');
  }
  if (sepsisSeverity === 'SEPTIC_SHOCK' && mapMmHg < 65) {
    activeAlarms.push('SEPTIC_SHOCK_REFRACTORY');
  }
  if (crClMlMin < 30 && selectedAntibiotics.includes('VANCOMYCIN')) {
    activeAlarms.push('NEPHROTOXICITY_PEAK_TROUGH');
  }
  if (activeAlarms.length === 0) {
    activeAlarms.push('OPTIMAL');
  }

  return {
    patientAge,
    serumCreatinineMgDl,
    crClMlMin,
    infectionSite,
    pathogen,
    activeRegimen: selectedAntibiotics,
    effectiveCoverage,
    qsofa,
    sepsisSeverity,
    oneHourBundle,
    serumLactateMmolL: parseFloat(serumLactateMmolL.toFixed(1)),
    mapMmHg,
    antibiogramMatrix: getInstitutionalAntibiogram(),
    stewardshipRecommendation,
    activeAlarms,
  };
}
