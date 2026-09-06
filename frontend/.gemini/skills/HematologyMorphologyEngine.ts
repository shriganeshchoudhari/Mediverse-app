/**
 * HematologyMorphologyEngine.ts
 *
 * Diagnostic engine for Peripheral Blood Smear (PBS) morphology,
 * Bone Marrow Aspirate & Biopsy cellularity, M:E ratio calculation,
 * WHO 2022 Hematologic Malignancy classification, and Cairo-Bishop
 * Tumor Lysis Syndrome (TLS) stratification.
 *
 * Location: frontend/.gemini/skills/HematologyMorphologyEngine.ts
 */

export interface CompleteBloodCount {
  wbc10x9L: number; // WBC count (10^9 / L, normal 4.0 - 11.0)
  hemoglobinGPerDl: number; // Hb (g/dL, normal 12.0 - 16.0)
  mcvFl: number; // Mean Corpuscular Volume (fL, normal 80 - 100)
  platelets10x9L: number; // Platelet count (10^9 / L, normal 150 - 450)
  reticulocytePct: number; // Reticulocyte % (normal 0.5 - 2.5%)
}

export interface PeripheralDifferential {
  blastsPct: number; // Myeloblasts or Lymphoblasts
  promyelocytesPct: number;
  myelocytesPct: number;
  metamyelocytesPct: number;
  bandsPct: number;
  segmentedNeutrophilsPct: number;
  lymphocytesPct: number;
  monocytesPct: number;
  eosinophilsPct: number;
  basophilsPct: number;
}

export interface RbcMorphologyFeatures {
  schistocytesPresent: boolean; // Microangiopathic hemolytic anemia (TTP/HUS/DIC)
  spherocytesPresent: boolean; // Hereditary spherocytosis or AIHA
  targetCellsPresent: boolean; // Thalassemia, hemoglobinopathies, liver disease
  tearDropDacryocytesPresent: boolean; // Myelofibrosis or marrow infiltration
  sickleCellsDrepanocytesPresent: boolean; // Sickle cell disease (HbSS)
  biteCellsDegmacytesPresent: boolean; // G6PD deficiency with Heinz bodies
  rouleauxFormationPresent: boolean; // Multiple Myeloma / hypergammaglobulinemia
  howellJollyBodiesPresent: boolean; // Hyposplenism or asplenia
  hypersegmentedNeutrophilsPresent: boolean; // Megaloblastic anemia (B12/folate)
  auerRodsPresent: boolean; // Pathognomonic for AML / APML
}

export interface BoneMarrowFeatures {
  cellularityPct: number; // Expected normal ~ (100 - age) %
  myeloidPct: number; // Total myeloid lineage precursors
  erythroidPct: number; // Total erythroid lineage precursors
  plasmaCellsPct: number; // Multiple myeloma (>10% clonal)
  blastCountMarrowPct: number; // >= 20% defines acute leukemia (AML/ALL)
  ringSideroblastsPresent: boolean; // Myelodysplastic neoplasm with ring sideroblasts
  dryTapAspiration: boolean; // Myelofibrosis or hairy cell leukemia
}

export interface MolecularCytogenetics {
  bcrAbl1T9_22: boolean; // Philadelphia chromosome (CML)
  pmlRaraT15_17: boolean; // Acute Promyelocytic Leukemia (APML)
  jak2V617F: boolean; // Polycythemia Vera / Essential Thrombocythemia / Primary Myelofibrosis
  flowImmunophenotype: string[]; // e.g. ['CD34+', 'CD117+', 'MPO+', 'CD19-', 'CD3-']
}

export interface CairoBishopTlsParams {
  uricAcidMgDl: number; // > 8.0 mg/dL or 25% increase
  potassiumMeqL: number; // > 6.0 mEq/L or 25% increase
  phosphorusMgDl: number; // > 4.5 mg/dL or 25% increase
  calciumMgDl: number; // < 7.0 mg/dL or 25% decrease
  creatinineMgDl: number;
  oliguriaPresent: boolean;
  seizuresOrArrhythmiasPresent: boolean;
}

export type HematologicCategory =
  | 'NORMAL_PERIPHERAL_SMEAR'
  | 'MICROANGIOPATHIC_HEMOLYTIC_ANEMIA'
  | 'HEMOGLOBINOPATHY_OR_MEMBRANOPATHY'
  | 'ACUTE_MYELOID_LEUKEMIA'
  | 'ACUTE_PROMYELOCYTIC_LEUKEMIA'
  | 'ACUTE_LYMPHOBLASTIC_LEUKEMIA'
  | 'CHRONIC_MYELOID_LEUKEMIA'
  | 'CHRONIC_LYMPHOCYTIC_LEUKEMIA'
  | 'MULTIPLE_MYELOMA'
  | 'PRIMARY_MYELOFIBROSIS';

export interface MorphologyEvaluation {
  category: HematologicCategory;
  categoryTitle: string;
  morphologySummary: string;
  myeloidToErythroidRatio: number; // M:E ratio (normal 2:1 - 4:1)
  isMeRatioNormal: boolean;
  leukostasisRisk: 'NONE' | 'MODERATE' | 'IMMINENT_CRISIS'; // WBC > 50-100 in acute leukemias
  tumorLysisSyndromeStage: 'NONE' | 'LABORATORY_TLS' | 'CLINICAL_TLS';
  tlsCriteriaCount: number;
  emergencyActionRequired: boolean;
  recommendedAction: string;
  confirmatoryWorkup: string[];
}

/**
 * Evaluates Hematologic Morphology, M:E ratio, Malignancy Subtypes & Emergencies
 */
export function evaluateHematologyMorphology(
  cbc: CompleteBloodCount,
  diff: PeripheralDifferential,
  rbc: RbcMorphologyFeatures,
  marrow: BoneMarrowFeatures,
  molecular: MolecularCytogenetics,
  tls: CairoBishopTlsParams
): MorphologyEvaluation {
  // 1. Myeloid to Erythroid (M:E) Ratio
  const safeErythroid = Math.max(1, marrow.erythroidPct);
  const rawMeRatio = marrow.myeloidPct / safeErythroid;
  const myeloidToErythroidRatio = Math.round(rawMeRatio * 10) / 10;
  const isMeRatioNormal = myeloidToErythroidRatio >= 1.5 && myeloidToErythroidRatio <= 4.5;

  // 2. Cairo-Bishop Tumor Lysis Syndrome (TLS)
  // Lab TLS: >= 2 of (Uric Acid >= 8, Potassium >= 6, Phos >= 4.5, Calcium <= 7)
  let tlsCriteriaCount = 0;
  if (tls.uricAcidMgDl >= 8.0) tlsCriteriaCount++;
  if (tls.potassiumMeqL >= 6.0) tlsCriteriaCount++;
  if (tls.phosphorusMgDl >= 4.5) tlsCriteriaCount++;
  if (tls.calciumMgDl <= 7.0) tlsCriteriaCount++;

  let tumorLysisSyndromeStage: 'NONE' | 'LABORATORY_TLS' | 'CLINICAL_TLS' = 'NONE';
  if (tlsCriteriaCount >= 2) {
    if (tls.creatinineMgDl >= 1.8 || tls.oliguriaPresent || tls.seizuresOrArrhythmiasPresent) {
      tumorLysisSyndromeStage = 'CLINICAL_TLS';
    } else {
      tumorLysisSyndromeStage = 'LABORATORY_TLS';
    }
  }

  // 3. Leukostasis Risk in Acute Myeloid / Lymphoblastic Leukemia
  let leukostasisRisk: 'NONE' | 'MODERATE' | 'IMMINENT_CRISIS' = 'NONE';
  if (diff.blastsPct >= 20 || marrow.blastCountMarrowPct >= 20) {
    if (cbc.wbc10x9L >= 100) {
      leukostasisRisk = 'IMMINENT_CRISIS';
    } else if (cbc.wbc10x9L >= 50) {
      leukostasisRisk = 'MODERATE';
    }
  }

  // 4. Primary Diagnostic Classification
  let category: HematologicCategory = 'NORMAL_PERIPHERAL_SMEAR';
  let categoryTitle = 'Normal Peripheral Blood & Bone Marrow';
  let morphologySummary = 'Normal trilineage hematopoiesis without significant dysplasia or blasts.';
  let emergencyActionRequired = false;
  let recommendedAction = 'Routine observation and health maintenance.';
  let confirmatoryWorkup: string[] = ['Annual CBC and routine metabolic screening'];

  if (molecular.pmlRaraT15_17 || (rbc.auerRodsPresent && diff.promyelocytesPct >= 30)) {
    category = 'ACUTE_PROMYELOCYTIC_LEUKEMIA';
    categoryTitle = 'Acute Promyelocytic Leukemia (APML / FAB M3)';
    morphologySummary =
      'Heavy azurophilic granulation with multiple Auer rods ("faggot cells") and folded, bilobed promyelocyte nuclei. High risk of life-threatening DIC with consumptive coagulopathy.';
    emergencyActionRequired = true;
    recommendedAction =
      'MEDICAL EMERGENCY: Initiate All-Trans Retinoic Acid (ATRA) 45 mg/m²/day immediately upon morphology suspicion, without waiting for FISH/RT-PCR t(15;17) confirmation. Add Arsenic Trioxide (ATO) and aggressively transfuse platelets (>50k) and cryoprecipitate (fibrinogen > 150 mg/dL).';
    confirmatoryWorkup = [
      'RT-PCR or FISH for PML-RARA t(15;17)',
      'DIC panel: D-dimer, Fibrinogen, PT/INR, aPTT',
      'Baseline EKG for QTc interval monitoring (ATO safety)',
    ];
  } else if (diff.blastsPct >= 20 || marrow.blastCountMarrowPct >= 20) {
    const isLymphoid = molecular.flowImmunophenotype.some(m =>
      m.includes('CD19') || m.includes('CD20') || m.includes('CD10') || /^CD3[+\-\s]/.test(m) || m === 'CD3'
    );
    if (isLymphoid) {
      category = 'ACUTE_LYMPHOBLASTIC_LEUKEMIA';
      categoryTitle = 'Acute Lymphoblastic Leukemia (B-ALL / T-ALL)';
      morphologySummary =
        'Medium-to-large lymphoblasts with high N:C ratio, condensed chromatin, indistinct nucleoli, and agranular cytoplasm. PAS stain frequently positive.';
      recommendedAction =
        'Multi-agent induction chemotherapy (HyperCVAD or pediatric-inspired protocol), lumbar puncture with intrathecal methotrexate for CNS prophylaxis, and Rasburicase/allopurinol for TLS prevention.';
      confirmatoryWorkup = [
        'Flow cytometry immunophenotyping: CD19, CD10 (CALLA), CD20, TdT, surface Ig',
        'Karyotype / FISH: t(9;22) BCR-ABL1 (Ph+ ALL), t(12;21) ETV6-RUNX1, KMT2A rearrangements',
        'Diagnostic lumbar puncture with CSF cytology',
      ];
    } else {
      category = 'ACUTE_MYELOID_LEUKEMIA';
      categoryTitle = 'Acute Myeloid Leukemia (AML)';
      morphologySummary =
        'Large myeloblasts with abundant cytoplasm, fine chromatin, prominent 2-4 nucleoli, and Auer rods. MPO and Sudan Black B positive.';
      recommendedAction =
        'Hospitalize urgently in protected isolation. Initiate 7+3 induction (Cytarabine + Daunorubicin) or Venetoclax + Azacitidine for elderly/unfit patients. Vigorous IV hydration and TLS prophylaxis.';
      confirmatoryWorkup = [
        'Bone marrow aspirate and trephine biopsy with flow cytometry (CD34, CD117, CD33, CD13, MPO)',
        'Next-Generation Sequencing panel (NPM1, FLT3-ITD/TKD, CEBPA, TP53, IDH1/2)',
        'Cytogenetics: inv(16), t(8;21), complex karyotype',
      ];
    }
    if (leukostasisRisk === 'IMMINENT_CRISIS') {
      emergencyActionRequired = true;
      recommendedAction = `LEUKOSTASIS CRISIS (WBC ${cbc.wbc10x9L} x10^9/L): Immediate cytoreduction with Hydroxyurea (50-100 mg/kg/day) +/- emergent leukapheresis. Avoid packed RBC transfusions as this worsens whole-blood viscosity. ${recommendedAction}`;
    }
  } else if (molecular.bcrAbl1T9_22 || (cbc.wbc10x9L > 50 && diff.myelocytesPct + diff.metamyelocytesPct > 15)) {
    category = 'CHRONIC_MYELOID_LEUKEMIA';
    categoryTitle = 'Chronic Myeloid Leukemia (CML - Chronic Phase)';
    morphologySummary =
      'Marked leukocytosis with full spectrum of granulocytic differentiation ("left shift" down to myelocytes), absolute basophilia and eosinophilia, and low LAP (Leukocyte Alkaline Phosphatase) score.';
    recommendedAction =
      'Initiate second-generation Tyrosine Kinase Inhibitor (TKI: Dasatinib, Nilotinib, or Bosutinib) or Imatinib. Monitor BCR-ABL1 transcripts via quantitative RT-PCR on the International Scale at 3, 6, and 12 months.';
    confirmatoryWorkup = [
      'Bone marrow cytogenetics: t(9;22)(q34.1;q11.2) Philadelphia chromosome',
      'Quantitative RT-PCR for BCR-ABL1 fusion transcripts (p210)',
      'Leukocyte Alkaline Phosphatase (LAP) cytochemical score',
    ];
  } else if (diff.lymphocytesPct >= 70 && cbc.wbc10x9L >= 20) {
    category = 'CHRONIC_LYMPHOCYTIC_LEUKEMIA';
    categoryTitle = 'Chronic Lymphocytic Leukemia (CLL / SLL)';
    morphologySummary =
      'Monotonous proliferation of small, mature-appearing lymphocytes with "soccer-ball" clumped chromatin and abundant ruptured smudge/basket cells (Gumprecht shadows).';
    recommendedAction =
      'Rai / Binet clinical staging. Asymptomatic early stage (Rai 0 / Binet A) warrants active surveillance ("watch and wait"). Symptomatic or progressive disease indicates targeted Bruton Tyrosine Kinase (BTK) inhibitor (Acalabrutinib, Zanubrutinib) or Venetoclax + Obinutuzumab.';
    confirmatoryWorkup = [
      'Flow cytometry: CD19+, CD5+, CD23+, CD20 (dim), surface kappa/lambda light chain restriction',
      'FISH for del(17p) / TP53 mutation status',
      'IGHV somatic hypermutation analysis (mutated vs unmutated)',
    ];
  } else if (marrow.plasmaCellsPct >= 10 || rbc.rouleauxFormationPresent) {
    category = 'MULTIPLE_MYELOMA';
    categoryTitle = 'Multiple Myeloma (Plasma Cell Myeloma)';
    morphologySummary =
      'Peripheral smear displays stacked RBC coin-rolls (Rouleaux formation) driven by paraproteinemia. Bone marrow shows clonal plasma cells (>10%) with eccentric clock-face nuclei and perinuclear halo.';
    recommendedAction =
      'Assess CRAB criteria (Hypercalcemia, Renal insufficiency, Anemia, Bone lytic lesions). Quadruplet induction therapy (Daratumumab + Bortezomib + Lenalidomide + Dexamethasone: D-VRd) followed by autologous stem cell transplantation (ASCT) eligibility.';
    confirmatoryWorkup = [
      'Serum and 24-hour urine Protein Electrophoresis (SPEP/UPEP) with Immunofixation',
      'Serum Free Light Chain (sFLC) ratio (kappa/lambda)',
      'Whole-body low-dose CT or FDG-PET/CT for osteolytic lesions',
      'Bone marrow biopsy with CD138 immunohistochemistry and FISH (t(4;14), t(14;16), del(17p))',
    ];
  } else if (rbc.schistocytesPresent) {
    category = 'MICROANGIOPATHIC_HEMOLYTIC_ANEMIA';
    categoryTitle = 'Thrombotic Microangiopathy (TTP / HUS / DIC)';
    morphologySummary =
      'Schistocytes (helmet cells, fragmented RBCs > 1%) resulting from mechanical shear through microvascular platelet thrombi. Markedly elevated LDH, absent haptoglobin, negative Coombs test.';
    emergencyActionRequired = true;
    recommendedAction =
      'EMERGENT: Suspected Thrombotic Thrombocytopenic Purpura (TTP). Order STAT ADAMTS13 activity. Immediately initiate Therapeutic Plasma Exchange (TPE) with fresh frozen plasma, systemic corticosteroids, and Caplacizumab. DO NOT transfuse platelets unless life-threatening bleeding is present.';
    confirmatoryWorkup = [
      'ADAMTS13 activity assay and inhibitor titer (<10% diagnostic of TTP)',
      'Direct Antiglobulin Test (DAT / Coombs) - expect negative',
      'Serum Haptoglobin, LDH, Unconjugated Bilirubin, and Reticulocyte count',
      'Stool PCR for Shiga toxin-producing E. coli (STEC-HUS)',
    ];
  } else if (marrow.dryTapAspiration || rbc.tearDropDacryocytesPresent) {
    category = 'PRIMARY_MYELOFIBROSIS';
    categoryTitle = 'Primary Myelofibrosis (PMF)';
    morphologySummary =
      'Leukoerythroblastic peripheral blood picture with prominent tear-drop poikilocytes (dacryocytes) and nucleated RBCs. Bone marrow aspiration yields "dry tap" due to dense reticulin/collagen fibrosis.';
    recommendedAction =
      'Risk-stratify with DIPSS-Plus score. JAK1/2 inhibitor therapy (Ruxolitinib, Fedratinib) for splenomegaly and constitutional symptoms. Allogeneic hematopoietic stem cell transplantation is the only curative modality.';
    confirmatoryWorkup = [
      'Bone marrow trephine biopsy with Gomori reticulin and Masson trichrome staining (Grade MF-1 to MF-3)',
      'Molecular mutations: JAK2 V617F, CALR exon 9 indels, MPL W515K/L',
      'Abdominal Doppler ultrasound to assess massive splenomegaly and portal hypertension',
    ];
  } else if (rbc.targetCellsPresent || rbc.spherocytesPresent || rbc.sickleCellsDrepanocytesPresent) {
    category = 'HEMOGLOBINOPATHY_OR_MEMBRANOPATHY';
    categoryTitle = 'Hemoglobinopathy or Erythrocyte Membranopathy';
    morphologySummary =
      'Prominent red cell poikilocytosis: target cells (codocytes), spherocytes, or sickle forms (drepanocytes) indicating abnormal hemoglobin structure or cytoskeletal membrane instability.';
    recommendedAction =
      'Obtain High-Performance Liquid Chromatography (HPLC) / hemoglobin electrophoresis and osmotic fragility / EMA binding assay for spherocytosis. Provide folic acid supplementation and supportive care.';
    confirmatoryWorkup = [
      'Hemoglobin HPLC / capillary electrophoresis (HbA, HbA2, HbF, HbS, HbC)',
      'Eosin-5-maleimide (EMA) binding test for Hereditary Spherocytosis',
      'G6PD quantitative enzyme assay (performed in non-acute phase)',
    ];
  }

  // Cairo-Bishop TLS Emergency alert override if clinical TLS
  if (tumorLysisSyndromeStage === 'CLINICAL_TLS') {
    emergencyActionRequired = true;
    recommendedAction = `CRITICAL TLS ALERT: Clinical Tumor Lysis Syndrome established (K+ ${tls.potassiumMeqL} mEq/L, Uric Acid ${tls.uricAcidMgDl} mg/dL, Creatinine ${tls.creatinineMgDl} mg/dL). Administer Rasburicase 0.2 mg/kg IV immediately, aggressive IV hydration with 0.9% Normal Saline (3 L/m²/day), and urgent nephrology consult for emergent hemodialysis. ${recommendedAction}`;
  }

  return {
    category,
    categoryTitle,
    morphologySummary,
    myeloidToErythroidRatio,
    isMeRatioNormal,
    leukostasisRisk,
    tumorLysisSyndromeStage,
    tlsCriteriaCount,
    emergencyActionRequired,
    recommendedAction,
    confirmatoryWorkup,
  };
}

/**
 * 8 Clinical Presets for Hematology Morphology Workstation
 */
export interface MorphologyPreset {
  id: string;
  name: string;
  description: string;
  cbc: CompleteBloodCount;
  diff: PeripheralDifferential;
  rbc: RbcMorphologyFeatures;
  marrow: BoneMarrowFeatures;
  molecular: MolecularCytogenetics;
  tls: CairoBishopTlsParams;
}

export const HEMATOLOGY_PRESETS: MorphologyPreset[] = [
  {
    id: 'normal-smear',
    name: 'Normal Peripheral Blood & Marrow',
    description: '28-year-old healthy adult. Pristine biconcave RBC discs, mature neutrophils, normal platelets, and physiologic 3:1 myeloid:erythroid marrow ratio.',
    cbc: {
      wbc10x9L: 6.8,
      hemoglobinGPerDl: 14.2,
      mcvFl: 88,
      platelets10x9L: 260,
      reticulocytePct: 1.2,
    },
    diff: {
      blastsPct: 0,
      promyelocytesPct: 0,
      myelocytesPct: 0,
      metamyelocytesPct: 0,
      bandsPct: 3,
      segmentedNeutrophilsPct: 62,
      lymphocytesPct: 26,
      monocytesPct: 6,
      eosinophilsPct: 2,
      basophilsPct: 1,
    },
    rbc: {
      schistocytesPresent: false,
      spherocytesPresent: false,
      targetCellsPresent: false,
      tearDropDacryocytesPresent: false,
      sickleCellsDrepanocytesPresent: false,
      biteCellsDegmacytesPresent: false,
      rouleauxFormationPresent: false,
      howellJollyBodiesPresent: false,
      hypersegmentedNeutrophilsPresent: false,
      auerRodsPresent: false,
    },
    marrow: {
      cellularityPct: 65,
      myeloidPct: 60,
      erythroidPct: 20,
      plasmaCellsPct: 1,
      blastCountMarrowPct: 1,
      ringSideroblastsPresent: false,
      dryTapAspiration: false,
    },
    molecular: {
      bcrAbl1T9_22: false,
      pmlRaraT15_17: false,
      jak2V617F: false,
      flowImmunophenotype: ['CD45+ (normal gating)'],
    },
    tls: {
      uricAcidMgDl: 4.8,
      potassiumMeqL: 4.2,
      phosphorusMgDl: 3.4,
      calciumMgDl: 9.4,
      creatinineMgDl: 0.9,
      oliguriaPresent: false,
      seizuresOrArrhythmiasPresent: false,
    },
  },
  {
    id: 'acute-promyelocytic-leukemia-apml',
    name: 'Acute Promyelocytic Leukemia (APML / FAB M3)',
    description: '34-year-old female presenting with severe mucosal oozing, petechiae, and vaginal bleeding. Abundant faggot cells, t(15;17), and impending fatal DIC.',
    cbc: {
      wbc10x9L: 14.5,
      hemoglobinGPerDl: 7.8,
      mcvFl: 92,
      platelets10x9L: 18,
      reticulocytePct: 0.4,
    },
    diff: {
      blastsPct: 8,
      promyelocytesPct: 68,
      myelocytesPct: 4,
      metamyelocytesPct: 2,
      bandsPct: 2,
      segmentedNeutrophilsPct: 8,
      lymphocytesPct: 6,
      monocytesPct: 2,
      eosinophilsPct: 0,
      basophilsPct: 0,
    },
    rbc: {
      schistocytesPresent: true,
      spherocytesPresent: false,
      targetCellsPresent: false,
      tearDropDacryocytesPresent: false,
      sickleCellsDrepanocytesPresent: false,
      biteCellsDegmacytesPresent: false,
      rouleauxFormationPresent: false,
      howellJollyBodiesPresent: false,
      hypersegmentedNeutrophilsPresent: false,
      auerRodsPresent: true,
    },
    marrow: {
      cellularityPct: 95,
      myeloidPct: 85,
      erythroidPct: 5,
      plasmaCellsPct: 1,
      blastCountMarrowPct: 75,
      ringSideroblastsPresent: false,
      dryTapAspiration: false,
    },
    molecular: {
      bcrAbl1T9_22: false,
      pmlRaraT15_17: true,
      jak2V617F: false,
      flowImmunophenotype: ['CD33+', 'CD13+', 'MPO+', 'CD34-', 'HLA-DR-'],
    },
    tls: {
      uricAcidMgDl: 8.6,
      potassiumMeqL: 5.8,
      phosphorusMgDl: 4.8,
      calciumMgDl: 7.2,
      creatinineMgDl: 1.4,
      oliguriaPresent: false,
      seizuresOrArrhythmiasPresent: false,
    },
  },
  {
    id: 'aml-hyperleukocytosis-leukostasis',
    name: 'AML with Hyperleukocytosis & Impending Leukostasis',
    description: '58-year-old male with confusion, dyspnea, WBC 142 x 10^9/L with 82% myeloblasts and multiple Auer rods. Extreme risk of intracranial hemorrhage and pulmonary leukostasis.',
    cbc: {
      wbc10x9L: 142.0,
      hemoglobinGPerDl: 6.9,
      mcvFl: 94,
      platelets10x9L: 28,
      reticulocytePct: 0.3,
    },
    diff: {
      blastsPct: 82,
      promyelocytesPct: 4,
      myelocytesPct: 2,
      metamyelocytesPct: 1,
      bandsPct: 1,
      segmentedNeutrophilsPct: 4,
      lymphocytesPct: 5,
      monocytesPct: 1,
      eosinophilsPct: 0,
      basophilsPct: 0,
    },
    rbc: {
      schistocytesPresent: false,
      spherocytesPresent: false,
      targetCellsPresent: false,
      tearDropDacryocytesPresent: false,
      sickleCellsDrepanocytesPresent: false,
      biteCellsDegmacytesPresent: false,
      rouleauxFormationPresent: false,
      howellJollyBodiesPresent: false,
      hypersegmentedNeutrophilsPresent: false,
      auerRodsPresent: true,
    },
    marrow: {
      cellularityPct: 98,
      myeloidPct: 90,
      erythroidPct: 4,
      plasmaCellsPct: 1,
      blastCountMarrowPct: 88,
      ringSideroblastsPresent: false,
      dryTapAspiration: false,
    },
    molecular: {
      bcrAbl1T9_22: false,
      pmlRaraT15_17: false,
      jak2V617F: false,
      flowImmunophenotype: ['CD34+', 'CD117+', 'CD33+', 'CD13+', 'MPO+'],
    },
    tls: {
      uricAcidMgDl: 11.2,
      potassiumMeqL: 6.4,
      phosphorusMgDl: 6.1,
      calciumMgDl: 6.6,
      creatinineMgDl: 2.2,
      oliguriaPresent: true,
      seizuresOrArrhythmiasPresent: false,
    },
  },
  {
    id: 'ttp-schistocytes-maha',
    name: 'Thrombotic Thrombocytopenic Purpura (TTP)',
    description: '41-year-old female with microangiopathic hemolytic anemia, thrombocytopenia, neurological deficits, and abundant fragmented schistocytes (>4%). ADAMTS13 < 5%.',
    cbc: {
      wbc10x9L: 9.4,
      hemoglobinGPerDl: 6.8,
      mcvFl: 90,
      platelets10x9L: 12,
      reticulocytePct: 8.5,
    },
    diff: {
      blastsPct: 0,
      promyelocytesPct: 0,
      myelocytesPct: 0,
      metamyelocytesPct: 0,
      bandsPct: 4,
      segmentedNeutrophilsPct: 68,
      lymphocytesPct: 20,
      monocytesPct: 6,
      eosinophilsPct: 1,
      basophilsPct: 1,
    },
    rbc: {
      schistocytesPresent: true,
      spherocytesPresent: false,
      targetCellsPresent: false,
      tearDropDacryocytesPresent: false,
      sickleCellsDrepanocytesPresent: false,
      biteCellsDegmacytesPresent: false,
      rouleauxFormationPresent: false,
      howellJollyBodiesPresent: false,
      hypersegmentedNeutrophilsPresent: false,
      auerRodsPresent: false,
    },
    marrow: {
      cellularityPct: 75,
      myeloidPct: 40,
      erythroidPct: 50, // Marked compensatory erythroid hyperplasia
      plasmaCellsPct: 1,
      blastCountMarrowPct: 1,
      ringSideroblastsPresent: false,
      dryTapAspiration: false,
    },
    molecular: {
      bcrAbl1T9_22: false,
      pmlRaraT15_17: false,
      jak2V617F: false,
      flowImmunophenotype: ['Normal polyclonal maturation'],
    },
    tls: {
      uricAcidMgDl: 5.2,
      potassiumMeqL: 4.4,
      phosphorusMgDl: 3.6,
      calciumMgDl: 9.1,
      creatinineMgDl: 1.2,
      oliguriaPresent: false,
      seizuresOrArrhythmiasPresent: false,
    },
  },
  {
    id: 'cml-chronic-phase-ph-positive',
    name: 'Chronic Myeloid Leukemia (CML / BCR-ABL1+)',
    description: '52-year-old male with massive splenomegaly, WBC 98 x 10^9/L with myelocyte bulge, basophilia (4%), and pathognomonic t(9;22) Philadelphia chromosome.',
    cbc: {
      wbc10x9L: 98.0,
      hemoglobinGPerDl: 10.4,
      mcvFl: 86,
      platelets10x9L: 580,
      reticulocytePct: 1.8,
    },
    diff: {
      blastsPct: 2,
      promyelocytesPct: 4,
      myelocytesPct: 18,
      metamyelocytesPct: 14,
      bandsPct: 16,
      segmentedNeutrophilsPct: 34,
      lymphocytesPct: 6,
      monocytesPct: 2,
      eosinophilsPct: 4,
      basophilsPct: 4,
    },
    rbc: {
      schistocytesPresent: false,
      spherocytesPresent: false,
      targetCellsPresent: false,
      tearDropDacryocytesPresent: false,
      sickleCellsDrepanocytesPresent: false,
      biteCellsDegmacytesPresent: false,
      rouleauxFormationPresent: false,
      howellJollyBodiesPresent: false,
      hypersegmentedNeutrophilsPresent: false,
      auerRodsPresent: false,
    },
    marrow: {
      cellularityPct: 95,
      myeloidPct: 88,
      erythroidPct: 6,
      plasmaCellsPct: 1,
      blastCountMarrowPct: 3,
      ringSideroblastsPresent: false,
      dryTapAspiration: false,
    },
    molecular: {
      bcrAbl1T9_22: true,
      pmlRaraT15_17: false,
      jak2V617F: false,
      flowImmunophenotype: ['Myeloid hyperplasia without blast excess'],
    },
    tls: {
      uricAcidMgDl: 7.8,
      potassiumMeqL: 4.6,
      phosphorusMgDl: 3.9,
      calciumMgDl: 9.0,
      creatinineMgDl: 1.0,
      oliguriaPresent: false,
      seizuresOrArrhythmiasPresent: false,
    },
  },
  {
    id: 'cll-smudge-cells-flow',
    name: 'Chronic Lymphocytic Leukemia (CLL / Gumprecht Smudge)',
    description: '69-year-old asymptomatic male with absolute lymphocytosis (WBC 44 x 10^9/L, 88% mature small lymphocytes), prominent smudge cells, CD19+ CD5+ CD23+.',
    cbc: {
      wbc10x9L: 44.0,
      hemoglobinGPerDl: 13.1,
      mcvFl: 89,
      platelets10x9L: 185,
      reticulocytePct: 1.0,
    },
    diff: {
      blastsPct: 0,
      promyelocytesPct: 0,
      myelocytesPct: 0,
      metamyelocytesPct: 0,
      bandsPct: 1,
      segmentedNeutrophilsPct: 9,
      lymphocytesPct: 88,
      monocytesPct: 1,
      eosinophilsPct: 1,
      basophilsPct: 0,
    },
    rbc: {
      schistocytesPresent: false,
      spherocytesPresent: false,
      targetCellsPresent: false,
      tearDropDacryocytesPresent: false,
      sickleCellsDrepanocytesPresent: false,
      biteCellsDegmacytesPresent: false,
      rouleauxFormationPresent: false,
      howellJollyBodiesPresent: false,
      hypersegmentedNeutrophilsPresent: false,
      auerRodsPresent: false,
    },
    marrow: {
      cellularityPct: 75,
      myeloidPct: 35,
      erythroidPct: 15,
      plasmaCellsPct: 2,
      blastCountMarrowPct: 1,
      ringSideroblastsPresent: false,
      dryTapAspiration: false,
    },
    molecular: {
      bcrAbl1T9_22: false,
      pmlRaraT15_17: false,
      jak2V617F: false,
      flowImmunophenotype: ['CD19+', 'CD5+', 'CD23+', 'CD20 (dim)', 'Kappa restricted'],
    },
    tls: {
      uricAcidMgDl: 5.6,
      potassiumMeqL: 4.3,
      phosphorusMgDl: 3.5,
      calciumMgDl: 9.2,
      creatinineMgDl: 0.9,
      oliguriaPresent: false,
      seizuresOrArrhythmiasPresent: false,
    },
  },
  {
    id: 'multiple-myeloma-rouleaux',
    name: 'Multiple Myeloma (Rouleaux & Plasmacytosis)',
    description: '66-year-old male with severe lumbar pain, hypercalcemia, IgG kappa M-spike (4.2 g/dL), prominent RBC rouleaux coin-stacks, and 45% bone marrow plasma cells.',
    cbc: {
      wbc10x9L: 5.2,
      hemoglobinGPerDl: 8.4,
      mcvFl: 91,
      platelets10x9L: 110,
      reticulocytePct: 0.8,
    },
    diff: {
      blastsPct: 0,
      promyelocytesPct: 0,
      myelocytesPct: 0,
      metamyelocytesPct: 0,
      bandsPct: 2,
      segmentedNeutrophilsPct: 62,
      lymphocytesPct: 28,
      monocytesPct: 6,
      eosinophilsPct: 1,
      basophilsPct: 1,
    },
    rbc: {
      schistocytesPresent: false,
      spherocytesPresent: false,
      targetCellsPresent: false,
      tearDropDacryocytesPresent: false,
      sickleCellsDrepanocytesPresent: false,
      biteCellsDegmacytesPresent: false,
      rouleauxFormationPresent: true,
      howellJollyBodiesPresent: false,
      hypersegmentedNeutrophilsPresent: false,
      auerRodsPresent: false,
    },
    marrow: {
      cellularityPct: 80,
      myeloidPct: 28,
      erythroidPct: 12,
      plasmaCellsPct: 45,
      blastCountMarrowPct: 1,
      ringSideroblastsPresent: false,
      dryTapAspiration: false,
    },
    molecular: {
      bcrAbl1T9_22: false,
      pmlRaraT15_17: false,
      jak2V617F: false,
      flowImmunophenotype: ['CD138+', 'CD38+', 'CD56+', 'CD19-'],
    },
    tls: {
      uricAcidMgDl: 8.8,
      potassiumMeqL: 4.9,
      phosphorusMgDl: 4.8,
      calciumMgDl: 12.8, // Marked hypercalcemia
      creatinineMgDl: 2.6,
      oliguriaPresent: false,
      seizuresOrArrhythmiasPresent: false,
    },
  },
  {
    id: 'primary-myelofibrosis-dacryocytes',
    name: 'Primary Myelofibrosis (Tear-Drop Dacryocytes & Dry Tap)',
    description: '61-year-old male with massive hepatosplenomegaly, constitutional symptoms, teardrop poikilocytosis, leukoerythroblastosis, and bone marrow aspirate dry tap.',
    cbc: {
      wbc10x9L: 24.5,
      hemoglobinGPerDl: 8.2,
      mcvFl: 87,
      platelets10x9L: 82,
      reticulocytePct: 3.2,
    },
    diff: {
      blastsPct: 1,
      promyelocytesPct: 2,
      myelocytesPct: 6,
      metamyelocytesPct: 8,
      bandsPct: 12,
      segmentedNeutrophilsPct: 56,
      lymphocytesPct: 11,
      monocytesPct: 3,
      eosinophilsPct: 1,
      basophilsPct: 0,
    },
    rbc: {
      schistocytesPresent: false,
      spherocytesPresent: false,
      targetCellsPresent: false,
      tearDropDacryocytesPresent: true,
      sickleCellsDrepanocytesPresent: false,
      biteCellsDegmacytesPresent: false,
      rouleauxFormationPresent: false,
      howellJollyBodiesPresent: false,
      hypersegmentedNeutrophilsPresent: false,
      auerRodsPresent: false,
    },
    marrow: {
      cellularityPct: 40,
      myeloidPct: 50,
      erythroidPct: 15,
      plasmaCellsPct: 1,
      blastCountMarrowPct: 2,
      ringSideroblastsPresent: false,
      dryTapAspiration: true,
    },
    molecular: {
      bcrAbl1T9_22: false,
      pmlRaraT15_17: false,
      jak2V617F: true,
      flowImmunophenotype: ['Leukoerythroblastic picture'],
    },
    tls: {
      uricAcidMgDl: 8.4,
      potassiumMeqL: 4.8,
      phosphorusMgDl: 4.2,
      calciumMgDl: 9.1,
      creatinineMgDl: 1.1,
      oliguriaPresent: false,
      seizuresOrArrhythmiasPresent: false,
    },
  },
];
