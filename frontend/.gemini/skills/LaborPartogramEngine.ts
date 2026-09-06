/**
 * LaborPartogramEngine.ts
 * Biophysical simulation engine for WHO Labor Care Guide, Modified WHO Partogram,
 * Calder Modified Bishop Score for Pre-induction Cervical Ripening, Uterine Contraction Dynamics,
 * Tachysystole Resuscitation, and Abnormal Labor Progression Diagnostics.
 *
 * Location: frontend/.gemini/skills/LaborPartogramEngine.ts
 */

export type CervicalConsistency = 'FIRM' | 'MEDIUM' | 'SOFT';
export type CervicalPosition = 'POSTERIOR' | 'MID_POSITION' | 'ANTERIOR';
export type AmnioticFluidStatus = 'INTACT' | 'CLEAR' | 'MECONIUM_STAINED' | 'BLOOD_STAINED' | 'ABSENT';
export type HeadMoldingGrade = 'NONE' | 'GRADE_1_TOUCHING' | 'GRADE_2_REDUCIBLE' | 'GRADE_3_IRREDUCIBLE';
export type LaborPhase = 'LATENT_PHASE' | 'ACTIVE_FIRST_STAGE' | 'SECOND_STAGE' | 'THIRD_STAGE';

export type LaborProgressionDisorder =
  | 'NORMAL_PROGRESS'
  | 'PROTRACTED_ACTIVE_PHASE'
  | 'ARREST_OF_DILATATION'
  | 'PROTRACTED_DESCENT'
  | 'ARREST_OF_DESCENT_CPD'
  | 'PRECIPITOUS_LABOR'
  | 'FAILED_INDUCTION_OF_LABOR';

export interface BishopScoreComponents {
  dilatationCm: number; // 0 to 10 cm
  effacementPct: number; // 0% to 100%
  stationFifth: number; // -3 to +3 (or -5 to +5)
  consistency: CervicalConsistency;
  position: CervicalPosition;
}

export interface UterineContractionProfile {
  frequencyPer10Min: number; // 1 to 8
  durationSeconds: number; // 10 to 80
  intensityMmhg: number; // montevideo/IUPC 20 to 80 mmHg
  oxytocinInfusionRateMuMin: number; // 0 to 40 mU/min
}

export interface PartogramHourPoint {
  hour: number; // 0 to 12
  cervicalDilatationCm: number;
  alertLineCm: number;
  actionLineCm: number;
  fetalHeadStation: number; // -3 to +3
  contractionsPer10Min: number;
  contractionDurationSec: number;
  fetalHeartRateBpm: number;
  maternalPulseBpm: number;
  systolicBp: number;
  diastolicBp: number;
}

export interface LaborPartogramInputParams {
  presetId: LaborPresetId;
  parity: 'NULLIPARA' | 'MULTIPARA';
  gestationalAgeWeeks: number;
  currentHour: number; // current elapsed hour of active labor
  bishop: BishopScoreComponents;
  uterineContractions: UterineContractionProfile;
  fetalHeadMolding: HeadMoldingGrade;
  caputSuccedaneumScale: number; // 0 to 3
  amnioticFluid: AmnioticFluidStatus;
  hoursRupturedMembranes: number;
  maternalTemperatureCelsius: number;
  fetalHeartRateBaselineBpm: number;
  hasEpiduralAnalgesia: boolean;
  dilatationHistory: { hour: number; dilatationCm: number; station: number }[];
}

export interface LaborPartogramState {
  // 1. Bishop Score
  bishopScore: number;
  isCervixFavorable: boolean;
  bishopInterpretation: string;
  recommendedRipeningAgent: string;

  // 2. Partogram Progress
  currentDilatationCm: number;
  currentStation: number;
  dilatationRateCmPerHour: number;
  isAlertLineCrossed: boolean;
  isActionLineCrossed: boolean;
  laborProgressionStatus: LaborProgressionDisorder;
  montevideoUnits: number; // contractions/10min * peak pressure mmHg (adequate > 200)

  // 3. Uterine Tachysystole & Hyperstimulation
  isTachysystole: boolean; // > 5 contractions in 10 minutes
  isHypertonusTetanic: boolean; // duration > 60s or intensity > 60 mmHg
  isChorioamnionitisSuspected: boolean; // Temp >= 38.0 + tachycardia / foul fluid
  isCephalopelvicDisproportion: boolean; // Arrest of descent + Grade 2/3 molding + high caput

  // 4. Timeline
  timeline: PartogramHourPoint[];

  // 5. Alarms & Clinical Guidance
  activeAlarms: string[];
  clinicalGuidance: string;
  intrauterineResuscitationRequired: boolean;
}

export type LaborPresetId =
  | 'NORMAL_ACTIVE_LABOR_FAVORABLE'
  | 'UNFAVORABLE_CERVIX_BISHOP_3_INDUCTION'
  | 'PROTRACTED_ACTIVE_PHASE_ALERT_LINE_CROSSED'
  | 'ARREST_OF_DILATATION_ACTION_LINE'
  | 'CEPHALOPELVIC_DISPROPORTION_CPD_ARREST_DESCENT'
  | 'OXYTOCIN_INDUCED_TACHYSYSTOLE_HYPERSTIMULATION'
  | 'CHORIOAMNIONITIS_PROLONGED_RUPTURE'
  | 'PRECIPITOUS_LABOR_MULTIPARA';

/**
 * 1. Calculate Modified Bishop Score (0 to 13)
 */
export function calculateBishopScore(bishop: BishopScoreComponents): {
  score: number;
  dilatationPoints: number;
  effacementPoints: number;
  stationPoints: number;
  consistencyPoints: number;
  positionPoints: number;
  isFavorable: boolean;
} {
  // Dilatation (cm): 0: <1 cm (0 pt), 1-2 cm (1 pt), 3-4 cm (2 pt), >=5 cm (3 pt)
  let dilatationPoints = 0;
  if (bishop.dilatationCm >= 5) dilatationPoints = 3;
  else if (bishop.dilatationCm >= 3) dilatationPoints = 2;
  else if (bishop.dilatationCm >= 1) dilatationPoints = 1;

  // Effacement (%): 0-30% (0 pt), 40-50% (1 pt), 60-70% (2 pt), >=80% (3 pt)
  let effacementPoints = 0;
  if (bishop.effacementPct >= 80) effacementPoints = 3;
  else if (bishop.effacementPct >= 60) effacementPoints = 2;
  else if (bishop.effacementPct >= 40) effacementPoints = 1;

  // Station: -3 (0 pt), -2 (1 pt), -1 or 0 (2 pt), +1 or +2 (3 pt)
  let stationPoints = 0;
  if (bishop.stationFifth >= 1) stationPoints = 3;
  else if (bishop.stationFifth >= -1) stationPoints = 2;
  else if (bishop.stationFifth >= -2) stationPoints = 1;

  // Consistency: Firm (0 pt), Medium (1 pt), Soft (2 pt)
  let consistencyPoints = 0;
  if (bishop.consistency === 'SOFT') consistencyPoints = 2;
  else if (bishop.consistency === 'MEDIUM') consistencyPoints = 1;

  // Position: Posterior (0 pt), Mid-position (1 pt), Anterior (2 pt)
  let positionPoints = 0;
  if (bishop.position === 'ANTERIOR') positionPoints = 2;
  else if (bishop.position === 'MID_POSITION') positionPoints = 1;

  const score =
    dilatationPoints +
    effacementPoints +
    stationPoints +
    consistencyPoints +
    positionPoints;

  return {
    score,
    dilatationPoints,
    effacementPoints,
    stationPoints,
    consistencyPoints,
    positionPoints,
    isFavorable: score >= 8,
  };
}

/**
 * 2. WHO Alert & Action Line Computation
 * In standard WHO partogram:
 * - Active phase begins at 4 cm (or 5 cm in newer guidelines, classic WHO partogram starts at 4 cm).
 * - Alert line starts at 4 cm at hour 0, slopes at 1 cm/hour to 10 cm at hour 6.
 * - Action line is parallel to Alert line, displaced 4 hours to the right (starts at 4 cm at hour 4, reaches 10 cm at hour 10).
 */
export function calculateAlertActionLines(hour: number): { alertLineCm: number; actionLineCm: number } {
  // Alert line: 4 + hour * 1.0, clamped to 10
  const alertLineCm = Math.min(10, Math.max(4, 4 + hour * 1.0));

  // Action line: 4 hours delay
  let actionLineCm = 4;
  if (hour < 4) {
    actionLineCm = 4;
  } else {
    actionLineCm = Math.min(10, 4 + (hour - 4) * 1.0);
  }

  return { alertLineCm, actionLineCm };
}

/**
 * 3. Montevideo Units (MVU)
 * MVUs = (Frequency of contractions per 10 minutes) * (Average contraction intensity above basal tonus in mmHg)
 * Normal active labor: 200 - 250 MVUs. Hypocontractility: < 200 MVUs.
 */
export function calculateMontevideoUnits(frequency: number, intensityMmhg: number): number {
  return Math.round(frequency * intensityMmhg);
}

/**
 * 4. Main Simulation & Diagnostic State Calculation
 */
export function computeLaborPartogramState(params: LaborPartogramInputParams): LaborPartogramState {
  const {
    bishop,
    uterineContractions,
    fetalHeadMolding,
    caputSuccedaneumScale,
    amnioticFluid,
    hoursRupturedMembranes,
    maternalTemperatureCelsius,
    fetalHeartRateBaselineBpm,
    dilatationHistory,
    currentHour,
    parity,
  } = params;

  // 1. Bishop Score
  const { score: bishopScore, isFavorable: isCervixFavorable } = calculateBishopScore(bishop);

  let bishopInterpretation = 'Unfavorable cervix (Score <= 6): High failure rate if immediate oxytocin. Requires pre-induction cervical ripening.';
  let recommendedRipeningAgent = 'Dinoprostone (PGE2) 10mg vaginal insert, Misoprostol (PGE1) 25mcg q4h, or Transcervical Foley 30-50mL Balloon.';
  if (bishopScore >= 8) {
    bishopInterpretation = 'Favorable cervix (Score >= 8): Successful induction rate comparable to spontaneous labor. Suitable for Amniotomy + IV Oxytocin.';
    recommendedRipeningAgent = 'Artificial Rupture of Membranes (ARM) + IV Oxytocin titration (low-dose protocol 1-2 mU/min).';
  } else if (bishopScore === 7) {
    bishopInterpretation = 'Intermediate cervix (Score 7): Individualized ripening vs low-dose oxytocin based on parity and clinical urgency.';
    recommendedRipeningAgent = 'Mechanical Foley balloon catheter or single low-dose prostaglandin application.';
  }

  // 2. Timeline Generation
  const timeline: PartogramHourPoint[] = [];
  const maxHour = Math.max(8, currentHour + 2);

  for (let h = 0; h <= maxHour; h++) {
    const { alertLineCm, actionLineCm } = calculateAlertActionLines(h);

    // Find actual or extrapolated dilatation
    const historyEntry = dilatationHistory.find((pt) => pt.hour === h);
    let histDilat = 4;
    let histStation = -2;

    if (historyEntry) {
      histDilat = historyEntry.dilatationCm;
      histStation = historyEntry.station;
    } else if (h <= currentHour) {
      histDilat = bishop.dilatationCm;
      histStation = bishop.stationFifth;
    } else {
      histDilat = Math.min(10, bishop.dilatationCm + (h - currentHour) * 0.5);
      histStation = Math.min(3, bishop.stationFifth + (h - currentHour) * 0.5);
    }

    timeline.push({
      hour: h,
      cervicalDilatationCm: histDilat,
      alertLineCm,
      actionLineCm,
      fetalHeadStation: histStation,
      contractionsPer10Min: uterineContractions.frequencyPer10Min,
      contractionDurationSec: uterineContractions.durationSeconds,
      fetalHeartRateBpm: fetalHeartRateBaselineBpm,
      maternalPulseBpm: 84 + (maternalTemperatureCelsius > 37.5 ? 20 : 0),
      systolicBp: 120,
      diastolicBp: 78,
    });
  }

  // 3. Current Dilatation & Progression Rate
  const currentDilatationCm = bishop.dilatationCm;
  const currentStation = bishop.stationFifth;

  let dilatationRateCmPerHour = 1.0;
  if (dilatationHistory.length >= 2) {
    const sorted = [...dilatationHistory].sort((a, b) => a.hour - b.hour);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const deltaH = Math.max(1, last.hour - first.hour);
    dilatationRateCmPerHour = parseFloat(((last.dilatationCm - first.dilatationCm) / deltaH).toFixed(2));
  }

  const { alertLineCm: curAlert, actionLineCm: curAction } = calculateAlertActionLines(currentHour);
  const isAlertLineCrossed = currentHour >= 1 && currentDilatationCm < curAlert;
  const isActionLineCrossed = currentHour >= 4 && currentDilatationCm <= curAction;

  // 4. Montevideo Units
  const montevideoUnits = calculateMontevideoUnits(
    uterineContractions.frequencyPer10Min,
    uterineContractions.intensityMmhg
  );

  // 5. Tachysystole & Hypertonus
  const isTachysystole = uterineContractions.frequencyPer10Min >= 6;
  const isHypertonusTetanic = uterineContractions.durationSeconds >= 70 || uterineContractions.intensityMmhg >= 65;

  // 6. Chorioamnionitis
  const isChorioamnionitisSuspected =
    maternalTemperatureCelsius >= 38.0 ||
    (hoursRupturedMembranes >= 18 && fetalHeartRateBaselineBpm >= 165);

  // 7. Cephalopelvic Disproportion (CPD)
  const isCephalopelvicDisproportion =
    fetalHeadMolding === 'GRADE_3_IRREDUCIBLE' ||
    (fetalHeadMolding === 'GRADE_2_REDUCIBLE' && caputSuccedaneumScale >= 3 && currentStation <= 0 && currentDilatationCm >= 8);

  // 8. Labor Progression Classification
  let laborProgressionStatus: LaborProgressionDisorder = 'NORMAL_PROGRESS';

  if (isCephalopelvicDisproportion) {
    laborProgressionStatus = 'ARREST_OF_DESCENT_CPD';
  } else if (isActionLineCrossed) {
    laborProgressionStatus = 'ARREST_OF_DILATATION';
  } else if (isAlertLineCrossed || dilatationRateCmPerHour < (parity === 'NULLIPARA' ? 1.0 : 1.2)) {
    laborProgressionStatus = 'PROTRACTED_ACTIVE_PHASE';
  } else if (dilatationRateCmPerHour >= 3.5 && currentHour <= 3) {
    laborProgressionStatus = 'PRECIPITOUS_LABOR';
  } else if (currentHour >= 12 && bishopScore < 6) {
    laborProgressionStatus = 'FAILED_INDUCTION_OF_LABOR';
  }

  // 9. Active Alarms
  const activeAlarms: string[] = [];

  if (isTachysystole) {
    activeAlarms.push('UTERINE_TACHYSYSTOLE_HYPERSTIMULATION_HAZARD');
  }
  if (isActionLineCrossed) {
    activeAlarms.push('WHO_PARTOGRAM_ACTION_LINE_CROSSED_ARREST');
  } else if (isAlertLineCrossed) {
    activeAlarms.push('WHO_PARTOGRAM_ALERT_LINE_CROSSED_PROTRACTION');
  }
  if (isCephalopelvicDisproportion) {
    activeAlarms.push('CEPHALOPELVIC_DISPROPORTION_CPD_SEVERE_MOLDING');
  }
  if (isChorioamnionitisSuspected) {
    activeAlarms.push('INTRAAMNIOTIC_INFECTION_CHORIOAMNIONITIS_ALERT');
  }
  if (amnioticFluid === 'MECONIUM_STAINED') {
    activeAlarms.push('THICK_MECONIUM_ASPIRATION_SURVEILLANCE');
  }
  if (montevideoUnits < 200 && currentHour >= 2) {
    activeAlarms.push('HYPOCONTRACTILE_UTERINE_DYSFUNCTION_LOW_MVU');
  }

  if (activeAlarms.length === 0) {
    activeAlarms.push('LABOR_PROGRESSION_ON_TRACK_PHYSIOLOGIC');
  }

  // 10. Intrauterine Resuscitation
  const intrauterineResuscitationRequired =
    isTachysystole || isHypertonusTetanic || fetalHeartRateBaselineBpm > 160 || fetalHeartRateBaselineBpm < 110;

  // 11. Clinical Guidance
  let clinicalGuidance =
    'Normal labor progression: cervical dilatation matches or exceeds 1.0 cm/h alert line. Continue intermittent auscultation or continuous CTG, encourage maternal ambulation/position changes, and maintain fluid hydration.';

  if (isTachysystole) {
    clinicalGuidance =
      'UTERINE TACHYSYSTOLE RESUSCITATION: Turn off Oxytocin infusion immediately. Administer 500-1000 mL IV Lactated Ringer bolus, reposition to left lateral decubitus, provide high-flow oxygen (10 L/min via non-rebreather). If fetal bradycardia or late decelerations persist, give Subcutaneous Terbutaline 0.25 mg tocolysis.';
  } else if (isChorioamnionitisSuspected) {
    clinicalGuidance =
      'CHORIOAMNIONITIS PROTOCOL: Maternal pyrexia (>= 38.0°C) with fetal tachycardia requires immediate broad-spectrum IV antibiotics (Ampicillin 2g q6h + Gentamicin 5 mg/kg once daily; add Clindamycin/Metronidazole if Cesarean). Accelerate delivery with oxytocin; Cesarean reserved for standard obstetric indications.';
  } else if (isCephalopelvicDisproportion) {
    clinicalGuidance =
      'CEPHALOPELVIC DISPROPORTION (CPD): Grade 3 irreducible cranial molding with arrest of fetal descent indicates anatomical pelvic incompatibility. Do NOT augment with oxytocin (risk of uterine rupture). Prepare patient for urgent Cesarean delivery.';
  } else if (isActionLineCrossed) {
    clinicalGuidance =
      'WHO ACTION LINE CROSSED: Dilatation has fallen 4 hours behind normal expectation. Perform vaginal examination to assess presentation and CPD. If contractions are inadequate (< 200 MVU) and CPD is ruled out, initiate IV Oxytocin augmentation or consider operative delivery if maternal/fetal compromise.';
  } else if (isAlertLineCrossed) {
    clinicalGuidance =
      'WHO ALERT LINE CROSSED: Cervical dilatation rate is < 1 cm/h. Transfer to obstetric care center or consult obstetrician. Evaluate 3 Ps (Passage, Passenger, Powers). Consider artificial rupture of membranes (ARM) if membranes intact, or IUPC placement.';
  }

  return {
    bishopScore,
    isCervixFavorable,
    bishopInterpretation,
    recommendedRipeningAgent,
    currentDilatationCm,
    currentStation,
    dilatationRateCmPerHour,
    isAlertLineCrossed,
    isActionLineCrossed,
    laborProgressionStatus,
    montevideoUnits,
    isTachysystole,
    isHypertonusTetanic,
    isChorioamnionitisSuspected,
    isCephalopelvicDisproportion,
    timeline,
    activeAlarms,
    clinicalGuidance,
    intrauterineResuscitationRequired,
  };
}

/**
 * 8 Standard Validated Clinical Presets for Labor Dynamics
 */
export const LABOR_PRESETS: Record<
  LaborPresetId,
  {
    title: string;
    description: string;
    initialState: LaborPartogramInputParams;
  }
> = {
  NORMAL_ACTIVE_LABOR_FAVORABLE: {
    title: 'Normal Active Labor (Favorable Bishop Score 9)',
    description:
      '26-year-old G1P0 at 39+4 weeks: Bishop score 9 (5cm, 80%, 0 station, soft, anterior), spontaneous contractions 4/10 min, clear fluid, progressing along alert line.',
    initialState: {
      presetId: 'NORMAL_ACTIVE_LABOR_FAVORABLE',
      parity: 'NULLIPARA',
      gestationalAgeWeeks: 39.5,
      currentHour: 3,
      bishop: {
        dilatationCm: 7,
        effacementPct: 80,
        stationFifth: 0,
        consistency: 'SOFT',
        position: 'ANTERIOR',
      },
      uterineContractions: {
        frequencyPer10Min: 4,
        durationSeconds: 45,
        intensityMmhg: 55,
        oxytocinInfusionRateMuMin: 0,
      },
      fetalHeadMolding: 'GRADE_1_TOUCHING',
      caputSuccedaneumScale: 0,
      amnioticFluid: 'CLEAR',
      hoursRupturedMembranes: 3,
      maternalTemperatureCelsius: 36.8,
      fetalHeartRateBaselineBpm: 140,
      hasEpiduralAnalgesia: false,
      dilatationHistory: [
        { hour: 0, dilatationCm: 4, station: -2 },
        { hour: 1, dilatationCm: 5, station: -1 },
        { hour: 2, dilatationCm: 6, station: 0 },
        { hour: 3, dilatationCm: 7, station: 0 },
      ],
    },
  },

  UNFAVORABLE_CERVIX_BISHOP_3_INDUCTION: {
    title: 'Unfavorable Cervix (Bishop Score 3 / Pre-induction Ripening)',
    description:
      '31-year-old G1P0 at 41+2 weeks post-dates: Bishop score 3 (closed, 30% effaced, -3 station, firm, posterior). High failure risk if immediate oxytocin; Dinoprostone PGE2 or Foley balloon indicated.',
    initialState: {
      presetId: 'UNFAVORABLE_CERVIX_BISHOP_3_INDUCTION',
      parity: 'NULLIPARA',
      gestationalAgeWeeks: 41.3,
      currentHour: 0,
      bishop: {
        dilatationCm: 0.5,
        effacementPct: 30,
        stationFifth: -3,
        consistency: 'FIRM',
        position: 'POSTERIOR',
      },
      uterineContractions: {
        frequencyPer10Min: 1,
        durationSeconds: 15,
        intensityMmhg: 20,
        oxytocinInfusionRateMuMin: 0,
      },
      fetalHeadMolding: 'NONE',
      caputSuccedaneumScale: 0,
      amnioticFluid: 'INTACT',
      hoursRupturedMembranes: 0,
      maternalTemperatureCelsius: 36.7,
      fetalHeartRateBaselineBpm: 135,
      hasEpiduralAnalgesia: false,
      dilatationHistory: [{ hour: 0, dilatationCm: 0.5, station: -3 }],
    },
  },

  PROTRACTED_ACTIVE_PHASE_ALERT_LINE_CROSSED: {
    title: 'Protracted Active Phase (WHO Alert Line Crossed)',
    description:
      '24-year-old G1P0 in labor for 6 hours: Cervical dilatation only 5.5 cm (0.25 cm/h), crosses WHO Alert Line, contractions weak at 2/10 min (MVU 90). Oxytocin augmentation indicated.',
    initialState: {
      presetId: 'PROTRACTED_ACTIVE_PHASE_ALERT_LINE_CROSSED',
      parity: 'NULLIPARA',
      gestationalAgeWeeks: 40.0,
      currentHour: 5,
      bishop: {
        dilatationCm: 5.5,
        effacementPct: 70,
        stationFifth: -1,
        consistency: 'MEDIUM',
        position: 'MID_POSITION',
      },
      uterineContractions: {
        frequencyPer10Min: 2,
        durationSeconds: 25,
        intensityMmhg: 35,
        oxytocinInfusionRateMuMin: 2,
      },
      fetalHeadMolding: 'GRADE_1_TOUCHING',
      caputSuccedaneumScale: 1,
      amnioticFluid: 'CLEAR',
      hoursRupturedMembranes: 5,
      maternalTemperatureCelsius: 37.0,
      fetalHeartRateBaselineBpm: 145,
      hasEpiduralAnalgesia: true,
      dilatationHistory: [
        { hour: 0, dilatationCm: 4, station: -2 },
        { hour: 2, dilatationCm: 4.5, station: -2 },
        { hour: 4, dilatationCm: 5.0, station: -1 },
        { hour: 5, dilatationCm: 5.5, station: -1 },
      ],
    },
  },

  ARREST_OF_DILATATION_ACTION_LINE: {
    title: 'Secondary Arrest of Dilatation (WHO Action Line Crossed)',
    description:
      '28-year-old G1P0 stalled at 6.0 cm for 4 hours despite amniotomy and adequate oxytocin (MVU 240). Crosses WHO Action Line, requiring obstetric decision for surgical delivery.',
    initialState: {
      presetId: 'ARREST_OF_DILATATION_ACTION_LINE',
      parity: 'NULLIPARA',
      gestationalAgeWeeks: 39.2,
      currentHour: 7,
      bishop: {
        dilatationCm: 6.0,
        effacementPct: 80,
        stationFifth: 0,
        consistency: 'SOFT',
        position: 'ANTERIOR',
      },
      uterineContractions: {
        frequencyPer10Min: 4,
        durationSeconds: 50,
        intensityMmhg: 60,
        oxytocinInfusionRateMuMin: 12,
      },
      fetalHeadMolding: 'GRADE_2_REDUCIBLE',
      caputSuccedaneumScale: 2,
      amnioticFluid: 'CLEAR',
      hoursRupturedMembranes: 8,
      maternalTemperatureCelsius: 37.2,
      fetalHeartRateBaselineBpm: 150,
      hasEpiduralAnalgesia: true,
      dilatationHistory: [
        { hour: 0, dilatationCm: 4, station: -2 },
        { hour: 2, dilatationCm: 5.5, station: -1 },
        { hour: 3, dilatationCm: 6.0, station: 0 },
        { hour: 5, dilatationCm: 6.0, station: 0 },
        { hour: 7, dilatationCm: 6.0, station: 0 },
      ],
    },
  },

  CEPHALOPELVIC_DISPROPORTION_CPD_ARREST_DESCENT: {
    title: 'Cephalopelvic Disproportion (CPD & Severe Grade 3 Molding)',
    description:
      '32-year-old G1P0 fully dilated (10 cm) pushing for 2 hours: Fetal head arrested at 0 station, Grade 3 irreducible cranial bone overlap, severe caput succedaneum (+3). Contraindication to vacuum; Cesarean section required.',
    initialState: {
      presetId: 'CEPHALOPELVIC_DISPROPORTION_CPD_ARREST_DESCENT',
      parity: 'NULLIPARA',
      gestationalAgeWeeks: 40.4,
      currentHour: 8,
      bishop: {
        dilatationCm: 10,
        effacementPct: 100,
        stationFifth: 0,
        consistency: 'SOFT',
        position: 'ANTERIOR',
      },
      uterineContractions: {
        frequencyPer10Min: 5,
        durationSeconds: 55,
        intensityMmhg: 65,
        oxytocinInfusionRateMuMin: 8,
      },
      fetalHeadMolding: 'GRADE_3_IRREDUCIBLE',
      caputSuccedaneumScale: 3,
      amnioticFluid: 'CLEAR',
      hoursRupturedMembranes: 9,
      maternalTemperatureCelsius: 37.4,
      fetalHeartRateBaselineBpm: 155,
      hasEpiduralAnalgesia: true,
      dilatationHistory: [
        { hour: 0, dilatationCm: 4, station: -2 },
        { hour: 2, dilatationCm: 6, station: -1 },
        { hour: 4, dilatationCm: 8, station: 0 },
        { hour: 6, dilatationCm: 10, station: 0 },
        { hour: 8, dilatationCm: 10, station: 0 },
      ],
    },
  },

  OXYTOCIN_INDUCED_TACHYSYSTOLE_HYPERSTIMULATION: {
    title: 'Oxytocin Tachysystole & Uterine Hyperstimulation',
    description:
      '29-year-old receiving high-dose oxytocin (24 mU/min): 7 contractions per 10 minutes lasting 75 seconds, resting tone elevated, recurrent late decelerations. Immediate oxytocin cessation and tocolysis bundle.',
    initialState: {
      presetId: 'OXYTOCIN_INDUCED_TACHYSYSTOLE_HYPERSTIMULATION',
      parity: 'NULLIPARA',
      gestationalAgeWeeks: 39.0,
      currentHour: 4,
      bishop: {
        dilatationCm: 6.5,
        effacementPct: 90,
        stationFifth: 0,
        consistency: 'SOFT',
        position: 'ANTERIOR',
      },
      uterineContractions: {
        frequencyPer10Min: 7,
        durationSeconds: 75,
        intensityMmhg: 70,
        oxytocinInfusionRateMuMin: 24,
      },
      fetalHeadMolding: 'GRADE_1_TOUCHING',
      caputSuccedaneumScale: 1,
      amnioticFluid: 'CLEAR',
      hoursRupturedMembranes: 4,
      maternalTemperatureCelsius: 37.1,
      fetalHeartRateBaselineBpm: 165,
      hasEpiduralAnalgesia: true,
      dilatationHistory: [
        { hour: 0, dilatationCm: 4, station: -2 },
        { hour: 2, dilatationCm: 5, station: -1 },
        { hour: 4, dilatationCm: 6.5, station: 0 },
      ],
    },
  },

  CHORIOAMNIONITIS_PROLONGED_RUPTURE: {
    title: 'Intra-Amniotic Infection (Chorioamnionitis & PROM > 18h)',
    description:
      '22-year-old with rupture of membranes for 22 hours: Maternal fever 38.6°C, maternal pulse 115 bpm, fetal tachycardia 175 bpm, foul-smelling amniotic fluid. Emergency IV Ampicillin + Gentamicin indicated.',
    initialState: {
      presetId: 'CHORIOAMNIONITIS_PROLONGED_RUPTURE',
      parity: 'NULLIPARA',
      gestationalAgeWeeks: 38.5,
      currentHour: 6,
      bishop: {
        dilatationCm: 5.0,
        effacementPct: 70,
        stationFifth: -1,
        consistency: 'MEDIUM',
        position: 'MID_POSITION',
      },
      uterineContractions: {
        frequencyPer10Min: 3,
        durationSeconds: 40,
        intensityMmhg: 45,
        oxytocinInfusionRateMuMin: 6,
      },
      fetalHeadMolding: 'GRADE_1_TOUCHING',
      caputSuccedaneumScale: 1,
      amnioticFluid: 'MECONIUM_STAINED',
      hoursRupturedMembranes: 22,
      maternalTemperatureCelsius: 38.6,
      fetalHeartRateBaselineBpm: 175,
      hasEpiduralAnalgesia: false,
      dilatationHistory: [
        { hour: 0, dilatationCm: 4, station: -2 },
        { hour: 3, dilatationCm: 4.5, station: -2 },
        { hour: 6, dilatationCm: 5.0, station: -1 },
      ],
    },
  },

  PRECIPITOUS_LABOR_MULTIPARA: {
    title: 'Precipitous Labor (Multipara Dilating > 4 cm/h)',
    description:
      '34-year-old G4P3 presenting at 4 cm, fully dilated within 75 minutes with spontaneous intense contractions. High risk of maternal genital lacerations and neonatal respiratory transition challenges.',
    initialState: {
      presetId: 'PRECIPITOUS_LABOR_MULTIPARA',
      parity: 'MULTIPARA',
      gestationalAgeWeeks: 39.3,
      currentHour: 2,
      bishop: {
        dilatationCm: 9.5,
        effacementPct: 100,
        stationFifth: 2,
        consistency: 'SOFT',
        position: 'ANTERIOR',
      },
      uterineContractions: {
        frequencyPer10Min: 5,
        durationSeconds: 60,
        intensityMmhg: 70,
        oxytocinInfusionRateMuMin: 0,
      },
      fetalHeadMolding: 'GRADE_1_TOUCHING',
      caputSuccedaneumScale: 0,
      amnioticFluid: 'CLEAR',
      hoursRupturedMembranes: 1,
      maternalTemperatureCelsius: 37.0,
      fetalHeartRateBaselineBpm: 145,
      hasEpiduralAnalgesia: false,
      dilatationHistory: [
        { hour: 0, dilatationCm: 4, station: 0 },
        { hour: 1, dilatationCm: 7, station: 1 },
        { hour: 2, dilatationCm: 9.5, station: 2 },
      ],
    },
  },
};
