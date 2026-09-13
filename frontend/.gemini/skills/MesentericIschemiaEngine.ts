/**
 * MesentericIschemiaEngine.ts
 * Vascular Surgery, Critical Care & Gastroenterology Physiology Engine:
 * Acute Mesenteric Ischemia (AMI) 4 Subtypes:
 * 1. Superior Mesenteric Artery (SMA) Embolism (Cardioembolic / Afib)
 * 2. SMA Thrombosis (Atherosclerotic / Intestinal Angina history)
 * 3. Non-Occlusive Mesenteric Ischemia (NOMI - Splanchnic Vasoconstriction / Shock / High Pressors)
 * 4. Mesenteric Venous Thrombosis (MVT - Hypercoagulable / Malignancy)
 * Pain Out of Proportion to Physical Exam, Biphasic CTA Protocol,
 * Serum Lactate Pitfall (Normal Lactate Does NOT Rule Out Early AMI),
 * Continuous Intra-Arterial Papaverine Vasodilator Infusion,
 * Resection Paradigms, and Mandatory Second-Look Laparotomy (24-48h).
 */

export type MesentericIschemiaSubtype =
  | 'SMA_EMBOLISM'       // 40-50%: Sudden cardioembolism (Afib), lodges 3-8 cm distal to SMA origin
  | 'SMA_THROMBOSIS'      // 20-30%: Plaque rupture at SMA ostium, prior "intestinal angina" sitophobia
  | 'NON_OCCLUSIVE_NOMI'  // 20%: Low flow state (cardiogenic shock, high alpha-agonists), severe spasm
  | 'MESENTERIC_VENOUS_MVT'; // 10%: Hypercoagulable, portal HTN, venous congestion and wall edema

export type BowelViabilityStage =
  | 'STAGE_1_HYPEREMIC_MUCOSAL_ISCHEMIA'   // Reversible, mucosa threatened, serosa looks normal!
  | 'STAGE_2_TRANSMURAL_PATCHY_ISCHEMIA'   // Borderline, duskiness, diminished peristalsis
  | 'STAGE_3_FRANK_GANGRENOUS_NECROSIS'    // Irreversible, black/green, aperistaltic, foul odor
  | 'STAGE_4_PERFORATION_FECAL_PERITONITIS'; // Perforated, free air, gross contamination

export type DiagnosticImagingModality =
  | 'NONE_CLINICAL_SUSPICION_ONLY'
  | 'ABDOMINAL_PLAIN_XRAY'           // Low yield early; only detects late free air or ileus
  | 'BIPHASIC_CT_ANGIOGRAPHY_CTA'    // GOLD STANDARD: IV contrast, arterial + portal venous phases, no oral contrast
  | 'CT_WITH_ORAL_CONTRAST'          // PITFALL: Oral contrast obscures vessel lumen & mucosal enhancement!
  | 'ABDOMINAL_ULTRASOUND_DOPPLER';  // Obscured by bowel gas, unhelpful for distal branches

export type RevascularizationIntervention =
  | 'NONE_CONSERVATIVE'
  | 'INTRA_ARTERIAL_PAPAVERINE_INFUSION' // 30-60 mg/h direct vasodilatation (mandatory for NOMI / spasm)
  | 'ENDOVASCULAR_ASPIRATION_THROMBECTOMY' // Catheter-directed mechanical recanalization
  | 'OPEN_SURGICAL_EMBOLECTOMY_PATCH'    // Transverse arteriotomy + Fogarty balloon + patch
  | 'MESENTERIC_BYPASS_GRAFT'            // Aorto-SMA or Ilio-SMA bypass (for ostial thrombosis)
  | 'SYSTEMIC_ANTICOAGULATION_HEPARIN';  // Primary for MVT

export interface MesentericPatientParams {
  subtype: MesentericIschemiaSubtype;
  hoursFromPainOnset: number; // 1 to 36 hours (irreversible necrosis after 6-12h)
  historyOfAtrialFibrillation: boolean;
  priorIntestinalAnginaWeightLoss: boolean; // Chronic postprandial pain
  highDoseAlphaVasopressorsActive: boolean; // Norepi > 20 mcg/min or Phenylephrine triggering NOMI
  knownThrombophiliaMalignancy: boolean;

  // Clinical Exam
  painSeverityScore10: number; // typically 9-10/10
  abdominalTendernessMildVsPeritonitis: 'SOFT_MINIMAL_TENDERNESS' | 'FOCAL_GUARDING' | 'DIFFUSE_RIGIDITY_REBOUND';

  // Diagnostics
  serumLactateMmolPerL: number; // Normal 0.5-2.0; elevated > 2.0 indicates late transmural ischemia
  whiteBloodCellCountK: number; // Leukocytosis with left shift (> 15,000-20,000 /uL)
  imagingOrdered: DiagnosticImagingModality;

  // Therapies
  revascularization: RevascularizationIntervention;
  systemicHeparinBolusAndDrip: boolean;
  broadSpectrumAntibioticsCoveringEnterics: boolean; // Zosyn or Cefepime + Flagyl
  secondLookLaparotomyPlanned: boolean; // Within 24-48 hours
}

export interface MesentericSimulationOutput {
  predictedViabilityStage: BowelViabilityStage;
  isLactateMisleadinglyNormal: boolean; // True if lactate normal (< 2.0) despite ongoing early ischemia
  diagnosticAccuracy: {
    imagingEffective: boolean;
    imagingWarning?: string;
  };
  vascularPatencyAchieved: boolean;
  revascularizationAppropriate: boolean;
  shortBowelSyndromeRisk: 'LOW' | 'MODERATE' | 'CRITICAL_EXTENSIVE_RESECTION';
  estimatedViableSmallBowelLengthCm: number; // Normal ~400-600 cm; < 150-200 cm = Short Bowel Syndrome

  // Second-Look Laparotomy Analysis
  secondLookAssessment: {
    mandated: boolean;
    secondLookRationale: string;
  };

  clinicalAlerts: string[];
  therapeuticPriorities: string[];
}

export const DEFAULT_MESENTERIC_PATIENT: MesentericPatientParams = {
  subtype: 'SMA_EMBOLISM',
  hoursFromPainOnset: 3,
  historyOfAtrialFibrillation: true,
  priorIntestinalAnginaWeightLoss: false,
  highDoseAlphaVasopressorsActive: false,
  knownThrombophiliaMalignancy: false,
  painSeverityScore10: 10,
  abdominalTendernessMildVsPeritonitis: 'SOFT_MINIMAL_TENDERNESS', // Classic "pain out of proportion"
  serumLactateMmolPerL: 1.4, // MISLEADINGLY NORMAL!
  whiteBloodCellCountK: 16.8,
  imagingOrdered: 'NONE_CLINICAL_SUSPICION_ONLY',
  revascularization: 'NONE_CONSERVATIVE',
  systemicHeparinBolusAndDrip: false,
  broadSpectrumAntibioticsCoveringEnterics: false,
  secondLookLaparotomyPlanned: false
};

/**
 * Simulates mesenteric ischemic progression, biomarker traps, revascularization efficacy,
 * and second-look surgical paradigms.
 */
export function simulateMesentericIschemia(params: MesentericPatientParams): MesentericSimulationOutput {
  const alerts: string[] = [];
  const priorities: string[] = [];

  // 1. Pathophysiological Stage Progression
  let stage: BowelViabilityStage = 'STAGE_1_HYPEREMIC_MUCOSAL_ISCHEMIA';
  let viableLengthCm = 500; // Baseline healthy small bowel length

  if (params.hoursFromPainOnset < 6) {
    stage = 'STAGE_1_HYPEREMIC_MUCOSAL_ISCHEMIA';
    viableLengthCm = 480;
  } else if (params.hoursFromPainOnset >= 6 && params.hoursFromPainOnset < 12) {
    stage = 'STAGE_2_TRANSMURAL_PATCHY_ISCHEMIA';
    viableLengthCm = 350;
  } else if (params.hoursFromPainOnset >= 12 && params.hoursFromPainOnset < 24) {
    stage = 'STAGE_3_FRANK_GANGRENOUS_NECROSIS';
    viableLengthCm = 180;
  } else {
    stage = 'STAGE_4_PERFORATION_FECAL_PERITONITIS';
    viableLengthCm = 90;
  }

  // If peritonitis is present on exam, advance stage to at least transmural/gangrenous
  if (params.abdominalTendernessMildVsPeritonitis === 'DIFFUSE_RIGIDITY_REBOUND' && stage !== 'STAGE_4_PERFORATION_FECAL_PERITONITIS') {
    stage = 'STAGE_3_FRANK_GANGRENOUS_NECROSIS';
    viableLengthCm = Math.min(viableLengthCm, 160);
  }

  // 2. The Classic "Pain Out of Proportion" Sign
  if (params.painSeverityScore10 >= 8 && params.abdominalTendernessMildVsPeritonitis === 'SOFT_MINIMAL_TENDERNESS') {
    alerts.push('CARDINAL DIAGNOSTIC CLUE: Severe excruciating abdominal pain completely OUT OF PROPORTION to a soft, benign physical examination. This is the pathognomonic hallmark of early acute mesenteric ischemia before transmural necrosis.');
  }

  // 3. The Dangerous Serum Lactate Pitfall
  const isLactateMisleadinglyNormal = params.serumLactateMmolPerL <= 2.0 && stage !== 'STAGE_4_PERFORATION_FECAL_PERITONITIS';
  if (isLactateMisleadinglyNormal) {
    alerts.push('SERUM LACTATE PITFALL: Serum lactate is NORMAL (<= 2.0 mmol/L). Normal lactate DOES NOT exclude acute mesenteric ischemia! Lactate only surges late after full-thickness transmural gangrene develops. Waiting for elevated lactate guarantees bowel death.');
  } else if (params.serumLactateMmolPerL > 2.0) {
    alerts.push(`ELEVATED SERUM LACTATE (${params.serumLactateMmolPerL} mmol/L): Indicates established transmural bowel ischemia, mucosal barrier failure, anaerobic metabolism, and impending gangrenous necrosis.`);
  }

  // 4. Imaging Accuracy & Pitfalls
  let imagingEffective = false;
  let imagingWarning: string | undefined = undefined;

  if (params.imagingOrdered === 'BIPHASIC_CT_ANGIOGRAPHY_CTA') {
    imagingEffective = true;
    alerts.push('GOLD STANDARD IMAGING CONFIRMED: Biphasic CTA (arterial and portal venous phases without oral contrast) has >95% sensitivity for SMA filling defects, bowel wall hypoenhancement, and mesenteric vessel occlusion.');
  } else if (params.imagingOrdered === 'CT_WITH_ORAL_CONTRAST') {
    imagingEffective = false;
    imagingWarning = 'IMAGING HAZARD: CT with oral contrast obscures intraluminal mesenteric arterial filling defects and prevents evaluation of bowel wall mucosal hypoenhancement! Order biphasic CTA WITHOUT oral contrast.';
    alerts.push(imagingWarning);
  } else if (params.imagingOrdered === 'ABDOMINAL_PLAIN_XRAY') {
    imagingEffective = false;
    imagingWarning = 'INADEQUATE DIAGNOSTIC MODALITY: Abdominal plain radiographs are completely insensitive in early ischemia (<30% sensitivity). They only reveal late, pre-terminal signs like pneumatosis intestinalis or free air.';
    alerts.push(imagingWarning);
  } else if (params.imagingOrdered === 'ABDOMINAL_ULTRASOUND_DOPPLER') {
    imagingEffective = false;
    imagingWarning = 'LIMITED MODALITY: Ultrasound Doppler is severely limited by overlying bowel gas and cannot evaluate distal SMA branches or microvascular perfusion.';
    alerts.push(imagingWarning);
  } else {
    alerts.push('IMAGING PENDING: Urgent Biphasic CT Angiography (CTA) of abdomen and pelvis is indicated immediately without delay.');
  }

  // 5. Revascularization Efficacy by Subtype
  let revascularizationAppropriate = false;
  let vascularPatencyAchieved = false;

  if (params.subtype === 'SMA_EMBOLISM') {
    if (params.revascularization === 'OPEN_SURGICAL_EMBOLECTOMY_PATCH' || params.revascularization === 'ENDOVASCULAR_ASPIRATION_THROMBECTOMY') {
      revascularizationAppropriate = true;
      vascularPatencyAchieved = true;
      viableLengthCm = Math.min(500, viableLengthCm + 120);
      alerts.push('SUCCESSFUL EMBOLECTOMY: Mechanical extraction of embolus restores pulsatile arterial flow through SMA branches.');
    }
  } else if (params.subtype === 'SMA_THROMBOSIS') {
    if (params.revascularization === 'MESENTERIC_BYPASS_GRAFT' || params.revascularization === 'ENDOVASCULAR_ASPIRATION_THROMBECTOMY') {
      revascularizationAppropriate = true;
      vascularPatencyAchieved = true;
      viableLengthCm = Math.min(500, viableLengthCm + 100);
      alerts.push('SUCCESSFUL BYPASS / STENTING: Revascularization overcomes ostial atherosclerotic occlusion, restoring mesenteric perfusion.');
    }
  } else if (params.subtype === 'NON_OCCLUSIVE_NOMI') {
    if (params.revascularization === 'INTRA_ARTERIAL_PAPAVERINE_INFUSION') {
      revascularizationAppropriate = true;
      vascularPatencyAchieved = true;
      viableLengthCm = Math.min(500, viableLengthCm + 150);
      alerts.push('PAPAVERINE VASODILATOR SUCCESS: Direct intra-arterial infusion of Papaverine (30-60 mg/h) relieves intense splanchnic vasospasm, overcoming non-occlusive hypoperfusion.');
    } else if (params.highDoseAlphaVasopressorsActive) {
      alerts.push('VASOPRESSOR EXACERBATION IN NOMI: High-dose alpha-adrenergic vasopressors worsen splanchnic vasoconstriction. Switch to inotropic agents (e.g. Dobutamine, Milrinone) or balanced pressors while infusing intra-arterial Papaverine.');
    }
  } else if (params.subtype === 'MESENTERIC_VENOUS_MVT') {
    if (params.revascularization === 'SYSTEMIC_ANTICOAGULATION_HEPARIN') {
      revascularizationAppropriate = true;
      vascularPatencyAchieved = true;
      viableLengthCm = Math.min(500, viableLengthCm + 80);
      alerts.push('ANTICOAGULATION PROTOCOL: Continuous IV unfractionated heparin halts venous thrombus propagation, allowing collateral venous decompression.');
    }
  }

  // 6. Resection Paradigms & Second-Look Laparotomy
  const isSecondLookMandated = stage === 'STAGE_2_TRANSMURAL_PATCHY_ISCHEMIA' || stage === 'STAGE_3_FRANK_GANGRENOUS_NECROSIS';
  let secondLookRationale = '';

  if (isSecondLookMandated) {
    secondLookRationale = 'MANDATORY SECOND-LOOK LAPAROTOMY (24-48h): In initial operation, only frankly necrotic black/aperistaltic bowel should be resected. Borderline ischemic loops are left in continuity with temporary abdominal closure. Re-evaluating bowel 24-48 hours after revascularization prevents catastrophic over-resection and Short Bowel Syndrome.';
    if (params.secondLookLaparotomyPlanned) {
      alerts.push('SECOND-LOOK LAPAROTOMY PLANNED: Adheres to evidence-based damage control principles. Borderline segments preserved for reassessment.');
    } else {
      alerts.push('CRITICAL SURGICAL DIRECTIVE: Second-look laparotomy must be scheduled within 24 to 48 hours to inspect borderline bowel viability!');
    }
  } else {
    secondLookRationale = 'Early mucosal hyperemia without full-thickness necrosis; second-look laparotomy may be deferred if clinical course rapidly improves post-revascularization.';
  }

  // Short Bowel Syndrome Risk
  let shortBowelRisk: 'LOW' | 'MODERATE' | 'CRITICAL_EXTENSIVE_RESECTION' = 'LOW';
  if (viableLengthCm < 150) {
    shortBowelRisk = 'CRITICAL_EXTENSIVE_RESECTION';
    alerts.push(`CRITICAL SHORT BOWEL SYNDROME HAZARD: Remaining viable small intestine is only ${viableLengthCm} cm (< 150-200 cm threshold). High risk of lifelong parenteral nutrition (TPN) dependence, malabsorption, and intestinal failure.`);
  } else if (viableLengthCm < 250) {
    shortBowelRisk = 'MODERATE';
  }

  // 7. Therapeutic Priorities
  if (!params.systemicHeparinBolusAndDrip && stage !== 'STAGE_4_PERFORATION_FECAL_PERITONITIS') {
    priorities.push('Initiate continuous IV unfractionated heparin infusion immediately to prevent microvascular thrombus propagation.');
  }
  if (!params.broadSpectrumAntibioticsCoveringEnterics) {
    priorities.push('Administer broad-spectrum IV antibiotics covering enteric gram-negatives and anaerobes (Piperacillin-Tazobactam or Cefepime + Metronidazole) to treat bacterial translocation.');
  }
  if (!vascularPatencyAchieved) {
    priorities.push('Emergent vascular intervention: Endovascular thrombectomy/stent or open surgical embolectomy/bypass.');
  }
  if (params.subtype === 'NON_OCCLUSIVE_NOMI' && params.revascularization !== 'INTRA_ARTERIAL_PAPAVERINE_INFUSION') {
    priorities.push('Place mesenteric angiography catheter for continuous intra-arterial Papaverine infusion (30-60 mg/h).');
  }
  if (isSecondLookMandated && !params.secondLookLaparotomyPlanned) {
    priorities.push('Schedule mandatory Second-Look Laparotomy within 24-48 hours with temporary abdominal vacuum closure.');
  }

  return {
    predictedViabilityStage: stage,
    isLactateMisleadinglyNormal,
    diagnosticAccuracy: {
      imagingEffective,
      imagingWarning
    },
    vascularPatencyAchieved,
    revascularizationAppropriate,
    shortBowelSyndromeRisk: shortBowelRisk,
    estimatedViableSmallBowelLengthCm: viableLengthCm,
    secondLookAssessment: {
      mandated: isSecondLookMandated,
      secondLookRationale
    },
    clinicalAlerts: alerts,
    therapeuticPriorities: priorities
  };
}
