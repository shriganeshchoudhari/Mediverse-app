/**
 * CephalometricPresets.ts — Cephalometric Analysis Standards Registry
 *
 * Clinical normal ranges for Steiner, Tweed, and Ricketts analyses.
 * Used by CephalometricAnalyzer.tsx for real-time cephalometric assessment.
 */

export type AnalysisType = 'steiner' | 'tweed' | 'ricketts' | 'downs';

export interface CephalometricLandmark {
  id: string;          // e.g. 'S', 'N', 'A', 'B'
  name: string;        // e.g. 'Sella', 'Nasion'
  description: string; // Anatomic definition
  svgDefaultX: number; // Default SVG x position for template
  svgDefaultY: number; // Default SVG y position for template
}

export interface CephalometricMeasurement {
  id: string;              // e.g. 'SNA', 'ANB', 'SN_GoGn'
  label: string;           // e.g. 'SNA°'
  analysis: AnalysisType;
  type: 'angle' | 'distance' | 'ratio';
  unit: '°' | 'mm' | '%';
  meanMale: number;
  meanFemale: number;
  sdPlus: number;
  sdMinus: number;
  landmarks: string[];     // landmark IDs used to calculate this
  formula: string;         // e.g. 'SNA = angle(S-N-A)'
  clinicalInterpretation: {
    normal: string;
    increased: string;
    decreased: string;
  };
  orthodonticImplication: string;
}

export const CEPHALOMETRIC_LANDMARKS: CephalometricLandmark[] = [
  { id: 'S', name: 'Sella', description: 'Center of sella turcica', svgDefaultX: 280, svgDefaultY: 120 },
  { id: 'N', name: 'Nasion', description: 'Most anterior point of frontonasal suture', svgDefaultX: 230, svgDefaultY: 115 },
  { id: 'A', name: 'Point A (Subspinale)', description: 'Deepest point on maxilla between ANS and incisor alveolus', svgDefaultX: 300, svgDefaultY: 195 },
  { id: 'B', name: 'Point B (Supramentale)', description: 'Deepest point on mandibular symphysis', svgDefaultX: 295, svgDefaultY: 270 },
  { id: 'Pg', name: 'Pogonion', description: 'Most anterior point of the bony chin', svgDefaultX: 290, svgDefaultY: 305 },
  { id: 'Gn', name: 'Gnathion', description: 'Most anteroinferior point on the symphysis', svgDefaultX: 285, svgDefaultY: 320 },
  { id: 'Me', name: 'Menton', description: 'Most inferior point of the mandibular symphysis', svgDefaultX: 280, svgDefaultY: 335 },
  { id: 'Go', name: 'Gonion', description: 'Midpoint at the angle of the mandible', svgDefaultX: 210, svgDefaultY: 290 },
  { id: 'Ar', name: 'Articulare', description: 'Intersection of the posterior border of the ramus and the inferior border of the basicranium', svgDefaultX: 180, svgDefaultY: 180 },
  { id: 'Po', name: 'Porion', description: 'Most superior point of the external auditory meatus', svgDefaultX: 175, svgDefaultY: 140 },
  { id: 'Or', name: 'Orbitale', description: 'Lowest point on the inferior margin of the orbit', svgDefaultX: 260, svgDefaultY: 130 },
  { id: 'U1_tip', name: 'U1 Tip', description: 'Incisal edge of the maxillary central incisor', svgDefaultX: 310, svgDefaultY: 240 },
  { id: 'L1_tip', name: 'L1 Tip', description: 'Incisal edge of the mandibular central incisor', svgDefaultX: 305, svgDefaultY: 250 },
  { id: 'ANS', name: 'ANS', description: 'Anterior Nasal Spine', svgDefaultX: 315, svgDefaultY: 185 },
  { id: 'PNS', name: 'PNS', description: 'Posterior Nasal Spine', svgDefaultX: 200, svgDefaultY: 180 }
];

export const CEPHALOMETRIC_MEASUREMENTS: CephalometricMeasurement[] = [
  // STEINER ANALYSIS
  {
    id: 'SNA', label: 'SNA°', analysis: 'steiner', type: 'angle', unit: '°',
    meanMale: 82, meanFemale: 82, sdPlus: 2, sdMinus: 2,
    landmarks: ['S', 'N', 'A'], formula: 'angle(S-N-A)',
    clinicalInterpretation: { normal: 'Normal maxilla to cranial base', increased: 'Maxillary prognathism', decreased: 'Maxillary retrognathism' },
    orthodonticImplication: 'Assess need for maxillary restriction or advancement.'
  },
  {
    id: 'SNB', label: 'SNB°', analysis: 'steiner', type: 'angle', unit: '°',
    meanMale: 80, meanFemale: 80, sdPlus: 2, sdMinus: 2,
    landmarks: ['S', 'N', 'B'], formula: 'angle(S-N-B)',
    clinicalInterpretation: { normal: 'Normal mandible to cranial base', increased: 'Mandibular prognathism', decreased: 'Mandibular retrognathism' },
    orthodonticImplication: 'Assess need for mandibular growth modification.'
  },
  {
    id: 'ANB', label: 'ANB°', analysis: 'steiner', type: 'angle', unit: '°',
    meanMale: 2, meanFemale: 2, sdPlus: 2, sdMinus: 2,
    landmarks: ['A', 'N', 'B'], formula: 'SNA - SNB',
    clinicalInterpretation: { normal: 'Skeletal Class I', increased: 'Skeletal Class II', decreased: 'Skeletal Class III' },
    orthodonticImplication: 'Defines the anteroposterior skeletal discrepancy.'
  },
  {
    id: 'SN_GoGn', label: 'SN-GoGn°', analysis: 'steiner', type: 'angle', unit: '°',
    meanMale: 32, meanFemale: 32, sdPlus: 5, sdMinus: 5,
    landmarks: ['S', 'N', 'Go', 'Gn'], formula: 'angle between SN line and GoGn line',
    clinicalInterpretation: { normal: 'Normal facial divergence', increased: 'Hyperdivergent / Vertical growth pattern', decreased: 'Hypodivergent / Horizontal growth pattern' },
    orthodonticImplication: 'Directs extraction vs non-extraction and mechanics for vertical control.'
  },
  {
    id: 'U1_NA_angle', label: 'U1-NA°', analysis: 'steiner', type: 'angle', unit: '°',
    meanMale: 22, meanFemale: 22, sdPlus: 4, sdMinus: 4,
    landmarks: ['U1_tip', 'N', 'A'], formula: 'angle between U1 axis and N-A line',
    clinicalInterpretation: { normal: 'Normal upper incisor inclination', increased: 'Proclined upper incisors', decreased: 'Retroclined upper incisors' },
    orthodonticImplication: 'Determines space needed for retraction.'
  },
  {
    id: 'U1_NA_dist', label: 'U1-NA (mm)', analysis: 'steiner', type: 'distance', unit: 'mm',
    meanMale: 4, meanFemale: 4, sdPlus: 2, sdMinus: 2,
    landmarks: ['U1_tip', 'N', 'A'], formula: 'distance from U1 tip to N-A line',
    clinicalInterpretation: { normal: 'Normal upper incisor position', increased: 'Protrusive upper incisors', decreased: 'Retrusive upper incisors' },
    orthodonticImplication: 'Soft tissue support indicator.'
  },
  {
    id: 'L1_NB_angle', label: 'L1-NB°', analysis: 'steiner', type: 'angle', unit: '°',
    meanMale: 25, meanFemale: 25, sdPlus: 5, sdMinus: 5,
    landmarks: ['L1_tip', 'N', 'B'], formula: 'angle between L1 axis and N-B line',
    clinicalInterpretation: { normal: 'Normal lower incisor inclination', increased: 'Proclined lower incisors', decreased: 'Retroclined lower incisors' },
    orthodonticImplication: 'Impacts arch length analysis and stability.'
  },
  {
    id: 'L1_NB_dist', label: 'L1-NB (mm)', analysis: 'steiner', type: 'distance', unit: 'mm',
    meanMale: 4, meanFemale: 4, sdPlus: 2, sdMinus: 2,
    landmarks: ['L1_tip', 'N', 'B'], formula: 'distance from L1 tip to N-B line',
    clinicalInterpretation: { normal: 'Normal lower incisor position', increased: 'Protrusive lower incisors', decreased: 'Retrusive lower incisors' },
    orthodonticImplication: 'Determines lower arch expansion limit.'
  },
  {
    id: 'Pog_NB_dist', label: 'Pog-NB (mm)', analysis: 'steiner', type: 'distance', unit: 'mm',
    meanMale: 1, meanFemale: 1, sdPlus: 2, sdMinus: 2,
    landmarks: ['Pg', 'N', 'B'], formula: 'distance from Pg to N-B line',
    clinicalInterpretation: { normal: 'Normal chin prominence', increased: 'Prominent chin', decreased: 'Weak chin' },
    orthodonticImplication: 'Aesthetic evaluation for genioplasty.'
  },

  // TWEED ANALYSIS
  {
    id: 'FMIA', label: 'FMIA°', analysis: 'tweed', type: 'angle', unit: '°',
    meanMale: 68, meanFemale: 68, sdPlus: 4, sdMinus: 4,
    landmarks: ['Po', 'Or', 'L1_tip', 'Me'], formula: 'angle between Frankfort horizontal and L1 axis',
    clinicalInterpretation: { normal: 'Normal face', increased: 'Retroclined lower incisors', decreased: 'Proclined lower incisors' },
    orthodonticImplication: 'Goal in Tweed philosophy is FMIA 68°.'
  },
  {
    id: 'FMA', label: 'FMA°', analysis: 'tweed', type: 'angle', unit: '°',
    meanMale: 25, meanFemale: 25, sdPlus: 4, sdMinus: 4,
    landmarks: ['Po', 'Or', 'Go', 'Me'], formula: 'angle between Frankfort horizontal and mandibular plane',
    clinicalInterpretation: { normal: 'Normodivergent', increased: 'Hyperdivergent (steep plane)', decreased: 'Hypodivergent (flat plane)' },
    orthodonticImplication: 'Determines facial growth vector.'
  },
  {
    id: 'IMPA', label: 'IMPA°', analysis: 'tweed', type: 'angle', unit: '°',
    meanMale: 87, meanFemale: 87, sdPlus: 3, sdMinus: 3,
    landmarks: ['L1_tip', 'Go', 'Me'], formula: 'angle between L1 axis and mandibular plane',
    clinicalInterpretation: { normal: 'Normal lower incisor to mandible', increased: 'Proclined', decreased: 'Retroclined' },
    orthodonticImplication: 'Target depends on FMA angle.'
  },

  // RICKETTS ANALYSIS
  {
    id: 'Upper_Lip_E', label: 'Upper lip to E-plane', analysis: 'ricketts', type: 'distance', unit: 'mm',
    meanMale: -4, meanFemale: -4, sdPlus: 2, sdMinus: 2,
    landmarks: [], formula: 'distance from upper lip to Prn-Pg line',
    clinicalInterpretation: { normal: 'Normal upper lip profile', increased: 'Protrusive upper lip', decreased: 'Retrusive upper lip' },
    orthodonticImplication: 'Aesthetic impact of upper incisor retraction.'
  },
  {
    id: 'Lower_Lip_E', label: 'Lower lip to E-plane', analysis: 'ricketts', type: 'distance', unit: 'mm',
    meanMale: -2, meanFemale: -2, sdPlus: 2, sdMinus: 2,
    landmarks: [], formula: 'distance from lower lip to Prn-Pg line',
    clinicalInterpretation: { normal: 'Normal lower lip profile', increased: 'Protrusive lower lip', decreased: 'Retrusive lower lip' },
    orthodonticImplication: 'Guides lower incisor positioning for aesthetics.'
  },

  // DOWNS ANALYSIS
  {
    id: 'Facial_Angle', label: 'Facial angle°', analysis: 'downs', type: 'angle', unit: '°',
    meanMale: 87.8, meanFemale: 87.8, sdPlus: 3, sdMinus: 3,
    landmarks: ['Po', 'Or', 'N', 'Pg'], formula: 'angle between FH plane and N-Pg plane',
    clinicalInterpretation: { normal: 'Normal chin position', increased: 'Prognathic chin', decreased: 'Retrognathic chin' },
    orthodonticImplication: 'Assesses A-P position of the mandible.'
  },
  {
    id: 'Convexity', label: 'Angle of convexity°', analysis: 'downs', type: 'angle', unit: '°',
    meanMale: 0, meanFemale: 0, sdPlus: 4, sdMinus: 4,
    landmarks: ['N', 'A', 'Pg'], formula: 'angle formed by N-A and A-Pg lines',
    clinicalInterpretation: { normal: 'Straight profile', increased: 'Convex profile (Class II)', decreased: 'Concave profile (Class III)' },
    orthodonticImplication: 'Overall facial soft/hard tissue profile indicator.'
  },
  {
    id: 'AB_Plane', label: 'A-B plane angle°', analysis: 'downs', type: 'angle', unit: '°',
    meanMale: -4.6, meanFemale: -4.6, sdPlus: 3, sdMinus: 3,
    landmarks: ['N', 'Pg', 'A', 'B'], formula: 'angle of A-B line to N-Pg plane',
    clinicalInterpretation: { normal: 'Normal relationship', increased: 'Severe Class II', decreased: 'Severe Class III' },
    orthodonticImplication: 'Indicates relation of maxillary and mandibular apical bases.'
  }
];

export function calculateANB(sna: number, snb: number): number {
  return sna - snb;
}

export function interpretSNA(sna: number): 'prognathic' | 'normal' | 'retrognathic' {
  if (sna > 84) return 'prognathic';
  if (sna < 80) return 'retrognathic';
  return 'normal';
}

export function interpretSNB(snb: number): 'prognathic' | 'normal' | 'retrognathic' {
  if (snb > 82) return 'prognathic';
  if (snb < 78) return 'retrognathic';
  return 'normal';
}

export function getMalocclussionClass(anb: number): 'Class I' | 'Class II' | 'Class III' {
  if (anb < 0) return 'Class III';
  if (anb > 4) return 'Class II';
  return 'Class I';
}

export function getSkeletalPattern(fma: number): 'hypodivergent' | 'normodivergent' | 'hyperdivergent' {
  if (fma < 20) return 'hypodivergent';
  if (fma > 30) return 'hyperdivergent';
  return 'normodivergent';
}
