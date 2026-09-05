/**
 * BronchoscopyEngine.ts
 * Comprehensive Flexible Bronchoscopy & EBUS Mediastinal Staging Simulation Engine.
 * Location: frontend/.gemini/skills/BronchoscopyEngine.ts
 *
 * Implements:
 * 1. 18-Segment Tracheobronchial Anatomy (Boyden / Jackson-Huber Classification):
 *    - Vocal cords, subglottis, cervical/thoracic trachea, main carina.
 *    - Right tree: RUL (Apical B1, Posterior B2, Anterior B3), Bronchus Intermedius, RML (Lateral B4, Medial B5), RLL (Superior B6, Medial Basal B7, Anterior Basal B8, Lateral Basal B9, Posterior Basal B10).
 *    - Left tree: LUL (Apicoposterior B1+B2, Anterior B3), Lingula (Superior B4, Inferior B5), LLL (Superior B6, Anteromedial Basal B7+B8, Lateral Basal B9, Posterior Basal B10).
 * 2. Bronchoscope Kinematics:
 *    - Depth (cm from incisors: 15cm vocal cords, 25cm main carina, 30-40cm segmental orifices).
 *    - Tip deflection (-130° down to +180° up) and shaft rotation (-90° left to +90° right).
 *    - Landmark matching algorithm evaluating scope position and optical field.
 * 3. Endobronchial Ultrasound (EBUS) & Transbronchial Needle Aspiration (TBNA):
 *    - IASLC lymph node map stations: 2R/2L, 4R/4L, 7 (Subcarinal), 10R/10L (Hilar), 11R/11L (Interlobar).
 *    - Color Power Doppler vascular interrogation (pulmonary artery, aorta, azygos vein safety check).
 *    - ROSE (Rapid On-Site Evaluation) cytology adequacy and diagnostic yield.
 * 4. Interventions & Pulmonary Emergency Management:
 *    - Bronchoalveolar Lavage (BAL): instilled volume, recovery %, cell differential (lymphocytes, neutrophils, eosinophils).
 *    - Massive hemoptysis protocol: cold saline flush, topical epinephrine 1:20,000, balloon occlusion catheter.
 *    - Foreign body extraction (baskets, rat-tooth forceps, cryoprobe).
 * 5. 6 Evidence-Based High-Yield Presets.
 */

export type AirwayLandmarkId =
  | 'VOCAL_CORDS'
  | 'SUBGLOTTIS'
  | 'MID_TRACHEA'
  | 'MAIN_CARINA'
  | 'R_MAINSTEM'
  | 'RUL_ORIFICE'
  | 'RUL_APICAL_B1'
  | 'RUL_POSTERIOR_B2'
  | 'RUL_ANTERIOR_B3'
  | 'BRONCHUS_INTERMEDIUS'
  | 'RML_ORIFICE'
  | 'RML_LATERAL_B4'
  | 'RML_MEDIAL_B5'
  | 'RLL_SUPERIOR_B6'
  | 'RLL_BASAL_TRUNK'
  | 'RLL_POSTERIOR_BASAL_B10'
  | 'L_MAINSTEM'
  | 'LUL_ORIFICE'
  | 'LUL_APICOLATERAL_B1_B2'
  | 'LINGULA_ORIFICE'
  | 'LLL_SUPERIOR_B6'
  | 'LLL_BASAL_TRUNK';

export interface AirwayLandmarkDefinition {
  id: AirwayLandmarkId;
  name: string;
  idealDepthCm: number;
  idealTipDeflectionDeg: number;
  idealShaftRotationDeg: number;
  anatomicCharacteristics: string;
  associatedEbusStation?: string;
  criticalBoardPearl: string;
}

export const AIRWAY_LANDMARKS: Record<AirwayLandmarkId, AirwayLandmarkDefinition> = {
  VOCAL_CORDS: {
    id: 'VOCAL_CORDS',
    name: 'Vocal Cords & Laryngeal Inlet',
    idealDepthCm: 15,
    idealTipDeflectionDeg: 0,
    idealShaftRotationDeg: 0,
    anatomicCharacteristics: 'True pearly-white vocal cords abducting on inspiration, arytenoid cartilages, posterior commissure.',
    criticalBoardPearl: 'Always pass scope through cords during inspiration to avoid vocal cord trauma and laryngeal spasm.'
  },
  SUBGLOTTIS: {
    id: 'SUBGLOTTIS',
    name: 'Subglottic Space & Cricoid Ring',
    idealDepthCm: 18,
    idealTipDeflectionDeg: 0,
    idealShaftRotationDeg: 0,
    anatomicCharacteristics: 'Complete circular cartilaginous cricoid ring; narrowest portion of upper airway.',
    criticalBoardPearl: 'Only complete circumferential cartilaginous ring in the respiratory tract; site of post-intubation stenosis.'
  },
  MID_TRACHEA: {
    id: 'MID_TRACHEA',
    name: 'Mid-Tracheal Lumen',
    idealDepthCm: 21,
    idealTipDeflectionDeg: 0,
    idealShaftRotationDeg: 0,
    anatomicCharacteristics: 'Horseshoe-shaped cartilaginous rings anteriorly with smooth posterior membranous wall.',
    associatedEbusStation: 'Station 2R / 2L Upper Paratracheal',
    criticalBoardPearl: 'Tracheomalacia is diagnosed by dynamic collapse (>50%) of the posterior membranous wall during forced expiration.'
  },
  MAIN_CARINA: {
    id: 'MAIN_CARINA',
    name: 'Main Carina (Tracheal Bifurcation)',
    idealDepthCm: 25,
    idealTipDeflectionDeg: 0,
    idealShaftRotationDeg: 0,
    anatomicCharacteristics: 'Sharp vertical keel separating right mainstem (wider, steeper ~25°) from left mainstem (~45°).',
    associatedEbusStation: 'Station 7 Subcarinal',
    criticalBoardPearl: 'A blunted, widened, splayed carina indicates massive subcarinal lymphadenopathy (Station 7) or subcarinal mass.'
  },
  R_MAINSTEM: {
    id: 'R_MAINSTEM',
    name: 'Right Mainstem Bronchus',
    idealDepthCm: 27,
    idealTipDeflectionDeg: -10,
    idealShaftRotationDeg: 25,
    anatomicCharacteristics: 'Short (1.5-2.0 cm), wide tubular segment preceding the takeoff of the Right Upper Lobe.',
    associatedEbusStation: 'Station 4R Lower Paratracheal (under azygos vein)',
    criticalBoardPearl: 'Aspiration and endotracheal tube right-mainstem misplacement occur here due to steeper, more vertical takeoff angle.'
  },
  RUL_ORIFICE: {
    id: 'RUL_ORIFICE',
    name: 'Right Upper Lobe (RUL) Trifurcation',
    idealDepthCm: 28,
    idealTipDeflectionDeg: 90,
    idealShaftRotationDeg: 60,
    anatomicCharacteristics: 'Sharp right lateral takeoff revealing immediate trifurcation into Apical (B1), Posterior (B2), and Anterior (B3).',
    associatedEbusStation: 'Station 10R Hilar',
    criticalBoardPearl: 'Requires extreme upward tip deflection (~90°) and clockwise shaft rotation to visualize all 3 segmental orifices.'
  },
  RUL_APICAL_B1: {
    id: 'RUL_APICAL_B1',
    name: 'RUL Apical Segment (B1)',
    idealDepthCm: 30,
    idealTipDeflectionDeg: 120,
    idealShaftRotationDeg: 60,
    anatomicCharacteristics: 'Uppermost branch of the RUL trifurcation pointing superiorly toward lung apex.',
    criticalBoardPearl: 'Primary predilection site for reactivation pulmonary tuberculosis due to high ventilation-to-perfusion ratio.'
  },
  RUL_POSTERIOR_B2: {
    id: 'RUL_POSTERIOR_B2',
    name: 'RUL Posterior Segment (B2)',
    idealDepthCm: 30,
    idealTipDeflectionDeg: 80,
    idealShaftRotationDeg: 90,
    anatomicCharacteristics: 'Posteriorly directed orifice of the RUL trifurcation.',
    criticalBoardPearl: 'Classic site for lung abscess in recumbent/supine alcohol-intoxicated aspiration.'
  },
  RUL_ANTERIOR_B3: {
    id: 'RUL_ANTERIOR_B3',
    name: 'RUL Anterior Segment (B3)',
    idealDepthCm: 30,
    idealTipDeflectionDeg: 60,
    idealShaftRotationDeg: 30,
    anatomicCharacteristics: 'Anteriorly directed orifice of the RUL trifurcation.',
    criticalBoardPearl: 'Differentiates RUL anatomy from RLL superior segment; lies anterior to apical/posterior branches.'
  },
  BRONCHUS_INTERMEDIUS: {
    id: 'BRONCHUS_INTERMEDIUS',
    name: 'Bronchus Intermedius',
    idealDepthCm: 29,
    idealTipDeflectionDeg: 0,
    idealShaftRotationDeg: 20,
    anatomicCharacteristics: 'Straight cylindrical conduit (~2.5 cm long) between RUL takeoff and RML/RLL division without any branches.',
    associatedEbusStation: 'Station 11R Interlobar',
    criticalBoardPearl: 'Has a membranous posterior wall and cartilaginous anterior wall; common site for foreign body impaction.'
  },
  RML_ORIFICE: {
    id: 'RML_ORIFICE',
    name: 'Right Middle Lobe (RML) Orifice',
    idealDepthCm: 32,
    idealTipDeflectionDeg: -45,
    idealShaftRotationDeg: 20,
    anatomicCharacteristics: 'Anteriorly and inferiorly directed oval orifice dividing into Lateral (B4) and Medial (B5) segments.',
    criticalBoardPearl: 'Middle Lobe Syndrome: narrow orifice surrounded by lymph nodes prone to recurrent atelectasis and bronchiectasis.'
  },
  RML_LATERAL_B4: {
    id: 'RML_LATERAL_B4',
    name: 'RML Lateral Segment (B4)',
    idealDepthCm: 34,
    idealTipDeflectionDeg: -45,
    idealShaftRotationDeg: 45,
    anatomicCharacteristics: 'Lateral branch of the middle lobe bifurcation.',
    criticalBoardPearl: 'Supplies the lateral wedge of middle lobe abutting the chest wall.'
  },
  RML_MEDIAL_B5: {
    id: 'RML_MEDIAL_B5',
    name: 'RML Medial Segment (B5)',
    idealDepthCm: 34,
    idealTipDeflectionDeg: -45,
    idealShaftRotationDeg: 0,
    anatomicCharacteristics: 'Medial branch of the middle lobe bifurcation abutting the right heart border.',
    criticalBoardPearl: 'Consolidation here produces classic radiographic silhouette sign obscuring the right cardiac border.'
  },
  RLL_SUPERIOR_B6: {
    id: 'RLL_SUPERIOR_B6',
    name: 'RLL Superior Segment (B6)',
    idealDepthCm: 32,
    idealTipDeflectionDeg: 60,
    idealShaftRotationDeg: 40,
    anatomicCharacteristics: 'Directly posterior takeoff arising opposite or slightly distal to the RML orifice.',
    criticalBoardPearl: 'Most dependent segment in the supine position; most frequent site of supine aspiration pneumonia.'
  },
  RLL_BASAL_TRUNK: {
    id: 'RLL_BASAL_TRUNK',
    name: 'RLL Basal Pyramid (B7-B10)',
    idealDepthCm: 35,
    idealTipDeflectionDeg: 0,
    idealShaftRotationDeg: 20,
    anatomicCharacteristics: 'Quadfurcation into Medial Basal (B7), Anterior Basal (B8), Lateral Basal (B9), and Posterior Basal (B10).',
    criticalBoardPearl: 'Right lower lobe has 4 distinct basal branches; note Medial Basal (B7) is absent/fused in the left lung.'
  },
  RLL_POSTERIOR_BASAL_B10: {
    id: 'RLL_POSTERIOR_BASAL_B10',
    name: 'RLL Posterior Basal Segment (B10)',
    idealDepthCm: 37,
    idealTipDeflectionDeg: 40,
    idealShaftRotationDeg: 30,
    anatomicCharacteristics: 'Deepest and most posterior branch of the lower lobe basal pyramid.',
    criticalBoardPearl: 'Reaches the posterior costophrenic sulcus; primary site of dependent basilar atelectasis.'
  },
  L_MAINSTEM: {
    id: 'L_MAINSTEM',
    name: 'Left Mainstem Bronchus',
    idealDepthCm: 28,
    idealTipDeflectionDeg: 0,
    idealShaftRotationDeg: -40,
    anatomicCharacteristics: 'Long (~4.5-5.0 cm), narrow, curved bronchus crossing under the aortic arch and anterior to the esophagus.',
    associatedEbusStation: 'Station 4L Lower Paratracheal (Aortopulmonary window)',
    criticalBoardPearl: 'Pulsations of the aortic arch visible superiorly and pulmonary artery anteriorly; longer length facilitates double-lumen tube placement.'
  },
  LUL_ORIFICE: {
    id: 'LUL_ORIFICE',
    name: 'Left Upper Lobe (LUL) Division',
    idealDepthCm: 33,
    idealTipDeflectionDeg: 80,
    idealShaftRotationDeg: -60,
    anatomicCharacteristics: 'Bifurcation into Upper Division (Apicoposterior B1+B2, Anterior B3) and Lingula (B4+B5).',
    associatedEbusStation: 'Station 10L Hilar',
    criticalBoardPearl: 'Lingula is the left lung homologue of the right middle lobe.'
  },
  LUL_APICOLATERAL_B1_B2: {
    id: 'LUL_APICOLATERAL_B1_B2',
    name: 'LUL Apicoposterior Segment (B1+B2)',
    idealDepthCm: 35,
    idealTipDeflectionDeg: 110,
    idealShaftRotationDeg: -70,
    anatomicCharacteristics: 'Fused apicoposterior segment arising from the superior division of the left upper lobe.',
    criticalBoardPearl: 'Common site of squamous and adenocarcinoma of the lung; apical branch reaches the cupula.'
  },
  LINGULA_ORIFICE: {
    id: 'LINGULA_ORIFICE',
    name: 'Lingular Bronchus (B4+B5)',
    idealDepthCm: 35,
    idealTipDeflectionDeg: -30,
    idealShaftRotationDeg: -50,
    anatomicCharacteristics: 'Arises from the lower division of LUL, dividing into Superior (B4) and Inferior (B5) lingular branches.',
    criticalBoardPearl: 'Pathologies silhouette the left heart border on frontal chest radiography.'
  },
  LLL_SUPERIOR_B6: {
    id: 'LLL_SUPERIOR_B6',
    name: 'LLL Superior Segment (B6)',
    idealDepthCm: 34,
    idealTipDeflectionDeg: 50,
    idealShaftRotationDeg: -40,
    anatomicCharacteristics: 'Sharp posterior branch of the left lower lobe opposite the lingular takeoff.',
    criticalBoardPearl: 'Dependent segment prone to aspiration and anaerobic lung abscess formation.'
  },
  LLL_BASAL_TRUNK: {
    id: 'LLL_BASAL_TRUNK',
    name: 'LLL Basal Pyramid (B7+B8, B9, B10)',
    idealDepthCm: 37,
    idealTipDeflectionDeg: 0,
    idealShaftRotationDeg: -30,
    anatomicCharacteristics: 'Trifurcation into Anteromedial Basal (B7+B8 fused), Lateral Basal (B9), and Posterior Basal (B10).',
    criticalBoardPearl: 'Medial and anterior basal segments are fused on the left (B7+B8), resulting in only 3 basal branches.'
  }
};

export type EbusStationId =
  | 'STATION_2R'
  | 'STATION_2L'
  | 'STATION_4R'
  | 'STATION_4L'
  | 'STATION_7'
  | 'STATION_10R'
  | 'STATION_10L'
  | 'STATION_11R'
  | 'STATION_11L';

export interface EbusStationDefinition {
  id: EbusStationId;
  name: string;
  nStageClassification: 'N1' | 'N2' | 'N3';
  anatomicalLocation: string;
  adjacentVascularStructures: string[];
  dopplerSafetyRule: string;
  malignancyImplication: string;
}

export const EBUS_STATIONS: Record<EbusStationId, EbusStationDefinition> = {
  STATION_2R: {
    id: 'STATION_2R',
    name: 'Station 2R (Upper Paratracheal)',
    nStageClassification: 'N2',
    anatomicalLocation: 'Right side of trachea between apex of lung/pleura and lower border of brachiocephalic vein.',
    adjacentVascularStructures: ['Brachiocephalic Artery', 'Superior Vena Cava'],
    dopplerSafetyRule: 'Activate color Doppler to avoid right brachiocephalic artery branch.',
    malignancyImplication: 'Ipsilateral N2 node for right lung tumors; contralateral N3 for left lung tumors.'
  },
  STATION_2L: {
    id: 'STATION_2L',
    name: 'Station 2L (Upper Paratracheal)',
    nStageClassification: 'N2',
    anatomicalLocation: 'Left side of trachea between apex of lung and superior border of aortic arch.',
    adjacentVascularStructures: ['Left Common Carotid', 'Left Subclavian Artery'],
    dopplerSafetyRule: 'Careful avoidance of left carotid and subclavian arterial takeoff.',
    malignancyImplication: 'Ipsilateral N2 for left lung tumors; contralateral N3 for right lung tumors.'
  },
  STATION_4R: {
    id: 'STATION_4R',
    name: 'Station 4R (Lower Paratracheal)',
    nStageClassification: 'N2',
    anatomicalLocation: 'Right lateral trachea extending from lower border of brachiocephalic vein to lower border of azygos vein.',
    adjacentVascularStructures: ['Azygos Vein Arch', 'Superior Vena Cava', 'Ascending Aorta'],
    dopplerSafetyRule: 'Must visualize the distinct non-pulsatile arch of the Azygos vein crossing over right mainstem.',
    malignancyImplication: 'Most commonly sampled N2 lymph node in right-sided lung cancers.'
  },
  STATION_4L: {
    id: 'STATION_4L',
    name: 'Station 4L (Lower Paratracheal - AP Window)',
    nStageClassification: 'N2',
    anatomicalLocation: 'Left lateral trachea between superior border of aortic arch and carina; bounded laterally by ligamentum arteriosum.',
    adjacentVascularStructures: ['Aortic Arch', 'Left Main Pulmonary Artery'],
    dopplerSafetyRule: 'Crucial vascular corridor between aortic arch pulsatile flow and pulmonary artery.',
    malignancyImplication: 'Involvement represents N2 disease; left recurrent laryngeal nerve courses here (hoarseness / Ortner syndrome).'
  },
  STATION_7: {
    id: 'STATION_7',
    name: 'Station 7 (Subcarinal)',
    nStageClassification: 'N2',
    anatomicalLocation: 'Directly below the main carina, bounded superiorly by carina and inferiorly by lower borders of bilateral main bronchi.',
    adjacentVascularStructures: ['Right Pulmonary Artery anteriorly', 'Left Atrium inferiorly', 'Esophagus posteriorly'],
    dopplerSafetyRule: 'Check posterior border to avoid esophageal lumen and anterior border to avoid RPA trunk.',
    malignancyImplication: 'N2 disease for BOTH right and left lung primaries; critical determinant of surgical resectability.'
  },
  STATION_10R: {
    id: 'STATION_10R',
    name: 'Station 10R (Hilar)',
    nStageClassification: 'N1',
    anatomicalLocation: 'Immediately adjacent to the right mainstem bronchus and origin of lobar bronchi.',
    adjacentVascularStructures: ['Right Main Pulmonary Artery', 'Superior Pulmonary Vein'],
    dopplerSafetyRule: 'Avoid right pulmonary artery bifurcation.',
    malignancyImplication: 'Ipsilateral N1 disease (resectable with lobectomy/pneumonectomy).'
  },
  STATION_10L: {
    id: 'STATION_10L',
    name: 'Station 10L (Hilar)',
    nStageClassification: 'N1',
    anatomicalLocation: 'Immediately adjacent to the left mainstem bronchus distal to the carinal reflection.',
    adjacentVascularStructures: ['Left Pulmonary Artery'],
    dopplerSafetyRule: 'Avoid main trunk of left pulmonary artery curving over left main bronchus.',
    malignancyImplication: 'Ipsilateral N1 disease.'
  },
  STATION_11R: {
    id: 'STATION_11R',
    name: 'Station 11R (Interlobar)',
    nStageClassification: 'N1',
    anatomicalLocation: 'Between the takeoff of the right upper lobe and the bronchus intermedius / middle lobe.',
    adjacentVascularStructures: ['Interlobar Pulmonary Artery'],
    dopplerSafetyRule: 'Interlobar artery lies in close contact with 11R node.',
    malignancyImplication: 'N1 nodal disease.'
  },
  STATION_11L: {
    id: 'STATION_11L',
    name: 'Station 11L (Interlobar)',
    nStageClassification: 'N1',
    anatomicalLocation: 'Between the left upper lobe and left lower lobe bronchial divisions.',
    adjacentVascularStructures: ['Left Interlobar Artery'],
    dopplerSafetyRule: 'Avoid branch to lingular and lower lobe arteries.',
    malignancyImplication: 'N1 nodal disease.'
  }
};

export type BronchoscopeTool =
  | 'NONE'
  | 'CYTOLOGY_BRUSH'
  | 'BIOPSY_FORCEPS'
  | 'EBUS_TBNA_NEEDLE_22G'
  | 'BAL_CATHETER'
  | 'BALLOON_OCCLUSION_CATHETER'
  | 'CRYOPROBE';

export interface BronchoscopeState {
  depthCm: number;              // 15 to 45 cm
  tipDeflectionDeg: number;     // -130° (down) to +180° (up)
  shaftRotationDeg: number;     // -90° (left) to +90° (right)
  activeTool: BronchoscopeTool;
  suctionActive: boolean;
  lightIntensityPct: number;    // 0 to 100%
  ebusModeActive: boolean;
  ebusBalloonSalineMl: number;  // 0.0 to 0.6 mL
  colorDopplerActive: boolean;
}

export interface BALState {
  instilledSalineMl: number;    // typically 100-150 mL
  recoveredSalineMl: number;    // target >= 40-60%
  totalCellCountPerUl: number;
  lymphocytePct: number;        // normal < 15%
  neutrophilPct: number;        // normal < 3%
  eosinophilPct: number;        // normal < 1%
  macrophagePct: number;        // normal > 80%
  cd4ToCd8Ratio: number;        // normal 1.5 - 2.0; >3.5 in sarcoidosis, <1.0 in hypersensitivity pneumonitis
}

export interface HemoptysisState {
  bleedingSeverity: 'NONE' | 'MILD_OOZE' | 'MODERATE' | 'MASSIVE_EXSANGUINATING';
  bleedingSourceLandmark: AirwayLandmarkId;
  icedSalineInstilledMl: number;
  epinephrineInstilledMg: number; // 1:20,000 dilution
  balloonOcclusionInflated: boolean;
  bleedingControlled: boolean;
}

export interface NavigationEvaluationResult {
  currentLandmarkId: AirwayLandmarkId;
  landmarkName: string;
  alignmentScorePct: number;    // 0 to 100%
  isViewCentered: boolean;
  coachingGuidance: string[];
  activeLandmark: AirwayLandmarkDefinition;
  ebusTargetStation?: EbusStationDefinition;
}

export function evaluateBronchoscopePosition(scope: BronchoscopeState): NavigationEvaluationResult {
  let bestLandmarkId: AirwayLandmarkId = 'MAIN_CARINA';
  let bestScore = -1;

  const landmarks = Object.values(AIRWAY_LANDMARKS);

  for (const lm of landmarks) {
    let score = 100;

    // Depth difference (weight: 45 pts)
    const depthDiff = Math.abs(scope.depthCm - lm.idealDepthCm);
    score -= Math.min(45, depthDiff * 12);

    // Tip deflection difference (weight: 30 pts)
    const tipDiff = Math.abs(scope.tipDeflectionDeg - lm.idealTipDeflectionDeg);
    score -= Math.min(30, tipDiff * 0.4);

    // Shaft rotation difference (weight: 25 pts)
    const rotDiff = Math.abs(scope.shaftRotationDeg - lm.idealShaftRotationDeg);
    score -= Math.min(25, rotDiff * 0.4);

    const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
    if (clampedScore > bestScore) {
      bestScore = clampedScore;
      bestLandmarkId = lm.id;
    }
  }

  const targetLm = AIRWAY_LANDMARKS[bestLandmarkId];
  const guidance: string[] = [];

  if (bestScore < 85) {
    if (Math.abs(scope.depthCm - targetLm.idealDepthCm) > 1.5) {
      const dir = scope.depthCm < targetLm.idealDepthCm ? 'Advance scope' : 'Withdraw scope';
      guidance.push(`${dir} to ~${targetLm.idealDepthCm} cm.`);
    }

    const tipDiff = targetLm.idealTipDeflectionDeg - scope.tipDeflectionDeg;
    if (Math.abs(tipDiff) > 15) {
      guidance.push(`Adjust tip lever: ${tipDiff > 0 ? 'Flex Upward' : 'Extend Downward'} (${Math.abs(tipDiff)}°).`);
    }

    const rotDiff = targetLm.idealShaftRotationDeg - scope.shaftRotationDeg;
    if (Math.abs(rotDiff) > 15) {
      guidance.push(`Torque scope shaft: ${rotDiff > 0 ? 'Clockwise (Right)' : 'Counter-Clockwise (Left)'} (${Math.abs(rotDiff)}°).`);
    }
  } else {
    guidance.push('Anatomical segment aligned. Endoluminal inspection optimal.');
  }

  // Find corresponding EBUS station if any
  let ebusTarget: EbusStationDefinition | undefined;
  if (targetLm.associatedEbusStation) {
    const matchedKey = Object.keys(EBUS_STATIONS).find(k => {
      const stationNumber = k.replace('STATION_', '');
      return targetLm.associatedEbusStation?.toUpperCase().includes(stationNumber);
    });
    if (matchedKey) {
      ebusTarget = EBUS_STATIONS[matchedKey as EbusStationId];
    }
  }

  return {
    currentLandmarkId: bestLandmarkId,
    landmarkName: targetLm.name,
    alignmentScorePct: bestScore,
    isViewCentered: bestScore >= 75,
    coachingGuidance: guidance.length > 0 ? guidance : ['Central luminal orientation established.'],
    activeLandmark: targetLm,
    ebusTargetStation: ebusTarget
  };
}

export interface BronchoscopyPreset {
  id: string;
  name: string;
  category: 'Diagnostic Survey' | 'EBUS Oncology' | 'Pulmonary Emergencies' | 'Interventional';
  description: string;
  initialScope: BronchoscopeState;
  balState?: BALState;
  hemoptysisState?: HemoptysisState;
  teachingPoints: string[];
}

export const BRONCHOSCOPY_PRESETS: BronchoscopyPreset[] = [
  {
    id: 'normal-18-segment-inspection',
    name: 'Normal 18-Segment Systematic Survey',
    category: 'Diagnostic Survey',
    description: 'Systematic visual inspection of the complete tracheobronchial tree from vocal cords to all 18 segmental orifices with normal pink mucosa and sharp carinae.',
    initialScope: {
      depthCm: 25,
      tipDeflectionDeg: 0,
      shaftRotationDeg: 0,
      activeTool: 'NONE',
      suctionActive: false,
      lightIntensityPct: 80,
      ebusModeActive: false,
      ebusBalloonSalineMl: 0,
      colorDopplerActive: false
    },
    teachingPoints: [
      'Normal carinae are thin, sharp, and mobile with dynamic respiratory movement.',
      'Always inspect the normal lung first before entering a known diseased or bleeding bronchus to prevent contamination.',
      'Systematic inspection: inspect right tree (RUL, RML, RLL) completely before advancing into left tree (LUL, Lingula, LLL).'
    ]
  },
  {
    id: 'ebus-subcarinal-nsclc-staging',
    name: 'EBUS-TBNA Subcarinal (Station 7) Mediastinal Staging',
    category: 'EBUS Oncology',
    description: '63-year-old with 3.2 cm RUL adenocarcinoma; EBUS interrogation of Station 7 reveals a 18 mm round, hypoechoic lymph node with distinct borders.',
    initialScope: {
      depthCm: 25,
      tipDeflectionDeg: 20,
      shaftRotationDeg: 0,
      activeTool: 'EBUS_TBNA_NEEDLE_22G',
      suctionActive: false,
      lightIntensityPct: 50,
      ebusModeActive: true,
      ebusBalloonSalineMl: 0.3,
      colorDopplerActive: true
    },
    teachingPoints: [
      'Station 7 (Subcarinal) is the most critical lymph node in lung cancer staging; positive cytology converts stage to N2 (Stage III).',
      'Always activate Color Power Doppler prior to needle puncture to differentiate lymph node from pulmonary artery branches or left atrium.',
      'Malignant EBUS sonographic features: round shape, short-axis > 10 mm, hypoechoic internal texture, distinct margins, and absence of central hilar structure.'
    ]
  },
  {
    id: 'massive-hemoptysis-rml',
    name: 'Massive Endobronchial Hemoptysis (RML Bleeding)',
    category: 'Pulmonary Emergencies',
    description: '56-year-old with cavitary tuberculosis presenting with sudden brisk bleeding (>300 mL/hr) flooding the bronchus intermedius from the Right Middle Lobe.',
    initialScope: {
      depthCm: 29,
      tipDeflectionDeg: -20,
      shaftRotationDeg: 20,
      activeTool: 'BALLOON_OCCLUSION_CATHETER',
      suctionActive: true,
      lightIntensityPct: 90,
      ebusModeActive: false,
      ebusBalloonSalineMl: 0,
      colorDopplerActive: false
    },
    hemoptysisState: {
      bleedingSeverity: 'MASSIVE_EXSANGUINATING',
      bleedingSourceLandmark: 'RML_ORIFICE',
      icedSalineInstilledMl: 0,
      epinephrineInstilledMg: 0,
      balloonOcclusionInflated: false,
      bleedingControlled: false
    },
    teachingPoints: [
      'Immediate priority: place patient in lateral decubitus position with the bleeding side down to protect the healthy lung from blood aspiration.',
      'Therapeutic ladder: iced saline (4°C) flushes in 50 mL aliquots, topical epinephrine (1:20,000 dilution; max 0.6 mg total), and endobronchial balloon catheter tamponade.',
      'Definitive management: emergent Bronchial Artery Embolization (BAE) via interventional radiology or rigid bronchoscopy in the OR.'
    ]
  },
  {
    id: 'foreign-body-bronchus-intermedius',
    name: 'Foreign Body Aspiration in Bronchus Intermedius',
    category: 'Interventional',
    description: '4-year-old with sudden paroxysmal coughing and unilateral right wheezing; bronchoscopy reveals an organic peanut lodged in the bronchus intermedius.',
    initialScope: {
      depthCm: 29,
      tipDeflectionDeg: 0,
      shaftRotationDeg: 20,
      activeTool: 'BIOPSY_FORCEPS',
      suctionActive: false,
      lightIntensityPct: 85,
      ebusModeActive: false,
      ebusBalloonSalineMl: 0,
      colorDopplerActive: false
    },
    teachingPoints: [
      'Organic foreign bodies (peanuts, seeds) cause intense local chemical bronchitis and mucosal edema within 24-48 hours.',
      'Rigid bronchoscopy under general anesthesia is the gold standard for pediatric foreign body extraction to maintain an open airway.',
      'Avoid forceful grasping of friable nuts with forceps which fragments the object; use Dormia baskets or cryoprobe freeze-adhesion.'
    ]
  },
  {
    id: 'central-airway-obstruction-carina',
    name: 'Severe Malignant Carinal Airway Obstruction',
    category: 'Interventional',
    description: '67-year-old with squamous cell carcinoma causing 85% exophytic luminal stenosis of the distal trachea and splaying of the main carina with severe stridor.',
    initialScope: {
      depthCm: 24,
      tipDeflectionDeg: 0,
      shaftRotationDeg: 0,
      activeTool: 'CRYOPROBE',
      suctionActive: false,
      lightIntensityPct: 85,
      ebusModeActive: false,
      ebusBalloonSalineMl: 0,
      colorDopplerActive: false
    },
    teachingPoints: [
      'Central airway obstruction (CAO) > 50% diameter reduction causes exertional dyspnea; > 75% causes severe stridor and respiratory arrest.',
      'Modalities: Mechanical debulking with rigid bronchoscope barrel, electrocautery, argon plasma coagulation (APC), and cryodebridement.',
      'Airway stenting: Silicone Y-stents (Dumon) or self-expanding metallic stents (SEMS) restore patency across the carina.'
    ]
  },
  {
    id: 'hypersensitivity-pneumonitis-bal',
    name: 'Subacute Hypersensitivity Pneumonitis (Diagnostic BAL)',
    category: 'Diagnostic Survey',
    description: '48-year-old pigeon fancier with bilateral ground-glass opacities; BAL performed in the Right Middle Lobe reveals marked lymphocytosis.',
    initialScope: {
      depthCm: 32,
      tipDeflectionDeg: -45,
      shaftRotationDeg: 20,
      activeTool: 'BAL_CATHETER',
      suctionActive: false,
      lightIntensityPct: 75,
      ebusModeActive: false,
      ebusBalloonSalineMl: 0,
      colorDopplerActive: false
    },
    balState: {
      instilledSalineMl: 150,
      recoveredSalineMl: 85,
      totalCellCountPerUl: 450,
      lymphocytePct: 52,
      neutrophilPct: 3,
      eosinophilPct: 1,
      macrophagePct: 44,
      cd4ToCd8Ratio: 0.6
    },
    teachingPoints: [
      'BAL is performed by wedging the bronchoscope tip into a subsegmental bronchus (RML or lingula preferred due to gravity yield).',
      'Instill sterile saline in 20-50 mL aliquots up to 100-200 mL total; recovery >= 30-40% is required for adequate cellular analysis.',
      'Marked BAL lymphocytosis (> 40-50%) combined with an inverted CD4/CD8 ratio (< 1.0) is highly characteristic of Hypersensitivity Pneumonitis.'
    ]
  }
];
