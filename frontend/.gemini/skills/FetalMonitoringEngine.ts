/**
 * FetalMonitoringEngine.ts
 * Mediverse — Obstetrics & Cardiotocography (CTG) Biophysical Engine
 *
 * Models:
 * - FHR Baseline (Normal 110–160 bpm, Bradycardia <110, Tachycardia >160)
 * - Baseline Variability (Absent 0, Minimal <=5, Moderate 6–25, Marked >25 bpm)
 * - Accelerations (>=15 bpm for >=15s after 32w; >=10 bpm for >=10s <32w)
 * - Decelerations:
 *   • Early (Head compression — mirrors uterine contraction peak, benign)
 *   • Late (Uteroplacental insufficiency — nadir after contraction peak, non-reassuring)
 *   • Variable (Cord compression — abrupt drop >=15 bpm lasting 15s to 2min, 'shoulders')
 *   • Prolonged (>=15 bpm drop lasting 2–10 min; >10 min = baseline change)
 *   • Sinusoidal (Severe fetal anemia / Rh isoimmunization / fetomaternal hemorrhage)
 * - Uterine Contraction Activity (Montevideo Units MVU, Tachysystole >5 in 10 min)
 * - NICHD 3-Tier FHR Interpretation System (Category I, II, III)
 * - Intrauterine Resuscitation Protocol (Reposition, O2, IV bolus, stop oxytocin, tocolysis)
 * - Modified Bishop Score (Dilation, effacement, station, consistency, position)
 * - Shoulder Dystocia HELPERR Protocol
 */

// ─── Enums & Types ────────────────────────────────────────────────────────────

export type NICHDTier = 'CATEGORY_I' | 'CATEGORY_II' | 'CATEGORY_III';

export type VariabilityType = 'ABSENT' | 'MINIMAL' | 'MODERATE' | 'MARKED';

export type DecelerationType =
  | 'NONE'
  | 'EARLY'
  | 'LATE'
  | 'VARIABLE'
  | 'PROLONGED'
  | 'SINUSOIDAL';

export type CTGAlarm =
  | 'OPTIMAL'
  | 'FETAL_BRADYCARDIA'
  | 'FETAL_TACHYCARDIA'
  | 'ABSENT_VARIABILITY'
  | 'MINIMAL_VARIABILITY'
  | 'RECURRENT_LATE_DECELS'
  | 'RECURRENT_VARIABLE_DECELS'
  | 'PROLONGED_DECELERATION'
  | 'SINUSOIDAL_PATTERN'
  | 'UTERINE_TACHYSYSTOLE'
  | 'CATEGORY_III_EMERGENCY'
  | 'SHOULDER_DYSTOCIA_WARNING';

export type PresetId =
  | 'NORMAL_CATEGORY_I'
  | 'EARLY_DECELS_HEAD_COMPRESSION'
  | 'RECURRENT_LATE_DECELS_PLACENTAL_INSUFFICIENCY'
  | 'VARIABLE_DECELS_CORD_COMPRESSION'
  | 'TACHYSYSTOLE_HYPERSTIMULATION'
  | 'SINUSOIDAL_FETAL_ANEMIA';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface CTGDataPoint {
  timeSeconds: number;
  fhrBpm: number;
  uterineActivityMmHg: number; // 0–100 mmHg toco
}

export interface BishopScoreComponents {
  dilationCm: number; // 0–10 cm (0 pts: 0, 1 pt: 1-2, 2 pts: 3-4, 3 pts: >=5)
  effacementPct: number; // 0–100% (0 pts: 0-30%, 1 pt: 40-50%, 2 pts: 60-70%, 3 pts: >=80%)
  station: number; // -3 to +3 (0 pts: -3, 1 pt: -2, 2 pts: -1/0, 3 pts: +1/+2)
  consistency: 'FIRM' | 'MEDIUM' | 'SOFT'; // 0 pts: Firm, 1 pt: Medium, 2 pts: Soft
  position: 'POSTERIOR' | 'MID' | 'ANTERIOR'; // 0 pts: Post, 1 pt: Mid, 2 pts: Ant
}

export interface FetalMonitoringInputParams {
  baselineFhrBpm: number; // 90–190 bpm
  variability: VariabilityType;
  decelerationType: DecelerationType;
  hasAccelerations: boolean;
  contractionsPer10Min: number; // 1–8
  contractionPeakMmHg: number; // 30–90 mmHg
  fetalScalpPh: number; // 7.15–7.35
  maternalPosition: 'SUPINE' | 'LEFT_LATERAL' | 'RIGHT_LATERAL' | 'HANDS_KNEES';
  ivFluidsActive: boolean;
  maternalO2Active: boolean;
  oxytocinRateMilliunitsMin: number; // 0–30 mU/min
  tocolysisGiven: boolean; // Terbutaline 0.25mg SC
  gestationalWeeks: number; // 24–42
  bishopDilation: number; // 0–10
  bishopEffacement: number; // 0–100
  bishopStation: number; // -3 to +3
  bishopConsistency: 'FIRM' | 'MEDIUM' | 'SOFT';
  bishopPosition: 'POSTERIOR' | 'MID' | 'ANTERIOR';
}

export interface FetalMonitoringState {
  baselineFhrBpm: number;
  variability: VariabilityType;
  variabilityBpmRange: number;
  decelerationType: DecelerationType;
  hasAccelerations: boolean;
  nichdCategory: NICHDTier;
  contractionsPer10Min: number;
  contractionIntensityMmHg: number;
  montevideoUnitsMVU: number; // sum of contraction amplitudes in 10 min (target 200–250 MVU)
  uterineTachysystole: boolean; // >5 contractions in 10 min averaged over 30 min
  fetalScalpPh: number;
  fetalAcidemiaRisk: 'LOW' | 'INTERMEDIATE' | 'HIGH' | 'CRITICAL';
  bishopScore: number; // 0–13 (>8 favorable, <6 unfavorable)
  bishopInductionFavorable: boolean;
  intrauterineResuscitationActive: boolean;
  cordProlapseRisk: boolean;
  activeAlarms: CTGAlarm[];
  timeSeriesData: CTGDataPoint[];
}

export interface PresetInfo {
  id: PresetId;
  title: string;
  description: string;
  category: NICHDTier;
  clinicalPearls: string;
  initialState: Partial<FetalMonitoringInputParams>;
}

// ─── Preset Catalog ──────────────────────────────────────────────────────────

export const CTG_PRESETS: Record<PresetId, PresetInfo> = {
  NORMAL_CATEGORY_I: {
    id: 'NORMAL_CATEGORY_I',
    title: 'Category I — Normal Reassuring Tracing',
    description: 'Baseline 135 bpm, moderate variability (6–25 bpm), spontaneous accelerations present, no late or variable decelerations. Strongly predictive of normal fetal umbilical cord arterial pH.',
    category: 'CATEGORY_I',
    clinicalPearls: 'Category I tracings require no specific intrapartum intervention. Continue routine continuous or intermittent fetal monitoring.',
    initialState: {
      baselineFhrBpm: 135,
      variability: 'MODERATE',
      decelerationType: 'NONE',
      hasAccelerations: true,
      contractionsPer10Min: 3,
      contractionPeakMmHg: 55,
      fetalScalpPh: 7.32,
      oxytocinRateMilliunitsMin: 4,
    },
  },
  EARLY_DECELS_HEAD_COMPRESSION: {
    id: 'EARLY_DECELS_HEAD_COMPRESSION',
    title: 'Early Decelerations — Fetal Head Compression',
    description: 'Symmetric, gradual decrease and return of FHR matching contraction contour. The nadir aligns synchronously with contraction acme. Caused by vagal stimulation from head compression during active labor.',
    category: 'CATEGORY_I',
    clinicalPearls: 'Benign finding. Does NOT reflect hypoxia or acidemia. Assess cervix for rapid cervical dilation or fetal descent.',
    initialState: {
      baselineFhrBpm: 140,
      variability: 'MODERATE',
      decelerationType: 'EARLY',
      hasAccelerations: true,
      contractionsPer10Min: 4,
      contractionPeakMmHg: 65,
      fetalScalpPh: 7.30,
      bishopDilation: 8,
      bishopEffacement: 90,
      bishopStation: 1,
    },
  },
  RECURRENT_LATE_DECELS_PLACENTAL_INSUFFICIENCY: {
    id: 'RECURRENT_LATE_DECELS_PLACENTAL_INSUFFICIENCY',
    title: 'Recurrent Late Decelerations — Uteroplacental Insufficiency',
    description: 'Gradual FHR deceleration with nadir occurring AFTER the contraction peak. Minimal variability. Caused by transient hypoxemia from reduced intervillous blood flow (preeclampsia, abruption, or post-dates).',
    category: 'CATEGORY_II',
    clinicalPearls: 'Requires immediate Intrauterine Resuscitation: Left lateral tilt, 1000 mL crystalloid bolus, discontinue Pitocin, supplemental O2 if hypoxic. Prepare for urgent cesarean delivery if refractory.',
    initialState: {
      baselineFhrBpm: 145,
      variability: 'MINIMAL',
      decelerationType: 'LATE',
      hasAccelerations: false,
      contractionsPer10Min: 4,
      contractionPeakMmHg: 60,
      fetalScalpPh: 7.22,
      oxytocinRateMilliunitsMin: 12,
    },
  },
  VARIABLE_DECELS_CORD_COMPRESSION: {
    id: 'VARIABLE_DECELS_CORD_COMPRESSION',
    title: 'Severe Variable Decelerations — Umbilical Cord Compression',
    description: 'Abrupt decrease in FHR (<30 sec onset to nadir) >=15 bpm lasting >=15 sec, with preceding and following shoulders. Oligohydramnios or nuchal cord. Deep nadir <70 bpm lasting >60s.',
    category: 'CATEGORY_II',
    clinicalPearls: 'Reposition mother (left lateral or knee-chest). Rule out occult cord prolapse with sterile vaginal exam. Amnioinfusion can relieve recurrent cord compression.',
    initialState: {
      baselineFhrBpm: 130,
      variability: 'MODERATE',
      decelerationType: 'VARIABLE',
      hasAccelerations: false,
      contractionsPer10Min: 4,
      contractionPeakMmHg: 70,
      fetalScalpPh: 7.26,
      oxytocinRateMilliunitsMin: 6,
    },
  },
  TACHYSYSTOLE_HYPERSTIMULATION: {
    id: 'TACHYSYSTOLE_HYPERSTIMULATION',
    title: 'Uterine Tachysystole from Oxytocin Hyperstimulation',
    description: 'More than 5 contractions in 10 minutes (6/10 min) causing MVU >350. Prevents placental intervillous reperfusion during relaxation phases, precipitating prolonged decelerations.',
    category: 'CATEGORY_II',
    clinicalPearls: 'Immediately STOP oxytocin infusion. Administer 500 mL IV fluid bolus. If hyperstimulation persists with FHR decelerations, give Terbutaline 0.25 mg subcutaneously.',
    initialState: {
      baselineFhrBpm: 155,
      variability: 'MINIMAL',
      decelerationType: 'PROLONGED',
      hasAccelerations: false,
      contractionsPer10Min: 7,
      contractionPeakMmHg: 75,
      oxytocinRateMilliunitsMin: 22,
      fetalScalpPh: 7.20,
    },
  },
  SINUSOIDAL_FETAL_ANEMIA: {
    id: 'SINUSOIDAL_FETAL_ANEMIA',
    title: 'Category III — Sinusoidal Pattern (Severe Fetal Anemia)',
    description: 'Smooth, undulating sine wave-like undulating baseline with cycle frequency of 3–5 cycles/min lasting >=20 minutes, with absent baseline variability. Indicates critical fetal anemia, severe fetomaternal hemorrhage, or twin-twin transfusion.',
    category: 'CATEGORY_III',
    clinicalPearls: 'Category III is an obstetric EMERGENCY. Highly predictive of abnormal fetal acid-base balance at birth. Immediate bedside ultrasound (MCA peak systolic velocity >1.5 MoM), emergent delivery, and neonatal resuscitation setup.',
    initialState: {
      baselineFhrBpm: 140,
      variability: 'ABSENT',
      decelerationType: 'SINUSOIDAL',
      hasAccelerations: false,
      contractionsPer10Min: 2,
      contractionPeakMmHg: 40,
      fetalScalpPh: 7.16,
    },
  },
};

export const FETAL_MONITORING_PRESETS = CTG_PRESETS;

// ─── Bishop Score Calculator ──────────────────────────────────────────────────

export function calculateBishopScore(b: BishopScoreComponents): number {
  let score = 0;

  // Dilation
  if (b.dilationCm === 0) score += 0;
  else if (b.dilationCm <= 2) score += 1;
  else if (b.dilationCm <= 4) score += 2;
  else score += 3;

  // Effacement
  if (b.effacementPct <= 30) score += 0;
  else if (b.effacementPct <= 50) score += 1;
  else if (b.effacementPct <= 70) score += 2;
  else score += 3;

  // Station
  if (b.station <= -3) score += 0;
  else if (b.station === -2) score += 1;
  else if (b.station <= 0) score += 2;
  else score += 3;

  // Consistency
  if (b.consistency === 'FIRM') score += 0;
  else if (b.consistency === 'MEDIUM') score += 1;
  else score += 2;

  // Position
  if (b.position === 'POSTERIOR') score += 0;
  else if (b.position === 'MID') score += 1;
  else score += 2;

  return score;
}

// ─── CTG Trace Generator ──────────────────────────────────────────────────────

export function generateCTGTimeSeries(
  baseline: number,
  variability: VariabilityType,
  decelType: DecelerationType,
  contractionsPer10Min: number,
  peakMmHg: number,
  hasAccel: boolean
): CTGDataPoint[] {
  const points: CTGDataPoint[] = [];
  const durationSeconds = 600; // 10 minutes trace
  const stepSeconds = 2;

  const varAmp = variability === 'ABSENT' ? 0.8 : variability === 'MINIMAL' ? 3.5 : variability === 'MODERATE' ? 12 : 28;
  const contractionInterval = 600 / Math.max(1, contractionsPer10Min);
  const contractionDuration = 60; // 60s bell curve

  for (let t = 0; t <= durationSeconds; t += stepSeconds) {
    // 1. Uterine contraction toco
    const timeInCycle = t % contractionInterval;
    let toco = 12; // resting tone ~10-15 mmHg
    let contractionActive = false;
    let contractionPhase = 0; // 0 to 1 through contraction

    if (timeInCycle < contractionDuration) {
      contractionActive = true;
      contractionPhase = timeInCycle / contractionDuration;
      // Bell curve: sin^2 (pi * phase)
      const shape = Math.pow(Math.sin(Math.PI * contractionPhase), 2);
      toco = 12 + (peakMmHg - 12) * shape;
    }

    // 2. FHR generation
    // Baseline noise / variability
    const noise = (Math.sin(t * 0.4) * 0.5 + Math.cos(t * 1.3) * 0.3 + (Math.random() - 0.5) * 0.5) * varAmp;
    let fhr = baseline + noise;

    // Sinusoidal waveform override
    if (decelType === 'SINUSOIDAL') {
      const sinWave = Math.sin((t / 60) * (4 * 2 * Math.PI)) * 10; // ~4 cycles per minute, 10 bpm amp
      fhr = baseline + sinWave;
    } else {
      // Accelerations (random or periodic)
      if (hasAccel && (t % 180 < 30) && !contractionActive) {
        const accelShape = Math.sin((Math.PI * (t % 180)) / 30);
        fhr += 20 * accelShape;
      }

      // Decelerations coupled with contractions
      if (contractionActive) {
        if (decelType === 'EARLY') {
          // Early decel: mirrors contraction synchronously (nadir = peak)
          const decelDepth = 25 * Math.pow(Math.sin(Math.PI * contractionPhase), 2);
          fhr -= decelDepth;
        } else if (decelType === 'LATE') {
          // Late decel: lag behind contraction (nadir is at phase 0.75-0.9)
          const latePhase = Math.max(0, Math.min(1, (contractionPhase - 0.25) / 0.75));
          const decelDepth = 35 * Math.pow(Math.sin(Math.PI * latePhase), 2);
          fhr -= decelDepth;
        } else if (decelType === 'VARIABLE') {
          // Variable decel: abrupt drop with shoulders
          if (contractionPhase < 0.15 || contractionPhase > 0.85) {
            fhr += 10; // Pre/post deceleration shoulders
          } else {
            // Abrupt drop
            const varPhase = (contractionPhase - 0.15) / 0.7;
            const drop = 55 * Math.sin(Math.PI * varPhase);
            fhr -= drop;
          }
        } else if (decelType === 'PROLONGED') {
          // Sustained drop >=15 bpm lasting >=2 min
          fhr -= 40;
        }
      }
    }

    points.push({
      timeSeconds: t,
      fhrBpm: Math.round(Math.max(60, Math.min(210, fhr))),
      uterineActivityMmHg: Math.round(toco),
    });
  }

  return points;
}

// ─── NICHD Classification Solver ──────────────────────────────────────────────

export function classifyNICHD(
  baseline: number,
  variability: VariabilityType,
  decelType: DecelerationType,
  hasAccelerations: boolean
): NICHDTier {
  // Category III:
  // 1. Absent baseline FHR variability AND any of:
  //    - Recurrent late decelerations
  //    - Recurrent variable decelerations
  //    - Bradycardia (<110)
  // 2. Sinusoidal pattern
  if (decelType === 'SINUSOIDAL') {
    return 'CATEGORY_III';
  }
  if (variability === 'ABSENT') {
    if (decelType === 'LATE' || decelType === 'VARIABLE' || baseline < 110) {
      return 'CATEGORY_III';
    }
  }

  // Category I:
  // - Baseline rate: 110–160 bpm
  // - Baseline FHR variability: moderate
  // - Late or variable decelerations: absent
  // - Early decelerations: present or absent
  // - Accelerations: present or absent
  if (
    baseline >= 110 &&
    baseline <= 160 &&
    variability === 'MODERATE' &&
    (decelType === 'NONE' || decelType === 'EARLY')
  ) {
    return 'CATEGORY_I';
  }

  // Category II: All other tracings not categorized as I or III (indeterminate)
  return 'CATEGORY_II';
}

// ─── Biophysical Solver ───────────────────────────────────────────────────────

export function computeFetalMonitoringState(params: FetalMonitoringInputParams): FetalMonitoringState {
  let {
    baselineFhrBpm,
    variability,
    decelerationType,
    hasAccelerations,
    contractionsPer10Min,
    contractionPeakMmHg,
    fetalScalpPh,
    maternalPosition,
    ivFluidsActive,
    maternalO2Active,
    oxytocinRateMilliunitsMin,
    tocolysisGiven,
    bishopDilation,
    bishopEffacement,
    bishopStation,
    bishopConsistency,
    bishopPosition,
  } = params;

  // Intrauterine resuscitation attenuates pathology
  if (tocolysisGiven || oxytocinRateMilliunitsMin === 0) {
    if (contractionsPer10Min > 5) contractionsPer10Min = Math.max(3, contractionsPer10Min - 2);
  }
  if (maternalPosition === 'LEFT_LATERAL' && decelerationType === 'LATE') {
    // Left lateral tilt improves uteroplacental perfusion
    fetalScalpPh = Math.min(7.35, fetalScalpPh + 0.03);
  }
  if (ivFluidsActive) {
    fetalScalpPh = Math.min(7.35, fetalScalpPh + 0.02);
  }

  const uterineTachysystole = contractionsPer10Min > 5;
  const montevideoUnitsMVU = Math.round(contractionsPer10Min * (contractionPeakMmHg - 12));

  const nichdCategory = classifyNICHD(baselineFhrBpm, variability, decelerationType, hasAccelerations);

  const variabilityBpmRange =
    variability === 'ABSENT' ? 0 : variability === 'MINIMAL' ? 4 : variability === 'MODERATE' ? 15 : 30;

  // Acidemia risk based on scalp pH and category
  let fetalAcidemiaRisk: 'LOW' | 'INTERMEDIATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (fetalScalpPh < 7.20 || nichdCategory === 'CATEGORY_III') fetalAcidemiaRisk = 'CRITICAL';
  else if (fetalScalpPh < 7.25 || decelerationType === 'LATE') fetalAcidemiaRisk = 'HIGH';
  else if (nichdCategory === 'CATEGORY_II') fetalAcidemiaRisk = 'INTERMEDIATE';

  // Bishop Score
  const bishopScore = calculateBishopScore({
    dilationCm: bishopDilation,
    effacementPct: bishopEffacement,
    station: bishopStation,
    consistency: bishopConsistency,
    position: bishopPosition,
  });
  const bishopInductionFavorable = bishopScore >= 8;

  // Alarms
  const activeAlarms: CTGAlarm[] = [];
  if (baselineFhrBpm < 110) activeAlarms.push('FETAL_BRADYCARDIA');
  if (baselineFhrBpm > 160) activeAlarms.push('FETAL_TACHYCARDIA');
  if (variability === 'ABSENT') activeAlarms.push('ABSENT_VARIABILITY');
  if (variability === 'MINIMAL') activeAlarms.push('MINIMAL_VARIABILITY');
  if (decelerationType === 'LATE') activeAlarms.push('RECURRENT_LATE_DECELS');
  if (decelerationType === 'VARIABLE') activeAlarms.push('RECURRENT_VARIABLE_DECELS');
  if (decelerationType === 'PROLONGED') activeAlarms.push('PROLONGED_DECELERATION');
  if (decelerationType === 'SINUSOIDAL') activeAlarms.push('SINUSOIDAL_PATTERN');
  if (uterineTachysystole) activeAlarms.push('UTERINE_TACHYSYSTOLE');
  if (nichdCategory === 'CATEGORY_III') activeAlarms.push('CATEGORY_III_EMERGENCY');
  if (bishopStation >= 2 && bishopDilation === 10) activeAlarms.push('SHOULDER_DYSTOCIA_WARNING');
  if (activeAlarms.length === 0) activeAlarms.push('OPTIMAL');

  // Generate 10-min CTG wave
  const timeSeriesData = generateCTGTimeSeries(
    baselineFhrBpm,
    variability,
    decelerationType,
    contractionsPer10Min,
    contractionPeakMmHg,
    hasAccelerations
  );

  return {
    baselineFhrBpm,
    variability,
    variabilityBpmRange,
    decelerationType,
    hasAccelerations,
    nichdCategory,
    contractionsPer10Min,
    contractionIntensityMmHg: contractionPeakMmHg,
    montevideoUnitsMVU,
    uterineTachysystole,
    fetalScalpPh: parseFloat(fetalScalpPh.toFixed(2)),
    fetalAcidemiaRisk,
    bishopScore,
    bishopInductionFavorable,
    intrauterineResuscitationActive: maternalPosition === 'LEFT_LATERAL' && ivFluidsActive && maternalO2Active,
    cordProlapseRisk: decelerationType === 'VARIABLE' && bishopStation < 0,
    activeAlarms,
    timeSeriesData,
  };
}
