/**
 * NerveBlockPresets.ts — Dental Local Anesthesia & Nerve Block Simulation Registry
 * 
 * Provides clinical benchmarks, anatomical target coordinates, insertion angle
 * calculations, and safety margins for standard dental nerve block techniques.
 */

export interface NerveBlockTechnique {
  id: string;
  name: string;
  shortName: string;
  category: 'mandibular' | 'maxillary' | 'palatal';
  targetNerve: string;
  anatomicLandmark: string;
  syringePosition: string;
  idealDepthMm: number;
  depthToleranceMm: number;
  idealAngleDeg: number;       // Angle from sagittal midline (degrees)
  angleToleranceDeg: number;
  targetCoords3D: { x: number; y: number; z: number };
  anesthetizedAreas: string[];
  intravascularRisk: 'low' | 'moderate' | 'high';
  aspirationPositiveRatePercent: number;
  potentialComplications: string[];
  clinicalPearl: string;
}

export const DENTAL_NERVE_BLOCKS: NerveBlockTechnique[] = [
  {
    id: 'ianb',
    name: 'Inferior Alveolar Nerve Block (IANB / Halsted)',
    shortName: 'IAN Block',
    category: 'mandibular',
    targetNerve: 'Inferior Alveolar & Lingual Nerves (V3)',
    anatomicLandmark: 'Coronoid notch (greatest concavity), pterygomandibular raphe, mandibular occlusal plane (6–10mm superior).',
    syringePosition: 'Syringe barrel over contralateral premolars (angle ~45° to sagittal plane).',
    idealDepthMm: 22,
    depthToleranceMm: 4,
    idealAngleDeg: 45,
    angleToleranceDeg: 8,
    targetCoords3D: { x: 0.38, y: 0.15, z: -0.1 },
    anesthetizedAreas: [
      'All mandibular teeth to midline on side of injection',
      'Body of mandible & inferior ramus',
      'Buccal mucoperiosteum anterior to mental foramen',
      'Anterior 2/3 of tongue & floor of mouth (via Lingual nerve)',
      'Lingual soft tissues and periosteum',
    ],
    intravascularRisk: 'high',
    aspirationPositiveRatePercent: 12.5,
    potentialComplications: [
      'Transient Facial Nerve (CN VII) paralysis from posterior parotid injection',
      'Positive intravascular aspiration into Inferior Alveolar Artery/Vein',
      'Lingual nerve shock/paresthesia (electric shock sensation)',
      'Medial pterygoid muscle trismus from multiple needle penetrations',
    ],
    clinicalPearl: 'Bone must be contacted at 20–25mm depth. If bone is contacted prematurely (<15mm), the needle tip is too anterior; withdraw slightly and redirect syringe barrel more posteriorly.',
  },
  {
    id: 'gow_gates',
    name: 'Gow-Gates Mandibular Conduction Block',
    shortName: 'Gow-Gates',
    category: 'mandibular',
    targetNerve: 'Inferior Alveolar, Lingual, Mylohyoid, Auriculotemporal, and Buccal Nerves (Entire V3 trunk)',
    anatomicLandmark: 'Intertragic notch of external ear, mesiolingual cusp of maxillary second molar, condylar neck.',
    syringePosition: 'Syringe barrel over corner of mouth on opposite side, directed towards intertragic notch.',
    idealDepthMm: 25,
    depthToleranceMm: 3,
    idealAngleDeg: 55,
    angleToleranceDeg: 6,
    targetCoords3D: { x: 0.42, y: 0.32, z: -0.15 },
    anesthetizedAreas: [
      'Entire mandibular quadrant teeth, bone, and soft tissue',
      'Buccal soft tissue from molar to midline',
      'Anterior 2/3 of tongue and floor of mouth',
      'Temporal region and auricle (via Auriculotemporal nerve)',
    ],
    intravascularRisk: 'low',
    aspirationPositiveRatePercent: 1.8,
    potentialComplications: [
      'Delayed onset of anesthesia (5–10 minutes due to thick nerve trunk)',
      'Temporary difficulty closing mouth if patient does not keep wide open',
      'Rare internal maxillary artery puncture if inserted too deeply (>30mm)',
    ],
    clinicalPearl: 'Extremely high success rate (~98%) and low positive aspiration risk (<2%). Patient MUST maintain wide mouth opening for 1–2 minutes post-injection for gravity pooling.',
  },
  {
    id: 'vazirani_akinosi',
    name: 'Vazirani-Akinosi Closed-Mouth Mandibular Block',
    shortName: 'Akinosi Block',
    category: 'mandibular',
    targetNerve: 'Inferior Alveolar & Lingual Nerves within Pterygomandibular space',
    anatomicLandmark: 'Maxillary gingival margin above 2nd/3rd molars, pterygomandibular raphe, medial ramus surface.',
    syringePosition: 'Parallel to occlusal plane with needle at level of maxillary mucogingival junction.',
    idealDepthMm: 25,
    depthToleranceMm: 3,
    idealAngleDeg: 15,
    angleToleranceDeg: 5,
    targetCoords3D: { x: 0.35, y: 0.2, z: -0.08 },
    anesthetizedAreas: [
      'Mandibular teeth to midline',
      'Body of mandible and inferior ramus',
      'Lingual soft tissues and anterior 2/3 of tongue',
    ],
    intravascularRisk: 'moderate',
    aspirationPositiveRatePercent: 8.5,
    potentialComplications: [
      'No bone contact guidance (blind technique requires precise landmark calibration)',
      'Hematoma in pterygomandibular space',
    ],
    clinicalPearl: 'Indicated specifically for patients with severe trismus (inability to open mouth) or severe dental phobia / gag reflex.',
  },
  {
    id: 'mental_incisive',
    name: 'Mental & Incisive Nerve Block',
    shortName: 'Mental Block',
    category: 'mandibular',
    targetNerve: 'Mental Nerve & Incisive Nerve (at Mental Foramen)',
    anatomicLandmark: 'Mucobuccal fold between mandibular first and second premolar roots.',
    syringePosition: 'Directed from anterior to posterior at 45° angle to the long axis of premolars.',
    idealDepthMm: 6,
    depthToleranceMm: 2,
    idealAngleDeg: 35,
    angleToleranceDeg: 8,
    targetCoords3D: { x: 0.28, y: -0.05, z: 0.15 },
    anesthetizedAreas: [
      'Mandibular premolars, canine, and incisors (Incisive block with finger pressure)',
      'Lower lip, chin, and labial mucosa anterior to mental foramen',
    ],
    intravascularRisk: 'low',
    aspirationPositiveRatePercent: 4.2,
    potentialComplications: [
      'Direct nerve trauma (paresthesia) if needle enters directly into mental foramen',
      'Local hematoma at mucobuccal fold',
    ],
    clinicalPearl: 'Applying gentle digital pressure over the injection site for 2 minutes forces local anesthetic into the mental foramen, converting a simple mental block into a pulpal incisive block.',
  },
  {
    id: 'infraorbital',
    name: 'Infraorbital Nerve Block (True ASA Block)',
    shortName: 'Infraorbital',
    category: 'maxillary',
    targetNerve: 'Infraorbital, Anterior Superior Alveolar (ASA), and Middle Superior Alveolar (MSA) Nerves',
    anatomicLandmark: 'Infraorbital notch/foramen (in line with pupil), mucobuccal fold over first premolar.',
    syringePosition: 'Parallel to long axis of maxillary first premolar, directed toward infraorbital foramen.',
    idealDepthMm: 16,
    depthToleranceMm: 3,
    idealAngleDeg: 25,
    angleToleranceDeg: 5,
    targetCoords3D: { x: 0.22, y: 0.35, z: 0.18 },
    anesthetizedAreas: [
      'Maxillary central/lateral incisors, canine, and premolars',
      'Labial periodontium and anterior maxillary bone',
      'Lower eyelid, lateral nose, and upper lip',
    ],
    intravascularRisk: 'low',
    aspirationPositiveRatePercent: 0.7,
    potentialComplications: [
      'Direct ocular trauma if needle penetrates orbital floor (prevented by palpating finger on infraorbital rim)',
      'Sub-orbital hematoma',
    ],
    clinicalPearl: 'Keep index finger firmly planted on the infraorbital foramen throughout injection to palpate needle arrival and guide anesthetic solution into canal.',
  },
  {
    id: 'greater_palatine',
    name: 'Greater Palatine Nerve Block',
    shortName: 'Greater Palatine',
    category: 'palatal',
    targetNerve: 'Greater Palatine Nerve (at Greater Palatine Foramen)',
    anatomicLandmark: 'Palatal soft tissue 3–4mm anterior to greater palatine foramen (junction of hard palate & alveolar process near 2nd/3rd molar).',
    syringePosition: 'Approaching from opposite side of mouth at right angles to curvature of palate.',
    idealDepthMm: 4,
    depthToleranceMm: 1,
    idealAngleDeg: 80,
    angleToleranceDeg: 10,
    targetCoords3D: { x: 0.15, y: 0.1, z: 0.05 },
    anesthetizedAreas: [
      'Posterior portion of hard palate and overlying periodontium forward to 1st premolar',
    ],
    intravascularRisk: 'low',
    aspirationPositiveRatePercent: 0.5,
    potentialComplications: [
      'Soft palate anesthesia causing gagging sensation if injected too far posteriorly into lesser palatine canal',
      'Palatal tissue ischemia if excessive vasoconstrictor injected under dense mucoperiosteum',
    ],
    clinicalPearl: 'Use pressure pre-anesthesia with a cotton swab for 30 seconds before needle entry to achieve gate-control pain relief in the dense palatal mucosa.',
  },
];

export function getDentalNerveBlockById(id: string): NerveBlockTechnique | undefined {
  return DENTAL_NERVE_BLOCKS.find((b) => b.id === id);
}
