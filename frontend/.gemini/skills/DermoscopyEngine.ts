/**
 * DermoscopyEngine.ts
 * Mediverse — Clinical Dermoscopy & Wood's Lamp Biophysical Engine
 * Location: frontend/.gemini/skills/DermoscopyEngine.ts
 *
 * Biophysical & Optical Models:
 * - Dermoscopy Optical Physics:
 *   • Polarized Light Dermoscopy (cross-polarization blocks surface reflections, reveals deep collagen/melanin, shiny white lines, crystalline structures).
 *   • Non-Polarized Contact Dermoscopy (uses immersion interface fluid [mineral oil/gel] to equalize refractive indices, ideal for stratum corneum milia cysts).
 *   • Wood's Lamp Long-wave UVA (365 nm excitation):
 *     - Coproporphyrin III (Corynebacterium / Erythrasma) -> Coral-pink fluorescence.
 *     - Pyoverdin (Pseudomonas aeruginosa) -> Apple-green fluorescence.
 *     - Pteridine (Microsporum / Tinea capitis) -> Blue-green fluorescence.
 *     - Melanin attenuation / absence (Vitiligo) -> Chalky bright white accentuation.
 * - Dermoscopic Diagnostic Scoring:
 *   • 7-Point Melanoma Checklist (Arzenziano):
 *     Major criteria (2 pts each): Atypical pigment network, Blue-white veil, Atypical vascular pattern.
 *     Minor criteria (1 pt each): Irregular pigmentation, Irregular globules/dots, Irregular streaks (pseudopods), Regression structures.
 *     Total >= 3: Suspicious; >= 5: Highly suggestive of melanoma (urgent excision indicated).
 *   • Basal Cell Carcinoma (BCC) Hallmark Structures:
 *     Arborizing telangiectasias, blue-gray ovoid nests, multiple blue-gray globules, ulceration, spoke-wheel areas, leaf-like structures.
 *   • Seborrheic Keratosis (Benign):
 *     Milia-like cysts, comedo-like openings, cerebriform pattern, hairpin vessels with halo.
 */

export type DermoscopyLighting = 'POLARIZED_WHITE' | 'NON_POLARIZED_IMMERSION' | 'WOODS_LAMP_365NM';

export type DermoscopyAlarm =
  | 'BENIGN_REASSURING'
  | 'HIGH_MELANOMA_RISK_EXCISION'
  | 'SUSPICIOUS_ATYPICAL_LESION'
  | 'BASAL_CELL_CARCINOMA_SUSPECTED'
  | 'BACTERIAL_ERYTHRASMA_CORAL_PINK'
  | 'VITILIGO_CHALKY_WHITE_ACCENTUATION'
  | 'SEBORRHEIC_KERATOSIS_BENIGN';

export type DermoscopyPresetId =
  | 'SUPERFICIAL_SPREADING_MELANOMA'
  | 'NODULAR_BASAL_CELL_CARCINOMA'
  | 'SEBORRHEIC_KERATOSIS_BENIGN'
  | 'ERYTHRASMA_CORYNEBACTERIUM'
  | 'VITILIGO_DEPIGMENTATION'
  | 'DYSPLASTIC_NEVUS_ATYPICAL';

export interface DermoscopyPresetInfo {
  id: DermoscopyPresetId;
  title: string;
  lesionLocation: string;
  clinicalDescription: string;
  dermoscopicHallmarks: string;
  woodsLampAppearance: string;
  initialState: Partial<DermoscopyInputParams>;
}

export interface SevenPointChecklist {
  atypicalPigmentNetwork: boolean; // 2 pts
  blueWhiteVeil: boolean; // 2 pts
  atypicalVascularPattern: boolean; // 2 pts
  irregularPigmentation: boolean; // 1 pt
  irregularDotsGlobules: boolean; // 1 pt
  radialStreamingPseudopods: boolean; // 1 pt
  regressionStructures: boolean; // 1 pt
}

export interface DermoscopyInputParams {
  presetId: DermoscopyPresetId;
  lighting: DermoscopyLighting;
  magnification: '10X' | '20X' | '30X' | '40X';
  caliperReticleVisible: boolean;
  immersionGelApplied: boolean;
  biopsyTypePerformed: 'NONE' | 'SHAVE' | 'PUNCH_4MM' | 'EXCISIONAL_2MM';
  topicalTherapyInitiated: boolean; // Clindamycin/Erythromycin for Erythrasma, Steroids/Tacrolimus for Vitiligo
}

export interface DermoscopyState {
  lighting: DermoscopyLighting;
  magnification: '10X' | '20X' | '30X' | '40X';
  caliperReticleVisible: boolean;
  sevenPointScore: number;
  melanomaProbabilityPercent: number;
  fluorescenceColorDescription: string;
  dominantStructures: string[];
  activeAlarms: DermoscopyAlarm[];
  clinicalRecommendation: string;
}

export const DERMOSCOPY_PRESETS: Record<DermoscopyPresetId, DermoscopyPresetInfo> = {
  SUPERFICIAL_SPREADING_MELANOMA: {
    id: 'SUPERFICIAL_SPREADING_MELANOMA',
    title: 'Superficial Spreading Melanoma (Breslow 1.2 mm)',
    lesionLocation: 'Upper back (sun-exposed trunk in a 48-year-old male)',
    clinicalDescription: 'Asymmetric 8x6 mm polychromatic macule with notched irregular border and dark central nodule.',
    dermoscopicHallmarks: 'Prominent atypical pigment network with thickened cords, confluent blue-white veil, peripheral pseudopods (radial streaming), and polymorphous dotted/corkscrew vessels.',
    woodsLampAppearance: 'No characteristic bacterial fluorescence; surface pigment contrast slightly accentuated.',
    initialState: {
      presetId: 'SUPERFICIAL_SPREADING_MELANOMA',
      lighting: 'POLARIZED_WHITE',
      magnification: '20X',
      caliperReticleVisible: true,
      immersionGelApplied: false,
      biopsyTypePerformed: 'NONE',
      topicalTherapyInitiated: false,
    },
  },
  NODULAR_BASAL_CELL_CARCINOMA: {
    id: 'NODULAR_BASAL_CELL_CARCINOMA',
    title: 'Nodular Basal Cell Carcinoma (BCC)',
    lesionLocation: 'Right nasal ala / medial canthus in a 65-year-old female',
    clinicalDescription: 'Pearly translucent papule with rolled borders, telangiectatic vessels, and central focal crusted micro-ulceration.',
    dermoscopicHallmarks: 'Sharply focused branching arborizing telangiectasias, large blue-gray ovoid nests, shiny white crystalline streaks (chrysalis lines) under polarized light, absence of pigment network.',
    woodsLampAppearance: 'Negative for specific porphyrin fluorescence.',
    initialState: {
      presetId: 'NODULAR_BASAL_CELL_CARCINOMA',
      lighting: 'POLARIZED_WHITE',
      magnification: '20X',
      caliperReticleVisible: true,
      immersionGelApplied: false,
      biopsyTypePerformed: 'NONE',
      topicalTherapyInitiated: false,
    },
  },
  SEBORRHEIC_KERATOSIS_BENIGN: {
    id: 'SEBORRHEIC_KERATOSIS_BENIGN',
    title: 'Stuck-On Seborrheic Keratosis (Benign Cerebriform)',
    lesionLocation: 'Posterior shoulder / scapula in a 60-year-old male',
    clinicalDescription: 'Verrucous brown-black plaque with greasy stuck-on appearance and sharply circumscribed borders.',
    dermoscopicHallmarks: 'Multiple milia-like cysts ("starry sky" under non-polarized immersion), crypt-like comedo openings, cerebriform gyri and sulci, hairpin vessels surrounded by pale halos.',
    woodsLampAppearance: 'Non-fluorescent.',
    initialState: {
      presetId: 'SEBORRHEIC_KERATOSIS_BENIGN',
      lighting: 'NON_POLARIZED_IMMERSION',
      magnification: '10X',
      caliperReticleVisible: false,
      immersionGelApplied: true,
      biopsyTypePerformed: 'NONE',
      topicalTherapyInitiated: false,
    },
  },
  ERYTHRASMA_CORYNEBACTERIUM: {
    id: 'ERYTHRASMA_CORYNEBACTERIUM',
    title: 'Intertriginous Erythrasma (Corynebacterium minutissimum)',
    lesionLocation: 'Bilateral inguinal creases and axillae in a 52-year-old diabetic male',
    clinicalDescription: 'Well-demarcated reddish-brown finely wrinkled macerated patches with superficial fine cigarette-paper scaling.',
    dermoscopicHallmarks: 'Homogeneous brownish background with fine superficial desquamation; absence of malignant melanocytic patterns.',
    woodsLampAppearance: 'Intense, brilliant coral-pink / copper-red fluorescence caused by bacterial coproporphyrin III synthesis.',
    initialState: {
      presetId: 'ERYTHRASMA_CORYNEBACTERIUM',
      lighting: 'WOODS_LAMP_365NM',
      magnification: '10X',
      caliperReticleVisible: false,
      immersionGelApplied: false,
      biopsyTypePerformed: 'NONE',
      topicalTherapyInitiated: false,
    },
  },
  VITILIGO_DEPIGMENTATION: {
    id: 'VITILIGO_DEPIGMENTATION',
    title: 'Generalized Vitiligo (Autoimmune Epidermal Melanocytopenia)',
    lesionLocation: 'Dorsal hands, perioral, and periocular regions in a 29-year-old female',
    clinicalDescription: 'Complete porcelain-white depigmented chalky macules with scalloped hyperpigmented margins.',
    dermoscopicHallmarks: 'Leukotrichia (whitened hairs within patch), loss of perifollicular pigment, confetti-like depigmentation indicating progressive active disease.',
    woodsLampAppearance: 'Brilliant chalky-white accentuation with strikingly sharp margins due to complete loss of epidermal melanin absorbance.',
    initialState: {
      presetId: 'VITILIGO_DEPIGMENTATION',
      lighting: 'WOODS_LAMP_365NM',
      magnification: '10X',
      caliperReticleVisible: false,
      immersionGelApplied: false,
      biopsyTypePerformed: 'NONE',
      topicalTherapyInitiated: false,
    },
  },
  DYSPLASTIC_NEVUS_ATYPICAL: {
    id: 'DYSPLASTIC_NEVUS_ATYPICAL',
    title: 'Dysplastic Compound Melanocytic Nevus (Clark Nevus)',
    lesionLocation: 'Flank in a 34-year-old with numerous atypical nevi',
    clinicalDescription: '5.5 mm variegated tan-brown flat lesion with slightly elevated central fried-egg papule.',
    dermoscopicHallmarks: 'Focal eccentric hyperpigmentation with peripheral regular reticular network fading into normal skin, occasional regular brown globules, absence of blue-white veil or radial streaming.',
    woodsLampAppearance: 'Slight enhancement of epidermal pigment contrast without porphyrin fluorescence.',
    initialState: {
      presetId: 'DYSPLASTIC_NEVUS_ATYPICAL',
      lighting: 'POLARIZED_WHITE',
      magnification: '20X',
      caliperReticleVisible: true,
      immersionGelApplied: false,
      biopsyTypePerformed: 'NONE',
      topicalTherapyInitiated: false,
    },
  },
};

/**
 * Calculates Argenziano 7-Point Checklist Score
 */
export function calculate7PointChecklist(c: SevenPointChecklist): {
  score: number;
  riskCategory: 'LOW_BENIGN' | 'SUSPICIOUS' | 'HIGH_MALIGNANT';
} {
  let score = 0;
  // Major criteria: 2 points each
  if (c.atypicalPigmentNetwork) score += 2;
  if (c.blueWhiteVeil) score += 2;
  if (c.atypicalVascularPattern) score += 2;

  // Minor criteria: 1 point each
  if (c.irregularPigmentation) score += 1;
  if (c.irregularDotsGlobules) score += 1;
  if (c.radialStreamingPseudopods) score += 1;
  if (c.regressionStructures) score += 1;

  let riskCategory: 'LOW_BENIGN' | 'SUSPICIOUS' | 'HIGH_MALIGNANT' = 'LOW_BENIGN';
  if (score >= 5) {
    riskCategory = 'HIGH_MALIGNANT';
  } else if (score >= 3) {
    riskCategory = 'SUSPICIOUS';
  }

  return { score, riskCategory };
}

/**
 * Main Biophysical Solver for Dermoscopy and Wood's Lamp Analysis
 */
export function computeDermoscopyState(params: DermoscopyInputParams): DermoscopyState {
  const {
    presetId,
    lighting,
    magnification,
    caliperReticleVisible,
    immersionGelApplied,
    biopsyTypePerformed,
    topicalTherapyInitiated,
  } = params;

  let sevenPointCriteria: SevenPointChecklist = {
    atypicalPigmentNetwork: false,
    blueWhiteVeil: false,
    atypicalVascularPattern: false,
    irregularPigmentation: false,
    irregularDotsGlobules: false,
    radialStreamingPseudopods: false,
    regressionStructures: false,
  };

  const dominantStructures: string[] = [];
  let fluorescenceColorDescription = 'Negative (No pathological porphyrin or bacterial autofluorescence)';
  const activeAlarms: DermoscopyAlarm[] = [];

  switch (presetId) {
    case 'SUPERFICIAL_SPREADING_MELANOMA':
      sevenPointCriteria = {
        atypicalPigmentNetwork: true, // 2
        blueWhiteVeil: true, // 2
        atypicalVascularPattern: true, // 2
        irregularPigmentation: true, // 1
        irregularDotsGlobules: true, // 1
        radialStreamingPseudopods: true, // 1
        regressionStructures: false,
      };
      dominantStructures.push(
        'Atypical broad-meshed pigment network',
        'Confluent blue-white veil',
        'Peripheral pseudopods (radial streaming)',
        'Polymorphic dotted and corkscrew vessels'
      );
      if (lighting === 'WOODS_LAMP_365NM') {
        fluorescenceColorDescription = 'Absence of specific autofluorescence; dark melanin pigment borders accentuated.';
      }
      activeAlarms.push('HIGH_MELANOMA_RISK_EXCISION');
      break;

    case 'NODULAR_BASAL_CELL_CARCINOMA':
      dominantStructures.push(
        'Branching arborizing telangiectasias',
        'Blue-gray ovoid nests and globules',
        'Central ulceration / hemorrhagic crust',
        'Shiny white crystalline chrysalis lines (polarized)'
      );
      activeAlarms.push('BASAL_CELL_CARCINOMA_SUSPECTED');
      break;

    case 'SEBORRHEIC_KERATOSIS_BENIGN':
      dominantStructures.push(
        'Milia-like cysts (visible on immersion)',
        'Comedo-like crypt openings',
        'Cerebriform fissures and ridges (brain-like)',
        'Hairpin blood vessels with white halo'
      );
      activeAlarms.push('SEBORRHEIC_KERATOSIS_BENIGN');
      activeAlarms.push('BENIGN_REASSURING');
      break;

    case 'ERYTHRASMA_CORYNEBACTERIUM':
      dominantStructures.push(
        'Homogeneous light brown background',
        'Fine superficial desquamative scale',
        'Absence of atypical melanocytic network'
      );
      if (lighting === 'WOODS_LAMP_365NM') {
        fluorescenceColorDescription = 'BRIGHT CORAL-PINK / COPPER-RED (Bacterial Coproporphyrin III)';
        activeAlarms.push('BACTERIAL_ERYTHRASMA_CORAL_PINK');
      } else {
        fluorescenceColorDescription = 'Switch to Wood\'s Lamp (365 nm) to excite Coproporphyrin III.';
      }
      break;

    case 'VITILIGO_DEPIGMENTATION':
      dominantStructures.push(
        'Complete absence of epidermal pigment network',
        'Leukotrichia (depigmented hair follicles)',
        'Sharp scalloped marginal demarcation'
      );
      if (lighting === 'WOODS_LAMP_365NM') {
        fluorescenceColorDescription = 'BRILLIANT CHALKY-WHITE (Total epidermal melanin loss accentuation)';
        activeAlarms.push('VITILIGO_CHALKY_WHITE_ACCENTUATION');
      } else {
        fluorescenceColorDescription = 'Switch to Wood\'s Lamp (365 nm) to assess hypopigmentation boundaries.';
      }
      break;

    case 'DYSPLASTIC_NEVUS_ATYPICAL':
      sevenPointCriteria = {
        atypicalPigmentNetwork: true, // 2
        blueWhiteVeil: false,
        atypicalVascularPattern: false,
        irregularPigmentation: true, // 1
        irregularDotsGlobules: false,
        radialStreamingPseudopods: false,
        regressionStructures: false,
      };
      dominantStructures.push(
        'Focal eccentric atypical pigment network',
        'Regular delicate peripheral reticular mesh',
        'Fried-egg central elevated junctional component'
      );
      activeAlarms.push('SUSPICIOUS_ATYPICAL_LESION');
      break;
  }

  const { score: sevenPointScore } = calculate7PointChecklist(sevenPointCriteria);
  const melanomaProbabilityPercent =
    presetId === 'SUPERFICIAL_SPREADING_MELANOMA'
      ? 94
      : presetId === 'DYSPLASTIC_NEVUS_ATYPICAL'
      ? 18
      : presetId === 'NODULAR_BASAL_CELL_CARCINOMA'
      ? 4
      : 1;

  // Clinical Recommendation
  let clinicalRecommendation = 'Reassuring findings. Routine annual full-body skin examination recommended.';

  if (activeAlarms.includes('HIGH_MELANOMA_RISK_EXCISION')) {
    clinicalRecommendation =
      biopsyTypePerformed === 'EXCISIONAL_2MM'
        ? 'Excisional biopsy with 1–2 mm margins completed. Submit specimen for dermatopathology with Breslow depth and sentinel lymph node staging.'
        : 'URGENT DERMATOLOGY INTERVENTION: High 7-Point score (>=5) diagnostic of cutaneous melanoma. Perform immediate complete excisional biopsy with 1-2 mm margin. Do NOT perform superficial shave biopsy.';
  } else if (activeAlarms.includes('BASAL_CELL_CARCINOMA_SUSPECTED')) {
    clinicalRecommendation =
      biopsyTypePerformed !== 'NONE'
        ? 'Diagnostic biopsy performed. Confirm histopathology for Mohs Micrographic Surgery vs electrodessication & curettage depending on high-risk facial location.'
        : 'SUSPECTED BCC: Classic arborizing vessels and ovoid nests on nasal ala. Perform 3–4 mm punch or saucerization shave biopsy to confirm subtype prior to Mohs surgery.';
  } else if (activeAlarms.includes('BACTERIAL_ERYTHRASMA_CORAL_PINK')) {
    clinicalRecommendation = topicalTherapyInitiated
      ? 'Topical Clindamycin 1% or Erythromycin 2% initiated with antibacterial wash. Repeat Wood\'s lamp exam in 2 weeks.'
      : 'POSITIVE WOOD\'S LAMP: Coral-pink fluorescence confirms Corynebacterium minutissimum erythrasma (distinguishing from Tinea cruris or Candida). Prescribe topical Clindamycin 1% lotion or oral Clarithromycin.';
  } else if (activeAlarms.includes('VITILIGO_CHALKY_WHITE_ACCENTUATION')) {
    clinicalRecommendation = topicalTherapyInitiated
      ? 'Topical high-potency corticosteroid / Tacrolimus 0.1% ointment initiated with narrow-band UVB phototherapy referral.'
      : 'CHALKY-WHITE ACCENTUATION: Confirms epidermal amelanosis in Vitiligo. Initiate topical Calcineurin inhibitors (Tacrolimus 0.1%) or high-potency corticosteroids and evaluate thyroid/autoimmune panel.';
  } else if (activeAlarms.includes('SUSPICIOUS_ATYPICAL_LESION')) {
    clinicalRecommendation =
      biopsyTypePerformed !== 'NONE'
        ? 'Biopsy completed. Await histology to rule out severe architectural atypia.'
        : 'ATYPICAL DYSPLASTIC NEVUS: 7-point score 3. Baseline high-resolution digital dermoscopy photo-documentation with 3-month short-term monitoring or excisional biopsy indicated if dynamic changes occur.';
  }

  return {
    lighting,
    magnification,
    caliperReticleVisible,
    sevenPointScore,
    melanomaProbabilityPercent,
    fluorescenceColorDescription,
    dominantStructures,
    activeAlarms,
    clinicalRecommendation,
  };
}
