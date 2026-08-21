/**
 * TMJPresets.ts — Temporomandibular Joint Biomechanics Registry
 * 
 * Clinical data for TMJ movements, disc positions, and TMD classifications.
 * Used by TMJBiomechanicsViewer.tsx for the biomechanics simulator.
 */

export interface TMJMotionNorm {
  motion: string;              // e.g. 'Mouth Opening'
  normalRangeMm: { min: number; max: number };
  restrictedThresholdMm: number;
  excessiveThresholdMm: number;
  measuredBy: string;          // clinical measurement method
  clinicalNote: string;
}

export interface TMDClassification {
  piperClass: string;          // e.g. 'Class I', 'Class II', 'Class IIIa'
  name: string;
  discPosition: string;
  clinicalFindings: string[];
  radiologicFindings: string;
  treatment: string[];
}

export const TMJ_MOTION_NORMS: TMJMotionNorm[] = [
  {
    motion: 'Mouth Opening',
    normalRangeMm: { min: 35, max: 55 },
    restrictedThresholdMm: 25,
    excessiveThresholdMm: 60,
    measuredBy: 'Interincisal distance + overbite',
    clinicalNote: 'Patient should be able to fit 3 fingers vertically between incisors.'
  },
  {
    motion: 'Protrusion',
    normalRangeMm: { min: 6, max: 10 },
    restrictedThresholdMm: 4,
    excessiveThresholdMm: 12,
    measuredBy: 'Lower incisor distance past upper incisor',
    clinicalNote: 'Measured from centric occlusion.'
  },
  {
    motion: 'Lateral Excursion (Left)',
    normalRangeMm: { min: 8, max: 12 },
    restrictedThresholdMm: 6,
    excessiveThresholdMm: 15,
    measuredBy: 'Midline shift during lateral movement',
    clinicalNote: 'Asymmetry between left and right may indicate unilateral joint pathology.'
  },
  {
    motion: 'Lateral Excursion (Right)',
    normalRangeMm: { min: 8, max: 12 },
    restrictedThresholdMm: 6,
    excessiveThresholdMm: 15,
    measuredBy: 'Midline shift during lateral movement',
    clinicalNote: 'Asymmetry between left and right may indicate unilateral joint pathology.'
  },
  {
    motion: 'Retrusion',
    normalRangeMm: { min: 1, max: 3 },
    restrictedThresholdMm: 0,
    excessiveThresholdMm: 4,
    measuredBy: 'Posterior movement from centric occlusion',
    clinicalNote: 'Limited in normal joints due to anatomical boundaries.'
  },
  {
    motion: 'Overbite',
    normalRangeMm: { min: 2, max: 4 },
    restrictedThresholdMm: 1,
    excessiveThresholdMm: 6,
    measuredBy: 'Vertical overlap of anterior teeth',
    clinicalNote: 'Important to add to interincisal distance for true maximum mouth opening.'
  }
];

export const TMD_CLASSIFICATIONS: TMDClassification[] = [
  {
    piperClass: 'Class I',
    name: 'Normal TMJ',
    discPosition: 'Normal position over condylar head at all times.',
    clinicalFindings: ['No pain', 'No clicking/popping', 'Normal range of motion'],
    radiologicFindings: 'Disc tightly bound to medial and lateral poles. Normal condyle-fossa relationship.',
    treatment: ['None required']
  },
  {
    piperClass: 'Class II',
    name: 'Disc elongation (competent joint)',
    discPosition: 'Disc is elongated or deformed but maintains correct position over condyle.',
    clinicalFindings: ['Occasional mild pain', 'Intermittent clicking', 'No range of motion restriction'],
    radiologicFindings: 'Looseness of lateral collateral ligament, but disc remains reduced.',
    treatment: ['Observation', 'Soft diet', 'NSAIDs as needed']
  },
  {
    piperClass: 'Class IIIa',
    name: 'Disc displacement with reduction (clicking)',
    discPosition: 'Disc displaced anteriorly at rest, reduces (pops back) onto condyle upon opening.',
    clinicalFindings: ['Reciprocal clicking (opening and closing)', 'Possible pain during chewing', 'S-shaped deviation on opening'],
    radiologicFindings: 'Anterior disc displacement in closed mouth, normal position in open mouth.',
    treatment: ['Occlusal splint therapy', 'Physical therapy', 'Avoidance of hard chewing']
  },
  {
    piperClass: 'Class IIIb',
    name: 'Disc displacement without reduction (acute closed lock)',
    discPosition: 'Disc displaced anteriorly at all times, preventing full condylar translation.',
    clinicalFindings: ['Severe restricted mouth opening (< 25mm)', 'Pain on attempting to open', 'Deviation to affected side on opening'],
    radiologicFindings: 'Anterior disc displacement in both open and closed positions.',
    treatment: ['Arthrocentesis', 'Manual manipulation/reduction', 'Steroid injection']
  },
  {
    piperClass: 'Class IVa',
    name: 'Disc displacement with early osteoarthrosis',
    discPosition: 'Chronic displacement with beginning degenerative changes.',
    clinicalFindings: ['Crepitus (grinding sound)', 'Variable pain', 'Multiple bite changes'],
    radiologicFindings: 'Flattening of condylar head, early osteophyte formation, anterior displaced disc.',
    treatment: ['Arthrocentesis', 'Long-term splint therapy', 'Pain management']
  },
  {
    piperClass: 'Class IVb',
    name: 'Bilateral disc displacement with osteoarthrosis',
    discPosition: 'Both discs permanently displaced with degenerative changes.',
    clinicalFindings: ['Bilateral crepitus', 'Anterior open bite development', 'Retruded mandible'],
    radiologicFindings: 'Severe degenerative changes on both condyles, loss of vertical dimension.',
    treatment: ['Orthognathic surgery', 'Total joint replacement in severe cases', 'Extensive occlusal rehabilitation']
  },
  {
    piperClass: 'Class V',
    name: 'Perforation / Ankylosis',
    discPosition: 'Disc is perforated or destroyed. Bone-on-bone contact.',
    clinicalFindings: ['Severe restriction of movement (ankylosis)', 'Loud crepitus', 'Significant facial asymmetry if unilateral'],
    radiologicFindings: 'Bone-to-bone fusion (ankylosis) or completely destroyed joint space.',
    treatment: ['TMJ replacement surgery (alloplastic joint)', 'Gap arthroplasty']
  }
];

export interface TMJAnatomicLandmark {
  id: string;
  name: string;
  svgCoords: { cx: number; cy: number };  // For SVG rendering
  description: string;
  clinicalRelevance: string;
}

export const TMJ_LANDMARKS: TMJAnatomicLandmark[] = [
  {
    id: 'condylar_head',
    name: 'Condylar head',
    svgCoords: { cx: 150, cy: 150 },
    description: 'The rounded articular surface of the mandible.',
    clinicalRelevance: 'Primary site of osteoarthritic changes (flattening, osteophytes).'
  },
  {
    id: 'articular_disc',
    name: 'Articular disc',
    svgCoords: { cx: 150, cy: 130 },
    description: 'Fibrocartilaginous biconcave structure separating the joint into superior and inferior spaces.',
    clinicalRelevance: 'Often displaced anteriorly in TMD. Lacks innervation in central portion.'
  },
  {
    id: 'glenoid_fossa',
    name: 'Glenoid fossa',
    svgCoords: { cx: 150, cy: 110 },
    description: 'Depression in the temporal bone where the condyle rests.',
    clinicalRelevance: 'Very thin roof, separates joint from middle cranial fossa.'
  },
  {
    id: 'articular_eminence',
    name: 'Articular eminence',
    svgCoords: { cx: 110, cy: 130 },
    description: 'Anterior boundary of the glenoid fossa.',
    clinicalRelevance: 'Steepness dictates amount of condylar guidance. Dislocation occurs when condyle translates past it.'
  },
  {
    id: 'posterior_band',
    name: 'Posterior band',
    svgCoords: { cx: 170, cy: 130 },
    description: 'Thickest posterior portion of the articular disc.',
    clinicalRelevance: 'Should sit directly superior to the condylar head at rest.'
  },
  {
    id: 'intermediate_zone',
    name: 'Intermediate zone',
    svgCoords: { cx: 150, cy: 125 },
    description: 'Thinnest, avascular, and non-innervated central portion of the disc.',
    clinicalRelevance: 'Bears the most load during normal function.'
  },
  {
    id: 'anterior_band',
    name: 'Anterior band',
    svgCoords: { cx: 130, cy: 135 },
    description: 'Anterior thickened portion of the articular disc.',
    clinicalRelevance: 'Attaches to the superior belly of lateral pterygoid muscle.'
  },
  {
    id: 'bilaminar_zone',
    name: 'Bilaminar zone (Retrodiscal tissue)',
    svgCoords: { cx: 180, cy: 140 },
    description: 'Highly vascularized and innervated posterior attachment of the disc.',
    clinicalRelevance: 'Primary source of pain when compressed by posteriorly displaced condyle.'
  },
  {
    id: 'lateral_pterygoid',
    name: 'Lateral pterygoid (superior head)',
    svgCoords: { cx: 100, cy: 140 },
    description: 'Muscle attaching to the anterior band of the disc and condylar fovea.',
    clinicalRelevance: 'Spasm pulls the disc anteriorly, contributing to displacement.'
  },
  {
    id: 'lateral_capsule',
    name: 'Lateral capsule',
    svgCoords: { cx: 150, cy: 160 },
    description: 'Fibrous connective tissue enclosing the joint.',
    clinicalRelevance: 'Site of capsulitis and pain upon palpation over the joint.'
  }
];

export function getTMDByPiperClass(piperClass: string): TMDClassification | undefined {
  return TMD_CLASSIFICATIONS.find(c => c.piperClass === piperClass);
}
