/**
 * GIEndoscopyEngine.ts
 * Mediverse — Upper GI Endoscopy (EGD) & ERCP Biophysical Engine
 *
 * Models:
 * - Endoscopic Anatomy & Spatial Depth:
 *   • Upper Esophageal Sphincter (UES) at 15 cm
 *   • Gastroesophageal Junction (GEJ / Z-line) at 38–40 cm
 *   • Gastric Fundus, Body, Incisura Angularis, Antrum, and Pylorus (55–60 cm)
 *   • Duodenal Bulb (D1) and Descending Duodenum (D2) Major Papilla (Ampulla of Vater) at 65–75 cm
 * - Peptic Ulcer Bleeding Forrest Classification (Ia, Ib, IIa, IIb, IIc, III) & Rebleeding Risk
 * - Esophageal Variceal Hemostasis:
 *   • Paquet / Baveno grading (Grade I–IV)
 *   • Endoscopic Band Ligation (EBL) mechanics
 *   • Vasoactive infusions (Octreotide 50 mcg bolus + 50 mcg/hr)
 * - ERCP Biliary Cannulation & Sphincterotomy:
 *   • Papillary orientation (11 to 1 o'clock axis)
 *   • Sphincterotome electrosurgical energy (EndoCut vs pure cut)
 *   • Post-ERCP Pancreatitis (PEP) prophylaxis (Rectal Indomethacin 100 mg + Prophylactic Pancreatic Stent)
 *   • Choledocholithiasis balloon stone extraction and plastic biliary stent placement
 * - Barrett's Esophagus Prague C & M Criteria (Circumferential & Maximum extent)
 * - Rockall and Glasgow-Blatchford Bleeding Risk Scores
 */

// ─── Enums & Types ────────────────────────────────────────────────────────────

export type ForrestGrade =
  | 'IA_SPURTING_HEMORRHAGE'
  | 'IB_OOZING_HEMORRHAGE'
  | 'IIA_NON_BLEEDING_VISIBLE_VESSEL'
  | 'IIB_ADHERENT_CLOT'
  | 'IIC_FLAT_PIGMENTED_SPOT'
  | 'III_CLEAN_BASED_ULCER';

export type VaricealGrade = 'NONE' | 'GRADE_I' | 'GRADE_II' | 'GRADE_III' | 'GRADE_IV';

export type EndoscopicZone =
  | 'ESOPHAGUS'
  | 'GASTROESOPHAGEAL_JUNCTION'
  | 'GASTRIC_FUNDUS'
  | 'GASTRIC_BODY'
  | 'GASTRIC_ANTRUM'
  | 'DUODENAL_BULB_D1'
  | 'AMPULLA_OF_VATER_D2';

export type ERCPWirePosition = 'NOT_ENGAGED' | 'PANCREATIC_DUCT' | 'COMMON_BILE_DUCT';

export type GIEndoscopyAlarm =
  | 'OPTIMAL'
  | 'ACTIVE_ARTERIAL_SPURTING'
  | 'VARICEAL_EXSANGUINATION'
  | 'POST_ERCP_PANCREATITIS_RISK'
  | 'DUODENAL_PERFORATION_RISK'
  | 'BILIARY_OBSTRUCTION_CHOLANGITIS'
  | 'ASPIRATION_RISK_GASTRIC_BLOOD'
  | 'HIGH_REBLEEDING_RISK_FORREST_I';

export type PresetId =
  | 'BLEEDING_DUODENAL_ULCER_FORREST_IA'
  | 'ESOPHAGEAL_VARICEAL_HEMORRHAGE'
  | 'CHOLEDOCHOLITHIASIS_ERCP_SPHINCTEROTOMY'
  | 'BARRETTS_ESOPHAGUS_SURVEILLANCE'
  | 'GASTRIC_ANTRAL_ULCER_FORREST_IIA'
  | 'MALIGNANT_BILIARY_OBSTRUCTION_STENTING';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface RockallScore {
  ageScore: number;
  shockScore: number;
  comorbidityScore: number;
  diagnosisScore: number;
  stigmataScore: number;
  totalScore: number; // 0–11 (>5 = high mortality risk)
}

export interface GlasgowBlatchfordScore {
  totalScore: number; // 0–23 (>0 typically requires hospital admission; >=6 high risk for intervention)
}

export interface ERCPState {
  papillaCannulated: boolean;
  wirePosition: ERCPWirePosition;
  contrastInjected: boolean;
  cholangiogramBileDuctDilationMm: number; // Normal <= 7 mm; dilated > 10 mm
  choledocholithiasisDetected: boolean;
  stoneDiameterMm: number;
  sphincterotomyCutPerformed: boolean;
  balloonTrawlPerformed: boolean;
  stonesCleared: boolean;
  biliaryStentPlaced: boolean;
  rectalIndomethacinGiven: boolean; // 100 mg for PEP prevention
  pancreaticStentPlaced: boolean; // Prophylaxis if inadvertent PD cannulation
  pepRiskPct: number; // Post-ERCP Pancreatitis risk (5% baseline, up to 25% with repeated PD cannulations)
}

export interface GIEndoscopyInputParams {
  presetId: PresetId;
  scopeInsertionDepthCm: number; // 15–80 cm
  cameraRetroflexion: boolean; // J-maneuver in stomach
  activeTool: 'NONE' | 'HEMOCLIP' | 'BIPOLAR_PROBE' | 'INJECTION_NEEDLE_EPI' | 'BAND_LIGATOR' | 'SPHINCTEROTOME' | 'EXTRACTION_BALLOON' | 'BILIARY_STENT';
  epinephrineInjected: boolean;
  clipsDeployedCount: number;
  bandsDeployedCount: number;
  octreotideInfusionActive: boolean;
  ivPpiBolusGiven: boolean; // 80 mg Pantoprazole IV + 8 mg/hr
  ercpWireEngagement: ERCPWirePosition;
  sphincterotomyApplied: boolean;
  rectalIndomethacinGiven: boolean;
  prophylacticPancreaticStent: boolean;
  balloonTrawlDone: boolean;
  biliaryStentDeployed: boolean;
  patientAge: number;
  sbpMmHg: number;
  hrBpm: number;
  hemoglobinGdL: number;
  bloodInStomachMl: number;
}

export interface GIEndoscopyState {
  currentZone: EndoscopicZone;
  activePathology: string;
  forrestGrade: ForrestGrade | null;
  varicealGrade: VaricealGrade | null;
  rebleedingRiskPct: number;
  activeHemorrhage: boolean;
  hemostasisAchieved: boolean;
  dualTherapyAchieved: boolean; // e.g. Epinephrine + Clips / Thermal
  ercp: ERCPState;
  rockall: RockallScore;
  gbsScore: number;
  activeAlarms: GIEndoscopyAlarm[];
  viewFinderOverlay: string;
}

export interface PresetInfo {
  id: PresetId;
  title: string;
  indication: string;
  targetDepthCm: number;
  forrestOrVarices: string;
  guidelineAction: string;
  initialState: Partial<GIEndoscopyInputParams>;
}

// ─── Preset Catalog ──────────────────────────────────────────────────────────

export const ENDOSCOPY_PRESETS: Record<PresetId, PresetInfo> = {
  BLEEDING_DUODENAL_ULCER_FORREST_IA: {
    id: 'BLEEDING_DUODENAL_ULCER_FORREST_IA',
    title: 'Severe Duodenal Ulcer — Forrest Ia Arterial Spurter',
    indication: 'Melena and hematemesis. Large posterior duodenal bulb ulcer with active pulsatile arterial spurting (gastroduodenal artery erosion). Highest rebleeding risk (>90%).',
    targetDepthCm: 60,
    forrestOrVarices: 'Forrest Ia (Arterial Spurter)',
    guidelineAction: 'Dual endoscopic therapy (Dilute epinephrine 1:10,000 + Hemoclips or Bipolar electrocoagulation). High-dose IV PPI (80 mg bolus + 8 mg/hr).',
    initialState: {
      presetId: 'BLEEDING_DUODENAL_ULCER_FORREST_IA',
      scopeInsertionDepthCm: 60,
      activeTool: 'NONE',
      epinephrineInjected: false,
      clipsDeployedCount: 0,
      ivPpiBolusGiven: true,
      sbpMmHg: 92,
      hrBpm: 124,
      hemoglobinGdL: 7.4,
      bloodInStomachMl: 600,
    },
  },
  ESOPHAGEAL_VARICEAL_HEMORRHAGE: {
    id: 'ESOPHAGEAL_VARICEAL_HEMORRHAGE',
    title: 'Acute Cirrhotic Esophageal Variceal Hemorrhage',
    indication: 'Decompensated cirrhosis with hematemesis. Grade III/IV tortuous, blue columnar varices in lower third of esophagus with active "white nipple" stigmata / jet bleeding.',
    targetDepthCm: 38,
    forrestOrVarices: 'Grade III/IV Columnar Varices',
    guidelineAction: 'Endoscopic Variceal Band Ligation (EVL/EBL) at GE junction working cephalad. Vasoactive therapy (Octreotide 50 mcg bolus + 50 mcg/hr) + Ceftriaxone 1g IV for SBP prophylaxis.',
    initialState: {
      presetId: 'ESOPHAGEAL_VARICEAL_HEMORRHAGE',
      scopeInsertionDepthCm: 38,
      activeTool: 'BAND_LIGATOR',
      bandsDeployedCount: 0,
      octreotideInfusionActive: true,
      ivPpiBolusGiven: true,
      sbpMmHg: 88,
      hrBpm: 118,
      hemoglobinGdL: 6.9,
      bloodInStomachMl: 800,
    },
  },
  CHOLEDOCHOLITHIASIS_ERCP_SPHINCTEROTOMY: {
    id: 'CHOLEDOCHOLITHIASIS_ERCP_SPHINCTEROTOMY',
    title: 'Choledocholithiasis — ERCP Biliary Sphincterotomy & Extraction',
    indication: 'Ascending cholangitis and acute gallstone pancreatitis. Common Bile Duct (CBD) dilated to 14 mm with a 9 mm obstructive stone in the distal duct.',
    targetDepthCm: 70,
    forrestOrVarices: 'Biliary Obstruction / Ampullary Impaction',
    guidelineAction: 'Selective deep biliary cannulation with sphincterotome at 11 o\'clock axis. Biliary sphincterotomy, balloon trawl stone clearance, and Rectal Indomethacin 100 mg for PEP prevention.',
    initialState: {
      presetId: 'CHOLEDOCHOLITHIASIS_ERCP_SPHINCTEROTOMY',
      scopeInsertionDepthCm: 70,
      activeTool: 'SPHINCTEROTOME',
      ercpWireEngagement: 'NOT_ENGAGED',
      sphincterotomyApplied: false,
      rectalIndomethacinGiven: false,
      balloonTrawlDone: false,
      biliaryStentDeployed: false,
      sbpMmHg: 112,
      hrBpm: 92,
      hemoglobinGdL: 12.8,
      bloodInStomachMl: 0,
    },
  },
  BARRETTS_ESOPHAGUS_SURVEILLANCE: {
    id: 'BARRETTS_ESOPHAGUS_SURVEILLANCE',
    title: 'Barrett\'s Esophagus Surveillance (Prague C3M5)',
    indication: 'Long-standing GERD with salmon-pink columnar-lined intestinal metaplasia extending 3 cm circumferentially and 5 cm maximally above GEJ. Targeted 4-quadrant Seattle biopsy protocol.',
    targetDepthCm: 36,
    forrestOrVarices: 'Prague C3M5 Metaplasia',
    guidelineAction: 'High-definition white light + narrow-band imaging (NBI). Seattle 4-quadrant biopsies every 1–2 cm. Radiofrequency ablation (RFA) or EMR if high-grade dysplasia confirmed.',
    initialState: {
      presetId: 'BARRETTS_ESOPHAGUS_SURVEILLANCE',
      scopeInsertionDepthCm: 36,
      activeTool: 'NONE',
      ivPpiBolusGiven: true,
      sbpMmHg: 124,
      hrBpm: 72,
      hemoglobinGdL: 14.1,
      bloodInStomachMl: 0,
    },
  },
  GASTRIC_ANTRAL_ULCER_FORREST_IIA: {
    id: 'GASTRIC_ANTRAL_ULCER_FORREST_IIA',
    title: 'Gastric Antral Ulcer — Forrest IIa Non-Bleeding Visible Vessel',
    indication: 'NSAID-induced 18 mm ulcer at lesser curve incisura with raised pigmented protuberance (non-bleeding visible vessel). Rebleeding risk ~50% without endoscopic hemostasis.',
    targetDepthCm: 55,
    forrestOrVarices: 'Forrest IIa (Visible Vessel)',
    guidelineAction: 'Thermal contact coagulation (bipolar) or mechanical hemoclips with adjuvant dilute epinephrine. Stop NSAIDs; test and treat Helicobacter pylori.',
    initialState: {
      presetId: 'GASTRIC_ANTRAL_ULCER_FORREST_IIA',
      scopeInsertionDepthCm: 55,
      activeTool: 'HEMOCLIP',
      epinephrineInjected: false,
      clipsDeployedCount: 0,
      ivPpiBolusGiven: true,
      sbpMmHg: 108,
      hrBpm: 86,
      hemoglobinGdL: 9.2,
      bloodInStomachMl: 150,
    },
  },
  MALIGNANT_BILIARY_OBSTRUCTION_STENTING: {
    id: 'MALIGNANT_BILIARY_OBSTRUCTION_STENTING',
    title: 'Malignant Common Bile Duct Stricture — Biliary Stenting',
    indication: 'Painless jaundice and pancreatic head adenocarcinoma causing a tight distal CBD stricture (double duct sign). Bilirubin 18.2 mg/dL. Palliation with biliary endoprosthesis.',
    targetDepthCm: 70,
    forrestOrVarices: 'Malignant Distal Biliary Stricture',
    guidelineAction: 'Selective biliary cannulation across stricture, wire exchange, balloon dilation, and deployment of 10 Fr plastic or self-expanding metal stent (SEMS).',
    initialState: {
      presetId: 'MALIGNANT_BILIARY_OBSTRUCTION_STENTING',
      scopeInsertionDepthCm: 70,
      activeTool: 'BILIARY_STENT',
      ercpWireEngagement: 'NOT_ENGAGED',
      biliaryStentDeployed: false,
      rectalIndomethacinGiven: true,
      sbpMmHg: 116,
      hrBpm: 78,
      hemoglobinGdL: 11.5,
      bloodInStomachMl: 0,
    },
  },
};

export const GI_ENDOSCOPY_PRESETS = ENDOSCOPY_PRESETS;

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getEndoscopicZone(depthCm: number, cameraRetroflexion: boolean): EndoscopicZone {
  if (cameraRetroflexion && depthCm >= 45 && depthCm <= 60) return 'GASTRIC_FUNDUS';
  if (depthCm < 36) return 'ESOPHAGUS';
  if (depthCm <= 42) return 'GASTROESOPHAGEAL_JUNCTION';
  if (depthCm <= 50) return 'GASTRIC_BODY';
  if (depthCm <= 58) return 'GASTRIC_ANTRUM';
  if (depthCm <= 66) return 'DUODENAL_BULB_D1';
  return 'AMPULLA_OF_VATER_D2';
}

export function calculateRockall(age: number, sbp: number, hr: number, forrest: ForrestGrade | null): RockallScore {
  let ageScore = 0;
  if (age >= 80) ageScore = 2;
  else if (age >= 60) ageScore = 1;

  let shockScore = 0;
  if (sbp < 100) shockScore = 2;
  else if (hr >= 100) shockScore = 1;

  const comorbidityScore = 1; // standard baseline hospitalized patient
  const diagnosisScore = 1; // peptic ulcer disease

  let stigmataScore = 0;
  if (forrest === 'IA_SPURTING_HEMORRHAGE' || forrest === 'IB_OOZING_HEMORRHAGE' || forrest === 'IIA_NON_BLEEDING_VISIBLE_VESSEL') {
    stigmataScore = 2;
  } else if (forrest === 'IIB_ADHERENT_CLOT' || forrest === 'IIC_FLAT_PIGMENTED_SPOT') {
    stigmataScore = 1;
  }

  const totalScore = ageScore + shockScore + comorbidityScore + diagnosisScore + stigmataScore;
  return {
    ageScore,
    shockScore,
    comorbidityScore,
    diagnosisScore,
    stigmataScore,
    totalScore,
  };
}

// ─── Main Solver ──────────────────────────────────────────────────────────────

export function computeGIEndoscopyState(params: GIEndoscopyInputParams): GIEndoscopyState {
  const {
    presetId,
    scopeInsertionDepthCm,
    cameraRetroflexion,
    activeTool,
    epinephrineInjected,
    clipsDeployedCount,
    bandsDeployedCount,
    octreotideInfusionActive,
    ivPpiBolusGiven,
    ercpWireEngagement,
    sphincterotomyApplied,
    rectalIndomethacinGiven,
    prophylacticPancreaticStent,
    balloonTrawlDone,
    biliaryStentDeployed,
    patientAge,
    sbpMmHg,
    hrBpm,
    hemoglobinGdL,
    bloodInStomachMl,
  } = params;

  const currentZone = getEndoscopicZone(scopeInsertionDepthCm, cameraRetroflexion);

  let activePathology = 'Normal mucosal lining';
  let forrestGrade: ForrestGrade | null = null;
  let varicealGrade: VaricealGrade | null = null;
  let activeHemorrhage = false;
  let rebleedingRiskPct = 5;

  // Pathology profiles
  if (presetId === 'BLEEDING_DUODENAL_ULCER_FORREST_IA') {
    activePathology = 'Pulsatile arterial jet bleeding from post-bulbar ulcer base';
    forrestGrade = 'IA_SPURTING_HEMORRHAGE';
    rebleedingRiskPct = 90;
    activeHemorrhage = clipsDeployedCount === 0;
  } else if (presetId === 'ESOPHAGEAL_VARICEAL_HEMORRHAGE') {
    activePathology = 'Grade IV serpentine esophageal varices with active tear & spurt';
    varicealGrade = 'GRADE_IV';
    rebleedingRiskPct = 70;
    activeHemorrhage = bandsDeployedCount === 0;
  } else if (presetId === 'CHOLEDOCHOLITHIASIS_ERCP_SPHINCTEROTOMY') {
    activePathology = 'Ampulla of Vater with impacted choledocholithiasis (14 mm CBD dilation)';
    rebleedingRiskPct = 0;
  } else if (presetId === 'BARRETTS_ESOPHAGUS_SURVEILLANCE') {
    activePathology = 'Prague C3M5 salmon-pink columnar metaplasia above Z-line';
    rebleedingRiskPct = 0;
  } else if (presetId === 'GASTRIC_ANTRAL_ULCER_FORREST_IIA') {
    activePathology = '18 mm ulcer at incisura with 2.5 mm non-bleeding visible vessel';
    forrestGrade = 'IIA_NON_BLEEDING_VISIBLE_VESSEL';
    rebleedingRiskPct = 50;
    activeHemorrhage = false;
  } else if (presetId === 'MALIGNANT_BILIARY_OBSTRUCTION_STENTING') {
    activePathology = 'Severe distal common bile duct malignant stenosis';
    rebleedingRiskPct = 0;
  }

  // Hemostasis evaluation
  const dualTherapyAchieved = epinephrineInjected && (clipsDeployedCount >= 2 || activeTool === 'BIPOLAR_PROBE');
  let hemostasisAchieved = false;

  if (forrestGrade === 'IA_SPURTING_HEMORRHAGE') {
    if (clipsDeployedCount >= 2 || dualTherapyAchieved) {
      hemostasisAchieved = true;
      activeHemorrhage = false;
      rebleedingRiskPct = 12;
    }
  } else if (forrestGrade === 'IIA_NON_BLEEDING_VISIBLE_VESSEL') {
    if (clipsDeployedCount >= 1 || dualTherapyAchieved) {
      hemostasisAchieved = true;
      rebleedingRiskPct = 8;
    }
  } else if (varicealGrade) {
    if (bandsDeployedCount >= 3) {
      hemostasisAchieved = true;
      activeHemorrhage = false;
      rebleedingRiskPct = 15;
    }
  }

  // ERCP State
  const papillaCannulated = ercpWireEngagement !== 'NOT_ENGAGED';
  let pepRiskPct = 5;
  if (ercpWireEngagement === 'PANCREATIC_DUCT') {
    pepRiskPct = 22; // High risk of post-ERCP pancreatitis with repeated PD injection
  }
  if (rectalIndomethacinGiven) {
    pepRiskPct = Math.max(3, Math.round(pepRiskPct * 0.5)); // 50% risk reduction from NSAIDs
  }
  if (prophylacticPancreaticStent) {
    pepRiskPct = Math.max(2, Math.round(pepRiskPct * 0.4));
  }

  const stonesCleared = balloonTrawlDone && sphincterotomyApplied;

  const ercp: ERCPState = {
    papillaCannulated,
    wirePosition: ercpWireEngagement,
    contrastInjected: papillaCannulated,
    cholangiogramBileDuctDilationMm: presetId === 'CHOLEDOCHOLITHIASIS_ERCP_SPHINCTEROTOMY' ? 14 : 7,
    choledocholithiasisDetected: presetId === 'CHOLEDOCHOLITHIASIS_ERCP_SPHINCTEROTOMY' && !stonesCleared,
    stoneDiameterMm: presetId === 'CHOLEDOCHOLITHIASIS_ERCP_SPHINCTEROTOMY' ? 9 : 0,
    sphincterotomyCutPerformed: sphincterotomyApplied,
    balloonTrawlPerformed: balloonTrawlDone,
    stonesCleared,
    biliaryStentPlaced: biliaryStentDeployed,
    rectalIndomethacinGiven,
    pancreaticStentPlaced: prophylacticPancreaticStent,
    pepRiskPct,
  };

  // Clinical Risk Scores
  const rockall = calculateRockall(patientAge, sbpMmHg, hrBpm, forrestGrade);
  // Glasgow-Blatchford Score calculation approximation
  let gbsScore = 0;
  if (bloodInStomachMl > 300) gbsScore += 2;
  if (sbpMmHg < 100) gbsScore += 2;
  if (hrBpm >= 100) gbsScore += 1;
  if (hemoglobinGdL < 8.0) gbsScore += 6;
  else if (hemoglobinGdL < 10.0) gbsScore += 3;

  // Alarms
  const activeAlarms: GIEndoscopyAlarm[] = [];
  if (activeHemorrhage && forrestGrade === 'IA_SPURTING_HEMORRHAGE') {
    activeAlarms.push('ACTIVE_ARTERIAL_SPURTING');
  }
  if (activeHemorrhage && varicealGrade) {
    activeAlarms.push('VARICEAL_EXSANGUINATION');
  }
  if (forrestGrade === 'IA_SPURTING_HEMORRHAGE' && !hemostasisAchieved) {
    activeAlarms.push('HIGH_REBLEEDING_RISK_FORREST_I');
  }
  if (pepRiskPct >= 15) {
    activeAlarms.push('POST_ERCP_PANCREATITIS_RISK');
  }
  if (presetId === 'CHOLEDOCHOLITHIASIS_ERCP_SPHINCTEROTOMY' && !stonesCleared && !biliaryStentDeployed) {
    activeAlarms.push('BILIARY_OBSTRUCTION_CHOLANGITIS');
  }
  if (bloodInStomachMl > 500 && sbpMmHg < 95) {
    activeAlarms.push('ASPIRATION_RISK_GASTRIC_BLOOD');
  }
  if (activeAlarms.length === 0) {
    activeAlarms.push('OPTIMAL');
  }

  // Viewfinder overlay description
  const viewFinderOverlay = `${currentZone.replace(/_/g, ' ')} (${scopeInsertionDepthCm} cm) — ${activePathology}`;

  return {
    currentZone,
    activePathology,
    forrestGrade,
    varicealGrade,
    rebleedingRiskPct,
    activeHemorrhage,
    hemostasisAchieved,
    dualTherapyAchieved,
    ercp,
    rockall,
    gbsScore,
    activeAlarms,
    viewFinderOverlay,
  };
}
