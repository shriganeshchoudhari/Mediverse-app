/**
 * TransfusionAntibodyIdEngine.ts
 * Immunohematology & Transfusion Medicine Engine: 11-Cell Reagent Red Blood Cell (RBC)
 * Antibody Identification Panel, Dosage Effect, Proteolytic Enzyme Treatment & Crossmatch Stoichiometry.
 *
 * Implements:
 * 1. Standardized 11-cell Reagent RBC panel with comprehensive antigen mapping:
 *    - Rh: D, C, E, c, e, f, V, Cw
 *    - Kell: K, k, Kpa, Kpb, Jsa, Jsb
 *    - Duffy: Fya, Fyb
 *    - Kidd: Jka, Jkb
 *    - MNS: M, N, S, s
 *    - Lutheran: Lua, Lub
 *    - Lewis: Lea, Leb
 *    - P: P1
 * 2. Multi-phase serological testing:
 *    - IS (Immediate Spin at 22°C): Cold IgM antibodies
 *    - 37°C LISS/PeG: Sensitization and early warm reactivity
 *    - AHG (Anti-Human Globulin / IAT): Clinically significant IgG antibodies
 *    - CC (Check Cells / Coombs Control): Mandatory validation of all negative AHG tubes (1+ to 2+)
 *    - Enzyme Treatment (Ficin / Papain): Cleaves Duffy & MNS; enhances Rh, Kidd, Lewis, P1; neutral to Kell
 * 3. Systematic Rule-Out / Exclusion Algorithm:
 *    - Automated cross-out on non-reactive cells
 *    - Strict DOSAGE EFFECT guardrails: prohibits exclusion of dosage-dependent antibodies
 *      (Rh: C, c, E, e; Duffy: Fya, Fyb; Kidd: Jka, Jkb; MNS: M, N, S, s) on heterozygous cells!
 * 4. Statistical Rule of Three (3+ / 3-):
 *    - Requires >= 3 antigen-positive reactive cells AND >= 3 antigen-negative non-reactive cells (p < 0.05)
 * 5. Autocontrol (AC) & Direct Antiglobulin Test (DAT) Differential:
 *    - Differentiates Alloantibodies vs WAIHA vs Cold Agglutinins vs DHTR
 * 6. Donor Blood Unit Selection & Crossmatch Stoichiometry:
 *    - Mathematical screening formula: N_screen = N_ordered / Product(1 - f_i)
 *    - Electronic vs Immediate Spin vs Full Serological AHG crossmatch selection
 * 7. 6 Validated Clinical Immunohematology Scenarios
 *
 * Location: frontend/.gemini/skills/TransfusionAntibodyIdEngine.ts
 */

export type BloodGroupSystem = 'Rh' | 'Kell' | 'Duffy' | 'Kidd' | 'MNS' | 'Lutheran' | 'Lewis' | 'P1';

export type AntigenName =
  | 'D' | 'C' | 'E' | 'c' | 'e' | 'f' | 'V' | 'Cw'
  | 'K' | 'k' | 'Kpa' | 'Kpb' | 'Jsa' | 'Jsb'
  | 'Fya' | 'Fyb'
  | 'Jka' | 'Jkb'
  | 'M' | 'N' | 'S' | 's'
  | 'Lua' | 'Lub'
  | 'Lea' | 'Leb'
  | 'P1';

export type AgglutinationGrade =
  | '0'
  | 'w+'
  | '1+'
  | '2+'
  | '3+'
  | '4+'
  | 'mf'
  | '1+ mf'
  | '2+ mf'
  | '3+ mf'
  | (string & {});

export interface PanelCellAntigens {
  // Rh
  D: boolean;
  C: boolean;
  E: boolean;
  c: boolean;
  e: boolean;
  f: boolean;
  V: boolean;
  Cw: boolean;
  // Kell
  K: boolean;
  k: boolean;
  Kpa: boolean;
  Kpb: boolean;
  Jsa: boolean;
  Jsb: boolean;
  // Duffy
  Fya: boolean;
  Fyb: boolean;
  // Kidd
  Jka: boolean;
  Jkb: boolean;
  // MNS
  M: boolean;
  N: boolean;
  S: boolean;
  s: boolean;
  // Lutheran
  Lua: boolean;
  Lub: boolean;
  // Lewis
  Lea: boolean;
  Leb: boolean;
  // P
  P1: boolean;
}

export interface PanelCellReaction {
  cellNumber: number;
  donorLot: string;
  antigens: PanelCellAntigens;
  isReaction: AgglutinationGrade;
  phase37Reaction: AgglutinationGrade;
  ahgReaction: AgglutinationGrade;
  checkCells: '✓' | 'NEG' | 'NA';
  ficinAhgReaction?: AgglutinationGrade;
  ficinEffectDescription?: string;
}

export interface AutocontrolAndDat {
  autocontrolIS: AgglutinationGrade;
  autocontrol37: AgglutinationGrade;
  autocontrolAHG: AgglutinationGrade;
  autocontrolCheckCells: '✓' | 'NEG' | 'NA';
  datPolyspecific: AgglutinationGrade;
  datAntiIgG: AgglutinationGrade;
  datAntiC3d: AgglutinationGrade;
  interpretation: string;
}

export type ScenarioPresetId =
  | 'ANTI_K_ALLOIMMUNIZATION'
  | 'ANTI_JKA_DOSAGE_DELAYED'
  | 'MULTIPLE_ANTI_E_ANTI_FYA'
  | 'COLD_AUTOANTI_I_PREWARMED'
  | 'WAIHA_WITH_MASKED_ANTI_C'
  | 'ANTI_D_OBSTETRIC_HDFN';

export interface ImmunohematologyScenario {
  id: ScenarioPresetId;
  title: string;
  clinicalPresentation: string;
  patientProfile: {
    age: number;
    gender: 'Male' | 'Female';
    aboRh: string; // e.g. "O Positive", "A Negative"
    transfusionHistory: string;
    pregnancyHistory: string;
    diagnosis: string;
    hemoglobinGdl: number;
    bilirubinTotalMgDl: number;
    ldhUL: number;
    haptoglobinMgDl: number;
  };
  panelCells: PanelCellReaction[];
  autocontrolAndDat: AutocontrolAndDat;
  targetAntibodies: AntigenName[];
  dosageSensitiveAntigens: AntigenName[];
  enzymeUtilityNote: string;
  clinicalPearls: string[];
}

export interface RuleOutEvaluation {
  antigen: AntigenName;
  ruledOut: boolean;
  ruleOutCellNumbers: number[];
  dosageWarning: boolean; // True if rule-out was attempted on heterozygous cell for a dosage antigen
  zygosity: 'Homozygous' | 'Heterozygous' | 'Negative';
  safeToExclude: boolean;
}

export interface StatisticalRuleOfThree {
  antigen: AntigenName;
  positiveReactiveCount: number; // Must be >= 3
  negativeNonReactiveCount: number; // Must be >= 3
  isConfirmedRuleOfThree: boolean;
  pValApprox: number; // e.g. 0.05
}

export interface DonorScreeningCalculation {
  unitsRequested: number;
  targetAntibodies: AntigenName[];
  antigenFrequencies: { antigen: AntigenName; frequencyPositive: number; frequencyNegative: number }[];
  probabilityCompatible: number; // product of (1 - f_i)
  unitsToScreen: number; // ceil(unitsRequested / probabilityCompatible)
  recommendedCrossmatchType: 'Electronic' | 'ImmediateSpin' | 'FullSerologicalAHG';
  rationale: string;
}

export interface DebriefResult {
  scorePercentage: number;
  letterGrade: 'A+' | 'A' | 'B' | 'C' | 'FAIL';
  correctlyIdentified: boolean;
  dosageErrors: string[];
  omittedRuleOuts: string[];
  falseRuleOuts: string[];
  facultyFeedback: string[];
}

/**
 * Population antigen frequencies (Caucasian / General reference)
 */
export const POPULATION_ANTIGEN_FREQUENCIES: Record<AntigenName, number> = {
  D: 0.85,
  C: 0.70,
  E: 0.30,
  c: 0.80,
  e: 0.98,
  f: 0.64,
  V: 0.01,
  Cw: 0.02,
  K: 0.09,
  k: 0.998,
  Kpa: 0.02,
  Kpb: 0.999,
  Jsa: 0.001,
  Jsb: 0.999,
  Fya: 0.65,
  Fyb: 0.83,
  Jka: 0.77,
  Jkb: 0.73,
  M: 0.78,
  N: 0.72,
  S: 0.55,
  s: 0.89,
  Lua: 0.08,
  Lub: 0.998,
  Lea: 0.22,
  Leb: 0.72,
  P1: 0.79,
};

/**
 * Antigens known to demonstrate Dosage Effect (stronger agglutination on homozygous cells)
 */
export const DOSAGE_SENSITIVE_ANTIGENS: AntigenName[] = [
  'C', 'c', 'E', 'e',
  'Fya', 'Fyb',
  'Jka', 'Jkb',
  'M', 'N', 'S', 's',
];

/**
 * Antigens destroyed by proteolytic enzymes (Ficin, Papain)
 */
export const ENZYME_DESTROYED_ANTIGENS: AntigenName[] = [
  'Fya', 'Fyb', 'M', 'N', 'S',
];

/**
 * Antigens enhanced by proteolytic enzymes (Ficin, Papain)
 */
export const ENZYME_ENHANCED_ANTIGENS: AntigenName[] = [
  'D', 'C', 'E', 'c', 'e', 'Jka', 'Jkb', 'Lea', 'Leb', 'P1',
];

/**
 * Antigens unaffected by proteolytic enzymes
 */
export const ENZYME_UNAFFECTED_ANTIGENS: AntigenName[] = [
  'K', 'k', 'Kpa', 'Kpb',
];

/**
 * Standard 11-Cell Panel Antigens Template (Realistic Immucor/Ortho Donor Lot Matrix)
 */
export const STANDARD_PANEL_CELLS_TEMPLATE: { cellNumber: number; donorLot: string; antigens: PanelCellAntigens }[] = [
  {
    cellNumber: 1,
    donorLot: 'R1R1 (CDe/CDe)',
    antigens: {
      D: true, C: true, E: false, c: false, e: true, f: false, V: false, Cw: false,
      K: false, k: true, Kpa: false, Kpb: true, Jsa: false, Jsb: true,
      Fya: true, Fyb: false, // Fy(a+b-) Homozygous Fya
      Jka: true, Jkb: false, // Jk(a+b-) Homozygous Jka
      M: true, N: false, S: true, s: false, // M+N- S+s-
      Lua: false, Lub: true, Lea: false, Leb: true, P1: true,
    },
  },
  {
    cellNumber: 2,
    donorLot: 'R1R1 (CDe/CDe)',
    antigens: {
      D: true, C: true, E: false, c: false, e: true, f: false, V: false, Cw: true,
      K: true, k: true, Kpa: false, Kpb: true, Jsa: false, Jsb: true, // K+k+ Heterozygous K
      Fya: true, Fyb: true, // Fy(a+b+) Heterozygous
      Jka: true, Jkb: true, // Jk(a+b+) Heterozygous
      M: true, N: true, S: false, s: true, // M+N+ S-s+
      Lua: false, Lub: true, Lea: false, Leb: false, P1: true,
    },
  },
  {
    cellNumber: 3,
    donorLot: 'R2R2 (cDE/cDE)',
    antigens: {
      D: true, C: false, E: true, c: true, e: false, f: false, V: false, Cw: false, // Homozygous E, c
      K: false, k: true, Kpa: false, Kpb: true, Jsa: false, Jsb: true,
      Fya: false, Fyb: true, // Fy(a-b+) Homozygous Fyb
      Jka: false, Jkb: true, // Jk(a-b+) Homozygous Jkb
      M: false, N: true, S: false, s: true, // M-N+ S-s+
      Lua: false, Lub: true, Lea: true, Leb: false, P1: true,
    },
  },
  {
    cellNumber: 4,
    donorLot: 'R2R2 (cDE/cDE)',
    antigens: {
      D: true, C: false, E: true, c: true, e: false, f: false, V: true, Cw: false,
      K: false, k: true, Kpa: true, Kpb: true, Jsa: false, Jsb: true,
      Fya: true, Fyb: false, // Fy(a+b-)
      Jka: true, Jkb: true, // Jk(a+b+)
      M: true, N: false, S: true, s: true,
      Lua: false, Lub: true, Lea: false, Leb: true, P1: false,
    },
  },
  {
    cellNumber: 5,
    donorLot: "r'r (Cde/cde)",
    antigens: {
      D: false, C: true, E: false, c: true, e: true, f: true, V: false, Cw: false, // C+c+ Heterozygous
      K: true, k: true, Kpa: false, Kpb: true, Jsa: false, Jsb: true,
      Fya: false, Fyb: true, // Fy(a-b+)
      Jka: true, Jkb: false, // Jk(a+b-)
      M: true, N: true, S: false, s: true,
      Lua: true, Lub: true, Lea: false, Leb: false, P1: true,
    },
  },
  {
    cellNumber: 6,
    donorLot: "r''r (cdE/cde)",
    antigens: {
      D: false, C: false, E: true, c: true, e: true, f: true, V: false, Cw: false, // E+e+ Heterozygous
      K: false, k: true, Kpa: false, Kpb: true, Jsa: false, Jsb: true,
      Fya: true, Fyb: true, // Fy(a+b+)
      Jka: false, Jkb: true, // Jk(a-b+)
      M: false, N: true, S: true, s: false, // S+s-
      Lua: false, Lub: true, Lea: true, Leb: false, P1: false,
    },
  },
  {
    cellNumber: 7,
    donorLot: 'rr (cde/cde)',
    antigens: {
      D: false, C: false, E: false, c: true, e: true, f: true, V: false, Cw: false, // c+e+
      K: false, k: true, Kpa: false, Kpb: true, Jsa: false, Jsb: true,
      Fya: true, Fyb: false, // Fy(a+b-)
      Jka: true, Jkb: true, // Jk(a+b+)
      M: true, N: false, S: false, s: true,
      Lua: false, Lub: true, Lea: false, Leb: true, P1: true,
    },
  },
  {
    cellNumber: 8,
    donorLot: 'rr (cde/cde)',
    antigens: {
      D: false, C: false, E: false, c: true, e: true, f: true, V: false, Cw: false,
      K: true, k: true, Kpa: false, Kpb: true, Jsa: false, Jsb: true, // K+k+
      Fya: false, Fyb: true, // Fy(a-b+)
      Jka: true, Jkb: false, // Jk(a+b-)
      M: false, N: true, S: true, s: true,
      Lua: false, Lub: true, Lea: false, Leb: false, P1: true,
    },
  },
  {
    cellNumber: 9,
    donorLot: 'rr (cde/cde)',
    antigens: {
      D: false, C: false, E: false, c: true, e: true, f: true, V: false, Cw: false,
      K: false, k: true, Kpa: false, Kpb: true, Jsa: false, Jsb: true,
      Fya: true, Fyb: true,
      Jka: false, Jkb: true, // Jk(a-b+)
      M: true, N: true, S: false, s: true,
      Lua: false, Lub: true, Lea: true, Leb: false, P1: false,
    },
  },
  {
    cellNumber: 10,
    donorLot: 'R0r (cDe/cde)',
    antigens: {
      D: true, C: false, E: false, c: true, e: true, f: true, V: true, Cw: false,
      K: false, k: true, Kpa: false, Kpb: true, Jsa: true, Jsb: true,
      Fya: false, Fyb: true,
      Jka: true, Jkb: true,
      M: true, N: false, S: true, s: true,
      Lua: false, Lub: true, Lea: false, Leb: true, P1: true,
    },
  },
  {
    cellNumber: 11,
    donorLot: 'R1R2 (CDe/cDE)',
    antigens: {
      D: true, C: true, E: true, c: true, e: true, f: false, V: false, Cw: false, // C+c+ E+e+
      K: true, k: true, Kpa: false, Kpb: true, Jsa: false, Jsb: true, // K+k+
      Fya: true, Fyb: false, // Fy(a+b-)
      Jka: true, Jkb: false, // Jk(a+b-)
      M: false, N: true, S: true, s: false,
      Lua: false, Lub: true, Lea: false, Leb: false, P1: true,
    },
  },
];

/**
 * 6 Clinically Validated Immunohematology Scenarios
 */
export const IMMUNOHEMATOLOGY_SCENARIOS: Record<ScenarioPresetId, ImmunohematologyScenario> = {
  ANTI_K_ALLOIMMUNIZATION: {
    id: 'ANTI_K_ALLOIMMUNIZATION',
    title: 'Scenario 1: Pure IgG Alloantibody (Anti-Kell / Anti-K)',
    clinicalPresentation:
      'A 62-year-old female with severe symptomatic anemia secondary to diverticular bleeding is scheduled for urgent hemicolectomy. Blood bank receives a type and screen order. History of 2 prior red cell transfusions 8 years ago.',
    patientProfile: {
      age: 62,
      gender: 'Female',
      aboRh: 'A Positive',
      transfusionHistory: '2 units PRBCs (8 years prior)',
      pregnancyHistory: 'G3P3 (no HDFN history)',
      diagnosis: 'Severe Diverticular Bleed / Acute Anemia',
      hemoglobinGdl: 6.8,
      bilirubinTotalMgDl: 0.9,
      ldhUL: 180,
      haptoglobinMgDl: 115,
    },
    targetAntibodies: ['K'],
    dosageSensitiveAntigens: ['K'],
    enzymeUtilityNote: 'Kell system antigens are resistant to proteolytic enzymes (Ficin/Papain); reactivity persists unaltered at 2+ in AHG.',
    clinicalPearls: [
      'Kell (K / KEL1) is the 2nd most immunogenic blood group antigen after D; only ~9% of the population is K-positive.',
      'Anti-K causes severe acute and delayed hemolytic transfusion reactions, and severe HDFN via erythroid precursor suppression.',
      'Because only ~9% of donors are K-positive, finding compatible K-negative units is straightforward (91% compatible).',
      'Check cells (CC) must always yield 1+ to 2+ agglutination on all negative tubes to confirm active AHG reagent.',
    ],
    autocontrolAndDat: {
      autocontrolIS: '0',
      autocontrol37: '0',
      autocontrolAHG: '0',
      autocontrolCheckCells: '✓',
      datPolyspecific: '0',
      datAntiIgG: '0',
      datAntiC3d: '0',
      interpretation: 'Negative Autocontrol and DAT confirm isolated alloimmunization without autoantibody involvement.',
    },
    panelCells: [
      { cellNumber: 1, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[0].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[0].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 2, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[1].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[1].antigens, isReaction: '0', phase37Reaction: '1+', ahgReaction: '3+', checkCells: 'NA', ficinAhgReaction: '3+' }, // K+
      { cellNumber: 3, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[2].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[2].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 4, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[3].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[3].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 5, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[4].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[4].antigens, isReaction: '0', phase37Reaction: '1+', ahgReaction: '2+', checkCells: 'NA', ficinAhgReaction: '2+' }, // K+
      { cellNumber: 6, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[5].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[5].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 7, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[6].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[6].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 8, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[7].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[7].antigens, isReaction: '0', phase37Reaction: '1+', ahgReaction: '3+', checkCells: 'NA', ficinAhgReaction: '3+' }, // K+
      { cellNumber: 9, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[8].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[8].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 10, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[9].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[9].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 11, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[10].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[10].antigens, isReaction: '0', phase37Reaction: '1+', ahgReaction: '3+', checkCells: 'NA', ficinAhgReaction: '3+' }, // K+
    ],
  },

  ANTI_JKA_DOSAGE_DELAYED: {
    id: 'ANTI_JKA_DOSAGE_DELAYED',
    title: 'Scenario 2: Kidd Alloantibody (Anti-Jka) with Dosage & Delayed Hemolytic Risk',
    clinicalPresentation:
      'A 45-year-old male with sickle cell disease presents with unexplained fever, dark urine, and dropping hemoglobin 7 days following an uneventful 2-unit transfusion. Antibody screen pre-transfusion was reported negative; repeat workup demonstrates an evanescent Kidd alloantibody.',
    patientProfile: {
      age: 45,
      gender: 'Male',
      aboRh: 'B Positive',
      transfusionHistory: 'Transfused 2 units PRBCs 7 days ago (pre-transfusion screen negative)',
      pregnancyHistory: 'N/A',
      diagnosis: 'Delayed Hemolytic Transfusion Reaction (DHTR) / Anamnestic Response',
      hemoglobinGdl: 5.4,
      bilirubinTotalMgDl: 4.8,
      ldhUL: 1250,
      haptoglobinMgDl: 5,
    },
    targetAntibodies: ['Jka'],
    dosageSensitiveAntigens: ['Jka'],
    enzymeUtilityNote: 'Kidd system antigens (Jka, Jkb) are significantly enhanced by ficin treatment; heterozygous cells (Jka+b+) react stronger (2+ to 3+) post-ficin, overcoming weak baseline dosage!',
    clinicalPearls: [
      'Kidd antibodies (anti-Jka and anti-Jkb) are notorious for rapid antibody titer decay ("evanescent antibodies"), dropping below detectable levels between transfusions.',
      'Upon re-exposure to Jka-positive RBCs, a rapid secondary anamnestic immune response triggers acute extravascular and intravascular hemolysis at day 5 to 10.',
      'Dosage effect is pronounced: Homozygous Jk(a+b-) cells show strong 3+ agglutination, while heterozygous Jk(a+b+) show faint or 1+ agglutination.',
      'Rule-out trap: You MUST NEVER rule out anti-Jka using a heterozygous Jk(a+b+) non-reactive cell!',
    ],
    autocontrolAndDat: {
      autocontrolIS: '0',
      autocontrol37: '0',
      autocontrolAHG: '1+',
      autocontrolCheckCells: 'NA',
      datPolyspecific: '2+',
      datAntiIgG: '2+ mf',
      datAntiC3d: '1+',
      interpretation: 'Positive DAT with mixed-field (mf) agglutination reflects newly formed allo-anti-Jka coating transfused circulating donor RBCs (Delayed Hemolytic Transfusion Reaction).',
    },
    panelCells: [
      { cellNumber: 1, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[0].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[0].antigens, isReaction: '0', phase37Reaction: '1+', ahgReaction: '3+', checkCells: 'NA', ficinAhgReaction: '4+' }, // Jk(a+b-) Homozygous
      { cellNumber: 2, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[1].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[1].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '1+', checkCells: 'NA', ficinAhgReaction: '2+' }, // Jk(a+b+) Heterozygous (weak)
      { cellNumber: 3, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[2].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[2].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' }, // Jk(a-b+)
      { cellNumber: 4, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[3].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[3].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '1+', checkCells: 'NA', ficinAhgReaction: '2+' }, // Jk(a+b+)
      { cellNumber: 5, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[4].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[4].antigens, isReaction: '0', phase37Reaction: '1+', ahgReaction: '3+', checkCells: 'NA', ficinAhgReaction: '4+' }, // Jk(a+b-) Homozygous
      { cellNumber: 6, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[5].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[5].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' }, // Jk(a-b+)
      { cellNumber: 7, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[6].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[6].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '1+', checkCells: 'NA', ficinAhgReaction: '2+' }, // Jk(a+b+)
      { cellNumber: 8, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[7].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[7].antigens, isReaction: '0', phase37Reaction: '1+', ahgReaction: '3+', checkCells: 'NA', ficinAhgReaction: '4+' }, // Jk(a+b-) Homozygous
      { cellNumber: 9, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[8].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[8].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' }, // Jk(a-b+)
      { cellNumber: 10, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[9].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[9].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '1+', checkCells: 'NA', ficinAhgReaction: '2+' }, // Jk(a+b+)
      { cellNumber: 11, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[10].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[10].antigens, isReaction: '0', phase37Reaction: '1+', ahgReaction: '3+', checkCells: 'NA', ficinAhgReaction: '4+' }, // Jk(a+b-) Homozygous
    ],
  },

  MULTIPLE_ANTI_E_ANTI_FYA: {
    id: 'MULTIPLE_ANTI_E_ANTI_FYA',
    title: 'Scenario 3: Multiple Alloantibodies (Anti-E + Anti-Fya) Resolved by Ficin',
    clinicalPresentation:
      'A 38-year-old multi-parous woman with uterine fibroids and chronic menorrhagia requires preoperative crossmatch for elective hysterectomy. Initial panel shows complex reactivity with variable strengths at AHG.',
    patientProfile: {
      age: 38,
      gender: 'Female',
      aboRh: 'O Negative',
      transfusionHistory: '1 unit PRBCs following 2nd delivery (5 years ago)',
      pregnancyHistory: 'G4P3',
      diagnosis: 'Uterine Leiomyoma / Symptomatic Menorrhagia',
      hemoglobinGdl: 8.2,
      bilirubinTotalMgDl: 0.6,
      ldhUL: 165,
      haptoglobinMgDl: 140,
    },
    targetAntibodies: ['E', 'Fya'],
    dosageSensitiveAntigens: ['E', 'Fya'],
    enzymeUtilityNote: 'Ficin destroys Duffy (Fya) antigens completely (cleaved from glycophorin). Untreated cells with E and Fya react; after ficin treatment, only E-positive cells remain reactive, cleanly unmasking the two components!',
    clinicalPearls: [
      'Multiple alloantibodies occur in 10-20% of alloimmunized transfusion recipients and often obscure rule-outs.',
      'Enzyme differentials are critical: Ficin/Papain cleaves Duffy (Fya, Fyb) and MNS, while enhancing Rh (D, C, E, c, e).',
      'In this case, ficin destroys Fya reactivity completely, leaving pure anti-E reactions (cells 3, 4, 6, 11).',
      'To provide compatible blood, units must be confirmed negative for BOTH E (~70% negative) and Fya (~35% negative). Compatibility = 0.70 * 0.35 = 24.5%.',
    ],
    autocontrolAndDat: {
      autocontrolIS: '0',
      autocontrol37: '0',
      autocontrolAHG: '0',
      autocontrolCheckCells: '✓',
      datPolyspecific: '0',
      datAntiIgG: '0',
      datAntiC3d: '0',
      interpretation: 'Autocontrol and DAT negative; confirms true dual alloantibody combination (Anti-E + Anti-Fya) without autoantibody.',
    },
    panelCells: [
      { cellNumber: 1, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[0].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[0].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '2+', checkCells: 'NA', ficinAhgReaction: '0', ficinEffectDescription: 'Fya destroyed -> reaction abolished' }, // E- Fya+
      { cellNumber: 2, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[1].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[1].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '1+', checkCells: 'NA', ficinAhgReaction: '0', ficinEffectDescription: 'Fya destroyed -> reaction abolished' }, // E- Fya+
      { cellNumber: 3, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[2].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[2].antigens, isReaction: '0', phase37Reaction: '1+', ahgReaction: '3+', checkCells: 'NA', ficinAhgReaction: '4+', ficinEffectDescription: 'E enhanced post-ficin' }, // E+ Fya-
      { cellNumber: 4, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[3].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[3].antigens, isReaction: '0', phase37Reaction: '1+', ahgReaction: '3+', checkCells: 'NA', ficinAhgReaction: '4+', ficinEffectDescription: 'E enhanced post-ficin' }, // E+ Fya+
      { cellNumber: 5, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[4].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[4].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' }, // E- Fya-
      { cellNumber: 6, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[5].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[5].antigens, isReaction: '0', phase37Reaction: '1+', ahgReaction: '3+', checkCells: 'NA', ficinAhgReaction: '4+', ficinEffectDescription: 'E enhanced post-ficin' }, // E+ Fya+
      { cellNumber: 7, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[6].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[6].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '2+', checkCells: 'NA', ficinAhgReaction: '0', ficinEffectDescription: 'Fya destroyed -> reaction abolished' }, // E- Fya+
      { cellNumber: 8, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[7].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[7].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' }, // E- Fya-
      { cellNumber: 9, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[8].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[8].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '1+', checkCells: 'NA', ficinAhgReaction: '0', ficinEffectDescription: 'Fya destroyed -> reaction abolished' }, // E- Fya+
      { cellNumber: 10, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[9].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[9].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' }, // E- Fya-
      { cellNumber: 11, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[10].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[10].antigens, isReaction: '0', phase37Reaction: '1+', ahgReaction: '3+', checkCells: 'NA', ficinAhgReaction: '4+', ficinEffectDescription: 'E enhanced post-ficin' }, // E+ Fya+
    ],
  },

  COLD_AUTOANTI_I_PREWARMED: {
    id: 'COLD_AUTOANTI_I_PREWARMED',
    title: 'Scenario 4: Cold Agglutinin (Autoanti-I) Resolved by Prewarmed Technique',
    clinicalPresentation:
      'A 68-year-old male admitted with severe Mycoplasma pneumoniae pneumonia develops acrocyanosis of ears and fingertips. Blood bank workup shows strong pan-reactivity at Immediate Spin and room temperature with positive autocontrol.',
    patientProfile: {
      age: 68,
      gender: 'Male',
      aboRh: 'O Positive',
      transfusionHistory: 'Never transfused',
      pregnancyHistory: 'N/A',
      diagnosis: 'Cold Agglutinin Disease (CAD) secondary to Mycoplasma Pneumoniae',
      hemoglobinGdl: 7.9,
      bilirubinTotalMgDl: 3.2,
      ldhUL: 980,
      haptoglobinMgDl: 8,
    },
    targetAntibodies: [], // Autoantibody, not alloantibody
    dosageSensitiveAntigens: [],
    enzymeUtilityNote: 'Enzymes enhance I antigen expression, intensifying cold autoagglutination; prewarmed testing eliminates IgM binding.',
    clinicalPearls: [
      'Autoanti-I is an IgM cold agglutinin commonly triggered by Mycoplasma pneumoniae or Epstein-Barr virus (EBV) infections.',
      'Pan-reactivity at room temperature (IS) with positive autocontrol and DAT positive for C3d (negative for IgG) is pathognomonic.',
      'Prewarmed technique: Warming serum and reagent RBCs to 37°C before mixing and washing with 37°C saline completely abolishes cold agglutination.',
      'If prewarmed testing is negative at AHG across all cells, true underlying alloantibodies are ruled out and standard blood warmers are used during infusion.',
    ],
    autocontrolAndDat: {
      autocontrolIS: '3+',
      autocontrol37: '1+',
      autocontrolAHG: '0',
      autocontrolCheckCells: '✓',
      datPolyspecific: '2+',
      datAntiIgG: '0',
      datAntiC3d: '2+',
      interpretation: 'DAT positive for C3d only, negative for IgG; positive autocontrol at IS/37°C confirms Cold Autoagglutinin (Autoanti-I). Prewarmed AHG is clean.',
    },
    panelCells: [
      { cellNumber: 1, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[0].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[0].antigens, isReaction: '3+', phase37Reaction: '1+', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 2, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[1].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[1].antigens, isReaction: '3+', phase37Reaction: '1+', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 3, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[2].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[2].antigens, isReaction: '3+', phase37Reaction: '1+', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 4, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[3].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[3].antigens, isReaction: '3+', phase37Reaction: '1+', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 5, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[4].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[4].antigens, isReaction: '3+', phase37Reaction: '1+', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 6, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[5].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[5].antigens, isReaction: '3+', phase37Reaction: '1+', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 7, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[6].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[6].antigens, isReaction: '3+', phase37Reaction: '1+', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 8, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[7].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[7].antigens, isReaction: '3+', phase37Reaction: '1+', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 9, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[8].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[8].antigens, isReaction: '3+', phase37Reaction: '1+', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 10, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[9].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[9].antigens, isReaction: '3+', phase37Reaction: '1+', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
      { cellNumber: 11, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[10].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[10].antigens, isReaction: '3+', phase37Reaction: '1+', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' },
    ],
  },

  WAIHA_WITH_MASKED_ANTI_C: {
    id: 'WAIHA_WITH_MASKED_ANTI_C',
    title: 'Scenario 5: Warm Autoimmune Hemolytic Anemia (WAIHA) with Masked Allo-Anti-c',
    clinicalPresentation:
      'A 54-year-old female with Systemic Lupus Erythematosus (SLE) presents with profound fatigue, scleral icterus, and hemoglobin 4.2 g/dL. Blood bank receives a STAT order for 2 units PRBCs. All panel cells and autocontrol react 3+ at AHG. Differential warm alloadsorption is performed.',
    patientProfile: {
      age: 54,
      gender: 'Female',
      aboRh: 'B Positive (R1R1 / CDe/CDe phenotype)',
      transfusionHistory: 'Transfused 3 units PRBCs 2 years ago',
      pregnancyHistory: 'G2P2',
      diagnosis: 'Warm Autoimmune Hemolytic Anemia (WAIHA) + Underlying Allo-Anti-c',
      hemoglobinGdl: 4.2,
      bilirubinTotalMgDl: 5.6,
      ldhUL: 1650,
      haptoglobinMgDl: 2,
    },
    targetAntibodies: ['c'],
    dosageSensitiveAntigens: ['c'],
    enzymeUtilityNote: 'Pan-reactive autoantibody requires differential alloadsorption using R1R1, R2R2, and rr cells to remove autoantibody and unmask underlying alloantibodies.',
    clinicalPearls: [
      'Warm Autoimmune Hemolytic Anemia (WAIHA) produces IgG pan-agglutinins reacting with virtually all human RBCs, masking underlying clinically significant alloantibodies.',
      'Transfusing blood with an undetected alloantibody (e.g. anti-c) into a WAIHA patient triggers catastrophic intravascular/extravascular hemolysis on top of baseline anemia.',
      'Differential alloadsorption protocol: Patient serum is adsorbed against 3 different phenotyped allogeneic RBC aliquots (R1R1, R2R2, rr).',
      'Following adsorption with R1R1 cells (which lack c antigen), the remaining adsorbed serum reacts exclusively with c-positive cells (cells 3, 4, 5, 6, 7, 8, 9, 10, 11), proving the presence of allo-anti-c!',
    ],
    autocontrolAndDat: {
      autocontrolIS: '0',
      autocontrol37: '2+',
      autocontrolAHG: '3+',
      autocontrolCheckCells: 'NA',
      datPolyspecific: '4+',
      datAntiIgG: '4+',
      datAntiC3d: '1+',
      interpretation: 'Strongly positive DAT (IgG 4+) and positive autocontrol (3+) confirm Warm Autoantibody. Adsorbed serum demonstrates masked Allo-Anti-c.',
    },
    panelCells: [
      { cellNumber: 1, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[0].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[0].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '3+ (0 post-ads)', checkCells: 'NA', ficinAhgReaction: '4+' }, // c-
      { cellNumber: 2, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[1].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[1].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '3+ (0 post-ads)', checkCells: 'NA', ficinAhgReaction: '4+' }, // c-
      { cellNumber: 3, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[2].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[2].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '3+ (3+ post-ads)', checkCells: 'NA', ficinAhgReaction: '4+' }, // c+
      { cellNumber: 4, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[3].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[3].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '3+ (3+ post-ads)', checkCells: 'NA', ficinAhgReaction: '4+' }, // c+
      { cellNumber: 5, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[4].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[4].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '3+ (2+ post-ads)', checkCells: 'NA', ficinAhgReaction: '4+' }, // c+
      { cellNumber: 6, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[5].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[5].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '3+ (3+ post-ads)', checkCells: 'NA', ficinAhgReaction: '4+' }, // c+
      { cellNumber: 7, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[6].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[6].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '3+ (3+ post-ads)', checkCells: 'NA', ficinAhgReaction: '4+' }, // c+
      { cellNumber: 8, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[7].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[7].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '3+ (3+ post-ads)', checkCells: 'NA', ficinAhgReaction: '4+' }, // c+
      { cellNumber: 9, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[8].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[8].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '3+ (3+ post-ads)', checkCells: 'NA', ficinAhgReaction: '4+' }, // c+
      { cellNumber: 10, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[9].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[9].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '3+ (2+ post-ads)', checkCells: 'NA', ficinAhgReaction: '4+' }, // c+
      { cellNumber: 11, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[10].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[10].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '3+ (2+ post-ads)', checkCells: 'NA', ficinAhgReaction: '4+' }, // c+
    ],
  },

  ANTI_D_OBSTETRIC_HDFN: {
    id: 'ANTI_D_OBSTETRIC_HDFN',
    title: 'Scenario 6: Maternal Anti-D Alloimmunization & Severe HDFN Risk',
    clinicalPresentation:
      'A 29-year-old Rh-negative (O Negative) woman at 28 weeks gestation presents for prenatal antibody screening. History of a home birth without postpartum Rh Immune Globulin (RhIg/RhoGAM). Titration and antibody identification ordered.',
    patientProfile: {
      age: 29,
      gender: 'Female',
      aboRh: 'O Negative (rr / cde/cde)',
      transfusionHistory: 'Never transfused',
      pregnancyHistory: 'G2P1 (Unsensitized first pregnancy, no RhIg)',
      diagnosis: 'Maternal RhD Alloimmunization / High Risk Hemolytic Disease of Fetus & Newborn',
      hemoglobinGdl: 11.8,
      bilirubinTotalMgDl: 0.7,
      ldhUL: 190,
      haptoglobinMgDl: 120,
    },
    targetAntibodies: ['D'],
    dosageSensitiveAntigens: ['D'],
    enzymeUtilityNote: 'Rh antigens are strongly enhanced by ficin enzyme treatment; reactions jump from 3+ to 4+ with rapid agglutination.',
    clinicalPearls: [
      'RhD alloimmunization in pregnancy occurs when an Rh-negative mother is exposed to Rh-positive fetal red cells during fetomaternal hemorrhage.',
      'Maternal anti-D IgG readily crosses the placenta via FcRn receptors, causing severe fetal extravascular hemolysis, profound anemia, and hydrops fetalis.',
      'Critical titer threshold: Anti-D titer >= 1:16 warrants urgent serial fetal Middle Cerebral Artery (MCA) peak systolic velocity Doppler monitoring.',
      'RhIg (RhoGAM) is completely ineffective once maternal anti-D alloimmunization is established and should NOT be administered.',
    ],
    autocontrolAndDat: {
      autocontrolIS: '0',
      autocontrol37: '0',
      autocontrolAHG: '0',
      autocontrolCheckCells: '✓',
      datPolyspecific: '0',
      datAntiIgG: '0',
      datAntiC3d: '0',
      interpretation: 'Maternal autocontrol and DAT are negative; confirms maternal alloantibody directed against RhD antigen.',
    },
    panelCells: [
      { cellNumber: 1, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[0].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[0].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '4+', checkCells: 'NA', ficinAhgReaction: '4+' }, // D+
      { cellNumber: 2, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[1].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[1].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '4+', checkCells: 'NA', ficinAhgReaction: '4+' }, // D+
      { cellNumber: 3, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[2].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[2].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '4+', checkCells: 'NA', ficinAhgReaction: '4+' }, // D+
      { cellNumber: 4, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[3].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[3].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '4+', checkCells: 'NA', ficinAhgReaction: '4+' }, // D+
      { cellNumber: 5, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[4].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[4].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' }, // D-
      { cellNumber: 6, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[5].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[5].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' }, // D-
      { cellNumber: 7, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[6].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[6].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' }, // D-
      { cellNumber: 8, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[7].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[7].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' }, // D-
      { cellNumber: 9, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[8].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[8].antigens, isReaction: '0', phase37Reaction: '0', ahgReaction: '0', checkCells: '✓', ficinAhgReaction: '0' }, // D-
      { cellNumber: 10, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[9].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[9].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '4+', checkCells: 'NA', ficinAhgReaction: '4+' }, // D+
      { cellNumber: 11, donorLot: STANDARD_PANEL_CELLS_TEMPLATE[10].donorLot, antigens: STANDARD_PANEL_CELLS_TEMPLATE[10].antigens, isReaction: '0', phase37Reaction: '2+', ahgReaction: '4+', checkCells: 'NA', ficinAhgReaction: '4+' }, // D+
    ],
  },
};

/**
 * Determine Zygosity of an antigen on a given panel cell
 */
export function getAntigenZygosity(antigen: AntigenName, cellAntigens: PanelCellAntigens): 'Homozygous' | 'Heterozygous' | 'Negative' {
  if (!cellAntigens[antigen]) return 'Negative';

  switch (antigen) {
    case 'C':
      return cellAntigens.c ? 'Heterozygous' : 'Homozygous';
    case 'c':
      return cellAntigens.C ? 'Heterozygous' : 'Homozygous';
    case 'E':
      return cellAntigens.e ? 'Heterozygous' : 'Homozygous';
    case 'e':
      return cellAntigens.E ? 'Heterozygous' : 'Homozygous';
    case 'Fya':
      return cellAntigens.Fyb ? 'Heterozygous' : 'Homozygous';
    case 'Fyb':
      return cellAntigens.Fya ? 'Heterozygous' : 'Homozygous';
    case 'Jka':
      return cellAntigens.Jkb ? 'Heterozygous' : 'Homozygous';
    case 'Jkb':
      return cellAntigens.Jka ? 'Heterozygous' : 'Homozygous';
    case 'M':
      return cellAntigens.N ? 'Heterozygous' : 'Homozygous';
    case 'N':
      return cellAntigens.M ? 'Heterozygous' : 'Homozygous';
    case 'S':
      return cellAntigens.s ? 'Heterozygous' : 'Homozygous';
    case 's':
      return cellAntigens.S ? 'Heterozygous' : 'Homozygous';
    case 'K':
      return cellAntigens.k ? 'Heterozygous' : 'Homozygous';
    case 'k':
      return cellAntigens.K ? 'Heterozygous' : 'Homozygous';
    case 'Lua':
      return cellAntigens.Lub ? 'Heterozygous' : 'Homozygous';
    case 'Lub':
      return cellAntigens.Lua ? 'Heterozygous' : 'Homozygous';
    default:
      return 'Homozygous';
  }
}

/**
 * Evaluates rule-outs across the 11-cell panel
 */
export function evaluateRuleOuts(
  panelCells: PanelCellReaction[],
  dosageStrictness: boolean = true
): Record<AntigenName, RuleOutEvaluation> {
  const allAntigens: AntigenName[] = [
    'D', 'C', 'E', 'c', 'e', 'f', 'V', 'Cw',
    'K', 'k', 'Kpa', 'Kpb', 'Jsa', 'Jsb',
    'Fya', 'Fyb', 'Jka', 'Jkb',
    'M', 'N', 'S', 's',
    'Lua', 'Lub', 'Lea', 'Leb', 'P1',
  ];

  const results: Partial<Record<AntigenName, RuleOutEvaluation>> = {};

  // Find cells that gave a negative reaction in AHG (and IS/37)
  const nonReactiveCells = panelCells.filter((c) => {
    const ahg = c.ahgReaction.replace(/[^0-9]/g, '');
    return c.ahgReaction === '0' || ahg === '0';
  });

  for (const ag of allAntigens) {
    const cellsWithAg = nonReactiveCells.filter((c) => c.antigens[ag]);
    const isDosageSensitive = DOSAGE_SENSITIVE_ANTIGENS.includes(ag);

    let hasHomozygousRuleOut = false;
    let hasHeterozygousRuleOut = false;
    const ruleOutCellNums: number[] = [];

    for (const cell of cellsWithAg) {
      const zygosity = getAntigenZygosity(ag, cell.antigens);
      ruleOutCellNums.push(cell.cellNumber);
      if (zygosity === 'Homozygous') {
        hasHomozygousRuleOut = true;
      } else if (zygosity === 'Heterozygous') {
        hasHeterozygousRuleOut = true;
      }
    }

    let safeToExclude = false;
    let dosageWarning = false;

    if (isDosageSensitive) {
      if (hasHomozygousRuleOut) {
        safeToExclude = true;
      } else if (hasHeterozygousRuleOut) {
        // Heterozygous only rule-out attempted on dosage-sensitive antigen!
        dosageWarning = true;
        safeToExclude = !dosageStrictness;
      }
    } else {
      // Non-dosage antigens (e.g. Kell) can be ruled out with 2 heterozygous or 1 homozygous
      safeToExclude = hasHomozygousRuleOut || cellsWithAg.length >= 2 || (ag === 'K' && cellsWithAg.length >= 1);
    }

    results[ag] = {
      antigen: ag,
      ruledOut: cellsWithAg.length > 0,
      ruleOutCellNumbers: ruleOutCellNums,
      dosageWarning,
      zygosity: hasHomozygousRuleOut ? 'Homozygous' : hasHeterozygousRuleOut ? 'Heterozygous' : 'Negative',
      safeToExclude,
    };
  }

  return results as Record<AntigenName, RuleOutEvaluation>;
}

/**
 * Evaluates the Rule of Three (3+ / 3-) for a suspected antibody
 */
export function evaluateRuleOfThree(
  antigen: AntigenName,
  panelCells: PanelCellReaction[]
): StatisticalRuleOfThree {
  let positiveReactiveCount = 0;
  let negativeNonReactiveCount = 0;

  for (const cell of panelCells) {
    const hasAg = cell.antigens[antigen];
    const isReactive = cell.ahgReaction !== '0' && !cell.ahgReaction.includes('0');

    if (hasAg && isReactive) {
      positiveReactiveCount++;
    } else if (!hasAg && !isReactive) {
      negativeNonReactiveCount++;
    }
  }

  const isConfirmed = positiveReactiveCount >= 3 && negativeNonReactiveCount >= 3;
  // Fisher's exact test approx: 1 / 20 = 0.05 when exactly 3+ and 3-
  const pValApprox = isConfirmed ? 0.05 : 0.20;

  return {
    antigen,
    positiveReactiveCount,
    negativeNonReactiveCount,
    isConfirmedRuleOfThree: isConfirmed,
    pValApprox,
  };
}

/**
 * Calculates Donor Units to Screen and recommended crossmatch procedure
 */
export function calculateDonorScreening(
  targetAntibodies: AntigenName[],
  unitsRequested: number = 2
): DonorScreeningCalculation {
  if (targetAntibodies.length === 0) {
    return {
      unitsRequested,
      targetAntibodies: [],
      antigenFrequencies: [],
      probabilityCompatible: 1.0,
      unitsToScreen: unitsRequested,
      recommendedCrossmatchType: 'ImmediateSpin',
      rationale: 'No clinically significant alloantibodies identified; Immediate Spin (IS) or Electronic crossmatch is sufficient for ABO verification.',
    };
  }

  const antigenFrequencies = targetAntibodies.map((ag) => {
    const freqPos = POPULATION_ANTIGEN_FREQUENCIES[ag] ?? 0.50;
    return {
      antigen: ag,
      frequencyPositive: freqPos,
      frequencyNegative: Math.max(0.001, 1 - freqPos),
    };
  });

  const probabilityCompatible = antigenFrequencies.reduce((acc, curr) => acc * curr.frequencyNegative, 1.0);
  const unitsToScreen = Math.max(unitsRequested, Math.ceil(unitsRequested / probabilityCompatible));

  return {
    unitsRequested,
    targetAntibodies,
    antigenFrequencies,
    probabilityCompatible: Number(probabilityCompatible.toFixed(4)),
    unitsToScreen,
    recommendedCrossmatchType: 'FullSerologicalAHG',
    rationale: `Clinically significant alloantibody(ies) [${targetAntibodies.join(', ')}] detected. Full serological AHG crossmatch with confirmed antigen-negative units is mandatory (AABB Standard 5.16).`,
  };
}

/**
 * Generates an objective Immunohematology Debrief Rubric
 */
export function generateImmunohematologyDebrief(
  scenario: ImmunohematologyScenario,
  selectedAntibodies: AntigenName[],
  userRuledOutAntigens: AntigenName[]
): DebriefResult {
  const targetSet = new Set(scenario.targetAntibodies);
  const selectedSet = new Set(selectedAntibodies);

  const correctlyIdentified =
    scenario.targetAntibodies.length === selectedAntibodies.length &&
    scenario.targetAntibodies.every((a) => selectedSet.has(a));

  const dosageRuleOuts = evaluateRuleOuts(scenario.panelCells, true);
  const dosageErrors: string[] = [];
  const falseRuleOuts: string[] = [];
  const omittedRuleOuts: string[] = [];
  const facultyFeedback: string[] = [];

  let score = 100;

  // Check dosage violations
  for (const ag of userRuledOutAntigens) {
    const evalResult = dosageRuleOuts[ag];
    if (evalResult && evalResult.dosageWarning) {
      dosageErrors.push(ag);
      score -= 15;
      facultyFeedback.push(
        `Critical Dosage Warning: Attempted to rule out ${ag} on a heterozygous cell. ${ag} exhibits dosage; a homozygous cell is required to prevent false exclusion!`
      );
    }
  }

  // Check if true target antibody was erroneously ruled out
  for (const ag of scenario.targetAntibodies) {
    if (userRuledOutAntigens.includes(ag)) {
      falseRuleOuts.push(ag);
      score -= 35;
      facultyFeedback.push(
        `Fatal Laboratory Error: The true target alloantibody Anti-${ag} was erroneously marked as ruled out!`
      );
    }
  }

  // Check identification correctness
  if (!correctlyIdentified) {
    score -= 30;
    facultyFeedback.push(
      `Identification Mismatch: Selected [${selectedAntibodies.join(', ') || 'None'}], but true antibody profile is [${scenario.targetAntibodies.join(', ')}].`
    );
  } else {
    facultyFeedback.push(`Excellent: Correctly identified target antibody profile: [${scenario.targetAntibodies.join(', ')}].`);
  }

  // Autocontrol & DAT awareness
  if (scenario.autocontrolAndDat.autocontrolAHG !== '0') {
    facultyFeedback.push(
      `Autocontrol Alert: Positive autocontrol requires distinguishing alloantibody vs autoantibody vs delayed hemolytic transfusion reaction.`
    );
  }

  score = Math.max(0, Math.min(100, score));

  let letterGrade: 'A+' | 'A' | 'B' | 'C' | 'FAIL' = 'FAIL';
  if (score >= 95) letterGrade = 'A+';
  else if (score >= 85) letterGrade = 'A';
  else if (score >= 75) letterGrade = 'B';
  else if (score >= 60) letterGrade = 'C';

  return {
    scorePercentage: score,
    letterGrade,
    correctlyIdentified,
    dosageErrors,
    omittedRuleOuts,
    falseRuleOuts,
    facultyFeedback,
  };
}
