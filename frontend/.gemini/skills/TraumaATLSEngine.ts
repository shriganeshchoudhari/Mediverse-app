/**
 * TraumaATLSEngine.ts
 * Mediverse — Trauma & ATLS Primary Survey Biophysical Engine
 *
 * Models:
 * - ATLS Hemorrhagic Shock Classification (Class I–IV)
 * - FAST / eFAST Exam (Morison's pouch, splenorenal, pericardial, bilateral pleural)
 * - Massive Transfusion Protocol (MTP) — 1:1:1 pRBC:FFP:Platelet ratio
 * - Permissive Hypotension (MAP target 50 mmHg until hemorrhage control)
 * - Damage Control Surgery decision tree
 * - Tension Pneumothorax and Cardiac Tamponade (Beck's triad)
 * - Parkland burn co-injury fluid kinetics
 * - FAST-positive peritoneal / pericardial findings
 */

// ─── Enums ──────────────────────────────────────────────────────────────────

export type ShockClass = 'CLASS_I' | 'CLASS_II' | 'CLASS_III' | 'CLASS_IV';

export type TraumaAlarm =
  | 'OPTIMAL'
  | 'HEMORRHAGIC_SHOCK_II'
  | 'HEMORRHAGIC_SHOCK_III'
  | 'HEMORRHAGIC_SHOCK_IV'
  | 'TENSION_PNEUMOTHORAX'
  | 'CARDIAC_TAMPONADE'
  | 'OPEN_PNEUMOTHORAX'
  | 'MASSIVE_HEMOTHORAX'
  | 'HYPOTHERMIA_COAGULOPATHY'
  | 'ACIDOSIS_BASE_DEFICIT'
  | 'MTP_ACTIVATED'
  | 'DAMAGE_CONTROL_INDICATED'
  | 'PERMISSIVE_HYPOTENSION_ACTIVE';

export type FASTView =
  | 'MORISON_POUCH'
  | 'SPLENORENAL'
  | 'PELVIC_POUCH_OF_DOUGLAS'
  | 'PERICARDIAL_SUBXIPHOID'
  | 'RIGHT_PLEURAL'
  | 'LEFT_PLEURAL';

export type FASTResult = 'NEGATIVE' | 'EQUIVOCAL' | 'POSITIVE';

export type AirwayStatus = 'PATENT' | 'AT_RISK' | 'COMPROMISED';
export type BreathingStatus = 'ADEQUATE' | 'TENSION_PTX' | 'OPEN_PTX' | 'MASSIVE_HEMOTHORAX' | 'FLAIL_CHEST';
export type CirculationStatus = 'STABLE' | 'HEMORRHAGIC_SHOCK' | 'TAMPONADE' | 'EXSANGUINATING';
export type NeurologicStatus = 'ALERT' | 'VERBAL' | 'PAIN' | 'UNRESPONSIVE';

export type PresetId =
  | 'PENETRATING_ABDOMINAL'
  | 'BLUNT_THORACIC'
  | 'TENSION_PNEUMOTHORAX'
  | 'CARDIAC_TAMPONADE'
  | 'POLYTRAUMA_CLASS_IV'
  | 'PELVIC_RING_DISRUPTION';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface FASTFinding {
  view: FASTView;
  result: FASTResult;
  fluidDepthMm: number; // 0 = none, >5 mm = significant
  description: string;
}

export interface MTPState {
  activated: boolean;
  prbcUnitsGiven: number;
  ffpUnitsGiven: number;
  plateletsUnitsGiven: number;
  cryoprecipitateUnitsGiven: number;
  txa1gGiven: boolean; // Tranexamic acid within 3h of injury
  fibrinogenMgDl: number; // target >200 mg/dL
  calciumMeqL: number; // ionized calcium, critical during massive transfusion
}

export interface TraumaState {
  // Vital signs
  hrBpm: number;
  sbpMmHg: number;
  dbpMmHg: number;
  mapMmHg: number;
  rrPerMin: number;
  gcs: number; // Glasgow Coma Scale 3–15
  spo2Pct: number;
  tempCelsius: number;

  // Hemorrhage quantification
  estimatedBloodLossML: number;
  bloodLossPct: number; // % of ~5000 mL EBV
  shockClass: ShockClass;
  shockIndex: number; // HR / SBP — >1.0 critical

  // Lab / coagulation
  hemoglobinGdL: number;
  lactateMmolL: number;
  baseDeficitMeqL: number; // negative = worsening acidosis
  inrCoag: number; // >1.5 = coagulopathic
  fibrinogenMgDl: number;
  ionizedCalciumMmolL: number;

  // Primary survey ABCDE
  airway: AirwayStatus;
  breathing: BreathingStatus;
  circulation: CirculationStatus;
  neurology: NeurologicStatus;
  exposureHypothermia: boolean; // environment exposure causing hypothermia

  // FAST exam
  fastFindings: FASTFinding[];
  fastPositive: boolean; // any view with POSITIVE result

  // MTP
  mtp: MTPState;

  // Decision support
  permissiveHypotensionActive: boolean; // MAP target 50 mmHg pre-hemorrhage control
  damageControlIndicated: boolean; // pH<7.2 + Temp<35°C + INR>1.5 (lethal triad)
  needsEmergencyThoracotomy: boolean;

  activeAlarms: TraumaAlarm[];
}

export interface PresetInfo {
  id: PresetId;
  title: string;
  description: string;
  mechanism: string;
  primarySurveyFinding: string;
  initialState: Partial<TraumaInputParams>;
}

export interface TraumaInputParams {
  estimatedBloodLossML: number; // 0–5000+ mL
  hasTensionPneumothorax: boolean;
  hasCardiacTamponade: boolean;
  hasOpenPneumothorax: boolean;
  hasMassiveHemothorax: boolean;
  hasFlailChest: boolean;
  hasPelvicRingDisruption: boolean;
  gcsPenalty: number; // subtracted from baseline 15
  mtpActivated: boolean;
  permissiveHypotensionEnabled: boolean;
  fastPositiveViews: FASTView[];
  tempCelsius: number; // 37.0 default
  tbsaBurnPct: number; // 0 if no burn co-injury
}

// ─── Constants ───────────────────────────────────────────────────────────────

const EBV_ML = 5000; // Estimated Blood Volume for 70 kg adult

// ATLS Hemorrhagic Shock Classification
const SHOCK_CLASSES: Record<ShockClass, { minLossMl: number; maxLossMl: number; hrRange: [number, number]; sbpRange: [number, number]; baseDeficit: [number, number]; gcsMeta: string }> = {
  CLASS_I:   { minLossMl: 0,    maxLossMl: 750,  hrRange: [60, 100],  sbpRange: [110, 140], baseDeficit: [-2, 0],   gcsMeta: 'Normal' },
  CLASS_II:  { minLossMl: 750,  maxLossMl: 1500, hrRange: [100, 120], sbpRange: [90, 110],  baseDeficit: [-6, -2],  gcsMeta: 'Anxious' },
  CLASS_III: { minLossMl: 1500, maxLossMl: 2000, hrRange: [120, 140], sbpRange: [70, 90],   baseDeficit: [-10, -6], gcsMeta: 'Confused' },
  CLASS_IV:  { minLossMl: 2000, maxLossMl: 5000, hrRange: [140, 180], sbpRange: [50, 70],   baseDeficit: [-15, -10],gcsMeta: 'Lethargic/Unresponsive' },
};

// ─── Preset Catalog ──────────────────────────────────────────────────────────

export const TRAUMA_PRESETS: Record<PresetId, PresetInfo> = {
  PENETRATING_ABDOMINAL: {
    id: 'PENETRATING_ABDOMINAL',
    title: 'Penetrating Abdominal Trauma (GSW)',
    description: 'Gunshot wound to left upper quadrant. FAST positive: Morison\'s pouch + splenorenal free fluid. ATLS Class III hemorrhagic shock.',
    mechanism: 'Penetrating — high-velocity projectile (9mm GSW to LUQ)',
    primarySurveyFinding: 'C — Circulation: HR 134, BP 84/56. FAST: LUQ free fluid, Morrison\'s pouch fluid. Activate MTP.',
    initialState: { estimatedBloodLossML: 1700, fastPositiveViews: ['MORISON_POUCH', 'SPLENORENAL'], mtpActivated: true, permissiveHypotensionEnabled: true },
  },
  BLUNT_THORACIC: {
    id: 'BLUNT_THORACIC',
    title: 'Blunt Thoracic Trauma — Massive Hemothorax',
    description: 'High-speed MVC. Massive hemothorax (>1500 mL) with right-sided dullness to percussion. Class III shock. Immediate chest tube.',
    mechanism: 'Blunt — high-speed MVC, steering wheel compression fracturing ribs 4–8',
    primarySurveyFinding: 'B — Breathing: absent R breath sounds, dull percussion. C: tachycardia HR 128, hypotension BP 78/52.',
    initialState: { estimatedBloodLossML: 1600, hasMassiveHemothorax: true, mtpActivated: true, permissiveHypotensionEnabled: true },
  },
  TENSION_PNEUMOTHORAX: {
    id: 'TENSION_PNEUMOTHORAX',
    title: 'Tension Pneumothorax — Needle Decompression',
    description: 'Intubated trauma patient with sudden hemodynamic collapse. Tracheal deviation to left, absent right breath sounds, distended neck veins. Immediate needle decompression 2nd ICS MCL.',
    mechanism: 'Blunt/iatrogenic — 1-way valve air leak collapses lung, mediastinal shift compresses contralateral lung and great veins',
    primarySurveyFinding: 'B — Breathing: absent R breath sounds, tracheal deviation. C: HR 148, BP 62/40, JVD present.',
    initialState: { hasTensionPneumothorax: true, estimatedBloodLossML: 800, gcsPenalty: 5 },
  },
  CARDIAC_TAMPONADE: {
    id: 'CARDIAC_TAMPONADE',
    title: 'Cardiac Tamponade — Beck\'s Triad',
    description: 'Stab wound to left chest. Beck\'s triad: JVD + muffled heart sounds + hypotension. FAST: pericardial fluid. Emergency pericardiocentesis or thoracotomy.',
    mechanism: 'Penetrating — stab wound zone 3 cardiac box (medial to nipples, below clavicles, above costal margin)',
    primarySurveyFinding: 'C — Circulation: Beck\'s triad present. FAST: pericardial effusion anechoic stripe >20mm. HR 118, BP 72/60.',
    initialState: { hasCardiacTamponade: true, estimatedBloodLossML: 400, fastPositiveViews: ['PERICARDIAL_SUBXIPHOID'] },
  },
  POLYTRAUMA_CLASS_IV: {
    id: 'POLYTRAUMA_CLASS_IV',
    title: 'Polytrauma — ATLS Class IV Exsanguinating Hemorrhage',
    description: 'High-speed rollover MVC. Multi-cavity hemorrhage. Class IV shock. Lethal triad emerging. Massive transfusion protocol. Damage control surgery.',
    mechanism: 'Blunt — high-energy rollover MVC with splenic laceration, grade IV liver, open femur fracture',
    primarySurveyFinding: 'C — Exsanguinating. HR 168, BP 54/32, GCS 9. FAST positive all 3 abdominal windows. Temp 34.8°C. pH 7.18.',
    initialState: { estimatedBloodLossML: 2800, fastPositiveViews: ['MORISON_POUCH','SPLENORENAL','PELVIC_POUCH_OF_DOUGLAS'], mtpActivated: true, permissiveHypotensionEnabled: true, tempCelsius: 34.8, gcsPenalty: 6 },
  },
  PELVIC_RING_DISRUPTION: {
    id: 'PELVIC_RING_DISRUPTION',
    title: 'Open Book Pelvic Ring Disruption — Pelvic Binder',
    description: 'Motorcyclist ejected at 60 mph. Open book pelvic fracture (pubic symphysis >2.5 cm diastasis). Massive retroperitoneal hematoma. Pelvic binder + REBOA Zone III.',
    mechanism: 'Blunt — anterior-posterior compression mechanism causing pubic symphysis diastasis + sacroiliac disruption',
    primarySurveyFinding: 'C — Pelvic ring unstable on spring test. Retroperitoneal expansion. HR 140, BP 78/48. FAST: pelvic free fluid.',
    initialState: { estimatedBloodLossML: 2200, hasPelvicRingDisruption: true, fastPositiveViews: ['PELVIC_POUCH_OF_DOUGLAS'], mtpActivated: true, permissiveHypotensionEnabled: true },
  },
};

// Alias for external consumers
export const ATLS_PRESETS = TRAUMA_PRESETS;
export type ATLSPresetId = PresetId;
export type ATLSPresetInfo = PresetInfo;

// ─── Solver ───────────────────────────────────────────────────────────────────

function classifyShock(bloodLossMl: number): ShockClass {
  if (bloodLossMl < 750)  return 'CLASS_I';
  if (bloodLossMl < 1500) return 'CLASS_II';
  if (bloodLossMl < 2000) return 'CLASS_III';
  return 'CLASS_IV';
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function buildFASTFindings(positiveViews: FASTView[]): FASTFinding[] {
  const views: { view: FASTView; label: string; normalDesc: string; positiveDesc: string }[] = [
    { view: 'MORISON_POUCH',          label: "Morison's Pouch (RUQ)",   normalDesc: 'No free fluid between liver and right kidney', positiveDesc: 'Anechoic stripe >5 mm — hepatorenal free fluid (hemoperitoneum)' },
    { view: 'SPLENORENAL',            label: 'Splenorenal (LUQ)',       normalDesc: 'No free fluid between spleen and left kidney', positiveDesc: 'Anechoic collection — splenorenal hemoperitoneum (splenic laceration)' },
    { view: 'PELVIC_POUCH_OF_DOUGLAS',label: 'Pelvis (Douglas Pouch)', normalDesc: 'No free fluid in cul-de-sac', positiveDesc: 'Anechoic fluid in rectovesical / pouch of Douglas — pelvic hemoperitoneum' },
    { view: 'PERICARDIAL_SUBXIPHOID', label: 'Pericardial (Subxiphoid)',normalDesc: 'No pericardial effusion, thin fibrous stripe only', positiveDesc: 'Anechoic stripe >20 mm around right ventricle — hemopericardium / tamponade physiology' },
    { view: 'RIGHT_PLEURAL',          label: 'Right Pleural',           normalDesc: 'Lung sliding present, mirror artifact intact',  positiveDesc: 'Fluid stripe above diaphragm — hemothorax (>200 mL detectable)' },
    { view: 'LEFT_PLEURAL',           label: 'Left Pleural',            normalDesc: 'Lung sliding present, mirror artifact intact',  positiveDesc: 'Fluid stripe above diaphragm — left hemothorax' },
  ];

  return views.map(v => {
    const isPositive = positiveViews.includes(v.view);
    return {
      view: v.view,
      result: isPositive ? 'POSITIVE' : 'NEGATIVE',
      fluidDepthMm: isPositive ? Math.round(8 + Math.random() * 14) : 0,
      description: isPositive ? v.positiveDesc : v.normalDesc,
    };
  });
}

export function computeTraumaState(params: TraumaInputParams): TraumaState {
  const {
    estimatedBloodLossML,
    hasTensionPneumothorax,
    hasCardiacTamponade,
    hasOpenPneumothorax,
    hasMassiveHemothorax,
    hasFlailChest,
    hasPelvicRingDisruption,
    gcsPenalty,
    mtpActivated,
    permissiveHypotensionEnabled,
    fastPositiveViews,
    tempCelsius,
  } = params;

  const shockClass = classifyShock(estimatedBloodLossML);
  const cls = SHOCK_CLASSES[shockClass];
  const bloodLossPct = (estimatedBloodLossML / EBV_ML) * 100;

  // Normalize loss within class for interpolation
  const classRange = cls.maxLossMl - cls.minLossMl;
  const t = classRange > 0 ? (estimatedBloodLossML - cls.minLossMl) / classRange : 1;

  let hrBpm   = Math.round(lerp(cls.hrRange[0],  cls.hrRange[1],  t));
  let sbpMmHg = Math.round(lerp(cls.sbpRange[0], cls.sbpRange[1], t));

  // Tension pneumo: obstructive shock → raised JVP + cardiovascular collapse
  if (hasTensionPneumothorax) {
    hrBpm   = Math.max(hrBpm,   148);
    sbpMmHg = Math.min(sbpMmHg,  68);
  }

  // Cardiac tamponade: narrow pulse pressure (Beck's triad)
  if (hasCardiacTamponade) {
    hrBpm   = Math.max(hrBpm,   118);
    sbpMmHg = Math.min(sbpMmHg,  76);
  }

  // Permissive hypotension strategy: allow SBP ~70 / MAP ~50 pre-hemorrhage control
  if (permissiveHypotensionEnabled && (shockClass === 'CLASS_III' || shockClass === 'CLASS_IV')) {
    sbpMmHg = Math.min(sbpMmHg, 76);
  }

  const dbpMmHg   = Math.round(sbpMmHg * 0.62);
  const mapMmHg   = Math.round((sbpMmHg + 2 * dbpMmHg) / 3);
  const shockIndex = hrBpm / (sbpMmHg || 1);

  // Respiratory rate worsens with hemorrhage / pneumothorax
  let rrPerMin = 16 + Math.round((bloodLossPct / 100) * 20);
  if (hasTensionPneumothorax || hasMassiveHemothorax) rrPerMin = Math.max(rrPerMin, 30);
  rrPerMin = Math.min(rrPerMin, 40);

  // GCS
  const gcsPenaltyTotal = gcsPenalty + (shockClass === 'CLASS_IV' ? 4 : shockClass === 'CLASS_III' ? 2 : 0);
  const gcs = Math.max(3, 15 - gcsPenaltyTotal);

  // SpO2
  let spo2Pct = 98;
  if (hasTensionPneumothorax) spo2Pct = 80;
  else if (hasMassiveHemothorax) spo2Pct = 86;
  else if (hasOpenPneumothorax)  spo2Pct = 88;
  else if (hasFlailChest)        spo2Pct = 90;
  else if (shockClass === 'CLASS_IV') spo2Pct = 92;

  // Labs
  const hemoglobinGdL = Math.max(4, 14 - (bloodLossPct / 100) * 10);
  const lactateMmolL  = parseFloat((1.2 + (bloodLossPct / 100) * 12).toFixed(1));
  const baseDeficit   = parseFloat(lerp(cls.baseDeficit[0], cls.baseDeficit[1], t).toFixed(1));
  const inrCoag = mtpActivated ? 1.3 : Math.max(1.0, 1.0 + (bloodLossPct / 100) * 1.2 + (tempCelsius < 35 ? 0.4 : 0));
  const fibrinogenMgDl = Math.max(80, 400 - (bloodLossPct / 100) * 320 - (tempCelsius < 35 ? 80 : 0));
  const ionizedCalciumMmolL = mtpActivated ? Math.max(0.8, 1.15 - 0.04 * (params.mtpActivated ? 4 : 0)) : 1.15;

  // Airway
  const airway: AirwayStatus = gcs <= 8 ? 'COMPROMISED' : gcs <= 11 ? 'AT_RISK' : 'PATENT';

  // Breathing
  let breathing: BreathingStatus = 'ADEQUATE';
  if (hasTensionPneumothorax) breathing = 'TENSION_PTX';
  else if (hasOpenPneumothorax) breathing = 'OPEN_PTX';
  else if (hasMassiveHemothorax) breathing = 'MASSIVE_HEMOTHORAX';
  else if (hasFlailChest) breathing = 'FLAIL_CHEST';

  // Circulation
  let circulation: CirculationStatus = 'STABLE';
  if (hasCardiacTamponade) circulation = 'TAMPONADE';
  else if (shockClass === 'CLASS_IV') circulation = 'EXSANGUINATING';
  else if (shockClass === 'CLASS_II' || shockClass === 'CLASS_III') circulation = 'HEMORRHAGIC_SHOCK';

  // Neurology
  let neurology: NeurologicStatus = 'ALERT';
  if (gcs <= 8) neurology = 'UNRESPONSIVE';
  else if (gcs <= 10) neurology = 'PAIN';
  else if (gcs <= 13) neurology = 'VERBAL';

  // Lethal triad: Hypothermia + Acidosis + Coagulopathy
  const lethalTriad = tempCelsius < 35 && baseDeficit < -6 && inrCoag > 1.5;

  // MTP state
  const mtp: MTPState = {
    activated: mtpActivated,
    prbcUnitsGiven: mtpActivated ? 6 : 0,
    ffpUnitsGiven: mtpActivated ? 6 : 0,
    plateletsUnitsGiven: mtpActivated ? 1 : 0, // 1 apheresis unit = 6 pooled
    cryoprecipitateUnitsGiven: fibrinogenMgDl < 200 ? 10 : 0,
    txa1gGiven: mtpActivated && estimatedBloodLossML > 1000,
    fibrinogenMgDl,
    calciumMeqL: ionizedCalciumMmolL * 2, // mEq/L ≈ 2 × mmol/L for Ca2+
  };

  // FAST
  const fastFindings = buildFASTFindings(fastPositiveViews);
  const fastPositive = fastFindings.some(f => f.result === 'POSITIVE');

  // Damage control surgery indication
  const damageControlIndicated = lethalTriad || estimatedBloodLossML > 2500;
  const needsEmergencyThoracotomy = hasCardiacTamponade && sbpMmHg < 60;

  // Alarms
  const activeAlarms: TraumaAlarm[] = [];
  if (hasTensionPneumothorax) activeAlarms.push('TENSION_PNEUMOTHORAX');
  if (hasCardiacTamponade)    activeAlarms.push('CARDIAC_TAMPONADE');
  if (hasOpenPneumothorax)    activeAlarms.push('OPEN_PNEUMOTHORAX');
  if (hasMassiveHemothorax)   activeAlarms.push('MASSIVE_HEMOTHORAX');
  if (shockClass === 'CLASS_II')  activeAlarms.push('HEMORRHAGIC_SHOCK_II');
  if (shockClass === 'CLASS_III') activeAlarms.push('HEMORRHAGIC_SHOCK_III');
  if (shockClass === 'CLASS_IV')  activeAlarms.push('HEMORRHAGIC_SHOCK_IV');
  if (tempCelsius < 35)           activeAlarms.push('HYPOTHERMIA_COAGULOPATHY');
  if (baseDeficit < -6)           activeAlarms.push('ACIDOSIS_BASE_DEFICIT');
  if (mtpActivated)               activeAlarms.push('MTP_ACTIVATED');
  if (damageControlIndicated)     activeAlarms.push('DAMAGE_CONTROL_INDICATED');
  if (permissiveHypotensionEnabled && shockClass !== 'CLASS_I') activeAlarms.push('PERMISSIVE_HYPOTENSION_ACTIVE');
  if (activeAlarms.length === 0)  activeAlarms.push('OPTIMAL');

  return {
    hrBpm,
    sbpMmHg,
    dbpMmHg,
    mapMmHg,
    rrPerMin,
    gcs,
    spo2Pct,
    tempCelsius,
    estimatedBloodLossML,
    bloodLossPct,
    shockClass,
    shockIndex: parseFloat(shockIndex.toFixed(2)),
    hemoglobinGdL: parseFloat(hemoglobinGdL.toFixed(1)),
    lactateMmolL,
    baseDeficitMeqL: baseDeficit,
    inrCoag: parseFloat(inrCoag.toFixed(2)),
    fibrinogenMgDl: Math.round(fibrinogenMgDl),
    ionizedCalciumMmolL: parseFloat(ionizedCalciumMmolL.toFixed(2)),
    airway,
    breathing,
    circulation,
    neurology,
    exposureHypothermia: tempCelsius < 35,
    fastFindings,
    fastPositive,
    mtp,
    permissiveHypotensionActive: permissiveHypotensionEnabled && shockClass !== 'CLASS_I',
    damageControlIndicated,
    needsEmergencyThoracotomy,
    activeAlarms,
  };
}
