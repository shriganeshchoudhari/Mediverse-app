/**
 * PupilAnisocoriaHornerEngine.ts
 * Neuro-Ophthalmology Pupil Dynamics, Anisocoria Differential Solver,
 * Pupillary Light Reflex (PLR), Swinging Flashlight RAPD & Pharmacologic Testing Engine.
 * Location: frontend/.gemini/skills/PupilAnisocoriaHornerEngine.ts
 */

export type PathologyType =
  | 'NORMAL'
  | 'PHYSIOLOGIC_ANISOCORIA'
  | 'HORNER_CENTRAL_1ST_ORDER'
  | 'HORNER_PREGANGLIONIC_2ND_ORDER'
  | 'HORNER_POSTGANGLIONIC_3RD_ORDER'
  | 'CN3_PALSY_COMPRESSIVE'
  | 'CN3_PALSY_ISCHEMIC'
  | 'ADIE_TONIC_PUPIL'
  | 'RAPD_MARCUS_GUNN'
  | 'PHARMACOLOGIC_MYDRIASIS';

export type EyedropChallenge =
  | 'NONE'
  | 'COCAINE_10'
  | 'APRACLONIDINE_05'
  | 'HYDROXYAMPHETAMINE_1'
  | 'PILOCARPINE_0125'
  | 'PILOCARPINE_1';

export type FlashlightPosition = 'OFF' | 'RIGHT_EYE' | 'LEFT_EYE' | 'AMONG_BOTH';

export interface PupilStateInput {
  ambientLux: number; // 0 (scotopic dark) to 1000 (bright photopic)
  flashlight: FlashlightPosition;
  nearEffort: boolean; // Accommodative convergence effort active
  pathology: PathologyType;
  affectedEye: 'RIGHT' | 'LEFT' | 'NEITHER';
  activeDrop: EyedropChallenge;
}

export interface EyePupilMetrics {
  pupilDiameterMm: number;
  restingSizeDarkMm: number;
  restingSizeLightMm: number;
  lightReflexResponse: 'NORMAL' | 'SLUGGISH' | 'ABSENT' | 'PARADOXICAL_DILATION';
  nearResponse: 'NORMAL' | 'TONIC_EXAGGERATED' | 'ABSENT';
  palpebralFissureMm: number; // Normal ~10mm, ptosis reduces to 7-9mm
  ptosisMm: number; // 0 = none, 1-2 = mild Horner, 4-6 = CN III
  anhidrosisArea: 'NONE' | 'IPSILATERAL_HEMIFACE' | 'IPSILATERAL_FOREHEAD_ONLY';
}

export interface AnisocoriaDiagnosticOutput {
  rightEye: EyePupilMetrics;
  leftEye: EyePupilMetrics;
  anisocoriaMm: number; // Absolute difference in diameter
  dominantDefect: 'NONE' | 'SYMPATHETIC_DEFICIT' | 'PARASYMPATHETIC_DEFICIT' | 'AFFERENT_DEFICIT';
  anisocoriaCondition: 'EQUAL_IN_LIGHT_AND_DARK' | 'GREATER_IN_DARK' | 'GREATER_IN_LIGHT';
  abnormalPupil: 'NEITHER' | 'SMALLER_PUPIL' | 'LARGER_PUPIL' | 'AFFERENT_RELATIVE';
  dropTestInterpretation: string;
  rapdPresent: boolean;
  rapdGrade: number; // 0 to 4+
  differentialDiagnosis: string[];
  recommendedUrgentWorkup: string[];
  clinicalPearl: string;
}

export const PUPIL_PATHOLOGY_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  state: PupilStateInput;
}[] = [
  {
    id: 'normal-symmetric',
    name: 'Normal Symmetric Pupils',
    badge: 'Physiologic Baseline',
    description: 'Bilateral symmetric 4.0 mm resting pupils, crisp direct and consensual pupillary light reflexes, intact accommodation.',
    state: {
      ambientLux: 300,
      flashlight: 'OFF',
      nearEffort: false,
      pathology: 'NORMAL',
      affectedEye: 'NEITHER',
      activeDrop: 'NONE',
    },
  },
  {
    id: 'physiologic-anisocoria',
    name: 'Physiologic (Essential) Anisocoria',
    badge: 'Benign Variant',
    description: 'Mild 0.5 mm asymmetry identical in light and dark, brisk bilateral light reflexes, no ptosis or dilation lag.',
    state: {
      ambientLux: 100,
      flashlight: 'OFF',
      nearEffort: false,
      pathology: 'PHYSIOLOGIC_ANISOCORIA',
      affectedEye: 'RIGHT',
      activeDrop: 'NONE',
    },
  },
  {
    id: 'horner-3rd-order-carotid',
    name: 'Right Postganglionic 3rd-Order Horner (Carotid Dissection)',
    badge: 'Vascular Emergency',
    description: 'Right miosis with dilation lag in dark, 1.5 mm ptosis, intact facial sweating (sweat fibers run with ECA). Apraclonidine causes reversal of anisocoria.',
    state: {
      ambientLux: 10,
      flashlight: 'OFF',
      nearEffort: false,
      pathology: 'HORNER_POSTGANGLIONIC_3RD_ORDER',
      affectedEye: 'RIGHT',
      activeDrop: 'NONE',
    },
  },
  {
    id: 'horner-2nd-order-pancoast',
    name: 'Left Preganglionic 2nd-Order Horner (Pancoast Tumor)',
    badge: 'Thoracic Oncology',
    description: 'Left miosis, 2.0 mm ptosis, ipsilateral hemi-facial anhidrosis from apical lung tumor invading sympathetic trunk. Hydroxyamphetamine dilates pupil.',
    state: {
      ambientLux: 15,
      flashlight: 'OFF',
      nearEffort: false,
      pathology: 'HORNER_PREGANGLIONIC_2ND_ORDER',
      affectedEye: 'LEFT',
      activeDrop: 'NONE',
    },
  },
  {
    id: 'cn3-palsy-aneurysm',
    name: 'Right Compressive CN III Palsy (PCOM Aneurysm)',
    badge: 'Neurosurgical Emergency',
    description: 'Unilateral dilated (7.5 mm) fixed pupil unresponsive to light, profound ptosis (levator paralysis), down-and-out ocular deviation.',
    state: {
      ambientLux: 500,
      flashlight: 'RIGHT_EYE',
      nearEffort: false,
      pathology: 'CN3_PALSY_COMPRESSIVE',
      affectedEye: 'RIGHT',
      activeDrop: 'NONE',
    },
  },
  {
    id: 'adie-tonic-pupil',
    name: 'Left Adie Tonic Pupil (Ciliary Ganglionitis)',
    badge: 'Parasympathetic Denervation',
    description: 'Unilateral mid-dilated pupil with absent light reflex, marked light-near dissociation (tonic constriction to near), supersensitivity to dilute 0.125% pilocarpine.',
    state: {
      ambientLux: 400,
      flashlight: 'OFF',
      nearEffort: true,
      pathology: 'ADIE_TONIC_PUPIL',
      affectedEye: 'LEFT',
      activeDrop: 'NONE',
    },
  },
  {
    id: 'marcus-gunn-rapd',
    name: 'Right Optic Neuritis & Marcus Gunn RAPD',
    badge: 'Afferent Pathway',
    description: 'Symmetric baseline pupils in resting light. On swinging flashlight test, light swung from left to right causes paradoxical bilateral pupillary dilation.',
    state: {
      ambientLux: 250,
      flashlight: 'RIGHT_EYE',
      nearEffort: false,
      pathology: 'RAPD_MARCUS_GUNN',
      affectedEye: 'RIGHT',
      activeDrop: 'NONE',
    },
  },
];

/**
 * Computes baseline pupil diameter based on ambient lux and light delivery
 */
export function computePupilDiameter(
  baseLux: number,
  flashlightActive: boolean,
  nearEffort: boolean
): number {
  // Lux ranges: 0 (dark) -> ~7.5 mm; 1000 (bright) -> ~2.2 mm
  const effectiveLux = flashlightActive ? Math.max(baseLux, 800) : baseLux;
  // Non-linear Hill-type equation for pupillary light reflex
  const minSize = 2.0;
  const maxSize = 7.5;
  const kLux = 120; // half-maximal lux
  let diameter = minSize + (maxSize - minSize) / (1 + Math.pow(effectiveLux / kLux, 0.9));

  if (nearEffort) {
    diameter = Math.max(minSize, diameter - 0.9);
  }

  return Math.round(diameter * 10) / 10;
}

/**
 * Main solver computing clinical metrics, anisocoria differentials, and pharmacological testing
 */
export function evaluatePupilDynamics(input: PupilStateInput): AnisocoriaDiagnosticOutput {
  const { ambientLux, flashlight, nearEffort, pathology, affectedEye, activeDrop } = input;

  // Baseline physiologic diameters without pathology
  const rightFlashlight = flashlight === 'RIGHT_EYE' || flashlight === 'AMONG_BOTH';
  const leftFlashlight = flashlight === 'LEFT_EYE' || flashlight === 'AMONG_BOTH';

  let rightDiam = computePupilDiameter(ambientLux, rightFlashlight || leftFlashlight, nearEffort);
  let leftDiam = computePupilDiameter(ambientLux, leftFlashlight || rightFlashlight, nearEffort);

  let rightPtosis = 0;
  let leftPtosis = 0;
  let rightAnhidrosis: EyePupilMetrics['anhidrosisArea'] = 'NONE';
  let leftAnhidrosis: EyePupilMetrics['anhidrosisArea'] = 'NONE';
  let rightLightReflex: EyePupilMetrics['lightReflexResponse'] = 'NORMAL';
  let leftLightReflex: EyePupilMetrics['lightReflexResponse'] = 'NORMAL';
  let rightNearResponse: EyePupilMetrics['nearResponse'] = nearEffort ? 'NORMAL' : 'NORMAL';
  let leftNearResponse: EyePupilMetrics['nearResponse'] = nearEffort ? 'NORMAL' : 'NORMAL';
  let rapdDetected = false;
  let rapdScore = 0;

  // Apply primary pathology
  switch (pathology) {
    case 'PHYSIOLOGIC_ANISOCORIA': {
      if (affectedEye === 'RIGHT') {
        rightDiam = Math.min(8.0, rightDiam + 0.5);
      } else if (affectedEye === 'LEFT') {
        leftDiam = Math.min(8.0, leftDiam + 0.5);
      }
      break;
    }

    case 'HORNER_CENTRAL_1ST_ORDER':
    case 'HORNER_PREGANGLIONIC_2ND_ORDER':
    case 'HORNER_POSTGANGLIONIC_3RD_ORDER': {
      const isRight = affectedEye === 'RIGHT';
      // Miosis: in dark (low lux), sympathetic paralysis prevents dilation.
      // Dilation lag: pupil is constricted, especially in darkness.
      const darkFactor = Math.max(0, 1 - ambientLux / 600);
      const miosisReduction = 1.6 + darkFactor * 1.8; // 1.6 - 3.4 mm reduction

      if (isRight) {
        rightDiam = Math.max(1.8, rightDiam - miosisReduction);
        rightPtosis = 1.8; // mild ptosis of Muller muscle
        if (pathology === 'HORNER_CENTRAL_1ST_ORDER') {
          rightAnhidrosis = 'IPSILATERAL_HEMIFACE';
        } else if (pathology === 'HORNER_PREGANGLIONIC_2ND_ORDER') {
          rightAnhidrosis = 'IPSILATERAL_HEMIFACE';
        } else {
          // 3rd order postganglionic: facial sweat fibers diverge at bifurcation with ECA!
          rightAnhidrosis = 'NONE';
        }
      } else {
        leftDiam = Math.max(1.8, leftDiam - miosisReduction);
        leftPtosis = 1.8;
        if (pathology === 'HORNER_CENTRAL_1ST_ORDER') {
          leftAnhidrosis = 'IPSILATERAL_HEMIFACE';
        } else if (pathology === 'HORNER_PREGANGLIONIC_2ND_ORDER') {
          leftAnhidrosis = 'IPSILATERAL_HEMIFACE';
        } else {
          leftAnhidrosis = 'NONE';
        }
      }
      break;
    }

    case 'CN3_PALSY_COMPRESSIVE': {
      // Compressive CN3 (PCOM aneurysm or uncal herniation): parasympathetic fibers in outer mantle compressed
      const isRight = affectedEye === 'RIGHT';
      if (isRight) {
        rightDiam = 7.6; // fixed mydriasis
        rightPtosis = 5.5; // profound levator palpebrae paralysis
        rightLightReflex = 'ABSENT';
        rightNearResponse = 'ABSENT';
      } else {
        leftDiam = 7.6;
        leftPtosis = 5.5;
        leftLightReflex = 'ABSENT';
        leftNearResponse = 'ABSENT';
      }
      break;
    }

    case 'CN3_PALSY_ISCHEMIC': {
      // Diabetic microvascular ischemia: spares peripheral parasympathetic pupillomotor fibers!
      const isRight = affectedEye === 'RIGHT';
      if (isRight) {
        rightPtosis = 4.5;
        // Pupil is spared or minimally affected
        rightDiam = Math.max(rightDiam, rightDiam + 0.3);
      } else {
        leftPtosis = 4.5;
        leftDiam = Math.max(leftDiam, leftDiam + 0.3);
      }
      break;
    }

    case 'ADIE_TONIC_PUPIL': {
      // Ciliary ganglion lesion: parasympathetic denervation, mid-dilated pupil in light
      const isRight = affectedEye === 'RIGHT';
      if (isRight) {
        rightDiam = Math.max(5.5, rightDiam + 2.0);
        rightLightReflex = 'ABSENT';
        if (nearEffort) {
          // Light-near dissociation: tonic prolonged constriction on near convergence!
          rightDiam = 2.4;
          rightNearResponse = 'TONIC_EXAGGERATED';
        }
      } else {
        leftDiam = Math.max(5.5, leftDiam + 2.0);
        leftLightReflex = 'ABSENT';
        if (nearEffort) {
          leftDiam = 2.4;
          leftNearResponse = 'TONIC_EXAGGERATED';
        }
      }
      break;
    }

    case 'RAPD_MARCUS_GUNN': {
      rapdDetected = true;
      rapdScore = 3;
      // In RAPD, resting pupil sizes in ambient light are SYMMETRIC because consensual response from healthy eye balances them
      // When flashlight is placed on affected eye: both pupils paradoxically dilate!
      if (flashlight === 'RIGHT_EYE' && affectedEye === 'RIGHT') {
        rightDiam = 5.6; // Paradoxical dilation due to impaired afferent signal
        leftDiam = 5.6;
        rightLightReflex = 'PARADOXICAL_DILATION';
        leftLightReflex = 'PARADOXICAL_DILATION';
      } else if (flashlight === 'LEFT_EYE' && affectedEye === 'LEFT') {
        rightDiam = 5.6;
        leftDiam = 5.6;
        rightLightReflex = 'PARADOXICAL_DILATION';
        leftLightReflex = 'PARADOXICAL_DILATION';
      } else if (flashlight === 'LEFT_EYE' && affectedEye === 'RIGHT') {
        // Light on intact left eye causes brisk bilateral constriction
        rightDiam = 2.2;
        leftDiam = 2.2;
      } else if (flashlight === 'RIGHT_EYE' && affectedEye === 'LEFT') {
        rightDiam = 2.2;
        leftDiam = 2.2;
      }
      break;
    }

    case 'PHARMACOLOGIC_MYDRIASIS': {
      const isRight = affectedEye === 'RIGHT';
      if (isRight) {
        rightDiam = 8.2; // Maximum anticholinergic mydriasis (atropine / cyclopentolate)
        rightLightReflex = 'ABSENT';
        rightNearResponse = 'ABSENT';
      } else {
        leftDiam = 8.2;
        leftLightReflex = 'ABSENT';
        leftNearResponse = 'ABSENT';
      }
      break;
    }

    default:
      break;
  }

  // Apply Pharmacological Eyedrop Challenges
  let dropInterp = 'No diagnostic eyedrop currently instilled.';

  if (activeDrop !== 'NONE') {
    const isHorner =
      pathology === 'HORNER_CENTRAL_1ST_ORDER' ||
      pathology === 'HORNER_PREGANGLIONIC_2ND_ORDER' ||
      pathology === 'HORNER_POSTGANGLIONIC_3RD_ORDER';

    if (activeDrop === 'COCAINE_10') {
      // Cocaine blocks NE reuptake. Normal pupil dilates. Horner pupil lacks NE, fails to dilate.
      if (isHorner) {
        if (affectedEye === 'RIGHT') {
          leftDiam = Math.min(8.0, leftDiam + 2.5); // Normal left dilates
          // Right Horner fails to dilate
          dropInterp =
            'POSITIVE COCAINE TEST: Normal eye dilated briskly, but affected eye failed to dilate (lacks presynaptic NE). Anisocoria increased to >= 1.0 mm, confirming Horner Syndrome.';
        } else {
          rightDiam = Math.min(8.0, rightDiam + 2.5);
          dropInterp =
            'POSITIVE COCAINE TEST: Normal eye dilated briskly, but affected eye failed to dilate (lacks presynaptic NE). Anisocoria increased to >= 1.0 mm, confirming Horner Syndrome.';
        }
      } else {
        rightDiam = Math.min(8.0, rightDiam + 2.0);
        leftDiam = Math.min(8.0, leftDiam + 2.0);
        dropInterp = 'NEGATIVE COCAINE TEST: Bilateral brisk dilation. Sympathetic innervation intact.';
      }
    } else if (activeDrop === 'APRACLONIDINE_05') {
      // Apraclonidine: alpha-2 and weak alpha-1. In Horner, denervation supersensitivity causes the Horner pupil to dilate and ptosis to improve ("reversal of anisocoria").
      if (isHorner) {
        if (affectedEye === 'RIGHT') {
          rightDiam = Math.min(7.8, rightDiam + 3.2); // Horner eye dilates dramatically!
          rightPtosis = 0; // Muller muscle lifts!
          leftDiam = Math.max(2.2, leftDiam - 0.4); // Normal pupil slightly constricts (alpha-2)
          dropInterp =
            'POSITIVE APRACLONIDINE TEST (REVERSAL OF ANISOCORIA): Horner pupil dilated dramatically and ptosis resolved due to alpha-1 denervation supersensitivity. Normal pupil mildly constricted. Confirms Horner Syndrome.';
        } else {
          leftDiam = Math.min(7.8, leftDiam + 3.2);
          leftPtosis = 0;
          rightDiam = Math.max(2.2, rightDiam - 0.4);
          dropInterp =
            'POSITIVE APRACLONIDINE TEST (REVERSAL OF ANISOCORIA): Horner pupil dilated dramatically and ptosis resolved due to alpha-1 denervation supersensitivity. Normal pupil mildly constricted. Confirms Horner Syndrome.';
        }
      } else {
        rightDiam = Math.max(2.2, rightDiam - 0.3);
        leftDiam = Math.max(2.2, leftDiam - 0.3);
        dropInterp =
          'NEGATIVE APRACLONIDINE TEST: Both pupils show mild alpha-2 constriction. No denervation supersensitivity.';
      }
    } else if (activeDrop === 'HYDROXYAMPHETAMINE_1') {
      // Hydroxyamphetamine releases stored NE from intact 3rd-order postganglionic terminals.
      // 1st or 2nd order lesion: 3rd order axon is intact -> DILATES!
      // 3rd order lesion: 3rd order axon degenerated -> FAILS TO DILATE.
      if (pathology === 'HORNER_POSTGANGLIONIC_3RD_ORDER') {
        if (affectedEye === 'RIGHT') {
          leftDiam = Math.min(8.0, leftDiam + 2.8);
          // right fails to dilate
          dropInterp =
            'POSTGANGLIONIC (3RD-ORDER) LOCALIZATION: Horner pupil failed to dilate because 3rd-order terminal is degenerated and depleted of NE. Indicates carotid dissection, skull base, or cavernous sinus lesion.';
        } else {
          rightDiam = Math.min(8.0, rightDiam + 2.8);
          dropInterp =
            'POSTGANGLIONIC (3RD-ORDER) LOCALIZATION: Horner pupil failed to dilate because 3rd-order terminal is degenerated and depleted of NE. Indicates carotid dissection, skull base, or cavernous sinus lesion.';
        }
      } else if (
        pathology === 'HORNER_CENTRAL_1ST_ORDER' ||
        pathology === 'HORNER_PREGANGLIONIC_2ND_ORDER'
      ) {
        // Intact 3rd order: both pupils dilate!
        rightDiam = Math.min(8.0, rightDiam + 2.5);
        leftDiam = Math.min(8.0, leftDiam + 2.5);
        dropInterp =
          'PREGANGLIONIC (1ST OR 2ND-ORDER) LOCALIZATION: Both pupils dilated equally because the 3rd-order postganglionic neuron is intact with viable NE stores. Investigating Pancoast tumor, apical lung mass, or brainstem lesion is mandatory.';
      } else {
        rightDiam = Math.min(8.0, rightDiam + 2.2);
        leftDiam = Math.min(8.0, leftDiam + 2.2);
        dropInterp = 'Both pupils dilated normally with hydroxyamphetamine.';
      }
    } else if (activeDrop === 'PILOCARPINE_0125') {
      // Dilute 0.125% pilocarpine: normal pupil DOES NOT constrict.
      // Adie tonic pupil constricts vigorously due to cholinergic muscarinic receptor supersensitivity.
      if (pathology === 'ADIE_TONIC_PUPIL') {
        if (affectedEye === 'RIGHT') {
          rightDiam = 1.9; // Brisk constriction
          dropInterp =
            'POSITIVE DILUTE PILOCARPINE (0.125%) TEST: Affected pupil constricted dramatically to 1.9 mm while normal pupil was unaffected. Confirms cholinergic denervation supersensitivity diagnostic of Adie Tonic Pupil.';
        } else {
          leftDiam = 1.9;
          dropInterp =
            'POSITIVE DILUTE PILOCARPINE (0.125%) TEST: Affected pupil constricted dramatically to 1.9 mm while normal pupil was unaffected. Confirms cholinergic denervation supersensitivity diagnostic of Adie Tonic Pupil.';
        }
      } else {
        dropInterp =
          'NEGATIVE DILUTE PILOCARPINE TEST: Neither pupil constricted to sub-threshold 0.125% pilocarpine.';
      }
    } else if (activeDrop === 'PILOCARPINE_1') {
      // High-dose 1% pilocarpine: constricts CN III palsy, but FAILS to constrict pharmacologic mydriasis (receptors blocked).
      if (pathology === 'PHARMACOLOGIC_MYDRIASIS') {
        dropInterp =
          'PHARMACOLOGIC MYDRIASIS CONFIRMED: Dilated pupil failed to constrict to full-strength 1% pilocarpine. Muscarinic receptors are completely blocked by anticholinergic agent (atropine/scopolamine).';
      } else if (pathology === 'CN3_PALSY_COMPRESSIVE' || pathology === 'CN3_PALSY_ISCHEMIC') {
        if (affectedEye === 'RIGHT') {
          rightDiam = 2.0;
        } else {
          leftDiam = 2.0;
        }
        dropInterp =
          'CN III PALSY (NOT PHARMACOLOGIC): Pupil constricted promptly to 1% pilocarpine. Muscarinic receptors are intact, confirming neurogenic CN III denervation rather than receptor blockade.';
      } else {
        rightDiam = Math.max(1.8, rightDiam - 3.0);
        leftDiam = Math.max(1.8, leftDiam - 3.0);
        dropInterp = 'Both pupils constricted briskly to 1% pilocarpine.';
      }
    }
  }

  // Round final values
  rightDiam = Math.round(rightDiam * 10) / 10;
  leftDiam = Math.round(leftDiam * 10) / 10;
  const anisocoria = Math.round(Math.abs(rightDiam - leftDiam) * 10) / 10;

  // Determine diagnostic classification
  let dominantDefect: AnisocoriaDiagnosticOutput['dominantDefect'] = 'NONE';
  let anisocoriaCondition: AnisocoriaDiagnosticOutput['anisocoriaCondition'] =
    'EQUAL_IN_LIGHT_AND_DARK';
  let abnormalPupil: AnisocoriaDiagnosticOutput['abnormalPupil'] = 'NEITHER';

  if (pathology === 'RAPD_MARCUS_GUNN') {
    dominantDefect = 'AFFERENT_DEFICIT';
    abnormalPupil = 'AFFERENT_RELATIVE';
  } else if (anisocoria > 0.6) {
    // Determine whether anisocoria is worse in light or dark
    if (
      pathology === 'HORNER_CENTRAL_1ST_ORDER' ||
      pathology === 'HORNER_PREGANGLIONIC_2ND_ORDER' ||
      pathology === 'HORNER_POSTGANGLIONIC_3RD_ORDER'
    ) {
      dominantDefect = 'SYMPATHETIC_DEFICIT';
      anisocoriaCondition = 'GREATER_IN_DARK';
      abnormalPupil = 'SMALLER_PUPIL';
    } else if (
      pathology === 'CN3_PALSY_COMPRESSIVE' ||
      pathology === 'CN3_PALSY_ISCHEMIC' ||
      pathology === 'ADIE_TONIC_PUPIL' ||
      pathology === 'PHARMACOLOGIC_MYDRIASIS'
    ) {
      dominantDefect = 'PARASYMPATHETIC_DEFICIT';
      anisocoriaCondition = 'GREATER_IN_LIGHT';
      abnormalPupil = 'LARGER_PUPIL';
    }
  } else if (pathology === 'PHYSIOLOGIC_ANISOCORIA') {
    anisocoriaCondition = 'EQUAL_IN_LIGHT_AND_DARK';
    abnormalPupil = 'NEITHER';
  }

  // Differentials and workup
  const { differentials, workup, pearl } = getClinicalGuidance(pathology, affectedEye);

  return {
    rightEye: {
      pupilDiameterMm: rightDiam,
      restingSizeDarkMm: 7.2,
      restingSizeLightMm: 2.5,
      lightReflexResponse: rightLightReflex,
      nearResponse: rightNearResponse,
      palpebralFissureMm: Math.max(4, 10 - rightPtosis),
      ptosisMm: rightPtosis,
      anhidrosisArea: rightAnhidrosis,
    },
    leftEye: {
      pupilDiameterMm: leftDiam,
      restingSizeDarkMm: 7.2,
      restingSizeLightMm: 2.5,
      lightReflexResponse: leftLightReflex,
      nearResponse: leftNearResponse,
      palpebralFissureMm: Math.max(4, 10 - leftPtosis),
      ptosisMm: leftPtosis,
      anhidrosisArea: leftAnhidrosis,
    },
    anisocoriaMm: anisocoria,
    dominantDefect,
    anisocoriaCondition,
    abnormalPupil,
    dropTestInterpretation: dropInterp,
    rapdPresent: rapdDetected,
    rapdGrade: rapdScore,
    differentialDiagnosis: differentials,
    recommendedUrgentWorkup: workup,
    clinicalPearl: pearl,
  };
}

function getClinicalGuidance(
  pathology: PathologyType,
  affectedEye: 'RIGHT' | 'LEFT' | 'NEITHER'
): { differentials: string[]; workup: string[]; pearl: string } {
  switch (pathology) {
    case 'HORNER_POSTGANGLIONIC_3RD_ORDER':
      return {
        differentials: [
          'Internal Carotid Artery Dissection (acute painful Horner)',
          'Cavernous Sinus Thrombosis or Fistula',
          'Skull base mass / Sphenoid neoplasm',
          'Cluster headache (Raeder paratrigeminal syndrome)',
        ],
        workup: [
          'STAT CT Angiography (CTA) or MR Angiography (MRA) of Neck and Head (rule out carotid dissection)',
          'Apraclonidine 0.5% eyedrop test (reversal of anisocoria confirms Horner)',
          'Hydroxyamphetamine 1% eyedrop test (failure to dilate confirms 3rd order)',
          'Heparin / Anticoagulation or Antiplatelet therapy if dissection confirmed',
        ],
        pearl:
          'ACUTE PAINFUL HORNER SYNDROME IS A CAROTID ARTERY DISSECTION UNTIL PROVEN OTHERWISE! 3rd-order postganglionic fibers run along the ICA wall; sparing of facial sweating occurs because sudomotor fibers travel with the external carotid artery.',
      };

    case 'HORNER_PREGANGLIONIC_2ND_ORDER':
      return {
        differentials: [
          'Pancoast Superior Sulcus Bronchogenic Carcinoma',
          'Thoracic Aortic Aneurysm or Dissection',
          'Cervical spine or thoracic root avulsion',
          'Iatrogenic injury: Central line placement, thyroidectomy, chest tube',
        ],
        workup: [
          'Chest CT with IV contrast focusing on lung apices and superior thoracic aperture',
          'Apraclonidine 0.5% eyedrop test',
          'Hydroxyamphetamine 1% eyedrop test (pupil dilates, confirming intact 3rd-order)',
          'MRI of Brachial Plexus and Cervical Spine',
        ],
        pearl:
          'Preganglionic (2nd order) Horner involves fibers traversing the sympathetic trunk over the lung apex and stellate ganglion to the SCG. Full ipsilateral facial anhidrosis is characteristically present.',
      };

    case 'HORNER_CENTRAL_1ST_ORDER':
      return {
        differentials: [
          'Lateral Medullary (Wallenberg) Syndrome (PICA infarction)',
          'Cervical cord syringomyelia or myelopathy',
          'Brainstem glioma or demyelination (Multiple Sclerosis)',
        ],
        workup: [
          'STAT MRI Brain and Cervical Spine with diffusion-weighted imaging (DWI)',
          'Neurology consultation for Wallenberg triad: ataxia, facial numbness, vertigo',
        ],
        pearl:
          '1st-order neurons originate in the hypothalamus and descend uncrossed through the brainstem to the ciliospinal center of Budge-Waller (C8-T2). Sensation loss and ataxia accompany central lesions.',
      };

    case 'CN3_PALSY_COMPRESSIVE':
      return {
        differentials: [
          'Posterior Communicating Artery (PCOM) Aneurysm (imminent rupture)',
          'Uncal Herniation (Transtentorial mass effect / Cushing triad)',
          'Pituitary Apoplexy',
          'Cavernous sinus mass or Tolosa-Hunt syndrome',
        ],
        workup: [
          'EMERGENCY CTA or MRA Brain with Digital Subtraction Angiography (DSA)',
          'Neurosurgery STAT consult for surgical clipping or endovascular coiling',
          '1% Pilocarpine test to distinguish from pharmacologic blockade (constricts promptly in CN III palsy)',
        ],
        pearl:
          'A "blown pupil" with complete ptosis and down-and-out deviation is a surgical emergency: pupillomotor parasympathetic fibers ride in the superomedial outer circumference of CN III, making them exquisitely vulnerable to extrinsic compression from PCOM aneurysms.',
      };

    case 'CN3_PALSY_ISCHEMIC':
      return {
        differentials: [
          'Diabetic Microvascular Ischemic 3rd Nerve Palsy',
          'Hypertensive microangiopathy',
          'Giant Cell Arteritis (in elderly > 50 yo)',
        ],
        workup: [
          'ESR and CRP (rule out Giant Cell Arteritis immediately)',
          'HbA1c, fasting glucose, and blood pressure optimization',
          'MRI/MRA Brain if pupil becomes involved or incomplete recovery by 8-12 weeks',
        ],
        pearl:
          '"Pupil-sparing" CN III palsy occurs because microvascular ischemia affects the nutrient vaso nervorum supplying the core of the nerve, leaving the superficial peripheral parasympathetic pupillary mantle intact.',
      };

    case 'ADIE_TONIC_PUPIL':
      return {
        differentials: [
          'Adie Tonic Pupil (idiopathic ciliary ganglionitis)',
          'Holmes-Adie Syndrome (Adie pupil + diminished deep tendon reflexes)',
          'Post-viral or autoimmune ciliary ganglionopathy',
          'Herpes zoster ophthalmicus',
        ],
        workup: [
          'Slit-lamp examination: Sector palsy and vermiform iris contractions',
          'Dilute Pilocarpine (0.125%) test: demonstrates supersensitivity miosis',
          'Deep tendon reflex testing (knee and Achilles jerks absent in Holmes-Adie)',
        ],
        pearl:
          'Adie tonic pupil results from postganglionic ciliary ganglion denervation. Aberrant regeneration of fibers (diverted from ciliary body accommodation to iris sphincter) causes the hallmark light-near dissociation (tonic constriction to near, absent to light).',
      };

    case 'RAPD_MARCUS_GUNN':
      return {
        differentials: [
          'Optic Neuritis (Multiple Sclerosis / MOG / NMOSD)',
          'Ischemic Optic Neuropathy (AION: arteritic vs non-arteritic)',
          'Retinal Detachment or Central Retinal Artery Occlusion (CRAO)',
          'Traumatic optic neuropathy or compressive optic glioma',
        ],
        workup: [
          'Swinging Flashlight Test: quantifies RAPD grade (1+ to 4+)',
          'MRI Brain and Orbits with gadolinium and fat suppression (optic nerve enhancement)',
          'Visual acuity, color plates (Ishihara), visual field perimetry, and OCT retinal nerve fiber layer (RNFL)',
        ],
        pearl:
          'A Relative Afferent Pupillary Defect (RAPD) DOES NOT cause anisocoria at rest! Anisocoria is strictly an EFFERENT problem. In RAPD, swinging the light from normal to diseased eye causes bilateral paradoxical dilation because the defective afferent signal provides less pupillomotor drive than the preceding consensual drive.',
      };

    case 'PHARMACOLOGIC_MYDRIASIS':
      return {
        differentials: [
          'Accidental ocular exposure to scopolamine patch or atropine',
          'Ipratropium / Tiotropium nebulizer spray into eye',
          'Cosmetic belladonna alkaloids or sympathomimetic eye drops',
        ],
        workup: [
          '1% Pilocarpine eyedrop challenge: failure to constrict confirms receptor blockade',
          'Careful occupational, travel, and medication history (motion sickness patches)',
        ],
        pearl:
          'A widely dilated (8-9 mm) pupil that fails to constrict even to full-strength 1% pilocarpine is diagnostic of pharmacologic cholinergic blockade. In contrast, neurogenic CN III palsy will constrict vigorously to 1% pilocarpine.',
      };

    case 'PHYSIOLOGIC_ANISOCORIA':
      return {
        differentials: [
          'Physiologic (essential) anisocoria (up to 20% of normal population)',
          'Early subtle Horner syndrome',
        ],
        workup: [
          'Review old photographs (drivers license, smartphone selfies)',
          'Verify symmetric brisk light and near reflexes',
          'Absence of ptosis and normal dilation velocity in dark rules out pathology',
        ],
        pearl:
          'Physiologic anisocoria is typically <= 0.6 mm, remains constant or equal in proportion between bright light and dark, and features normal pupillary light reflexes and no ptosis.',
      };

    default:
      return {
        differentials: ['Normal examination'],
        workup: ['No additional diagnostic testing indicated.'],
        pearl: 'Symmetric pupils (2.0 to 4.5 mm) with brisk direct and consensual reflexes denote intact optic and oculomotor nerve pathways.',
      };
  }
}
