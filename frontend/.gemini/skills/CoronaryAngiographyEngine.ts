/**
 * CoronaryAngiographyEngine.ts
 *
 * Biophysical & Interventional Cardiology Simulation Engine for Mediverse.
 * Implements C-arm fluoroscopy projection geometry (LAO/RAO Cranial/Caudal),
 * coronary artery anatomy (LMCA, LAD, LCx, RCA, diagonals, marginals, and dominance),
 * invasive left/right heart catheterization hemodynamics, the Gorlin equation for
 * Aortic Valve Area (AVA), Fick shunt fraction (Qp/Qs), Fractional Flow Reserve (FFR),
 * and TIMI 0-3 coronary flow dynamics.
 *
 * Location: frontend/.gemini/skills/CoronaryAngiographyEngine.ts
 */

export type FluoroscopyProjection =
  | 'LAO_CRANIAL_SPIDER' // LAO 45°, Cranial 30° (Left Main & bifurcation)
  | 'RAO_CAUDAL'         // RAO 30°, Caudal 25° (LCx & Obtuse Marginals)
  | 'RAO_CRANIAL'        // RAO 30°, Cranial 30° (LAD & Diagonals in profile)
  | 'LAO_CAUDAL'         // LAO 45°, Caudal 30° (Bifurcation variant)
  | 'AP_CRANIAL'         // AP 0°, Cranial 35° (Distal LAD & apical wrap)
  | 'LAO_STRAIGHT'       // LAO 35°, 0° (RCA C-shape profile)
  | 'RAO_STRAIGHT';      // RAO 30°, 0° (Mid RCA & PDA/PLB bifurcation)

export type CoronaryDominance = 'RIGHT_DOMINANT' | 'LEFT_DOMINANT' | 'CO_DOMINANT';

export type TIMIFlowGrade = 0 | 1 | 2 | 3;

export type VesselId =
  | 'LMCA'
  | 'LAD_PROXIMAL'
  | 'LAD_MID'
  | 'LAD_DISTAL'
  | 'D1'
  | 'D2'
  | 'LCX_PROXIMAL'
  | 'LCX_MID'
  | 'OM1'
  | 'OM2'
  | 'RCA_PROXIMAL'
  | 'RCA_MID'
  | 'RCA_DISTAL'
  | 'PDA'
  | 'PLB';

export interface VesselLesion {
  vessel: VesselId;
  label: string;
  stenosisPercent: number; // 0 - 100%
  calcification: 'NONE' | 'MILD' | 'MODERATE' | 'SEVERE';
  timiFlow: TIMIFlowGrade;
  ffr: number; // 0.0 - 1.0 (≤0.80 = ischemic)
  ifr: number; // 0.0 - 1.0 (≤0.89 = ischemic)
}

export interface InvasiveHemodynamics {
  aorticSystolicMmHg: number;
  aorticDiastolicMmHg: number;
  aorticMeanMmHg: number;
  lvSystolicMmHg: number;
  lvedpMmHg: number; // Normal 4-12 mmHg
  peakToPeakGradientMmHg: number; // LV Sys - Ao Sys
  meanGradientMmHg: number;
  cardiacOutputLMin: number;
  heartRateBpm: number;
  systolicEjectionPeriodSec: number; // Normal 0.28 - 0.35 s
  gorlinAVAcm2: number; // Aortic Valve Area
  shuntQpQs: number; // Qp/Qs (Normal 1.0, >1.5 = hemodynamically significant)
}

export type AngiographyPresetId =
  | 'normal-coronary-right-dominant'
  | 'critical-lad-stemi-timi-0'
  | 'bifurcation-medina-1-1-1'
  | 'severe-calcific-aortic-stenosis'
  | 'three-vessel-cad-syntax'
  | 'intracardiac-asd-shunt';

export interface AngiographyPresetInfo {
  id: AngiographyPresetId;
  title: string;
  category: 'Coronary CAD' | 'Structural / Valvular' | 'Congenital Shunt' | 'Normal';
  description: string;
  pathophysiology: string;
  dominance: CoronaryDominance;
  recommendedView: FluoroscopyProjection;
  lesions: VesselLesion[];
  hemodynamics: InvasiveHemodynamics;
  revascularizationStrategy: string;
  keyLearningPoints: string[];
}

// ============================================================================
// 1. PROJECTION METADATA & GEOMETRY
// ============================================================================

export interface ProjectionDetails {
  id: FluoroscopyProjection;
  name: string;
  laoRaoAngleDeg: number; // Positive = LAO, Negative = RAO
  cranialCaudalAngleDeg: number; // Positive = Cranial, Negative = Caudal
  primaryVesselsShown: string[];
  clinicalIndication: string;
}

export const PROJECTIONS: Record<FluoroscopyProjection, ProjectionDetails> = {
  LAO_CRANIAL_SPIDER: {
    id: 'LAO_CRANIAL_SPIDER',
    name: 'LAO Cranial ("Spider View")',
    laoRaoAngleDeg: 45,
    cranialCaudalAngleDeg: 30,
    primaryVesselsShown: ['Left Main (LMCA)', 'Proximal LAD', 'Proximal LCx bifurcation'],
    clinicalIndication: 'Gold standard projection to uncoil the Left Main bifurcation and assess ostial LAD and LCx stenosis without overlap.'
  },
  RAO_CAUDAL: {
    id: 'RAO_CAUDAL',
    name: 'RAO Caudal',
    laoRaoAngleDeg: -30,
    cranialCaudalAngleDeg: -25,
    primaryVesselsShown: ['Main LCx body', 'Obtuse Marginal 1 (OM1)', 'Obtuse Marginal 2 (OM2)'],
    clinicalIndication: 'Optimal visualization of the entire Circumflex course and origins of obtuse marginal branches.'
  },
  RAO_CRANIAL: {
    id: 'RAO_CRANIAL',
    name: 'RAO Cranial',
    laoRaoAngleDeg: -30,
    cranialCaudalAngleDeg: 30,
    primaryVesselsShown: ['Mid LAD', 'Distal LAD', 'Diagonal 1 (D1)', 'Diagonal 2 (D2)'],
    clinicalIndication: 'Lays out the LAD in its true anatomic long axis; essential for sizing stents in mid/distal LAD.'
  },
  LAO_CAUDAL: {
    id: 'LAO_CAUDAL',
    name: 'LAO Caudal',
    laoRaoAngleDeg: 45,
    cranialCaudalAngleDeg: -30,
    primaryVesselsShown: ['LMCA', 'Proximal LCx bifurcation', 'Proximal LAD'],
    clinicalIndication: 'Alternative bifurcation view helpful in patients with a horizontally oriented heart.'
  },
  AP_CRANIAL: {
    id: 'AP_CRANIAL',
    name: 'AP Cranial',
    laoRaoAngleDeg: 0,
    cranialCaudalAngleDeg: 35,
    primaryVesselsShown: ['Mid/Distal LAD', 'Septal perforators', 'Apical wrap'],
    clinicalIndication: 'Displays distal LAD reaching and wrapping around the anatomical cardiac apex.'
  },
  LAO_STRAIGHT: {
    id: 'LAO_STRAIGHT',
    name: 'LAO Straight ("C-Shape View")',
    laoRaoAngleDeg: 35,
    cranialCaudalAngleDeg: 0,
    primaryVesselsShown: ['Ostial RCA', 'Proximal RCA', 'Mid RCA', 'Distal RCA'],
    clinicalIndication: 'Displays the classic "C-shape" sweep of the Right Coronary Artery from ostium to crux cordis.'
  },
  RAO_STRAIGHT: {
    id: 'RAO_STRAIGHT',
    name: 'RAO Straight ("L-Shape View")',
    laoRaoAngleDeg: -30,
    cranialCaudalAngleDeg: 0,
    primaryVesselsShown: ['Mid RCA', 'RCA Crux', 'Posterior Descending Artery (PDA)', 'Posterolateral Branch (PLB)'],
    clinicalIndication: 'Projects the distal bifurcation of the RCA into PDA and PLB in profile for bifurcation stenting.'
  }
};

// ============================================================================
// 2. CLINICAL PRESETS CATALOG
// ============================================================================

export const ANGIOGRAPHY_PRESETS: Record<AngiographyPresetId, AngiographyPresetInfo> = {
  'normal-coronary-right-dominant': {
    id: 'normal-coronary-right-dominant',
    title: 'Normal Coronary Angiogram (Right-Dominant)',
    category: 'Normal',
    description: 'Pristine, smooth-caliber coronary tree without angiographic luminal stenosis. Right-dominant anatomy with normal left ventricular filling pressures and brisk TIMI 3 flow throughout.',
    pathophysiology: 'Normal healthy vascular endothelium without atherosclerotic intimal plaque or lipid-rich necrotic cores.',
    dominance: 'RIGHT_DOMINANT',
    recommendedView: 'LAO_CRANIAL_SPIDER',
    lesions: [
      { vessel: 'LMCA', label: 'Left Main (LMCA)', stenosisPercent: 0, calcification: 'NONE', timiFlow: 3, ffr: 0.98, ifr: 0.97 },
      { vessel: 'LAD_PROXIMAL', label: 'Proximal LAD', stenosisPercent: 0, calcification: 'NONE', timiFlow: 3, ffr: 0.97, ifr: 0.96 },
      { vessel: 'LCX_PROXIMAL', label: 'Proximal LCx', stenosisPercent: 0, calcification: 'NONE', timiFlow: 3, ffr: 0.98, ifr: 0.96 },
      { vessel: 'RCA_MID', label: 'Mid RCA', stenosisPercent: 0, calcification: 'NONE', timiFlow: 3, ffr: 0.99, ifr: 0.98 }
    ],
    hemodynamics: {
      aorticSystolicMmHg: 124,
      aorticDiastolicMmHg: 78,
      aorticMeanMmHg: 93,
      lvSystolicMmHg: 124,
      lvedpMmHg: 8,
      peakToPeakGradientMmHg: 0,
      meanGradientMmHg: 1.2,
      cardiacOutputLMin: 5.2,
      heartRateBpm: 72,
      systolicEjectionPeriodSec: 0.31,
      gorlinAVAcm2: 3.2,
      shuntQpQs: 1.0
    },
    revascularizationStrategy: 'No revascularization indicated. Continue guideline-directed lifestyle modification.',
    keyLearningPoints: [
      'Normal LVEDP is 4 - 12 mmHg; higher values indicate diastolic dysfunction or volume overload.',
      'Right dominance (85% of population) is defined by the RCA giving rise to the PDA and supplying the AV node.',
      'Normal TIMI 3 flow indicates prompt opacification and rapid clearance of radiopaque dye within 3 cardiac cycles.'
    ]
  },

  'critical-lad-stemi-timi-0': {
    id: 'critical-lad-stemi-timi-0',
    title: 'Acute Anterior STEMI (Proximal LAD 99% Occlusion, TIMI 0)',
    category: 'Coronary CAD',
    description: 'Catastrophic rupture of an unstable fibroatheroma in the proximal LAD with occlusive red thrombus resulting in total cessation of antegrade perfusion (TIMI 0). Massive anterior wall ischemia and elevated LVEDP (24 mmHg).',
    pathophysiology: 'Plaque rupture triggers platelet aggregation, tissue factor exposure, and acute thrombin generation, leading to total coronary occlusion and impending transmural myocardial infarction.',
    dominance: 'RIGHT_DOMINANT',
    recommendedView: 'RAO_CRANIAL',
    lesions: [
      { vessel: 'LMCA', label: 'Left Main (LMCA)', stenosisPercent: 10, calcification: 'NONE', timiFlow: 3, ffr: 0.94, ifr: 0.92 },
      { vessel: 'LAD_PROXIMAL', label: 'Proximal LAD (Culprit)', stenosisPercent: 99, calcification: 'MILD', timiFlow: 0, ffr: 0.32, ifr: 0.28 },
      { vessel: 'LCX_PROXIMAL', label: 'Proximal LCx', stenosisPercent: 20, calcification: 'NONE', timiFlow: 3, ffr: 0.91, ifr: 0.90 },
      { vessel: 'RCA_MID', label: 'Mid RCA', stenosisPercent: 30, calcification: 'MILD', timiFlow: 3, ffr: 0.88, ifr: 0.87 }
    ],
    hemodynamics: {
      aorticSystolicMmHg: 98,
      aorticDiastolicMmHg: 62,
      aorticMeanMmHg: 74,
      lvSystolicMmHg: 98,
      lvedpMmHg: 24,
      peakToPeakGradientMmHg: 0,
      meanGradientMmHg: 1.5,
      cardiacOutputLMin: 3.6,
      heartRateBpm: 94,
      systolicEjectionPeriodSec: 0.27,
      gorlinAVAcm2: 2.8,
      shuntQpQs: 1.0
    },
    revascularizationStrategy: 'Emergent Primary PCI with aspiration thrombectomy, IV Heparin (target ACT 250-300s) + Ticagrelor/Prasugrel, and Drug-Eluting Stent (DES) deployment.',
    keyLearningPoints: [
      'Door-to-balloon time benchmark is <90 minutes for primary percutaneous coronary intervention.',
      'TIMI 0 flow requires immediate crossing with an 0.014" coronary guidewire to restore reperfusion.',
      'Elevated LVEDP (24 mmHg) reflects acute loss of anterior left ventricular compliance and pulmonary venous hypertension.'
    ]
  },

  'bifurcation-medina-1-1-1': {
    id: 'bifurcation-medina-1-1-1',
    title: 'True Bifurcation Lesion (LAD / D1, Medina 1,1,1)',
    category: 'Coronary CAD',
    description: 'Complex true bifurcation stenosis involving the proximal main branch (LAD), distal main branch (LAD), and the ostium of the side branch (Diagonal 1). FFR confirms functional ischemia in both branches.',
    pathophysiology: 'Low endothelial shear stress and turbulent flow at the carina of the arterial bifurcation promote eccentric, lipid-rich atheromatous plaque accumulation.',
    dominance: 'RIGHT_DOMINANT',
    recommendedView: 'LAO_CRANIAL_SPIDER',
    lesions: [
      { vessel: 'LAD_PROXIMAL', label: 'Proximal LAD Main Branch', stenosisPercent: 85, calcification: 'MODERATE', timiFlow: 3, ffr: 0.72, ifr: 0.78 },
      { vessel: 'LAD_MID', label: 'Distal Main Branch (LAD)', stenosisPercent: 80, calcification: 'MILD', timiFlow: 3, ffr: 0.74, ifr: 0.80 },
      { vessel: 'D1', label: 'Side Branch Ostium (D1)', stenosisPercent: 85, calcification: 'MILD', timiFlow: 3, ffr: 0.76, ifr: 0.81 },
      { vessel: 'LCX_MID', label: 'Mid LCx', stenosisPercent: 15, calcification: 'NONE', timiFlow: 3, ffr: 0.92, ifr: 0.91 }
    ],
    hemodynamics: {
      aorticSystolicMmHg: 132,
      aorticDiastolicMmHg: 82,
      aorticMeanMmHg: 98,
      lvSystolicMmHg: 132,
      lvedpMmHg: 14,
      peakToPeakGradientMmHg: 0,
      meanGradientMmHg: 1.8,
      cardiacOutputLMin: 4.8,
      heartRateBpm: 68,
      systolicEjectionPeriodSec: 0.32,
      gorlinAVAcm2: 3.0,
      shuntQpQs: 1.0
    },
    revascularizationStrategy: 'Provisional Stenting Strategy (single DES across main branch with POT [Proximal Optimization Technique] and rescue kissing balloon inflation / TAP if D1 compromised).',
    keyLearningPoints: [
      'Medina classification: (Proximal Main, Distal Main, Side Branch) — 1,1,1 indicates >50% stenosis in all 3 segments.',
      'Provisional single-stent technique is superior to upfront two-stent strategies in most bifurcation anatomies.',
      'POT (Proximal Optimization Technique) restores natural fractal vascular geometry (Murray law).'
    ]
  },

  'severe-calcific-aortic-stenosis': {
    id: 'severe-calcific-aortic-stenosis',
    title: 'Severe Calcific Aortic Valve Stenosis with Low AVA',
    category: 'Structural / Valvular',
    description: 'Monitored via simultaneous Ao and LV pressure catheterization. Massive peak-to-peak transvalvular gradient (64 mmHg) and Gorlin Aortic Valve Area of 0.68 cm² (<1.0 cm² severe cutoff) with marked LVEDP elevation (26 mmHg).',
    pathophysiology: 'Active fibro-calcific remodeling of the aortic valve leaflets leads to severe mechanical orifice restriction, concentric LV hypertrophy, and reduced diastolic compliance.',
    dominance: 'RIGHT_DOMINANT',
    recommendedView: 'RAO_STRAIGHT',
    lesions: [
      { vessel: 'LMCA', label: 'LMCA', stenosisPercent: 0, calcification: 'MILD', timiFlow: 3, ffr: 0.94, ifr: 0.93 },
      { vessel: 'LAD_PROXIMAL', label: 'Proximal LAD', stenosisPercent: 30, calcification: 'MODERATE', timiFlow: 3, ffr: 0.88, ifr: 0.87 },
      { vessel: 'RCA_MID', label: 'Mid RCA', stenosisPercent: 20, calcification: 'MILD', timiFlow: 3, ffr: 0.92, ifr: 0.90 }
    ],
    hemodynamics: {
      aorticSystolicMmHg: 116,
      aorticDiastolicMmHg: 72,
      aorticMeanMmHg: 86,
      lvSystolicMmHg: 180,
      lvedpMmHg: 26,
      peakToPeakGradientMmHg: 64, // 180 - 116 = 64 mmHg
      meanGradientMmHg: 48,
      cardiacOutputLMin: 4.2,
      heartRateBpm: 75,
      systolicEjectionPeriodSec: 0.34,
      gorlinAVAcm2: 0.68, // Severe AS (<1.0 cm²)
      shuntQpQs: 1.0
    },
    revascularizationStrategy: 'Transcatheter Aortic Valve Replacement (TAVR) or Surgical Aortic Valve Replacement (SAVR) based on Heart Team STS risk score.',
    keyLearningPoints: [
      'Gorlin formula: AVA = CO / (44.3 × HR × SEP × √ΔPmean). AVA <1.0 cm² (or indexed <0.6 cm²/m²) defines severe AS.',
      'Peak-to-peak gradient measured in the cath lab is not identical to echocardiographic peak instantaneous gradient.',
      'High LVEDP (26 mmHg) reflects severe concentric left ventricular hypertrophy and high filling resistance.'
    ]
  },

  'three-vessel-cad-syntax': {
    id: 'three-vessel-cad-syntax',
    title: 'High-Complexity Three-Vessel CAD (SYNTAX Score >32)',
    category: 'Coronary CAD',
    description: 'Extensive multi-vessel disease: proximal LAD 85% with heavy calcification, mid LCx 90%, and mid RCA 95% near-CTO. Calculated SYNTAX score of 36 favors surgical revascularization (CABG) over PCI.',
    pathophysiology: 'Diffuse multi-focal systemic atheroma formation driven by diabetes, hypertension, and dyslipidemia, resulting in extensive coronary microvascular and epicardial burden.',
    dominance: 'RIGHT_DOMINANT',
    recommendedView: 'RAO_CRANIAL',
    lesions: [
      { vessel: 'LAD_PROXIMAL', label: 'Proximal LAD', stenosisPercent: 85, calcification: 'SEVERE', timiFlow: 3, ffr: 0.68, ifr: 0.74 },
      { vessel: 'LCX_MID', label: 'Mid LCx', stenosisPercent: 90, calcification: 'MODERATE', timiFlow: 2, ffr: 0.65, ifr: 0.71 },
      { vessel: 'RCA_MID', label: 'Mid RCA (Near-CTO)', stenosisPercent: 95, calcification: 'SEVERE', timiFlow: 2, ffr: 0.58, ifr: 0.62 }
    ],
    hemodynamics: {
      aorticSystolicMmHg: 138,
      aorticDiastolicMmHg: 84,
      aorticMeanMmHg: 102,
      lvSystolicMmHg: 138,
      lvedpMmHg: 18,
      peakToPeakGradientMmHg: 0,
      meanGradientMmHg: 2.0,
      cardiacOutputLMin: 4.6,
      heartRateBpm: 76,
      systolicEjectionPeriodSec: 0.30,
      gorlinAVAcm2: 2.9,
      shuntQpQs: 1.0
    },
    revascularizationStrategy: 'Coronary Artery Bypass Grafting (CABG): LIMA-to-LAD with saphenous vein grafts (SVG) to OM1 and PDA.',
    keyLearningPoints: [
      'SYNTAX score >32 in 3-vessel CAD provides Class I guideline indication for CABG over PCI (lower MACCE and repeat revascularization).',
      'LIMA-to-LAD anastomosis provides >90% 10-year patency, the gold standard for survival in surgical revascularization.',
      'TIMI 2 flow reflects delayed distal dye clearance secondary to severe downstream microvascular resistance and critical stenosis.'
    ]
  },

  'intracardiac-asd-shunt': {
    id: 'intracardiac-asd-shunt',
    title: 'Secundum Atrial Septal Defect (ASD) with Qp/Qs = 2.4',
    category: 'Congenital Shunt',
    description: 'Diagnosed via right heart oximetry run. Demonstrates significant oxygen saturation step-up from SVC/IVC (65%) to Right Atrium (84%). Shunt fraction calculation reveals a large left-to-right shunt (Qp/Qs = 2.4).',
    pathophysiology: 'Ostium secundum defect creates a left-to-right interatrial communication driven by higher left atrial compliance and pressures, causing right heart volume overload.',
    dominance: 'RIGHT_DOMINANT',
    recommendedView: 'AP_CRANIAL',
    lesions: [
      { vessel: 'LMCA', label: 'LMCA', stenosisPercent: 0, calcification: 'NONE', timiFlow: 3, ffr: 0.98, ifr: 0.98 },
      { vessel: 'LAD_PROXIMAL', label: 'Proximal LAD', stenosisPercent: 0, calcification: 'NONE', timiFlow: 3, ffr: 0.97, ifr: 0.96 },
      { vessel: 'RCA_MID', label: 'Mid RCA', stenosisPercent: 0, calcification: 'NONE', timiFlow: 3, ffr: 0.99, ifr: 0.98 }
    ],
    hemodynamics: {
      aorticSystolicMmHg: 118,
      aorticDiastolicMmHg: 70,
      aorticMeanMmHg: 86,
      lvSystolicMmHg: 118,
      lvedpMmHg: 10,
      peakToPeakGradientMmHg: 0,
      meanGradientMmHg: 1.0,
      cardiacOutputLMin: 8.8, // Hyperdynamic pulmonary cardiac output
      heartRateBpm: 80,
      systolicEjectionPeriodSec: 0.29,
      gorlinAVAcm2: 3.4,
      shuntQpQs: 2.4 // Significant left-to-right shunt (>1.5)
    },
    revascularizationStrategy: 'Percutaneous Transcatheter ASD Closure with Amplatzer Septal Occluder under intracardiac echocardiography (ICE) guidance.',
    keyLearningPoints: [
      'A saturation step-up of ≥7% from mixed venous to right atrium is diagnostic for an interatrial shunt (ASD).',
      'Qp/Qs > 1.5 indicates a hemodynamically significant shunt with risk of pulmonary vascular remodeling if uncorrected.',
      'Percutaneous closure requires an adequate defect rim (≥5 mm) from surrounding cardiac structures.'
    ]
  }
};

// ============================================================================
// 3. MATHEMATICAL SOLVERS & BIOPHYSICAL MODELS
// ============================================================================

/**
 * Gorlin Equation for Aortic Valve Area (AVA)
 * AVA (cm²) = CO (mL/min) / (44.3 * HR * SEP * sqrt(meanGradient))
 */
export function computeGorlinAVA(
  cardiacOutputLMin: number,
  heartRateBpm: number,
  systolicEjectionPeriodSec: number,
  meanGradientMmHg: number
): { avaCm2: number; severity: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE' } {
  if (meanGradientMmHg <= 0 || heartRateBpm <= 0 || systolicEjectionPeriodSec <= 0) {
    return { avaCm2: 3.5, severity: 'NORMAL' };
  }

  const coMlMin = cardiacOutputLMin * 1000;
  const denominator = 44.3 * heartRateBpm * systolicEjectionPeriodSec * Math.sqrt(meanGradientMmHg);
  const ava = Number((coMlMin / denominator).toFixed(2));

  let severity: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE' = 'NORMAL';
  if (ava < 1.0) severity = 'SEVERE';
  else if (ava < 1.5) severity = 'MODERATE';
  else if (ava < 2.0) severity = 'MILD';

  return { avaCm2: ava, severity };
}

/**
 * Fick Principle Intracardiac Shunt Fraction (Qp/Qs)
 * Qp/Qs = (SaO2 - SvO2) / (SpvO2 - SpaO2)
 */
export function computeShuntFraction(
  sao2Pct: number,
  svo2Pct: number,
  spvo2Pct: number = 98,
  spao2Pct: number
): { qpqs: number; isSignificant: boolean; direction: 'LEFT_TO_RIGHT' | 'RIGHT_TO_LEFT' | 'NONE' } {
  const systemicDiff = (sao2Pct - svo2Pct) / 100;
  const pulmonaryDiff = (spvo2Pct - spao2Pct) / 100;

  if (pulmonaryDiff <= 0.01) {
    return { qpqs: 1.0, isSignificant: false, direction: 'NONE' };
  }

  const qpqs = Number((systemicDiff / pulmonaryDiff).toFixed(2));
  const isSignificant = qpqs > 1.5 || qpqs < 0.8;
  const direction = qpqs > 1.05 ? 'LEFT_TO_RIGHT' : qpqs < 0.95 ? 'RIGHT_TO_LEFT' : 'NONE';

  return { qpqs, isSignificant, direction };
}

/**
 * Fractional Flow Reserve (FFR) evaluation
 * FFR = Pd / Pa during maximal adenosine hyperemia
 * Cutoff: FFR ≤ 0.80 indicates physiologically significant ischemia
 */
export function evaluateFFR(
  distalPressurePdMmHg: number,
  aorticPressurePaMmHg: number
): { ffr: number; isIschemic: boolean; interpretation: string } {
  if (aorticPressurePaMmHg <= 0) return { ffr: 1.0, isIschemic: false, interpretation: 'Invalid pressure' };

  const ffr = Number((distalPressurePdMmHg / aorticPressurePaMmHg).toFixed(2));
  const isIschemic = ffr <= 0.80;

  let interpretation = 'Non-ischemic: Medical management favored.';
  if (ffr <= 0.75) {
    interpretation = 'Severe ischemia: Revascularization strongly indicated.';
  } else if (ffr <= 0.80) {
    interpretation = 'Significant ischemia (gray zone cutoff): Revascularization indicated.';
  }

  return { ffr, isIschemic, interpretation };
}

/**
 * Simultaneous Aortic and Left Ventricular Pressure Waveform Synthesis
 * Generates Ao and LV pressures at instantaneous cardiac cycle time t
 */
export function synthesizeHemodynamicWaveform(
  tSec: number,
  preset: AngiographyPresetId
): { aoPressure: number; lvPressure: number; isSystole: boolean } {
  const info = ANGIOGRAPHY_PRESETS[preset];
  const hr = info.hemodynamics.heartRateBpm;
  const cycleDuration = 60.0 / hr;
  const phase = (tSec % cycleDuration) / cycleDuration; // 0 to 1

  const sepFraction = info.hemodynamics.systolicEjectionPeriodSec / cycleDuration;
  const isSystole = phase < sepFraction;

  let lvPressure = 0;
  let aoPressure = 0;

  const lvPeak = info.hemodynamics.lvSystolicMmHg;
  const lvedp = info.hemodynamics.lvedpMmHg;
  const aoSys = info.hemodynamics.aorticSystolicMmHg;
  const aoDia = info.hemodynamics.aorticDiastolicMmHg;

  if (isSystole) {
    // Systolic ejection dome
    const sysPhase = phase / sepFraction; // 0 to 1
    const dome = Math.sin(sysPhase * Math.PI);
    lvPressure = lvedp + (lvPeak - lvedp) * dome;

    // During systolic ejection, aortic valve is open: Ao pressure tracks LV minus transvalvular gradient
    const gradient = info.hemodynamics.peakToPeakGradientMmHg * dome;
    aoPressure = Math.max(aoDia, lvPressure - gradient);
  } else {
    // Diastolic filling
    const diaPhase = (phase - sepFraction) / (1.0 - sepFraction); // 0 to 1
    // LV drops rapidly to early diastole (2-4 mmHg) then rises to LVEDP
    if (diaPhase < 0.3) {
      lvPressure = 4.0;
    } else {
      lvPressure = 4.0 + (lvedp - 4.0) * ((diaPhase - 0.3) / 0.7);
    }

    // Aortic diastolic decay (Windkessel exponential runoff)
    aoPressure = aoSys - (aoSys - aoDia) * Math.min(1.0, diaPhase * 1.1);
  }

  return {
    aoPressure: Number(aoPressure.toFixed(1)),
    lvPressure: Number(lvPressure.toFixed(1)),
    isSystole
  };
}
