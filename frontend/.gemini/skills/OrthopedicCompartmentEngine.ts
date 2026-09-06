/**
 * OrthopedicCompartmentEngine.ts
 * Mediverse — Orthopedic Surgery & Acute Compartment Syndrome (ACS) Biophysical Engine
 *
 * Models:
 * - Lower Extremity 4-Compartment Leg Anatomy:
 *   • Anterior Compartment (Deep peroneal nerve, anterior tibial artery, tibialis anterior, EHL, EDL)
 *   • Lateral Compartment (Superficial peroneal nerve, peroneus longus/brevis)
 *   • Superficial Posterior (Tibial nerve branch, gastrocnemius, soleus, plantaris)
 *   • Deep Posterior (Tibial nerve, posterior tibial artery, flexor hallucis longus, FDL, tibialis posterior)
 * - Upper Extremity Volar & Dorsal Forearm Compartments & Volkmann Ischemic Contracture
 * - Intracompartmental Pressure (ICP) Dynamics:
 *   • Normal resting pressure: 0–8 mmHg
 *   • Capillary perfusion pressure collapse: Delta P = Diastolic BP - ICP (critical threshold Delta P <= 30 mmHg)
 *   • Absolute threshold: ICP >= 30 mmHg (Whitesides / McQueen criteria)
 * - The 6 P's of Acute Compartment Syndrome:
 *   • Pain out of proportion to injury (earliest, most sensitive)
 *   • Pain with passive stretch of compartment muscles
 *   • Paresthesia / hypoesthesia in specific nerve distribution (e.g. 1st web space for DPN)
 *   • Pallor
 *   • Poikilothermia
 *   • Pulselessness (late, ominous finding indicating irreversible necrosis)
 * - Whitesides Needle Manometer & Stryker Intracompartmental Pressure Device
 * - Surgical Decompression:
 *   • Emergent Two-Incision Four-Compartment Fasciotomy (Anterolateral + Posteromedial incisions)
 *   • Timing to decompression: <6 hours (near 100% recovery), 6–12 hours (variable deficit), >24 hours (crush syndrome / myoglobinuria / amputation)
 *   • Post-fasciotomy rhabdomyolysis and acute kidney injury (creatine kinase CK, urine myoglobin, aggressive alkalinization)
 */

// ─── Enums & Types ────────────────────────────────────────────────────────────

export type AnatomicRegion = 'LOWER_LEG_4_COMPARTMENT' | 'FOREARM_VOLAR_DORSAL';

export type LegCompartment =
  | 'ANTERIOR'
  | 'LATERAL'
  | 'SUPERFICIAL_POSTERIOR'
  | 'DEEP_POSTERIOR';

export type ForearmCompartment = 'VOLAR_DEEP_SUPERFICIAL' | 'DORSAL' | 'MOBILE_WAD';

export type InjuryMechanism =
  | 'TIBIAL_SHAFT_FRACTURE'
  | 'CRUSH_INJURY'
  | 'CONSTRICTIVE_CIRCUMFERENTIAL_CAST'
  | 'PROLONGED_ISCHEMIA_REPERFUSION'
  | 'HIGH_PRESSURE_INJECTION'
  | 'SUPRACONDYLAR_HUMERUS_FRACTURE';

export type OrthoAlarm =
  | 'OPTIMAL'
  | 'ACUTE_COMPARTMENT_SYNDROME_DELTA_P'
  | 'ABSOLUTE_PRESSURE_CRITICAL'
  | 'IMMINENT_VOLKMANN_CONTRACTURE'
  | 'RHABDOMYOLYSIS_MYOGLOBINURIA'
  | 'NEUROVASCULAR_DEFICIT_DPN'
  | 'FASCIOTOMY_MANDATORY_EMERGENT';

export type PresetId =
  | 'TIBIAL_FRACTURE_ANTERIOR_ACS'
  | 'CRUSH_INJURY_4_COMPARTMENT'
  | 'CONSTRICTING_FIBERGLASS_CAST'
  | 'SUPRACONDYLAR_VOLKMANN_FOREARM'
  | 'REPERFUSION_ISCHEMIA_POST_BYPASS'
  | 'BENIGN_MUSCLE_CONTUSION_RESOLVING';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface CompartmentMeasurement {
  name: string;
  pressureMmHg: number;
  deltaPMmHg: number; // DBP - ICP
  isCritical: boolean; // Delta P <= 30 mmHg or ICP >= 30 mmHg
  nerveAtRisk: string;
  nerveSensoryExam: 'INTACT' | 'HYPOESTHESIA' | 'ANESTHETIC';
  painOnPassiveStretch: boolean;
  tenseWoodyFeeling: boolean;
}

export interface SurgicalFasciotomyState {
  anterolateralIncisionDone: boolean; // Decompresses Anterior + Lateral
  posteromedialIncisionDone: boolean; // Decompresses Superficial + Deep Posterior
  volarFasciotomyDone: boolean; // For forearm
  completeDecompressionAchieved: boolean;
  ischemiaDurationHours: number;
  muscleViability: 'PINK_CONTRACTILE_BLEEDING' | 'DUSKY_BORDERLINE' | 'NON_VIABLE_NECROTIC';
  postOpIcpDropMmHg: number;
}

export interface OrthopedicInputParams {
  presetId: PresetId;
  region: AnatomicRegion;
  dbpMmHg: number;
  sbpMmHg: number;
  anteriorPressureMmHg: number;
  lateralPressureMmHg: number;
  superficialPostPressureMmHg: number;
  deepPostPressureMmHg: number;
  forearmVolarPressureMmHg: number;
  castSplitBivalved: boolean;
  legElevatedAboveHeart: boolean; // Paradoxically worsens compartment perfusion!
  anterolateralIncision: boolean;
  posteromedialIncision: boolean;
  volarIncision: boolean;
  hoursSinceInjury: number;
  urineColorMyoglobinuria: 'CLEAR_YELLOW' | 'TEA_COLORED' | 'PORT_WINE_BROWN';
  serumCreatineKinaseUPerL: number;
  passiveStretchPain: boolean;
}

export interface OrthopedicState {
  region: AnatomicRegion;
  injuryMechanism: string;
  compartments: CompartmentMeasurement[];
  worstDeltaPMmHg: number;
  worstAbsoluteIcpMmHg: number;
  acsDiagnosed: boolean;
  fasciotomyIndicated: boolean;
  fasciotomyState: SurgicalFasciotomyState;
  rhabdomyolysisSeverity: 'NORMAL' | 'MILD_CK_ELEVATION' | 'SEVERE_AKI_RISK';
  activeAlarms: OrthoAlarm[];
  clinicalRecommendation: string;
}

export interface PresetInfo {
  id: PresetId;
  title: string;
  injuryMechanism: string;
  clinicalScenario: string;
  nerveDeficit: string;
  initialState: Partial<OrthopedicInputParams>;
}

// ─── Preset Catalog ──────────────────────────────────────────────────────────

export const ORTHO_PRESETS: Record<PresetId, PresetInfo> = {
  TIBIAL_FRACTURE_ANTERIOR_ACS: {
    id: 'TIBIAL_FRACTURE_ANTERIOR_ACS',
    title: 'Closed Tibial Shaft Fracture — Anterior Compartment Syndrome',
    injuryMechanism: 'High-energy pedestrian vs auto collision with midshaft tibia fracture.',
    clinicalScenario: 'Patient screams in agony out of proportion to injury despite 15 mg IV morphine. Tense woody fullness over anterior compartment. Agonizing pain with passive great toe plantarflexion. Decreased sensation in 1st dorsal web space (deep peroneal nerve). Anterior compartment pressure 48 mmHg (DBP 70 mmHg, Delta P = 22 mmHg).',
    nerveDeficit: 'Deep Peroneal Nerve (1st dorsal web space hypoesthesia, EHL weakness)',
    initialState: {
      presetId: 'TIBIAL_FRACTURE_ANTERIOR_ACS',
      region: 'LOWER_LEG_4_COMPARTMENT',
      sbpMmHg: 128,
      dbpMmHg: 70,
      anteriorPressureMmHg: 48,
      lateralPressureMmHg: 26,
      superficialPostPressureMmHg: 16,
      deepPostPressureMmHg: 22,
      castSplitBivalved: false,
      legElevatedAboveHeart: true,
      anterolateralIncision: false,
      posteromedialIncision: false,
      hoursSinceInjury: 4,
      urineColorMyoglobinuria: 'CLEAR_YELLOW',
      serumCreatineKinaseUPerL: 1400,
      passiveStretchPain: true,
    },
  },
  CRUSH_INJURY_4_COMPARTMENT: {
    id: 'CRUSH_INJURY_4_COMPARTMENT',
    title: 'Building Collapse Crush Injury — Global 4-Compartment ACS & Rhabdomyolysis',
    injuryMechanism: 'Heavy structural beam pinned lower leg for 7 hours.',
    clinicalScenario: 'Massive edema and blistering across entire lower extremity. All 4 compartments tense as stone. Anterior pressure 56 mmHg, Lateral 52 mmHg, Deep Posterior 49 mmHg. Tea-colored dark urine with dipstick positive for blood but 0 RBCs on microscopy (myoglobinuria). CK 38,000 U/L.',
    nerveDeficit: 'Global Peroneal + Tibial Neuropathy (foot drop, plantar numbness)',
    initialState: {
      presetId: 'CRUSH_INJURY_4_COMPARTMENT',
      region: 'LOWER_LEG_4_COMPARTMENT',
      sbpMmHg: 110,
      dbpMmHg: 65,
      anteriorPressureMmHg: 56,
      lateralPressureMmHg: 52,
      superficialPostPressureMmHg: 38,
      deepPostPressureMmHg: 49,
      castSplitBivalved: false,
      legElevatedAboveHeart: false,
      anterolateralIncision: false,
      posteromedialIncision: false,
      hoursSinceInjury: 7,
      urineColorMyoglobinuria: 'TEA_COLORED',
      serumCreatineKinaseUPerL: 38000,
      passiveStretchPain: true,
    },
  },
  CONSTRICTING_FIBERGLASS_CAST: {
    id: 'CONSTRICTING_FIBERGLASS_CAST',
    title: 'Iatrogenic Constrictive Fiberglass Cast Post-ORIF',
    injuryMechanism: 'Circumferential rigid fiberglass cast applied in operating room over tight dressing.',
    clinicalScenario: 'Patient post-ankle ORIF develops progressive ischemic pain at 12 hours post-op. Bivalving the cast drops pressure by 50%; cutting the underlying cast padding relieves pressure by another 30%.',
    nerveDeficit: 'Superficial & Deep Peroneal Nerve Paresthesias',
    initialState: {
      presetId: 'CONSTRICTING_FIBERGLASS_CAST',
      region: 'LOWER_LEG_4_COMPARTMENT',
      sbpMmHg: 135,
      dbpMmHg: 80,
      anteriorPressureMmHg: 42,
      lateralPressureMmHg: 38,
      superficialPostPressureMmHg: 28,
      deepPostPressureMmHg: 32,
      castSplitBivalved: false,
      legElevatedAboveHeart: false,
      anterolateralIncision: false,
      posteromedialIncision: false,
      hoursSinceInjury: 12,
      urineColorMyoglobinuria: 'CLEAR_YELLOW',
      serumCreatineKinaseUPerL: 2200,
      passiveStretchPain: true,
    },
  },
  SUPRACONDYLAR_VOLKMANN_FOREARM: {
    id: 'SUPRACONDYLAR_VOLKMANN_FOREARM',
    title: 'Pediatric Supracondylar Humerus Fracture — Volkmann Forearm Ischemia',
    injuryMechanism: 'Fall from monkey bars with Gartland Type III supracondylar fracture.',
    clinicalScenario: 'Brachial artery kinking and median nerve tenting over proximal spike. Volar forearm compartment tense with fingers held in flexion. Excruciating pain with passive extension of digits. Volar compartment pressure 44 mmHg (DBP 60 mmHg, Delta P = 16 mmHg). Imminent Volkmann ischemic contracture.',
    nerveDeficit: 'Median & Anterior Interosseous Nerve (AIN - unable to make "OK" sign)',
    initialState: {
      presetId: 'SUPRACONDYLAR_VOLKMANN_FOREARM',
      region: 'FOREARM_VOLAR_DORSAL',
      sbpMmHg: 105,
      dbpMmHg: 60,
      forearmVolarPressureMmHg: 44,
      castSplitBivalved: false,
      volarIncision: false,
      hoursSinceInjury: 5,
      urineColorMyoglobinuria: 'CLEAR_YELLOW',
      serumCreatineKinaseUPerL: 1800,
      passiveStretchPain: true,
    },
  },
  REPERFUSION_ISCHEMIA_POST_BYPASS: {
    id: 'REPERFUSION_ISCHEMIA_POST_BYPASS',
    title: 'Post-Arterial Embolectomy Reperfusion ACS',
    injuryMechanism: 'Saddle embolus extraction after 6 hours of acute limb ischemia.',
    clinicalScenario: 'Sudden restoration of arterial inflow causes microvascular hyperpermeability and post-ischemic tissue edema inside rigid fascial envelopes. ICP rapidly climbs from 12 to 46 mmHg within 2 hours of revascularization.',
    nerveDeficit: 'Tibial Nerve / Sural Distribution Sensory Blunting',
    initialState: {
      presetId: 'REPERFUSION_ISCHEMIA_POST_BYPASS',
      region: 'LOWER_LEG_4_COMPARTMENT',
      sbpMmHg: 140,
      dbpMmHg: 75,
      anteriorPressureMmHg: 46,
      lateralPressureMmHg: 39,
      superficialPostPressureMmHg: 34,
      deepPostPressureMmHg: 42,
      castSplitBivalved: false,
      legElevatedAboveHeart: false,
      anterolateralIncision: false,
      posteromedialIncision: false,
      hoursSinceInjury: 3,
      urineColorMyoglobinuria: 'TEA_COLORED',
      serumCreatineKinaseUPerL: 8500,
      passiveStretchPain: true,
    },
  },
  BENIGN_MUSCLE_CONTUSION_RESOLVING: {
    id: 'BENIGN_MUSCLE_CONTUSION_RESOLVING',
    title: 'Benign Quadriceps / Calf Contusion — Normal Delta P > 40 mmHg',
    injuryMechanism: 'Direct helmet impact to anterior leg during soccer match.',
    clinicalScenario: 'Localized hematoma and swelling, but compartment is soft and compressible. Mild pain on active motion but no pain on passive stretch. Anterior pressure 18 mmHg (DBP 75 mmHg, Delta P = 57 mmHg). Reassuring perfusion. No surgery indicated.',
    nerveDeficit: 'None (normal neurovascular exam)',
    initialState: {
      presetId: 'BENIGN_MUSCLE_CONTUSION_RESOLVING',
      region: 'LOWER_LEG_4_COMPARTMENT',
      sbpMmHg: 122,
      dbpMmHg: 75,
      anteriorPressureMmHg: 18,
      lateralPressureMmHg: 14,
      superficialPostPressureMmHg: 12,
      deepPostPressureMmHg: 15,
      castSplitBivalved: false,
      legElevatedAboveHeart: false,
      anterolateralIncision: false,
      posteromedialIncision: false,
      hoursSinceInjury: 2,
      urineColorMyoglobinuria: 'CLEAR_YELLOW',
      serumCreatineKinaseUPerL: 320,
      passiveStretchPain: false,
    },
  },
};

export const ORTHOPEDIC_PRESETS = ORTHO_PRESETS;

// ─── Biophysical Solver ───────────────────────────────────────────────────────

export function computeOrthopedicState(params: OrthopedicInputParams): OrthopedicState {
  let {
    presetId,
    region,
    dbpMmHg,
    sbpMmHg,
    anteriorPressureMmHg,
    lateralPressureMmHg,
    superficialPostPressureMmHg,
    deepPostPressureMmHg,
    forearmVolarPressureMmHg,
    castSplitBivalved,
    legElevatedAboveHeart,
    anterolateralIncision,
    posteromedialIncision,
    volarIncision,
    hoursSinceInjury,
    urineColorMyoglobinuria,
    serumCreatineKinaseUPerL,
    passiveStretchPain,
  } = params;

  // Cast bivalving effect: drops pressures by up to 50-65%
  if (castSplitBivalved) {
    anteriorPressureMmHg = Math.max(8, Math.round(anteriorPressureMmHg * 0.45));
    lateralPressureMmHg = Math.max(8, Math.round(lateralPressureMmHg * 0.45));
    superficialPostPressureMmHg = Math.max(8, Math.round(superficialPostPressureMmHg * 0.45));
    deepPostPressureMmHg = Math.max(8, Math.round(deepPostPressureMmHg * 0.45));
    forearmVolarPressureMmHg = Math.max(8, Math.round(forearmVolarPressureMmHg * 0.45));
  }

  // Paradoxical leg elevation: elevating limb above heart decreases arterial inflow pressure (DBP drops locally at tissue)
  const effectiveDbp = legElevatedAboveHeart ? Math.max(40, dbpMmHg - 15) : dbpMmHg;

  // Fasciotomy decompression drops compartment pressures to atmospheric (0–8 mmHg)
  if (anterolateralIncision) {
    anteriorPressureMmHg = Math.min(anteriorPressureMmHg, 8);
    lateralPressureMmHg = Math.min(lateralPressureMmHg, 8);
  }
  if (posteromedialIncision) {
    superficialPostPressureMmHg = Math.min(superficialPostPressureMmHg, 8);
    deepPostPressureMmHg = Math.min(deepPostPressureMmHg, 8);
  }
  if (volarIncision) {
    forearmVolarPressureMmHg = Math.min(forearmVolarPressureMmHg, 8);
  }

  // Evaluate individual compartments
  const compartments: CompartmentMeasurement[] = [];

  if (region === 'LOWER_LEG_4_COMPARTMENT') {
    // 1. Anterior
    const antDeltaP = effectiveDbp - anteriorPressureMmHg;
    compartments.push({
      name: 'Anterior Compartment',
      pressureMmHg: anteriorPressureMmHg,
      deltaPMmHg: antDeltaP,
      isCritical: antDeltaP <= 30 || anteriorPressureMmHg >= 30,
      nerveAtRisk: 'Deep Peroneal Nerve',
      nerveSensoryExam: anteriorPressureMmHg >= 45 ? 'ANESTHETIC' : anteriorPressureMmHg >= 30 ? 'HYPOESTHESIA' : 'INTACT',
      painOnPassiveStretch: passiveStretchPain && anteriorPressureMmHg > 25,
      tenseWoodyFeeling: anteriorPressureMmHg >= 30,
    });

    // 2. Lateral
    const latDeltaP = effectiveDbp - lateralPressureMmHg;
    compartments.push({
      name: 'Lateral Compartment',
      pressureMmHg: lateralPressureMmHg,
      deltaPMmHg: latDeltaP,
      isCritical: latDeltaP <= 30 || lateralPressureMmHg >= 30,
      nerveAtRisk: 'Superficial Peroneal Nerve',
      nerveSensoryExam: lateralPressureMmHg >= 45 ? 'ANESTHETIC' : lateralPressureMmHg >= 30 ? 'HYPOESTHESIA' : 'INTACT',
      painOnPassiveStretch: passiveStretchPain && lateralPressureMmHg > 25,
      tenseWoodyFeeling: lateralPressureMmHg >= 30,
    });

    // 3. Superficial Posterior
    const supDeltaP = effectiveDbp - superficialPostPressureMmHg;
    compartments.push({
      name: 'Superficial Posterior',
      pressureMmHg: superficialPostPressureMmHg,
      deltaPMmHg: supDeltaP,
      isCritical: supDeltaP <= 30 || superficialPostPressureMmHg >= 30,
      nerveAtRisk: 'Sural Nerve',
      nerveSensoryExam: superficialPostPressureMmHg >= 45 ? 'ANESTHETIC' : superficialPostPressureMmHg >= 30 ? 'HYPOESTHESIA' : 'INTACT',
      painOnPassiveStretch: passiveStretchPain && superficialPostPressureMmHg > 25,
      tenseWoodyFeeling: superficialPostPressureMmHg >= 30,
    });

    // 4. Deep Posterior
    const deepDeltaP = effectiveDbp - deepPostPressureMmHg;
    compartments.push({
      name: 'Deep Posterior Compartment',
      pressureMmHg: deepPostPressureMmHg,
      deltaPMmHg: deepDeltaP,
      isCritical: deepDeltaP <= 30 || deepPostPressureMmHg >= 30,
      nerveAtRisk: 'Tibial Nerve (Plantar sensation)',
      nerveSensoryExam: deepPostPressureMmHg >= 45 ? 'ANESTHETIC' : deepPostPressureMmHg >= 30 ? 'HYPOESTHESIA' : 'INTACT',
      painOnPassiveStretch: passiveStretchPain && deepPostPressureMmHg > 25,
      tenseWoodyFeeling: deepPostPressureMmHg >= 30,
    });
  } else {
    // Forearm
    const volarDeltaP = effectiveDbp - forearmVolarPressureMmHg;
    compartments.push({
      name: 'Volar Forearm Compartment',
      pressureMmHg: forearmVolarPressureMmHg,
      deltaPMmHg: volarDeltaP,
      isCritical: volarDeltaP <= 30 || forearmVolarPressureMmHg >= 30,
      nerveAtRisk: 'Median & Anterior Interosseous Nerves',
      nerveSensoryExam: forearmVolarPressureMmHg >= 45 ? 'ANESTHETIC' : forearmVolarPressureMmHg >= 30 ? 'HYPOESTHESIA' : 'INTACT',
      painOnPassiveStretch: passiveStretchPain && forearmVolarPressureMmHg > 25,
      tenseWoodyFeeling: forearmVolarPressureMmHg >= 30,
    });
  }

  // Summary Metrics
  const worstDeltaPMmHg = Math.min(...compartments.map(c => c.deltaPMmHg));
  const worstAbsoluteIcpMmHg = Math.max(...compartments.map(c => c.pressureMmHg));
  const acsDiagnosed = worstDeltaPMmHg <= 30 || worstAbsoluteIcpMmHg >= 30;

  // Surgical decompression status
  const completeDecompressionAchieved =
    region === 'LOWER_LEG_4_COMPARTMENT'
      ? anterolateralIncision && posteromedialIncision
      : volarIncision;

  const fasciotomyIndicated = acsDiagnosed && !completeDecompressionAchieved;

  let muscleViability: 'PINK_CONTRACTILE_BLEEDING' | 'DUSKY_BORDERLINE' | 'NON_VIABLE_NECROTIC' = 'PINK_CONTRACTILE_BLEEDING';
  if (hoursSinceInjury > 12 || (hoursSinceInjury > 6 && worstAbsoluteIcpMmHg > 50)) {
    muscleViability = 'NON_VIABLE_NECROTIC';
  } else if (hoursSinceInjury > 6 || worstAbsoluteIcpMmHg > 40) {
    muscleViability = 'DUSKY_BORDERLINE';
  }

  // Rhabdomyolysis grading
  let rhabdomyolysisSeverity: 'NORMAL' | 'MILD_CK_ELEVATION' | 'SEVERE_AKI_RISK' = 'NORMAL';
  if (serumCreatineKinaseUPerL >= 10000 || urineColorMyoglobinuria !== 'CLEAR_YELLOW') {
    rhabdomyolysisSeverity = 'SEVERE_AKI_RISK';
  } else if (serumCreatineKinaseUPerL >= 1000) {
    rhabdomyolysisSeverity = 'MILD_CK_ELEVATION';
  }

  // Alarms
  const activeAlarms: OrthoAlarm[] = [];
  if (worstDeltaPMmHg <= 30) {
    activeAlarms.push('ACUTE_COMPARTMENT_SYNDROME_DELTA_P');
  }
  if (worstAbsoluteIcpMmHg >= 30) {
    activeAlarms.push('ABSOLUTE_PRESSURE_CRITICAL');
  }
  if (fasciotomyIndicated) {
    activeAlarms.push('FASCIOTOMY_MANDATORY_EMERGENT');
  }
  if (region === 'FOREARM_VOLAR_DORSAL' && acsDiagnosed && !volarIncision) {
    activeAlarms.push('IMMINENT_VOLKMANN_CONTRACTURE');
  }
  if (rhabdomyolysisSeverity === 'SEVERE_AKI_RISK') {
    activeAlarms.push('RHABDOMYOLYSIS_MYOGLOBINURIA');
  }
  if (compartments.some(c => c.nerveSensoryExam !== 'INTACT')) {
    activeAlarms.push('NEUROVASCULAR_DEFICIT_DPN');
  }
  if (activeAlarms.length === 0) {
    activeAlarms.push('OPTIMAL');
  }

  // Clinical Recommendation
  let clinicalRecommendation = 'Compartment perfusion is adequate. Continue serial examinations.';
  if (fasciotomyIndicated) {
    if (region === 'LOWER_LEG_4_COMPARTMENT') {
      clinicalRecommendation = 'EMERGENCY: Acute Compartment Syndrome confirmed (Delta P <= 30 mmHg). Perform emergent 2-incision 4-compartment fasciotomy immediately. DO NOT ELEVATE LIMB.';
    } else {
      clinicalRecommendation = 'EMERGENCY: Forearm Compartment Syndrome. Emergent volar curved fasciotomy to release lacertus fibrosus and carpal tunnel to avert permanent Volkmann contracture.';
    }
  } else if (completeDecompressionAchieved) {
    clinicalRecommendation = 'SUCCESSFUL DECOMPRESSION: Pressures normalized post-fasciotomy. Pack wounds open; return for second-look debridement at 48 hours.';
  }

  return {
    region,
    injuryMechanism: ORTHOPEDIC_PRESETS[presetId].injuryMechanism,
    compartments,
    worstDeltaPMmHg,
    worstAbsoluteIcpMmHg,
    acsDiagnosed,
    fasciotomyIndicated,
    fasciotomyState: {
      anterolateralIncisionDone: anterolateralIncision,
      posteromedialIncisionDone: posteromedialIncision,
      volarFasciotomyDone: volarIncision,
      completeDecompressionAchieved,
      ischemiaDurationHours: hoursSinceInjury,
      muscleViability,
      postOpIcpDropMmHg: completeDecompressionAchieved ? 35 : 0,
    },
    rhabdomyolysisSeverity,
    activeAlarms,
    clinicalRecommendation,
  };
}
